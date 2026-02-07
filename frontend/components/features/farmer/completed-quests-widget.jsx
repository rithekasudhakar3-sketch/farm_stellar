"use client"

import { Trophy, Calendar, CheckCircle2, Sprout, Droplets, Leaf, Users, CloudRain, Sun } from "lucide-react"

export function CompletedQuestsWidget({ completedQuests = [] }) {

    // Calculate stats
    const totalXP = completedQuests.reduce((sum, quest) => sum + (quest.xp || 0), 0)
    const totalCompleted = completedQuests.length

    // Helper to get category icon and color
    const getCategoryTheme = (category) => {
        const theme = {
            icon: Leaf,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-100 dark:bg-green-900/30",
            border: "border-green-200 dark:border-green-800"
        }

        if (!category) return theme

        const lowerCat = category.toLowerCase()

        if (lowerCat.includes('water') || lowerCat.includes('rain')) {
            return {
                icon: Droplets,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/30",
                border: "border-blue-200 dark:border-blue-800"
            }
        }
        if (lowerCat.includes('soil') || lowerCat.includes('land')) {
            return {
                icon: Sprout,
                color: "text-amber-700 dark:text-amber-500",
                bg: "bg-amber-100 dark:bg-amber-900/30",
                border: "border-amber-200 dark:border-amber-800"
            }
        }
        if (lowerCat.includes('community') || lowerCat.includes('social')) {
            return {
                icon: Users,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-900/30",
                border: "border-purple-200 dark:border-purple-800"
            }
        }

        return theme
    }

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] overflow-hidden">
            {/* Widget Header */}
            <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Queuest Achievements
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                        {totalCompleted} Completed
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Total XP: <span className="font-bold text-foreground">{totalXP}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Eco-Points: <span className="font-bold text-foreground">{totalXP * 2}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                {completedQuests.length > 0 ? (
                    <div className="space-y-3">
                        {completedQuests.map((quest) => {
                            const theme = getCategoryTheme(quest.category)
                            const Icon = theme.icon

                            return (
                                <div
                                    key={quest.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] hover:shadow-sm ${theme.bg} ${theme.border}`}
                                >
                                    {/* Icon */}
                                    <div className={`p-2.5 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-sm shadow-sm ${theme.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="font-bold text-sm text-foreground truncate pr-2">
                                                {quest.title}
                                            </h4>
                                            <span className="text-xs font-bold text-primary flex-shrink-0 flex items-center gap-1">
                                                +{quest.xp} XP
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${theme.color.split(' ')[0].replace('text', 'bg')}`}></span>
                                                {quest.category || 'General'}
                                            </span>
                                            <span className="flex items-center gap-1 opacity-80">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(quest.completedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Checkmark */}
                                    <div className="pl-1">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 opacity-80" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-8 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 border-2 border-dashed border-border">
                            <Sprout className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">No completed quests yet</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Start farming sustainably to earn XP and rewards!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
