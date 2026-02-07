"use client"

import { AdminDashboardScreen } from "@/components/features/admin/dashboard-screen"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboardPage() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("farmquest_admin_token")
        if (!token) {
            router.push("/admin/login")
        }
    }, [router])

    const handleNavigate = (screen) => {
        const routes = {
            "admin-farmers": "/admin/farmers",
            "admin-quests": "/admin/quests",
            "admin-verification": "/admin/verification",
            "admin-rewards": "/admin/rewards",
        }

        if (routes[screen]) {
            router.push(routes[screen])
        }
    }

    return <AdminDashboardScreen onNavigate={handleNavigate} />
}
