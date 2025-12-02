"use client"

/**
 * Custom Hooks for Theme & Font Size Management
 * 
 * These hooks provide convenient access to theme/font preferences
 * and reactive updates when preferences change.
 */

import { useState, useEffect } from "react"
import { usePreferences } from "./preferences-provider"

/**
 * Hook to get current theme with automatic updates
 * Returns the resolved theme (light/dark) accounting for system preference
 */
export function useCurrentTheme() {
    const { theme, resolvedTheme } = usePreferences()
    const [currentTheme, setCurrentTheme] = useState(resolvedTheme || "light")

    useEffect(() => {
        setCurrentTheme(resolvedTheme || "light")
    }, [resolvedTheme])

    useEffect(() => {
        const handleThemeChange = (e) => {
            setCurrentTheme(e.detail.theme)
        }

        window.addEventListener("themeChange", handleThemeChange)
        return () => window.removeEventListener("themeChange", handleThemeChange)
    }, [])

    return {
        theme: currentTheme,
        isDark: currentTheme === "dark",
        isLight: currentTheme === "light",
    }
}

/**
 * Hook to get current font size with automatic updates
 * Returns font size and pixel value
 */
export function useCurrentFontSize() {
    const { fontSize } = usePreferences()
    const [currentSize, setCurrentSize] = useState(fontSize)

    useEffect(() => {
        setCurrentSize(fontSize)
    }, [fontSize])

    useEffect(() => {
        const handleFontSizeChange = (e) => {
            setCurrentSize(e.detail.fontSize)
        }

        window.addEventListener("fontSizeChange", handleFontSizeChange)
        return () => window.removeEventListener("fontSizeChange", handleFontSizeChange)
    }, [])

    const sizeMap = {
        small: { px: 14, multiplier: 0.875 },
        medium: { px: 16, multiplier: 1 },
        large: { px: 18, multiplier: 1.125 },
    }

    return {
        size: currentSize,
        pixels: sizeMap[currentSize]?.px || 16,
        multiplier: sizeMap[currentSize]?.multiplier || 1,
        isSmall: currentSize === "small",
        isMedium: currentSize === "medium",
        isLarge: currentSize === "large",
    }
}

/**
 * Hook to listen to theme changes
 * Calls the provided callback whenever theme changes
 */
export function useThemeChangeListener(callback) {
    useEffect(() => {
        if (!callback || typeof callback !== "function") return

        const handleThemeChange = (e) => {
            callback(e.detail.theme)
        }

        window.addEventListener("themeChange", handleThemeChange)
        return () => window.removeEventListener("themeChange", handleThemeChange)
    }, [callback])
}

/**
 * Hook to listen to font size changes
 * Calls the provided callback whenever font size changes
 */
export function useFontSizeChangeListener(callback) {
    useEffect(() => {
        if (!callback || typeof callback !== "function") return

        const handleFontSizeChange = (e) => {
            callback(e.detail.fontSize)
        }

        window.addEventListener("fontSizeChange", handleFontSizeChange)
        return () => window.removeEventListener("fontSizeChange", handleFontSizeChange)
    }, [callback])
}

/**
 * Hook to get theme-specific values
 * Automatically returns the correct value based on current theme
 * 
 * @example
 * const bgColor = useThemeValue({ light: "#ffffff", dark: "#000000" })
 */
export function useThemeValue(values) {
    const { isDark } = useCurrentTheme()

    if (!values || typeof values !== "object") {
        console.warn("useThemeValue requires an object with light/dark keys")
        return null
    }

    return isDark ? values.dark : values.light
}

/**
 * Hook to dynamically adjust values based on font size
 * Useful for spacing, icons, etc. that should scale with text
 * 
 * @example
 * const iconSize = useFontSizeScaled(20) // Returns 17.5, 20, or 22.5
 */
export function useFontSizeScaled(baseValue) {
    const { multiplier } = useCurrentFontSize()
    return baseValue * multiplier
}

/**
 * Hook to get all preference-related info in one object
 * Useful for components that need comprehensive preference info
 */
export function usePreferenceInfo() {
    const theme = useCurrentTheme()
    const fontSize = useCurrentFontSize()
    const { setTheme, setFontSize } = usePreferences()

    return {
        // Theme info
        theme: theme.theme,
        isDark: theme.isDark,
        isLight: theme.isLight,

        // Font size info
        fontSize: fontSize.size,
        fontPixels: fontSize.pixels,
        fontMultiplier: fontSize.multiplier,
        isFontSmall: fontSize.isSmall,
        isFontMedium: fontSize.isMedium,
        isFontLarge: fontSize.isLarge,

        // Setter functions
        setTheme,
        setFontSize,
    }
}
