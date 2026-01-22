/* ========================================
   CUSTOM CURSOR - Mouse Follower
   ======================================== */

function initCursor() {
  // Only load on desktop (992px+)
  if (window.innerWidth < 992) return;

  // Load Mouse Follower CSS
  const cursorCSS = document.createElement('link');
  cursorCSS.rel = 'stylesheet';
  cursorCSS.href = 'https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.css';
  document.head.appendChild(cursorCSS);

  // Load Mouse Follower JS
  const mouseFollowerScript = document.createElement('script');
  mouseFollowerScript.src = 'https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.js';
  document.head.appendChild(mouseFollowerScript);

  mouseFollowerScript.onload = function () {
    // Initialize cursor
    const cursor = new MouseFollower({
      speed: 0.6,
      ease: 'expo.out',
      skewing: 1,
      skewingText: 2,
      skewingIcon: 2,
      skewingMedia: 2
    });

    // Store cursor instance globally for other scripts
    window.customCursor = cursor;

    // Project list items - show "Visit"
    const projectItems = document.querySelectorAll('.projects__item, .project-card');
    projectItems.forEach(function (element) {
      element.addEventListener('mouseenter', () => cursor.setText('Visit'));
      element.addEventListener('mouseleave', () => cursor.removeText());
    });

    // Note: Slides (.slide) are handled directly in projects-grid.js
    // because they are created dynamically after this script runs

    // Links and buttons - scale up cursor
    const interactiveElements = document.querySelectorAll('a:not(.projects__item):not(.slide), button, .navbar__cta, .btn-wipe, .filter-btn');
    interactiveElements.forEach(function (element) {
      element.addEventListener('mouseenter', () => cursor.addState('-pointer'));
      element.addEventListener('mouseleave', () => cursor.removeState('-pointer'));
    });


  };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCursor);
} else {
  initCursor();
}
