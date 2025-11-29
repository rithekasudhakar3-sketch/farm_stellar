"use client"

import { Leaf, User, UserCog, UserPlus } from "lucide-react"

export function WelcomeScreen({ onFarmerLogin, onAdminLogin, onSignup }) {
  return (
    <div className="min-h-screen center-flex p-6 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/farm-landscape-background.jpg')" }}
      />
      <div className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-12">
          <div className="center-flex w-20 h-20 bg-primary rounded-3xl mb-6 shadow-lg">
            <Leaf className="icon-2xl text-primary-foreground" />
          </div>
          <h1 className="text-display text-foreground mb-3 text-balance">FarmStellar</h1>
          <p className="text-body text-muted-foreground text-balance max-w-md mx-auto">
            Master sustainable farming through interactive quests and earn rewards
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <button onClick={onFarmerLogin} className="btn-primary w-full center-flex gap-3">
            <User className="icon-sm" />
            Login as Farmer
          </button>

          <button onClick={onAdminLogin} className="btn-secondary w-full center-flex gap-3">
            <UserCog className="icon-sm" />
            Login as Admin
          </button>

          <button onClick={onSignup} className="btn-accent w-full center-flex gap-3">
            <UserPlus className="icon-sm" />
            Sign Up as Farmer
          </button>
        </div>

        <p className="text-medium text-muted-foreground mt-8 text-center">Learn. Grow. Sustain.</p>
      </div>
    </div>
  )
}
