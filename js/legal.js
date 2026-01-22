/* ========================================
   BUTERIN L'ESTRANGE - Legal Pages
   (Privacy Policy, Cookie Policy)
   ======================================== */


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
  console.error('GSAP not loaded!');
} else {

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

  // Initialize loader with header animation as callback
  initLoader(initPageAnimation);

  // Initialize page transitions
  initPageTransitions();
}

// ========================================
// PAGE ENTRANCE ANIMATION
// ========================================

function initPageAnimation() {
  const master = gsap.timeline();

  master
    // Navbar elements
    .to('.navbar__logo', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
    .to('.navbar__menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.burger-menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    // Header content
    .to('.legal-page__header', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2)
    // Main content
    .to('.legal-page__content', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.35);
}
