// Projects Carousel - Standalone Page Version
// For projects-grid.html

const projectsCarouselData = [
  {
    title: "The Gantry",
    description: "A modern workspace transformation bringing industrial heritage into contemporary commercial design.",
    url: "projects-list.html",
    category: "Commercial",
    year: "2025",
    image: "images/project-gantry.png"
  },
  {
    title: "Lumos",
    description: "Premium office fitout combining cutting-edge design with functional elegance for the modern workplace.",
    url: "projects-list.html",
    category: "Commercial",
    year: "2025",
    image: "images/project-lumos.png"
  },
  {
    title: "Deux Frères",
    description: "A sophisticated hospitality space where French culinary tradition meets Sydney's design-led aesthetic.",
    url: "projects-list.html",
    category: "Hospitality",
    year: "2025",
    image: "images/project-deux-freres.png"
  },
  {
    title: "Tradies",
    description: "Bold commercial fitout celebrating authentic craftsmanship with a contemporary edge.",
    url: "projects-list.html",
    category: "Commercial",
    year: "2025",
    image: "images/project-tradies.png"
  },
  {
    title: "Coffee Emporium",
    description: "A warm, inviting café space designed for community connection and exceptional coffee experiences.",
    url: "projects-list.html",
    category: "Hospitality",
    year: "2025",
    image: "images/project-coffee-emporium.png"
  }
];

const totalSlides = projectsCarouselData.length;
let currentSlide = 1;
let isAnimating = false;
let scrollAllowed = true;
let lastScrollTime = 0;

const carouselContainer = document.querySelector('.projects__carousel');

function createSlide(slideIndex) {
  const slideData = projectsCarouselData[slideIndex - 1];

  const slide = document.createElement('div');
  slide.className = 'carousel-slide';

  slide.innerHTML = `
    <div class="carousel-slide__img">
      <img src="${slideData.image}" alt="${slideData.title}">
    </div>

    <div class="carousel-slide__header">
      <h2 class="carousel-slide__title">${slideData.title}</h2>
      <p class="carousel-slide__description">${slideData.description}</p>
      <a href="${slideData.url}" class="carousel-slide__link">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <span>All Projects</span>
      </a>
    </div>

    <div class="carousel-slide__info">
      <div class="carousel-slide__tags">
        <p>Category / Year</p>
        <p>${slideData.category}, ${slideData.year}</p>
      </div>
      <div class="carousel-slide__counter">
        <span>${slideIndex.toString().padStart(2, '0')}</span>
        <span>/</span>
        <span>${totalSlides.toString().padStart(2, '0')}</span>
      </div>
    </div>
  `;

  return slide;
}

function splitText(slide) {
  const slideTitle = slide.querySelector('.carousel-slide__title');
  if (slideTitle && typeof SplitText !== 'undefined') {
    new SplitText(slideTitle, {
      type: 'words',
      wordsClass: 'carousel-word'
    });
  }

  const slideContent = slide.querySelectorAll('.carousel-slide__description, .carousel-slide__tags p, .carousel-slide__counter span');
  slideContent.forEach((element) => {
    if (typeof SplitText !== 'undefined') {
      new SplitText(element, {
        type: 'lines',
        linesClass: 'carousel-line'
      });
    }
  });
}

function animateSlide(direction) {
  if (isAnimating || !scrollAllowed) return;

  isAnimating = true;
  scrollAllowed = false;

  const currentSlideElement = carouselContainer.querySelector('.carousel-slide');

  if (direction === 'down') {
    currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
  } else {
    currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
  }

  const exitY = direction === 'down' ? '-100vh' : '100vh';
  const entryY = direction === 'down' ? '100vh' : '-100vh';

  // Fast, smooth exit animation
  gsap.to(currentSlideElement, {
    y: exitY,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut',
    force3D: true,
    onComplete: () => {
      currentSlideElement.remove();
    }
  });

  // Create and animate in new slide with slight delay
  setTimeout(() => {
    const newSlide = createSlide(currentSlide);

    gsap.set(newSlide, {
      y: entryY,
      force3D: true
    });

    carouselContainer.appendChild(newSlide);
    splitText(newSlide);

    const words = newSlide.querySelectorAll('.carousel-word');
    const lines = newSlide.querySelectorAll('.carousel-line');

    gsap.set([...words, ...lines], {
      y: '100%',
      force3D: true
    });

    // Smooth entry animation
    gsap.to(newSlide, {
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      force3D: true,
      onStart: () => {
        const tl = gsap.timeline();

        // Animate title words
        const titleWords = newSlide.querySelectorAll('.carousel-slide__title .carousel-word');
        tl.to(titleWords, {
          y: '0%',
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
          force3D: true
        }, 0.2);

        // Animate info and description
        const infoLines = newSlide.querySelectorAll('.carousel-slide__info .carousel-line');
        const descLines = newSlide.querySelectorAll('.carousel-slide__description .carousel-line');

        tl.to([...infoLines, ...descLines], {
          y: '0%',
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.03
        }, 0.3);

        // Animate link button
        const linkBtn = newSlide.querySelector('.carousel-slide__link');
        gsap.fromTo(linkBtn,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.4 }
        );
      },
      onComplete: () => {
        isAnimating = false;
        setTimeout(() => {
          scrollAllowed = true;
          lastScrollTime = Date.now();
        }, 50);
      }
    });
  }, 300);
}

function handleScroll(direction) {
  const now = Date.now();
  if (isAnimating || !scrollAllowed) return;
  if (now - lastScrollTime < 600) return;

  lastScrollTime = now;
  animateSlide(direction);
}

// Initialize first slide - no scale animation, just fade in
const firstSlide = createSlide(1);
carouselContainer.appendChild(firstSlide);
splitText(firstSlide);

// Simple fade in for first slide (no scale)
gsap.set(firstSlide, { opacity: 0 });

const words = firstSlide.querySelectorAll('.carousel-word');
const lines = firstSlide.querySelectorAll('.carousel-line');
const linkBtn = firstSlide.querySelector('.carousel-slide__link');

gsap.set([...words, ...lines], { y: '100%' });
gsap.set(linkBtn, { opacity: 0, y: 20 });

// Animate first slide in
gsap.to(firstSlide, {
  opacity: 1,
  duration: 0.6,
  ease: 'power2.out',
  delay: 0.2,
  onComplete: () => {
    // Animate text elements
    gsap.to([...words, ...lines], {
      y: '0%',
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.03
    });

    gsap.to(linkBtn, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.2
    });
  }
});

// Scroll events
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  const direction = e.deltaY > 0 ? 'down' : 'up';
  handleScroll(direction);
}, { passive: false });

// Touch events
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
