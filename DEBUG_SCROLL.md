# Debug Scroll Issues

## Problem

Website tidak bisa di-scroll ke bawah pada halaman user (home, destinasi, dll).

## Investigation & Fixes

### Issues Found & Fixed:

1. **PpidView.vue** - FIXED ✅

   - Missing `onUnmounted` cleanup untuk `document.body.style.overflow`
   - Ketika modal lightbox dibuka, `overflow = "hidden"` tidak di-reset
   - Added: `onUnmounted(() => { document.body.style.overflow = "auto"; })`
   - Solution: Added `onUnmounted` import and cleanup function

2. **App.vue** - FIXED ✅

   - Syntax error: CSS rule had semicolon after closing brace (`};`)
   - Fixed: Removed unnecessary semicolon

3. **HomeView.vue** - DEBUGGING ✅
   - Added debugging logs to check:
     - `document.body.overflow` status
     - HTML/Body computed overflow-y
     - Document scroll height vs window height
   - Check console logs to verify scroll is working

### Potential Causes Checked:

- ✅ HeroSection.vue - `height: 100vh` dengan `overflow: hidden` - normal untuk carousel
- ✅ CSS Global - `overflow-x: hidden` di html/body - normal, tidak block vertical scroll
- ✅ Navbar - `position: fixed` - normal, ini untuk navbar
- ✅ EventSection, GallerySection, NewsGrid - All have normal `overflow: hidden` untuk elements, not page
- ✅ CarouselDestinasi - No blocking CSS
- ✅ Other user views - No missing `onUnmounted` cleanup found

## How to Test Scroll:

1. **Open DevTools Console** (F12)
2. Look for HomeView mount logs:

   ```
   HomeView mounted - Debug Scroll
   document.body.overflow: "" (should be empty or "auto")
   html overflow-y: "auto" (should be auto)
   body overflow-y: "auto" (should be auto)
   document height: [should be > window height]
   window innerHeight: [viewport height]
   ```

3. **Manual Scroll Tests**:
   - Mouse wheel scroll
   - Scroll bar drag
   - Keyboard: Arrow Down, Page Down
   - Trackpad/Touch scroll

## Next Steps if Still Not Working:

1. Check if other routes have scroll issues or just /
2. Check browser cache (Ctrl+Shift+Delete)
3. Test in incognito mode
4. Check if CSS `user-select: none` or similar is blocking interaction
5. Look for JavaScript event listeners that might prevent scrolling

## CSS Files Reviewed:

- ✅ Frontend/src/style.css
- ✅ Frontend/src/App.vue (FIXED syntax error)
- ✅ Frontend/src/components/Navbar.vue
- ✅ Frontend/src/views/HomeView.vue
- ✅ Frontend/src/components/home/\*.vue (all components)
