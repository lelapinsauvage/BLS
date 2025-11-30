/* ========================================
   BUTERIN L'ESTRANGE - About Page
   ======================================== */

console.log('🚀 BLS About loaded');

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

// Check if GSAP is available
if (typeof gsap !== 'undefined') {
  console.log('✅ GSAP loaded');
  
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  
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
}

// ========================================
// TYPEWRITER EFFECT
// ========================================

const typewriterWords = ['Integrity.', 'Precision.', 'Collaboration.'];
let currentWordIndex = 0;

function initTypewriter() {
  const wordElement = document.querySelector('.typewriter-word');
  if (!wordElement) return;
  
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
    
    // Description
    .to('.hero--light .hero__description', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.7)
    
    // Anchor links
    .to('.hero__anchor', {
      opacity: 1,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power2.out',
      onComplete: initTypewriter
    }, 0.8);
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
// SMOOTH SCROLL TO ANCHORS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -50 });
      }
    });
  });
});

