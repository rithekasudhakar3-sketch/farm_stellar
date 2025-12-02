# ✅ Testing Checklist - Theme & Font Size Enhancements

Use this checklist to verify all features work correctly!

---

## 🎨 Theme Testing

### Light Theme
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Light" theme button
- [ ] Verify background turns warm cream/white
- [ ] Verify text is dark/visible
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Light button
- [ ] Navigate to Dashboard - theme should still be light
- [ ] Navigate to Quests - theme should still be light
- [ ] Refresh page (F5) - theme should persist as light

### Dark Theme
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Dark" theme button
- [ ] Verify background turns dark
- [ ] Verify text is light/visible
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Dark button
- [ ] Navigate to Dashboard - theme should still be dark
- [ ] Navigate to Quests - theme should still be dark
- [ ] Refresh page (F5) - theme should persist as dark

### Auto Theme
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Auto" theme button
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Auto button
- [ ] Theme should match your system preference
- [ ] Change system theme (in OS settings)
- [ ] App theme should change automatically
- [ ] Refresh page - Auto setting should persist

### Theme Transitions
- [ ] Switch from Light to Dark
- [ ] Verify smooth fade transition (no flash)
- [ ] Switch from Dark to Light
- [ ] Verify smooth fade transition (no flash)
- [ ] Rapidly click Light → Dark → Light → Dark
- [ ] Verify no jarring or broken transitions

---

## 📏 Font Size Testing

### Small Font Size
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Small" font size button
- [ ] Verify text shrinks smoothly
- [ ] Verify label shows "14px"
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Small button
- [ ] Navigate to Dashboard - text should still be small
- [ ] Navigate to Quests - text should still be small
- [ ] Refresh page (F5) - font size should persist

### Medium Font Size
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Medium" font size button
- [ ] Verify text returns to normal size
- [ ] Verify label shows "16px"
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Medium button
- [ ] Navigate to Dashboard - text should be normal
- [ ] Refresh page - font size should persist

### Large Font Size
- [ ] Navigate to Profile → Display & Language
- [ ] Click "Large" font size button
- [ ] Verify text expands smoothly
- [ ] Verify label shows "18px"
- [ ] Verify toast notification appears
- [ ] Verify checkmark (✓) shows on Large button
- [ ] Navigate to Dashboard - text should still be large
- [ ] Navigate to Quests - text should still be large
- [ ] Refresh page (F5) - font size should persist

### Font Size Transitions
- [ ] Switch from Medium to Small
- [ ] Verify smooth scaling transition
- [ ] Switch from Small to Large
- [ ] Verify smooth scaling transition
- [ ] Rapidly click Small → Medium → Large → Medium
- [ ] Verify no jarring or broken transitions

---

## 🔄 Combined Testing

### Theme + Font Size Together
- [ ] Set theme to Dark
- [ ] Set font size to Large
- [ ] Both should apply correctly
- [ ] Refresh page
- [ ] Both settings should persist
- [ ] Navigate to different pages
- [ ] Both settings should remain active

### Persistence Testing
- [ ] Set theme to Dark, font size to Large
- [ ] Close browser tab completely
- [ ] Reopen the app
- [ ] Theme should still be Dark
- [ ] Font size should still be Large

---

## 🎯 Visual Feedback Testing

### Button States
- [ ] Hover over theme buttons
- [ ] Verify scale effect (buttons grow slightly)
- [ ] Verify background tint appears
- [ ] Click and hold a theme button
- [ ] Verify active state (button shrinks slightly)
- [ ] Same tests for font size buttons

### Checkmarks
- [ ] Select Light theme
- [ ] Verify checkmark appears in top-right corner
- [ ] Select Dark theme
- [ ] Verify checkmark moves to Dark button
- [ ] Select Small font size
- [ ] Verify checkmark appears on Small button
- [ ] Select Large font size
- [ ] Verify checkmark moves to Large button

