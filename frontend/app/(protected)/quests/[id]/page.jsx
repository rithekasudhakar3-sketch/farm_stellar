"use client"

import { QuestIntroScreen } from "@/components/quests/quest-intro-screen"
import { QuestStepsScreen } from "@/components/quests/quest-steps-screen"
import { SubmitProofScreen } from "@/components/quests/submit-proof-screen"
import { VerificationScreen } from "@/components/quests/verification-screen"
import { RewardScreen } from "@/components/quests/reward-screen"
import { LearningSummaryScreen } from "@/components/quests/learning-summary-screen"
import { SoilEvaluationScreen } from "@/components/quests/soil-evaluation-screen"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function QuestContent() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const questId = params.id
    const step = searchParams.get("step") || "intro"

    const [userData, setUserData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
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
                    throw new Error("Failed to fetch user data")
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
                console.error("Error fetching user data:", error)
                const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
                setUserData(data)
            }
        }

        fetchUserData()
    }, [router])

    const quest = QUESTS_DATA[questId]

    if (!quest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Quest Not Found</h2>
                    <button onClick={() => router.push("/quests")} className="text-primary">
                        Back to Quests
                    </button>
                </div>
            </div>
        )
    }

    // Check if quest is completed
    const isCompleted = userData?.completedQuests?.some(q => q.questId === questId || q === questId) || false

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    const showSuccessToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const handleQuestComplete = async (quest) => {
        try {
            const token = localStorage.getItem("token")
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

            // Calculate new XP and level
            const newXP = (userData.xp || 0) + quest.xpReward
            const newXpLevel = Math.floor(newXP / 100)

            // Update user in backend
            const updateResponse = await fetch(`${backendUrl}/api/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    xp: newXP,
                    xpLevel: newXpLevel,
                    questsProgress: [
                        ...(userData.questsProgress || []),
                        {
                            questId: quest.id,
                            status: "completed",
                            stageIndex: quest.stages?.length || 0
                        }
                    ]
                })
            })

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json().catch(() => ({}))
                console.error("Backend error:", errorData)
                throw new Error(errorData.message || "Failed to update user progress")
            }

            const updatedUser = await updateResponse.json()

            // Update local state
            const updatedData = {
                ...userData,
                xp: newXP,
                xpLevel: newXpLevel,
                completedQuests: [...(userData.completedQuests || []), quest.id],
                badges: [...(userData.badges || []), quest.badgeName],
                questsProgress: updatedUser.questsProgress || []
            }

            setUserData(updatedData)
            localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData))

            showSuccessToast(`🎉 +${quest.xpReward} XP earned! You're now level ${newXpLevel}!`)

            return { leveledUp: newXpLevel > (userData.xpLevel || 0), newLevel: newXpLevel }
        } catch (error) {
            console.error("Error completing quest:", error)
            showSuccessToast("⚠️ Failed to save progress. Please try again.")
            return { leveledUp: false, newLevel: userData.xpLevel || 0 }
        }
    }

    const navigateToStep = (newStep) => {
        router.push(`/quests/${questId}?step=${newStep}`)
    }

    const questIds = Object.keys(QUESTS_DATA)
    const currentQuestIndex = questIds.indexOf(questId)
    const nextQuestId = questIds[currentQuestIndex + 1] || questIds[0]

    const handleNextQuest = () => {
        router.push(`/quests/${nextQuestId}`)
    }

    return (
        <>
            {step === "intro" && (
                <QuestIntroScreen
                    quest={quest}
                    onStart={() => navigateToStep("steps&page=1")}
                    onBack={() => router.push("/quests")}
                    isCompleted={isCompleted}
                />
            )}

            {step === "steps" && (
                <QuestStepsScreen
                    quest={quest}
                    onContinue={() => navigateToStep("submit")}
                    onBack={() => navigateToStep("intro")}
                />
            )}

            {step === "submit" && (
                quest.id === "soil_scout" ? (
                    <SoilEvaluationScreen
                        quest={quest}
                        onSubmit={(evaluation) => {
                            console.log("Evaluation submitted:", evaluation)
                            showSuccessToast("✅ Evaluation Submitted! Great job! 🌱")
                            navigateToStep("verification")
                        }}
                        onBack={() => navigateToStep("steps")}
                    />
                ) : (
                    <SubmitProofScreen
                        quest={quest}
                        onSubmit={() => {
                            showSuccessToast("✅ Submitted! Admin will review within 24 hours 🌱")
                            navigateToStep("verification")
                        }}
                        onBack={() => navigateToStep("steps")}
                    />
                )
            )}

            {step === "verification" && (
                <VerificationScreen
                    quest={quest}
                    onContinue={() => {
                        // For auto-verified quests (like crops), go to reward screen
                        if (quest.id === "crops" || quest.id === "soil_scout") {
                            navigateToStep("reward")
                        } else {
                            // For quests requiring admin approval, go back to quest list
                            router.push("/quests")
                        }
                    }}
                />
            )}

            {step === "reward" && (
                <RewardScreen
                    quest={quest}
                    userData={userData}
                    onComplete={handleQuestComplete}
                    onContinue={() => navigateToStep("summary")}
                    onNextQuest={handleNextQuest}
                />
            )}

            {step === "summary" && (
                <LearningSummaryScreen
                    quest={quest}
                    onContinue={() => router.push("/quests")}
                />
            )}

            {step === "reward" && (
                <RewardScreen
                    quest={quest}
                    userData={userData}
                    onComplete={handleQuestComplete}
                    onContinue={() => navigateToStep("summary")}
                    onNextQuest={handleNextQuest}
                />
            )}

            {step === "summary" && (
                <LearningSummaryScreen
                    quest={quest}
                    onContinue={() => router.push("/dashboard")}
                />
            )}

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

export default function QuestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <QuestContent />
        </Suspense>
    )
}
