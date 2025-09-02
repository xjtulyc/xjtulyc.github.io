/**
 * 配置加载器 - 从配置文件动态生成页面内容
 * Configuration Loader - Dynamically generate page content from configuration
 * 
 * @author Youcheng Li
 * @version 1.0.0
 */

class ConfigLoader {
  constructor() {
    this.config = null;
    this.currentPage = this.detectCurrentPage();
  }

  /**
   * 检测当前页面类型
   * Detect current page type
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('projects.html')) return 'projects';
    if (path.includes('teaching.html')) return 'teaching';
    if (path.includes('awesome.html')) return 'resources';
    return 'home';
  }

  /**
   * 初始化配置加载器
   * Initialize the configuration loader
   */
  async init() {
    try {
      // 等待配置文件加载
      if (typeof SITE_CONFIG === 'undefined') {
        throw new Error('Site configuration not loaded');
      }
      
      this.config = SITE_CONFIG;
      
      // 根据页面类型加载对应内容
      switch (this.currentPage) {
        case 'home':
          this.loadHomePage();
          break;
        case 'projects':
          this.loadProjectsPage();
          break;
        case 'teaching':
          this.loadTeachingPage();
          break;
        case 'resources':
          this.loadResourcesPage();
          break;
      }
      
      // 加载通用内容
      this.loadSidebar();
      this.loadSEO();
      
      console.log('Configuration loaded successfully for page:', this.currentPage);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.showErrorMessage();
    }
  }

  /**
   * 加载首页内容
   * Load home page content
   */
  loadHomePage() {
    this.loadAboutSection();
    this.loadNewsSection();
    this.loadResearchSection();
    this.loadAwardsSection();
  }

  /**
   * 加载关于我部分
   * Load about section
   */
  loadAboutSection() {
    const about = this.config.about;
    
    // 更新标题和副标题
    const titleElement = document.querySelector('#about .section-title');
    const subtitleElement = document.querySelector('#about .section-subtitle');
    
    if (titleElement) titleElement.textContent = about.title;
    if (subtitleElement) subtitleElement.textContent = about.subtitle;
    
    // 更新内容段落
    const contentContainer = document.querySelector('#about .card-content');
    if (contentContainer && about.content) {
      // 清除现有内容（保留研究兴趣和使命宣言）
      const paragraphs = contentContainer.querySelectorAll('p:not(.mission-statement p)');
      paragraphs.forEach(p => {
        if (!p.closest('.research-interests') && !p.closest('.mission-statement')) {
          p.remove();
        }
      });
      
      // 添加新段落
      const researchInterests = contentContainer.querySelector('.research-interests');
      about.content.forEach((item, index) => {
        const p = document.createElement('p');
        p.innerHTML = item.text;
        if (researchInterests) {
          contentContainer.insertBefore(p, researchInterests);
        } else {
          contentContainer.appendChild(p);
        }
      });
    }
    
    // 更新研究兴趣
    if (about.researchInterests) {
      const interestsTitle = document.querySelector('#about .research-interests h4');
      const badgesContainer = document.querySelector('#about .badges-container');
      
      if (interestsTitle) interestsTitle.textContent = about.researchInterests.title;
      if (badgesContainer) {
        badgesContainer.innerHTML = '';
        about.researchInterests.interests.forEach(interest => {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = interest;
          badgesContainer.appendChild(badge);
        });
      }
    }
    
    // 更新使命宣言
    const missionElement = document.querySelector('#about .mission-statement');
    if (missionElement && about.mission) {
      missionElement.innerHTML = `<strong>Mission:</strong> ${about.mission}`;
    }
  }

