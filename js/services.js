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

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Integrate GSAP with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ========================================
  // HERO ANIMATION
  // ========================================

  function initHeroAnimation() {
    console.log('🎬 Initializing Services hero animation');

    // Set initial states
    gsap.set('.navbar__line', { scaleX: 0, transformOrigin: 'left center' });

    // Create timeline
    const tl = gsap.timeline();

    // Navbar - starts immediately
    tl.to('.navbar--services .navbar__logo', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0)
    .to('.navbar__line', {
      scaleX: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.1)
    .to('.navbar--services .navbar__menu', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)
    .to('.burger-menu', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)

    // Eyebrow - fade in
    .to('.services-hero__eyebrow', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.2)

    // Title - smooth reveal
    .to('.services-hero__title', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.3)

    // Separator - elegant line reveal
    .to('.services-hero__separator', {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0.5);

    console.log('✅ Services hero animation complete');
  }

  // ========================================
  // SERVICE CARDS ANIMATION
  // ========================================

  let serviceCardsAnimationInitialized = false;

  function initServiceCardsAnimation() {
    if (serviceCardsAnimationInitialized) return;

    const cards = document.querySelectorAll('.service-card');

    if (cards.length === 0) return;

    serviceCardsAnimationInitialized = true;

    cards.forEach((card, index) => {
      const image = card.querySelector('.service-card__image');
      const title = card.querySelector('.service-card__title');
      const description = card.querySelector('.service-card__description');

      // Set initial states for animation
      if (image) gsap.set(image, { opacity: 0, y: 30 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (description) gsap.set(description, { opacity: 0, y: 15 });

      // Create timeline for each card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true
        }
      });

      // Image fade and slide up
      if (image) {
        tl.to(image, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, index * 0.1);
      }

      // Title fade and slide up
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, index * 0.1 + 0.2);
      }

      // Description fade and slide up
      if (description) {
        tl.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, index * 0.1 + 0.3);
      }
    });

    console.log('✅ Service cards animation initialized');
  }

  // ========================================
  // NAVBAR COLOR CHANGE
  // ========================================

  function initNavbarColorChange() {
    // Navbar stays white throughout services page since whole section is navy
    // Only transition to solid when reaching the footer
    const footer = document.querySelector('.footer');
    const navbar = document.querySelector('.navbar');

    if (!footer || !navbar) return;

    ScrollTrigger.create({
      trigger: footer,
      start: 'top top+=80',
      onEnter: () => {
        navbar.classList.remove('navbar--services');
        navbar.classList.add('navbar--solid');
      },
      onLeaveBack: () => {
        navbar.classList.remove('navbar--solid');
        navbar.classList.add('navbar--services');
      }
    });

    console.log('✅ Navbar color change initialized');
  }

  // ========================================
  // IMAGE SEPARATOR PARALLAX
  // ========================================

  function initImageParallax() {
    const separators = gsap.utils.toArray('.image-separator');

    separators.forEach((separator) => {
      const img = separator.querySelector('.image-separator__img');

      if (!img) return;

      gsap.fromTo(img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: separator,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    console.log('✅ Image parallax initialized');
  }

  // ========================================
  // FOOTER ANIMATION
  // ========================================

  function initFooterAnimation() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    // Animate heading lines
    const headingLine1 = footer.querySelector('.footer__heading-line1');
    const headingLine2 = footer.querySelector('.footer__heading-line2');

    if (headingLine1) {
      gsap.set(headingLine1, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(headingLine1, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
          });
        }
      });
    }

    if (headingLine2) {
      gsap.set(headingLine2, { opacity: 0, y: 25 });
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(headingLine2, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.15,
            ease: 'power2.out'
          });
        }
      });
    }

    console.log('✅ Footer animation initialized');
  }

  // ========================================
  // INITIALIZE ALL ANIMATIONS
  // ========================================

  // Track if CMS content has loaded
  let cmsContentLoaded = false;
  let loaderComplete = false;

  // Listen for CMS content loaded event
  window.addEventListener('servicesContentLoaded', () => {
    cmsContentLoaded = true;
    // If loader already complete, init card animations now
    if (loaderComplete) {
      initServiceCardsAnimation();
    }
  });

  // Initialize loader (from transitions.js) with hero animation as callback
  initLoader(() => {
    console.log('🎬 Loader complete, starting Services animations');
    loaderComplete = true;
    initHeroAnimation();
    initNavbarColorChange();
    initImageParallax();
    initFooterAnimation();

    // If CMS content already loaded, init card animations
    // Otherwise, the event listener above will handle it
    if (cmsContentLoaded) {
      initServiceCardsAnimation();
    }
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

