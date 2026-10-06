/**
 * 动态内容加载器 - 从配置文件完全动态生成页面内容
 * Dynamic Content Loader - Fully dynamic page content generation from configuration
 */

class DynamicContentLoader {
  constructor() {
    this.config = null;
  }

  t(key, values) { return window.SiteLanguage?.t(key, values) || key; }

  async init() {
    try {
      // 等待配置文件加载
      if (typeof SITE_CONFIG === 'undefined') {
        // 如果配置未加载，等待一下再试
        setTimeout(() => this.init(), 100);
        return;
      }
      
      this.config = window.SiteLanguage?.getConfig() || SITE_CONFIG;
      
      // 加载所有动态内容
      this.loadAllContent();
      
      console.log('Dynamic content loaded successfully from configuration');
      console.log('Loaded projects:', this.config.projects.featured?.length);
      console.log('Loaded publications:', this.config.projects.publications?.length);
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  }

  loadAllContent() {
    console.log('Starting to load all content...');
    this.loadSidebarContent();
    this.loadProfileContent();
    this.loadExperience();
    this.loadPublications();
    this.loadProjects();
    this.loadNews();
    this.loadAwards();
    this.loadTeaching();
    this.loadTalks();
    this.loadResources();
    this.loadProjectFilters();
    if (this.config.features?.liveCitationCounts) this.loadSemanticScholarCitations();
    
    // 重新初始化所有交互功能
    this.reinitializeInteractions();
    window.SiteLanguage?.updateShared();
    document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');
    console.log('Finished loading all content');
  }

  /**
   * 重新初始化所有交互功能
   */
  reinitializeInteractions() {
    // 重新初始化Single Page App的功能
    if (window.spaApp) {
      // 重新初始化News展开功能
      window.spaApp.initNewsExpansion();
      // 重新初始化Talks展开功能  
      window.spaApp.initTalksExpansion();
      // 重新初始化项目卡片展开功能
      window.spaApp.initProjectCardExpansion();
      // 重新初始化懒加载
      window.spaApp.initLazyLoading();
    }
  }

  /**
   * 加载侧边栏内容
   */
  loadSidebarContent() {
    const personal = this.config.personal;
    
    // 更新个人信息
    const nameElements = document.querySelectorAll('.profile-name');
    if (nameElements.length >= 2) {
      nameElements[0].textContent = personal.name.english;
      nameElements[1].textContent = personal.name.chinese;
    }
    
    // 更新邮箱
    const emailElements = document.querySelectorAll('.contact-info-item a');
    if (emailElements.length >= 2 && personal.contact.emails) {
      emailElements[0].href = `mailto:${personal.contact.emails[0]}`;
      emailElements[0].textContent = personal.contact.emails[0];
      emailElements[1].href = `mailto:${personal.contact.emails[1]}`;
      emailElements[1].textContent = personal.contact.emails[1];
    }

    // 更新简历下载链接
    const cvEnglishLink = document.querySelector('.cv-download-en');
    const cvChineseLink = document.querySelector('.cv-download-ch');
    if (cvEnglishLink && personal.contact.cvEnglish) {
      cvEnglishLink.href = personal.contact.cvEnglish;
    }
    if (cvChineseLink && personal.contact.cvChinese) {
      cvChineseLink.href = personal.contact.cvChinese;
    }

    // 更新社交链接
    const socialLinks = document.querySelectorAll('.social-link');
    if (personal.social && socialLinks.length > 0) {
      personal.social.forEach((social, index) => {
        if (socialLinks[index]) {
          socialLinks[index].href = social.url;
          socialLinks[index].setAttribute('data-tooltip', social.tooltip);
          socialLinks[index].setAttribute('aria-label', social.name);
          socialLinks[index].setAttribute('rel', 'noopener noreferrer');
          socialLinks[index].innerHTML = `<i class="${social.icon}"></i>`;
        }
      });
    }
  }

  loadProfileContent() {
    const { personal, about, research, seo } = this.config;
    const avatar = document.querySelector('.profile-image');
    if (avatar) { avatar.src = personal.avatar; avatar.alt = personal.name.english; }
    document.querySelectorAll('.profile-title').forEach((element, index) => {
      element.textContent = index === 0 ? personal.position.title : personal.position.institution;
    });
    const aboutContent = document.querySelector('#about .about-copy');
    if (aboutContent) aboutContent.innerHTML = about.content.map(item => `<p>${item.text}</p>`).join('');
    const interests = document.querySelector('#about .badges-container');
    if (interests) interests.innerHTML = about.researchInterests.interests.map(item => `<span class="badge badge-primary">${item}</span>`).join('');
    const mission = document.querySelector('#about .mission-statement');
    if (mission) mission.textContent = about.mission;
    const highlights = document.querySelector('#research .research-grid');
    if (highlights) highlights.innerHTML = research.highlights.map(item => `<article class="card research-card"><div class="card-content"><h3 class="card-title">${item.title}</h3><p>${item.description}</p><a class="btn btn-outline" href="${item.link}">${this.t('explore')} <span aria-hidden="true">→</span></a></div></article>`).join('');
    ['about', 'news', 'research', 'awards', 'teaching', 'resources', 'experience'].forEach(id => {
      const config = this.config[id];
      if (!config) return;
      const title = document.querySelector(`#${id} .section-title`);
      const subtitle = document.querySelector(`#${id} .section-subtitle`);
      if (title) title.textContent = config.title;
      if (subtitle) subtitle.textContent = config.subtitle;
    });
    const page = document.body.dataset.page;
    const metadata = this.config.pages?.[page]?.seo || seo;
    document.title = metadata.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = metadata.description;
    const nav = document.querySelector('.navigation');
    if (nav) nav.innerHTML = this.config.navigation.sidebar.map(item => `<a class="nav-item${item.id === page ? ' active' : ''}" href="${item.href}"${item.id === page ? ' aria-current="page"' : ''}><i class="${item.icon} nav-icon" aria-hidden="true"></i><span>${item.label}</span></a>`).join('');
  }

  loadExperience() {
    const container = document.querySelector('.experience-list');
    if (!container || !this.config.experience) return;
    container.innerHTML = this.config.experience.items.map(item => `<article class="experience-card card"><div class="card-content"><div class="experience-meta"><span>${item.period}</span><span>${item.role}</span></div><h3>${item.organization}</h3><p>${item.description}</p>${item.highlights?.length ? `<ul class="experience-points">${item.highlights.map(point => `<li>${point}</li>`).join('')}</ul>` : ''}${item.url ? `<a class="btn btn-outline" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.linkText || this.t('learnMore')} <span aria-hidden="true">↗</span></a>` : ''}</div></article>`).join('');
  }

