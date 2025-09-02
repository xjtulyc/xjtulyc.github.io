/**
 * Single Page Application Functionality
 * Handles collapsible sections, smooth scrolling, scroll spy, and dynamic content
 * 
 * @author Youcheng Li
 * @version 1.0.0
 */

class SinglePageApp {
  constructor() {
    this.config = window.SITE_CONFIG || {};
    this.spa = this.config.spa || {};
    this.scrollSettings = this.spa.scrollSettings || {};
    this.displaySettings = this.spa.displaySettings || {};
    this.animations = this.spa.animations || {};
    
    this.currentSection = '';
    this.scrollTimeout = null;
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    this.initScrollSpy();
    this.initSmoothScrolling();
    this.initCollapsibleSections();
    this.initBackToTop();
    this.initProgressIndicator();
    this.initLazyLoading();
    this.initNewsExpansion();
    this.initProjectFilters();
    this.initPublicationYearToggle();
    this.initTeachingExpansion();
    this.initTalksExpansion();
    this.initResourcesToggle();
    this.initResponsiveHandlers();
    
    // Initialize animations on scroll
    this.initScrollAnimations();
  }

  // ========================================
  // Scroll Spy and Navigation
  // ========================================
  
  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item[href^="#"]');
    
    const observerOptions = {
      root: null,
      rootMargin: `-${this.scrollSettings.offset || 80}px 0px -70% 0px`,
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavItem(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveNavItem(sectionId) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === `#${sectionId}`) {
        item.classList.add('active');
      }
    });
    
    this.currentSection = sectionId;
  }

  initSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.scrollToElement(targetElement);
        }
      }
    });
  }

  scrollToElement(element) {
    const offset = this.scrollSettings.offset || 80;
    const targetPosition = element.offsetTop - offset;
    
    this.isScrolling = true;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Add highlight effect to target section
    this.highlightSection(element);
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, this.animations.scrollDuration || 800);
  }

  /**
   * 添加section高亮效果
   * Add highlight effect to section
   */
  highlightSection(element) {
    // Remove existing highlight
    element.classList.remove('section-highlight');
    
    // Add highlight class after scroll animation
    setTimeout(() => {
      element.classList.add('section-highlight');
      
      // Remove highlight class after animation completes
      setTimeout(() => {
        element.classList.remove('section-highlight');
      }, 1500);
    }, this.animations.scrollDuration || 800);
  }

  // ========================================
  // Progress Indicator and Back to Top
  // ========================================
  
  initProgressIndicator() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }

    let ticking = false;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset;
      const progress = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
  }

  initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // Lazy Loading
  // ========================================
  
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    // Function to load an image
    const loadImage = (img) => {
      const src = img.dataset.src;
      if (!src) return;
      
      // Create a new image to preload
      const newImg = new Image();
      newImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      newImg.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        img.classList.add('error');
        // Optionally set a fallback image
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
        img.classList.add('loaded');
      };
      newImg.src = src;
    };
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      images.forEach(img => loadImage(img));
    }
  }

  // ========================================
  // News Section Expansion
  // ========================================
  
  initNewsExpansion() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;

    const newsSettings = this.displaySettings.news || {};
    const initialCount = newsSettings.initialCount || 3;
    const newsItems = newsSection.querySelectorAll('.timeline-item');

    if (newsItems.length <= initialCount) return;

    // Hide extra items initially
    newsItems.forEach((item, index) => {
      if (index >= initialCount) {
        item.style.display = 'none';
        item.classList.add('hidden-news');
      }
    });

    // Check if expand button already exists
    let expandButton = newsSection.querySelector('.expand-news-btn');
    if (!expandButton) {
      // Create expand button
      expandButton = document.createElement('button');
      expandButton.className = 'btn btn-outline expand-news-btn';
      expandButton.innerHTML = `<i class="fas fa-chevron-down"></i> ${newsSettings.expandText || 'Show More News'}`;
      
      const newsContainer = newsSection.querySelector('.timeline');
      newsContainer.appendChild(expandButton);
    }

    // 移除旧的事件监听器，避免重复绑定
    expandButton.replaceWith(expandButton.cloneNode(true));
    expandButton = newsSection.querySelector('.expand-news-btn');
    
    expandButton.addEventListener('click', () => {
      const hiddenItems = newsSection.querySelectorAll('.hidden-news');
      const isExpanding = hiddenItems.length > 0 && hiddenItems[0].style.display === 'none';

      if (isExpanding) {
        // Expand
        hiddenItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.display = 'block';
            item.classList.add('fade-in');
          }, index * (this.animations.staggerDelay || 100));
        });
        expandButton.innerHTML = `<i class="fas fa-chevron-up"></i> ${newsSettings.collapseText || 'Show Less'}`;
      } else {
        // Collapse
        hiddenItems.forEach(item => {
          item.style.display = 'none';
          item.classList.remove('fade-in');
        });
        expandButton.innerHTML = `<i class="fas fa-chevron-down"></i> ${newsSettings.expandText || 'Show More News'}`;
        
        // Scroll back to news section
        this.scrollToElement(newsSection);
      }
    });
  }

  // ========================================
  // Project Filters and Cards
  // ========================================
  
  initProjectFilters() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const filterButtons = projectsSection.querySelectorAll('.filter-btn');
    const projectCards = projectsSection.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        projectCards.forEach(card => {
          const category = card.dataset.category;
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.classList.add('fade-in');
          } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
          }
        });
      });
    });

    // Add expand/collapse functionality to project cards
    this.initProjectCardExpansion();
  }

  initProjectCardExpansion() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const content = card.querySelector('.project-content');
      const description = card.querySelector('.project-description');
      
      if (description && description.textContent.length > 150) {
        // 检查是否已经有展开按钮
        let expandButton = content.querySelector('.expand-project-btn');
        if (expandButton) return; // 如果已经处理过，跳过
        
        const fullText = description.textContent;
        const truncatedText = fullText.substring(0, 150) + '...';
        
        description.textContent = truncatedText;
        
        expandButton = document.createElement('button');
        expandButton.className = 'btn btn-sm btn-link expand-project-btn';
        expandButton.textContent = 'Read More';
        
        content.insertBefore(expandButton, description.nextSibling);
        
        let isExpanded = false;
        expandButton.addEventListener('click', () => {
          if (isExpanded) {
            description.textContent = truncatedText;
            expandButton.textContent = 'Read More';
          } else {
            description.textContent = fullText;
            expandButton.textContent = 'Read Less';
          }
          isExpanded = !isExpanded;
        });
      }
    });
  }

  // ========================================
  // Publications Year Toggle
  // ========================================
  
  initPublicationYearToggle() {
    const publicationsSection = document.getElementById('publications');
    if (!publicationsSection) return;

    const yearBadges = publicationsSection.querySelectorAll('.year-badge');
    const publicationYears = publicationsSection.querySelectorAll('.publication-year');

    // Make years collapsible
    publicationYears.forEach(yearGroup => {
      const header = yearGroup.querySelector('.year-header');
      if (header) {
        header.style.cursor = 'pointer';
        // 检查是否已经有toggle-icon，避免重复添加
        if (!header.querySelector('.toggle-icon')) {
          header.innerHTML += ' <i class="fas fa-chevron-down toggle-icon"></i>';
        }
        
        header.addEventListener('click', () => {
          const items = yearGroup.querySelectorAll('.publication-item');
          const icon = header.querySelector('.toggle-icon');
          const isCollapsed = items[0] && items[0].style.display === 'none';
          
          items.forEach(item => {
            item.style.display = isCollapsed ? 'block' : 'none';
          });
          
          icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)';
        });
      }
    });

    // Year filter functionality
    yearBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const targetYear = badge.dataset.year;
        
        // Update active badge
        yearBadges.forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        
        // Show/hide years
        publicationYears.forEach(yearGroup => {
          const year = yearGroup.dataset.year;
          
          if (targetYear === 'all' || year === targetYear) {
            yearGroup.style.display = 'block';
            yearGroup.classList.add('fade-in');
          } else {
            yearGroup.style.display = 'none';
            yearGroup.classList.remove('fade-in');
          }
        });
      });
    });
  }

  // ========================================
  // Teaching Section Expansion
  // ========================================
  
  initTeachingExpansion() {
    const teachingSection = document.getElementById('teaching');
    if (!teachingSection) return;

    const courseCards = teachingSection.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
      const header = card.querySelector('.course-header');
      const details = card.querySelector('.course-details');
      
      if (header && details) {
        header.addEventListener('click', () => {
          const isExpanded = details.style.display !== 'none';
          
          details.style.display = isExpanded ? 'none' : 'block';
          
          const icon = header.querySelector('.toggle-icon');
          if (icon) {
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        });
      }
    });
  }

  // ========================================
  // Talks Section Expansion
  // ========================================
  
  initTalksExpansion() {
    const talksSection = document.getElementById('talks');
    if (!talksSection) return;

    const talksSettings = this.displaySettings.talks || {};
    const initialCount = talksSettings.initialCount || 3;
    const talkItems = talksSection.querySelectorAll('.talk-item');

    if (talkItems.length <= initialCount) return;

    // Hide extra items initially
    talkItems.forEach((item, index) => {
      if (index >= initialCount) {
        item.style.display = 'none';
        item.classList.add('hidden-talk');
      }
    });

    // Check if expand button already exists
    let expandButton = talksSection.querySelector('.expand-talks-btn');
    if (!expandButton) {
      // Create expand button
      expandButton = document.createElement('button');
      expandButton.className = 'btn btn-outline expand-talks-btn';
      expandButton.innerHTML = `<i class="fas fa-chevron-down"></i> ${talksSettings.expandText || 'Show All Talks'}`;
      
      talksSection.appendChild(expandButton);
    }

    // 移除旧的事件监听器，避免重复绑定
    expandButton.replaceWith(expandButton.cloneNode(true));
    expandButton = talksSection.querySelector('.expand-talks-btn');
    
    expandButton.addEventListener('click', () => {
      const hiddenItems = talksSection.querySelectorAll('.hidden-talk');
      const isExpanding = hiddenItems.length > 0 && hiddenItems[0].style.display === 'none';

      if (isExpanding) {
        hiddenItems.forEach(item => {
          item.style.display = 'block';
          item.classList.add('fade-in');
        });
        expandButton.innerHTML = `<i class="fas fa-chevron-up"></i> ${talksSettings.collapseText || 'Show Recent Only'}`;
      } else {
        hiddenItems.forEach(item => {
          item.style.display = 'none';
          item.classList.remove('fade-in');
        });
        expandButton.innerHTML = `<i class="fas fa-chevron-down"></i> ${talksSettings.expandText || 'Show All Talks'}`;
        
        this.scrollToElement(talksSection);
      }
    });
  }

  // ========================================
  // Resources Section Toggle
  // ========================================
  
  initResourcesToggle() {
    const resourcesSection = document.getElementById('resources');
    if (!resourcesSection) return;

    const categories = resourcesSection.querySelectorAll('.resource-category');
    
    categories.forEach(category => {
      const header = category.querySelector('.category-header');
      const items = category.querySelector('.resource-items');
      
      if (header && items) {
        header.addEventListener('click', () => {
          const isExpanded = items.style.display !== 'none';
          
          items.style.display = isExpanded ? 'none' : 'block';
          
          const icon = header.querySelector('.toggle-icon');
          if (icon) {
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        });
      }
    });
  }

  // ========================================
  // Scroll Animations
  // ========================================
  
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  }

  // ========================================
  // Collapsible Sections
  // ========================================
  
  initCollapsibleSections() {
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle="collapse"]');
      if (!toggleBtn) return;

      const targetId = toggleBtn.getAttribute('data-target');
      const target = document.querySelector(targetId);
      
      if (target) {
        const isCollapsed = target.classList.contains('collapsed');
        
        if (isCollapsed) {
          target.classList.remove('collapsed');
          target.style.maxHeight = target.scrollHeight + 'px';
        } else {
          target.classList.add('collapsed');
          target.style.maxHeight = '0px';
        }
        
        // Update button icon
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-chevron-down');
          icon.classList.toggle('fa-chevron-up');
        }
      }
    });
  }

  // ========================================
  // Responsive Handlers
  // ========================================
  
  initResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Recalculate layouts and update responsive elements
    const isMobile = window.innerWidth < (this.spa.breakpoints?.mobile || 768);
    
    document.body.classList.toggle('mobile-view', isMobile);
    
    // Update grid layouts if needed
    this.updateGridLayouts();
  }

  updateGridLayouts() {
    // Update any grid layouts that need responsive adjustments
    const grids = document.querySelectorAll('.responsive-grid');
    
    grids.forEach(grid => {
      // Add responsive grid logic here if needed
    });
  }
}

// Initialize Single Page App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.spaApp = new SinglePageApp();
});

// Export for potential use in other scripts
window.SinglePageApp = SinglePageApp;