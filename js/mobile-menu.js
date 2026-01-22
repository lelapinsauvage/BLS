/**
 * Mobile Menu - Award-Winning Animated Navigation
 * Handles burger menu toggle and full-screen menu animations
 */

function initMobileMenu() {
  const burgerOpen = document.querySelector('.burger-menu--open');
  const burgerClose = document.querySelector('.burger-menu--close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
  const mobileCTA = document.querySelector('.mobile-menu__cta');
  const separator = document.querySelector('.mobile-menu__separator');
  const panels = {
    top: document.querySelector('.mobile-menu__panel--top'),
    bottom: document.querySelector('.mobile-menu__panel--bottom')
  };

  if (!burgerOpen || !burgerClose || !mobileMenu) {
    return;
  }

  let isOpen = false;
  let menuTimeline;

  // Create menu animation timeline
  function createMenuTimeline() {
    const tl = gsap.timeline({ paused: true });

    // Panel reveal animation (similar to loader)
    tl.to([panels.top, panels.bottom], {
      xPercent: 0,
      yPercent: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0);

    // Fade in content wrapper
    tl.to('.mobile-menu__content', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.4);

    // Stagger animate links from bottom
    tl.to(mobileMenuLinks, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    }, 0.5);

    // Animate separator
    if (separator) {
      tl.to(separator, {
        opacity: 0.5,
        scaleX: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.8);
    }

    // Animate CTA button
    if (mobileCTA) {
      tl.to(mobileCTA, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.2)'
      }, 0.9);
    }

    return tl;
  }

  // Toggle menu
  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open menu
  function openMenu() {
    isOpen = true;
    mobileMenu.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Create and play timeline
    if (!menuTimeline) {
      menuTimeline = createMenuTimeline();
    }
    menuTimeline.play();
  }

  // Close menu
  function closeMenu() {
    isOpen = false;

    // Reverse animation
    if (menuTimeline) {
      menuTimeline.eventCallback('onReverseComplete', () => {
        mobileMenu.classList.remove('is-active');
        document.body.style.overflow = '';
        menuTimeline.eventCallback('onReverseComplete', null);
      });
      menuTimeline.reverse();
    } else {
      mobileMenu.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Event listeners
  burgerOpen.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  burgerClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Close menu when clicking on a link (for page transitions)
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!link.classList.contains('mobile-menu__link--active')) {
        setTimeout(() => {
          closeMenu();
        }, 150);
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}
