/* ========================================
   BUTERIN L'ESTRANGE - Project Detail Page
   ======================================== */

console.log('🚀 BLS Project loaded');

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
// NAVBAR SCROLL BEHAVIOR
// ========================================

let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

// Hook into Lenis scroll event for smooth integration
lenis.on('scroll', ({ scroll, direction }) => {
  const currentScrollY = scroll;
  
  // Hide/show navbar based on scroll direction (desktop only)
  if (window.innerWidth > 768) {
    if (direction === 1 && currentScrollY > 100) {
      // Scrolling down (direction 1)
      navbar.classList.add('navbar--hidden');
    } else if (direction === -1) {
      // Scrolling up (direction -1)
      navbar.classList.remove('navbar--hidden');
    }
  } else {
    // Mobile - always keep navbar visible
    navbar.classList.remove('navbar--hidden');
  }
  
  lastScrollY = currentScrollY;
});

// Check if GSAP is available
if (typeof gsap !== 'undefined') {
  console.log('✅ GSAP loaded');

  // Cancel the fallback RAF loop - GSAP ticker will handle Lenis updates
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Register GSAP plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Integrate GSAP with Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  
  // ========================================
  // PROJECT PAGE ANIMATIONS
  // ========================================
  
  function initProjectAnimations() {
    console.log('🎬 Initializing Project animations');

    // Refresh ScrollTrigger after loader reveals the page
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    // Set initial states
    gsap.set('.navbar__line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.project__title, .project__meta-item, .project__description', { y: 40 });
    gsap.set('.project__image', { y: 60 });
    
    // Create timeline matching about.js structure
    const tl = gsap.timeline();
    
    // Navbar - starts immediately (same as about.js)
    tl.to('.navbar--project .navbar__logo', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0)
    .to('.navbar__line', {
      scaleX: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.1)
    .to('.navbar--project .navbar__actions', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)
    
    // Project title
    .to('.project__title', {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power4.out'
    }, 0.2)
    
    // Project meta - stagger
    .to('.project__meta-item', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    }, 0.4)
    
    // Project description
    .to('.project__description', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, 0.6)
    
    // Gallery images - stagger
    .to('.project__image', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    }, 0.5);
    
    console.log('✅ Project animations complete');
  }
  
  // ========================================
  // NEXT PROJECT IMAGE PARALLAX
  // ========================================
  
  function initNextProjectParallax() {
    const nextProjectImage = document.querySelector('.project-next__image');
    
    if (nextProjectImage) {
      gsap.to(nextProjectImage, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.project-next__image-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      
      console.log('✅ Next project parallax initialized');
    }
  }
  
  // ========================================
  // INITIALIZE ALL ANIMATIONS
  // ========================================

  let cmsContentLoaded = false;

  // Wait for CMS content to load (for content-specific animations)
  window.addEventListener('projectPageLoaded', () => {
    console.log('📦 Project CMS content loaded');
    cmsContentLoaded = true;
    initNextProjectParallax();
  });

  // Initialize loader (from transitions.js) with callback
  // Navbar animations run immediately after loader, content animations wait for CMS
  initLoader(() => {
    console.log('🎬 Loader complete, starting animations');
    initProjectAnimations();
  });

  // Initialize page transitions (from transitions.js)
  initPageTransitions();
  
} else {
  console.error('❌ GSAP not loaded');
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
