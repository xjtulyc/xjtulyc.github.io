/* Blog-specific copy. The shared SiteLanguage controller owns persistence. */
(() => {
  'use strict';

  const messages = {
    zh: {
      eyebrow: '思考与记录',
      title: '技术博客与商业判断',
      lead: '从技术原理到现实问题，从研究实践到商业思考。',
      topicsLabel: '博客栏目',
      technical: '技术博客',
      business: '商业判断',
      technicalKicker: '技术探索',
      businessKicker: '商业思考',
      technicalDescription: '算法原理、论文解读与实验记录。关注问题如何提出，方法如何推导，以及结果如何验证。',
      businessDescription: 'AI 产品、产业观察与创业思考。围绕真实需求、价值创造与商业选择，展开有依据的讨论。',
      browseCategory: '进入栏目',
      archive: '文章归档',
      allCategories: '全部栏目',
      allPosts: '全部文章',
      searchLabel: '搜索文章',
      searchPlaceholder: '搜索标题、摘要或标签',
      yearLabel: '年份',
      allYears: '全部年份',
      reset: '重置',
      indexLabel: '博客索引',
      categoriesLabel: '文章栏目',
      browseHeading: '按栏目阅读',
      aboutHeading: '关于这个博客',
      aboutDescription: '这里是独立于学术成果列表的写作空间，用于记录技术探索与商业思考。',
      researchLink: '论文与研究项目',
      emptyTitle: '尚无已发布文章',
      emptyCategoryTitle: '{category}栏目尚无已发布文章',
      emptyDescription: '两个栏目已建立，文章将在准备完成后陆续发布。',
      emptyCategoryDescription: '可通过栏目索引浏览其他文章。',
      loadingTitle: '正在加载文章',
      loadingDescription: '请稍候。',
      errorTitle: '文章列表暂时无法加载',
      errorDescription: '请稍后刷新页面再试。',
      noResultsTitle: '没有找到匹配的文章',
      noResultsDescription: '试试其他关键词，或重置搜索条件。',
      resultsOne: '共 {count} 篇文章',
      resultsMany: '共 {count} 篇文章',
      tagsLabel: '文章标签'
    },
    en: {
      eyebrow: 'NOTES & ESSAYS',
      title: 'Technical Notes & Business Perspectives',
      lead: 'Exploring technical ideas, research practice, and business decisions.',
      topicsLabel: 'Blog categories',
      technical: 'Technical Notes',
      business: 'Business Perspectives',
      technicalKicker: 'TECHNOLOGY',
      businessKicker: 'BUSINESS',
      technicalDescription: 'Algorithms, paper discussions, and experiments: how questions are framed, methods are derived, and results are validated.',
      businessDescription: 'AI products, industry observations, and entrepreneurship: examining real needs, value creation, and business choices through evidence.',
      browseCategory: 'Browse category',
      archive: 'Article Archive',
      allCategories: 'All categories',
      allPosts: 'All articles',
      searchLabel: 'Search articles',
      searchPlaceholder: 'Search titles, summaries, or tags',
      yearLabel: 'Year',
      allYears: 'All years',
      reset: 'Reset',
      indexLabel: 'Blog index',
      categoriesLabel: 'Article categories',
      browseHeading: 'Browse by category',
      aboutHeading: 'About this blog',
      aboutDescription: 'A space for technical exploration and business thinking, alongside the academic publications and research projects.',
      researchLink: 'Publications & research',
      emptyTitle: 'No articles published yet',
      emptyCategoryTitle: 'No articles in {category} yet',
      emptyDescription: 'Both categories are ready. Articles will appear here when they are ready to publish.',
      emptyCategoryDescription: 'Browse the category index to find articles in other categories.',
      loadingTitle: 'Loading articles',
      loadingDescription: 'Please wait a moment.',
      errorTitle: 'The article list is temporarily unavailable',
      errorDescription: 'Please refresh the page and try again later.',
      noResultsTitle: 'No matching articles',
      noResultsDescription: 'Try another keyword or reset the search filters.',
      resultsOne: '{count} article',
      resultsMany: '{count} articles',
      tagsLabel: 'Article tags'
    }
  };

  const normalizeLanguage = language => String(language).startsWith('zh') ? 'zh' : 'en';
  let language = normalizeLanguage(window.SiteLanguage?.language || document.documentElement.lang || 'zh');

  function t(key, values = {}) {
    const message = messages[language][key] || messages.en[key] || key;
    return message.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  }

  function setText(selector, key) {
    const node = document.querySelector(selector);
    if (node) node.textContent = t(key);
  }

  // Keep decorative arrows and their accessibility attributes intact.
  function setLabel(node, text) {
    if (!node) return;
    let textNode = [...node.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
    if (!textNode) {
      textNode = document.createTextNode('');
      node.prepend(textNode);
    }
    textNode.textContent = `${text} `;
  }

  function apply() {
    const textSelectors = {
      '.blog-eyebrow': 'eyebrow',
      '.blog-intro h1': 'title',
      '.blog-lead': 'lead',
      '#archive-title': 'archive',
      'label[for="blog-query"]': 'searchLabel',
      'label[for="blog-year"]': 'yearLabel',
      '#blog-year option[value="all"]': 'allYears',
      '.blog-reset': 'reset',
      '.blog-aside-block:first-child h2': 'browseHeading',
      '.blog-about h2': 'aboutHeading',
      '.blog-about p': 'aboutDescription'
    };
    Object.entries(textSelectors).forEach(([selector, key]) => setText(selector, key));
    document.querySelector('.blog-eyebrow')?.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en');
    document.querySelector('.blog-topics')?.setAttribute('aria-label', t('topicsLabel'));
    document.querySelector('.blog-aside')?.setAttribute('aria-label', t('indexLabel'));
    document.querySelector('.blog-category-nav')?.setAttribute('aria-label', t('categoriesLabel'));
    document.getElementById('blog-query')?.setAttribute('placeholder', t('searchPlaceholder'));
    document.querySelectorAll('.blog-topic[data-category-link]').forEach(topic => {
      const category = topic.dataset.categoryLink;
      setLabel(topic.querySelector('h2'), t(category));
      const kicker = topic.querySelector('.blog-topic-kicker');
      if (kicker) {
        kicker.textContent = t(`${category}Kicker`);
        kicker.lang = language === 'zh' ? 'zh-CN' : 'en';
      }
      const description = topic.querySelector('p');
      if (description) description.textContent = t(`${category}Description`);
      setLabel(topic.querySelector('.blog-topic-link'), t('browseCategory'));
    });
    document.querySelectorAll('.blog-category-nav [data-category-link]').forEach(link => {
      setLabel(link, t(link.dataset.categoryLink === 'all' ? 'allPosts' : link.dataset.categoryLink));
    });
    setLabel(document.querySelector('.blog-about a'), t('researchLink'));
  }

  window.BlogI18n = {
    get language() { return language; },
    t,
    categoryName: category => t(category === 'all' ? 'allCategories' : category),
    apply
  };
  document.addEventListener('site:languagechange', event => {
    language = normalizeLanguage(event.detail?.language || window.SiteLanguage?.language || document.documentElement.lang);
    apply();
  });
  apply();
})();
