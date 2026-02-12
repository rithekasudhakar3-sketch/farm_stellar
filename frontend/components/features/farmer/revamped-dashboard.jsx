"use client"

import { Sun, Sparkles, ArrowLeft, Moon, Sunrise, Sunset } from "lucide-react"
import { UserProgressCard } from "./user-progress-card"
import { LeaderboardCard } from "./leaderboard-card"
import { WeatherAlertCard } from "./weather-alert-card"
import { OngoingQuestsCard } from "./ongoing-quests-card"
import { CompletedQuestsWidget } from "./completed-quests-widget"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function RevampedDashboard({ userData, onStartQuest, onNavigate }) {
    const handleResumeQuest = (questId) => {
        if (onStartQuest) {
            onStartQuest(questId)
        }
    }

    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationError, setVerificationError] = useState(null)
    const [verificationSuccess, setVerificationSuccess] = useState(false)
    const [gpsSignal, setGpsSignal] = useState(null)

    // Check if location is verified
    const isLocationVerified = userData?.farmDetails?.farmLocation?.lat && userData?.farmDetails?.farmLocation?.lng

    const handleVerifyLocation = () => {
        setIsVerifying(true)
        setVerificationError(null)

        if (!navigator.geolocation) {
            setVerificationError("Geolocation is not supported by your browser.")
            setIsVerifying(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords
                setGpsSignal({ accuracy })

                try {
                    const token = localStorage.getItem("token")
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

                    const response = await fetch(`${backendUrl}/api/farm/me`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            farmLocation: { lat: latitude, lng: longitude },
                            geofence: { radius: 200 } // Default 200m
                        })
                    })

                    if (!response.ok) {
                        throw new Error("Failed to update farm location")
                    }

                    // success
                    setVerificationSuccess(true)
                    // We should reload the page to refresh user data context
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)

                } catch (err) {
                    console.error("Verification failed:", err)
                    setVerificationError("Failed to save location. Please try again.")
                } finally {
                    setIsVerifying(false)
                }
            },
            (err) => {
                console.error("GPS Error:", err)
                setVerificationError("Unable to retrieve location. Please check browser permissions.")
                setIsVerifying(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        )
    }

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) {
            return { text: "Good Morning", icon: Sunrise }
        } else if (hour >= 12 && hour < 17) {
            return { text: "Good Afternoon", icon: Sun }
        } else if (hour >= 17 && hour < 21) {
            return { text: "Good Evening", icon: Sunset }
        } else {
            return { text: "Good Night", icon: Moon }
        }
    }

    const greeting = getGreeting()
    const GreetingIcon = greeting.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
            {/* Blocking Verification Modal */}
            {!isLocationVerified && !userData?.farmerType?.includes("beginner") && (userData?.farmDetails?.hasLand !== false) && (
                <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-6 shadow-2xl border-yellow-500/50 bg-yellow-50/90 dark:bg-yellow-900/10">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">Verification Required</h2>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Your farm is registered but location is not verified. Please verify your location to access all features.
                            </p>

                            <div className="w-full bg-white/50 dark:bg-black/20 rounded-xl p-4 text-left space-y-2">
                                <h3 className="font-semibold text-sm">Verify Location</h3>
                                <p className="text-xs text-muted-foreground">Please stand at your farm center and take a photo. Ensure you have good GPS signal.</p>

                                {gpsSignal && (
                                    <div className="flex justify-between text-xs mt-2 bg-green-100 p-1 rounded text-green-800">
                                        <span>GPS Signal:</span>
                                        <span>Ready ({Math.round(gpsSignal.accuracy)}m)</span>
                                    </div>
                                )}

                                {verificationError && (
                                    <div className="text-xs text-destructive mt-2 font-medium bg-destructive/10 p-2 rounded">
                                        {verificationError}
                                    </div>
                                )}

                                {verificationSuccess ? (
                                    <div className="text-center py-2 text-green-600 font-bold animate-bounce">
                                        Location Verified! Redirecting...
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleVerifyLocation}
                                        disabled={isVerifying}
                                        className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Verifying...
                                            </>
                                        ) : "Verify My Farm Location"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Header */}
            <div className="bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center gap-3">
                        {onNavigate && (
                            <button
                                onClick={() => onNavigate('welcome')}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <GreetingIcon className="w-4 h-4 text-accent" />
                                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                                    {greeting.text}, {userData?.name || "Farmer"}!
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground">Ready to grow your knowledge today? 🌱</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* 2x2 Grid Layout for Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Left - User Progress Bar */}
                    <div className="h-full">
                        <UserProgressCard userData={userData} />
                    </div>

                    {/* Top Right - Ongoing Quests */}
                    <div className="h-full">
                        <OngoingQuestsCard onResumeQuest={handleResumeQuest} />
                    </div>

                    {/* Bottom Left - Weather Alert Widget */}
                    <div className="h-full">
                        <WeatherAlertCard location={userData?.city || "Bangalore"} />
                    </div>

                    {/* Bottom Right - Leaderboard */}
                    <div className="h-full">
                        <LeaderboardCard />
                    </div>
                </div>

                {/* Completed Quests Widget */}
                <div className="mb-8">
                    <CompletedQuestsWidget completedQuests={userData?.completedQuests} />
                </div>

                {/* Quick Stats Section */}
                <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-foreground mb-6">Your Achievements</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
                            <p className="text-3xl font-bold text-primary mb-1">{userData?.questsProgress?.filter(q => q.status === "completed")?.length || 0}</p>
                            <p className="text-xs text-muted-foreground">Quests Completed</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl border border-accent/20 hover:scale-105 transition-transform">
                            <p className="text-3xl font-bold text-accent mb-1">{userData?.badges?.length || 0}</p>
                            <p className="text-xs text-muted-foreground">Badges Earned</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
                            <p className="text-3xl font-bold text-primary mb-1">92%</p>
                            <p className="text-xs text-muted-foreground">Success Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
