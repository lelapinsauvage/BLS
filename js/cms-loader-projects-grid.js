// Projects Grid Page - CMS Content Loader
// Loads projects from CMS markdown files for the slider view

async function loadProjectsForGrid() {
  try {
    // Fetch project index to get all project files dynamically
    const projectFiles = await discoverProjectFiles();
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

    // Update global projectsData for the slider
    if (projects.length > 0) {
      window.projectsData = projects.map(p => ({
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        image: p.image,
        url: `project.html?project=${p.slug}`
      }));
      console.log(`✅ Loaded ${projects.length} projects for grid from CMS`);
    } else {
      console.log('⚠️ No projects found in CMS, using fallback');
      // Fallback data
      window.projectsData = [
        { title: "The Gantry", category: "Commercial", year: "2025", description: "A bold commercial space designed with precision and purpose.", image: "images/project-gantry.png", url: "project.html?project=the-gantry" },
        { title: "Lumos", category: "Commercial", year: "2025", description: "Illuminating modern design with functional elegance.", image: "images/project-lumos.png", url: "project.html?project=lumos" },
        { title: "Deux Freres", category: "Hospitality", year: "2024", description: "A refined hospitality experience built on craftsmanship.", image: "images/project-deux-freres.png", url: "project.html?project=deux-freres" },
        { title: "Tradies", category: "Commercial", year: "2025", description: "We design and build purposeful spaces that last.", image: "images/project-tradies.png", url: "project.html?project=tradies" },
        { title: "Coffee Emporium", category: "Hospitality", year: "2024", description: "Where coffee culture meets architectural innovation.", image: "images/project-coffee-emporium.png", url: "project.html?project=coffee-emporium" }
      ];
    }
  } catch (error) {
    console.error('❌ Error loading projects for grid:', error);
  }
}

async function discoverProjectFiles() {
  // Try to fetch a manifest or use known files
  // Since we can't list directories in browser, we'll try known project files
  const knownFiles = [
    'the-gantry.md',
    'lumos.md',
    'deux-freres.md',
    'tradies.md',
    'coffee-emporium.md'
  ];

  // Try to discover more by checking if files exist
  const discoveredFiles = [];

  for (const file of knownFiles) {
    try {
      const response = await fetch(`/content/projects/${file}`, { method: 'HEAD' });
      if (response.ok) {
        discoveredFiles.push(file);
      }
    } catch (err) {
      // File doesn't exist, skip
    }
  }

  return discoveredFiles.length > 0 ? discoveredFiles : knownFiles;
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

// Load projects synchronously before page scripts run
(async function() {
  await loadProjectsForGrid();
})();
