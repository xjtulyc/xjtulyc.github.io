/* A small archive for static articles. Only published entries belong in posts.json. */
(() => {
  'use strict';

  const i18n = window.BlogI18n;
  if (!i18n) return;
  const categories = ['technical', 'business'];
  const params = new URLSearchParams(window.location.search);
  const category = categories.includes(params.get('category')) ? params.get('category') : 'all';
  const postsElement = document.getElementById('blog-posts');
  const form = document.getElementById('blog-filters');
  const queryInput = document.getElementById('blog-query');
  const yearInput = document.getElementById('blog-year');
  const status = document.getElementById('blog-result-status');
  if (!postsElement || !form || !queryInput || !yearInput || !status) return;

  const t = (key, values) => i18n.t(key, values);
  let archiveState = 'loading';
  let allPosts = [];
  let categoryPosts = [];
  document.querySelectorAll('[data-category-link]').forEach(link => {
    if (link.dataset.categoryLink === category) link.setAttribute('aria-current', 'true');
  });

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function empty(title, description) {
    const state = element('div', 'blog-empty');
    const mark = element('span', 'blog-empty-mark', '—');
    mark.setAttribute('aria-hidden', 'true');
    state.append(mark, element('h3', '', title), element('p', '', description));
    postsElement.replaceChildren(state);
  }

  function validPost(post) {
    if (!post || typeof post !== 'object' || !categories.includes(post.category)) return false;
    if (!['title', 'summary', 'url', 'date'].every(key => typeof post[key] === 'string' && post[key].trim())) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return false;
    const date = new Date(`${post.date}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== post.date) return false;
    if (!Array.isArray(post.tags) || !post.tags.every(tag => typeof tag === 'string')) return false;
    try {
      const url = new URL(post.url, document.baseURI);
      return url.origin === window.location.origin && url.pathname.startsWith('/blog/') && url.pathname.endsWith('.html');
    } catch (_) { return false; }
  }

  function renderPost(post) {
    const article = element('article', 'blog-post');
    const meta = element('div', 'blog-post-meta');
    const formattedDate = new Intl.DateTimeFormat(i18n.language === 'zh' ? 'zh-CN' : 'en', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
    }).format(new Date(`${post.date}T00:00:00Z`));
    const date = element('time', '', formattedDate);
    date.dateTime = post.date;
    meta.append(date, element('span', 'blog-post-category', i18n.categoryName(post.category)));
    const heading = element('h4');
    const link = element('a', '', post.title);
    link.href = post.url;
    heading.append(link);
    article.append(meta, heading, element('p', 'blog-post-summary', post.summary));
    if (post.tags.length) {
      const tags = element('div', 'blog-post-tags');
      tags.setAttribute('aria-label', t('tagsLabel'));
      post.tags.forEach(tag => tags.append(element('span', 'blog-post-tag', tag)));
      article.append(tags);
    }
    return article;
  }

  function updateURL() {
    const url = new URL(window.location.href);
    const query = queryInput.value.trim();
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (yearInput.value !== 'all') url.searchParams.set('year', yearInput.value); else url.searchParams.delete('year');
    window.history.replaceState(null, '', url);
  }

  function render() {
    document.getElementById('archive-context').textContent = i18n.categoryName(category);
    if (archiveState === 'loading') {
      empty(t('loadingTitle'), t('loadingDescription'));
      return;
    }
    if (archiveState === 'error') {
      empty(t('errorTitle'), t('errorDescription'));
      return;
    }
    if (!categoryPosts.length) {
      const title = category === 'all' ? t('emptyTitle') : t('emptyCategoryTitle', { category: i18n.categoryName(category) });
      empty(title, t(allPosts.length ? 'emptyCategoryDescription' : 'emptyDescription'));
      return;
    }

    const query = queryInput.value.trim().toLocaleLowerCase();
    const matches = categoryPosts.filter(post => {
      const searchText = `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLocaleLowerCase();
      return (yearInput.value === 'all' || post.date.startsWith(yearInput.value)) && (!query || searchText.includes(query));
    });
    status.textContent = t(matches.length === 1 ? 'resultsOne' : 'resultsMany', { count: matches.length });
    if (!matches.length) {
      empty(t('noResultsTitle'), t('noResultsDescription'));
      return;
    }
    const fragment = document.createDocumentFragment();
    let year, group;
    matches.forEach(post => {
      const postYear = post.date.slice(0, 4);
      if (postYear !== year) {
        year = postYear;
        group = element('div', 'blog-year-group');
        group.append(element('h3', 'blog-year-heading', year));
        fragment.append(group);
      }
      group.append(renderPost(post));
    });
    postsElement.replaceChildren(fragment);
  }

  async function init() {
    try {
      const response = await fetch('blog/posts.json');
      if (!response.ok) throw new Error('Archive request failed');
      const posts = await response.json();
      if (!Array.isArray(posts) || !posts.every(validPost)) throw new Error('Invalid archive data');
      posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'));
      allPosts = posts;
      categoryPosts = posts.filter(post => category === 'all' || post.category === category);
      archiveState = 'ready';
      if (!categoryPosts.length) {
        render();
        return;
      }
      const years = [...new Set(categoryPosts.map(post => post.date.slice(0, 4)))];
      years.forEach(year => {
        const option = element('option', '', year);
        option.value = year;
        yearInput.append(option);
      });
      queryInput.value = params.get('q') || '';
      yearInput.value = years.includes(params.get('year')) ? params.get('year') : 'all';
      form.hidden = false;
      status.hidden = false;

      form.addEventListener('submit', event => event.preventDefault());
      queryInput.addEventListener('input', () => { render(); updateURL(); });
      yearInput.addEventListener('change', () => { render(); updateURL(); });
      form.addEventListener('reset', event => {
        event.preventDefault();
        queryInput.value = '';
        yearInput.value = 'all';
        render();
        updateURL();
        queryInput.focus();
      });
      render();
    } catch (error) {
      archiveState = 'error';
      render();
      console.error('Blog archive could not be loaded:', error);
    } finally {
      postsElement.setAttribute('aria-busy', 'false');
    }
  }
  document.addEventListener('site:languagechange', render);
  render();
  init();
})();