### Toast Notifications
- [ ] Change theme
- [ ] Verify toast appears at top of screen
- [ ] Verify toast contains correct message
- [ ] Verify toast disappears after 2 seconds
- [ ] Change font size
- [ ] Verify toast appears
- [ ] Change multiple times rapidly
- [ ] Verify toasts don't stack/overlap badly

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] Use Tab key to navigate to theme buttons
- [ ] Verify focus indicator is visible
- [ ] Press Enter/Space to activate button
- [ ] Verify theme changes
- [ ] Use Tab to navigate to font size buttons
- [ ] Press Enter/Space to activate button
- [ ] Verify font size changes

### Screen Reader (Optional)
- [ ] Enable screen reader
- [ ] Navigate to theme buttons
- [ ] Verify ARIA labels are announced
- [ ] Verify selected state is announced
- [ ] Navigate to font size buttons
- [ ] Verify ARIA labels are announced

### High Contrast
- [ ] Test with Windows High Contrast mode
- [ ] Verify all text is readable
- [ ] Verify buttons are visible
- [ ] Verify checkmarks are visible

### Touch Targets (Mobile)
- [ ] Open app on mobile device or use browser DevTools mobile view
- [ ] Verify theme buttons are easy to tap (44px+)
- [ ] Verify font size buttons are easy to tap
- [ ] No accidental taps on adjacent buttons

---

## 🧪 Technical Testing

### Console (No Errors)
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Change theme multiple times
- [ ] Verify no errors appear
- [ ] Change font size multiple times
- [ ] Verify no errors appear

### localStorage
- [ ] Open DevTools → Application → Storage → Local Storage
- [ ] Verify key `farmquest_theme` exists
- [ ] Verify value is "light", "dark", or "system"
- [ ] Verify key `farmquest_fontsize` exists
- [ ] Verify value is "small", "medium", or "large"
- [ ] Change theme, verify localStorage updates
- [ ] Change font size, verify localStorage updates

### DOM Attributes
- [ ] Open DevTools → Elements tab
- [ ] Find `<html>` element
- [ ] Verify `data-font-size` attribute exists
- [ ] Change font size, verify attribute updates
- [ ] Verify `class="dark"` appears when dark theme active
- [ ] Verify `data-theme` attribute exists and updates

### CSS Variables
- [ ] Open DevTools → Elements → Computed styles
- [ ] Search for `--background`
- [ ] Verify color value
- [ ] Switch to dark theme
- [ ] Verify `--background` value changes
- [ ] Switch back to light
- [ ] Verify value changes back

---

## 📱 Responsive Testing

### Desktop
- [ ] Test on Chrome (1920x1080)
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] All features work correctly

### Tablet
- [ ] Test on iPad or use DevTools device simulation
- [ ] Verify buttons are appropriately sized
- [ ] Verify touch targets work well
- [ ] All features work correctly

### Mobile
- [ ] Test on iPhone or Android or DevTools
- [ ] Verify buttons stack correctly
- [ ] Verify text is readable at all sizes
- [ ] Verify toast appears correctly
- [ ] All features work correctly

---

## 🚀 Performance Testing

### Loading Speed
- [ ] Measure initial page load
- [ ] No significant delay due to theme loading
- [ ] No flash of unstyled content (FOUC)

### Transition Performance
- [ ] Switch theme 10 times rapidly
- [ ] Verify no lag or stuttering
- [ ] Switch font size 10 times rapidly
- [ ] Verify smooth animation throughout
- [ ] Check DevTools Performance tab
- [ ] No major frame drops during transitions

---

## 🌐 Cross-Page Testing

### Navigation
- [ ] Set theme to Dark on Profile page
- [ ] Navigate to Dashboard
- [ ] Theme should be Dark
- [ ] Navigate to Quests
- [ ] Theme should still be Dark
- [ ] Navigate to Community
- [ ] Theme should still be Dark
- [ ] Same test with font size

