"use client"

import { useState } from "react"
import { ChevronLeft, Smartphone, Lock } from "lucide-react"

export function FarmerLoginScreen({ onSuccess, onBack }) {
  const [step, setStep] = useState("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setStep("otp")
    }
  }

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      onSuccess()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Farmer Login</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step === "phone" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your Phone</h2>
                <p className="text-sm text-muted-foreground">We'll send you an OTP to verify</p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10 digit number"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10}
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Verify OTP</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to <span className="font-bold text-foreground">{phone}</span>
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">OTP Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6 digit OTP"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify OTP
                </button>

                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
