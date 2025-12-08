# BLS Webflow Export - Homepage

## 📋 Quick Reference

| Location | What to paste |
|----------|---------------|
| **Project Settings → Custom Code → HEAD** | Section 1: Global CSS |
| **Project Settings → Custom Code → FOOTER** | Section 2: Global JS (Libraries + Transitions) |
| **Homepage → Page Settings → Custom Code → Before </body>** | Section 3: Homepage JS |

---

## 🔴 SECTION 1: Global CSS (HEAD)

Copy everything below and paste into **Project Settings → Custom Code → Head**:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Francois+One&display=swap" rel="stylesheet">

<style>
/* ========================================
   CSS RESET
   ======================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100vh;
  line-height: 1.5;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

ul, ol {
  list-style: none;
}


/* ========================================
   CSS VARIABLES
   ======================================== */
:root {
  /* Colors */
  --color-white: #FFFFFF;
  --color-off-white: #E3E3E3;
  --color-black: #000000;
  --color-overlay: rgba(0, 0, 0, 0.60);
  --color-accent: #FF6A47;
  --color-border: #AAAAAA;
  --color-gray: #999999;
  
  /* Typography - Font Families */
  --font-display: 'Neue Haas Grotesk Display Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-accent: 'Francois One', sans-serif;
  
  /* Typography - Sizes */
  --text-hero: clamp(1.75rem, 3.958vw, 4.75rem);
  --text-eyebrow: clamp(0.75rem, 1.042vw, 1.25rem);
  --text-body-lg: clamp(0.875rem, 1.042vw, 1.25rem);
  --text-cta: clamp(0.75rem, 0.9375vw, 1.125rem);
  --text-nav: clamp(0.75rem, 0.9375vw, 1.125rem);
  
  /* Letter Spacing */
  --tracking-eyebrow: -0.06em;
  --tracking-links: -0.02em;
  
  /* Line Heights */
  --leading-eyebrow: 1.24;
  --leading-hero: 0.9;
  --leading-body: 1.59;
  --leading-cta: 1;
  
  /* Spacing */
  --space-hero-gap: clamp(1.5rem, 1.927vw, 2.3125rem);
  --space-section-padding: clamp(2rem, 3.49vw, 4.1875rem);
  
  /* Max widths */
  --max-hero-content: clamp(320px, 51.56vw, 990px);
  --max-hero-description: clamp(280px, 32.55vw, 625px);
  
  /* Navbar */
  --navbar-padding-x: clamp(1.25rem, 2.083vw, 2.5rem);
  --navbar-padding-y: clamp(1rem, 1.354vw, 1.625rem);
  --nav-gap: clamp(1.25rem, 2.083vw, 2.5rem);
}


/* ========================================
   LOADER
   ======================================== */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.loader__logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 0;
}

.loader__logo svg {
  width: clamp(200px, 15vw, 280px);
  height: auto;
}

.loader__panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #111111;
}

.loader__panel--top {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.loader__panel--bottom {
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

body.is-loading {
  overflow: hidden;
}


/* ========================================
   INITIAL STATES (for GSAP animation)
   ======================================== */
/* 
NOTE: Initial opacity states are set via JavaScript in the page-specific code
This ensures content is visible while building in Webflow
*/

.reveal {
  overflow: hidden;
  display: block;
}

.reveal__inner {
  display: block;
}


/* ========================================
   NAVBAR
   ======================================== */
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--navbar-padding-y) var(--navbar-padding-x);
}

.navbar__line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  transform-origin: left center;
}

.navbar__logo {
  display: block;
  width: clamp(180px, 14.3vw, 275px);
  height: auto;
  flex-shrink: 0;
}

.navbar__logo svg,
.navbar__logo img {
  width: 100%;
  height: auto;
}

.navbar__menu {
  display: flex;
  align-items: center;
  gap: var(--nav-gap);
}

.navbar__link {
  position: relative;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: var(--text-nav);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-links);
  line-height: 1;
}

.navbar__link-text {
  display: block;
  color: var(--color-white);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.2;
}

.navbar__link-text--hover {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-accent);
  transform: translateY(100%);
}

.navbar__link:not(.navbar__link--active):hover .navbar__link-text {
  transform: translateY(-100%);
}

.navbar__link:not(.navbar__link--active):hover .navbar__link-text--hover {
  transform: translateY(0);
}

.navbar__link--active .navbar__link-text {
  color: var(--color-accent);
}

.navbar__link--active {
  pointer-events: none;
}

.navbar__link-dot {
  display: inline;
  margin-right: 0.15em;
}

/* Navbar CTA Button */
.navbar__cta {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #111111;
  border-radius: 40px;
}

.navbar__cta-text {
  position: relative;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: var(--text-nav);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
}

.navbar__cta-text div {
  display: block;
  color: #EEEEEE;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.2;
}

.navbar__cta-text div:last-child {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-accent);
  transform: translateY(100%);
}

.navbar__cta:hover .navbar__cta-text div:first-child {
  transform: translateY(-100%);
}

