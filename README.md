# Buterin L'Estrange Website

Modern construction company website with Netlify CMS for easy content management.

## 🚀 Quick Start

### Local Development
```bash
python3 -m http.server 8000
```
Visit: `http://localhost:8000`

### CMS Access
- **Local**: `http://localhost:8000/admin/`
- **Production**: `https://yoursite.com/admin/`

## 📁 Project Structure

```
BLS/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── projects.html           # Projects list
├── projects-grid.html      # Projects carousel
├── project.html            # Single project template
├── thank-you.html          # Form success page
│
├── admin/                  # CMS configuration
│   ├── config.yml         # CMS fields & collections
│   └── index.html         # CMS entry point
│
├── content/                # Editable content (JSON/MD)
│   ├── homepage/          # Homepage sections
│   ├── about/             # About page sections
│   ├── services/          # Services page content
│   ├── projects/          # Project markdown files
│   └── settings/          # Global settings
│
├── css/                    # Stylesheets
│   ├── reset.css          # CSS reset
│   ├── design-system.css  # Design tokens & shared styles
│   ├── styles.css         # Homepage styles
│   ├── about.css          # About page styles
│   ├── services.css       # Services page styles
│   ├── projects.css       # Projects list styles
│   ├── projects-carousel.css  # Carousel styles
│   └── project.css        # Single project styles
│
├── js/                     # JavaScript
│   ├── cms-loader-global.js    # Loads on all pages
│   ├── cms-loader-homepage.js  # Homepage content
│   ├── cms-loader-about.js     # About content
│   ├── cms-loader-services.js  # Services content
│   ├── main.js                 # Homepage interactions
│   ├── about.js                # About page interactions
│   ├── services.js             # Services page interactions
│   ├── projects.js             # Projects list interactions
│   ├── projects-carousel.js    # Carousel (with toggle)
│   ├── projects-carousel-standalone.js  # Carousel (standalone)
│   ├── project.js              # Single project interactions
│   ├── mobile-menu.js          # Mobile menu
│   └── transitions.js          # Page transitions
│
├── images/                 # All images & media
└── docs/                   # Documentation
    ├── CMS-GUIDE.md       # How to use the CMS
    └── NETLIFY_SETUP_GUIDE.md  # Deployment guide
```

## 🎨 CMS Features

All content is editable through `/admin/`:
- ✅ Hero sections (text, images, videos)
- ✅ Numbers, categories, values, services
- ✅ Projects (create/edit/delete)
- ✅ Contact info (updates everywhere)
- ✅ Footer content
- ✅ All images

## 📦 Dependencies

- **Lenis** - Smooth scrolling
- **GSAP** - Animations (ScrollTrigger, ScrollToPlugin, SplitText)
- **Netlify CMS** - Content management
- **Netlify Identity** - User authentication
- **Netlify Forms** - Form submissions

## 🔗 Links

- [CMS User Guide](docs/CMS-GUIDE.md)
- [Netlify Setup Guide](docs/NETLIFY_SETUP_GUIDE.md)
- [Live Site](https://blprojects.netlify.app)
- [GitHub Repo](https://github.com/lelapinsauvage/BLS)

---

Built with ❤️ by Karim Saab
