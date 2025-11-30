"use client"

import { Menu, X, Home, BookOpen, Trophy, Settings } from "lucide-react"

export function Sidebar({ open, onToggle, onNavigate }) {
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
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
          <NavItem icon={Home} label="Home" onClick={onNavigate} />
          <NavItem icon={BookOpen} label="Learn" />
          <NavItem icon={Trophy} label="Achievements" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* Footer Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span className="font-bold text-foreground">1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total XP</span>
              <span className="font-bold text-accent">155</span>
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
