"use client"

import { Sprout, Leaf, TreePine } from "lucide-react"
import { useState, useEffect } from "react"

export function XPProgressBar({ currentXP, requiredXP, currentLevel, shouldAnimate = false }) {
  const [displayedXP, setDisplayedXP] = useState(shouldAnimate ? 0 : currentXP)
  const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100)

  useEffect(() => {
    if (shouldAnimate) {
      const animationTimer = setTimeout(() => setDisplayedXP(currentXP), 100)
      return () => clearTimeout(animationTimer)
    }
  }, [shouldAnimate, currentXP])

  const getLevelPlantIcon = () => {
    if (currentLevel <= 3) return <Sprout className="plant-icon plant-icon--sprout" />
    if (currentLevel <= 7) return <Leaf className="plant-icon plant-icon--leaf" />
    return <TreePine className="plant-icon plant-icon--tree" />
  }

  const nextLevel = currentLevel + 1
  const isAlmostComplete = progressPercentage >= 80

  return (
    <div className="xp-progress-container">
      {/* Progress Information */}
      <div className="xp-progress-info">
        <div className="xp-progress-info__level">
          {getLevelPlantIcon()}
          <span className="text-muted-foreground font-medium">Progress to Level {nextLevel}</span>
        </div>
        <span className="xp-progress-info__points">
          {displayedXP} / {requiredXP} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="xp-progress-bar-wrapper">
        <div className="xp-progress-bar-track">
          <div
            className="xp-progress-bar-fill"
            style={{ width: `${shouldAnimate ? progressPercentage : progressPercentage}%` }}
          >
            <div className="xp-progress-bar-shimmer"></div>
          </div>
        </div>

        {progressPercentage > 10 && (
          <div className="xp-progress-sparkle" style={{ left: `${progressPercentage}%` }}>
            ✨
          </div>
        )}
      </div>

      {/* Motivational Message */}
      {isAlmostComplete && <p className="xp-progress-motivation">🌟 Almost there! Keep growing!</p>}

      <style jsx>{`
        .xp-progress-container {
          @apply space-y-3;
        }

        .xp-progress-info {
          @apply flex items-center justify-between text-sm;
        }

        .xp-progress-info__level {
          @apply flex items-center gap-2;
        }

        .xp-progress-info__points {
          @apply font-bold text-accent;
        }

        .plant-icon {
          @apply w-5 h-5 text-primary;
        }

        .plant-icon--sprout {
          @apply animate-bounce;
        }

        .plant-icon--leaf {
          @apply animate-pulse;
        }

        .plant-icon--tree {
          @apply animate-wiggle;
        }

        .xp-progress-bar-wrapper {
          @apply relative;
        }

        .xp-progress-bar-track {
          @apply w-full bg-muted rounded-full h-6 overflow-hidden shadow-inner border-2 border-border/50;
        }

        .xp-progress-bar-fill {
          @apply h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-accent via-primary to-accent relative overflow-hidden;
        }

        .xp-progress-bar-shimmer {
          @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer;
        }

        .xp-progress-sparkle {
          @apply absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-accent animate-pulse text-lg;
        }

        .xp-progress-motivation {
          @apply text-xs text-accent font-bold text-center animate-bounce;
        }
      `}</style>
    </div>
  )
}