.navbar__cta:hover .navbar__cta-text div:last-child {
  transform: translateY(0);
}

.navbar__cta-icons {
  position: relative;
  width: 30px;
  height: 30px;
  overflow: hidden;
}

.navbar__whatsapp-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar__cta:hover .navbar__whatsapp-icon {
  transform: translateX(40px);
}

.navbar__cta-arrow {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  height: auto;
  transform: translate(-30px, -50%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--color-accent);
}

.navbar__cta:hover .navbar__cta-arrow {
  transform: translate(5px, -50%);
}


/* ========================================
   HERO SECTION
   ======================================== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-section-padding) 1.5rem;
  overflow: hidden;
  background: var(--color-black);
}

.hero__video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  z-index: 0;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  z-index: 1;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-hero-gap);
  max-width: var(--max-hero-content);
  text-align: center;
}

.hero__eyebrow {
  color: var(--color-off-white);
  font-family: var(--font-accent);
  font-size: var(--text-eyebrow);
  font-weight: 400;
  text-transform: uppercase;
  line-height: var(--leading-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
}

.hero__title {
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 600;
  text-transform: uppercase;
  line-height: var(--leading-hero);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__title .reveal {
  display: block;
}

.hero__title-line {
  display: block;
}

.hero__description {
  max-width: var(--max-hero-description);
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-body);
}

.hero__scroll-wrapper {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.hero__scroll-cta {
  display: block;
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 600;
  text-transform: uppercase;
  line-height: var(--leading-cta);
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.hero__scroll-cta:hover {
  opacity: 0.7;
}


/* ========================================
   NUMBERS SECTION
   ======================================== */
.numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(3rem, 20.83vw, 25rem);
  min-height: clamp(350px, 31vw, 600px);
  padding: clamp(3rem, 5vw, 6rem) var(--navbar-padding-x);
  background: var(--color-white);
}

.numbers__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.375rem, 0.52vw, 0.625rem);
  padding: clamp(0.375rem, 0.52vw, 0.625rem);
}

.numbers__value {
  color: #1A1A1A;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.76vw, 6.9rem);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.16;
}

.numbers__label {
  color: #111111;
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-body);
}


/* ========================================
   CATEGORIES SECTION
   ======================================== */
.categories {
  display: flex;
  width: 100%;
}

.categories__item {
  flex: 1;
  min-height: clamp(500px, 54.06vw, 1038px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(0.5rem, 0.73vw, 0.875rem);
  padding: 2rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.categories:hover .categories__item:not(:hover) {
  filter: grayscale(100%);
}

.categories__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  transition: background 0.4s ease-out;
}

.categories:hover .categories__item:not(:hover)::before {
  background: rgba(0, 0, 0, 0.6);
}

.categories:hover .categories__item:hover::before {
  background: rgba(0, 0, 0, 0.3);
}

.categories__title {
  position: relative;
  z-index: 1;
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
}

.categories__title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 0;
  height: 1px;
  background: var(--color-white);
  transform: translateX(-50%);
  transition: width 0.35s ease-out;
}

.categories__item:hover .categories__title::after {
  width: 100%;
}

.categories__description {
  position: relative;
  z-index: 1;
  max-width: clamp(220px, 16vw, 300px);
  text-align: center;
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 500;
  line-height: 1.59;
}


/* ========================================
   PROJECTS SECTION
   ======================================== */
.projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 1.875vw, 2.25rem);
  padding: clamp(4rem, 10.2vw, 12.25rem) var(--navbar-padding-x);
  background: var(--color-white);
  overflow: hidden;
}

.projects__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.projects__title-left,
.projects__title-right {
  color: #1A1A1A;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.76vw, 6.9rem);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.16;
}

.projects__intro {
  max-width: clamp(300px, 30.1vw, 578px);
  text-align: center;
  color: #1A1A1A;
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-body);
}

.projects__list {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.projects__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: clamp(1rem, 1.04vw, 1.25rem) 0;
  border-top: 1px solid #BEBEBE;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s ease;
}

.projects__item:last-child {
  border-bottom: 1px solid #BEBEBE;
}

.projects__item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.projects__item-info {
  display: flex;
  align-items: flex-end;
  gap: clamp(1.5rem, 2.656vw, 3.1875rem);
}

.projects__item-meta {
  display: flex;
  flex-direction: column;
  min-width: clamp(80px, 5.36vw, 103px);
}

.projects__item-year {
  color: #999999;
  font-family: var(--font-accent);
  font-size: var(--text-body-lg);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1.24;
}

.projects__item-type {
  color: #111111;
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-body);
}

.projects__item-title-wrap {
  position: relative;
  overflow: hidden;
  height: clamp(1.5rem, 3.02vw, 3.625rem);
}

.projects__item-title {
  color: #1A1A1A;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.02vw, 3.625rem);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
}

.projects__item-title--hover {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-accent);
}

.projects__item-visual {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 1.5vw, 2rem);
  position: relative;
}

