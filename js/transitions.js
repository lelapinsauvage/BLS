/* ========================================
   PAGE TRANSITIONS & LOADER
   Shared across all pages
   ======================================== */

// Global reference to Lenis (set by page scripts)
let lenisInstance = null;

function setLenis(lenis) {
  lenisInstance = lenis;
}

// ========================================
// LOADER ANIMATION (Entering a page)
// ========================================

function initLoader(onComplete) {
  const loader = document.querySelector('.loader');
  const logo = document.querySelector('.loader__logo');
  const panelTop = document.querySelector('.loader__panel--top');
  const panelBottom = document.querySelector('.loader__panel--bottom');
  
  if (!loader) {
    if (onComplete) onComplete();
    return;
  }
  
  // Lock scroll
  document.body.classList.add('is-loading');
  if (lenisInstance) lenisInstance.stop();
  
  // Check if coming from another page
  const fromTransition = sessionStorage.getItem('pageTransition') === 'true';
  sessionStorage.removeItem('pageTransition');
  
  // If coming from transition, panels are already closed
  if (fromTransition) {
    gsap.set(panelTop, { yPercent: 0, xPercent: 0 });
    gsap.set(panelBottom, { yPercent: 0, xPercent: 0 });
    gsap.set(logo, { opacity: 0 });
  }
  
  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('is-loading');
      loader.style.display = 'none';
      if (lenisInstance) lenisInstance.start();
    }
  });
  
  // Full loader: logo in, logo out, diagonal opens
  tl.to(logo, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to({}, { duration: 0.4 })
  .to(logo, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  })
  .to(panelTop, {
    yPercent: -100,
    xPercent: 100,
    duration: 1,
    ease: 'power2.inOut'
  })
  .to(panelBottom, {
    yPercent: 100,
    xPercent: -100,
    duration: 1,
    ease: 'power2.inOut'
  }, '<')
  // Start hero animation when diagonals are ~75% open
  .call(() => {
    if (onComplete) onComplete();
  }, null, '-=0.25');
}

// ========================================
// PAGE TRANSITIONS (Exiting to another page)
// ========================================

function initPageTransitions() {
  const transitionLinks = document.querySelectorAll('a[data-transition]');
  const panelTop = document.querySelector('.loader__panel--top');
  const panelBottom = document.querySelector('.loader__panel--bottom');
  const loader = document.querySelector('.loader');

  if (!loader) return;

  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition(link.getAttribute('href'));
    });
  });
}

// Exported function for dynamic links
function navigateWithTransition(href) {
  const panelTop = document.querySelector('.loader__panel--top');
  const panelBottom = document.querySelector('.loader__panel--bottom');
  const loader = document.querySelector('.loader');

  if (!loader) {
    window.location.href = href;
    return;
  }

  // Stop smooth scroll
  if (lenisInstance) lenisInstance.stop();

  // Show loader
  loader.style.display = 'flex';
  loader.style.pointerEvents = 'auto';

  // First ensure panels are at open position (off-screen)
  gsap.set(panelTop, {
    yPercent: -100,
    xPercent: 100
  });
  gsap.set(panelBottom, {
    yPercent: 100,
    xPercent: -100
  });

  // Force browser to register the position
  loader.offsetHeight;

  // Animate diagonal closing
  gsap.to(panelTop, {
    yPercent: 0,
    xPercent: 0,
    duration: 1,
    ease: 'power2.inOut'
  });

  gsap.to(panelBottom, {
    yPercent: 0,
    xPercent: 0,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      // Navigate after animation finishes
      sessionStorage.setItem('pageTransition', 'true');
      window.location.href = href;
    }
  });
}

