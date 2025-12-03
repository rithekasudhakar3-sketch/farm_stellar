"use client"

import { Sun, Sparkles, ArrowLeft, Moon, Sunrise, Sunset } from "lucide-react"
import { UserProgressCard } from "./user-progress-card"
import { LeaderboardCard } from "./leaderboard-card"
import { WeatherAlertCard } from "./weather-alert-card"
import { OngoingQuestsCard } from "./ongoing-quests-card"

export function RevampedDashboard({ userData, onStartQuest, onNavigate }) {
    const handleResumeQuest = (questId) => {
        if (onStartQuest) {
            onStartQuest(questId)
        }
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content (2/3 width on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Progress Bar */}
                        <UserProgressCard userData={userData} />

                        {/* Weather Alert Widget */}
                        <WeatherAlertCard location={userData?.city || "Bangalore"} />
                    </div>

                    {/* Right Column - Ongoing Quests & Leaderboard (1/3 width on desktop) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Ongoing Quests Section */}
                            <OngoingQuestsCard onResumeQuest={handleResumeQuest} />
                            
                            {/* Leaderboard - positioned below ongoing quests */}
                            <LeaderboardCard />
                        </div>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="mt-8 bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-foreground mb-6">Your Achievements</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
                            <p className="text-3xl font-bold text-primary mb-1">{userData?.questsProgress?.filter(q => q.status === "completed")?.length || 0}</p>
                            <p className="text-xs text-muted-foreground">Quests Completed</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl border border-accent/20 hover:scale-105 transition-transform">
                            <p className="text-3xl font-bold text-accent mb-1">{userData?.badges?.length || 0}</p>
                            <p className="text-xs text-muted-foreground">Badges Earned</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
