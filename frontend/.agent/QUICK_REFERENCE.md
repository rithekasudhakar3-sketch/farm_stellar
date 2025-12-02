# Quick Reference: Theme & Font Size Settings

## For Users 👤

### Changing Theme & Font Size

1. **Navigate to Profile**
   - Click your profile icon in the navigation menu
   - Scroll to "Display & Language" section

2. **Select Theme**
   - Choose from: Light ☀️, Dark 🌙, or Auto 💻
   - Changes apply instantly across all pages
   - Your choice is saved automatically

3. **Select Font Size**
   - Choose from: Small (14px), Medium (16px), Large (18px)
   - Text scales smoothly across all pages
   - Perfect for better readability

4. **That's it!**
   - Settings persist after page refresh
   - Works across all devices where you're logged in

---

## For Developers 👨‍💻

### Quick Start

```javascript
import { usePreferences } from "@/components/preferences-provider"

function MyComponent() {
  const { theme, setTheme, fontSize, setFontSize, resolvedTheme } = usePreferences()
  
  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <p>Current font size: {fontSize}</p>
      
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setFontSize("large")}>Large Text</button>
    </div>
  )
}
```

### Available Hooks

#### 1. **usePreferences()** - Main Hook
```javascript
const {
  theme,          // "light" | "dark" | "system"
  setTheme,       // (theme) => void
  fontSize,       // "small" | "medium" | "large"
  setFontSize,    // (size) => void
  resolvedTheme,  // "light" | "dark" (resolved from system if theme is "system")
} = usePreferences()
```

#### 2. **useCurrentTheme()** - Theme Info
```javascript
const { theme, isDark, isLight } = useCurrentTheme()
```

#### 3. **useCurrentFontSize()** - Font Size Info
```javascript
const { 
  size,        // "small" | "medium" | "large"
  pixels,      // 14 | 16 | 18
  multiplier,  // 0.875 | 1 | 1.125
  isSmall, isMedium, isLarge 
} = useCurrentFontSize()
```

#### 4. **useThemeValue()** - Conditional Values
```javascript
const bgColor = useThemeValue({
  light: "#ffffff",
  dark: "#000000"
})
```

#### 5. **useFontSizeScaled()** - Scale Values
```javascript
const iconSize = useFontSizeScaled(20) // Scales with font size
```

#### 6. **usePreferenceInfo()** - All-in-One
```javascript
const {
  theme, isDark, isLight,
  fontSize, fontPixels,
  setTheme, setFontSize
} = usePreferenceInfo()
```

### Listening to Changes

```javascript
import { useEffect } from "react"

function MyComponent() {
  useEffect(() => {
    const handleThemeChange = (e) => {
      console.log("Theme changed to:", e.detail.theme)
    }
    
    const handleFontSizeChange = (e) => {
      console.log("Font size changed to:", e.detail.fontSize)
    }
    
    window.addEventListener("themeChange", handleThemeChange)
    window.addEventListener("fontSizeChange", handleFontSizeChange)
    
    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
      window.removeEventListener("fontSizeChange", handleFontSizeChange)
    }
  }, [])
}
```

### CSS Usage

#### Theme-Based Styles
```css
/* Automatically switches based on active theme */
.my-component {
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Dark mode specific */
.dark .my-component {
  /* These styles only apply in dark mode */
}
```

#### Font Size Responsive
```css
/* Use rem units - they scale automatically */
.my-text {
  font-size: 1rem;      /* 14/16/18px based on setting */
  padding: 0.5rem;      /* 7/8/9px based on setting */
  margin: 1.5rem;       /* 21/24/27px based on setting */
}

/* Or target specific sizes */
html[data-font-size="small"] .my-text {
  line-height: 1.4;
}

html[data-font-size="large"] .my-text {
  line-height: 1.6;
}
```

### Tailwind Classes

All Tailwind utilities work with the theme system:

```javascript
<div className="bg-card text-foreground border-border">
  {/* Colors update automatically */}
</div>

<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  {/* Theme-aware button */}
</button>

<p className="text-base p-4">
  {/* Scales with font size (rem-based) */}
</p>
```

### LocalStorage Keys

```javascript
// Theme
localStorage.getItem("farmquest_theme")  // "light" | "dark" | "system"

// Font Size
localStorage.getItem("farmquest_fontsize")  // "small" | "medium" | "large"
```

### Testing Component

Add the test panel to any page:

```javascript
import { ThemeTestPanel } from "@/components/theme-test-panel"

export default function MyPage() {
  return (
    <div>
      <ThemeTestPanel /> {/* Floating test panel */}
      {/* Your content */}
    </div>
  )
}
```

### Available CSS Variables

```css
/* Colors */
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring

/* Special */
--radius (border radius)
--lime-glow, --lime-sunlit (accent colors)

/* Charts */
--chart-1 through --chart-5
```

### Best Practices

1. **Use CSS Variables** instead of hardcoded colors
2. **Use rem/em units** instead of px for scalable text
3. **Test both themes** - ensure contrast is maintained
4. **Test all font sizes** - ensure layouts don't break
5. **Use semantic color names** (--primary instead of --green)
6. **Leverage Tailwind classes** - they're theme-aware

### Troubleshooting

**Theme not applying:**
- Ensure `<PreferencesProvider>` wraps your app in `layout.jsx`
- Check localStorage is enabled
- Verify CSS variables are being used

**Font size not changing:**
- Use `rem`/`em` units, not `px`
- Check `html[data-font-size]` attribute is set
- Verify base font-size in globals.css

**Transitions not smooth:**
- Check transition properties in globals.css
- Ensure `will-change` is set on frequently changing elements
- Use `cubic-bezier` for natural motion

---

## File Structure

```
frontend/
├── app/
│   ├── layout.jsx                    # PreferencesProvider wrapper
│   └── globals.css                   # CSS variables + transitions
├── components/
│   ├── preferences-provider.jsx      # Main context provider
│   ├── theme-test-panel.jsx          # Testing component
│   ├── hooks/
│   │   └── use-theme-hooks.js       # Utility hooks
│   └── farmer/
│       └── profile-screen.jsx        # UI for changing settings
└── .agent/
    ├── THEME_ENHANCEMENTS_COMPLETE.md       # Full documentation
    └── theme-transition-enhancements.css   # Optional CSS
```

---

## Summary

✅ **Themes**: Light, Dark, Auto (system)  
✅ **Font Sizes**: Small (14px), Medium (16px), Large (18px)  
✅ **Persistence**: localStorage (survives refresh)  
✅ **Application**: Instant, smooth transitions  
✅ **Accessibility**: ARIA, keyboard nav, high contrast  
✅ **Performance**: Optimized with will-change, custom events  

**Everything works out of the box!** 🎉
