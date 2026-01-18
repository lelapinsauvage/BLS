/* ========================================
   BUTERIN L'ESTRANGE - Services Page
   ======================================== */

console.log('🚀 BLS Services loaded');

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

  // Integrate GSAP with Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  
  // ========================================
  // HERO ANIMATION
  // ========================================
  
  function initHeroAnimation() {
    console.log('🎬 Initializing Services hero animation');
    
    // Set initial states (most are set in CSS)
    gsap.set('.services-hero__title', { y: 60 });
    gsap.set('.navbar__line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.service-card__image', { y: 40 });
    
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
    
    // Eyebrow - starts at 0.2 (overlapping with navbar)
    .to('.services-hero__eyebrow', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2)
    
    // Title - starts at 0.25
    .to('.services-hero__title', {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power4.out'
    }, 0.25)
    
    // Separator - starts at 0.4
    .to('.services-hero__separator', {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.4)
    
    // Service images - starts at 0.8 (after text content)
    .to('.service-card__image', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    }, 0.8);
    
    console.log('✅ Services hero animation complete');
  }
  
  // ========================================
  // IMAGE SEPARATOR PARALLAX
  // ========================================
  
  function initImageParallax() {
    const separators = gsap.utils.toArray('.image-separator');
    
    separators.forEach((separator) => {
      const img = separator.querySelector('.image-separator__img');
      
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: separator,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    
    console.log('✅ Image parallax initialized');
  }
  
  // ========================================
  // INITIALIZE ALL ANIMATIONS
  // ========================================
  
  // Initialize loader (from transitions.js) with hero animation as callback
  initLoader(() => {
    console.log('🎬 Loader complete, starting Services animations');
    initHeroAnimation();
    initImageParallax();
  });
  
  // Initialize page transitions (from transitions.js)
  initPageTransitions();
  
} else {
  console.error('❌ GSAP not loaded');
}

