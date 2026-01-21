// Global CMS Content Loader (Footer, Contact Info, etc.)
// This loads on ALL pages

async function loadGlobalContent() {
  try {
    // ===== CONTACT SETTINGS =====
    try {
      const contactRes = await fetch('/content/settings/contact.json');
      const contact = await contactRes.json();
      
      // Update Footer Address
      const addressPs = document.querySelectorAll('.footer__address p');
      if (addressPs[0]) addressPs[0].textContent = contact.company_name || 'Buterin L\'Estrange';
      if (addressPs[1]) addressPs[1].textContent = '1800 BL PROJECTS';
      if (addressPs[2]) addressPs[2].textContent = contact.address_1;
      if (addressPs[3]) addressPs[3].textContent = contact.address_2 + ', ' + contact.address_3;
      
      // Update ALL email links (footer + navbar)
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.href = `mailto:${contact.email}`;
        const linkTexts = link.querySelectorAll('.link-text');
        linkTexts.forEach(text => {
          if (text.textContent.includes('@')) {
            text.textContent = contact.email;
          }
        });
      });
      
      // Update ALL phone links (navbar CTA)
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = `tel:${contact.phone.replace(/\s/g, '')}`;
        const textDivs = link.querySelectorAll('.navbar__cta-text div, .mobile-menu__cta');
        textDivs.forEach(div => {
          if (div.textContent.includes('+61')) {
            div.textContent = contact.phone_display || contact.phone;
          }
        });
      });
      
      // Update WhatsApp links
      const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
      whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${contact.whatsapp}`;
      });
      
      // Update Instagram links
      const instagramLinks = document.querySelectorAll('a[href*="instagram"]');
      if (instagramLinks.length > 0 && contact.instagram) {
        instagramLinks.forEach(link => {
          link.href = contact.instagram;
          // Update Instagram link text
          const linkTexts = link.querySelectorAll('.link-text');
          linkTexts.forEach(text => {
            if (text.textContent.toLowerCase().includes('instagram') && contact.instagram_text) {
              text.textContent = contact.instagram_text;
            }
          });
        });
      }
    } catch (err) {
      console.log('Contact settings not loaded:', err.message);
    }

    // ===== FOOTER CONTENT =====
    try {
      const footerRes = await fetch('/content/settings/footer.json');
      const footer = await footerRes.json();
      
      const headingLine1 = document.querySelector('.footer__heading-line1');
      const headingText = document.querySelector('.footer__heading-text');
      const headingAccent = document.querySelector('.footer__heading-accent');
      const copyright = document.querySelector('.footer__copyright');
      
      if (headingLine1) headingLine1.textContent = footer.heading_line_1;
      if (headingText) headingText.textContent = footer.heading_line_2a;
      if (headingAccent) headingAccent.textContent = footer.heading_line_2b;
      if (copyright) copyright.textContent = footer.copyright;
      
      // Update policy links
      const cookieLinks = document.querySelectorAll('a[href*="cookie"]');
      const privacyLinks = document.querySelectorAll('a[href*="privacy"]');
      
      cookieLinks.forEach(link => {
        if (footer.cookie_policy_url) link.href = footer.cookie_policy_url;
      });
      
      privacyLinks.forEach(link => {
        if (footer.privacy_policy_url) link.href = footer.privacy_policy_url;
      });
    } catch (err) {
      console.log('Footer content not loaded:', err.message);
    }

    console.log('✅ Global content loaded from CMS');
  } catch (error) {
    console.error('❌ Error loading global content:', error);
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGlobalContent);
} else {
  loadGlobalContent();
}
