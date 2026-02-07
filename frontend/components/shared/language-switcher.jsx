"use client"

import { useState, useEffect } from "react"
import { Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function LanguageSwitcher() {
    const [language, setLanguage] = useState("en")
    const [isLoading, setIsLoading] = useState(false)
    const [originalTexts, setOriginalTexts] = useState({})

    // IDs of elements to translate
    const targetIds = ["title", "description", "hero-title", "hero-desc"]

    useEffect(() => {
        // Store original English text on mount
        const texts = {}
        targetIds.forEach(id => {
            const el = document.getElementById(id)
            if (el) {
                texts[id] = el.innerText.trim()
            }
        })
        setOriginalTexts(texts)
    }, [])

    const handleLanguageChange = async (value) => {
        const newLanguage = value

        // Lazy capture of original texts if missing (e.g. because page was loading on mount)
        const textsToUse = { ...originalTexts }
        let hasUpdates = false

        targetIds.forEach(id => {
            if (!textsToUse[id]) {
                const el = document.getElementById(id)
                if (el) {
                    textsToUse[id] = el.innerText.trim()
                    hasUpdates = true
                }
            }
        })

        if (hasUpdates) {
            setOriginalTexts(textsToUse)
        }

        setLanguage(newLanguage)

        if (newLanguage === "en") {
            // Restore original text
            targetIds.forEach(id => {
                const el = document.getElementById(id)
                if (el && textsToUse[id]) {
                    el.innerText = textsToUse[id]
                }
            })
            return
        }

        setIsLoading(true)
        try {
            // Translate each element
            const promises = targetIds.map(async (id) => {
                const originalText = textsToUse[id] || document.getElementById(id)?.innerText
                if (!originalText) return

                try {
                    // Call our backend API
                    const response = await fetch("http://localhost:4000/api/translate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            text: originalText,
                            target: newLanguage,
                        }),
                    })

                    if (!response.ok) throw new Error("Translation failed")

                    const data = await response.json()

                    const el = document.getElementById(id)
                    if (el && data.translatedText) {
                        el.innerText = data.translatedText
                    }
                } catch (err) {
                    console.error(`Failed to translate ${id}:`, err)
                }
            })

            await Promise.all(promises)
        } catch (error) {
            console.error("Translation error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={language} onValueChange={handleLanguageChange} disabled={isLoading}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                </SelectContent>
            </Select>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
    )
}
