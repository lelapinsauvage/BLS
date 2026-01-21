// Unified Projects CMS Loader
// Handles all project loading for: index.html, projects-list.html, projects.html, project.html

(function() {
  'use strict';

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
    if (!project) return false;

    // Required fields check
    const hasTitle = project.title && project.title.trim() !== '';
    const hasYear = project.year && project.year.trim() !== '';
    const hasCategory = project.category && project.category.trim() !== '';
    const hasDescription = project.description && project.description.trim() !== '';
    const hasImage = project.image && project.image.trim() !== '';
    const hasGallery = project.gallery && Array.isArray(project.gallery) && project.gallery.length >= 3;

    return hasTitle && hasYear && hasCategory && hasDescription && hasImage && hasGallery;
  }

  /**
   * Load project manifest to discover all projects
   */
  async function loadManifest() {
    try {
      const response = await fetch('/content/projects/_manifest.json');
      if (!response.ok) return null;
      const manifest = await response.json();
      return manifest.projects || [];
    } catch (error) {
      console.log('No manifest found, using fallback discovery');
      return null;
    }
  }

  /**
   * Load a single project by slug
   */
  async function loadProject(slug) {
    try {
      const response = await fetch(`/content/projects/${slug}.json`);
      if (!response.ok) return null;
      const project = await response.json();
      project.slug = slug;
      return project;
    } catch (error) {
      console.log(`Failed to load project: ${slug}`);
      return null;
    }
  }

  /**
   * Load all projects from CMS
   */
  async function loadAllProjects() {
    if (window.projectsStore.loaded) {
      return window.projectsStore.all;
    }

    if (window.projectsStore.loading) {
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
      projectSlugs = [
        'the-gantry',
        'lumos',
        'deux-freres',
        'tradies',
        'coffee-emporium'
      ];
    }

    // Load all projects
    const projects = [];
    for (const slug of projectSlugs) {
      const project = await loadProject(slug);
      if (project && isProjectComplete(project)) {
        projects.push(project);
      } else if (project) {
        console.log(`Project "${project.title || slug}" is incomplete and will not be displayed`);
      }
    }

    window.projectsStore.all = projects;
    window.projectsStore.loaded = true;
    window.projectsStore.loading = false;

    console.log(`Loaded ${projects.length} complete projects from CMS`);
    return projects;
  }

  /**
   * Get projects for homepage (featured, sorted by order)
   */
  async function getHomepageProjects() {
    const projects = await loadAllProjects();
    return projects
      .filter(p => p.display && p.display.feature_homepage)
      .sort((a, b) => {
        const orderA = a.display?.homepage_order || 99;
        const orderB = b.display?.homepage_order || 99;
        return orderA - orderB;
      });
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
    const { linkPrefix = 'project.html?project=' } = options;

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
            <img src="${project.image}" alt="${project.title} project" class="projects__item-image" loading="lazy">
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

    container.innerHTML = projects.map(p => renderProjectItem(p)).join('');

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

    container.innerHTML = projects.map(p => renderProjectItem(p)).join('');

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
    document.title = `${project.title} - Buterin L'Estrange`;

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
        // Create different layouts for visual interest
        if (index === 2 && project.gallery.length > 3) {
          // Check if we can make a row of two
          const nextItem = project.gallery[index + 1];
          if (nextItem) {
            return `
              <div class="project__image-row">
                <img src="${item.image}" alt="${item.caption || project.title + ' Image ' + (index + 1)}" class="project__image project__image--half">
                <img src="${nextItem.image}" alt="${nextItem.caption || project.title + ' Image ' + (index + 2)}" class="project__image project__image--half">
              </div>
            `;
          }
        }
        // Skip the 4th image if it was included in the row above
        if (index === 3 && project.gallery.length > 4) {
          return '';
        }
        return `<img src="${item.image}" alt="${item.caption || project.title + ' Image ' + (index + 1)}" class="project__image">`;
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
    console.log('📦 Projects CMS init, path:', path);

    if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
      // Homepage - load featured projects
      await populateHomepageProjects();
    } else if (path.includes('projects-list') || path.endsWith('projects-list')) {
      // Projects list page - load all projects
      await populateProjectsList();
    } else if ((path.includes('projects') || path.endsWith('projects')) && !path.includes('projects-list') && !path.includes('project.html') && !path.endsWith('project')) {
      // Selected projects slider - load selected projects
      await populateSelectedProjects();
    } else if (path.includes('project.html') || path.endsWith('project') || path.match(/\/project($|\?)/)) {
      // Single project page - load specific project
      await populateProjectPage();
    }
  }

  // Expose functions globally
  window.projectsCMS = {
    loadAllProjects,
    getHomepageProjects,
    getSelectedProjects,
    getAllProjects,
    getProjectBySlug,
    getNextProject,
    isProjectComplete
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
