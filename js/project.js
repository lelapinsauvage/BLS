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

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Share lenis with transitions.js
setLenis(lenis);

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
    
    // Set initial states
    gsap.set('.navbar__line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.project__title, .project__meta-item, .project__description', { y: 40 });
    gsap.set('.project__image', { y: 60 });
    
    // Create timeline matching about.js structure
    const tl = gsap.timeline();
    
    // Navbar - starts immediately (same as about.js)
    tl.to('.navbar--light .navbar__logo', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0)
    .to('.navbar__line', {
      scaleX: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.1)
    .to('.navbar--light .navbar__menu', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)
    .to('.burger-menu', {
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
  
  // Initialize loader (from transitions.js) with project animation as callback
  initLoader(() => {
    console.log('🎬 Loader complete, starting Project animations');
    initProjectAnimations();
    initNextProjectParallax();
  });
  
  // Initialize page transitions (from transitions.js)
  initPageTransitions();
  
} else {
  console.error('❌ GSAP not loaded');
}
