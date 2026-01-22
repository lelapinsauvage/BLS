/* ========================================
   BUTERIN L'ESTRANGE - About Page
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
// When GSAP is loaded, it takes over via gsap.ticker (see below)
let rafId = null;
function raf(time) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================

const navbar = document.querySelector('.navbar');
let isDesktop = window.innerWidth > 768;
let lastNavbarState = null;

// Update isDesktop on resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    isDesktop = window.innerWidth > 768;
    if (!isDesktop) navbar.classList.remove('navbar--hidden');
  }, 150);
}, { passive: true });

// Hook into Lenis scroll event for smooth integration
lenis.on('scroll', ({ scroll, direction }) => {
  if (!isDesktop) return;

  const shouldHide = direction === 1 && scroll > 100;

  // Only update DOM if state changed
  if (shouldHide !== lastNavbarState) {
    lastNavbarState = shouldHide;
    if (shouldHide) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }
  }
});

// Check if GSAP is available
if (typeof gsap !== 'undefined') {

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
  
  // Initialize loader (from transitions.js) with page animations as callback
  initLoader(initPageAnimations);
  
  // Initialize page transitions (from transitions.js)
  initPageTransitions();
}

// ========================================
// PAGE ANIMATIONS
// ========================================

function initPageAnimations() {
  initHeroAnimation();
  initImageParallax();
  initValuesAnimation();
  initMissionAnimation();
  initClientsAnimation();
  initNavbarColorChange();
}

// ========================================
// NAVBAR COLOR CHANGE AFTER HERO
// ========================================

function initNavbarColorChange() {
  const hero = document.querySelector('.hero--light');
  const navbar = document.querySelector('.navbar');

  if (!hero || !navbar) return;

  ScrollTrigger.create({
    trigger: hero,
    start: 'bottom top+=80',
    onEnter: () => {
      navbar.classList.remove('navbar--light');
      navbar.classList.add('navbar--solid');
    },
    onLeaveBack: () => {
      navbar.classList.remove('navbar--solid');
      navbar.classList.add('navbar--light');
    }
  });
}

// ========================================
// TYPEWRITER EFFECT
// ========================================

// Default words, can be overridden by CMS via window.cmsTypewriterWords
let typewriterWords = ['Integrity.', 'Precision.', 'Collaboration.'];
let currentWordIndex = 0;

function initTypewriter() {
  const wordElement = document.querySelector('.typewriter-word');
  if (!wordElement) return;

  // Use CMS-loaded words if available
  if (window.cmsTypewriterWords && window.cmsTypewriterWords.length > 0) {
    typewriterWords = window.cmsTypewriterWords;
  }

  // Start the loop
  setTimeout(() => {
    typewriterLoop(wordElement);
  }, 2000); // Wait 2s after hero animation before starting
}

function typewriterLoop(element) {
  const currentWord = typewriterWords[currentWordIndex];
  const nextIndex = (currentWordIndex + 1) % typewriterWords.length;
  const nextWord = typewriterWords[nextIndex];
  
  // Show cursor
  element.classList.add('typing');
  
  // Erase current word
  eraseWord(element, currentWord, () => {
    // Type next word
    typeWord(element, nextWord, () => {
      currentWordIndex = nextIndex;
      // Hide cursor, wait then continue loop
      element.classList.remove('typing');
      setTimeout(() => {
        typewriterLoop(element);
      }, 2500); // Pause before erasing
    });
  });
}

function eraseWord(element, word, callback) {
  let charIndex = word.length;
  
  const eraseInterval = setInterval(() => {
    charIndex--;
    element.textContent = word.substring(0, charIndex);
    
    if (charIndex === 0) {
      clearInterval(eraseInterval);
      setTimeout(callback, 300); // Small pause before typing
    }
  }, 60); // Erase speed
}

function typeWord(element, word, callback) {
  let charIndex = 0;
  
  const typeInterval = setInterval(() => {
    charIndex++;
    element.textContent = word.substring(0, charIndex);
    
    if (charIndex === word.length) {
      clearInterval(typeInterval);
      callback();
    }
  }, 80); // Type speed
}

function initHeroAnimation() {
  // Split hero description into lines
  const heroDesc = document.querySelector('.hero__description--about');
  if (heroDesc) {
    splitTextIntoLines(heroDesc);
  }

  const heroTl = gsap.timeline();

  // Navbar - starts immediately
  heroTl
    .to('.navbar--light .navbar__logo', {
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

    // Eyebrow
    .to('.hero--light .hero__eyebrow', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2)

    // Title lines - masked reveal
    .to('.hero__title--about .reveal:nth-child(1) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.25)
    .to('.hero__title--about .reveal:nth-child(1)', {
      opacity: 1,
      duration: 0.01
    }, '<')

    .to('.hero__title--about .reveal:nth-child(2) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.4)
    .to('.hero__title--about .reveal:nth-child(2)', {
      opacity: 1,
      duration: 0.01
    }, '<')

    .to('.hero__title--about .reveal:nth-child(3) .reveal__inner', {
      y: '0%',
      duration: 0.75,
      ease: 'power4.out'
    }, 0.55)
    .to('.hero__title--about .reveal:nth-child(3)', {
      opacity: 1,
      duration: 0.01
    }, '<')

    // Description lines reveal
    .to('.hero__description--about .line-inner', {
      y: '0%',
      duration: 0.7,
      stagger: 0.06,
      ease: 'power4.out'
    }, 0.7)

    // Anchor links
    .to('.hero__anchor', {
      opacity: 1,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power2.out',
      onComplete: initTypewriter
    }, 0.95);
}

// Helper function to split text into lines
function splitTextIntoLines(element) {
  const text = element.textContent;
  const words = text.split(' ');

  // Temporarily make element visible to measure
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';

  // Create a test container
  const testDiv = document.createElement('div');
  testDiv.style.cssText = window.getComputedStyle(element).cssText;
  testDiv.style.width = element.offsetWidth + 'px';
  testDiv.style.position = 'absolute';
  testDiv.style.visibility = 'hidden';
  document.body.appendChild(testDiv);

  const lines = [];
  let currentLine = [];
  let lastHeight = 0;

  words.forEach((word, i) => {
    currentLine.push(word);
    testDiv.textContent = currentLine.join(' ');
    const newHeight = testDiv.offsetHeight;

    if (newHeight > lastHeight && currentLine.length > 1) {
      currentLine.pop();
      lines.push(currentLine.join(' '));
      currentLine = [word];
      lastHeight = 0;
      testDiv.textContent = word;
      lastHeight = testDiv.offsetHeight;
    } else {
      lastHeight = newHeight;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  document.body.removeChild(testDiv);

  // Reset element styles
  element.style.visibility = '';
  element.style.position = '';

  // Build the HTML
  element.innerHTML = lines.map(line =>
    `<span class="line"><span class="line-inner">${line}</span></span>`
  ).join(' ');
}

// ========================================
// IMAGE SEPARATOR - Parallax
// ========================================

function initImageParallax() {
  const separators = document.querySelectorAll('.image-separator');

  if (separators.length === 0) return;

  separators.forEach(separator => {
    const img = separator.querySelector('.image-separator__img');

    if (!img) return;

    // Parallax effect only
    gsap.fromTo(img,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: separator,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      }
    );
  });
}

// ========================================
// VALUES SECTION - Award-Winning Animation
// ========================================

function initValuesAnimation() {
  const valuesSection = document.querySelector('.values');
  if (!valuesSection) return;

  const title = valuesSection.querySelector('.values__title');
  const eyebrow = valuesSection.querySelector('.values__eyebrow');
  const line = valuesSection.querySelector('.values__line');
  const bottomLine = valuesSection.querySelector('.values__bottom-line');
  const cards = valuesSection.querySelectorAll('.values__card');

  // Single header animation timeline
  const headerTl = gsap.timeline({
    scrollTrigger: {
      trigger: valuesSection,
      start: 'top 100%',
      toggleActions: 'play none none none'
    }
  });

  // Eyebrow fade in
  headerTl.to(eyebrow, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  });

  // Title simple fade in (no character splitting)
  headerTl.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3');

  // Line expand
  headerTl.to(line, {
    scaleX: 1,
    duration: 0.8,
    ease: 'power2.inOut'
  }, '-=0.4');

  // Single timeline for ALL cards (batched for performance)
  const cardsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.values__cards',
      start: 'top 100%',
      toggleActions: 'play none none none'
    }
  });

  // Batch all card reveals - using transforms (GPU accelerated)
  const cardImgs = valuesSection.querySelectorAll('.values__card-img');
  const numbers = valuesSection.querySelectorAll('.values__card-number');
  const cardTitles = valuesSection.querySelectorAll('.values__card-title');
  const cardTexts = valuesSection.querySelectorAll('.values__card-text');

  // Image reveals using translateY (GPU accelerated, no clip-path)
  cardsTl.to(cardImgs, {
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Numbers, titles, texts in parallel
  cardsTl.to(numbers, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.6');

  cardsTl.to(cardTitles, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.5');

  cardsTl.to(cardTexts, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.4');

  // Bottom line animation
  gsap.to(bottomLine, {
    scaleX: 1,
    duration: 1,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: valuesSection,
      start: 'bottom 100%',
      toggleActions: 'play none none none'
    }
  });
}

// ========================================
// MISSION SECTION - Cinematic Animation
// ========================================

function initMissionAnimation() {
  const missionSection = document.querySelector('.mission');
  if (!missionSection) return;

  // Split text into words for both columns
  const textElements = missionSection.querySelectorAll('.mission__text');
  textElements.forEach(textEl => {
    const words = textEl.textContent.trim().split(/\s+/);
    textEl.innerHTML = words.map(word =>
      `<span class="word"><span class="word-inner">${word}</span></span>`
    ).join(' ');
  });

  // Left column animation
  const leftCol = missionSection.querySelector('.mission__col--left');
  if (leftCol) {
    const leftEyebrow = leftCol.querySelector('.mission__eyebrow');
    const leftText = leftCol.querySelector('.mission__text');
    const leftWords = leftText ? leftText.querySelectorAll('.word-inner') : [];
    const leftImgWrap = leftCol.querySelector('.mission__img-wrap');
    const leftImg = leftCol.querySelector('.mission__img');

    const leftTl = gsap.timeline({
      scrollTrigger: {
        trigger: leftCol,
        start: 'top 100%',
        toggleActions: 'play none none reverse'
      }
    });

    // Eyebrow
    leftTl.to(leftEyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out'
    });

    // Words reveal with stagger
    leftTl.to(leftWords, {
      y: 0,
      duration: 0.9,
      stagger: 0.012,
      ease: 'power3.out'
    }, '-=0.4');

    // Image reveal
    if (leftImg) {
      leftTl.to(leftImg, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.7');

      // Image parallax
      gsap.to(leftImg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: leftImgWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }
  }

  // Right column animation (delayed)
  const rightCol = missionSection.querySelector('.mission__col--right');
  if (rightCol) {
    const rightEyebrow = rightCol.querySelector('.mission__eyebrow');
    const rightText = rightCol.querySelector('.mission__text');
    const rightWords = rightText ? rightText.querySelectorAll('.word-inner') : [];
    const rightImgWrap = rightCol.querySelector('.mission__img-wrap');
    const rightImg = rightCol.querySelector('.mission__img');

    const rightTl = gsap.timeline({
      scrollTrigger: {
        trigger: rightCol,
        start: 'top 100%',
        toggleActions: 'play none none reverse'
      }
    });

    // Eyebrow
    rightTl.to(rightEyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out'
    });

    // Words reveal
    rightTl.to(rightWords, {
      y: 0,
      duration: 0.9,
      stagger: 0.015,
      ease: 'power3.out'
    }, '-=0.4');

    // Image reveal
    if (rightImg) {
      rightTl.to(rightImg, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.6');

      // Image parallax
      gsap.to(rightImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: rightImgWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }
  }
}

// ========================================
// CLIENTS SECTION - Elegant Animation
// ========================================

function initClientsAnimation() {
  const clientsSection = document.querySelector('.clients');
  if (!clientsSection) return;

  // Split title into characters
  const title = clientsSection.querySelector('.clients__title');
  if (title) {
    const text = title.textContent;
    title.innerHTML = text.split('').map(char =>
      char === ' ' ? ' ' : `<span class="char">${char}</span>`
    ).join('');
  }

  const line = clientsSection.querySelector('.clients__line');
  const eyebrow = clientsSection.querySelector('.clients__eyebrow');
  const chars = clientsSection.querySelectorAll('.clients__title .char');
  const marquee = clientsSection.querySelector('.clients__marquee');

  // Header animation timeline
  const headerTl = gsap.timeline({
    scrollTrigger: {
      trigger: clientsSection,
      start: 'top 100%',
      toggleActions: 'play none none reverse'
    }
  });

  // Line expand
  if (line) {
    headerTl.to(line, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.inOut'
    });
  }

  // Eyebrow
  headerTl.to(eyebrow, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.6');

  // Title characters
  headerTl.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.025,
    ease: 'power3.out'
  }, '-=0.4');

  // Marquee reveal
  if (marquee) {
    headerTl.to(marquee, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');
  }
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
        lenis.scrollTo(target, { duration: 1.5, offset: -50 });
      }
    });
  });
});

