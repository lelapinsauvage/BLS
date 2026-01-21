// Unified Projects CMS Loader
// Handles all project loading for: index.html, projects-list.html, projects.html, project.html

(function() {
  'use strict';

  // DEBUG MODE - set to true for verbose logging
  const DEBUG = true;

  function debug(...args) {
    if (DEBUG) console.log('🔍 [Projects CMS]', ...args);
  }

  // Global projects store
  window.projectsStore = {
    all: [],
    loaded: false,
    loading: false
  };

  /**
   * Check if a project has all required fields
   */
  function isProjectComplete(project) {
    if (!project) {
      debug('isProjectComplete: project is null/undefined');
      return false;
    }

    // Required fields check
    const hasTitle = project.title && project.title.trim() !== '';
    const hasYear = project.year && project.year.trim() !== '';
    const hasCategory = project.category && project.category.trim() !== '';
    const hasDescription = project.description && project.description.trim() !== '';
    const hasImage = project.image && project.image.trim() !== '';
    const hasGallery = project.gallery && Array.isArray(project.gallery) && project.gallery.length >= 3;

    const isComplete = hasTitle && hasYear && hasCategory && hasDescription && hasImage && hasGallery;

    if (!isComplete) {
      debug(`Project "${project.title || 'unknown'}" incomplete:`, {
        hasTitle,
        hasYear,
        hasCategory,
        hasDescription,
        hasImage,
        hasGallery,
        galleryLength: project.gallery ? project.gallery.length : 0
      });
    }

    return isComplete;
  }

  /**
   * Load project manifest to discover all projects
   */
  async function loadManifest() {
    debug('Loading manifest from /content/projects/_manifest.json');
    try {
      const response = await fetch('/content/projects/_manifest.json');
      debug('Manifest response status:', response.status);
      if (!response.ok) {
        debug('Manifest not found, will use fallback');
        return null;
      }
      const manifest = await response.json();
      debug('Manifest loaded, projects:', manifest.projects);
      return manifest.projects || [];
    } catch (error) {
      debug('Manifest error:', error.message);
      console.log('No manifest found, using fallback discovery');
      return null;
    }
  }

  /**
   * Load a single project by slug
   */
  async function loadProject(slug) {
    debug(`Loading project: ${slug}`);
    try {
      const url = `/content/projects/${slug}.json`;
      debug(`Fetching: ${url}`);
      const response = await fetch(url);
      debug(`Response for ${slug}:`, response.status);
      if (!response.ok) {
        debug(`Project ${slug} not found (${response.status})`);
        return null;
      }
      const project = await response.json();
      project.slug = slug;
      debug(`Project ${slug} loaded:`, project);
      return project;
    } catch (error) {
      debug(`Error loading project ${slug}:`, error.message);
      console.log(`Failed to load project: ${slug}`);
      return null;
    }
  }

  /**
   * Load all projects from CMS
   */
  async function loadAllProjects() {
    debug('loadAllProjects called');

    if (window.projectsStore.loaded) {
      debug('Projects already loaded, returning cached:', window.projectsStore.all.length);
      return window.projectsStore.all;
    }

    if (window.projectsStore.loading) {
      debug('Projects currently loading, waiting...');
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.projectsStore.loaded) {
            clearInterval(checkInterval);
            resolve(window.projectsStore.all);
          }
        }, 50);
      });
    }

    window.projectsStore.loading = true;

    // Try to load manifest
    let projectSlugs = await loadManifest();

    // Fallback to known projects if no manifest
    if (!projectSlugs) {
      debug('No manifest, using fallback slugs');
      projectSlugs = [
        'the-gantry',
        'lumos',
        'deux-freres',
        'tradies',
        'coffee-emporium'
      ];
    }

    // Also try to discover additional projects not in manifest
    // Try common patterns for newly created projects
    const additionalSlugsToTry = [
      // Add any known new project slugs here for testing
    ];

    // Merge and dedupe
    projectSlugs = [...new Set([...projectSlugs, ...additionalSlugsToTry])];

    debug('Project slugs to load:', projectSlugs);

    // Also log what we'll try to fetch
    debug('Will attempt to fetch these project files:');
    projectSlugs.forEach(slug => debug(`  - /content/projects/${slug}.json`));

    // Load all projects
    const projects = [];
    for (const slug of projectSlugs) {
      const project = await loadProject(slug);
      if (project && isProjectComplete(project)) {
        debug(`✅ Project "${project.title}" is complete, adding to list`);
        projects.push(project);
      } else if (project) {
        debug(`❌ Project "${project.title || slug}" is incomplete, skipping`);
        console.log(`Project "${project.title || slug}" is incomplete and will not be displayed`);
      } else {
        debug(`❌ Project "${slug}" could not be loaded`);
      }
    }

    window.projectsStore.all = projects;
    window.projectsStore.loaded = true;
    window.projectsStore.loading = false;

    debug(`Total complete projects: ${projects.length}`);
    console.log(`Loaded ${projects.length} complete projects from CMS`);
    return projects;
  }

  /**
   * Get projects for homepage (featured, sorted by order)
   */
  async function getHomepageProjects() {
    debug('getHomepageProjects called');
    const projects = await loadAllProjects();
    debug('All projects:', projects.map(p => ({ title: p.title, display: p.display })));

    const featured = projects
      .filter(p => {
        const isFeatured = p.display && p.display.feature_homepage;
        debug(`Project "${p.title}" feature_homepage:`, isFeatured, 'display:', p.display);
        return isFeatured;
      })
      .sort((a, b) => {
        const orderA = a.display?.homepage_order || 99;
        const orderB = b.display?.homepage_order || 99;
        return orderA - orderB;
      });

    debug('Homepage featured projects:', featured.length, featured.map(p => p.title));
    return featured;
  }

  /**
   * Get projects for selected projects page (featured, sorted by order)
   */
  async function getSelectedProjects() {
    const projects = await loadAllProjects();
    return projects
      .filter(p => p.display && p.display.feature_selected)
      .sort((a, b) => {
        const orderA = a.display?.selected_order || 99;
        const orderB = b.display?.selected_order || 99;
        return orderA - orderB;
      });
  }

  /**
   * Get all projects (for projects list page)
   */
  async function getAllProjects() {
    const projects = await loadAllProjects();
    // Sort by year descending, then by title
    return projects.sort((a, b) => {
      if (b.year !== a.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Get a single project by slug
   */
  async function getProjectBySlug(slug) {
    const projects = await loadAllProjects();
    return projects.find(p => p.slug === slug) || null;
  }

  /**
   * Get next project in sequence (for "Next Project" navigation)
   */
  async function getNextProject(currentSlug) {
    const projects = await getAllProjects();
    const currentIndex = projects.findIndex(p => p.slug === currentSlug);
    if (currentIndex === -1) return projects[0] || null;
    const nextIndex = (currentIndex + 1) % projects.length;
    return projects[nextIndex];
  }

  /**
   * Render project item HTML (for list views)
   */
  function renderProjectItem(project, options = {}) {
    const { linkPrefix = 'project.html?project=', lazy = true } = options;
    const loadingAttr = lazy ? 'loading="lazy"' : '';

    return `
      <a href="${linkPrefix}${project.slug}" class="projects__item" data-category="${project.category.toLowerCase()}" data-transition>
        <div class="projects__item-info">
          <div class="projects__item-meta">
            <div class="projects__item-year">${project.year}</div>
            <div class="projects__item-type">${project.category}</div>
          </div>
          <div class="projects__item-title-wrap">
            <h3 class="projects__item-title">${project.title}</h3>
            <h3 class="projects__item-title projects__item-title--hover">${project.title}</h3>
          </div>
        </div>
        <div class="projects__item-visual">
          <div class="projects__item-image-wrap">
            <img src="${project.image}" alt="${project.title} project" class="projects__item-image" ${loadingAttr}>
          </div>
          <div class="projects__item-arrow">→</div>
        </div>
      </a>
    `;
  }

  /**
   * Populate homepage projects section
   */
  async function populateHomepageProjects() {
    const container = document.querySelector('.projects__list');
    if (!container) return;

    const projects = await getHomepageProjects();
    if (projects.length === 0) return;

    // Load homepage images eagerly (no lazy loading) for faster display
    container.innerHTML = projects.map(p => renderProjectItem(p, { lazy: false })).join('');

    // Dispatch event for animations
    window.dispatchEvent(new CustomEvent('homepageProjectsLoaded', { detail: { projects } }));
    console.log(`Rendered ${projects.length} homepage projects from CMS`);
  }

  /**
   * Populate projects list page (all projects)
   */
  async function populateProjectsList() {
    const container = document.querySelector('.projects--page .projects__list');
    if (!container) return;

    const projects = await getAllProjects();
    if (projects.length === 0) return;

    // First 4 projects load eagerly (visible above fold), rest lazy load
    container.innerHTML = projects.map((p, index) =>
      renderProjectItem(p, { lazy: index >= 4 })
    ).join('');

    // Re-initialize filter functionality if it exists
    if (window.initProjectFilters) {
      window.initProjectFilters();
    }

    // Dispatch event for animations
    window.dispatchEvent(new CustomEvent('projectsListLoaded', { detail: { projects } }));
    console.log(`Rendered ${projects.length} projects on projects list from CMS`);
  }

  /**
   * Populate selected projects slider (projects.html)
   */
  async function populateSelectedProjects() {
    const projects = await getSelectedProjects();

    // Set global projectsData for the slider script
    window.projectsData = projects.map(p => ({
      title: p.title,
      category: p.category,
      year: p.year,
      description: p.description,
      image: p.image,
      url: `project.html?project=${p.slug}`
    }));

    // Dispatch event for slider initialization
    window.dispatchEvent(new CustomEvent('selectedProjectsLoaded', { detail: { projects } }));
    console.log(`Loaded ${projects.length} selected projects for slider from CMS`);
  }

  /**
   * Populate single project page
   */
  async function populateProjectPage() {
    // Get project slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get('project');

    if (!projectSlug) {
      console.log('No project specified in URL');
      return;
    }

    const project = await getProjectBySlug(projectSlug);
    if (!project) {
      console.log(`Project not found: ${projectSlug}`);
      return;
    }

    // Update page title
    document.title = `${project.title} | Buterin L'Estrange`;

    // Update SEO meta tags for this project
    const projectDescription = project.description || `${project.title} - ${project.category} project by Buterin L'Estrange`;
    const projectUrl = `https://blprojects.com.au/project?project=${projectSlug}`;
    const projectImage = project.image ? `https://blprojects.com.au${project.image}` : 'https://blprojects.com.au/images/og-image.jpg';

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', projectDescription);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogTitle) ogTitle.setAttribute('content', `${project.title} | Buterin L'Estrange`);
    if (ogDesc) ogDesc.setAttribute('content', projectDescription);
    if (ogUrl) ogUrl.setAttribute('content', projectUrl);
    if (ogImage) ogImage.setAttribute('content', projectImage);

    // Update Twitter Card tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twTitle) twTitle.setAttribute('content', `${project.title} | Buterin L'Estrange`);
    if (twDesc) twDesc.setAttribute('content', projectDescription);
    if (twImage) twImage.setAttribute('content', projectImage);

    // Update project title
    const titleEl = document.querySelector('.project__title');
    if (titleEl) titleEl.textContent = project.title;

    // Update project meta
    const details = project.details || {};

    const metaItems = [
      { label: 'Location', value: details.location },
      { label: 'Year Completed', value: details.year_completed || project.year },
      { label: 'Project Type', value: project.category },
      { label: 'Scope of Work', value: details.scope },
      { label: 'Size / Levels', value: details.size }
    ];

    const metaContainer = document.querySelector('.project__meta');
    if (metaContainer) {
      metaContainer.innerHTML = metaItems
        .filter(item => item.value)
        .map(item => `
          <div class="project__meta-item">
            <div class="project__meta-label">${item.label}</div>
            <div class="project__meta-value">${item.value}</div>
          </div>
        `).join('');
    }

    // Update project description
    const descriptionText = document.querySelector('.project__description-text');
    if (descriptionText) {
      descriptionText.textContent = details.full_description || project.description;
    }

    // Update gallery
    const galleryContainer = document.querySelector('.project__gallery');
    if (galleryContainer && project.gallery && project.gallery.length > 0) {
      galleryContainer.innerHTML = project.gallery.map((item, index) => {
        // First 2 images load eagerly, rest lazy load
        const loadingAttr = index >= 2 ? 'loading="lazy"' : '';

        // Create different layouts for visual interest
        if (index === 2 && project.gallery.length > 3) {
          // Check if we can make a row of two
          const nextItem = project.gallery[index + 1];
          if (nextItem) {
            return `
              <div class="project__image-row">
                <img src="${item.image}" alt="${item.caption || project.title + ' Image ' + (index + 1)}" class="project__image project__image--half" ${loadingAttr}>
                <img src="${nextItem.image}" alt="${nextItem.caption || project.title + ' Image ' + (index + 2)}" class="project__image project__image--half" loading="lazy">
              </div>
            `;
          }
        }
        // Skip the 4th image if it was included in the row above
        if (index === 3 && project.gallery.length > 4) {
          return '';
        }
        return `<img src="${item.image}" alt="${item.caption || project.title + ' Image ' + (index + 1)}" class="project__image" ${loadingAttr}>`;
      }).join('');
    }

    // Update next project section
    const nextProject = await getNextProject(projectSlug);
    if (nextProject) {
      const nextTitle = document.querySelector('.project-next__title');
      const nextButton = document.querySelector('.project-next__button');
      const nextImage = document.querySelector('.project-next__image');
      const navbarNextBtn = document.querySelector('.navbar__action-btn--next');

      if (nextTitle) nextTitle.textContent = nextProject.title.toUpperCase();
      if (nextButton) nextButton.href = `project.html?project=${nextProject.slug}`;
      if (navbarNextBtn) navbarNextBtn.href = `project.html?project=${nextProject.slug}`;
      if (nextImage) {
        nextImage.src = nextProject.image;
        nextImage.alt = nextProject.title;
      }
    }

    // Dispatch event for animations
    window.dispatchEvent(new CustomEvent('projectPageLoaded', { detail: { project } }));
    console.log(`Loaded project: ${project.title} from CMS`);
  }

  /**
   * Initialize based on current page
   */
  async function init() {
    const path = window.location.pathname;
    debug('=== INIT START ===');
    debug('Path:', path);
    debug('Hostname:', window.location.hostname);
    console.log('📦 Projects CMS init, path:', path);

    if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
      debug('Detected: HOMEPAGE');
      await populateHomepageProjects();
    } else if (path.includes('projects-list') || path.endsWith('projects-list')) {
      debug('Detected: PROJECTS LIST');
      await populateProjectsList();
    } else if ((path.includes('projects') || path.endsWith('projects')) && !path.includes('projects-list') && !path.includes('project.html') && !path.endsWith('project')) {
      debug('Detected: SELECTED PROJECTS');
      await populateSelectedProjects();
    } else if (path.includes('project.html') || path.endsWith('project') || path.match(/\/project($|\?)/)) {
      debug('Detected: SINGLE PROJECT');
      await populateProjectPage();
    } else {
      debug('No matching page detected');
    }

    debug('=== INIT END ===');
  }

  // Expose functions globally for debugging
  window.projectsCMS = {
    loadAllProjects,
    getHomepageProjects,
    getSelectedProjects,
    getAllProjects,
    getProjectBySlug,
    getNextProject,
    isProjectComplete,
    // Debug helpers
    debug: {
      testLoadProject: async (slug) => {
        console.log(`Testing load of project: ${slug}`);
        const project = await loadProject(slug);
        console.log('Result:', project);
        if (project) {
          console.log('Is complete:', isProjectComplete(project));
        }
        return project;
      },
      listLoadedProjects: () => {
        console.log('Loaded projects:', window.projectsStore.all);
        return window.projectsStore.all;
      },
      reloadProjects: async () => {
        window.projectsStore.loaded = false;
        window.projectsStore.loading = false;
        window.projectsStore.all = [];
        return await loadAllProjects();
      },
      getStore: () => window.projectsStore
    }
  };

  console.log('💡 Projects CMS Debug: Use window.projectsCMS.debug for testing');

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
