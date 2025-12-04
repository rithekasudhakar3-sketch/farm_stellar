"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

const PreferencesContext = React.createContext({
    fontSize: "medium",
    setFontSize: () => null,
    highContrast: false,
    setHighContrast: () => null,
})

export function PreferencesProvider({ children, ...props }) {
    const [fontSize, setFontSize] = React.useState("medium")
    const [highContrast, setHighContrast] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    // Load font size from localStorage on mount
    React.useEffect(() => {
        setMounted(true)

        try {
            const storedFontSize = localStorage.getItem("farmquest_fontsize")
            if (storedFontSize && ["small", "medium", "large"].includes(storedFontSize)) {
                setFontSize(storedFontSize)
                document.documentElement.setAttribute("data-font-size", storedFontSize)
            } else {
                document.documentElement.setAttribute("data-font-size", "medium")
                localStorage.setItem("farmquest_fontsize", "medium")
            }

            const storedHighContrast = localStorage.getItem("farmquest_high_contrast") === "true"
            setHighContrast(storedHighContrast)
            if (storedHighContrast) {
                document.documentElement.classList.add("high-contrast")
            } else {
                document.documentElement.classList.remove("high-contrast")
            }
        } catch (error) {
            console.error("Error loading preferences:", error)
            document.documentElement.setAttribute("data-font-size", "medium")
        }
    }, [])

    const handleSetFontSize = React.useCallback((size) => {
        if (!["small", "medium", "large"].includes(size)) {
            console.warn(`Invalid font size: ${size}`)
            return
        }

        setFontSize(size)

        try {
            localStorage.setItem("farmquest_fontsize", size)
        } catch (error) {
            console.error("Error saving font size preference:", error)
        }

        document.documentElement.setAttribute("data-font-size", size)
    }, [])

    const handleSetHighContrast = React.useCallback((enabled) => {
        setHighContrast(enabled)
        try {
            localStorage.setItem("farmquest_high_contrast", String(enabled))
        } catch (error) {
            console.error("Error saving high contrast preference:", error)
        }

        if (enabled) {
            document.documentElement.classList.add("high-contrast")
        } else {
            document.documentElement.classList.remove("high-contrast")
        }
    }, [])

    if (!mounted) {
        // Prevent flash of unstyled content
        return <>{children}</>
    }

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            themes={["light", "dark"]}
            storageKey="farmquest_theme"
            {...props}
        >
            <PreferencesContext.Provider value={{
                fontSize,
                setFontSize: handleSetFontSize,
                highContrast,
                setHighContrast: handleSetHighContrast
            }}>
                {children}
            </PreferencesContext.Provider>
        </NextThemesProvider>
    )
}

export const usePreferences = () => {
    const context = React.useContext(PreferencesContext)
    const { theme, setTheme, themes, systemTheme, resolvedTheme } = useTheme()

    if (!context) {
        throw new Error("usePreferences must be used within a PreferencesProvider")
    }

    return {
        ...context,
        theme,
        setTheme,
        themes,
        systemTheme,
        resolvedTheme
    }
}
