"use client"

import { useEffect } from "react"

export function GoogleTranslate() {
    useEffect(() => {
        const initGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "ta,hi,te,ml,kn,bn,gu,mr,en",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                )
            }
        }

        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script")
            script.id = "google-translate-script"
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            script.async = true
            document.body.appendChild(script)
            window.googleTranslateElementInit = initGoogleTranslate
        } else {
            // If script is already loaded, manually initialize
            initGoogleTranslate()
        }
    }, [])

    return (
        <div className="fixed bottom-4 left-4 z-50 group">
            <style jsx global>{`
                /* Hide the 'Powered by Google' branding and top banner */
                .goog-te-gadget-simple {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    font-size: 14px !important;
                    display: flex !important;
                    align-items: center !important;
                    cursor: pointer !important;
                }
                
                .goog-te-gadget-icon {
                    display: none !important;
                }
                
                .goog-te-menu-value {
                    color: var(--foreground) !important;
                    font-family: inherit !important;
                    text-decoration: none !important;
                    font-weight: 500 !important;
                    margin-left: 0 !important;
                }
                
                .goog-te-menu-value span {
                    color: var(--foreground) !important;
                    text-decoration: none !important;
                }
                
                .goog-te-menu-value span:last-child {
                    display: none !important; /* Hide the arrow if possible or style it */
                }
                
                /* Style the dropdown menu (this is harder as it's an iframe usually, but simple layout might render a div) */
                .goog-te-menu-frame {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                    border-radius: 0.5rem !important;
                }

                /* Hide the top banner */
                body {
                    top: 0 !important;
                }
                .goog-te-banner-frame {
                    display: none !important;
                    visibility: hidden !important;
                }
                
                /* Customize the container */
                #google_translate_element {
                    display: inline-block !important;
                }
            `}</style>

            <div className="relative overflow-hidden rounded-full bg-card/90 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-all duration-300 pr-3 pl-1 py-1 flex items-center gap-2">
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full text-primary shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
                        <path d="m5 8 6 6" />
                        <path d="m4 14 6-6 2-3" />
                        <path d="M2 5h12" />
                        <path d="M7 2h1" />
                        <path d="m22 22-5-10-5 10" />
                        <path d="M14 18h6" />
                    </svg>
                </div>
                <div id="google_translate_element" className="min-w-[100px]" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>

            {/* Tooltip hint */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Change Language
            </div>
        </div>
    )
}
