/* Shared English/Chinese preference and UI text for the static website. */
(() => {
  'use strict';
  const messages = {
    en: {
      skip: 'Skip to content', openMenu: 'Open navigation', closeMenu: 'Close navigation',
      darkTheme: 'Switch to dark theme', lightTheme: 'Switch to light theme', backTop: 'Back to top',
      home: 'Youcheng Li home', navigation: 'Main navigation', contact: 'Contact', updated: 'Updated October 2026',
      cvEnglish: 'CV (EN)', cvChinese: 'CV (中文)', interests: 'Research Interests',
      viewPublications: 'View publications', getInTouch: 'Get in touch', academicRole: 'PhD Candidate · Peking University',
      research: 'Research', researchTitle: 'Publications & Projects',
      researchIntro: 'Generative models, diagnostic reasoning and medical image analysis.',
      publications: 'Publications', publicationIntro: 'Peer-reviewed papers and preprints',
      projects: 'Research Projects', projectIntro: 'Models, benchmarks and open research',
      explore: 'Explore research', learnMore: 'Learn more', filterYear: 'Filter publications by year',
      all: 'All', coFirst: 'co-first author', coursePage: 'Course page', notes: 'Lecture notes ({count} PDFs)',
      fullText: 'Full text', conference: 'Conference', demo: 'Demo', code: 'Code', dataset: 'Dataset', link: 'Link',
      readMore: 'Read More', readLess: 'Read Less', copied: 'Copied!', copyFailed: 'Copy unavailable — please try again',
      moreNews: 'Show More News', lessNews: 'Show Less', moreTalks: 'Show All Talks', lessTalks: 'Show Recent Only',
      citationsLoading: 'Citations loading', citations: '{count} citations', citation: '{count} citation',
      citationSource: 'Citation count from Semantic Scholar', citationFallback: 'Stored citation count; live data is unavailable'
    },
    zh: {
      skip: '跳转到正文', openMenu: '打开导航', closeMenu: '关闭导航',
      darkTheme: '切换为深色模式', lightTheme: '切换为浅色模式', backTop: '返回顶部',
      home: '利友诚的主页', navigation: '主导航', contact: '联系我', updated: '更新于 2026 年 10 月',
      cvEnglish: '英文简历', cvChinese: '中文简历', interests: '研究方向',
      viewPublications: '查看论文', getInTouch: '联系我', academicRole: '北京大学 · 人工智能博士研究生',
      research: '学术研究', researchTitle: '论文与研究项目',
      researchIntro: '生成式模型、诊断推理与医学影像分析。',
      publications: '学术论文', publicationIntro: '已发表论文与预印本',
      projects: '研究项目', projectIntro: '模型、基准数据集与开放研究',
      explore: '查看研究', learnMore: '了解更多', filterYear: '按年份筛选论文',
      all: '全部', coFirst: '共同第一作者', coursePage: '课程主页', notes: '课程讲义（{count} 份 PDF）',
      fullText: '论文全文', conference: '会议论文', demo: '在线演示', code: '代码', dataset: '数据集', link: '链接',
      readMore: '展开全文', readLess: '收起', copied: '已复制', copyFailed: '复制未成功，请重试',
      moreNews: '更多动态', lessNews: '收起动态', moreTalks: '全部报告', lessTalks: '近期报告',
      citationsLoading: '正在加载引用数', citations: '{count} 次引用', citation: '{count} 次引用',
      citationSource: '引用数来自 Semantic Scholar', citationFallback: '历史引用数；实时数据暂不可用'
    }
  };
  let stored;
  try { stored = localStorage.getItem('site-language'); } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  let language = [requested, stored].find(value => value === 'en' || value === 'zh') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
  const merge = (base, overrides) => Object.fromEntries(Object.entries({...base, ...overrides}).map(([key, value]) => [key,
    value && typeof value === 'object' && !Array.isArray(value) ? merge(base?.[key] || {}, overrides?.[key] || {}) : value
  ]));
  let chineseConfig;
  function getConfig() {
    if (language === 'en' || typeof SITE_CONFIG_ZH === 'undefined') return SITE_CONFIG;
    return chineseConfig ||= merge(SITE_CONFIG, SITE_CONFIG_ZH);
  }
  function t(key, values = {}) {
    return (messages[language][key] || messages.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
  }
  function pageMetadata(fallback) {
    const articleMetadata = document.getElementById('article-metadata');
    if (!articleMetadata) return fallback;
    try {
      const translations = JSON.parse(articleMetadata.textContent);
      const selected = translations[language] || translations.zh || translations.en;
      if (selected && typeof selected.title === 'string' && typeof selected.description === 'string') return selected;
    } catch (error) {
      console.error('Article metadata could not be read:', error);
    }
    // Keep the article's static metadata if its translation data is unavailable.
    return { title: document.title, description: document.querySelector('meta[name="description"]')?.content || '' };
  }
  function navigationHref(href) {
    const siteRoot = document.body.dataset.siteRoot || '';
    return /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(href) ? href : `${siteRoot}${href}`;
  }
  function updateShared() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const config = getConfig(), page = document.body.dataset.page;
    const metadata = pageMetadata(config.pages?.[page]?.seo || config.seo);
    document.title = metadata.title;
    for (const [selector, content] of [
      ['meta[name="description"]', metadata.description], ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description], ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description]
    ]) { const element = document.querySelector(selector); if (element) element.content = content; }
    document.querySelectorAll('[data-i18n]').forEach(element => element.textContent = t(element.dataset.i18n));
    document.querySelectorAll('.profile-title').forEach((element, index) => element.textContent = index === 0 ? config.personal.position.title : config.personal.position.institution);
    document.querySelector('.profile > a')?.setAttribute('aria-label', t('home'));
    const nav = document.querySelector('.navigation');
    if (nav) {
      nav.setAttribute('aria-label', t('navigation'));
      nav.innerHTML = config.navigation.sidebar.map(item => `<a class="nav-item${item.id === page ? ' active' : ''}" href="${navigationHref(item.href)}"${item.id === page ? ' aria-current="page"' : ''}><i class="${item.icon} nav-icon" aria-hidden="true"></i><span>${item.label}</span></a>`).join('');
    }
    const labels = [['.skip-link','skip'],['.site-footer a','contact']];
    labels.forEach(([selector,key])=> {const element=document.querySelector(selector);if(element)element.textContent=t(key);});
    const updated = document.querySelector('.site-footer span:last-child');
    if (updated && updated !== document.querySelector('.site-footer span:first-child')) updated.textContent = t('updated');
    [['.cv-download-en','cvEnglish'],['.cv-download-ch','cvChinese']].forEach(([selector,key])=>{
      const element=document.querySelector(selector);if(element)element.innerHTML=`<i class="fas fa-file-pdf" aria-hidden="true"></i> ${t(key)}`;
    });
    document.querySelector('.back-to-top')?.setAttribute('aria-label',t('backTop'));
    document.querySelector('.theme-toggle')?.setAttribute('aria-label', t(document.documentElement.dataset.theme === 'dark' ? 'lightTheme' : 'darkTheme'));
    const menu = document.querySelector('.mobile-menu-toggle');
    menu?.setAttribute('aria-label', t(menu.getAttribute('aria-expanded') === 'true' ? 'closeMenu' : 'openMenu'));
    const toggle = document.querySelector('.language-toggle');
    if (toggle) {
      toggle.textContent = language === 'en' ? '中文' : 'EN';
      toggle.lang = language === 'en' ? 'zh-CN' : 'en';
      toggle.setAttribute('aria-label',language === 'en' ? '切换为中文' : 'Switch to English');
    }
  }
  function setLanguage(value) {
    if (value !== 'en' && value !== 'zh') return;
    language = value;
    try { localStorage.setItem('site-language', value); } catch (_) {}
    const url = new URL(location.href); url.searchParams.set('lang', value); history.replaceState(null, '', url);
    if (window.spaApp) window.spaApp.setConfig(getConfig());
    if (window.dynamicContentLoader) {
      window.dynamicContentLoader.config=getConfig();
      window.dynamicContentLoader.loadAllContent();
    }
    updateShared();
    document.dispatchEvent(new CustomEvent('site:languagechange',{detail:{language}}));
  }
  window.SiteLanguage={get language(){return language;},t,getConfig,setLanguage,updateShared};
  document.addEventListener('DOMContentLoaded',()=>{
    try { localStorage.setItem('site-language',language); } catch (_) {}
    updateShared();
    document.querySelector('.language-toggle')?.addEventListener('click',()=>setLanguage(language==='en'?'zh':'en'));
  });
})();
