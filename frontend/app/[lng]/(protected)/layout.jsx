"use client"

import { NavigationMenu } from "@/components/shared/navigation-menu"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "../../i18n/client"

export default function ProtectedLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const auth = localStorage.getItem("farmquest_auth")
        if (!auth) {
            router.push(`/${lng}/welcome`)
            return
        }

        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [router, lng])

    const handleLogout = () => {
        localStorage.removeItem("farmquest_auth")
        localStorage.removeItem("farmquest_userdata")
        router.push(`/${lng}/welcome`)
    }

    const handleNavigate = (screen) => {
        const routes = {
            "farmer-dashboard": "/dashboard",
            "quests-list": "/quests",
            "community": "/community",
            "rewards": "/rewards",
            "farmer-profile": "/profile",
            "settings": "/settings",
            "impact-tracker": "/impact",
        }

        if (routes[screen]) {
            router.push(`/${lng}${routes[screen]}`)
        }
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background relative">
            <NavigationMenu
                onLogout={handleLogout}
                currentScreen={pathname}
                onNavigate={handleNavigate}
                userType="farmer"
                userData={{
                    name: userData.name || "Farmer",
                    level: userData.level || 1,
                    xp: userData.xp || 0
                }}
                t={t}
            />
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            {children}
        </div>
    )
}
