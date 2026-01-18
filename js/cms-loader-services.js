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
      
      const serviceCards = document.querySelectorAll('.service-card');
      servicesData.services.forEach((service, index) => {
        if (serviceCards[index]) {
          const title = serviceCards[index].querySelector('.service-card__title');
          const description = serviceCards[index].querySelector('.service-card__description');
          const img = serviceCards[index].querySelector('.service-card__image');
          
          if (title) title.textContent = service.title;
          if (description) description.textContent = service.description;
          if (img && service.image) img.src = service.image;
        }
      });
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

    console.log('✅ Services page content loaded from CMS');
  } catch (error) {
    console.error('❌ Error loading services content:', error);
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadServicesContent);
} else {
  loadServicesContent();
}