.projects__item-image-wrap {
  position: relative;
  display: inline-block;
}

.projects__item-image-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.projects__list:hover .projects__item:not(:hover) .projects__item-image-wrap::after {
  background: rgba(0, 0, 0, 0.5);
}

.projects__item-image {
  width: clamp(200px, 18.125vw, 348px);
  height: auto;
  object-fit: cover;
  display: block;
  transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  filter: grayscale(0%);
}

.projects__list:hover .projects__item:not(:hover) .projects__item-image {
  filter: grayscale(100%);
}

.projects__item-arrow {
  color: var(--color-accent);
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  font-weight: 300;
}


/* ========================================
   BUTTON COMPONENT
   ======================================== */
.btn-wipe {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  background: var(--color-black);
  border: none;
  border-radius: 2.5rem;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
}

.btn-wipe--light {
  background: var(--color-white);
}

.btn-wipe::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  border-radius: 2.5rem;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-wipe:hover::before {
  transform: scaleX(1);
}

.btn-wipe div,
.btn-wipe span {
  position: relative;
  z-index: 1;
  color: var(--color-white);
  transition: color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-wipe--light div,
.btn-wipe--light span {
  color: #111111;
}

.btn-wipe:hover div,
.btn-wipe:hover span {
  color: #FFFFFF;
}

.btn-wipe svg {
  position: relative;
  z-index: 1;
  width: 1.5rem;
  height: auto;
  color: var(--color-white);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-wipe--light svg {
  color: #111111;
}

.btn-wipe:hover svg {
  transform: translateX(4px);
  color: #FFFFFF;
}

.projects__cta {
  min-width: clamp(200px, 13.125vw, 252px);
  height: clamp(50px, 3.49vw, 67px);
}


/* ========================================
   IMAGE SEPARATOR
   ======================================== */
.image-separator {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.image-separator__img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  will-change: transform;
}


/* ========================================
   FOUNDERS SECTION
   ======================================== */
.founders {
  display: flex;
  align-items: flex-start;
  gap: clamp(2rem, 3.594vw, 4.3125rem);
  padding: clamp(4rem, 10.3125vw, 12.375rem) var(--navbar-padding-x);
  background: var(--color-white);
  overflow: hidden;
}

.founders__image-wrap {
  position: relative;
  width: clamp(300px, 47.86vw, 919px);
  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
}

.founders__image--back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.founders__image-wrap:hover .founders__image--back {
  transform: scale(1.05);
  transition: transform 1s ease;
}

.founders__image-reveal {
  position: relative;
  width: 100%;
  display: block;
}

.founders__image-reveal::before,
.founders__image-reveal::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--img);
  background-size: cover;
  background-position: center;
  filter: grayscale(0%) brightness(1);
  transition: transform 0.5s ease, filter 0.3s ease 0.4s;
}

.founders__image-reveal::before {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  transform-origin: top right;
}

.founders__image-reveal::after {
  clip-path: polygon(0 0, 100% 100%, 0 100%);
  transform-origin: bottom left;
}

.founders__image-wrap:hover .founders__image-reveal::before {
  transform: translate(100%, -100%);
  filter: grayscale(100%) brightness(0.5);
  transition: transform 1s ease, filter 0.2s ease;
}

.founders__image-wrap:hover .founders__image-reveal::after {
  transform: translate(-100%, 100%);
  filter: grayscale(100%) brightness(0.5);
  transition: transform 1s ease, filter 0.2s ease;
}

.founders__image {
  width: 100%;
  height: auto;
  display: block;
  visibility: hidden;
}

.founders__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.25rem, 1.77vw, 2.125rem);
  max-width: clamp(400px, 39.375vw, 756px);
  padding: clamp(2rem, 7.29vw, 8.75rem) 0;
}

.founders__eyebrow {
  color: var(--color-gray);
  font-family: var(--font-accent);
  font-size: var(--text-eyebrow);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  line-height: var(--leading-eyebrow);
}

.founders__title {
  color: #1A1A1A;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.02vw, 3.625rem);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 0.9;
}

.founders__separator {
  width: 100%;
  height: 1px;
  background: #BEBEBE;
}

.founders__text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: clamp(350px, 36.4vw, 699px);
}

.founders__text p {
  color: #111111;
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  line-height: var(--leading-body);
}


/* ========================================
   FOOTER
   ======================================== */
.footer {
  background: #111111;
  min-height: clamp(600px, 46.72vw, 897px);
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.footer__inner {
  width: calc(100% - clamp(40px, 4.17vw, 80px));
  max-width: 1842px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: clamp(60px, 5vw, 100px);
  padding-bottom: 0;
}

.footer__upper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.footer__heading {
  display: flex;
  flex-direction: column;
  width: clamp(400px, 42.6vw, 818px);
}

.footer__heading-line1,
.footer__heading-text,
.footer__heading-accent {
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.958vw, 4.75rem);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 0.94;
  letter-spacing: -0.04em;
}

.footer__heading-line1 {
  white-space: nowrap;
}

