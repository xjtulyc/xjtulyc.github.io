/* Language selection and in-page navigation for complete bilingual articles. */
(() => {
  'use strict';

  function init() {
    const articles = [...document.querySelectorAll('.blog-article[data-article-language]')];
    if (!articles.length) return;
    const labels = {
      zh: { back: '返回博客', contents: '本文目录', sources: '参考资料', published: '发布于', updated: '更新于' },
      en: { back: 'Back to blog', contents: 'On this page', sources: 'Sources', published: 'Published', updated: 'Updated' }
    };
    let currentLanguage;

    function hashID() {
      try { return decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return ''; }
    }

    function activeArticle() {
      return articles.find(article => article.dataset.articleLanguage === currentLanguage);
    }

    function synchronizeHash(scroll) {
      const id = hashID();
      if (!/^(?:zh|en)-/.test(id)) return;
      const nextID = id.replace(/^(?:zh|en)-/, `${currentLanguage}-`);
      const target = document.getElementById(nextID);
      const url = new URL(window.location.href);
      if (target && activeArticle()?.contains(target)) {
        if (id !== nextID) {
          url.hash = nextID;
          window.history.replaceState(null, '', url);
        }
        if (scroll) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
      } else if (!id.startsWith(`${currentLanguage}-`)) {
        // An unmatched translated heading should never leave a hidden target active.
        url.hash = '';
        window.history.replaceState(null, '', url);
      }
    }

    function apply(language) {
      const requested = String(language || window.SiteLanguage?.language || document.documentElement.lang).startsWith('zh') ? 'zh' : 'en';
      currentLanguage = articles.some(article => article.dataset.articleLanguage === requested) ? requested : articles[0].dataset.articleLanguage;
      const focused = document.activeElement;
      const focusWasInArticle = articles.some(article => article.contains(focused));
      articles.forEach(article => { article.hidden = article.dataset.articleLanguage !== currentLanguage; });
      document.querySelectorAll('[data-article-label]').forEach(node => {
        const text = labels[currentLanguage]?.[node.dataset.articleLabel];
        if (text) node.textContent = text;
        if (node.dataset.articleLabel === 'back' && node instanceof HTMLAnchorElement) {
          const url = new URL(node.getAttribute('href'), document.baseURI);
          if (url.origin === location.origin) {
            url.searchParams.set('lang', currentLanguage);
            node.href = url.href;
          }
        }
      });
      if (focusWasInArticle && focused.closest('[data-article-language]')?.hidden) {
        const visibleArticle = activeArticle();
        visibleArticle.setAttribute('tabindex', '-1');
        visibleArticle.focus({ preventScroll: true });
      }
      synchronizeHash(true);
    }

    // Keep fragment URLs useful with the site's shared smooth-scroll handler.
    articles.forEach(article => article.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      let id;
      try { id = decodeURIComponent(link.hash.slice(1)); } catch (_) { return; }
      const target = document.getElementById(id);
      if (!target || !article.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      const url = new URL(location.href);
      url.hash = id;
      if (url.href !== location.href) history.pushState(null, '', url);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' });
    }));

    document.addEventListener('site:languagechange', event => apply(event.detail?.language));
    window.addEventListener('hashchange', () => synchronizeHash(true));
    apply(window.SiteLanguage?.language);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
