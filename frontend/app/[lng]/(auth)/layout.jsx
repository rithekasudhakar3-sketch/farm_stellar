"use client"

import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen relative">
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            {children}
        </div>
    )
}
