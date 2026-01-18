// Dynamic Content Loader for Netlify CMS
// This script reads content from JSON files and updates the page

async function loadContent() {
  try {
    // Load Hero Content
    const heroResponse = await fetch('/content/homepage/hero.json');
    const heroData = await heroResponse.json();
    
    // Update Hero Section
    document.querySelector('.hero__eyebrow').textContent = heroData.eyebrow;
    document.querySelectorAll('.hero__title-line')[0].textContent = heroData.title_line_1;
    document.querySelectorAll('.hero__title-line')[1].textContent = heroData.title_line_2;
    document.querySelectorAll('.hero__title-line')[2].textContent = heroData.title_line_3;
    document.querySelector('.hero__description').textContent = heroData.description;
    document.querySelector('.hero__scroll-cta').textContent = heroData.scroll_cta;

    // Load Numbers Content
    const numbersResponse = await fetch('/content/homepage/numbers.json');
    const numbersData = await numbersResponse.json();
    
    // Update Numbers Section
    const numberItems = document.querySelectorAll('.numbers__item');
    numbersData.numbers.forEach((num, index) => {
      if (numberItems[index]) {
        numberItems[index].querySelector('.numbers__value').textContent = num.value;
        numberItems[index].querySelector('.numbers__label').textContent = num.label;
      }
    });

    // Load Founders Content
    const foundersResponse = await fetch('/content/homepage/founders.json');
    const foundersData = await foundersResponse.json();
    
    // Update Founders Section
    document.querySelector('.founders__eyebrow').textContent = foundersData.eyebrow;
    document.querySelector('.founders__title').textContent = foundersData.title;
    const foundersParagraphs = document.querySelectorAll('.founders__text p');
    if (foundersParagraphs[0]) foundersParagraphs[0].textContent = foundersData.paragraph_1;
    if (foundersParagraphs[1]) foundersParagraphs[1].textContent = foundersData.paragraph_2;

    // Load Contact Settings
    const contactResponse = await fetch('/content/settings/contact.json');
    const contactData = await contactResponse.json();
    
    // Update Footer Contact Info
    const footerAddressPs = document.querySelectorAll('.footer__address p');
    if (footerAddressPs[0]) footerAddressPs[0].textContent = contactData.address_1;
    if (footerAddressPs[1]) footerAddressPs[1].textContent = '1800 BL PROJECTS';
    if (footerAddressPs[2]) footerAddressPs[2].textContent = contactData.address_2;
    if (footerAddressPs[3]) footerAddressPs[3].textContent = contactData.address_3;
    
    // Update email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.href = `mailto:${contactData.email}`;
      const linkText = link.querySelector('.link-text');
      if (linkText && linkText.textContent.includes('@')) {
        linkText.textContent = contactData.email;
        const hoverText = link.querySelectorAll('.link-text')[1];
        if (hoverText) hoverText.textContent = contactData.email;
      }
    });
    
    // Update phone links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.href = `tel:${contactData.phone}`;
      const phoneTexts = link.querySelectorAll('div');
      phoneTexts.forEach(text => {
        if (text.textContent.includes('+61')) {
          text.textContent = contactData.phone;
        }
      });
    });

    console.log('✅ Content loaded from CMS');
  } catch (error) {
    console.error('❌ Error loading content:', error);
    console.log('Falling back to hardcoded content');
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadContent);
} else {
  loadContent();
}