.footer__heading-line2 {
  display: flex;
  align-items: center;
  gap: clamp(15px, 1.56vw, 30px);
}

.footer__heading-separator {
  width: clamp(100px, 11.25vw, 216px);
  height: 1px;
  background: #999999;
}

.footer__heading-accent {
  color: var(--color-accent);
}

.footer__form {
  width: clamp(450px, 47.45vw, 911px);
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 1.67vw, 2rem);
}

.footer__form-row {
  display: flex;
  justify-content: space-between;
  gap: clamp(1rem, 1.09vw, 1.3rem);
}

.footer__form-field {
  width: clamp(220px, 23.18vw, 445px);
}

.footer__form-field--full {
  width: 100%;
}

.footer__form-field input,
.footer__form-field textarea {
  width: 100%;
  height: clamp(50px, 3.8vw, 73px);
  padding: 1.25rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid #F5F5F5;
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: var(--text-body-lg);
  font-weight: 500;
  outline: none;
  transition: border-color 0.3s ease;
}

.footer__form-field input::placeholder,
.footer__form-field textarea::placeholder {
  color: #F5F5F5;
}

.footer__form-field input:focus,
.footer__form-field textarea:focus {
  border-color: var(--color-accent);
}

.footer__form-field textarea {
  height: clamp(90px, 7.19vw, 138px);
  resize: none;
}

.footer__submit {
  width: clamp(180px, 11.875vw, 228px);
  height: clamp(50px, 3.49vw, 67px);
}

.footer__submit svg {
  width: 1.25rem;
}

.footer__lower {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  margin-top: clamp(50px, 3.65vw, 70px);
}

.footer__middle {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer__address {
  display: flex;
  flex-direction: column;
}

.footer__address p {
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 500;
  line-height: 1.59;
}

.footer__middle-right {
  width: clamp(450px, 47.45vw, 911px);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer__contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.footer__contact-links a,
.footer__nav-link {
  position: relative;
  overflow: hidden;
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-links);
}

.footer__contact-links a .link-text,
.footer__nav-link .link-text {
  display: block;
  color: #F5F5F5;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.3;
}

.footer__contact-links a .link-text--hover,
.footer__nav-link .link-text--hover {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-accent);
  transform: translateY(100%);
}

.footer__contact-links a:hover .link-text,
.footer__nav-link:hover .link-text {
  transform: translateY(-100%);
}

.footer__contact-links a:hover .link-text--hover,
.footer__nav-link:hover .link-text--hover {
  transform: translateY(0);
}

.footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.footer__nav-link {
  text-align: right;
}

.footer__nav-link--active .link-text {
  color: var(--color-accent);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: clamp(1.5rem, 2vw, 2.5rem);
  padding-bottom: clamp(1.5rem, 2vw, 2.5rem);
  border-top: 1px solid #999999;
}

.footer__copyright {
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 500;
  line-height: 1.59;
}

.footer__legal {
  width: clamp(450px, 47.45vw, 911px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__legal a {
  position: relative;
  overflow: hidden;
  color: #F5F5F5;
  font-family: var(--font-display);
  font-size: var(--text-cta);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-links);
}

.footer__legal a .link-text {
  display: block;
  color: #F5F5F5;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.3;
}

.footer__legal a .link-text--hover {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-accent);
  transform: translateY(100%);
}

.footer__legal a:hover .link-text {
  transform: translateY(-100%);
}

.footer__legal a:hover .link-text--hover {
  transform: translateY(0);
}


/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 1024px) {
  .navbar__menu {
    gap: clamp(1rem, 2vw, 1.5rem);
  }
}