  /**
   * 动态加载Publications部分
   */
  loadPublications() {
    const publications = this.config.projects.publications;
    const pubContainer = document.querySelector('#publications .publications-list');
    
    console.log('Loading publications:', publications?.length, 'year groups');
    console.log('Publications container found:', !!pubContainer);
    
    if (!pubContainer || !publications) {
      return;
    }
    
    // 清空现有内容
    pubContainer.innerHTML = '';
    console.log('Cleared publications container');
    
    // 创建年份过滤器
    const yearFilter = document.createElement('div');
    yearFilter.className = 'year-filter mb-4';
    yearFilter.setAttribute('aria-label', this.t('filterYear'));
    yearFilter.innerHTML = `<button type="button" class="year-badge active" data-year="all" aria-pressed="true">${this.t('all')}</button>`;
    
    // 添加年份标签
    publications.forEach(yearGroup => {
      const yearBadge = document.createElement('button');
      yearBadge.type = 'button';
      yearBadge.setAttribute('aria-pressed', 'false');
      yearBadge.className = 'year-badge';
      yearBadge.setAttribute('data-year', yearGroup.year);
      yearBadge.textContent = yearGroup.year;
      yearFilter.appendChild(yearBadge);
    });
    
    pubContainer.appendChild(yearFilter);
    
    // 创建出版物列表
    publications.forEach(yearGroup => {
      const yearSection = document.createElement('div');
      yearSection.className = 'publication-year';
      yearSection.setAttribute('data-year', yearGroup.year);
      
      const yearHeader = document.createElement('h3');
      yearHeader.className = 'year-header';
      yearHeader.innerHTML = `<button type="button" class="year-toggle" aria-expanded="true">${yearGroup.year} <i class="fas fa-chevron-down toggle-icon" aria-hidden="true"></i></button>`;
      yearSection.appendChild(yearHeader);
      
      yearGroup.items.forEach(item => {
        const pubItem = document.createElement('div');
        pubItem.className = 'publication-item card';
        
        // 处理作者列表，高亮自己的名字，并标注共同第一作者
        const authorsString = item.authors.map(author => {
          const coFirstMark = item.coFirst?.includes(author) ? '<sup>†</sup>' : '';
          const authorText = `${author}${coFirstMark}`;
          return author.includes('Youcheng Li') ? `<strong>${authorText}</strong>` : authorText;
        }).join(', ');
        const coFirstNote = item.coFirst?.length ?
          `<span class="publication-note">† ${this.t('coFirst')}</span>` : '';
        
        // 处理期刊信息
        const venueInfo = `${item.venue}${item.volume ? ` ${item.volume}${item.issue ? `(${item.issue})` : ''}` : ''}${item.pages ? `: ${item.pages}` : ''}`;
        
        // 生成链接
        let linksHTML = '';
        if (item.links) {
          linksHTML = item.links.map(link => {
            const linkText = link.text || this.getLinkTypeText(link.type);
            const iconClass = this.getLinkTypeIcon(link.type);
            const btnClass = ['journal', 'conference'].includes(link.type) ? 'primary' : 'outline';
            return `<a href="${link.url}" class="btn btn-sm btn-${btnClass}" target="_blank">
              <i class="${iconClass}"></i> ${linkText}
            </a>`;
          }).join('');
        }
        
        // 引用数，从 Semantic Scholar API 动态更新
        const citationsHTML = this.renderCitationCount(item, 'mt-2');
        
        pubItem.innerHTML = `
          <div class="publication-content">
            <h4 class="publication-title">${item.title}</h4>
            <div class="publication-authors">${authorsString} ${coFirstNote}</div>
            <div class="publication-venue">
              <i class="fas fa-book"></i> ${venueInfo}
            </div>
            ${citationsHTML}
            <div class="publication-links mt-3">
              ${linksHTML}
              <button type="button" class="btn btn-sm btn-outline copy-bibtex">
                <i class="fas fa-quote-left"></i> BibTeX
              </button>
            </div>
          </div>
        `;
        
        pubItem.querySelector('.copy-bibtex').dataset.bibtex = this.generateBibTeX(item);
        yearSection.appendChild(pubItem);
      });
      
      pubContainer.appendChild(yearSection);
    });
    
    // 初始化年份折叠功能
    this.initPublicationYearToggle();
    
    // 初始化年份过滤功能
    this.initPublicationYearFilter();
  }

