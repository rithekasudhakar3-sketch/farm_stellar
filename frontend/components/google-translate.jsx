"use client"

import { useEffect } from "react"

export function GoogleTranslate() {
    useEffect(() => {
        // Check if script is already added
        if (document.getElementById("google-translate-script")) return

        const script = document.createElement("script")
        script.id = "google-translate-script"
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        script.async = true
        document.body.appendChild(script)

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "ta,hi,te,ml,kn,bn,gu,mr",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            )
        }
    }, [])

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <div id="google_translate_element" className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg" />
        </div>
    )
}
