// Unified Navigation for all pages
const unifiedNavHTML = `
  <a href="index.html#about" class="nav-item">
    <i class="fas fa-user nav-icon"></i>
    About
  </a>
  <a href="index.html#news" class="nav-item">
    <i class="fas fa-newspaper nav-icon"></i>
    News
  </a>
  <a href="index.html#research" class="nav-item">
    <i class="fas fa-microscope nav-icon"></i>
    Research
  </a>
  <a href="projects.html" class="nav-item">
    <i class="fas fa-project-diagram nav-icon"></i>
    Projects
  </a>
  <a href="projects.html#publications" class="nav-item">
    <i class="fas fa-book nav-icon"></i>
    Publications
  </a>
  <a href="index.html#awards" class="nav-item">
    <i class="fas fa-trophy nav-icon"></i>
    Awards
  </a>
  <a href="teaching.html" class="nav-item">
    <i class="fas fa-chalkboard-teacher nav-icon"></i>
    Teaching
  </a>
  <a href="awesome.html" class="nav-item">
    <i class="fas fa-star nav-icon"></i>
    Resources
  </a>
`;

// Function to set active nav item based on current page
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  
  // Remove all active classes first
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Set active based on current page/section
  if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
    if (currentHash === '#about' || !currentHash) {
      document.querySelector('a[href="index.html#about"]')?.classList.add('active');
    } else if (currentHash === '#news') {
      document.querySelector('a[href="index.html#news"]')?.classList.add('active');
    } else if (currentHash === '#research') {
      document.querySelector('a[href="index.html#research"]')?.classList.add('active');
    } else if (currentHash === '#awards') {
      document.querySelector('a[href="index.html#awards"]')?.classList.add('active');
    } else {
      document.querySelector('a[href="index.html#about"]')?.classList.add('active');
    }
  } else if (currentPath.includes('projects.html')) {
    if (currentHash === '#publications') {
      document.querySelector('a[href="projects.html#publications"]')?.classList.add('active');
    } else {
      document.querySelector('a[href="projects.html"]')?.classList.add('active');
    }
  } else if (currentPath.includes('teaching.html')) {
    if (currentHash === '#talks') {
      document.querySelector('a[href="teaching.html#talks"]')?.classList.add('active');
    } else {
      document.querySelector('a[href="teaching.html"]')?.classList.add('active');
    }
  } else if (currentPath.includes('awesome.html')) {
    document.querySelector('a[href="awesome.html"]')?.classList.add('active');
  }
}

// Apply unified navigation on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const navElement = document.querySelector('.navigation');
  if (navElement) {
    navElement.innerHTML = unifiedNavHTML;
    setActiveNavItem();
  }
  
  // Update active state on hash change
  window.addEventListener('hashchange', setActiveNavItem);
});