"use client"

import { Zap, Trophy, Share2, ArrowRight, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export function RewardScreen({ quest, onContinue, onNextQuest, onComplete }) {
  const { t } = useTranslation()

  const handleComplete = async () => {
    if (onComplete) {
      await onComplete(quest)
    }
    if (onContinue) {
      onContinue()
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t("quests.shareTitle", { title: quest.title }),
        text: t("quests.shareText", { badge: quest.badgeName }),
        url: window.location.href,
      })
    } else {
      alert(t("quests.shareNotSupported"))
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Confetti/Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-bounce"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-8 max-w-md mx-auto w-full z-10">
        {/* Celebration */}
        <div className="text-center space-y-4">
          <div className="flex justify-center text-7xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl font-black text-foreground text-balance tracking-tight">{t("quests.questComplete")}</h2>
          <p className="text-muted-foreground text-lg">{t("quests.amazingWork")} <span className="text-foreground font-bold">{quest.title}</span></p>
        </div>

        {/* Rewards Card */}
        <div className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl space-y-6">
          {/* XP */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">{t("quests.xpEarned")}</span>
            </div>
            <span className="text-3xl font-black text-primary">+{quest.xpReward}</span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{t("quests.newBadge")}</p>
              <h3 className="text-xl font-bold text-foreground">{quest.badgeName}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {/* Primary Action - Complete Quest */}
          <button
            onClick={handleComplete}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
          >
            <Trophy className="w-5 h-5" />
            {t("quests.completeQuest")}
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => alert(t("quests.sharedToCommunity"))}
              className="flex-1 bg-accent/10 text-accent font-bold py-3 rounded-xl hover:bg-accent/20 transition-colors flex items-center justify-center gap-2 border border-accent/20"
            >
              <Users className="w-5 h-5" />
              {t("quests.shareToCommunity")}
            </button>
            <button
              onClick={onNextQuest}
              className="flex-1 bg-secondary/50 text-secondary-foreground font-bold py-3 rounded-xl hover:bg-secondary/70 transition-colors flex items-center justify-center gap-2 border border-secondary/20"
            >
              {t("quests.nextQuest")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
