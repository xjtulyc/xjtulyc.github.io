/**
 * 动态内容加载器 - 从配置文件完全动态生成页面内容
 * Dynamic Content Loader - Fully dynamic page content generation from configuration
 */

class DynamicContentLoader {
  constructor() {
    this.config = null;
  }

  async init() {
    try {
      // 等待配置文件加载
      if (typeof SITE_CONFIG === 'undefined') {
        // 如果配置未加载，等待一下再试
        setTimeout(() => this.init(), 100);
        return;
      }
      
      this.config = SITE_CONFIG;
      
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
    this.loadPublications();
    this.loadProjects();
    this.loadNews();
    this.loadAwards();
    this.loadTeaching();
    this.loadTalks();
    this.loadResources();
    this.loadProjectFilters();
    this.loadSemanticScholarCitations();
    
    // 重新初始化所有交互功能
    this.reinitializeInteractions();
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
          socialLinks[index].innerHTML = `<i class="${social.icon}"></i>`;
        }
      });
    }
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
      console.error('Publications container or data not found');
      return;
    }
    
    // 清空现有内容
    pubContainer.innerHTML = '';
    console.log('Cleared publications container');
    
    // 创建年份过滤器
    const yearFilter = document.createElement('div');
    yearFilter.className = 'year-filter mb-4';
    yearFilter.innerHTML = '<span class="year-badge active" data-year="all">All</span>';
    
    // 添加年份标签
    publications.forEach(yearGroup => {
      const yearBadge = document.createElement('span');
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
      yearHeader.innerHTML = `${yearGroup.year} <i class="fas fa-chevron-down toggle-icon"></i>`;
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
          '<span class="publication-note">† co-first author</span>' : '';
        
        // 处理期刊信息
        const venueInfo = item.volume && item.issue ? 
          `${item.venue} ${item.volume}(${item.issue}): ${item.pages}` : 
          item.venue;
        
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
              <button class="btn btn-sm btn-outline copy-bibtex" data-bibtex="${this.generateBibTeX(item)}">
                <i class="fas fa-quote-left"></i> BibTeX
              </button>
            </div>
          </div>
        `;
        
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
    const yearHeaders = document.querySelectorAll('#publications .year-header');
    
    yearHeaders.forEach(header => {
      header.style.cursor = 'pointer';
      
      header.addEventListener('click', () => {
        const yearSection = header.parentElement;
        const items = yearSection.querySelectorAll('.publication-item');
        const icon = header.querySelector('.toggle-icon');
        const isCollapsed = items.length > 0 && items[0].style.display === 'none';
        
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
        yearBadges.forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        
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
    const label = semanticScholarId ? 'Citations loading' : this.formatCitationLabel(fallback);

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
        element.title = 'Citation count from Semantic Scholar';
        return;
      }

      const fallback = Number.parseInt(element.dataset.citationFallback, 10);
      if (Number.isFinite(fallback)) {
        labelElement.textContent = this.formatCitationLabel(fallback);
        element.classList.remove('is-loading');
        element.classList.add('is-unavailable');
        element.title = 'Fallback citation count; Semantic Scholar data is unavailable';
      } else {
        element.remove();
      }
    });
  }

  formatCitationLabel(count) {
    return `${count} ${count === 1 ? 'citation' : 'citations'}`;
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
      console.error('Projects container or data not found');
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
        <div class="project-image">
          <img data-src="${project.image}" alt="${project.title}" class="lazy">
        </div>
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
      console.error('Awards container or data not found');
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
      
      courseCard.innerHTML = `
        <div class="card-content">
          <div class="course-header">
            <h4 class="course-title">${course.title}</h4>
            <span class="badge badge-accent">${course.role}</span>
          </div>
          <div class="course-info">
            <p><i class="fas fa-calendar"></i> ${course.period}</p>
            <p><i class="fas fa-university"></i> ${course.institution}</p>
          </div>
          <div class="course-description">
            <p>${course.description}</p>
          </div>
        </div>
      `;
      
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
    // 这里可以添加resources的动态加载逻辑
    console.log('Resources section loading...');
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
      'journal': 'Full Text',
      'conference': 'Conference',
      'pdf': 'PDF',
      'demo': 'Demo',
      'code': 'Code',
      'dataset': 'Dataset',
      'bibtex': 'BibTeX'
    };
    return typeMap[type] || 'Link';
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
    allButton.textContent = 'All';
    filterContainer.appendChild(allButton);
    
    // 为每个标签创建过滤按钮
    Array.from(allTags).sort().forEach(tag => {
      const button = document.createElement('button');
      button.className = 'btn btn-outline filter-btn';
      button.setAttribute('data-filter', tag.toLowerCase().replace(/\s+/g, ''));
      button.textContent = tag;
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
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 过滤项目
        projects.forEach(project => {
          if (filter === 'all' || project.dataset.category.includes(filter)) {
            project.style.display = 'block';
            project.classList.add('show');
          } else {
            project.classList.remove('show');
            setTimeout(() => project.style.display = 'none', 300);
          }
        });
      });
    });
  }

  /**
   * 生成BibTeX引用
   */
  generateBibTeX(item) {
    const firstAuthor = item.authors[0].split(' ').pop().toLowerCase();
    const year = item.date.match(/\d{4}/)?.[0] || '2024';
    const title = item.title.split(' ').slice(0, 3).join('').toLowerCase();
    
    if (item.venue.includes('arXiv')) {
      return `@article{${firstAuthor}${year}${title},
  title={${item.title}},
  author={${item.authors.join(' and ')}},
  journal={${item.venue}},
  year={${year}}
}`;
    } else if (item.venue.includes('MICCAI') || item.venue.includes('KDD') || item.venue.includes('Conference')) {
      return `@inproceedings{${firstAuthor}${year}${title},
  title={${item.title}},
  author={${item.authors.join(' and ')}},
  booktitle={${item.venue}},
  pages={${item.pages || ''}},
  year={${year}},
  publisher={${item.publisher || 'Springer'}}
}`;
    } else {
      return `@article{${firstAuthor}${year}${title},
  title={${item.title}},
  author={${item.authors.join(' and ')}},
  journal={${item.venue}},
  volume={${item.volume || ''}},
  number={${item.issue || ''}},
  pages={${item.pages || ''}},
  year={${year}}
}`;
    }
  }
}

// 初始化动态内容加载器
document.addEventListener('DOMContentLoaded', () => {
  // 延迟一点确保配置文件和其他脚本已加载
  setTimeout(() => {
    const loader = new DynamicContentLoader();
    loader.init();
    
    // 验证功能
    setTimeout(() => {
      console.log('=== Dynamic Content Verification ===');
      console.log('Projects loaded:', document.querySelectorAll('.project-card').length);
      console.log('Publications loaded:', document.querySelectorAll('.publication-item').length);
      console.log('Year badges:', document.querySelectorAll('#publications .year-badge').length);
      console.log('Filter buttons:', document.querySelectorAll('#projects .filter-btn').length);
      
      // 手动触发必要的重新初始化
      if (window.spaApp) {
        console.log('Re-initializing SPA features...');
        window.spaApp.initNewsExpansion();
        window.spaApp.initTalksExpansion();
        window.spaApp.initProjectCardExpansion();
        window.spaApp.initLazyLoading();
      }
    }, 500);
  }, 300); // 增加延迟确保single-page-app.js已初始化
});
