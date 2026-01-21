/* ========================================
   BUTERIN L'ESTRANGE - Projects Grid View
   Fullscreen Carousel with Smooth Animation
   ======================================== */

// ========================================
// CAROUSEL STATE
// ========================================

const totalSlides = window.projectsData?.length || 5;
let currentSlide = 1;
let isAnimating = false;
let scrollAllowed = true;
let lastScrollTime = 0;

// ========================================
// CREATE SLIDE
// ========================================

function createSlide(slideIndex) {
  const slideData = window.projectsData[slideIndex - 1];
  if (!slideData) return null;

  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.style.cursor = 'pointer';
  slide.setAttribute('data-url', slideData.url);

  // Make whole slide clickable
  slide.addEventListener('click', (e) => {
    // Don't trigger if clicking on the "All Projects" button
    if (e.target.closest('.slide-link')) return;
    window.location.href = slideData.url;
  });

  // Cursor: show "Visit" on slide, but not on the button
  slide.addEventListener('mousemove', (e) => {
    if (!window.customCursor) return;

    const isOverButton = e.target.closest('.slide-link');
    if (isOverButton) {
      window.customCursor.removeText();
    } else {
      // Only set text if not already set
      const cursorEl = document.querySelector('.mf-cursor');
      if (cursorEl && !cursorEl.classList.contains('-text')) {
        window.customCursor.setText('Visit');
      }
    }
  });

  slide.addEventListener('mouseleave', () => {
    if (window.customCursor) {
      window.customCursor.removeText();
    }
  });

  // Background image
  const slideImg = document.createElement('div');
  slideImg.className = 'slide-img';
  const img = document.createElement('img');
  img.src = slideData.image;
  img.alt = slideData.title;
  slideImg.appendChild(img);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'slide-overlay';

  // Bottom content block
  const slideContent = document.createElement('div');
  slideContent.className = 'slide-content';

  // Left - Category
  const slideTags = document.createElement('div');
  slideTags.className = 'slide-tags';
  const tagsLabel = document.createElement('p');
  tagsLabel.className = 'slide-tags__label';
  tagsLabel.textContent = 'Category / Year';
  const tagsValue = document.createElement('p');
  tagsValue.className = 'slide-tags__value';
  tagsValue.textContent = `${slideData.category}, ${slideData.year}`;
  slideTags.appendChild(tagsLabel);
  slideTags.appendChild(tagsValue);

  // Center - Title + Description + Button
  const slideCenter = document.createElement('div');
  slideCenter.className = 'slide-center';

  const slideTitle = document.createElement('div');
  slideTitle.className = 'slide-title';
  const h1 = document.createElement('h1');
  h1.textContent = slideData.title;
  slideTitle.appendChild(h1);

  const slideDescription = document.createElement('div');
  slideDescription.className = 'slide-description';
  const p = document.createElement('p');
  p.textContent = slideData.description;
  slideDescription.appendChild(p);

  const slideLink = document.createElement('div');
  slideLink.className = 'slide-link';
  const a = document.createElement('a');
  a.href = '#';
  a.setAttribute('data-transition', '');
  a.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigateWithTransition === 'function') {
      navigateWithTransition('projects-list.html');
    } else {
      window.location.href = 'projects-list.html';
    }
    return false;
  };
  a.innerHTML = `
    <div class="slide-link__icons">
      <svg class="slide-link__grid" width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5.25" cy="5.25" r="2.625" fill="currentColor"/>
        <circle cx="14" cy="5.25" r="2.625" fill="currentColor"/>
        <circle cx="22.75" cy="5.25" r="2.625" fill="currentColor"/>
        <circle cx="5.25" cy="14" r="2.625" fill="currentColor"/>
        <circle cx="14" cy="14" r="2.625" fill="currentColor"/>
        <circle cx="22.75" cy="14" r="2.625" fill="currentColor"/>
        <circle cx="5.25" cy="22.75" r="2.625" fill="currentColor"/>
        <circle cx="14" cy="22.75" r="2.625" fill="currentColor"/>
        <circle cx="22.75" cy="22.75" r="2.625" fill="currentColor"/>
      </svg>
      <svg class="slide-link__list" width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="24" height="3" rx="1.5" fill="currentColor"/>
        <rect x="2" y="12.5" width="24" height="3" rx="1.5" fill="currentColor"/>
        <rect x="2" y="21" width="24" height="3" rx="1.5" fill="currentColor"/>
      </svg>
    </div>
    <div class="slide-link__text">
      <span>All Projects</span>
      <span>All Projects</span>
    </div>
  `;
  slideLink.appendChild(a);

  slideCenter.appendChild(slideTitle);
  slideCenter.appendChild(slideDescription);
  slideCenter.appendChild(slideLink);

  // Right - Index
  const slideIndexWrapper = document.createElement('div');
  slideIndexWrapper.className = 'slide-index';
  const currentNum = document.createElement('span');
  currentNum.className = 'slide-index__current';
  currentNum.textContent = slideIndex.toString().padStart(2, '0');
  const separator = document.createElement('span');
  separator.textContent = ' / ';
  const totalNum = document.createElement('span');
  totalNum.textContent = totalSlides.toString().padStart(2, '0');
  slideIndexWrapper.appendChild(currentNum);
  slideIndexWrapper.appendChild(separator);
  slideIndexWrapper.appendChild(totalNum);

  slideContent.appendChild(slideTags);
  slideContent.appendChild(slideCenter);
  slideContent.appendChild(slideIndexWrapper);

  slide.appendChild(slideImg);
  slide.appendChild(overlay);
  slide.appendChild(slideContent);

  return slide;
}

