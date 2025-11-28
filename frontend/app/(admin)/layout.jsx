"use client"

import { NavigationMenu } from "@/components/shared/navigation-menu"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const auth = localStorage.getItem("farmquest_auth")
        if (!auth) {
            router.push("/welcome")
            return
        }

        const { userType } = JSON.parse(auth)
        if (userType !== "admin") {
            router.push("/dashboard")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("farmquest_auth")
        router.push("/welcome")
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
            router.push(routes[screen])
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <NavigationMenu
                onLogout={handleLogout}
                currentScreen={pathname}
                onNavigate={handleNavigate}
                userType="admin"
                userData={{ name: "Admin", level: 1, xp: 0 }}
            />
            {children}
        </div>
    )
}
