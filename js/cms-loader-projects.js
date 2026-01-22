// Projects Page - Dynamic Project Loader

async function loadProjectsFromCMS() {
  try {
    // Fetch all project markdown files
    const projectFiles = ['the-gantry.md', 'lumos.md', 'deux-freres.md', 'tradies.md', 'coffee-emporium.md'];
    const projects = [];
    
    for (const file of projectFiles) {
      try {
        const response = await fetch(`/content/projects/${file}`);
        if (response.ok) {
          const content = await response.text();
          const project = parseProjectMarkdown(content, file);
          if (project) projects.push(project);
        }
      } catch (err) {
        console.log(`Project ${file} not found, skipping...`);
      }
    }
    
    // If we have projects from CMS, render them
    if (projects.length > 0) {
      renderProjects(projects);
    } else {
      console.log('⚠️ No projects found in CMS, showing hardcoded projects');
    }
  } catch (error) {
    console.error('❌ Error loading projects:', error);
  }
}

function parseProjectMarkdown(markdown, filename) {
  try {
    // Extract frontmatter (YAML between --- markers)
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return null;
    
    const frontmatter = frontmatterMatch[1];
    const project = {};
    
    // Parse YAML manually
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        project[key.trim()] = value;
      }
    });
    
    // Generate slug from filename
    project.slug = filename.replace('.md', '');
    
    return project;
  } catch (err) {
    console.error('Error parsing project:', err);
    return null;
  }
}

function renderProjects(projects) {
  const projectsList = document.querySelector('.projects__list');
  if (!projectsList) return;
  
  // Clear existing projects
  projectsList.innerHTML = '';
  
  // Render each project
  projects.forEach(project => {
    const projectHTML = `
      <a href="project.html?project=${project.slug}" class="projects__item" data-category="${project.category.toLowerCase()}">
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
            <img src="${project.image}" alt="${project.title} project" class="projects__item-image">
          </div>
          <div class="projects__item-arrow">→</div>
        </div>
      </a>
    `;
    
    projectsList.insertAdjacentHTML('beforeend', projectHTML);
  });
}

// Load projects when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProjectsFromCMS);
} else {
  loadProjectsFromCMS();
}
