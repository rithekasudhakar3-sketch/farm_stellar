"use client"

/**
 * Theme & Font Size Test Component
 * 
 * This component demonstrates how theme and font size changes
 * apply instantly across different UI elements.
 * 
 * Usage: Import and render this anywhere in your app to test theme consistency
 */

import { usePreferences } from "@/components/preferences-provider"
import { Sun, Moon, Monitor, Type } from "lucide-react"

export function ThemeTestPanel() {
    const { theme, setTheme, fontSize, setFontSize, resolvedTheme } = usePreferences()

    return (
        <div className="fixed bottom-4 right-4 bg-card border-2 border-border rounded-2xl p-4 shadow-xl z-50 max-w-xs">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Theme Test Panel
            </h3>

            {/* Current State */}
            <div className="bg-muted rounded-xl p-3 mb-3 text-xs space-y-1">
                <div><strong>Active Theme:</strong> {theme}</div>
                <div><strong>Resolved:</strong> {resolvedTheme}</div>
                <div><strong>Font Size:</strong> {fontSize}</div>
            </div>

            {/* Sample UI Elements */}
            <div className="space-y-2">
                <button className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-xl text-sm hover:opacity-90 transition">
                    Primary Button
                </button>
                <button className="w-full bg-secondary text-secondary-foreground py-2 px-3 rounded-xl text-sm hover:opacity-90 transition">
                    Secondary Button
                </button>
                <button className="w-full bg-accent text-accent-foreground py-2 px-3 rounded-xl text-sm hover:opacity-90 transition">
                    Accent Button
                </button>
            </div>

            {/* Typography Samples */}
            <div className="mt-3 p-3 bg-background border border-border rounded-xl space-y-1">
                <h1 className="text-2xl font-bold">H1 Heading</h1>
                <h2 className="text-xl font-bold">H2 Heading</h2>
                <p className="text-base">Body text paragraph</p>
                <p className="text-sm text-muted-foreground">Muted text</p>
            </div>

            {/* Live Controls */}
            <div className="mt-3 pt-3 border-t border-border space-y-2">
                <div className="text-xs font-semibold mb-1">Quick Switch:</div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setTheme("light")}
                        className="flex-1 p-2 rounded-lg border hover:bg-primary/10 transition"
                        title="Light"
                    >
                        <Sun className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => setTheme("dark")}
                        className="flex-1 p-2 rounded-lg border hover:bg-primary/10 transition"
                        title="Dark"
                    >
                        <Moon className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => setTheme("system")}
                        className="flex-1 p-2 rounded-lg border hover:bg-primary/10 transition"
                        title="Auto"
                    >
                        <Monitor className="w-4 h-4 mx-auto" />
                    </button>
                </div>
                <div className="flex gap-1">
                    {["small", "medium", "large"].map((size) => (
                        <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 p-2 rounded-lg border text-xs transition ${fontSize === size ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                                }`}
                        >
                            {size[0].toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground text-center">
                Changes apply instantly ⚡
            </div>
        </div>
    )
}

// Export a simple hook to test theme/font events
export function useThemeEvents() {
    const [lastChange, setLastChange] = useState({ type: "", value: "", time: 0 })

    useEffect(() => {
        const handleThemeChange = (e) => {
            setLastChange({ type: "theme", value: e.detail.theme, time: Date.now() })
        }

        const handleFontSizeChange = (e) => {
            setLastChange({ type: "fontSize", value: e.detail.fontSize, time: Date.now() })
        }

        window.addEventListener("themeChange", handleThemeChange)
        window.addEventListener("fontSizeChange", handleFontSizeChange)

        return () => {
            window.removeEventListener("themeChange", handleThemeChange)
            window.removeEventListener("fontSizeChange", handleFontSizeChange)
        }
    }, [])

    return lastChange
}
