"use client"

import { QuestsListScreen } from "@/components/quests/quests-list-screen"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuestsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const auth = localStorage.getItem("farmquest_auth")
        if (!auth) {
            router.push("/welcome")
            return
        }

        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [router])

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <QuestsListScreen
            quests={QUESTS_DATA}
            completedQuests={userData.completedQuests || []}
            farmerType={userData.farmerType}
            onStartQuest={(questId) => router.push(`/quests/${questId}`)}
            onBack={() => router.push("/dashboard")}
        />
    )
}
