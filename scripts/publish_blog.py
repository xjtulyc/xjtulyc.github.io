#!/usr/bin/env python3
"""Validate bilingual source JSON and render plain HTML. No dependencies or network.

Run from any directory; --check verifies generated files without writing them.
This is an editorial helper, not a deployment build: GitHub Pages serves the HTML.
"""
import argparse
from datetime import date, datetime
from html import escape, unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / 'blog'
DOMAIN = 'https://youchengli.com/'
LANGUAGES = ('zh', 'en')
LABELS = {
    'zh': {'technical': '技术博客', 'business': '商业判断', 'toc': '本文目录',
           'sources': '参考资料', 'accessed': '查阅', 'updated': '更新', 'back': '返回博客'},
    'en': {'technical': 'Technical Notes', 'business': 'Business Perspectives', 'toc': 'Contents',
           'sources': 'Sources', 'accessed': 'Accessed', 'updated': 'Updated', 'back': 'Back to blog'},
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def plain(value):
    return isinstance(value, str) and value.strip() and not re.search(r'<[^>]+>', value)


class BodyValidator(HTMLParser):
    allowed = set('p h2 h3 ul ol li strong em a pre code table thead tbody tr th td figure img figcaption blockquote div span sub sup hr br'.split())
    void = {'img', 'hr', 'br'}
    attrs = set('id class href target rel src alt width height loading scope colspan rowspan start type title aria-label'.split())

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.ids, self.anchors = [], set(), []
        self.figures = self.images = self.headings = 0

    def handle_starttag(self, tag, attrs):
        require(tag in self.allowed, 'Unsupported article HTML element: ' + tag)
        values = dict(attrs)
        require(all(key in self.attrs for key in values), 'Unsupported article HTML attribute')
        for key in ('href', 'src'):
            if key not in values:
                continue
            url = values[key] or ''
            require(url.startswith('https://') or (key == 'href' and url.startswith('#')) or
                    (key == 'src' and re.fullmatch(r'assets/[a-zA-Z0-9_.-]+', url)), 'Unsafe URL: ' + url)
            if url.startswith('#'):
                self.anchors.append(url[1:])
        if 'id' in values:
            require(re.fullmatch(r'[A-Za-z][\w-]*', values['id']) and values['id'] not in self.ids,
                    'Duplicate or invalid article anchor')
            self.ids.add(values['id'])
        if tag == 'figure':
            self.figures += 1
        if tag == 'h2':
            self.headings += 1
        if tag == 'img':
            self.images += 1
            require(plain(values.get('alt')), 'Every image needs meaningful alt text')
            require('src' in values, 'Image is missing src')
            if values['src'].startswith('assets/'):
                path = BLOG / values['src']
                require(path.is_file() and path.resolve().is_relative_to(BLOG.resolve()), 'Missing local figure: ' + str(path))
                require(path.stat().st_size <= 500_000, 'Large media should use an external link: ' + str(path))
                if path.suffix == '.svg':
                    ET.parse(path)
                    require(not re.search(r'<(?:script|foreignObject)\b|\bon\w+\s*=|(?:href|src)\s*=\s*[\"\'](?:https?:|data:)', path.read_text(), re.I), 'SVG contains active or external content')
        if tag not in self.void:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        require(self.stack and self.stack[-1] == tag, 'Unbalanced HTML near </' + tag + '>')
        self.stack.pop()

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.void:
            self.handle_endtag(tag)

    def finish(self):
        require(not self.stack, 'Unclosed article HTML')
        require(self.headings >= 3, 'Article needs substantive sections')
        require(self.figures >= 1 and self.images >= 1, 'Article needs at least one explanatory figure')
        require(all(anchor in self.ids for anchor in self.anchors), 'Broken article anchor')


def validate(path):
    post = json.loads(path.read_text())
    require(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', post.get('slug', '')) and path.stem == post['slug'], 'Invalid slug / filename')
    require(post.get('category') in ('technical', 'business'), 'Invalid category')
    published = date.fromisoformat(post['date'])
    modified = date.fromisoformat(post.get('updated', post['date']))
    require(modified >= published, 'Modification date predates publication')
    require(modified <= datetime.now(ZoneInfo('Asia/Shanghai')).date(), 'Future publication date')
    require(set(post['translations']) == set(LANGUAGES), 'Both complete languages are required')
    for lang in LANGUAGES:
        entry = post['translations'][lang]
        require(all(plain(entry.get(key)) for key in ('title', 'summary')), 'Missing plain title/summary')
        require(isinstance(entry.get('tags'), list) and all(plain(tag) for tag in entry['tags']), 'Invalid tags')
        require(isinstance(entry.get('body'), str) and len(entry['body']) > 1200, 'Incomplete article body')
        validator = BodyValidator()
        validator.feed(entry['body'])
        validator.close()
        validator.finish()
    require(isinstance(post.get('sources'), list) and len(post['sources']) >= 2, 'At least two verified primary sources required')
    for source in post['sources']:
        require(plain(source.get('title')) and source.get('url', '').startswith('https://'), 'Invalid source')
        date.fromisoformat(source['accessed'])
    return post


def prose_and_toc(body, lang):
    toc = []
    counter = 0

    def heading(match):
        nonlocal counter
        counter += 1
        attrs, text = match.groups()
        existing = re.search(r'\bid=[\"\']([^\"\']+)[\"\']', attrs)
        key = existing.group(1) if existing else 'section-' + str(counter)
        if not existing:
            attrs += ' id="' + key + '"'
        toc.append('<li><a href="#' + lang + '-' + key + '">' + escape(unescape(re.sub('<[^>]+>', '', text))) + '</a></li>')
        return '<h2' + attrs + '>' + text + '</h2>'

    body = re.sub(r'<h2([^>]*)>(.*?)</h2>', heading, body, flags=re.S)
    body = re.sub(r'\bid=([\"\'])([^\"\']+)\1', lambda m: 'id="' + lang + '-' + m[2] + '"', body)
    body = re.sub(r'\bhref=([\"\'])#([^\"\']+)\1', lambda m: 'href="#' + lang + '-' + m[2] + '"', body)
    body = re.sub(r'(<table\b.*?</table>)', r'<div class="table-scroll">\1</div>', body, flags=re.S)
    def figure_link(match):
        source = re.search(r'<img\b[^>]*\bsrc="([^"]+)"', match[1])
        if not source:
            return match[0]
        label = '查看原图' if lang == 'zh' else 'Open full-size figure'
        return '<figure>' + match[1] + '<p class="figure-link"><a href="' + source[1] + '" target="_blank" rel="noopener noreferrer">' + label + ' ↗</a></p></figure>'
    body = re.sub(r'<figure>(.*?)</figure>', figure_link, body, flags=re.S)
    nav = '<nav class="blog-toc" aria-label="' + LABELS[lang]['toc'] + '"><h2>' + LABELS[lang]['toc'] + '</h2><ol>' + ''.join(toc) + '</ol></nav>'
    return nav + body


def json_script(data):
    return json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')


def render(post, shell):
    canonical = DOMAIN + 'blog/' + post['slug'] + '.html'
    metadata = {lang: {'title': post['translations'][lang]['title'] + ' | Youcheng Li',
                       'description': post['translations'][lang]['summary']} for lang in LANGUAGES}
    sections = []
    for lang in LANGUAGES:
        copy, labels = post['translations'][lang], LABELS[lang]
        citations = ''.join('<li><a href="' + escape(s['url'], quote=True) + '">' + escape(s['title']) + '</a>' +
                            (' · ' + escape(s['published']) if s.get('published') else '') +
                            ' · ' + labels['accessed'] + ' ' + escape(s['accessed']) + '</li>' for s in post['sources'])
        updated = (' · ' + labels['updated'] + ' ' + post['updated']) if post.get('updated') and post['updated'] != post['date'] else ''
        sections.append('<article class="blog-article" data-article-language="' + lang + '" lang="' + ('zh-CN' if lang == 'zh' else 'en') + '"' + (' hidden' if lang == 'en' else '') + '>' +
                        '<header><div class="blog-post-meta"><time datetime="' + post['date'] + '">' + post['date'] + '</time><span>' + labels[post['category']] + '</span><span>Youcheng Li · 利友诚' + updated + '</span></div>' +
                        '<h1>' + escape(copy['title']) + '</h1><p class="article-summary">' + escape(copy['summary']) + '</p></header>' +
                        prose_and_toc(copy['body'], lang) + '<section class="article-sources" aria-label="' + labels['sources'] + '"><h2>' + labels['sources'] + '</h2><ol>' + citations + '</ol></section></article>')
    prefix = shell.split('      <header class="blog-intro">')[0]
    suffix = '      <section class="blog-author"' + shell.split('      <section class="blog-author"', 1)[1]
    html = prefix + '<p class="article-back"><a href="blog.html" data-article-label="back">返回博客</a></p>\n' + '\n'.join(sections) + '\n' + suffix
    html = re.sub(r'(href|src)="([^"#][^"]*)"', lambda m: m[0] if re.match(r'(?:[a-z]+:|/|assets/)', m[2]) else m[1] + '="../' + m[2] + '"', html)
    html = html.replace('data-page="blog"', 'data-page="blog" data-site-root="../"')
    html = re.sub(r'<title>.*?</title>', '<title>' + escape(metadata['zh']['title']) + '</title>', html)
    for name in ('description', 'og:description', 'twitter:description'):
        html = re.sub(r'(<meta (?:name|property)="' + re.escape(name) + '" content=")[^"]*', lambda m: m[1] + escape(metadata['zh']['description'], quote=True), html)
    for name in ('og:title', 'twitter:title'):
        html = re.sub(r'(<meta (?:name|property)="' + re.escape(name) + '" content=")[^"]*', lambda m: m[1] + escape(metadata['zh']['title'], quote=True), html)
    html = html.replace(DOMAIN + 'blog.html', canonical).replace('content="website"', 'content="article"')
    structured = [{
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        'headline': post['translations'][lang]['title'], 'description': post['translations'][lang]['summary'],
        'url': canonical + '?lang=' + lang, 'datePublished': post['date'],
        'dateModified': post.get('updated', post['date']), 'inLanguage': 'zh-CN' if lang == 'zh' else 'en',
        'author': {'@type': 'Person', 'name': 'Youcheng Li', 'url': DOMAIN},
        'citation': [source['url'] for source in post['sources']],
    } for lang in LANGUAGES]
    html = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda _: '<script type="application/ld+json">' + json_script(structured) + '</script>', html)
    html = html.replace('</head>', '<link rel="alternate" hreflang="zh-CN" href="' + canonical + '?lang=zh">\n<link rel="alternate" hreflang="en" href="' + canonical + '?lang=en">\n<link rel="stylesheet" href="../style/blog-article.css">\n<script type="application/json" id="article-metadata">' + json_script(metadata) + '</script>\n<noscript><style>[data-article-language][hidden]{display:block!important}</style></noscript>\n</head>')
    if post.get('math') or any('\\(' in post['translations'][lang]['body'] or '\\[' in post['translations'][lang]['body'] for lang in LANGUAGES):
        math_assets = '''<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/katex.min.css" integrity="sha384-3rdsX6e5mueWyoweR9NIVmtEsUkokpBT/0ALqKKIBMr9j4qhHkaIkAcGgsE6uVlp" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/katex.min.js" integrity="sha384-QFFtAGzvvj+bfgCGxXJlNZZR1nXEZgvG8tDLCCY1F19xl20WlfTYgguB4VcNdxYk" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/contrib/auto-render.min.js" integrity="sha384-bjyGPfbij8/NDKJhSGZNP/khQVgtHUE5exjm4Ydllo42FwIgYsdLO2lXGmRBf5Mz" crossorigin="anonymous"></script>
<script defer src="../js/blog-math.js"></script>
'''
        html = html.replace('<link rel="stylesheet" href="../style/blog-article.css">', math_assets + '<link rel="stylesheet" href="../style/blog-article.css">')
    html = html.replace('src="../js/blog.js"', 'src="../js/blog-article.js"')
    return html


def write_or_check(path, content, check):
    if check:
        require(path.exists() and path.read_text() == content, 'Generated file is stale: ' + str(path.relative_to(ROOT)))
    elif not path.exists() or path.read_text() != content:
        temporary = path.with_suffix(path.suffix + '.tmp')
        temporary.write_text(content)
        temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    posts = [validate(path) for path in sorted((BLOG / 'content').glob('*.json'))]
    require(posts, 'No article sources found')
    posts.sort(key=lambda p: (p['date'], p['slug']), reverse=True)
    shell = (ROOT / 'blog.html').read_text()
    index = []
    rendered = []
    for post in posts:
        rendered.append((BLOG / (post['slug'] + '.html'), render(post, shell)))
        translations = {lang: {key: post['translations'][lang][key] for key in ('title', 'summary', 'tags')} for lang in LANGUAGES}
        index.append({**translations['zh'], 'date': post['date'], 'category': post['category'],
                      'url': 'blog/' + post['slug'] + '.html', 'translations': translations})
    previous = json.loads((BLOG / 'posts.json').read_text())
    require({post['url'] for post in previous}.issubset({post['url'] for post in index}),
            'Refusing to remove published articles from the archive; restore their source JSON first')
    links = ''.join('<li><a href="' + post['url'] + '?lang=zh">' + escape(post['title']) + '</a> / <a lang="en" href="' + post['url'] + '?lang=en">' + escape(post['translations']['en']['title']) + '</a></li>' for post in index)
    fallback = '<!-- blog-static-start --><div class="blog-static-archive"><ul>' + links + '</ul></div><!-- blog-static-end -->'
    if '<!-- blog-static-start -->' in shell:
        shell = re.sub(r'<!-- blog-static-start -->.*?<!-- blog-static-end -->', fallback, shell, flags=re.S)
    else:
        shell = re.sub(r'(<div id="blog-posts" aria-busy="true">).*?(\n          </div>)', lambda m: m[1] + fallback + m[2], shell, count=1, flags=re.S)
    shell = re.sub(r'<noscript><p class="blog-note">.*?</p></noscript>', '<noscript><p class="blog-note">中英文全文均可通过上方链接阅读。Both complete versions are available via the links above.</p></noscript>', shell)
    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', ns)
    tree = ET.fromstring((ROOT / 'sitemap.xml').read_text())
    for post in posts:
        url = DOMAIN + 'blog/' + post['slug'] + '.html'
        node = next((item for item in tree if item.find('{' + ns + '}loc').text == url), None)
        if node is None:
            node = ET.SubElement(tree, '{' + ns + '}url')
            ET.SubElement(node, '{' + ns + '}loc').text = url
        modified = node.find('{' + ns + '}lastmod')
        if modified is None:
            modified = ET.SubElement(node, '{' + ns + '}lastmod')
        modified.text = post.get('updated', post['date'])
    ET.indent(tree, space='  ')
    rendered += [(BLOG / 'posts.json', json.dumps(index, ensure_ascii=False, indent=2) + '\n'),
                 (ROOT / 'blog.html', shell),
                 (ROOT / 'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(tree, encoding='unicode') + '\n')]
    for path, content in rendered:
        write_or_check(path, content, args.check)
    print(('Verified' if args.check else 'Rendered') + ' ' + str(len(posts)) + ' bilingual articles, archive and sitemap.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError, ET.ParseError) as error:
        print('Blog validation failed: ' + str(error), file=sys.stderr)
        sys.exit(1)
