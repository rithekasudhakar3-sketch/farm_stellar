# Using Theme & Font Size Preferences in Your Components

## Quick Start

### Import the Hook
```javascript
import { usePreferences } from "@/components/preferences-provider"
```

### Use in Your Component
```javascript
export function MyComponent() {
  const { theme, setTheme, fontSize, setFontSize } = usePreferences()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current font size: {fontSize}</p>
    </div>
  )
}
```

## Available Properties

### Reading Current Values

```javascript
const {
  // Theme properties
  theme,              // string: "light" | "dark" | "deep-forest" | "system"
  resolvedTheme,      // string: actual resolved theme (useful when theme="system")
  systemTheme,        // string: system's preferred theme
  themes,             // string[]: available theme options
  
  // Font size properties
  fontSize,           // string: "small" | "medium" | "large"
  
  // Setter functions
  setTheme,           // (theme: string) => void
  setFontSize,        // (size: string) => void
} = usePreferences()
```

## Common Use Cases

### 1. Display Current Theme Name

```javascript
function ThemeDisplay() {
  const { theme } = usePreferences()
  
  const themeLabel = {
    light: "☀️ Light Mode",
    dark: "🌙 Dark Mode",
    "deep-forest": "🌲 Deep Forest",
    system: "💻 Auto"
  }
  
  return <div>{themeLabel[theme]}</div>
}
```

### 2. Create a Theme Toggle Button

```javascript
function ThemeToggle() {
  const { theme, setTheme } = usePreferences()
  
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
  }
  
  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}
```

### 3. Show Font Size Indicator

```javascript
function FontSizeIndicator() {
  const { fontSize } = usePreferences()
  
  return (
    <div className="text-xs text-muted-foreground">
      Font: {fontSize === "small" ? "A" : fontSize === "large" ? "A" : "A"}
    </div>
  )
}
```

### 4. Adjust Font Size

```javascript
function FontSizeControls() {
  const { fontSize, setFontSize } = usePreferences()
  
  return (
    <div className="flex gap-2">
      <button onClick={() => setFontSize("small")}>A-</button>
      <button onClick={() => setFontSize("medium")}>A</button>
      <button onClick={() => setFontSize("large")}>A+</button>
    </div>
  )
}
```

### 5. Theme-Aware Component

```javascript
function ThemedCard() {
  const { resolvedTheme } = usePreferences()
  
  const isDark = resolvedTheme === "dark" || resolvedTheme === "deep-forest"
  
  return (
    <div className={`card ${isDark ? "shadow-xl" : "shadow-md"}`}>
      {/* Card content */}
    </div>
  )
}
```

### 6. Conditional Rendering Based on Theme

```javascript
function ThemeSpecificContent() {
  const { theme } = usePreferences()
  
  if (theme === "deep-forest") {
    return <ForestAnimation />
  }
  
  return <StandardAnimation />
}
```

### 7. Quick Settings Panel

```javascript
function QuickSettings() {
  const { theme, setTheme, fontSize, setFontSize } = usePreferences()
  
  return (
    <div className="quick-settings">
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="deep-forest">Deep Forest</option>
        <option value="system">Auto</option>
      </select>
      
      <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  )
}
```

## Advanced Examples

### Listen for Theme Changes

```javascript
import { useEffect } from "react"
import { usePreferences } from "@/components/preferences-provider"

function ThemeAnalytics() {
  const { theme } = usePreferences()
  
  useEffect(() => {
    // Log theme changes
    console.log("Theme changed to:", theme)
    
    // Send to analytics
    // analytics.track("theme_changed", { theme })
  }, [theme])
  
  return null
}
```

### Respect System Preference

```javascript
function SystemAwareComponent() {
  const { theme, systemTheme } = usePreferences()
  
  const effectiveTheme = theme === "system" ? systemTheme : theme
  
  return (
    <div>
      User selected: {theme}<br />
      Actually showing: {effectiveTheme}
    </div>
  )
}
```

### Save User Preference to Database

```javascript
function SyncPreferences() {
  const { theme, fontSize } = usePreferences()
  
  useEffect(() => {
    // Save to database when preferences change
    async function savePreferences() {
      await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify({ theme, fontSize })
      })
    }
    
    savePreferences()
  }, [theme, fontSize])
  
  return null
}
```

## Don't Do This ❌

### Bad: Manually Accessing localStorage
```javascript
// ❌ Don't do this
const theme = localStorage.getItem("farmquest_theme")
```

### Good: Use the Hook
```javascript
// ✅ Do this instead
const { theme } = usePreferences()
```

### Bad: Directly Manipulating DOM
```javascript
// ❌ Don't do this
document.documentElement.setAttribute("data-font-size", "large")
```

### Good: Use the Setter
```javascript
// ✅ Do this instead
setFontSize("large")
```

## Best Practices

1. **Always use the hook**: Don't access localStorage directly
2. **Check for valid values**: Theme and fontSize have specific allowed values
3. **Use resolvedTheme**: When you need the actual theme (not "system")
4. **Avoid side effects**: The hook handles all DOM updates automatically
5. **Trust the persistence**: Preferences are automatically saved to localStorage

## TypeScript Types (if using TypeScript)

```typescript
type Theme = "light" | "dark" | "deep-forest" | "system"
type FontSize = "small" | "medium" | "large"

interface UsePreferencesReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme?: Theme
  systemTheme?: Theme
  themes: Theme[]
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}
```

## Troubleshooting

### Hook not working?
- Ensure component is wrapped by `<PreferencesProvider>`
- Check that you're in a Client Component (`"use client"`)

### Preferences not persisting?
- Verify localStorage is enabled in browser
- Check browser console for errors
- Ensure valid values are being set

### Theme flashing on load?
- `suppressHydrationWarning` should be on `<html>` in layout.jsx
- Provider has built-in mounting check to prevent flashing

## Summary

The `usePreferences` hook provides a **simple, type-safe, and persistent** way to manage theme and font size preferences throughout your app. All changes are:
- ✅ Instant
- ✅ Persistent (localStorage)
- ✅ Global (affect entire app)
- ✅ Smooth (CSS transitions)
- ✅ Reliable (error handling built-in)
