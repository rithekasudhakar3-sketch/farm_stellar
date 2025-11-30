"use client"

import { NavigationMenu } from "@/components/shared/navigation-menu"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useRouter, usePathname, useParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "../../i18n/client"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    useEffect(() => {
        const auth = localStorage.getItem("farmquest_auth")
        if (!auth) {
            router.push(`/${lng}/welcome`)
            return
        }

        const { userType } = JSON.parse(auth)
        if (userType !== "admin") {
            router.push(`/${lng}/dashboard`)
        }
    }, [router, lng])

    const handleLogout = () => {
        localStorage.removeItem("farmquest_auth")
        router.push(`/${lng}/welcome`)
    }

    const handleNavigate = (screen) => {
        const routes = {
            "admin-dashboard": "/admin/dashboard",
            "admin-farmers": "/admin/farmers",
            "admin-quests": "/admin/quests",
            "admin-verification": "/admin/verification",
            "admin-rewards": "/admin/rewards",
        }

        if (routes[screen]) {
            router.push(`/${lng}${routes[screen]}`)
        }
    }

    return (
        <div className="min-h-screen bg-background relative">
            <NavigationMenu
                onLogout={handleLogout}
                currentScreen={pathname}
                onNavigate={handleNavigate}
                userType="admin"
                userData={{ name: "Admin", level: 1, xp: 0 }}
                t={t}
            />
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            {children}
        </div>
    )
}
