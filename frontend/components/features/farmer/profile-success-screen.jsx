"use client"

import { CheckCircle2, Sparkles } from "lucide-react"

export function ProfileSuccessScreen({ onContinue }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-accent/10 to-transparent">
      <div className="text-center space-y-6 max-w-md">
        {/* Success Animation Placeholder */}
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
          <Sparkles className="w-5 h-5 text-primary absolute -bottom-1 -left-1 animate-pulse" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">Profile Setup Complete!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your farmer profile has been created successfully. You're ready to start your sustainable farming journey.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={onContinue}
          className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 shadow-md"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  )
}
