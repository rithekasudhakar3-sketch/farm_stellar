"use client"

import { QuestIntroScreen } from "@/components/features/quests/quest-intro-screen"
import { QuestStepsScreen } from "@/components/features/quests/quest-steps-screen"
import { SubmitProofScreen } from "@/components/features/quests/submit-proof-screen"
import { VerificationScreen } from "@/components/features/quests/verification-screen"
import { RewardScreen } from "@/components/features/quests/reward-screen"
import { LearningSummaryScreen } from "@/components/features/quests/learning-summary-screen"
import { SoilEvaluationScreen } from "@/components/features/quests/soil-evaluation-screen"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function QuestContent() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const questId = params.id
    const step = searchParams.get("step") || "intro"

    console.log("Current step:", step)
    console.log("Quest ID:", questId)

    const [userData, setUserData] = useState(null)
    const [quest, setQuest] = useState(null)
    const [allQuests, setAllQuests] = useState([])
    const [loading, setLoading] = useState(true)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [verificationData, setVerificationData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                console.log("No token found, redirecting to welcome")
                router.push("/welcome")
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                console.log("Fetching quest data for ID:", questId)

                // Fetch user data
                const userRes = await fetch(`${backendUrl}/api/users/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!userRes.ok) {
                    console.error("Failed to fetch user data:", userRes.status, userRes.statusText)
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
                console.log("User data loaded:", mergedData)

                // Fetch all quests
                const questsRes = await fetch(`${backendUrl}/api/quests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!questsRes.ok) {
                    console.error("Failed to fetch quests:", questsRes.status, questsRes.statusText)
                    throw new Error("Failed to fetch quests")
                }

                const questsData = await questsRes.json()
                console.log("All quests loaded:", questsData.length, "quests")
                setAllQuests(questsData)

                // Find the current quest
                const currentQuest = questsData.find(q => q._id === questId || q.id === questId || q.slug === questId)
                console.log("Looking for quest with ID:", questId)
                console.log("Found quest:", currentQuest ? currentQuest.title : "NOT FOUND")

                if (currentQuest) {
                    // Transform quest data to match frontend format
                    const transformedQuest = {
                        id: currentQuest.id || currentQuest._id,
                        _id: currentQuest._id,
                        slug: currentQuest.slug,
                        title: currentQuest.title,
                        description: currentQuest.description,
                        activities: currentQuest.activities || [],
                        outcomes: currentQuest.outcomes || [],
                        difficulty: currentQuest.difficulty,
                        cropType: currentQuest.cropType,
                        xpReward: currentQuest.xpReward,
                        badgeName: currentQuest.badgeName,
                        stages: currentQuest.steps || currentQuest.stages || [],
                        steps: currentQuest.steps || currentQuest.stages || []
                    }
                    console.log("Transformed quest:", transformedQuest)
                    setQuest(transformedQuest)
                } else {
                    console.error("Quest not found! Available quest IDs:", questsData.map(q => ({ _id: q._id, id: q.id, slug: q.slug })))
                }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [router, questId])

    if (loading || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quest data...</p>
                </div>
            </div>
        )
    }

    if (!quest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Quest not found</p>
                    <p className="text-gray-600 mb-4">Quest ID: {questId}</p>
                    <button
                        onClick={() => router.push("/quests")}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Back to Quests
                    </button>
                </div>
            </div>
        )
    }

    // Check if quest is completed
    const isCompleted = userData?.completedQuests?.some(q => q.questId === questId || q === questId) || false

    const showSuccessToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
    }

    const handleQuestComplete = async (quest) => {
        try {
            const token = localStorage.getItem("token")
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

            // Call backend auto-complete endpoint to award XP
            const completeResponse = await fetch(`${backendUrl}/api/submissions/auto-complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    questId: quest.id
                })
            })

            if (!completeResponse.ok) {
                const errorData = await completeResponse.json().catch(() => ({}))
                console.error("Backend error:", errorData)
                throw new Error(errorData.message || "Failed to complete quest")
            }

            const result = await completeResponse.json()

            // Update local state with backend response
            const updatedData = {
                ...userData,
                xp: result.updatedXP,
                xpLevel: result.updatedLevel,
                completedQuests: [...(userData.completedQuests || []), quest.id],
                badges: [...(userData.badges || []), quest.badgeName],
                questsProgress: [
                    ...(userData.questsProgress || []).filter(q => q.questId !== quest.id),
                    {
                        questId: quest.id,
                        status: 'completed',
                        stageIndex: quest.stages?.length || 0
                    }
                ]
            }

            setUserData(updatedData)
            localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData))

            showSuccessToast(`🎉 +${result.xpAwarded} XP earned! You're now level ${result.updatedLevel}!`)

            return {
                leveledUp: result.leveledUp,
                newLevel: result.updatedLevel
            }
        } catch (error) {
            console.error("Error completing quest:", error)
            showSuccessToast("⚠️ Failed to save progress. Please try again.")
            return { leveledUp: false, newLevel: userData.xpLevel || 0 }
        }
    }

    const navigateToStep = (newStep) => {
        router.push(`/quests/${questId}?step=${newStep}`)
    }

    const handleStartQuest = async () => {
        try {
            const token = localStorage.getItem("token")
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

            // Check if quest is already in progress or completed
            const existingProgress = userData.questsProgress?.find(
                qp => (qp.questId === questId || qp.questId === quest.id || qp.questId === quest.slug)
            )

            if (!existingProgress) {
                // Use the quest progress endpoint to start the quest
                const progressResponse = await fetch(`${backendUrl}/api/quests/${quest.id}/progress`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        stageIndex: 0,
                        status: "in-progress"
                    })
                })

                if (!progressResponse.ok) {
                    throw new Error("Failed to start quest")
                }

                const updatedQuestsProgress = await progressResponse.json()

                // Update local state
                const updatedData = {
                    ...userData,
                    questsProgress: updatedQuestsProgress
                }
                setUserData(updatedData)
                localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData))
            }

            // Navigate to steps
            navigateToStep("steps&page=1")
        } catch (error) {
            console.error("Error starting quest:", error)
            showSuccessToast("⚠️ Failed to start quest. Please try again.")
        }
    }

    const currentQuestIndex = allQuests.findIndex(q => q._id === questId || q.slug === questId)
    const nextQuestId = allQuests[currentQuestIndex + 1]?._id || allQuests[0]?._id

    const handleNextQuest = () => {
        router.push(`/quests/${nextQuestId}`)
    }

    return (
        <>
            {step === "intro" && (
                <QuestIntroScreen
                    quest={quest}
                    onStart={handleStartQuest}
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
                    <>
                        {console.log("Rendering SubmitProofScreen for quest:", quest.id)}
                        <SubmitProofScreen
                            quest={quest}
                            onSubmit={(verificationResult) => {
                                setVerificationData(verificationResult)
                                showSuccessToast("✅ Submitted! Admin will review within 24 hours 🌱")
                                navigateToStep("verification")
                            }}
                            onBack={() => navigateToStep("steps")}
                        />
                    </>
                )
            )}

            {step === "verification" && (
                <VerificationScreen
                    quest={quest}
                    verificationData={verificationData}
                    onContinue={() => {
                        // Navigate to learning summary screen
                        navigateToStep("summary")
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