### All Pages Checklist
Test theme and font size work on:
- [ ] Welcome/Landing page
- [ ] Login page  
- [ ] Signup page
- [ ] Dashboard
- [ ] Profile page
- [ ] Quests page
- [ ] Quest details page
- [ ] Community page
- [ ] Settings page (if separate)
- [ ] Any other pages in your app

---

## 🐛 Edge Cases

### Rapid Changes
- [ ] Click Light → Dark → Light → Dark very rapidly
- [ ] System should handle gracefully
- [ ] No errors in console
- [ ] Final state is correct

### Invalid Values (Developer Testing)
- [ ] Open console, type: `localStorage.setItem('farmquest_theme', 'invalid')`
- [ ] Refresh page
- [ ] App should fallback to default (system)
- [ ] Same test with font size
- [ ] App should fallback to medium

### localStorage Disabled
- [ ] Disable localStorage in browser settings (or use Incognito)
- [ ] Theme changes should still work during session
- [ ] Settings won't persist after refresh (expected behavior)
- [ ] No crashes or errors

---

## ✨ Polish & Details

### Helper Text
- [ ] Verify "Changes apply instantly across the entire app" text appears under Theme
- [ ] Verify "Text size adjusts smoothly across all pages" text appears under Font Size

### Visual Polish
- [ ] Selected buttons have shadow elevation
- [ ] Hover states feel smooth and responsive
- [ ] Active states (click) provide satisfying feedback
- [ ] Spacing and alignment look professional

### Color Consistency
- [ ] Light theme: All greens/colors match design system
- [ ] Dark theme: All colors are high contrast and readable
- [ ] Accent colors (lime) used appropriately

---

## 📊 Final Checks

### Code Quality
- [ ] No TypeScript/ESLint errors in modified files
- [ ] All imports are correct
- [ ] No unused variables or functions
- [ ] Code is properly formatted

### Documentation
- [ ] `.agent/ENHANCEMENT_SUMMARY.md` created ✓
- [ ] `.agent/QUICK_REFERENCE.md` created ✓
- [ ] `.agent/THEME_ENHANCEMENTS_COMPLETE.md` created ✓
- [ ] `.agent/ARCHITECTURE_DIAGRAM.txt` created ✓

### Files Modified Correctly
- [ ] `components/preferences-provider.jsx` enhanced ✓
- [ ] `components/farmer/profile-screen.jsx` enhanced ✓
- [ ] `components/hooks/use-theme-hooks.js` created ✓
- [ ] `components/theme-test-panel.jsx` created ✓

---

## 🎊 COMPLETION CRITERIA

### All tests passing?
- [ ] ✅ Theme changes work instantly
- [ ] ✅ Font size changes work instantly
- [ ] ✅ Settings persist after refresh
- [ ] ✅ Smooth transitions on all changes
- [ ] ✅ Visual feedback (checkmarks, toasts, animations)
- [ ] ✅ Accessibility features working
- [ ] ✅ No console errors
- [ ] ✅ Works across all pages
- [ ] ✅ Mobile responsive
- [ ] ✅ Professional polish

---

## 🎉 CONGRATULATIONS!

If all checks pass, your theme and font size enhancement is **PRODUCTION READY**!

Your users will love the instant, smooth customization experience! 🌱✨

---

## 📝 Notes Section

Use this space to note any issues found during testing:

- Issue 1: _____________________________________________________
  - Status: [ ] Fixed [ ] In Progress [ ] Won't Fix
  
- Issue 2: _____________________________________________________
  - Status: [ ] Fixed [ ] In Progress [ ] Won't Fix
  
- Issue 3: _____________________________________________________
  - Status: [ ] Fixed [ ] In Progress [ ] Won't Fix

---

**Testing Date**: _______________
**Tested By**: _______________
**Browser(s)**: _______________
**Device(s)**: _______________
**Result**: [ ] ✅ Pass [ ] ⚠️ Issues Found [ ] ❌ Fail
