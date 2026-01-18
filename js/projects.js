/* ========================================
   BUTERIN L'ESTRANGE - Projects Page
   ======================================== */

console.log('🚀 BLS Projects loaded');

// ========================================
// LENIS SMOOTH SCROLL
// ========================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2
});

// Share lenis with transitions.js
setLenis(lenis);

// RAF loop for Lenis - only used as fallback if GSAP is not available
let rafId = null;
function raf(time) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

// ========================================
// INITIALIZE
// ========================================

if (typeof gsap === 'undefined') {
  console.error('❌ GSAP not loaded!');
} else {
  console.log('✅ GSAP loaded');

  // Cancel the fallback RAF loop - GSAP ticker will handle Lenis updates
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  
  // Set initial states for header elements
  gsap.set('.navbar__line', { scaleX: 0 });
  gsap.set('.projects-header__title .reveal__inner', { y: '120%' });
  
  // Initialize loader with header animation as callback
  initLoader(initHeaderAnimation);
  
  // Initialize page transitions
  initPageTransitions();
  
  // Initialize projects hover
  initProjectsHover();
  
  // Initialize filter buttons
  initFilterButtons();
}

// ========================================
// HEADER ENTRANCE ANIMATION
// ========================================

function initHeaderAnimation() {
  console.log('🎬 Starting header animation...');
  
  const master = gsap.timeline();

  master
    .to('.navbar__logo', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
    .to('.navbar__line', { scaleX: 1, duration: 0.45, ease: 'power2.out' }, 0.1)
    .to('.navbar__menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.burger-menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.projects-header__title .reveal__inner', { y: '0%', duration: 0.75, ease: 'power4.out' }, 0.25)
    .to('.projects-header__title .reveal', { opacity: 1, duration: 0.01 }, '<')
    .to('.filter-btn', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.5);
}

// ========================================
// PROJECTS - Hover Animation
// ========================================

function initProjectsHover() {
  const items = document.querySelectorAll('.projects__item');
  if (items.length === 0) return;
  
  items.forEach(item => {
    const titleDefault = item.querySelector('.projects__item-title:not(.projects__item-title--hover)');
    const titleHover = item.querySelector('.projects__item-title--hover');
    const imageWrap = item.querySelector('.projects__item-image-wrap');
    const arrow = item.querySelector('.projects__item-arrow');
    
    gsap.set(titleHover, { y: '100%' });
    gsap.set(arrow, { opacity: 0, x: -20 });
    
    item.addEventListener('mouseenter', () => {
      gsap.to(titleDefault, { y: '-100%', duration: 0.35, ease: 'power2.out' });
      gsap.to(titleHover, { y: '0%', duration: 0.35, ease: 'power2.out' });
      gsap.to(imageWrap, { x: -20, duration: 0.35, ease: 'power2.out' });
      gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(titleDefault, { y: '0%', duration: 0.35, ease: 'power2.out' });
      gsap.to(titleHover, { y: '100%', duration: 0.35, ease: 'power2.out' });
      gsap.to(imageWrap, { x: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(arrow, { opacity: 0, x: -20, duration: 0.25, ease: 'power2.out' });
    });
  });
}

// ========================================
// FILTER BUTTONS
// ========================================

function initFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Set initial states
  gsap.set('.filter-btn', { opacity: 0, y: 20 });
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      
      // Add active class to clicked button
      btn.classList.add('filter-btn--active');
      
      // Get filter value
      const filter = btn.getAttribute('data-filter');
      console.log('Filter:', filter);
      
      // TODO: Add filtering logic here if needed
      // For now, just update the active state
    });
  });
}

// ========================================
// SMOOTH SCROLL TO ANCHORS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { duration: 1.5 });
      }
    });
  });
});