  /**
   * 加载新闻部分
   * Load news section
   */
  loadNewsSection() {
    const news = this.config.news;
    
    // 更新标题和副标题
    const titleElement = document.querySelector('#news .section-title');
    const subtitleElement = document.querySelector('#news .section-subtitle');
    
    if (titleElement) titleElement.textContent = news.title;
    if (subtitleElement) subtitleElement.textContent = news.subtitle;
    
    // 更新时间线内容
    const timeline = document.querySelector('#news .timeline');
    if (timeline && news.items) {
      timeline.innerHTML = '';
      
      news.items.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item card';
        
        let linkHtml = '';
        if (item.link) {
          linkHtml = `<a href="${item.link.url}" target="_blank">${item.link.text}</a>`;
        }
        
        timelineItem.innerHTML = `
          <div class="timeline-date">
            <span class="badge badge-accent">${item.date}</span>
          </div>
          <div class="timeline-content">
            <h4>${item.title}</h4>
            <p>${item.content}${linkHtml ? ' ' + linkHtml : ''}</p>
          </div>
        `;
        
        timeline.appendChild(timelineItem);
      });
    }
  }

  /**
   * 加载研究部分
   * Load research section
   */
  loadResearchSection() {
    const research = this.config.research;
    
    // 更新标题和副标题
    const titleElement = document.querySelector('#research .section-title');
    const subtitleElement = document.querySelector('#research .section-subtitle');
    
    if (titleElement) titleElement.textContent = research.title;
    if (subtitleElement) subtitleElement.textContent = research.subtitle;
    
    // 更新研究亮点
    const researchContainer = document.querySelector('#research .row');
    if (researchContainer && research.highlights) {
      researchContainer.innerHTML = '';
      
      research.highlights.forEach(highlight => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6';
        
        colDiv.innerHTML = `
          <div class="card research-card">
            <div class="card-content">
              <h4 class="card-title">${highlight.title}</h4>
              <p>${highlight.description}</p>
              <a href="${highlight.link}" class="btn btn-outline mt-3">Learn More</a>
            </div>
          </div>
        `;
        
        researchContainer.appendChild(colDiv);
      });
    }
  }

  /**
   * 加载奖项部分
   * Load awards section
   */
  loadAwardsSection() {
    const awards = this.config.awards;
    
    // 更新标题和副标题
    const titleElement = document.querySelector('#awards .section-title');
    const subtitleElement = document.querySelector('#awards .section-subtitle');
    
    if (titleElement) titleElement.textContent = awards.title;
    if (subtitleElement) subtitleElement.textContent = awards.subtitle;
    
    // 更新奖项列表
    const awardsList = document.querySelector('#awards .awards-list');
    if (awardsList && awards.items) {
      awardsList.innerHTML = '';
      
      awards.items.forEach(award => {
        const listItem = document.createElement('li');
        listItem.className = 'award-item';
        
        listItem.innerHTML = `
          <span class="award-name">${award.name}</span>
          <span class="award-year">${award.year}</span>
        `;
        
        awardsList.appendChild(listItem);
      });
    }
  }

  /**
   * 加载项目页面内容
   * Load projects page content
   */
  loadProjectsPage() {
    this.loadProjectsList();
    this.loadPublications();
  }

  /**
   * 加载项目列表
   * Load projects list
   */
  loadProjectsList() {
    const projects = this.config.projects;
    
    // 更新页面标题
    document.title = this.config.pages.projects.seo.title;
    
    // 这里可以添加更多项目页面特定的内容加载逻辑
    console.log('Loading projects page with', projects.featured?.length || 0, 'featured projects');
  }

  /**
   * 加载出版物列表
   * Load publications list
   */
  loadPublications() {
    const publications = this.config.projects.publications;
    
    // 查找出版物容器
    const pubContainer = document.querySelector('#publications .publications-list');
    if (pubContainer && publications) {
      pubContainer.innerHTML = '';
      
      publications.forEach(yearGroup => {
        const yearSection = document.createElement('div');
        yearSection.className = 'year-section';
        
        yearSection.innerHTML = `<h3>${yearGroup.year}</h3>`;
        
        yearGroup.items.forEach(pub => {
          const pubItem = document.createElement('div');
          pubItem.className = 'publication-item card';
          
          let linksHtml = '';
          if (pub.links) {
            linksHtml = pub.links.map(link => 
              `<a href="${link.url}" target="_blank" class="pub-link">[${link.type}]</a>`
            ).join(' ');
          }
          
          let tagsHtml = '';
          if (pub.tags) {
            tagsHtml = pub.tags.map(tag => 
              `<span class="badge">${tag}</span>`
            ).join('');
          }
          
          pubItem.innerHTML = `
            <div class="card-content">
              <h4>${pub.title}</h4>
              <p class="authors">${pub.authors.join(', ')}</p>
              <p class="venue">${pub.venue}, ${pub.date}</p>
              ${linksHtml ? `<div class="pub-links">${linksHtml}</div>` : ''}
              ${tagsHtml ? `<div class="pub-tags">${tagsHtml}</div>` : ''}
            </div>
          `;
          
          yearSection.appendChild(pubItem);
        });
        
        pubContainer.appendChild(yearSection);
      });
    }
  }

  /**
   * 加载教学页面内容
   * Load teaching page content
   */
  loadTeachingPage() {
    const teaching = this.config.teaching;
    
    // 更新页面标题
    document.title = this.config.pages.teaching.seo.title;
    
    // 加载课程列表
    const coursesContainer = document.querySelector('#teaching-courses .courses-list');
    if (coursesContainer && teaching.courses) {
      coursesContainer.innerHTML = '';
      
      teaching.courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item card';
        
        let materialsHtml = '';
        if (course.materials) {
          materialsHtml = course.materials.map(material => {
            const itemsHtml = material.items.map(item => 
              `<li><a href="${item.file}" target="_blank">${item.name}</a></li>`
            ).join('');
            return `
              <div class="course-materials">
                <h5>${material.title}</h5>
                <p>${material.description}</p>
                <ul>${itemsHtml}</ul>
              </div>
            `;
          }).join('');
        }
        
        courseItem.innerHTML = `
          <div class="card-content">
            <h3>${course.title}</h3>
            <p class="course-meta">${course.role} | ${course.period} | ${course.institution}</p>
            <p>${course.description}</p>
            ${course.link ? `<a href="${course.link}" class="btn btn-outline">Course Details</a>` : ''}
            ${materialsHtml}
          </div>
        `;
        
        coursesContainer.appendChild(courseItem);
      });
    }
  }

  /**
   * 加载资源页面内容
   * Load resources page content
   */
  loadResourcesPage() {
    const resources = this.config.resources;
    
    // 更新页面标题
    document.title = this.config.pages.resources.seo.title;
    
    // 加载资源分类
    const resourcesContainer = document.querySelector('#resources .resources-grid');
    if (resourcesContainer && resources.categories) {
      resourcesContainer.innerHTML = '';
      
      resources.categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'resource-category';
        
        categorySection.innerHTML = `<h3>${category.name}</h3>`;
        
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'resource-items-grid';
        
        category.items.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.className = 'resource-item card';
          
          itemElement.innerHTML = `
            <div class="card-content">
              <div class="resource-icon">
                <img src="${item.icon}" alt="${item.name}" />
              </div>
              <h4>${item.name}</h4>
              <p>${item.description}</p>
              <a href="${item.url}" target="_blank" class="btn btn-outline">Visit</a>
            </div>
          `;
          
          itemsGrid.appendChild(itemElement);
        });
        
        categorySection.appendChild(itemsGrid);
        resourcesContainer.appendChild(categorySection);
      });
    }
  }

  /**
   * 加载侧边栏内容
   * Load sidebar content
   */
  loadSidebar() {
    const personal = this.config.personal;
    
    // 更新个人信息
    const profileName = document.querySelector('.profile-name');
    const profileNameChinese = document.querySelectorAll('.profile-name')[1];
    const profileTitle = document.querySelector('.profile-title');
    const profileInstitution = document.querySelectorAll('.profile-title')[1];
    const profileImage = document.querySelector('.profile-image');
    
    if (profileName) profileName.textContent = personal.name.english;
    if (profileNameChinese) profileNameChinese.textContent = personal.name.chinese;
    if (profileTitle) profileTitle.textContent = personal.position.title;
    if (profileInstitution) profileInstitution.textContent = personal.position.institution;
    if (profileImage) {
      profileImage.src = personal.avatar;
      profileImage.alt = personal.name.english;
    }
    
    // 更新联系信息
    const contactItems = document.querySelectorAll('.contact-info-item');
    contactItems.forEach((item, index) => {
      const link = item.querySelector('a');
      if (link && personal.contact.emails[index]) {
        link.href = `mailto:${personal.contact.emails[index]}`;
        link.textContent = personal.contact.emails[index];
      }
    });
    
    // 更新CV链接
    const cvLink = document.querySelector('.cv-download');
    if (cvLink) {
      cvLink.href = personal.contact.cv;
    }
    
    // 更新社交链接
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
      const socialData = personal.social[index];
      if (socialData) {
        link.href = socialData.url;
        link.setAttribute('data-tooltip', socialData.tooltip);
        const icon = link.querySelector('i');
        if (icon) {
          icon.className = socialData.icon;
        }
      }
    });
    
    // 更新导航链接
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((navItem, index) => {
      const navData = this.config.navigation.sidebar[index];
      if (navData) {
        navItem.href = navData.href;
        const icon = navItem.querySelector('.nav-icon');
        if (icon) {
          icon.className = navData.icon + ' nav-icon';
        }
        // 更新导航文本（保持现有文本，或使用配置中的标签）
        const textNode = navItem.childNodes[navItem.childNodes.length - 1];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = navData.label;
        }
      }
    });
  }

  /**
   * 加载SEO信息
   * Load SEO information
   */
  loadSEO() {
    const seo = this.currentPage === 'home' ? this.config.seo : this.config.pages[this.currentPage]?.seo;
    
    if (!seo) return;
    
    // 更新页面标题
    document.title = seo.title;
    
    // 更新meta标签
    this.updateMetaTag('name', 'description', seo.description);
    this.updateMetaTag('name', 'keywords', seo.keywords);
    
    // 更新Open Graph标签（仅首页）
    if (this.currentPage === 'home' && this.config.seo.openGraph) {
      const og = this.config.seo.openGraph;
      this.updateMetaTag('property', 'og:title', og.title);
      this.updateMetaTag('property', 'og:description', og.description);
      this.updateMetaTag('property', 'og:image', og.image);
      this.updateMetaTag('property', 'og:type', og.type);
    }
    
    // 更新Twitter Card标签（仅首页）
    if (this.currentPage === 'home' && this.config.seo.twitter) {
      const twitter = this.config.seo.twitter;
      this.updateMetaTag('name', 'twitter:card', twitter.card);
      this.updateMetaTag('name', 'twitter:title', twitter.title);
      this.updateMetaTag('name', 'twitter:description', twitter.description);
      this.updateMetaTag('name', 'twitter:image', twitter.image);
    }
    
    // 更新结构化数据（仅首页）
    if (this.currentPage === 'home' && this.config.seo.structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.textContent = JSON.stringify(this.config.seo.structuredData);
      }
    }
  }

  /**
   * 更新meta标签
   * Update meta tag
   */
  updateMetaTag(attribute, name, content) {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  /**
   * 显示错误信息
   * Show error message
   */
  showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'config-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4757;
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
    `;
    errorDiv.innerHTML = `
      <h4>Configuration Error</h4>
      <p>Failed to load site configuration. Please check the console for details.</p>
    `;
    document.body.appendChild(errorDiv);
    
    // 5秒后自动移除
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * 获取配置数据
   * Get configuration data
   */
  getConfig() {
    return this.config;
  }

  /**
   * 获取特定部分的配置
   * Get configuration for specific section
   */
  getSection(sectionName) {
    return this.config?.[sectionName] || null;
  }
}

// 创建全局配置加载器实例
// Create global configuration loader instance
window.configLoader = new ConfigLoader();

// DOM加载完成后初始化
// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // 延迟初始化以确保配置文件已加载
  setTimeout(() => {
    window.configLoader.init();
  }, 100);
});

// 工具函数：安全获取配置值
// Utility function: Safely get configuration value
window.getConfigValue = function(path, defaultValue = null) {
  try {
    const keys = path.split('.');
    let value = window.configLoader.getConfig();
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  } catch (error) {
    console.warn(`Failed to get config value for path: ${path}`, error);
    return defaultValue;
  }
};

// 导出模块（如果支持）
// Export module (if supported)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigLoader;
}