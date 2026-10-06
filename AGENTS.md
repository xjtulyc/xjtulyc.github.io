# AGENTS.md

This repository is Youcheng Li's personal academic website hosted by GitHub Pages at `youchengli.com`.

## Project Shape

- This is a plain static website, not a Node, Jekyll, or Python project.
- The academic homepage is `index.html`. Research and publications live in `research.html`, professional experience in `experience.html`, teaching and resources in `teaching.html`, and the Chinese blog in `blog.html`.
- The custom domain is configured by `CNAME`.
- Main site content is centralized in `config/site-config.js`.
- Blog articles are static HTML files under `blog/`; `blog/posts.json` is the published article index. Follow `blog/README.md` and never publish invented articles or unconfirmed author opinions. An empty archive is intentional until the user supplies articles.
- Dynamic homepage sections are rendered by `js/dynamic-content-loader.js`.
- Page interactions live mostly in `js/single-page-app.js` and `js/modern-script.js`.
- Styling lives in `style/`.
- `style/refinement.css` is the final shared presentation layer; `style/blog.css` adds long-form blog styles.
- Static assets live in `resources/`, `pub/`, `pdf/`, `demo/`, and `teaching/`.
- Resume sources live in `personal_cv/`.

## Editing Rules

- For profile, news, publications, projects, awards, teaching, talks, resources, or sidebar content, edit `config/site-config.js` first.
- Edit the appropriate HTML page when page structure, script/style includes, SEO metadata, or static fallback content must change.
- Keep shared navigation, profile, CV links and page-specific metadata consistent across all five entry pages. Each page has its own canonical URL, title and description.
- The four profile/research pages include complete static content for crawlers and readers without JavaScript. After editing the config or loader, synchronize the corresponding HTML fallback with the complete rendered content before publishing (all news and full project descriptions, no transient collapsed/filter state).
- Keep the homepage primarily academic; detailed entrepreneurship content belongs on `experience.html`.
- Preserve the current static-site architecture. Do not introduce a build system, framework, package manager, or bundler unless explicitly requested.
- Keep changes scoped. Avoid broad visual rewrites or unrelated refactors.
- Do not remove the `CNAME` file.
- Treat `GETTING-STARTED.md` and `README-CONFIG-SYSTEM.md` as partially stale; verify actual files before trusting referenced paths.

## Website Verification

- Since this is a static site, prefer a local HTTP server for browser testing:

```bash
python3 -m http.server 8000
```

- Then open `http://localhost:8000/`.
- Check the browser console after changing JavaScript or `config/site-config.js`.
- Check all five pages at desktop and 320–390px mobile widths, shared navigation, dark mode, mobile menu keyboard behavior, research filters, BibTeX copying and course downloads. Preserve redirects for previously shared homepage section anchors.
- Update `sitemap.xml` when adding pages or published articles. Preserve `robots.txt` and `CNAME`.
- If testing only markup or CSS, opening `index.html` directly can work, but a local server is closer to GitHub Pages behavior.

## Resume Workflow

- Chinese resume source: `personal_cv/cv_ch.tex`.
- English resume source: `personal_cv/cv_en.tex`.
- Compile from `personal_cv/` with XeLaTeX:

```bash
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_ch.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
xelatex -interaction=nonstopmode -halt-on-error cv_en.tex
```

- The current environment may not have `fontawesome5.sty`; the CV templates include a fallback for missing icons.
- The current environment has `Noto Sans SC`, not necessarily `Noto Serif CJK SC` or `Noto Sans CJK SC`.
- Do not commit LaTeX auxiliary files such as `.aux` and `.log` unless the user specifically asks for them.
- Generated PDF resumes may be committed when they are intended for website download or sharing.

## Content and Translation Notes

- Prefer official English names for institutions, companies, competitions, and products.
- If an official English name is unknown, ask the user before finalizing public-facing resume or homepage text.
- Keep publication titles and venue names exactly as published.
- Be careful with time-sensitive claims such as accepted/published status, funding stage, and deployment/customer descriptions.

## Git Hygiene

- The worktree may contain user changes. Do not revert files you did not change.
- Check `git status --short` before summarizing changes.
- Keep generated or temporary files out of commits unless they are intentionally part of the site.
