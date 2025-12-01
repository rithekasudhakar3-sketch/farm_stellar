"use client"

import { useTranslation } from "react-i18next"
import { ChevronLeft, Zap, Trophy, ArrowRight, CheckCircle2 } from "lucide-react"

export function QuestIntroScreen({ quest, onStart, onBack, isCompleted }) {
  const { t } = useTranslation()

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={onBack} className="p-2 hover:bg-muted/50 rounded-full transition-colors backdrop-blur-sm border border-border/50">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20">
            {quest.difficulty} {t("quests.quest")}
          </div>
          {isCompleted && (
            <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3" />
              {t("quests.completed")}
            </div>
          )}
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8 z-10 max-w-6xl mx-auto w-full overflow-hidden">

        {/* Left: Title & Info */}
        <div className="flex-1 space-y-6 text-center md:text-left overflow-y-auto max-h-full no-scrollbar">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
              {quest.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border p-3 rounded-2xl shadow-sm">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">+{quest.xpReward} {t("common.xp")}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t("quests.reward")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-border p-3 rounded-2xl shadow-sm">
              <div className="bg-accent/10 p-2 rounded-xl">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{quest.badgeName}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t("quests.badge")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activities Preview */}
        <div className="flex-1 w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {t("quests.missionBrief")}
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {quest.activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-foreground/80">{activity}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            disabled={isCompleted}
            className={`w-full mt-6 font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 group/btn relative z-10 ${isCompleted
                ? 'bg-emerald-500 text-white cursor-default'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t("quests.questCompleted")}
              </>
            ) : (
              <>
                {t("quests.startMission")}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
