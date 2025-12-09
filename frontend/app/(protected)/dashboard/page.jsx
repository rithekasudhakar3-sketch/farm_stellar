"use client"

import { RevampedDashboard } from "@/components/farmer/revamped-dashboard"
import { FarmstellarChatbot } from "@/components/farmer/farmstellar-chatbot"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)
    const [quests, setQuests] = useState({})
    const [loading, setLoading] = useState(true)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            // Check authentication
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

                // Fetch user data from backend
                const userRes = await fetch(`${backendUrl}/api/users/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!userRes.ok) {
                    throw new Error("Failed to fetch user data")
                }

                const user = await userRes.json()

                // Load local storage data for compatibility
                const localData = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")

                // Merge backend and local data
                const mergedData = {
                    ...localData,
                    name: user.name,
                    xp: user.xp || 0,
                    xpLevel: user.xpLevel || 0,
                    level: user.level === "pro" ? 5 : 3,
                    currentXP: user.xp,
                    requiredXP: (Math.floor(user.xp / 100) + 1) * 100,
                    location: user.location || localData.location,
                    city: user.city || localData.city || "Bangalore",
                    questsProgress: user.questsProgress || [],
                    farmDetails: user.farm ? {
                        name: user.farm.name,
                        address: user.farm.address,
                        size: user.farm.size,
                        primaryCrop: user.farm.primaryCrop
                    } : localData.farmDetails,
                    completedQuests: user.questsProgress?.filter(q => q.status === "completed") || [],
                    badges: localData.badges || []
                }

                setUserData(mergedData)

                // Fetch quests
                const questsRes = await fetch(`${backendUrl}/api/quests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (questsRes.ok) {
                    const questsData = await questsRes.json()
                    
                    // Transform quests to match frontend format
                    const transformedQuests = {}
                    questsData.forEach(q => {
                        transformedQuests[q._id] = {
                            id: q._id,
                            slug: q.slug,
                            title: q.title,
                            description: q.description,
                            activities: q.activities || [],
                            outcomes: q.outcomes || [],
                            difficulty: q.difficulty,
                            cropType: q.cropType,
                            xpReward: q.xpReward,
                            badgeName: q.badgeName,
                            stages: q.stages || []
                        }
                    })
                    
                    setQuests(transformedQuests)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
                // Fallback to local data
                const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
                setUserData(data)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    const showSuccessToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const handleStartQuest = (questId) => {
        router.push(`/quests/${questId}`)
    }

    const handleNavigate = (screen) => {
        const routes = {
            "quests-list": "/quests",
            "community": "/community",
            "rewards": "/rewards",
            "farmer-profile": "/profile",
            "settings": "/profile", // Redirects to profile since settings are integrated there
            "impact-tracker": "/rewards",
        }

        if (routes[screen]) {
            router.push(routes[screen])
        }
    }

    if (loading || !userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <>
            <RevampedDashboard
                userData={userData}
                quests={quests}
                onStartQuest={handleStartQuest}
                onNavigate={handleNavigate}
                onShowToast={showSuccessToast}
            />

            {/* FarmStellar Chatbot */}
            <FarmstellarChatbot />

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
