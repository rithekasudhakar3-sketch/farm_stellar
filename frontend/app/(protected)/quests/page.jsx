"use client"

import { RevampedQuestsListScreen } from "@/components/quests/revamped-quests-list-screen"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuestsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                const userRes = await fetch(`${backendUrl}/api/users/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!userRes.ok) {
                    const errorData = await userRes.json().catch(() => ({}))
                    console.error("API Error:", userRes.status, errorData)
                    
                    // If unauthorized, clear token and redirect
                    if (userRes.status === 401) {
                        localStorage.removeItem("token")
                        localStorage.removeItem("farmquest_auth")
                        localStorage.removeItem("farmquest_userdata")
                        router.push("/welcome")
                        return
                    }
                    
                    throw new Error(errorData.message || "Failed to fetch user data")
                }

                const user = await userRes.json()
                const localData = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")

                const mergedData = {
                    ...localData,
                    xpLevel: user.xpLevel || 0,
                    xp: user.xp || 0,
                    questsProgress: user.questsProgress || [],
                    completedQuests: user.questsProgress?.filter(q => q.status === "completed") || []
                }

                setUserData(mergedData)
            } catch (error) {
                console.error("Error fetching data:", error)
                const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
                setUserData(data)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    if (loading || !userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <RevampedQuestsListScreen
            quests={QUESTS_DATA}
            userData={userData}
            completedQuests={userData.completedQuests || []}
            farmerType={userData.farmerType}
            onStartQuest={(questId) => router.push(`/quests/${questId}`)}
            onBack={() => router.push("/dashboard")}
        />
    )
}
