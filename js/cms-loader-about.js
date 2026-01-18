// About Page CMS Content Loader

async function loadAboutContent() {
  try {
    // ===== HERO SECTION =====
    try {
      const heroRes = await fetch('/content/about/hero.json');
      const hero = await heroRes.json();
      
      const eyebrow = document.querySelector('.hero__eyebrow');
      const titleLines = document.querySelectorAll('.hero__title-line');
      const description = document.querySelector('.hero__description--about');
      
      if (eyebrow) eyebrow.textContent = hero.eyebrow;
      if (titleLines[0]) titleLines[0].textContent = hero.title_line_1;
      if (titleLines[1]) titleLines[1].textContent = hero.title_line_2;
      
      // Handle title line 3 with accent word
      if (titleLines[2]) {
        titleLines[2].innerHTML = `${hero.title_line_3} <span class="typewriter-word text-accent">${hero.accent_word}</span>`;
      }
      
      if (description) description.textContent = hero.description;
      
      // Update anchor links
      const anchors = document.querySelectorAll('.hero__anchor');
      hero.anchors.forEach((anchor, index) => {
        if (anchors[index]) {
          anchors[index].href = anchor.link;
          const linkTexts = anchors[index].querySelectorAll('.link-text');
          linkTexts.forEach(text => text.textContent = anchor.text);
        }
      });
    } catch (err) {
      console.log('Hero content not loaded:', err.message);
    }

    // ===== VALUES SECTION =====
    try {
      const valuesRes = await fetch('/content/about/values.json');
      const valuesData = await valuesRes.json();
      
      const valuesEyebrow = document.querySelector('.values__eyebrow');
      const valuesTitle = document.querySelector('.values__title');
      if (valuesEyebrow) valuesEyebrow.textContent = valuesData.eyebrow;
      if (valuesTitle) valuesTitle.textContent = valuesData.title;
      
      const valueCards = document.querySelectorAll('.values__card');
      valuesData.values.forEach((value, index) => {
        if (valueCards[index]) {
          const title = valueCards[index].querySelector('.values__card-title');
          const text = valueCards[index].querySelector('.values__card-text');
          const img = valueCards[index].querySelector('.values__card-img');
          
          if (title) title.textContent = value.title;
          if (text) text.textContent = value.description;
          if (img && value.image) img.src = value.image;
        }
      });
    } catch (err) {
      console.log('Values content not loaded:', err.message);
    }

    // ===== MISSION & VISION SECTION =====
    try {
      const missionVisionRes = await fetch('/content/about/mission-vision.json');
      const mv = await missionVisionRes.json();
      
      // Mission
      const missionEyebrow = document.querySelector('.mission__eyebrow');
      const missionText = document.querySelector('.mission__text--large');
      const missionImg = document.querySelector('.mission__img--large');
      
      if (missionEyebrow) missionEyebrow.textContent = mv.mission_eyebrow;
      if (missionText) missionText.textContent = mv.mission_text;
      if (missionImg && mv.mission_image) missionImg.src = mv.mission_image;
      
      // Vision
      const visionEyebrows = document.querySelectorAll('.mission__eyebrow');
      const visionText = document.querySelectorAll('.mission__text')[1];
      const visionImg = document.querySelectorAll('.mission__img')[1];
      
      if (visionEyebrows[1]) visionEyebrows[1].textContent = mv.vision_eyebrow;
      if (visionText) visionText.textContent = mv.vision_text;
      if (visionImg && mv.vision_image) visionImg.src = mv.vision_image;
    } catch (err) {
      console.log('Mission & Vision content not loaded:', err.message);
    }

    // ===== CLIENTS SECTION =====
    try {
      const clientsRes = await fetch('/content/about/clients.json');
      const clientsData = await clientsRes.json();
      
      const clientsEyebrow = document.querySelector('.clients__eyebrow');
      const clientsTitle = document.querySelector('.clients__title');
      
      if (clientsEyebrow) clientsEyebrow.textContent = clientsData.eyebrow;
      if (clientsTitle) clientsTitle.textContent = clientsData.title;
      
      // Update logos (both sets for the marquee)
      const logoImgs = document.querySelectorAll('.clients__logo');
      clientsData.logos.forEach((logo, index) => {
        // Update first set
        if (logoImgs[index] && logo.image) {
          logoImgs[index].src = logo.image;
          logoImgs[index].alt = logo.alt;
        }
        // Update duplicate set for marquee
        if (logoImgs[index + clientsData.logos.length] && logo.image) {
          logoImgs[index + clientsData.logos.length].src = logo.image;
          logoImgs[index + clientsData.logos.length].alt = logo.alt;
        }
      });
    } catch (err) {
      console.log('Clients content not loaded:', err.message);
    }

    // ===== IMAGE SEPARATORS =====
    try {
      const separatorRes = await fetch('/content/about/separator.json');
      const separator = await separatorRes.json();
      
      const separatorImgs = document.querySelectorAll('.image-separator__img');
      if (separatorImgs[0] && separator.top_image) separatorImgs[0].src = separator.top_image;
      if (separatorImgs[1] && separator.bottom_image) separatorImgs[1].src = separator.bottom_image;
    } catch (err) {
      console.log('Separator content not loaded:', err.message);
    }

    console.log('✅ About page content loaded from CMS');
  } catch (error) {
    console.error('❌ Error loading about content:', error);
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAboutContent);
} else {
  loadAboutContent();
}
