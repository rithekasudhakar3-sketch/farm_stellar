"use client"

import { Menu, X, Home, BookOpen, Trophy, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export function Sidebar({ open, onToggle, onNavigate }) {
  const router = useRouter()
  const { t } = useTranslation("dashboard")
  const [userData, setUserData] = useState({ level: 1, xp: 0 })

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const res = await fetch(`${backendUrl}/api/users/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (res.ok) {
          const user = await res.json()
          setUserData({
            level: user.level === "pro" ? 5 : 3,
            xp: user.xp
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("farmquest_auth")
    localStorage.removeItem("farmquest_userdata")
    router.push("/welcome")
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">FQ</span>
            </div>
            <div>
              <h2 className="font-bold text-foreground">FarmQuest</h2>
              <p className="text-xs text-muted-foreground">v1.0</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem icon={Home} label={t('nav.home')} onClick={onNavigate} />
          <NavItem icon={BookOpen} label={t('nav.learn')} />
          <NavItem icon={Trophy} label={t('nav.achievements')} />
          <NavItem icon={Settings} label={t('nav.settings')} />
        </nav>

        <div className="mt-auto p-4">
          <Button className="w-full" variant="outline" onClick={handleLogout}>
            {t('nav.logout')}
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('level')}</span>
              <span className="font-bold text-foreground">{userData.level}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('totalXP')}</span>
              <span className="font-bold text-accent">{userData.xp}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={onToggle} />}
    </>
  )
}

function NavItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
