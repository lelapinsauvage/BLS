# BLS Website - Handoff Documentation

## Project Overview
Custom-coded website for **Buterin L'Estrange** - a Sydney-based construction company. Built from Figma designs, will eventually be transferred to Webflow.

**Client:** Award-winning designer creating site for their client
**Design Base:** 1920x1080 Figma artboard
**Approach:** Custom HTML/CSS/JS with GSAP animations, then embed in Webflow

---

## File Structure
```
BLS/
├── index.html          # Main homepage
├── css/
│   ├── reset.css       # CSS reset
│   └── styles.css      # All styles (vw-based fluid sizing)
├── js/
│   └── main.js         # GSAP animations
└── images/
    ├── hero-bg.png
    ├── category-residential.png
    ├── category-hospitality.png
    ├── category-commercial.png
    ├── separator-1.png
    ├── separator-2.png
    ├── founders.png
    └── project-*.png (5 project images)
```

---

## Sections Built (Homepage)

### 1. Navbar
- Logo (SVG), nav links, WhatsApp CTA button
- Animated line draws on load
- `.navbar__line` element for the animated border

### 2. Hero Section
- Background image with 60% dark overlay
- **Masked reveal animation** on title (3 lines with overflow:hidden wrappers)
- Title lines: "Sydney's design-led", "construction partner", "for 25+ years"
- Scroll CTA with **Mac dock-style bounce** (repeats every 5s)

### 3. Numbers Section
- Stats: 12 (Years), 100+ (Projects), 31 (Awards)
- **Counter animation** on scroll - counts up from 0
- Triggers at 75% viewport

### 4. Categories Section
- 3 categories: Residential, Hospitality, Commercial
- **Interactive hover:**
  - Hovered item expands (flex: 1.1), others shrink (flex: 0.95)
  - Overlay: default 35%, hovered 30%, non-hovered 60%
  - Title moves up (-8px)
  - Line draws under title
  - Description fades in
- Images use `background-size: cover` - ALWAYS keep at 100%

### 5. Projects Section
- Header: "Selected" (left) + intro text (center) + "Projects" (right)
- 5 project items with images
- "All Projects" CTA button
- **Note:** Will connect to Webflow CMS later

### 6. Image Separators (x2)
- Full viewport height (100vh)
- `object-fit: cover`

### 7. Founders Section
- Large image left, content right
- Eyebrow, title, separator line, paragraphs

### 8. Footer
- 897px height at 1920
- Contact form (Full Name, Email, Topic, Phone, Message)
- Company address, social links, nav links
- Copyright bar at bottom

---

## Animation System

### Hero Load Animation (main.js)
```
Timeline sequence:
1. Logo fade (0.5s)
2. Navbar line draws (0.6s)
3. Nav menu fades (0.4s)
4. Eyebrow fades (0.6s)
5. Title lines reveal (1.1s each, 0.2s stagger) - MASKED REVEAL
6. Description fades (0.6s)
7. Scroll CTA fades (0.5s)

Easing: power4.out for titles, power2.out for others
```

### Scroll Animations Implemented
- **Numbers counter:** Counts up from 0 when section enters viewport

### Scroll Animations NOT YET DONE
- Projects section reveal
- Founders section reveal  
- Footer reveal
- Parallax on image separators

---

## CSS Architecture

### Fluid Sizing System
All sizes calculated from 1920px Figma:
```css
/* Formula: (figma_px / 1920) * 100 = vw */
--text-hero: clamp(1.75rem, 3.958vw, 4.75rem);  /* 76px */
--text-body-lg: clamp(0.875rem, 1.042vw, 1.25rem); /* 20px */
```

### Key CSS Variables
```css
--color-accent: #FF6A47;      /* Orange */
--color-white: #FFFFFF;
--color-border: #AAAAAA;
--font-display: 'Neue Haas Grotesk Display Pro', 'Helvetica Neue', sans-serif;
--font-accent: 'Francois One', sans-serif;
```

### Fonts
- **Neue Haas Grotesk Display Pro** - Premium font (needs license/self-host)
- **Francois One** - Google Fonts (loaded)

---

## Design Decisions Made

1. **Animations should be FAST and SMOOTH** - user emphasized this multiple times
2. **Title uses masked reveal** (overflow:hidden technique) - premium feel
3. **Categories hover:** Subtle width change (10%), keep 30% overlay on hovered for text visibility
4. **No letter-spacing animations** - user didn't like it
5. **Images always cover** - never shrink or change size
6. **Counter animation** for numbers - counts up smoothly

---

## Known Issues / Notes

1. **Font:** Neue Haas Grotesk Display Pro needs to be licensed/self-hosted. Currently falling back to Helvetica Neue.

2. **Local Server:** Run with `python3 -m http.server 8080` for GSAP CDN to work (won't work via file://)

3. **Footer:** Height is 897px at 1920 viewport (not 100vh)

4. **Mobile:** Basic responsive styles exist but need refinement

---

## What's Left to Do

### Animations
- [ ] Projects section scroll reveal
- [ ] Founders section scroll reveal
- [ ] Footer scroll reveal
- [ ] Image separator parallax (optional)

### Other Pages
- [ ] Projects page
- [ ] About page
- [ ] Services page
- [ ] Contact page

### Before Webflow Transfer
- [ ] Test all animations
- [ ] Optimize images
- [ ] Add proper font files
- [ ] Mobile responsive refinement

---

## GSAP Plugins Used
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
```

---

## User Preferences (Important!)
- Award-winning designer - has high standards
- Prefers **fast, smooth** animations
- Doesn't like "cheap" or "silly" effects
- Wants premium, cinematic feel
- Will provide Figma code for each section - convert to clean semantic HTML
- Test in browser frequently

