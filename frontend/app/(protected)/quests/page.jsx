"use client"

import { RevampedQuestsListScreen } from "@/components/quests/revamped-quests-list-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuestsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)
    const [quests, setQuests] = useState([])
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
                
                // Fetch user data
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

                // Fetch quests
                const questsRes = await fetch(`${backendUrl}/api/quests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!questsRes.ok) {
                    throw new Error("Failed to fetch quests")
                }

                const questsData = await questsRes.json()
                
                console.log('===== QUEST DEBUG =====')
                console.log('Raw API response:', questsData)
                console.log('Is array?', Array.isArray(questsData))
                console.log('Type:', typeof questsData)
                console.log('Length:', questsData?.length)
                console.log('Keys:', Object.keys(questsData || {}))
                console.log('========================')
                
                if (!questsData || !Array.isArray(questsData) || questsData.length === 0) {
                    console.warn('No quests returned from API or invalid format')
                    console.log('Setting empty quests array')
                    setQuests([])
                } else {
                    console.log('Fetched quests from API:', questsData.length, 'quests')
                    console.log('Quest details:', questsData.map(q => ({ id: q._id, customId: q.id, title: q.title, active: q.active })))
                    
                    // Transform quests to match frontend format - use array instead of object
                    const transformedQuests = questsData.map(q => ({
                        _id: q._id,
                        id: q.id || q._id,
                        slug: q.slug,
                        title: q.title,
                        description: q.description,
                        activities: q.activities || [],
                        outcomes: q.outcomes || [],
                        difficulty: q.difficulty,
                        cropType: q.cropType,
                        xpReward: q.xpReward,
                        badgeName: q.badgeName,
                        stages: q.steps || q.stages || [],
                        steps: q.steps || q.stages || []
                    }))
                    
                    console.log('Transformed quests array:', transformedQuests)
                    console.log('Transformed quests count:', transformedQuests.length)
                    setQuests(transformedQuests)
                }
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
            quests={quests}
            userData={userData}
            completedQuests={userData.completedQuests || []}
            farmerType={userData.farmerType}
            onStartQuest={(questId) => router.push(`/quests/${questId}`)}
            onBack={() => router.push("/dashboard")}
        />
    )
}
