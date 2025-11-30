"use client"

import { RevampedDashboard } from "@/components/farmer/revamped-dashboard"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "../../../i18n/client"

export default function DashboardPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)
    const [userData, setUserData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    useEffect(() => {
        // Check authentication
        const auth = localStorage.getItem("farmquest_auth")
        if (!auth) {
            router.push(`/${lng}/welcome`)
            return
        }

        // Load user data
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [router, lng])

    const showSuccessToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const handleStartQuest = (questId) => {
        router.push(`/${lng}/quests/${questId}`)
    }

    const handleNavigate = (screen) => {
        const routes = {
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
        return <div className="min-h-screen flex items-center justify-center">{t('common.loading') || "Loading..."}</div>
    }

    return (
        <>
            <RevampedDashboard
                userData={userData}
                quests={QUESTS_DATA}
                onStartQuest={handleStartQuest}
                onNavigate={handleNavigate}
                onShowToast={showSuccessToast}
                t={t}
            />

            {showToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
                    <div className="bg-accent text-accent-foreground px-6 py-3 rounded-2xl shadow-2xl border-2 border-accent/30 flex items-center gap-2 max-w-md">
                        <span className="text-lg">✓</span>
                        <p className="text-sm font-medium">{toastMessage}</p>
                    </div>
                </div>
            )}
        </>
    )
}