@media (max-width: 768px) {
  .hero {
    padding-bottom: 5rem;
  }
  
  .navbar__link:not(.navbar__link--active) {
    display: none;
  }
  
  .navbar__link--active {
    display: none;
  }
  
  .navbar__cta div {
    display: none;
  }
  
  .navbar__cta {
    padding: 8px;
    border-radius: 50%;
  }
  
  .numbers {
    flex-direction: column;
    gap: 2rem;
    padding: 3rem 1.5rem;
  }
  
  .categories {
    flex-direction: column;
  }
  
  .categories__item {
    min-height: 400px;
    flex: 1 !important;
  }
  
  .categories__item::before {
    background: rgba(0, 0, 0, 0.40) !important;
  }
  
  .projects__header {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .projects__title-left,
  .projects__title-right {
    text-align: center;
  }
  
  .projects__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem 0;
  }
  
  .projects__item-image {
    width: 100%;
    max-width: 100%;
  }
  
  .projects__item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .founders {
    flex-direction: column;
    padding: 4rem 1.5rem;
  }
  
  .founders__image-wrap {
    width: 100%;
    max-width: 100%;
  }
  
  .founders__content {
    padding: 0;
    max-width: 100%;
  }
  
  .founders__text {
    max-width: 100%;
  }
  
  .footer {
    height: auto;
    padding: 3rem 1.5rem;
  }
  
  .footer__inner {
    width: 100%;
  }
  
  .footer__upper {
    flex-direction: column;
    gap: 3rem;
  }
  
  .footer__heading {
    width: 100%;
  }
  
  .footer__heading-line2 {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .footer__heading-separator {
    width: 60px;
  }
  
  .footer__form {
    width: 100%;
  }
  
  .footer__form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .footer__form-field {
    width: 100%;
  }
  
  .footer__middle {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
  
  .footer__middle-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .footer__nav {
    align-items: flex-start;
  }
  
  .footer__bottom {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .footer__legal {
    width: 100%;
    justify-content: flex-start;
    gap: 2rem;
  }
}
</style>
```

---

## 🟢 SECTION 2: Global JS - Libraries + Transitions (FOOTER)

Copy everything below and paste into **Project Settings → Custom Code → Footer**:

```html
<!-- External Libraries -->
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>

<script>
/* ========================================
   PAGE TRANSITIONS & LOADER
   Shared across all pages
   ======================================== */

// Global reference to Lenis
let lenisInstance = null;

function setLenis(lenis) {
  lenisInstance = lenis;
}

// ========================================
// LOADER ANIMATION
// ========================================

function initLoader(onComplete) {
  const loader = document.querySelector('.loader');
  const logo = document.querySelector('.loader__logo');
  const panelTop = document.querySelector('.loader__panel--top');
  const panelBottom = document.querySelector('.loader__panel--bottom');
  
  if (!loader) {
    if (onComplete) onComplete();
    return;
  }
  
  // Lock scroll
  document.body.classList.add('is-loading');
  if (lenisInstance) lenisInstance.stop();
  
  // Check if coming from another page
  const fromTransition = sessionStorage.getItem('pageTransition') === 'true';
  sessionStorage.removeItem('pageTransition');
  
  if (fromTransition) {
    gsap.set(panelTop, { yPercent: 0, xPercent: 0 });
    gsap.set(panelBottom, { yPercent: 0, xPercent: 0 });
    gsap.set(logo, { opacity: 0 });
  }
  
  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('is-loading');
      loader.style.display = 'none';
      if (lenisInstance) lenisInstance.start();
    }
  });
  
  tl.to(logo, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to({}, { duration: 0.4 })
  .to(logo, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  })
  .to(panelTop, {
    yPercent: -100,
    xPercent: 100,
    duration: 1,
    ease: 'power2.inOut'
  })
  .to(panelBottom, {
    yPercent: 100,
    xPercent: -100,
    duration: 1,
    ease: 'power2.inOut'
  }, '<')
  .call(() => {
    if (onComplete) onComplete();
  }, null, '-=0.25');
}

// ========================================
// PAGE TRANSITIONS
// ========================================

function initPageTransitions() {
  const transitionLinks = document.querySelectorAll('a[data-transition]');
  const panelTop = document.querySelector('.loader__panel--top');
  const panelBottom = document.querySelector('.loader__panel--bottom');
  const loader = document.querySelector('.loader');
  
  if (!loader) return;
  
  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      if (lenisInstance) lenisInstance.stop();
      
      loader.style.display = 'flex';
      loader.style.pointerEvents = 'auto';
      
      gsap.set(panelTop, { 
        yPercent: -100, 
        xPercent: 100,
        clearProps: 'none'
      });
      gsap.set(panelBottom, { 
        yPercent: 100, 
        xPercent: -100,
        clearProps: 'none'
      });
      
      loader.offsetHeight;
      
      gsap.to(panelTop, {
        yPercent: 0,
        xPercent: 0,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      gsap.to(panelBottom, {
        yPercent: 0,
        xPercent: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          sessionStorage.setItem('pageTransition', 'true');
          window.location.href = href;
        }
      });
    });
  });
}
</script>
```

---

## 🔵 SECTION 3: Homepage JS (Page-specific)

Copy everything below and paste into **Homepage → Page Settings → Custom Code → Before </body> tag**:

```html
<script>
/* ========================================
   BUTERIN L'ESTRANGE - Home Page
   ======================================== */

console.log('🚀 BLS Home loaded');

// ========================================
// LENIS SMOOTH SCROLL
// ========================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Share lenis with global transitions
setLenis(lenis);

// ========================================
// INITIALIZE
// ========================================

if (typeof gsap === 'undefined') {
  console.error('❌ GSAP not loaded!');
} else {
  console.log('✅ GSAP loaded');
  
  gsap.registerPlugin(ScrollTrigger);
  
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  
  // Set initial states for animation
  gsap.set('.navbar__logo', { opacity: 0 });
  gsap.set('.navbar__menu', { opacity: 0 });
  gsap.set('.navbar__line', { scaleX: 0 });
  gsap.set('.hero__eyebrow', { opacity: 0 });
  gsap.set('.hero__title .reveal', { opacity: 0 });
  gsap.set('.hero__title .reveal .reveal__inner', { y: '120%' });
  gsap.set('.hero__description', { opacity: 0 });
  gsap.set('.hero__scroll-wrapper', { opacity: 0 });
  
  // Initialize
  initLoader(initHeroAnimation);
  initPageTransitions();
  initNumbersAnimation();
  initCategoriesHover();
  initProjectsHover();
  initImageParallax();
}

