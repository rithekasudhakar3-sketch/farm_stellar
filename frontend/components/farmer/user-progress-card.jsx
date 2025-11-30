"use client"

import { Sprout, TrendingUp } from "lucide-react"
import { LevelBadge } from "./level-badge"

export function UserProgressCard({ userData, t }) {
    const currentXP = userData?.currentXP || 235
    const requiredXP = userData?.requiredXP || 400
    const level = userData?.level || 3
    const progressPercentage = (currentXP / requiredXP) * 100
    const xpToNextLevel = requiredXP - currentXP

    return (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <LevelBadge level={level} size="lg" />
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{t('common.yourLevel') || "Your Level"}</p>
                        <h3 className="text-3xl font-bold text-primary">{t('common.level') || "Level"} {level}</h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t('dashboard.nextMilestone') || "Next Milestone"}</p>
                    <p className="text-lg font-bold text-accent">{xpToNextLevel} XP</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{t('dashboard.xpProgress') || "XP Progress"}</span>
                    <span className="font-bold text-foreground">
                        {currentXP} / {requiredXP} XP
                    </span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{progressPercentage.toFixed(1)}% {t('dashboard.toNextLevel') || "to next level"}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{currentXP}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('stats.totalXP') || "Total XP"}</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{level}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('common.level') || "Level"}</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">{userData?.completedQuests?.length || 3}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('admin.quests') || "Quests"}</p>
                </div>
            </div>
        </div>
    )
}