// ========================================
// SPLIT TEXT FOR ANIMATION
// ========================================

function splitText(slide) {
  // Split title into words
  const titleEl = slide.querySelector('.slide-title h1');
  if (titleEl && typeof SplitText !== 'undefined') {
    SplitText.create(titleEl, {
      type: 'words',
      wordsClass: 'word',
      mask: 'words'
    });
  }

  // Split paragraphs into lines
  const textEls = slide.querySelectorAll('.slide-tags p, .slide-index');
  textEls.forEach(el => {
    if (typeof SplitText !== 'undefined') {
      SplitText.create(el, {
        type: 'lines',
        linesClass: 'line',
        mask: 'lines',
        reduceWhiteSpace: false
      });
    }
  });
}

// ========================================
// ANIMATE SLIDE
// ========================================

function animateSlide(direction) {
  if (isAnimating || !scrollAllowed) return;

  isAnimating = true;
  scrollAllowed = false;

  const slider = document.querySelector('.slider');
  const currentSlideElement = slider.querySelector('.slide');

  // Update current slide index
  if (direction === 'down') {
    currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
  } else {
    currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
  }

  const exitY = direction === 'down' ? '-100vh' : '100vh';
  const entryY = direction === 'down' ? '100vh' : '-100vh';
  const exitRotation = direction === 'down' ? -30 : 30;

  // Exit animation with scale and rotation
  gsap.to(currentSlideElement, {
    y: exitY,
    scale: 0.25,
    rotation: exitRotation,
    opacity: 0,
    duration: 1.4,
    ease: 'power2.inOut',
    force3D: true,
    onComplete: () => {
      currentSlideElement.remove();
    }
  });

  // Create and animate in new slide
  setTimeout(() => {
    const newSlide = createSlide(currentSlide);
    if (!newSlide) return;

    gsap.set(newSlide, {
      y: entryY,
      scale: 0.85,
      force3D: true
    });

    slider.appendChild(newSlide);
    splitText(newSlide);

    const words = newSlide.querySelectorAll('.word');
    const lines = newSlide.querySelectorAll('.line');
    const linkBtn = newSlide.querySelector('.slide-link a');

    gsap.set([...words, ...lines], {
      y: '100%',
      force3D: true
    });
    gsap.set(linkBtn, { opacity: 0, y: 20 });

    // Entry animation
    gsap.to(newSlide, {
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power2.inOut',
      force3D: true,
      onStart: () => {
        const tl = gsap.timeline();

        // Animate title words
        const headerWords = newSlide.querySelectorAll('.slide-title .word');
        tl.to(headerWords, {
          y: '0%',
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
          force3D: true
        }, 0.2);

        // Animate tags and index
        const tagsLines = newSlide.querySelectorAll('.slide-tags .line');
        const indexLines = newSlide.querySelectorAll('.slide-index .line');

        tl.to([...tagsLines, ...indexLines], {
          y: '0%',
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.03
        }, 0.3);

        // Animate link button
        gsap.to(linkBtn, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.4
        });
      },
      onComplete: () => {
        isAnimating = false;
        setTimeout(() => {
          scrollAllowed = true;
          lastScrollTime = Date.now();
        }, 50);
      }
    });
  }, 350);
}