// ========================================
// HERO ANIMATION
// ========================================

function initHeroAnimation() {
  console.log('🎬 Starting hero animation...');
  
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.play().catch(err => console.log('Video autoplay prevented:', err));
  }
  
  const master = gsap.timeline({
    onComplete: startScrollCtaBounce
  });

  master
    .to('.navbar__logo', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
    .to('.navbar__line', { scaleX: 1, duration: 0.45, ease: 'power2.out' }, 0.1)
    .to('.navbar__menu', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.15)
    .to('.hero__eyebrow', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.2)
    .to('.hero__title .reveal:nth-child(1) .reveal__inner', { y: '0%', duration: 0.75, ease: 'power4.out' }, 0.25)
    .to('.hero__title .reveal:nth-child(1)', { opacity: 1, duration: 0.01 }, '<')
    .to('.hero__title .reveal:nth-child(2) .reveal__inner', { y: '0%', duration: 0.75, ease: 'power4.out' }, 0.4)
    .to('.hero__title .reveal:nth-child(2)', { opacity: 1, duration: 0.01 }, '<')
    .to('.hero__title .reveal:nth-child(3) .reveal__inner', { y: '0%', duration: 0.75, ease: 'power4.out' }, 0.55)
    .to('.hero__title .reveal:nth-child(3)', { opacity: 1, duration: 0.01 }, '<')
    .to('.hero__description', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.7)
    .to('.hero__scroll-wrapper', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.8);
}

// ========================================
// SCROLL CTA BOUNCE
// ========================================

function startScrollCtaBounce() {
  gsap.delayedCall(4, bounceScrollCta);
}

function bounceScrollCta() {
  const tl = gsap.timeline({
    onComplete: () => gsap.delayedCall(5, bounceScrollCta)
  });
  
  tl.to('.hero__scroll-wrapper', { y: -10, duration: 0.12, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.12, ease: 'power2.in' })
    .to('.hero__scroll-wrapper', { y: -5, duration: 0.1, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.1, ease: 'power2.in' })
    .to('.hero__scroll-wrapper', { y: -2, duration: 0.08, ease: 'power2.out' })
    .to('.hero__scroll-wrapper', { y: 0, duration: 0.08, ease: 'power2.in' });
}

// ========================================
// NUMBERS ANIMATION
// ========================================

function initNumbersAnimation() {
  gsap.set('.numbers__value', { opacity: 0 });
  gsap.set('.numbers__label', { opacity: 0 });
  
  const numberItems = document.querySelectorAll('.numbers__value');
  
  ScrollTrigger.create({
    trigger: '.numbers',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      numberItems.forEach((item, index) => {
        const finalValue = item.textContent;
        const hasPlus = finalValue.includes('+');
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        gsap.to(item, {
          opacity: 1,
          duration: 0.4,
          delay: index * 0.15,
          ease: 'power2.out'
        });
        
        let obj = { value: 0 };
        gsap.to(obj, {
          value: numericValue,
          duration: 2.5,
          delay: index * 0.15,
          ease: 'power3.out',
          onUpdate: () => {
            item.textContent = Math.round(obj.value) + (hasPlus ? '+' : '');
          }
        });
      });
      
      gsap.to('.numbers__label', {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.3
      });
    }
  });
}

// ========================================
// CATEGORIES HOVER
// ========================================

