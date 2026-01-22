// SEO CMS Loader
// Dynamically loads SEO settings from CMS and updates meta tags

(function() {
  'use strict';

  // Determine current page
  function getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
      return 'homepage';
    } else if (path.includes('about')) {
      return 'about';
    } else if (path.includes('services')) {
      return 'services';
    } else if (path.includes('projects-list') || path.endsWith('projects-list')) {
      return 'projects-list';
    } else if (path.includes('projects') && !path.includes('project.html') && !path.match(/\/project($|\?)/)) {
      return 'projects';
    }
    // project.html handles its own SEO via cms-loader-projects-unified.js
    return null;
  }

  // Update or create a meta tag
  function setMetaTag(selector, attribute, value) {
    if (!value) return;
    let tag = document.querySelector(selector);
    if (tag) {
      tag.setAttribute(attribute, value);
    }
  }

  // Update page title
  function setPageTitle(title) {
    if (title) {
      document.title = title;
    }
  }

  // Generate and inject JSON-LD structured data
  function injectStructuredData(global) {
    if (!global || !global.local_business) return;

    const lb = global.local_business;
    const social = global.social || {};

    const structuredData = {
      "@context": "https://schema.org",
      "@type": lb.type || "LocalBusiness",
      "name": global.site_name,
      "alternateName": "BLS Projects",
      "description": global.default_description,
      "url": global.site_url,
      "logo": `${global.site_url}/images/logo.png`,
      "image": global.og_image ? `${global.site_url}${global.og_image}` : `${global.site_url}/images/og-image.jpg`,
      "telephone": lb.phone,
      "email": lb.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": lb.street,
        "addressLocality": lb.city,
        "addressRegion": lb.region,
        "postalCode": lb.postal_code,
        "addressCountry": lb.country
      },
      "areaServed": [
        { "@type": "City", "name": "Sydney" },
        { "@type": "Place", "name": "Central Coast" }
      ],
      "serviceType": ["Commercial Construction", "Residential Construction", "Hospitality Fit-out", "Retail Fit-out"],
      "priceRange": lb.price_range,
      "openingHours": lb.opening_hours
    };

    // Add geo coordinates if available
    if (lb.latitude && lb.longitude) {
      structuredData.geo = {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(lb.latitude),
        "longitude": parseFloat(lb.longitude)
      };
    }

    // Add social links
    const sameAs = [];
    if (social.instagram) sameAs.push(social.instagram);
    if (social.facebook) sameAs.push(social.facebook);
    if (social.linkedin) sameAs.push(social.linkedin);
    if (sameAs.length > 0) {
      structuredData.sameAs = sameAs;
    }

    // Remove existing structured data if present
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Inject new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  // Main SEO loader function
  async function loadSEO() {
    const currentPage = getCurrentPage();

    try {
      // Load global SEO settings
      const globalRes = await fetch('/content/seo/global.json');
      const global = await globalRes.json();

      // Update favicon if set
      if (global.favicon) {
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = global.favicon;
      }

      // Update apple touch icon if set
      if (global.apple_touch_icon) {
        let appleLink = document.querySelector('link[rel="apple-touch-icon"]');
        if (!appleLink) {
          appleLink = document.createElement('link');
          appleLink.rel = 'apple-touch-icon';
          appleLink.sizes = '180x180';
          document.head.appendChild(appleLink);
        }
        appleLink.href = global.apple_touch_icon;
      }

      // Update default OG site name
      setMetaTag('meta[property="og:site_name"]', 'content', global.site_name);

      // Inject structured data (only on homepage)
      if (currentPage === 'homepage') {
        injectStructuredData(global);
      }

      // Load page-specific SEO if applicable
      if (currentPage) {
        try {
          const pageRes = await fetch(`/content/seo/${currentPage}.json`);
          const pageSEO = await pageRes.json();

          // Update page title
          setPageTitle(pageSEO.title);

          // Update meta description
          setMetaTag('meta[name="description"]', 'content', pageSEO.description);

          // Determine OG image (page-specific or global default)
          const ogImage = pageSEO.og_image || global.og_image;
          const fullOgImage = ogImage ? `${global.site_url}${ogImage}` : '';

          // Update Open Graph tags
          setMetaTag('meta[property="og:title"]', 'content', pageSEO.title);
          setMetaTag('meta[property="og:description"]', 'content', pageSEO.description);
          if (fullOgImage) {
            setMetaTag('meta[property="og:image"]', 'content', fullOgImage);
          }

          // Update Twitter Card tags
          setMetaTag('meta[name="twitter:title"]', 'content', pageSEO.title);
          setMetaTag('meta[name="twitter:description"]', 'content', pageSEO.description);
          if (fullOgImage) {
            setMetaTag('meta[name="twitter:image"]', 'content', fullOgImage);
          }

          // Update canonical URL
          const canonicalPath = currentPage === 'homepage' ? '' : `/${currentPage.replace('-', '-')}`;
          setMetaTag('link[rel="canonical"]', 'href', `${global.site_url}${canonicalPath}`);
        } catch (err) {
          // Page-specific SEO not found, using global defaults
        }
      }

    } catch (err) {
      // Global SEO settings not loaded
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSEO);
  } else {
    loadSEO();
  }
})();
