# Lenis Smooth Scroll Issue in Webflow

## 🔴 THE PROBLEM

When refreshing the page while scrolled down (not at the top), Lenis smooth scroll breaks and prevents scrolling to the full page height.

**Symptoms:**
- Scroll works fine when starting from top of page
- Refreshing mid-scroll causes Lenis to get stuck
- Can't scroll to bottom sections after mid-page refresh
- Native scroll position restoration conflicts with Lenis

---

## 📊 CURRENT STATE

### What Works:
- ✅ Loader animation
- ✅ Navbar scroll behavior and hover effects
- ✅ Mobile menu
- ✅ Hero video background
- ✅ Project title hover animations
- ✅ Scroll works when starting from top

### What Doesn't Work:
- ❌ Lenis breaks after mid-page refresh
- ❌ Scroll position restoration conflicts with Lenis initialization

---

## 🔍 ROOT CAUSE

**Webflow + Lenis + Browser Scroll Restoration = Conflict**

1. **Browser restores scroll position** on page refresh
2. **Lenis initializes** while page is already scrolled
3. **Lenis calculates wrong limit** based on mid-scroll state
4. **Result:** Scroll is broken until page is refreshed from top

---

## 🛠️ ATTEMPTED FIXES

### Fix 1: Disable Scroll Restoration ❌
```javascript
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
```
**Result:** Still breaks on mid-page refresh

### Fix 2: Aggressive Scroll Reset ❌
```javascript
(function() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
})();
```
**Result:** Still breaks (Lenis initializes before scroll resets)

### Fix 3: Force High Lenis Limit ❌
```javascript
setInterval(() => {
  if (lenisInstance) {
    lenisInstance.limit = 99999;
  }
}, 500);
```
**Result:** Limit gets overwritten by Lenis's internal calculations

---

## 🎯 RECOMMENDED SOLUTIONS

### Option A: Delay Lenis Initialization (UNTESTED)

In the main JS where Lenis is created, add a delay:

```javascript
// Wait for scroll reset before initializing Lenis
setTimeout(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2
  });
  
  // ... rest of Lenis setup
}, 200); // 200ms delay
```

### Option B: Reinitialize Lenis After Scroll Reset (UNTESTED)

```javascript
// In transitions.js script
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  
  // Force Lenis to recalculate
  if (lenisInstance) {
    lenisInstance.destroy();
    // Re-initialize Lenis here (need to call original init function)
  }
});
```

### Option C: Use Lenis's Built-in Method (RECOMMENDED)

```javascript
// After Lenis initialization
lenis.scrollTo(0, {
  immediate: true,
  force: true
});
```

### Option D: Nuclear - Detect Refresh State (COMPLEX)

```javascript
// Set flag before refresh
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('wasScrolled', 'true');
});

// On load, if was scrolled, reset and reinit
if (sessionStorage.getItem('wasScrolled') === 'true') {
  sessionStorage.removeItem('wasScrolled');
  window.scrollTo(0, 0);
  
  // Delay Lenis init
  setTimeout(() => {
    // Initialize Lenis here
  }, 300);
}
```

---

## 📁 CURRENT CODE STRUCTURE

### Script 1: Transitions & Loader
Location: First `<script>` tag in page

**Contents:**
- Scroll restoration disable (not working)
- `setLenis()` function
- Lenis limit override (gets overwritten)
- Loader animation
- Page transitions

### Script 2: Mobile Menu
Location: Second `<script>` tag

**Contents:**
- Burger menu functionality
- Mobile menu animations

### Script 3: Main JS (Lenis initialization)
Location: Third `<script>` tag (not shown in troubleshooting)

**Contents:**
- Lenis initialization
- GSAP setup
- Navbar scroll behavior
- Hero animation
- All other page animations

---

## 🔍 DEBUG COMMANDS

### Check Lenis State:
```javascript
console.log('Lenis exists:', !!lenisInstance);
console.log('Lenis limit:', lenisInstance?.limit);
console.log('Lenis scroll:', lenisInstance?.scroll);
console.log('Page height:', document.body.scrollHeight);
console.log('Window height:', window.innerHeight);
console.log('Max scroll:', document.body.scrollHeight - window.innerHeight);
```

### Test Scroll Reset:
```javascript
// Stop Lenis
lenisInstance.stop();

// Try native scroll
window.scrollTo(0, 0);
console.log('Scroll position:', window.pageYOffset);

// Restart Lenis
lenisInstance.start();
```

### Check Timing:
```javascript
// Run this immediately on page load
console.log('Immediate scroll position:', window.pageYOffset);

setTimeout(() => {
  console.log('After 100ms:', window.pageYOffset);
}, 100);

setTimeout(() => {
  console.log('After 500ms:', window.pageYOffset);
}, 500);
```

---

## 💡 ALTERNATIVE APPROACH

**Consider removing Lenis entirely for Webflow:**

Webflow isn't designed for heavy custom smooth scroll libraries. Consider:

1. **Use native scroll** with CSS `scroll-behavior: smooth`
2. **Use Webflow interactions** for scroll-triggered animations
3. **Keep GSAP** for complex animations but use ScrollTrigger with native scroll

**Pros:**
- No scroll restoration conflicts
- Better Webflow integration
- Simpler codebase

**Cons:**
- Less smooth scroll effect
- Need to rebuild some animations

---

## 📝 NEXT STEPS FOR DEBUGGING

1. **Find where Lenis is initialized** (third script tag or external JS file)
2. **Add console.log before and after** Lenis creation
3. **Check timing** - does `window.scrollTo(0, 0)` happen before Lenis init?
4. **Test Option C** - use Lenis's own `scrollTo` method
5. **If all else fails** - consider Option A (delay initialization)

---

## 🎯 WORKAROUND FOR NOW

**User can:**
1. Always refresh from top of page (works correctly)
2. Or scroll to top manually before refreshing
3. Or use Cmd+Shift+R (hard refresh) which might reset scroll

**Not ideal, but functional until proper fix is implemented.**

---

## 📌 IMPORTANT NOTES

- The issue is **timing-related** (Lenis initializes before scroll resets)
- Webflow auto-calculates section heights which complicates things
- The setInterval override of `lenisInstance.limit` doesn't work because Lenis recalculates it internally
- Browser scroll restoration is deeply integrated and hard to override reliably

---

## 🔗 USEFUL LINKS

- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Lenis Issues - Similar Problems](https://github.com/studio-freight/lenis/issues)
- [Webflow + Custom JS Best Practices](https://webflow.com/blog/custom-code)

---

**Last Updated:** December 2024
**Status:** Unresolved - Requires Lenis initialization timing fix

