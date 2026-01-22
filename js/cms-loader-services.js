// Services Page CMS Content Loader

async function loadServicesContent() {
  try {
    // ===== HERO SECTION =====
    try {
      const heroRes = await fetch('/content/services/hero.json');
      const hero = await heroRes.json();
      
      const eyebrow = document.querySelector('.services-hero__eyebrow');
      const title = document.querySelector('.services-hero__title');
      
      if (eyebrow) eyebrow.textContent = hero.eyebrow;
      if (title) title.textContent = hero.title;
    } catch (err) {
      console.log('Hero content not loaded:', err.message);
    }

    // ===== SERVICES CARDS =====
    try {
      const servicesRes = await fetch('/content/services/services.json');
      const servicesData = await servicesRes.json();

      const container = document.getElementById('services-container');
      if (container && servicesData.services) {
        // Clear any existing content
        container.innerHTML = '';

        // Create service cards dynamically
        servicesData.services.forEach((service) => {
          const card = document.createElement('div');
          card.className = 'service-card';

          card.innerHTML = `
            <img src="${service.image}" alt="${service.title}" class="service-card__image">
            <div class="service-card__content">
              <h3 class="service-card__title">${service.title}</h3>
              <p class="service-card__description">${service.description}</p>
            </div>
          `;

          container.appendChild(card);
        });
      }
    } catch (err) {
      console.log('Services content not loaded:', err.message);
    }

    // ===== IMAGE SEPARATOR =====
    try {
      const separatorRes = await fetch('/content/services/separator.json');
      const separator = await separatorRes.json();
      
      const separatorImg = document.querySelector('.image-separator__img');
      if (separatorImg && separator.image) separatorImg.src = separator.image;
    } catch (err) {
      console.log('Separator content not loaded:', err.message);
    }


    // Dispatch event to signal content is ready for animations
    window.dispatchEvent(new CustomEvent('servicesContentLoaded'));
  } catch (error) {
    console.error('❌ Error loading services content:', error);
    // Still dispatch event so animations don't hang
    window.dispatchEvent(new CustomEvent('servicesContentLoaded'));
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadServicesContent);
} else {
  loadServicesContent();
}
