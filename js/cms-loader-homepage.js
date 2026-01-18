// Homepage CMS Content Loader

async function loadHomepageContent() {
  try {
    // ===== HERO SECTION =====
    try {
      const heroRes = await fetch('/content/homepage/hero.json');
      const hero = await heroRes.json();
      
      const eyebrow = document.querySelector('.hero__eyebrow');
      if (eyebrow) eyebrow.textContent = hero.eyebrow;
      
      const titleLines = document.querySelectorAll('.hero__title-line');
      if (titleLines[0]) titleLines[0].textContent = hero.title_line_1;
      if (titleLines[1]) titleLines[1].textContent = hero.title_line_2;
      if (titleLines[2]) titleLines[2].textContent = hero.title_line_3;
      
      const description = document.querySelector('.hero__description');
      if (description) description.textContent = hero.description;
      
      const scrollCta = document.querySelector('.hero__scroll-cta');
      if (scrollCta) scrollCta.textContent = hero.scroll_cta || 'Scroll to discover';
    } catch (err) {
      console.log('Hero content not loaded:', err.message);
    }

    // ===== NUMBERS SECTION =====
    try {
      const numbersRes = await fetch('/content/homepage/numbers.json');
      const numbersData = await numbersRes.json();
      
      const numberItems = document.querySelectorAll('.numbers__item');
      numbersData.numbers.forEach((num, index) => {
        if (numberItems[index]) {
          const value = numberItems[index].querySelector('.numbers__value');
          const label = numberItems[index].querySelector('.numbers__label');
          if (value) value.textContent = num.value;
          if (label) label.textContent = num.label;
        }
      });
    } catch (err) {
      console.log('Numbers content not loaded:', err.message);
    }

    // ===== CATEGORIES SECTION =====
    try {
      const categoriesRes = await fetch('/content/homepage/categories.json');
      const categoriesData = await categoriesRes.json();
      
      const categoryItems = document.querySelectorAll('.categories__item');
      categoriesData.categories.forEach((cat, index) => {
        if (categoryItems[index]) {
          const title = categoryItems[index].querySelector('.categories__title');
          const description = categoryItems[index].querySelector('.categories__description');
          if (title) title.textContent = cat.title;
          if (description) description.textContent = cat.description;
          if (cat.image) {
            categoryItems[index].style.backgroundImage = `url('${cat.image}')`;
          }
          if (cat.link) {
            categoryItems[index].href = cat.link;
          }
        }
      });
    } catch (err) {
      console.log('Categories content not loaded:', err.message);
    }

    // ===== PROJECTS HEADER =====
    try {
      const projectsHeaderRes = await fetch('/content/homepage/projects-header.json');
      const projectsHeader = await projectsHeaderRes.json();
      
      const titleLeft = document.querySelector('.projects__title-left');
      const titleRight = document.querySelector('.projects__title-right');
      const intro = document.querySelector('.projects__intro');
      
      if (titleLeft) titleLeft.textContent = projectsHeader.title_left;
      if (titleRight) titleRight.textContent = projectsHeader.title_right;
      if (intro) intro.textContent = projectsHeader.intro;
    } catch (err) {
      console.log('Projects header content not loaded:', err.message);
    }

    // ===== FOUNDERS SECTION =====
    try {
      const foundersRes = await fetch('/content/homepage/founders.json');
      const founders = await foundersRes.json();
      
      const founderEyebrow = document.querySelector('.founders__eyebrow');
      const founderTitle = document.querySelector('.founders__title');
      const founderParagraphs = document.querySelectorAll('.founders__text p');
      const founderImage = document.querySelector('.founders__image');
      
      if (founderEyebrow) founderEyebrow.textContent = founders.eyebrow;
      if (founderTitle) founderTitle.textContent = founders.title;
      if (founderParagraphs[0]) founderParagraphs[0].textContent = founders.paragraph_1;
      if (founderParagraphs[1]) founderParagraphs[1].textContent = founders.paragraph_2;
      if (founderImage && founders.image) founderImage.src = founders.image;
    } catch (err) {
      console.log('Founders content not loaded:', err.message);
    }

    // ===== IMAGE SEPARATORS =====
    try {
      const separatorsRes = await fetch('/content/homepage/separators.json');
      const separators = await separatorsRes.json();
      
      const separatorImgs = document.querySelectorAll('.image-separator__img');
      separators.separators.forEach((sep, index) => {
        if (separatorImgs[index] && sep.image) {
          separatorImgs[index].src = sep.image;
        }
      });
    } catch (err) {
      console.log('Separators content not loaded:', err.message);
    }

    console.log('✅ Homepage content loaded from CMS');
  } catch (error) {
    console.error('❌ Error loading homepage content:', error);
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHomepageContent);
} else {
  loadHomepageContent();
}
