"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../i18n/client"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  Trophy,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  Leaf,
  Sun,
  Droplet,
  TrendingUp,
  Award,
  Globe
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const params = useParams()
  const lng = params.lng
  const { t } = useTranslation(lng)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("farmquest_auth")
    if (auth) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const auth = JSON.parse(localStorage.getItem("farmquest_auth"))
      if (auth.userType === "admin") {
        router.push(`/${lng}/admin/dashboard`)
      } else {
        router.push(`/${lng}/dashboard`)
      }
    } else {
      router.push(`/${lng}/welcome`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float-gentle"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-gentle animation-delay-400"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float-gentle animation-delay-200"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('brand.name')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('brand.tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button onClick={handleGetStarted} className="btn-primary">
                {t('common.dashboard')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${lng}/welcome`)}
                  className="border-2 hover:bg-secondary/20"
                >
                  {t('common.login')}
                </Button>
                <Button onClick={handleGetStarted} className="btn-primary">
                  {t('common.start')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full border border-accent/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">{t('brand.platformType')}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
                    {t('brand.heroTitle')}
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="btn-primary text-lg px-8 py-6 shadow-xl hover:shadow-2xl"
                >
                  {t('hero.startJourney')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 text-lg px-8 py-6"
                >
                  {t('hero.learnMore')}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">{t('stats.farmers')}</div>
                  <div className="text-sm text-muted-foreground">{t('stats.activeFarmers')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-accent">{t('stats.quests')}</div>
                  <div className="text-sm text-muted-foreground">{t('stats.learningQuests')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-secondary">{t('stats.successRate')}</div>
                  <div className="text-sm text-muted-foreground">{t('stats.success')}</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle">
                      <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-1/4 right-0 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle animation-delay-200">
                      <Trophy className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div className="absolute bottom-1/4 right-0 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle animation-delay-400">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle animation-delay-600">
                      <Sun className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute bottom-1/4 left-0 w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle animation-delay-200">
                      <Droplet className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div className="absolute top-1/4 left-0 w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-lg animate-float-gentle animation-delay-400">
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-card/50 backdrop-blur-sm py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t('why.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('why.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-primary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <BookOpen className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.interactiveQuests.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.interactiveQuests.desc')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-accent transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all">
                  <Trophy className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.rewards.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.rewards.desc')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-secondary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all">
                  <Users className="w-7 h-7 text-secondary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.community.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.community.desc')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-primary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <TrendingUp className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.progress.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.progress.desc')}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-accent transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all">
                  <Award className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.certifications.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.certifications.desc')}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-card border-2 border-border rounded-3xl p-8 hover:border-secondary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all">
                  <Globe className="w-7 h-7 text-secondary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('feature.multilingual.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('feature.multilingual.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
              </div>

              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {t('cta.ready')}
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  {t('cta.join')}
                </p>
                <div className="pt-4">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    {t('cta.startLearning')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('brand.name')}</h3>
                  <p className="text-sm text-muted-foreground">{t('brand.tagline')}</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  {t('footer.rights')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('brand.platformType')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
