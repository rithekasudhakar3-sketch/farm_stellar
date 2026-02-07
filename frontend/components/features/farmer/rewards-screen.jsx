"use client"

import { Trophy, Gift, Sparkles, Zap } from "lucide-react"
import { useState } from "react"

export function RewardsProgress({ totalXP, milestones, onClaimReward }) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handleClaim = (milestone) => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    onClaimReward?.(milestone)
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone, idx) => {
        const isUnlocked = totalXP >= milestone.requiredXP
        const isClaimed = milestone.claimed
        const progress = Math.min((totalXP / milestone.requiredXP) * 100, 100)

        return (
          <div
            key={idx}
            className={`relative rounded-2xl p-5 border-2 transition-all ${
              isUnlocked && !isClaimed
                ? "bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/10 border-accent shadow-lg scale-105"
                : isClaimed
                  ? "bg-muted/30 border-border opacity-60"
                  : "bg-card border-border"
            }`}
          >
            {/* Confetti effect */}
            {showConfetti && isUnlocked && !isClaimed && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-1/4 text-2xl animate-float">🎉</div>
                <div className="absolute top-0 right-1/4 text-2xl animate-float animation-delay-200">✨</div>
                <div className="absolute top-0 left-1/2 text-2xl animate-float animation-delay-400">🌟</div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`p-4 rounded-2xl flex-shrink-0 ${
                  isUnlocked && !isClaimed ? "bg-gradient-to-br from-accent to-primary animate-bounce" : "bg-muted/50"
                }`}
              >
                {milestone.type === "trophy" ? (
                  <Trophy className={`w-8 h-8 ${isUnlocked ? "text-white" : "text-muted-foreground"}`} />
                ) : (
                  <Gift className={`w-8 h-8 ${isUnlocked ? "text-white" : "text-muted-foreground"}`} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      {milestone.name}
                      {isUnlocked && !isClaimed && <Sparkles className="w-4 h-4 text-accent animate-pulse" />}
                    </h4>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {milestone.requiredXP} XP
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Action button */}
                {isUnlocked && !isClaimed && (
                  <button
                    onClick={() => handleClaim(milestone)}
                    className="w-full bg-gradient-to-r from-accent via-primary to-secondary text-white font-bold py-2 px-4 rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    🎁 Claim Reward
                  </button>
                )}

                {isClaimed && (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">✓ Claimed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { RewardsProgress as RewardsScreen }
