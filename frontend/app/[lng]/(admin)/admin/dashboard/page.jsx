"use client"

import { AdminDashboardScreen } from "@/components/admin/dashboard-screen"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "../../../../i18n/client"

export default function AdminDashboardPage() {
    const router = useRouter()
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

    const handleNavigate = (screen) => {
        const routes = {
            "admin-farmers": "/admin/farmers",
            "admin-quests": "/admin/quests",
            "admin-verification": "/admin/verification",
            "admin-rewards": "/admin/rewards",
        }

        if (routes[screen]) {
            router.push(`/${lng}${routes[screen]}`)
        }
    }

    return <AdminDashboardScreen onNavigate={handleNavigate} t={t} />
}