  /**
   * 初始化Publications年份折叠功能
   */
  initPublicationYearToggle() {
    const yearHeaders = document.querySelectorAll('#publications .year-toggle');
    
    yearHeaders.forEach(header => {
      header.style.cursor = 'pointer';
      
      header.addEventListener('click', () => {
        const yearSection = header.closest('.publication-year');
        const items = yearSection.querySelectorAll('.publication-item');
        const icon = header.querySelector('.toggle-icon');
        const isCollapsed = items.length > 0 && items[0].style.display === 'none';
        header.setAttribute('aria-expanded', String(isCollapsed));
        
        items.forEach(item => {
          item.style.display = isCollapsed ? 'block' : 'none';
        });
        
        if (icon) {
          icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  }

  /**
   * 初始化Publications年份过滤功能
   */
  initPublicationYearFilter() {
    const yearBadges = document.querySelectorAll('#publications .year-badge');
    const yearSections = document.querySelectorAll('#publications .publication-year');
    
    yearBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const selectedYear = badge.dataset.year;
        
        // 更新活动状态
        yearBadges.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        badge.classList.add('active');
        badge.setAttribute('aria-pressed', 'true');
        
        // 显示/隐藏对应年份的内容
        yearSections.forEach(section => {
          if (selectedYear === 'all' || section.dataset.year === selectedYear) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 生成引用数占位，随后由 Semantic Scholar API 更新
   */
  renderCitationCount(item, extraClass = '') {
    if (!this.config.features?.liveCitationCounts) return '';
    const semanticScholarId = this.getSemanticScholarId(item);
    const fallback = Number.isFinite(item.citations) ? item.citations : null;

    if (!semanticScholarId && fallback === null) {
      return '';
    }

    const classes = ['citation-count'];
    if (extraClass) classes.push(extraClass);
    if (semanticScholarId) classes.push('is-loading');

    const dataId = semanticScholarId ? ` data-semantic-scholar-id="${semanticScholarId}"` : '';
    const dataFallback = fallback !== null ? ` data-citation-fallback="${fallback}"` : '';
    const label = semanticScholarId ? this.t('citationsLoading') : this.formatCitationLabel(fallback);

    return `<div class="${classes.join(' ')}"${dataId}${dataFallback}>
      <i class="fas fa-quote-right"></i>
      <span class="citation-label">${label}</span>
    </div>`;
  }

  /**
   * 从显式配置或论文链接推断 Semantic Scholar 支持的 paper id
   */
  getSemanticScholarId(item) {
    if (item.semanticScholarId) {
      return item.semanticScholarId;
    }

    const links = item.links || [];
    for (const link of links) {
      const url = link.url || '';

      const arxivMatch = url.match(/arxiv\.org\/(?:abs|pdf)\/([0-9.]+)(?:v\d+)?/i);
      if (arxivMatch) {
        return `ARXIV:${arxivMatch[1]}`;
      }

      const plosMatch = url.match(/[?&]id=(10\.\d+\/journal\.[^&#]+)/i);
      if (plosMatch) {
        return `DOI:${decodeURIComponent(plosMatch[1])}`;
      }

      const springerMatch = url.match(/\/chapter\/(10\.1007\/[^?#]+)/i);
      if (springerMatch) {
        return `DOI:${decodeURIComponent(springerMatch[1])}`;
      }

      const natureMatch = url.match(/nature\.com\/articles\/([^/?#]+)/i);
      if (natureMatch) {
        return `DOI:10.1038/${decodeURIComponent(natureMatch[1])}`;
      }
    }

    return '';
  }

  /**
   * 使用 Semantic Scholar Graph API 批量更新引用数
   */
  async loadSemanticScholarCitations() {
    const citationElements = Array.from(document.querySelectorAll('[data-semantic-scholar-id]'));
    if (citationElements.length === 0) return;

    const citationIds = Array.from(new Set(
      citationElements.map(element => element.dataset.semanticScholarId).filter(Boolean)
    ));

    const missingIds = [];
    citationIds.forEach(id => {
      const cachedPaper = this.getCachedSemanticScholarPaper(id);
      if (cachedPaper !== undefined) {
        this.updateCitationElements(id, cachedPaper);
      } else {
        missingIds.push(id);
      }
    });

    if (missingIds.length === 0) return;

    try {
      const response = await fetch('https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,citationCount,url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: missingIds })
      });

      if (!response.ok) {
        throw new Error(`Semantic Scholar API returned ${response.status}`);
      }

      const papers = await response.json();
      missingIds.forEach((id, index) => {
        const paper = papers[index] || null;
        this.cacheSemanticScholarPaper(id, paper);
        this.updateCitationElements(id, paper);
      });
    } catch (error) {
      console.warn('Failed to load citation counts from Semantic Scholar:', error);
      missingIds.forEach(id => this.updateCitationElements(id, null));
    }
  }

  getCachedSemanticScholarPaper(id) {
    try {
      const cacheKey = `semantic-scholar-citations:${id}`;
      const cachedValue = localStorage.getItem(cacheKey);
      if (!cachedValue) return undefined;

      const cached = JSON.parse(cachedValue);
      const maxAge = 24 * 60 * 60 * 1000;
      if (!cached.fetchedAt || Date.now() - cached.fetchedAt > maxAge) {
        localStorage.removeItem(cacheKey);
        return undefined;
      }

      return cached.paper;
    } catch (error) {
      return undefined;
    }
  }

  cacheSemanticScholarPaper(id, paper) {
    try {
      const cacheKey = `semantic-scholar-citations:${id}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        fetchedAt: Date.now(),
        paper
      }));
    } catch (error) {
      // localStorage can be unavailable in privacy-restricted contexts.
    }
  }

  updateCitationElements(id, paper) {
    const elements = Array.from(document.querySelectorAll('[data-semantic-scholar-id]'))
      .filter(element => element.dataset.semanticScholarId === id);

    elements.forEach(element => {
      const labelElement = element.querySelector('.citation-label');
      if (!labelElement) return;

      if (paper && Number.isFinite(paper.citationCount)) {
        labelElement.textContent = this.formatCitationLabel(paper.citationCount);
        element.classList.remove('is-loading', 'is-unavailable');
        element.title = this.t('citationSource');
        return;
      }

      const fallback = Number.parseInt(element.dataset.citationFallback, 10);
      if (Number.isFinite(fallback)) {
        labelElement.textContent = this.formatCitationLabel(fallback);
        element.classList.remove('is-loading');
        element.classList.add('is-unavailable');
        element.title = this.t('citationFallback');
      } else {
        element.remove();
      }
    });
  }

  formatCitationLabel(count) {
    return this.t(count === 1 ? 'citation' : 'citations', { count });
  }

  /**
   * 动态加载Projects部分
   */
  loadProjects() {
    const projects = this.config.projects.featured;
    const projectsContainer = document.querySelector('#projects .projects-grid');
    
    console.log('Loading projects:', projects?.length, 'items');
    console.log('Projects container found:', !!projectsContainer);
    
    if (!projectsContainer || !projects) {
      return;
    }
    
    // 清空现有内容
    projectsContainer.innerHTML = '';
    console.log('Cleared projects container');
    
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card card';
      // Set data-category for filtering - use all tags as space-separated string
      const categories = project.tags.map(tag => tag.toLowerCase().replace(/\s+/g, '')).join(' ');
      projectCard.setAttribute('data-category', categories);
      
      // 生成标签
      const tagsHTML = project.tags.map(tag => 
        `<span class="badge badge-secondary">${tag}</span>`
      ).join('');
      
      // 生成链接
      const linksHTML = project.links.map(link => {
        const linkText = link.text || this.getLinkTypeText(link.type);
        const iconClass = this.getLinkTypeIcon(link.type);
        const btnClass = link.type === 'demo' ? 'primary' : 'outline';
        return `<a href="${link.url}" class="btn btn-sm btn-${btnClass}" target="_blank">
          <i class="${iconClass}"></i> ${linkText}
        </a>`;
      }).join('');
      
      // 引用数，从 Semantic Scholar API 动态更新
      const citationsHTML = this.renderCitationCount(project);
      
      projectCard.innerHTML = `
        ${project.image ? `<div class="project-image">
          <img data-src="${project.image}" alt="${project.title}" class="lazy">
        </div>` : ''}
        <div class="project-content">
          <h4 class="project-title">${project.title}</h4>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${tagsHTML}
          </div>
          ${citationsHTML}
          <div class="project-links publication-links mt-3">
            ${linksHTML}
          </div>
        </div>
      `;
      
      projectsContainer.appendChild(projectCard);
    });
    
    // 重新初始化懒加载
    this.initLazyLoadingForNewImages();
  }

  /**
   * 为新添加的图片初始化懒加载
   */
  initLazyLoadingForNewImages() {
    const newImages = document.querySelectorAll('img[data-src]:not(.loaded)');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.01
      });

      newImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback
      newImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }

  /**
   * 动态加载News部分
   */
  loadNews() {
    const news = this.config.news;
    const newsContainer = document.querySelector('#news .timeline');
    
    if (!newsContainer || !news.items) return;
    
    // 清空现有内容
    newsContainer.innerHTML = '';
    
    news.items.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'timeline-item card';
      
      const linkHTML = item.link ? 
        `<a href="${item.link.url}" target="_blank">${item.link.text}</a>` : '';
      
      newsItem.innerHTML = `
        <div class="timeline-date">
          <span class="badge badge-accent">${item.date}</span>
        </div>
        <div class="timeline-content">
          <h4>${item.title}</h4>
          <p>${item.content} ${linkHTML}</p>
        </div>
      `;
      
      newsContainer.appendChild(newsItem);
    });
  }

  /**
   * 动态加载Awards部分
   */
  loadAwards() {
    const awards = this.config.awards;
    const awardsList = document.querySelector('#awards .awards-list');
    
    console.log('Loading awards:', awards?.items?.length, 'items');
    console.log('Awards container found:', !!awardsList);
    
    if (!awardsList || !awards.items) {
      return;
    }
    
    // 清空现有内容
    awardsList.innerHTML = '';
    console.log('Cleared awards container');
    
    // 添加每个奖项
    awards.items.forEach(award => {
      const listItem = document.createElement('li');
      listItem.className = 'award-item';
      
      listItem.innerHTML = `
        <span class="award-name">${award.name}</span>
        <span class="award-year">${award.year}</span>
      `;
      
      awardsList.appendChild(listItem);
    });
    
    console.log('Awards loaded successfully');
  }

  /**
   * 动态加载Teaching部分
   */
  loadTeaching() {
    const teaching = this.config.teaching;
    const teachingContainer = document.querySelector('#teaching .teaching-content');
    
    if (!teachingContainer || !teaching.courses) return;
    
    // 清空现有内容
    teachingContainer.innerHTML = '';
    
    teaching.courses.forEach(course => {
      const courseCard = document.createElement('div');
      courseCard.className = 'teaching-card card';
      
      const materials = (course.materials || []).flatMap(group => group.items || []);
      courseCard.innerHTML = `
        <div class="card-content">
          <div class="course-header"><h3 class="course-title">${course.title}</h3><span class="badge badge-accent">${course.role}</span></div>
          <div class="course-info"><p>${course.period} · ${course.institution}</p></div>
          <p>${course.description}</p>
          ${course.link ? `<a class="btn btn-outline" href="${course.link}">${this.t('coursePage')} <span aria-hidden="true">→</span></a>` : ''}
          ${materials.length ? `<details class="course-materials"><summary>${this.t('notes', { count: materials.length })}</summary><div class="materials-grid">${materials.map(item => `<a class="material-item" href="${item.file}" target="_blank" rel="noopener noreferrer"><i class="fas fa-file-pdf" aria-hidden="true"></i><span>${item.name}</span></a>`).join('')}</div></details>` : ''}
        </div>`;
      
      teachingContainer.appendChild(courseCard);
    });
  }

  /**
   * 动态加载Talks部分
   */
  loadTalks() {
    // 这里可以添加talks的动态加载逻辑
    console.log('Talks section loading...');
  }

  /**
   * 动态加载Resources部分
   */
  loadResources() {
    const container = document.querySelector('#resources .resources-grid');
    if (!container) return;
    container.innerHTML = this.config.resources.categories.map(category => `<div class="resource-category card"><div class="card-content"><h3>${category.name}</h3><div class="resource-items">${category.items.map(item => `<a class="resource-item" href="${item.url}" target="_blank" rel="noopener noreferrer"><strong>${item.name} <span aria-hidden="true">↗</span></strong><span>${item.description}</span></a>`).join('')}</div></div>`).join('');
  }

  /**
   * 添加测试方法来验证配置加载
   */
  testConfigLoading() {
    if (typeof SITE_CONFIG !== 'undefined') {
      console.log('✓ SITE_CONFIG is available');
      console.log('✓ Projects:', SITE_CONFIG.projects?.featured?.length || 0);
      console.log('✓ Publications:', SITE_CONFIG.projects?.publications?.length || 0);
      return true;
    } else {
      console.error('✗ SITE_CONFIG is not available');
      return false;
    }
  }

  /**
   * 获取链接类型对应的文本
   */
  getLinkTypeText(type) {
    const typeMap = {
      'arxiv': 'arXiv',
      'journal': this.t('fullText'),
      'conference': this.t('conference'),
      'pdf': 'PDF',
      'demo': this.t('demo'),
      'code': this.t('code'),
      'dataset': this.t('dataset'),
      'bibtex': 'BibTeX'
    };
    return typeMap[type] || this.t('link');
  }

  /**
   * 获取链接类型对应的图标
   */
  getLinkTypeIcon(type) {
    const iconMap = {
      'arxiv': 'fas fa-external-link-alt',
      'journal': 'fas fa-file-pdf',
      'conference': 'fas fa-university',
      'pdf': 'fas fa-file-pdf',
      'demo': 'fas fa-play-circle',
      'code': 'fas fa-code',
      'dataset': 'fas fa-database',
      'bibtex': 'fas fa-quote-left'
    };
    return iconMap[type] || 'fas fa-link';
  }

  /**
   * 动态加载项目过滤器
   */
  loadProjectFilters() {
    const projects = this.config.projects.featured;
    const filterContainer = document.querySelector('#projects .filter-buttons');
    
    if (!filterContainer || !projects) return;
    
    // 收集所有标签
    const allTags = new Set();
    projects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    // 清空现有按钮
    filterContainer.innerHTML = '';
    
    // 添加"All"按钮
    const allButton = document.createElement('button');
    allButton.className = 'btn btn-outline filter-btn active';
    allButton.setAttribute('data-filter', 'all');
    allButton.textContent = this.t('all');
    allButton.setAttribute('aria-pressed', 'true');
    filterContainer.appendChild(allButton);
    
    // 为每个标签创建过滤按钮
    Array.from(allTags).sort().forEach(tag => {
      const button = document.createElement('button');
      button.className = 'btn btn-outline filter-btn';
      button.setAttribute('data-filter', tag.toLowerCase().replace(/\s+/g, ''));
      button.textContent = tag;
      button.setAttribute('aria-pressed', 'false');
      filterContainer.appendChild(button);
    });
    
    // 重新初始化过滤器功能
    this.initProjectFilters();
  }

  /**
   * 初始化项目过滤器功能
   */
  initProjectFilters() {
    const filterButtons = document.querySelectorAll('#projects .filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // 更新活动按钮
        filterButtons.forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        // 过滤项目
        projects.forEach(project => {
          if (filter === 'all' || project.dataset.category.split(' ').includes(filter)) {
            project.style.display = 'block';
            project.classList.add('show');
          } else {
            project.classList.remove('show');
            project.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * 生成BibTeX引用
   */
  generateBibTeX(item) {
    if (item.bibtex) return item.bibtex;
    const firstAuthor = item.authors[0].split(' ').pop().toLowerCase();
    const year = item.year || item.date?.match(/\d{4}/)?.[0];
    const key = `${firstAuthor}${year}${item.title.split(' ').slice(0, 3).join('')}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const conference = item.publicationType === 'inproceedings' || /MICCAI|KDD|Conference/.test(item.venue);
    const type = item.publicationType || (conference ? 'inproceedings' : 'article');
    const fields = {
      title: `{${item.title}}`,
      author: item.authors.map(author => author === 'et al.' ? 'others' : author).join(' and '),
      [conference ? 'booktitle' : 'journal']: type === 'misc' ? undefined : item.venue,
      year, volume: item.volume, number: item.issue, pages: item.pages,
      publisher: item.publisher, doi: item.doi, note: item.note,
      eprint: item.eprint, archivePrefix: item.archivePrefix, primaryClass: item.primaryClass
    };
    if (item.doi) fields.url = `https://doi.org/${item.doi}`;
    const escape = value => String(value).replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/_/g, '\\_');
    const content = Object.entries(fields).filter(([, value]) => value !== undefined && value !== '').map(([name, value]) => `  ${name}={${escape(value)}}`).join(',\n');
    return `@${type}{${key},\n${content}\n}`;
  }

}

// Render before page interactions initialize; every page uses the same content source.
document.addEventListener('DOMContentLoaded', () => {
  const loader = new DynamicContentLoader();
  window.dynamicContentLoader = loader;
  loader.init();
  document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');
});
