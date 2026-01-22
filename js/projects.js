/* ========================================
   BUTERIN L'ESTRANGE - Projects Page
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

// Navbar scroll behavior
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;

lenis.on('scroll', ({ scroll, direction }) => {
  const currentScrollY = scroll;

  // Hide/show navbar based on scroll direction (desktop only)
  if (window.innerWidth > 768) {
    if (direction === 1 && currentScrollY > 100) {
      // Scrolling down
      navbar.classList.add('navbar--hidden');
    } else if (direction === -1) {
      // Scrolling up
      navbar.classList.remove('navbar--hidden');
    }
  } else {
    // Mobile - always keep navbar visible
    navbar.classList.remove('navbar--hidden');
  }

  lastScrollY = currentScrollY;
});

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

  // Track loader state for CMS coordination
  let loaderComplete = false;
  let cmsContentLoaded = false;

  // Initialize loader with header animation as callback
  initLoader(() => {
    loaderComplete = true;
    initHeaderAnimation();
    // If CMS content already loaded, animate items now
    if (cmsContentLoaded) {
      animateProjectItems();
    }
  });

  // Initialize page transitions
  initPageTransitions();

  // Initialize filter buttons
  initFilterButtons();

  // Initialize sticky preview (uses event delegation, works with dynamic content)
  initStickyPreview();

  // Initialize image parallax (will be refreshed after loader)
  initImageParallax();

  // Initialize sticky CTA button
  initStickyCta();

  // Listen for CMS content load
  window.addEventListener('projectsListLoaded', () => {
    cmsContentLoaded = true;

    // Re-initialize hover for new items
    initProjectsHover();

    // If loader already complete, animate items now
    if (loaderComplete) {
      animateProjectItems();
    }
  });

  // Also check if items already exist (static HTML fallback)
  const existingItems = document.querySelectorAll('.projects__item');
  if (existingItems.length > 0) {
    cmsContentLoaded = true;
    initProjectsHover();
  }
}

// ========================================
// HEADER ENTRANCE ANIMATION
// ========================================

function initHeaderAnimation() {

  // Refresh ScrollTrigger after loader reveals the page
  ScrollTrigger.refresh();

  const master = gsap.timeline();

  master
    .to('.navbar__logo', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
    .to('.navbar__line', { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.1)
    .to('.navbar--dark', { borderColor: 'rgba(255, 255, 255, 0.15)', duration: 0.3, ease: 'power2.out' }, 0.1)
    .to('.navbar__menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.burger-menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.projects-header__title .reveal__inner', { y: '0%', duration: 0.75, ease: 'power4.out' }, 0.25)
    .to('.projects-header__title .reveal', { opacity: 1, duration: 0.01 }, '<')
    .to('.filter-btn', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.5)
    .to('.projects--page .projects__list', { borderColor: 'rgba(255, 255, 255, 0.15)', duration: 0.3 }, 0.55);

  // Note: Project items are animated separately via animateProjectItems()
  // to support CMS-loaded content
}

// Animate project items (called when both loader and CMS content are ready)
let itemsAnimated = false;
function animateProjectItems() {
  if (itemsAnimated) return;

  const items = document.querySelectorAll('.projects__item');
  if (items.length === 0) return;

  itemsAnimated = true;

  // Set initial states
  gsap.set(items, { opacity: 0, y: 40, borderColor: 'transparent' });

  // Animate items in with stagger
  gsap.to(items, {
    opacity: 1,
    y: 0,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
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

      // Get filter value and filter projects
      const filter = btn.getAttribute('data-filter');
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  const items = document.querySelectorAll('.projects__item');

  items.forEach(item => {
    const category = item.getAttribute('data-category');
    const shouldShow = filter === 'all' || category === filter;

    if (shouldShow) {
      item.style.display = '';
      gsap.fromTo(item,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      gsap.to(item, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => { item.style.display = 'none'; }
      });
    }
  });
}

// ========================================
// IMAGE PARALLAX
// ========================================

function initImageParallax() {
  const separators = document.querySelectorAll('.image-separator');

  if (separators.length === 0) return;

  separators.forEach(separator => {
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
}

// ========================================
// STICKY PROJECT PREVIEW
// ========================================

function initStickyPreview() {
  const preview = document.querySelector('.project-preview');
  if (!preview) return;

  const previewImage = preview.querySelector('.project-preview__image');
  const previewCategory = preview.querySelector('.project-preview__category');
  const previewYear = preview.querySelector('.project-preview__year');
  const projectsList = document.querySelector('.projects__list');

  if (!projectsList) return;

  // Use event delegation for dynamically loaded items
  projectsList.addEventListener('mouseenter', (e) => {
    const item = e.target.closest('.projects__item');
    if (!item) return;

    // Get data from the hovered item
    const image = item.querySelector('.projects__item-image');
    const category = item.querySelector('.projects__item-type');
    const year = item.querySelector('.projects__item-year');

    if (image && previewImage) {
      previewImage.src = image.src;
      previewImage.alt = image.alt;
    }
    if (category && previewCategory) {
      previewCategory.textContent = category.textContent;
    }
    if (year && previewYear) {
      previewYear.textContent = year.textContent;
    }

    // Show preview
    preview.classList.add('is-visible');
  }, true);

  projectsList.addEventListener('mouseleave', (e) => {
    const item = e.target.closest('.projects__item');
    if (!item) return;

    // Check if we're leaving to another project item
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget.closest('.projects__item')) {
      return; // Don't hide if moving to another item
    }

    // Hide preview
    preview.classList.remove('is-visible');
  }, true);

  // Also hide when leaving the projects list entirely
  projectsList.addEventListener('mouseleave', () => {
    preview.classList.remove('is-visible');
  });
}

// ========================================
// STICKY CTA BUTTON
// ========================================

function initStickyCta() {
  const stickyCta = document.querySelector('.slide-link--sticky');
  if (!stickyCta) return;

  // Animate in after header animation
  gsap.set(stickyCta, { y: 100, opacity: 0, visibility: 'visible' });

  gsap.to(stickyCta, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
    delay: 1.2,
    onComplete: () => stickyCta.classList.add('is-visible')
  });

  // Hide button when reaching the footer
  ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 90%',
    onEnter: () => stickyCta.classList.add('is-hidden'),
    onLeaveBack: () => stickyCta.classList.remove('is-hidden')
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

