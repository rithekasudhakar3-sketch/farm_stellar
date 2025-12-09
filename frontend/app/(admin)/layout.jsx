"use client"

import { NavigationMenu } from "@/components/shared/navigation-menu"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [adminData, setAdminData] = useState({ name: "Admin", organization: "" })

    useEffect(() => {
        const token = localStorage.getItem("farmquest_admin_token")
        const adminInfo = localStorage.getItem("farmquest_admin")

        if (!token || !adminInfo) {
            router.push("/admin/login")
            return
        }

        try {
            const admin = JSON.parse(adminInfo)
            setAdminData({
                name: admin.name,
                organization: admin.organization
            })
        } catch (error) {
            console.error('Error parsing admin data:', error)
            router.push("/admin/login")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("farmquest_admin_token")
        localStorage.removeItem("farmquest_admin")
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
                userData={{ name: adminData.name, level: 1, xp: 0 }}
            />
            {children}
        </div>
    )
}
