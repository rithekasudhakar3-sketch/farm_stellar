"use client"

import { Leaf, User, UserCog, UserPlus } from "lucide-react"
export function WelcomeScreen({ onFarmerLogin, onAdminLogin, onSignup, t }) {

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
          <h1 className="text-display text-foreground mb-3 text-balance">{t('auth1.title')}</h1>
          <p className="text-body text-muted-foreground text-balance max-w-md mx-auto">
            {t('auth1.subtitle')}
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <button onClick={onFarmerLogin} className="btn-primary w-full center-flex gap-3">
            <User className="icon-sm" />
            {t('auth1.loginFarmer')}
          </button>

          <button onClick={onAdminLogin} className="btn-secondary w-full center-flex gap-3">
            <UserCog className="icon-sm" />
            {t('auth1.loginAdmin')}
          </button>

          <button onClick={onSignup} className="btn-accent w-full center-flex gap-3">
            <UserPlus className="icon-sm" />
            {t('auth1.signupFarmer')}
          </button>
        </div>

        <p className="text-medium text-muted-foreground mt-8 text-center">{t('extra.tagline')}</p>
      </div>
    </div>
  )
}