function initCategoriesHover() {
  const categories = document.querySelector('.categories');
  const items = document.querySelectorAll('.categories__item');
  const titles = document.querySelectorAll('.categories__title');
  const descriptions = document.querySelectorAll('.categories__description');
  
  if (!categories || items.length === 0) return;
  
  gsap.set(descriptions, { opacity: 0, y: 10 });
  
  items.forEach((item, index) => {
    const title = item.querySelector('.categories__title');
    const description = item.querySelector('.categories__description');
    const otherItems = [...items].filter((_, i) => i !== index);
    
    item.addEventListener('mouseenter', () => {
      gsap.to(item, { flex: 1.1, duration: 0.4, ease: 'power2.out' });
      gsap.to(otherItems, { flex: 0.95, duration: 0.4, ease: 'power2.out' });
      gsap.to(title, { y: -8, duration: 0.35, ease: 'power2.out' });
      gsap.to(description, { opacity: 1, y: 0, duration: 0.35, delay: 0.08, ease: 'power2.out' });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(title, { y: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(description, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out' });
    });
  });
  
  categories.addEventListener('mouseleave', () => {
    gsap.to(items, { flex: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(titles, { y: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(descriptions, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out' });
  });
}

// ========================================
// PROJECTS HOVER
// ========================================

function initProjectsHover() {
  const items = document.querySelectorAll('.projects__item');
  
  if (items.length === 0) return;
  
  items.forEach(item => {
    const titleDefault = item.querySelector('.projects__item-title:not(.projects__item-title--hover)');
    const titleHover = item.querySelector('.projects__item-title--hover');
    const imageWrap = item.querySelector('.projects__item-image-wrap');
    const arrow = item.querySelector('.projects__item-arrow');
    
    gsap.set(titleHover, { y: '100%' });
    gsap.set(arrow, { opacity: 0, x: -20 });
    
    item.addEventListener('mouseenter', () => {
      gsap.to(titleDefault, { y: '-100%', duration: 0.35, ease: 'power2.out' });
      gsap.to(titleHover, { y: '0%', duration: 0.35, ease: 'power2.out' });
      gsap.to(imageWrap, { x: -20, duration: 0.35, ease: 'power2.out' });
      gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(titleDefault, { y: '0%', duration: 0.35, ease: 'power2.out' });
      gsap.to(titleHover, { y: '100%', duration: 0.35, ease: 'power2.out' });
      gsap.to(imageWrap, { x: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(arrow, { opacity: 0, x: -20, duration: 0.25, ease: 'power2.out' });
    });
  });
}

// ========================================
// IMAGE PARALLAX
// ========================================

function initImageParallax() {
  const separators = document.querySelectorAll('.image-separator');
  
  if (separators.length === 0) return;
  
  separators.forEach(separator => {
    const img = separator.querySelector('.image-separator__img');
    
    if (!img) return;
    
    gsap.fromTo(img, 
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: separator,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// ========================================
// SMOOTH SCROLL ANCHORS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target);
      }
    });
  });
});
</script>
```

---

## 📝 WEBFLOW STRUCTURE GUIDE

### Understanding Webflow Elements

**In Webflow, use these element types:**
- **Div Block** = Container only (no text directly inside)
- **Text Block** = For any text content
- **Heading** = For h1, h2, h3, etc. (text only, no nested elements)
- **Link Block** = For clickable containers
- **Button** = For form buttons

### Loader Structure
```
Div Block (class: loader)
  └── Div Block (class: loader__logo)
      └── [Paste SVG code here as HTML Embed]
  └── Div Block (class: loader__panel loader__panel--top)
  └── Div Block (class: loader__panel loader__panel--bottom)
```

### Navbar Structure
```
Div Block (class: navbar)
  └── Div Block (class: navbar__line)
  └── Link Block (class: navbar__logo) → href="/"
      └── [SVG as HTML Embed]
  └── Div Block (class: navbar__menu)
      └── Link Block (class: navbar__link navbar__link--active)
          └── Div Block (class: navbar__link-text)
              └── Text Block → "• Home"
          └── Div Block (class: navbar__link-text navbar__link-text--hover)
              └── Text Block → "• Home"
      └── Link Block (class: navbar__link) → href="/projects"
          └── Div Block (class: navbar__link-text)
              └── Text Block → "Projects"
          └── Div Block (class: navbar__link-text navbar__link-text--hover)
              └── Text Block → "Projects"
      └── Link Block (class: navbar__cta) → href="tel:+61422523677"
          └── Div Block (class: navbar__cta-icons)
              └── Image (class: navbar__whatsapp-icon)
              └── [SVG arrow as HTML Embed with class: navbar__cta-arrow]
          └── Div Block (class: navbar__cta-text)
              └── Text Block → "+61 422 523 677"
              └── Text Block → "+61 422 523 677"
```

### Hero Section Structure
```
Section (class: hero)
  └── Video (class: hero__video) → Add your video source
  └── Div Block (class: hero__content)
      └── Text Block (class: hero__eyebrow) → "( Buterin L'estrange )"
      └── Div Block (class: hero__title)
          └── Div Block (class: reveal)
              └── Text Block (class: "hero__title-line reveal__inner") → "Sydney's design-led"
          └── Div Block (class: reveal)
              └── Text Block (class: "hero__title-line reveal__inner") → "construction partner"
          └── Div Block (class: reveal)
              └── Text Block (class: "hero__title-line reveal__inner") → "for 25+ years"
      └── Text Block (class: hero__description) → [Your description text]
  └── Div Block (class: hero__scroll-wrapper)
      └── Link Block (class: hero__scroll-cta) → href="#projects"
          └── Text inside link → "Scroll to discover"
```

**IMPORTANT:** For the hero title, use `Div Block` with class "hero__title" instead of `Heading`, then add Text Blocks inside for the actual text. This allows the reveal animation wrappers.

### Numbers Section Structure
```
Section (class: numbers)
  └── Div Block (class: numbers__item)
      └── Text Block (class: numbers__value) → "12"
      └── Text Block (class: numbers__label) → "Years of Experience"
  └── Div Block (class: numbers__item)
      └── Text Block (class: numbers__value) → "100+"
      └── Text Block (class: numbers__label) → "Projects Completed"
  └── Div Block (class: numbers__item)
      └── Text Block (class: numbers__value) → "31"
      └── Text Block (class: numbers__label) → "Awards"
```

### Categories Section Structure
```
Section (class: categories)
  └── Link Block (class: categories__item) → Set background image in settings
      └── Text Block (class: categories__title) → "Residential"
      └── Text Block (class: categories__description) → "Luxury homes..."
  └── Link Block (class: categories__item) → Set background image
      └── Text Block (class: categories__title) → "Hospitality"
      └── Text Block (class: categories__description) → "Restaurants..."
  └── Link Block (class: categories__item) → Set background image
      └── Text Block (class: categories__title) → "Commercial"
      └── Text Block (class: categories__description) → "Office..."
```

### Projects Section Structure
```
Section (class: projects)
  └── Div Block (class: projects__header)
      └── Heading h2 (class: projects__title-left) → "Selected"
      └── Text Block (class: projects__intro) → [Your intro text]
      └── Heading h2 (class: projects__title-right) → "Projects"
  └── Div Block (class: projects__list)
      └── Link Block (class: projects__item)
          └── Div Block (class: projects__item-info)
              └── Div Block (class: projects__item-meta)
                  └── Text Block (class: projects__item-year) → "2025"
                  └── Text Block (class: projects__item-type) → "Commercial"
              └── Div Block (class: projects__item-title-wrap)
                  └── Heading h3 (class: projects__item-title) → "The Gantry"
                  └── Heading h3 (class: "projects__item-title projects__item-title--hover") → "The Gantry"
          └── Div Block (class: projects__item-visual)
              └── Div Block (class: projects__item-image-wrap)
                  └── Image (class: projects__item-image)
              └── Text Block (class: projects__item-arrow) → "→"
  └── Link Block (class: "btn-wipe projects__cta")
      └── Text Block → "All projects"
      └── [SVG arrow as HTML Embed]
```

### Founders Section Structure
```
Section (class: founders)
  └── Div Block (class: founders__image-wrap)
      └── Image (class: founders__image--back) → Back image
      └── Div Block (class: founders__image-reveal)
          └── Add custom attribute: style="--img: url('front-image.jpg')"
          └── Image (class: founders__image) → Front image
  └── Div Block (class: founders__content)
      └── Text Block (class: founders__eyebrow) → "( The Minds Behind the Craft )"
      └── Heading h2 (class: founders__title) → "Meet the founders"
      └── Div Block (class: founders__separator)
      └── Div Block (class: founders__text)
          └── Text Block → [Paragraph 1]
          └── Text Block → [Paragraph 2]
```

### Footer Structure
```
Footer (class: footer)
  └── Div Block (class: footer__inner)
      └── Div Block (class: footer__upper)
          └── Div Block (class: footer__heading)
              └── Text Block (class: footer__heading-line1) → "Let's Build Something"
              └── Div Block (class: footer__heading-line2)
                  └── Text Block (class: footer__heading-text) → "With"
                  └── Div Block (class: footer__heading-separator)
                  └── Text Block (class: footer__heading-accent) → "Integrity"
          └── Form Block (class: footer__form)
              └── [Form fields as shown in HTML]
              └── Button (class: "btn-wipe btn-wipe--light footer__submit")
                  └── Text inside button → "Submit"
                  └── [SVG as HTML Embed]
      └── Div Block (class: footer__lower)
          └── Div Block (class: footer__middle)
              └── Div Block (class: footer__address)
                  └── Text Block → "Buterin L'Estrange"
                  └── Text Block → "1800 BL PROJECTS"
                  └── [etc...]
              └── Div Block (class: footer__middle-right)
                  └── Div Block (class: footer__contact-links)
                      └── Link Block
                          └── Div Block (class: link-text)
                              └── Text Block → "admin@blprojects.com.au"
                          └── Div Block (class: "link-text link-text--hover")
                              └── Text Block → "admin@blprojects.com.au"
                  └── Div Block (class: footer__nav)
                      └── Link Block (class: footer__nav-link)
                          └── Div Block (class: link-text)
                              └── Text Block → "• Home"
                          └── Div Block (class: "link-text link-text--hover")
                              └── Text Block → "• Home"
          └── Div Block (class: footer__bottom)
              └── Text Block (class: footer__copyright) → "2025 © Buterin L'Estrange"
              └── Div Block (class: footer__legal)
                  └── [Links similar to footer nav above]
```

### Key Webflow Rules to Remember:
1. **Headings** = Text only, no nested elements
2. **Text Blocks** = For all visible text content
3. **Div Blocks** = Containers only (no direct text)
4. **Link Blocks** = For clickable containers
5. For SVGs, use **HTML Embed** elements
6. For custom attributes (like `data-transition`), use the Custom Attributes panel

### Page Transitions
Add `data-transition` custom attribute to Link Blocks:
- Select the Link Block
- Settings panel → Custom Attributes
- Name: `data-transition`
- Value: (leave empty or "true")

### CMS Integration
For projects from CMS:
- Create Collection List inside `.projects__list`
- Bind Collection to your Projects collection
- Map dynamic fields to text blocks inside Collection Item

