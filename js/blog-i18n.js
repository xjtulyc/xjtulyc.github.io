/* Blog-specific copy. The shared SiteLanguage controller owns persistence. */
(() => {
  'use strict';

  const messages = {
    zh: {
      eyebrow: '思考与记录',
      title: '技术博客与商业判断',
      lead: '解读 AI4S 与大语言模型，观察国内外头部公司的技术与商业趋势。',
      topicsLabel: '博客栏目',
      technical: '技术博客',
      business: '商业判断',
      technicalKicker: '技术探索',
      businessKicker: '商业思考',
      technicalDescription: '聚焦 AI for Science 与大语言模型，从机制与数学推导出发，结合代码实现和实验分析，理解方法为何有效、适用于何处。',
      businessDescription: '关注国内外头部公司的技术与商业趋势，梳理变化的背景、关键选择与发展方向，讨论技术进展如何影响产品和产业。',
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
      aboutDescription: '围绕 AI4S 与大语言模型展开技术解读，也记录对国内外头部公司技术与商业趋势的思考。',
      researchLink: '论文与研究项目',
      authorEyebrow: '关于作者',
      authorName: '利友诚 · Youcheng Li',
      authorPhotoAlt: '利友诚',
      authorIntroduction: '北京大学智能学院人工智能专业博士研究生，导师为王立威教授；Isoplex Intelligence（壹索智能）联合创始人兼 CTO。',
      authorResearch: '研究关注医疗人工智能、生成式基础模型、诊断推理与科学智能体。以第一作者或共同第一作者身份在 Nature Biomedical Engineering、Scientific Data、KDD 和 PLOS Computational Biology 发表研究。',
      authorLinksLabel: '了解作者',
      authorResearchLink: '研究与论文',
      authorExperienceLink: '创业与经历',
      authorContactLink: '邮件联系',
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
      lead: 'Exploring AI for Science and large language models, alongside technology and business trends at leading companies in China and abroad.',
      topicsLabel: 'Blog categories',
      technical: 'Technical Notes',
      business: 'Business Perspectives',
      technicalKicker: 'TECHNOLOGY',
      businessKicker: 'BUSINESS',
      technicalDescription: 'AI for Science and large language models, examined through mechanisms, mathematical derivations, implementation, and experiments to understand why methods work and where they apply.',
      businessDescription: 'Technology and business trends at leading companies in China and abroad: the context behind changes, key decisions, and emerging directions for products and industries.',
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
      aboutDescription: 'Technical discussions of AI for Science and large language models, and reflections on technology and business trends at leading companies in China and abroad.',
      researchLink: 'Publications & research',
      authorEyebrow: 'ABOUT THE AUTHOR',
      authorName: 'Youcheng Li · 利友诚',
      authorPhotoAlt: 'Youcheng Li',
      authorIntroduction: 'PhD candidate in Artificial Intelligence at the School of Intelligence Science and Technology, Peking University, advised by Prof. Liwei Wang. Co-founder and CTO of Isoplex Intelligence.',
      authorResearch: 'My research focuses on medical AI, generative foundation models, diagnostic reasoning, and scientific agents. My first-author and co-first-author work has appeared in Nature Biomedical Engineering, Scientific Data, KDD, and PLOS Computational Biology.',
      authorLinksLabel: 'More about the author',
      authorResearchLink: 'Research & publications',
      authorExperienceLink: 'Entrepreneurship & experience',
      authorContactLink: 'Get in touch',
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
    document.querySelectorAll('[data-blog-i18n]').forEach(node => { node.textContent = t(node.dataset.blogI18n); });
    document.querySelectorAll('[data-blog-i18n-alt]').forEach(node => { node.alt = t(node.dataset.blogI18nAlt); });
    document.querySelectorAll('[data-blog-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.blogI18nAria)); });
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
