// Modern JavaScript for Personal Academic Website

// ================== Theme Management ==================
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcon();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const icon = document.querySelector('.theme-toggle svg');
    if (icon) {
      icon.innerHTML = this.theme === 'light' 
        ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>'
        : '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
    }
  }
}

// ================== Mobile Menu ==================
class MobileMenu {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.overlay = document.querySelector('.mobile-overlay');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMenu());
    }

    // Close menu on navigation click
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMenu();
        }
      });
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.sidebar.classList.add('active');
    this.toggle.classList.add('active');
    if (this.overlay) {
      this.overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.sidebar.classList.remove('active');
    this.toggle.classList.remove('active');
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }
}

// ================== Smooth Scroll ==================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 80; // Account for fixed header
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ================== Back to Top Button ==================
class BackToTop {
  constructor() {
    this.button = document.querySelector('.back-to-top');
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ================== Lazy Loading ==================
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  loadImage(img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ================== Active Navigation ==================
class ActiveNavigation {
  constructor() {
    this.sections = document.querySelectorAll('section[id], div[id]');
    this.navItems = document.querySelectorAll('.nav-item');
    this.init();
  }

  init() {
    if (!this.sections.length || !this.navItems.length) return;

    window.addEventListener('scroll', () => this.updateActiveNav());
    this.updateActiveNav(); // Initial check
  }

  updateActiveNav() {
    const scrollPosition = window.pageYOffset + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navItems.forEach(item => {
          const href = item.getAttribute('href');
          if (href && href.includes(`#${sectionId}`)) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }
}

// ================== Copy to Clipboard ==================
class CopyToClipboard {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.copy-email').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = button.dataset.email;
        this.copyText(email);
        this.showTooltip(button, 'Copied!');
      });
    });

    document.querySelectorAll('.copy-bibtex').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const bibtex = button.dataset.bibtex;
        this.copyText(bibtex);
        this.showTooltip(button, 'BibTeX Copied!');
      });
    });
  }

  copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);

    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => {
        element.removeChild(tooltip);
      }, 300);
    }, 2000);
  }
}

// ================== Animation on Scroll ==================
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => animationObserver.observe(el));
    } else {
      // Fallback: show all elements
      this.elements.forEach(el => el.classList.add('animated'));
    }
  }
}

// ================== Publications Filter ==================
class PublicationsFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.publications = document.querySelectorAll('.publication-item');
    this.init();
  }

  init() {
    if (!this.filterButtons.length) return;

    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.filterPublications(filter);
        this.updateActiveButton(button);
      });
    });
  }

  filterPublications(filter) {
    this.publications.forEach(pub => {
      if (filter === 'all' || pub.dataset.category === filter) {
        pub.style.display = 'block';
        setTimeout(() => pub.classList.add('show'), 10);
      } else {
        pub.classList.remove('show');
        setTimeout(() => pub.style.display = 'none', 300);
      }
    });
  }

  updateActiveButton(activeButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
}

// ================== Search Functionality ==================
class SearchFunction {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchableContent = this.gatherSearchableContent();
    this.init();
  }

  init() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 2) {
        const results = this.search(query);
        this.displayResults(results);
      } else {
        this.clearResults();
      }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.clearResults();
      }
    });
  }

  gatherSearchableContent() {
    const content = [];
    document.querySelectorAll('[data-searchable]').forEach(element => {
      content.push({
        title: element.dataset.title || element.textContent.substring(0, 50),
        text: element.textContent,
        url: element.dataset.url || '#',
        element: element
      });
    });
    return content;
  }

  search(query) {
    return this.searchableContent.filter(item => 
      item.text.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
  }

  displayResults(results) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      const html = results.map(result => `
        <a href="${result.url}" class="search-result-item">
          <div class="search-result-title">${this.highlightMatch(result.title, this.searchInput.value)}</div>
        </a>
      `).join('');
      this.searchResults.innerHTML = html;
    }
    this.searchResults.classList.add('active');
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  clearResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove('active');
      this.searchResults.innerHTML = '';
    }
  }
}

// ================== Initialize Everything ==================
document.addEventListener('DOMContentLoaded', () => {
  // Core features
  const themeManager = new ThemeManager();
  new MobileMenu();
  new SmoothScroll();
  new BackToTop();
  new LazyLoader();
  new ActiveNavigation();
  new CopyToClipboard();
  new ScrollAnimations();
  new PublicationsFilter();
  new SearchFunction();

  // Bind theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      themeManager.toggle();
    });
  }

  // Add loaded class to body
  document.body.classList.add('loaded');

  // Log initialization
  console.log('Modern Academic Website initialized successfully!');
});

// ================== Utility Functions ==================
const utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
};

// Export for use in other scripts if needed
window.modernWebsite = {
  utils,
  ThemeManager,
  MobileMenu,
  LazyLoader
};