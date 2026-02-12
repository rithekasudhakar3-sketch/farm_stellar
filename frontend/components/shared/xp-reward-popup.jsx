"use client"

import { useState, useEffect } from "react"
import { Sparkles, Trophy } from "lucide-react"

export function XPRewardPopup({ xpAmount, isVisible, onComplete }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShow(true)
            const timer = setTimeout(() => {
                setShow(false)
                if (onComplete) onComplete()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onComplete])

    if (!show) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="animate-in zoom-in-50 fade-in slide-in-from-bottom-10 duration-500">
                <div className="bg-gradient-to-r from-yellow-400/90 to-amber-500/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-4 border-white/30 transform scale-110">
                    <div className="flex flex-col items-center gap-2 text-white">
                        <div className="relative">
                            <Trophy className="w-12 h-12 text-yellow-100 animate-bounce" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-200 animate-pulse" />
                            <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-yellow-200 animate-pulse delay-75" />
                        </div>
                        <div className="text-3xl font-black tracking-wider drop-shadow-md">
                            +{xpAmount} XP
                        </div>
                        <div className="text-sm font-bold opacity-90 uppercase tracking-widest">
                            Level Up!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
