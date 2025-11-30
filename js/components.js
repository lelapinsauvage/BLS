/* ========================================
   COMPONENT LOADER
   Loads reusable navbar, footer, and loader components
   ======================================== */

// Configuration
const COMPONENTS = {
  loader: {
    path: 'components/loader.html',
    target: 'body',
    position: 'afterbegin'
  },
  navbar: {
    path: 'components/navbar.html',
    target: 'body',
    position: 'afterbegin'
  },
  footer: {
    path: 'components/footer.html',
    target: 'body',
    position: 'beforeend'
  }
};

// Current page detection for active nav states
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

/**
 * Load a component HTML file and insert it into the DOM
 */
async function loadComponent(name, config) {
  try {
    const response = await fetch(config.path);
    if (!response.ok) throw new Error(`Failed to load ${name}`);
    
    let html = await response.text();
    
    // Process the HTML (set active states, etc.)
    html = processComponent(name, html);
    
    // Insert into DOM
    const target = document.querySelector(config.target);
    if (target) {
      target.insertAdjacentHTML(config.position, html);
    }
    
    return true;
  } catch (error) {
    console.error(`Error loading ${name} component:`, error);
    return false;
  }
}

/**
 * Process component HTML before insertion
 */
function processComponent(name, html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const doc = template.content;
  
  // Handle navbar active states
  if (name === 'navbar') {
    doc.querySelectorAll('[data-nav]').forEach(link => {
      const navPage = link.getAttribute('data-nav');
      const isActive = currentPage.includes(navPage) || 
                       (navPage === 'home' && (currentPage === 'index.html' || currentPage === ''));
      
      if (isActive) {
        link.classList.add('navbar__link--active');
        // Add dot for home page style
        if (!link.querySelector('.navbar__link-dot')) {
          link.insertAdjacentHTML('afterbegin', '<span class="navbar__link-dot">• </span>');
        }
      } else {
        link.classList.remove('navbar__link--active');
        const dot = link.querySelector('.navbar__link-dot');
        if (dot) dot.remove();
      }
    });
  }
  
  // Handle footer nav active states
  if (name === 'footer') {
    doc.querySelectorAll('.footer__nav-link[data-nav]').forEach(link => {
      const navPage = link.getAttribute('data-nav');
      const isActive = currentPage.includes(navPage) || 
                       (navPage === 'home' && (currentPage === 'index.html' || currentPage === ''));
      
      if (isActive) {
        link.classList.add('footer__nav-link--active');
        link.textContent = '• ' + link.textContent.replace('• ', '');
      } else {
        link.textContent = link.textContent.replace('• ', '');
      }
    });
  }
  
  return template.innerHTML;
}

/**
 * Initialize all components
 */
async function initComponents(options = {}) {
  const {
    loader = true,
    navbar = true,
    footer = true,
    navbarLight = false, // Add navbar--light class
    onComplete = null
  } = options;
  
  // Load in correct order: loader first, then navbar, then footer
  if (loader) {
    await loadComponent('loader', COMPONENTS.loader);
  }
  
  if (navbar) {
    await loadComponent('navbar', COMPONENTS.navbar);
    
    // Add light class if needed
    if (navbarLight) {
      const nav = document.getElementById('navbar');
      if (nav) nav.classList.add('navbar--light');
    }
  }
  
  if (footer) {
    await loadComponent('footer', COMPONENTS.footer);
  }
  
  // Call completion callback
  if (onComplete && typeof onComplete === 'function') {
    onComplete();
  }
  
  // Dispatch event for other scripts to know components are loaded
  document.dispatchEvent(new CustomEvent('componentsLoaded'));
}

// Export for use in other scripts
window.initComponents = initComponents;
window.loadComponent = loadComponent;

