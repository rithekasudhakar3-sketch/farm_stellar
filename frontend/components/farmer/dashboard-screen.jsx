"use client"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Leaf, Sprout, Droplets, CloudRain, BarChart3, Flower2, Sun, Trophy, Award, Star, BookOpen } from "lucide-react"
import { XPProgressBar } from "./xp-progress-bar"
import { LevelBadge } from "./level-badge"
//import { StreakTracker } from "./streak-tracker"

export function FarmerDashboardScreen({ onStartQuest, onViewImpact, quests, onNavigate, userData, onShowToast }) {
  const { t } = useTranslation()
  const availableQuests = Object.values(quests)
  const isFirstLogin = userData?.isFirstLogin

  const FARMER_DATA = {
    name: userData?.name || "Rajesh",
    level: userData?.level || 3,
    currentXP: userData?.currentXP || 235,
    requiredXP: userData?.requiredXP || 400,
    // currentStreak: userData?.currentStreak || 7,
    // activeDays: userData?.activeDays || [0, 1, 2, 3, 4, 5, 6],
    location: userData?.location || "Bangalore Rural, Karnataka",
  }

  const WEATHER_DATA = {
    temperature: "24°C",
    humidity: "65%",
    condition: t("dashboard.weather.partlyCloudy"),
  }

  const CROP_SUGGESTIONS = ["crops.ragi", "crops.paddy", "crops.groundnut"]

  const PROGRESS_STATS = [
    { icon: Trophy, value: `${userData?.completedQuests?.length || 3}`, label: t("dashboard.stats.questsCompleted"), color: "accent" },
    { icon: Award, value: `${userData?.badges?.length || 2}`, label: t("dashboard.stats.badgesEarned"), color: "primary" },
    { icon: BookOpen, value: "8", label: t("dashboard.stats.modulesLearned"), color: "secondary" },
  ]

  useEffect(() => {
    if (isFirstLogin && onShowToast) {
      setTimeout(() => {
        onShowToast(t("dashboard.welcomeToast"))
      }, 2000)
    }
  }, [isFirstLogin])

  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <div className="watercolor-bg px-6 py-8 border-b-2 border-primary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 opacity-20 animate-sway">
          <Leaf className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute bottom-4 left-12  ">
          <Flower2 className="w-12 h-12 text-accent animate-sway" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="icon-md text-accent animate-spin-slow" />
            <h2 className="text-h2 text-foreground" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              {t('dashboard.goodMorning')}, {FARMER_DATA.name}! 🌿
            </h2>
          </div>
          <p className="text-body text-muted-foreground ml-9">{t('dashboard.greetingSubtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all md:col-span-2">
            <div className="flex items-start gap-6 mb-6">
              <LevelBadge level={FARMER_DATA.level} size="lg" />
              <div className="flex-1">
                <p className="text-mediun text-muted-foreground mb-1 flex items-center gap-2">
                  <Sprout className="icon-xs" />
                  {t('dashboard.growingFarmer')}
                </p>
                <p className="text-h1 text-primary mb-1" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                  {t('dashboard.level')} {FARMER_DATA.level}
                </p>
                <p className="text-medium text-muted-foreground">{t('dashboard.nurtureSkills')}</p>
              </div>
            </div>
            <XPProgressBar
              currentXP={FARMER_DATA.currentXP}
              requiredXP={FARMER_DATA.requiredXP}
              currentLevel={FARMER_DATA.level}
              shouldAnimate={true}
            />
          </div>

          {/* //   <StreakTracker currentStreak={FARMER_DATA.currentStreak} streakDays={FARMER_DATA.activeDays} /> */}
        </div>

        {/* Featured Quest */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative overflow-hidden lime-glow">
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-2 right-2 w-16 h-16 bg-accent/30 rounded-full blur-xl"></div>
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border-2 border-primary/30">
              <Leaf className="icon-lg text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-medium text-muted-foreground font-medium mb-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50"></span>
                {t("dashboard.todaysQuest")}
              </p>
              <h3 className="text-h3 text-foreground mb-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                {t('dashboard.soilBasicsQuest')}
              </h3>
              <p className="text-small text-muted-foreground mb-4">
                {t('dashboard.soilBasicsDesc')}
              </p>
              <button
                onClick={() => onStartQuest("soil")}
                className="btn-accent text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50"
              >
                {t('dashboard.continueQuest')}
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
                <CloudRain className="icon-md text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-h4 text-foreground mb-1" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                  {t("dashboard.todaysWeather")}
                </h3>
                <p className="text-medium text-muted-foreground">Bangalore Rural, Karnataka</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: t("dashboard.weather.temperature"), value: WEATHER_DATA.temperature },
                { label: t("dashboard.weather.humidity"), value: WEATHER_DATA.humidity },
                { label: t("dashboard.weather.condition"), value: WEATHER_DATA.condition, highlight: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className="text-small text-muted-foreground">{item.label}</span>
                  <span className={`font-bold ${item.highlight ? "text-accent" : "text-foreground"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Suggestions Card */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                <Sprout className="icon-md text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-h4 text-foreground mb-1" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                  {t('dashboard.cropSuggestions')}
                </h3>
                <p className="text-medium text-muted-foreground">{t('dashboard.basedOnClimate')}</p>
              </div>
            </div>
            <div className="space-y-2">
              {CROP_SUGGESTIONS.map((crop, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-3 h-3 rounded-full bg-primary group-hover:scale-125 transition-transform"></div>
                  <span className="text-small text-foreground">{t(crop)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity soft-glow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h3 text-foreground flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              <Star className="icon-md text-accent" />
              {t('dashboard.yourProgress')}
            </h3>
            <button
              onClick={() => onNavigate && onNavigate("impact-tracker")}
              className="text-small text-primary hover:text-primary/80 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              <BarChart3 className="icon-xs" />
              {t('dashboard.viewDetails')}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROGRESS_STATS.map((stat, idx) => (
              <div
                key={idx}
                className={`text-center p-5 bg-gradient-to-br from-${stat.color}/10 to-transparent rounded-2xl border border-${stat.color}/20 hover:scale-105 transition-transform`}
              >
                <stat.icon className="icon-2xl text-accent mx-auto mb-3" />
                <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-medium text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                {/* <p className="text-2xl font-bold text-primary">{userData?.currentStreak || 7}</p>
                <p className="text-medium text-muted-foreground mt-1">Day Streak 🔥</p> */}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{userData?.currentXP || 235}</p>
                <p className="text-medium text-muted-foreground mt-1">{t('dashboard.totalXP')} ✨</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">15</p>
                <p className="text-medium text-muted-foreground mt-1">{t('dashboard.hoursLearned')} 📚</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">92%</p>
                <p className="text-medium text-muted-foreground mt-1">{t('dashboard.completionRate')} 🎯</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div>
          <h3 className="text-h2 text-foreground mb-5 flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Flower2 className="icon-lg text-primary" />
            {t('dashboard.availableQuests')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableQuests.map((quest) => {
              const icons = { soil: Sprout, crops: Leaf, compost: Droplets }
              const IconComponent = icons[quest.id] || Leaf

              return (
                <div
                  key={quest.id}
                  onClick={() => onStartQuest(quest.id)}
                  className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity hover:scale-105 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl group-hover:from-accent/30 group-hover:to-accent/15 transition-colors">
                      <IconComponent className="icon-lg text-primary" />
                    </div>
                    <span className="text-medium bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full font-medium border border-accent/30">
                      {quest.difficulty === "Easy" ? " " : quest.difficulty === "Medium" ? " " : " "}{" "}
                      {quest.difficulty}
                    </span>
                  </div>
                  <h4 className="text-h4 text-foreground mb-2 text-balance" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    {quest.title}
                  </h4>
                  <p className="text-small text-muted-foreground mb-4 line-clamp-2">{quest.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-border">
                    <span className="text-medium text-muted-foreground">{quest.activities.length} {t('dashboard.activities')} 📋</span>
                    <span className="text-small font-bold text-accent">+{quest.xpReward} {t('common.xp')} ✨</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
