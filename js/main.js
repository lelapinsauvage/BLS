/* ========================================
   BUTERIN L'ESTRANGE - Home Page
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
// NAVBAR SCROLL BEHAVIOR
// ========================================

let lastScrollY = 0;
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');

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
  
  // Add white background after scrolling past hero
  if (hero) {
    const heroHeight = hero.offsetHeight;
    if (currentScrollY > heroHeight - 100) {
      navbar.classList.add('navbar--solid');
    } else {
      navbar.classList.remove('navbar--solid');
    }
  }
  
  lastScrollY = currentScrollY;
});

// ========================================
// INITIALIZE
// ========================================

if (typeof gsap === 'undefined') {
  console.error('❌ GSAP not loaded!');
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
  
  // Set initial states for hero elements
  gsap.set('.navbar__line', { scaleX: 0 });
  gsap.set('.hero__title .reveal .reveal__inner', { y: '120%' });
  
  // Initialize loader (from transitions.js) with hero animation as callback
  initLoader(initHeroAnimation);
  
  // Initialize page transitions (from transitions.js)
  initPageTransitions();
  
  // Initialize other animations
  initNumbersAnimation();
  initCategoriesHover();

  // Initialize hover for existing projects (static HTML)
  initProjectsHover();

  // NOTE: initImageParallax() is called in initHeroAnimation() after loader completes
  // This ensures ScrollTrigger calculates positions when page is fully visible

  // Also listen for CMS-loaded projects
  window.addEventListener('homepageProjectsLoaded', () => {
    initProjectsHover();
  });
}

// ========================================
// HERO ENTRANCE ANIMATION
// ========================================

function initHeroAnimation() {

  // Initialize parallax with delay - loader callback fires early (75% open)
  // Wait for loader to fully hide before calculating ScrollTrigger positions
  gsap.delayedCall(0.5, () => {
    ScrollTrigger.refresh();
    initImageParallax();
  });

  // Start video playback with hero animation
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.play().catch(err => console.log('Video autoplay prevented:', err));
  }
  
  const master = gsap.timeline({
    onComplete: startScrollCtaBounce
  });

  master
    // Navbar - starts immediately
    .to('.navbar__logo', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0)
    .to('.navbar__line', {
      scaleX: 1,
      duration: 0.45,
      ease: 'power2.out'
    }, 0.1)
    .to('.navbar__menu', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)
    .to('.burger-menu', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.15)
    
    // Eyebrow
    .to('.hero__eyebrow', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2)
    
    // Title lines - staggered reveal
    .to('.hero__title .reveal:nth-child(1) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.25)
    .to('.hero__title .reveal:nth-child(1)', {
      opacity: 1,
      duration: 0.01
    }, '<')
    
    .to('.hero__title .reveal:nth-child(2) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.4)
    .to('.hero__title .reveal:nth-child(2)', {
      opacity: 1,
      duration: 0.01
    }, '<')
    
    .to('.hero__title .reveal:nth-child(3) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.55)
    .to('.hero__title .reveal:nth-child(3)', {
      opacity: 1,
      duration: 0.01
    }, '<')
    
    // Description
    .to('.hero__description', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.7)
    
    // Scroll CTA
    .to('.hero__scroll-wrapper', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.8);
}

// ========================================
// SCROLL CTA BOUNCE (Mac Dock Style)
// ========================================

function startScrollCtaBounce() {
  gsap.delayedCall(4, bounceScrollCta);
}

function bounceScrollCta() {
  const tl = gsap.timeline({
    onComplete: () => gsap.delayedCall(5, bounceScrollCta)
  });
  
  tl
    .to('.hero__scroll-wrapper', { y: -10, duration: 0.12, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.12, ease: 'power2.in' })
    .to('.hero__scroll-wrapper', { y: -5, duration: 0.1, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.1, ease: 'power2.in' })
    .to('.hero__scroll-wrapper', { y: -2, duration: 0.08, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.08, ease: 'power2.in' });
}

// ========================================
// NUMBERS SECTION - Scroll Animation
// ========================================

function initNumbersAnimation() {
  gsap.set('.numbers__value', { opacity: 0 });
  gsap.set('.numbers__label', { opacity: 0 });
  
  const numberItems = document.querySelectorAll('.numbers__value');
  
  ScrollTrigger.create({
    trigger: '.numbers',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      numberItems.forEach((item, index) => {
        const finalValue = item.textContent;
        const hasPlus = finalValue.includes('+');
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        gsap.to(item, {
          opacity: 1,
          duration: 0.4,
          delay: index * 0.15,
          ease: 'power2.out'
        });
        
        let obj = { value: 0 };
        gsap.to(obj, {
          value: numericValue,
          duration: 2.5,
          delay: index * 0.15,
          ease: 'power3.out',
          onUpdate: () => {
            item.textContent = Math.round(obj.value) + (hasPlus ? '+' : '');
          }
        });
      });
      
      gsap.to('.numbers__label', {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.3
      });
    }
  });
}

// ========================================
// CATEGORIES - Hover Animation
// ========================================

function initCategoriesHover() {
  // Only run on desktop/tablet landscape (hover-capable devices)
  if (window.innerWidth <= 1024) return;
  
  const categories = document.querySelector('.categories');
  const items = document.querySelectorAll('.categories__item');
  const titles = document.querySelectorAll('.categories__title');
  const descriptions = document.querySelectorAll('.categories__description');
  
  if (!categories || items.length === 0) return;
  
  // Hide descriptions initially only on desktop
  gsap.set(descriptions, { opacity: 0, y: 10 });
  
  items.forEach((item, index) => {
    const title = item.querySelector('.categories__title');
    const description = item.querySelector('.categories__description');
    const otherItems = [...items].filter((_, i) => i !== index);
    
    item.addEventListener('mouseenter', () => {
      gsap.to(item, { flex: 1.1, duration: 0.4, ease: 'power2.out' });
      gsap.to(otherItems, { flex: 0.95, duration: 0.4, ease: 'power2.out' });
      gsap.to(title, { y: -8, duration: 0.35, ease: 'power2.out' });
      gsap.to(description, { opacity: 1, y: 0, duration: 0.35, delay: 0.08, ease: 'power2.out' });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(title, { y: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(description, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out' });
    });
  });
  
  categories.addEventListener('mouseleave', () => {
    gsap.to(items, { flex: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(titles, { y: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(descriptions, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out' });
  });
}

// ========================================
// PROJECTS - Hover Animation
// ========================================

function initProjectsHover() {
  const items = document.querySelectorAll('.projects__item');

  if (items.length === 0) return;

  items.forEach(item => {
    // Skip if already initialized (prevent duplicate listeners)
    if (item.dataset.hoverInit) return;
    item.dataset.hoverInit = 'true';

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
// IMAGE SEPARATOR - Parallax
// ========================================

function initImageParallax() {
  const separators = document.querySelectorAll('.image-separator');

  if (separators.length === 0) return;

  // Collect all separator images
  const images = [];
  separators.forEach(sep => {
    const img = sep.querySelector('.image-separator__img');
    if (img) images.push(img);
  });

  // Function to create ScrollTriggers
  function createParallaxTriggers() {
    separators.forEach((separator, index) => {
      const img = separator.querySelector('.image-separator__img');

      if (!img) return;

      // Parallax: image moves slower than scroll, creating depth effect
      gsap.to(img, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: separator,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
    });

    // Final refresh after all triggers are created
    ScrollTrigger.refresh();
  }

  // Wait for all images to load before creating triggers
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) return;

  images.forEach(img => {
    if (img.complete) {
      loadedCount++;
      if (loadedCount === totalImages) {
        createParallaxTriggers();
      }
    } else {
      img.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          createParallaxTriggers();
        }
      });
      // Also handle error case
      img.addEventListener('error', () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          createParallaxTriggers();
        }
      });
    }
  });

  // Fallback: if images don't trigger load events (cached), create after short delay
  setTimeout(() => {
    if (loadedCount < totalImages) {
      createParallaxTriggers();
    }
  }, 500);
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