// ========================================
// SCROLL HANDLER
// ========================================

function handleScroll(direction) {
  const now = Date.now();

  if (isAnimating || !scrollAllowed) return;
  if (now - lastScrollTime < 1000) return;

  lastScrollTime = now;
  animateSlide(direction);
}

// ========================================
// INITIAL ANIMATION
// ========================================

function animateIn() {
  const slider = document.querySelector('.slider');
  const firstSlide = createSlide(1);
  if (!firstSlide) return;

  slider.appendChild(firstSlide);
  splitText(firstSlide);

  // Set initial states - simple fade (no scale)
  gsap.set(firstSlide, { opacity: 0 });

  const words = firstSlide.querySelectorAll('.word');
  const lines = firstSlide.querySelectorAll('.line');
  const linkBtn = firstSlide.querySelector('.slide-link a');

  gsap.set([...words, ...lines], { y: '100%' });
  gsap.set(linkBtn, { opacity: 0, y: 20 });

  // Animate first slide in
  const tl = gsap.timeline({ delay: 0.2 });

  // Navbar
  tl.to('.navbar--grid .navbar__logo', {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, 0)
  .to('.navbar__line', {
    scaleX: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, 0.1)
  .to('.navbar--grid .navbar__menu', {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0.2)
  .to('.burger-menu', {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0.2);

  // Slide fade in (no scale)
  tl.to(firstSlide, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.3);

  // Title words
  const headerWords = firstSlide.querySelectorAll('.slide-title .word');
  tl.to(headerWords, {
    y: '0%',
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.05
  }, 0.5);

  // Other text (tags, index)
  const otherLines = firstSlide.querySelectorAll('.slide-tags .line, .slide-index .line');
  tl.to(otherLines, {
    y: '0%',
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.03
  }, 0.6);

  // Link button
  tl.to(linkBtn, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power3.out'
  }, 0.7);
}

// ========================================
// INITIALIZE
// ========================================

function init() {
  // Check for GSAP
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Set initial states
  gsap.set('.navbar__line', { scaleX: 0, transformOrigin: 'left center' });

  // Initialize with loader or direct
  if (typeof initLoader === 'function') {
    initLoader(animateIn);
  } else {
    setTimeout(animateIn, 100);
  }

  // Initialize page transitions
  if (typeof initPageTransitions === 'function') {
    initPageTransitions();
  }

  // Setup event listeners
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'down' : 'up';
    handleScroll(direction);
  }, { passive: false });

  // Touch support
  let touchStartY = 0;
  let isTouchActive = false;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    isTouchActive = true;
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isTouchActive || isAnimating || !scrollAllowed) return;

    const touchCurrentY = e.touches[0].clientY;
    const difference = touchStartY - touchCurrentY;

    if (Math.abs(difference) > 50) {
      isTouchActive = false;
      const direction = difference > 0 ? 'down' : 'up';
      handleScroll(direction);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchActive = false;
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      handleScroll('down');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      handleScroll('up');
    }
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
