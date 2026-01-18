// Projects Carousel - BLS Version
// Adapted from Codegrid carousel for BLS projects

const projectsCarouselData = [
  {
    title: "The Gantry",
    description: "A modern workspace transformation bringing industrial heritage into contemporary commercial design.",
    url: "/project/the-gantry",
    category: "Commercial",
    year: "2025",
    image: "images/project-gantry.png"
  },
  {
    title: "Lumos",
    description: "Premium office fitout combining cutting-edge design with functional elegance for the modern workplace.",
    url: "/project/lumos",
    category: "Commercial",
    year: "2025",
    image: "images/project-lumos.png"
  },
  {
    title: "Deux Frères",
    description: "A sophisticated hospitality space where French culinary tradition meets Sydney's design-led aesthetic.",
    url: "/project/deux-freres",
    category: "Hospitality",
    year: "2025",
    image: "images/project-deux-freres.png"
  },
  {
    title: "Tradies",
    description: "Bold commercial fitout celebrating authentic craftsmanship with a contemporary edge.",
    url: "/project/tradies",
    category: "Commercial",
    year: "2025",
    image: "images/project-tradies.png"
  },
  {
    title: "Coffee Emporium",
    description: "A warm, inviting café space designed for community connection and exceptional coffee experiences.",
    url: "/project/coffee-emporium",
    category: "Hospitality",
    year: "2025",
    image: "images/project-coffee-emporium.png"
  }
];

function initProjectsCarousel() {
  const totalSlides = projectsCarouselData.length;
  let currentSlide = 1;
  let isAnimating = false;
  let scrollAllowed = true;
  let lastScrollTime = 0;

  // Create toggle buttons
  const projectsHeader = document.querySelector('.projects-header') || document.querySelector('.projects__header');
  if (!projectsHeader) {
    console.log('❌ Projects header not found');
    return;
  }

  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'projects__view-toggle';
  toggleContainer.innerHTML = `
    <button class="projects__view-btn projects__view-btn--active" data-view="list">List View</button>
    <button class="projects__view-btn" data-view="grid">Grid View</button>
  `;
  projectsHeader.after(toggleContainer);

  // Create carousel container
  const projectsSection = document.querySelector('.projects--page') || document.querySelector('.projects');
  if (!projectsSection) {
    console.log('❌ Projects section not found');
    return;
  }
  
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'projects__carousel';
  projectsSection.appendChild(carouselContainer);

  // Toggle functionality
  const listBtn = toggleContainer.querySelector('[data-view="list"]');
  const gridBtn = toggleContainer.querySelector('[data-view="grid"]');
  const projectsList = document.querySelector('.projects__list');
  const projectsCta = document.querySelector('.projects__cta');

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('projects__view-btn--active');
    gridBtn.classList.remove('projects__view-btn--active');
    carouselContainer.classList.remove('is-active');
    projectsList.classList.remove('is-hidden');
    if (projectsCta) projectsCta.classList.remove('is-hidden');
  });

  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('projects__view-btn--active');
    listBtn.classList.remove('projects__view-btn--active');
    carouselContainer.classList.add('is-active');
    projectsList.classList.add('is-hidden');
    if (projectsCta) projectsCta.classList.add('is-hidden');
    
    // Initialize first slide if carousel is empty
    if (carouselContainer.children.length === 0) {
      const firstSlide = createSlide(1);
      carouselContainer.appendChild(firstSlide);
      splitText(firstSlide);
    }
  });

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
        <a href="${slideData.url}" class="carousel-slide__link">View Project</a>
      </div>

      <div class="carousel-slide__info">
        <div class="carousel-slide__tags">
          <p>Project Info</p>
          <p>${slideData.category}</p>
          <p>${slideData.year}</p>
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

    const slideContent = slide.querySelectorAll('.carousel-slide__description, .carousel-slide__link, .carousel-slide__tags p, .carousel-slide__counter span');
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
    if (!carouselContainer.classList.contains('is-active')) return;

    isAnimating = true;
    scrollAllowed = false;

    const currentSlideElement = carouselContainer.querySelector('.carousel-slide');

    if (direction === 'down') {
      currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
    } else {
      currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    }

    const exitY = direction === 'down' ? '-200vh' : '200vh';
    const entryY = direction === 'down' ? '100vh' : '-100vh';
    const entryClipPath = direction === 'down'
      ? 'polygon(20% 20%, 80% 20%, 80% 100%, 20% 100%)'
      : 'polygon(20% 0%, 80% 0%, 80% 80%, 20% 80%)';

    gsap.to(currentSlideElement, {
      scale: 0.25,
      opacity: 0,
      rotation: 30,
      y: exitY,
      duration: 2,
      ease: 'power4.inOut',
      force3D: true,
      onComplete: () => {
        currentSlideElement.remove();
      }
    });

    setTimeout(() => {
      const newSlide = createSlide(currentSlide);

      gsap.set(newSlide, {
        y: entryY,
        clipPath: entryClipPath,
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

      gsap.to(newSlide, {
        y: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'power4.out',
        force3D: true,
        onStart: () => {
          const tl = gsap.timeline();

          const titleWords = newSlide.querySelectorAll('.carousel-slide__title .carousel-word');
          tl.to(titleWords, {
            y: '0%',
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            force3D: true
          }, 0.75);

          const infoLines = newSlide.querySelectorAll('.carousel-slide__info .carousel-line');
          const descLines = newSlide.querySelectorAll('.carousel-slide__description .carousel-line');
          const linkLines = newSlide.querySelectorAll('.carousel-slide__link .carousel-line');

          tl.to([...infoLines, ...descLines], {
            y: '0%',
            duration: 1,
            ease: 'power4.out',
            stagger: 0.05
          }, '-=0.75');

          tl.to(linkLines, {
            y: '0%',
            duration: 1,
            ease: 'power4.out'
          }, '-=0.5');
        },
        onComplete: () => {
          isAnimating = false;
          setTimeout(() => {
            scrollAllowed = true;
            lastScrollTime = Date.now();
          }, 100);
        }
      });
    }, 750);
  }

  function handleScroll(direction) {
    const now = Date.now();
    if (isAnimating || !scrollAllowed) return;
    if (now - lastScrollTime < 1000) return;
    if (!carouselContainer.classList.contains('is-active')) return;

    lastScrollTime = now;
    animateSlide(direction);
  }

  // Scroll events
  window.addEventListener('wheel', (e) => {
    if (carouselContainer.classList.contains('is-active')) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleScroll(direction);
    }
  }, { passive: false });

  // Touch events
  let touchStartY = 0;
  let isTouchActive = false;

  window.addEventListener('touchstart', (e) => {
    if (carouselContainer.classList.contains('is-active')) {
      touchStartY = e.touches[0].clientY;
      isTouchActive = true;
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (carouselContainer.classList.contains('is-active')) {
      e.preventDefault();
      if (!isTouchActive || isAnimating || !scrollAllowed) return;

      const touchCurrentY = e.touches[0].clientY;
      const difference = touchStartY - touchCurrentY;

      if (Math.abs(difference) > 50) {
        isTouchActive = false;
        const direction = difference > 0 ? 'down' : 'up';
        handleScroll(direction);
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouchActive = false;
  });

  console.log('✅ Projects Carousel initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCarousel);
} else {
  initProjectsCarousel();
}
