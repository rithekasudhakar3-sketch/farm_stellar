# Testing Guide: Theme & Font Size Settings

## Quick Test Steps

### 1. Start the Development Server
```bash
cd frontend
npm run dev
```

### 2. Navigate to Settings
1. Open the app in your browser
2. Go to the Settings page
3. Scroll to "Display & Language" section

### 3. Test Theme Changes

#### Light Theme
- Click the "Light" button (Sun icon)
- **Expected**: Toast notification "Theme changed to Light"
- **Verify**: Background becomes warm cream, text becomes dark green
- **Transition**: Smooth 300ms fade

#### Dark Theme
- Click the "Dark" button (Moon icon)
- **Expected**: Toast notification "Theme changed to Dark"
- **Verify**: Background becomes dark, text becomes light
- **Transition**: Smooth 300ms fade

#### Deep Forest Theme
- Click the "Deep Forest" button (Trees icon)
- **Expected**: Toast notification "Theme changed to Deep Forest"
- **Verify**: Very dark green background, lighter text
- **Transition**: Smooth 300ms fade

#### Auto (System) Theme
- Click the "Auto" button (Monitor icon)
- **Expected**: Toast notification "Theme changed to Auto"
- **Verify**: Theme matches your system preferences
- **Transition**: May change if system switches between light/dark

### 4. Test Font Size Changes

#### Small Font
- Click the "Small" button
- Shows "14px" underneath
- **Expected**: Toast notification "Font size changed to Small"
- **Verify**: All text becomes noticeably smaller
- **Transition**: Smooth 300ms resize

#### Medium Font (Default)
- Click the "Medium" button
- Shows "16px" underneath
- **Expected**: Toast notification "Font size changed to Medium"
- **Verify**: Text returns to normal size
- **Transition**: Smooth 300ms resize

#### Large Font
- Click the "Large" button
- Shows "18px" underneath
- **Expected**: Toast notification "Font size changed to Large"
- **Verify**: All text becomes larger and more readable
- **Transition**: Smooth 300ms resize

### 5. Test Persistence

#### Refresh Test
1. Change theme to "Deep Forest"
2. Change font size to "Large"
3. Refresh the page (F5 or Ctrl+R)
- **Expected**: Theme stays "Deep Forest", font stays "Large"
- **No flashing**: Should not briefly show default theme

#### Navigate Away Test
1. Set theme to "Dark" and font to "Small"
2. Navigate to another page (Dashboard, Quests, etc.)
3. Return to Settings
- **Expected**: Selections remain highlighted correctly
- **Theme persists**: Dark theme visible throughout navigation

#### New Tab Test
1. Set preferences in current tab
2. Open app in new tab (same browser)
- **Expected**: New tab uses same theme and font size
- **localStorage works**: Preferences shared across tabs

### 6. Test UI Responsiveness

#### Button States
- **Hover**: Buttons should show border color change (border-primary/50)
- **Active**: Selected button should be highlighted with primary color
- **Transition**: All state changes should be smooth

#### Toast Notifications
- **Appearance**: Slides down from top-center
- **Duration**: Visible for 2 seconds
- **Content**: Shows checkmark icon + descriptive message
- **Style**: lime-green accent color background

### 7. Test Across Components

Navigate to different pages and verify theme/font apply:
- ✅ Dashboard
- ✅ Quests List
- ✅ Quest Details
- ✅ Community
- ✅ Profile
- ✅ Sidebar/Navigation

**All elements should respect**:
- Current theme colors
- Current font size
- Smooth transitions when changing

### 8. Browser DevTools Verification

#### localStorage Check
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Look for:
   - `farmquest_theme`: "light" | "dark" | "deep-forest" | "system"
   - `farmquest_fontsize`: "small" | "medium" | "large"

#### HTML Attribute Check
1. Open DevTools Elements tab
2. Select `<html>` element
3. Verify attributes:
   - `data-font-size="medium"` (or current selection)
   - `class="light"` or `"dark"` or `"deep-forest"` (or empty for system)

#### Console Errors
- No errors should appear when changing preferences
- No hydration warnings
- No "localStorage is not defined" errors

## Expected Results Summary

| Feature | Expected Behavior | Pass/Fail |
|---------|------------------|-----------|
| Theme applies instantly | ✓ | ___ |
| Font size applies instantly | ✓ | ___ |
| Smooth transitions (200-300ms) | ✓ | ___ |
| Toast notifications appear | ✓ | ___ |
| Preferences persist on refresh | ✓ | ___ |
| Works across all pages | ✓ | ___ |
| localStorage saves correctly | ✓ | ___ |
| HTML attributes update | ✓ | ___ |
| No console errors | ✓ | ___ |
| Buttons show correct states | ✓ | ___ |

## Common Issues & Solutions

### Issue: Theme doesn't apply immediately
**Solution**: Check that `PreferencesProvider` wraps the app in `layout.jsx`

### Issue: Font size doesn't change
**Solution**: Verify CSS variables are defined in `globals.css`

### Issue: Preferences don't persist
**Solution**: Check if localStorage is enabled in browser

### Issue: Flash of unstyled content
**Solution**: Ensure `suppressHydrationWarning` is on `<html>` element

### Issue: Toast doesn't appear
**Solution**: Verify toast is rendered at correct z-index (z-[100])

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

All should work identically with smooth transitions.
