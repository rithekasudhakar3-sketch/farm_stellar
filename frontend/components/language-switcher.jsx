"use client"

import { useTranslation } from "react-i18next"
import "@/src/i18n"
import { Globe } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher({ className }) {
    const { i18n } = useTranslation()

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
        { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
        { code: "mr", label: "मराठी", flag: "🇮🇳" },
    ]

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border border-border hover:bg-accent/10 ${className}`}>
                    <Globe className="w-5 h-5 text-foreground" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-card border-border">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`cursor-pointer flex items-center gap-2 ${i18n.language === lang.code ? "bg-accent/10 font-bold text-accent" : ""
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
