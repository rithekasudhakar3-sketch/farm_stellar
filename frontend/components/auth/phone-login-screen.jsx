"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function PhoneLoginScreen({ onSuccess, onBack, isSignup = false }) {
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhonePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 10)
    setPhone(digitsOnly)
  }

  const fetchLocation = async () => {
    setIsFetchingLocation(true)
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const locationString = `${latitude},${longitude}`
          setLocation(locationString)

          // Reverse geocode to get city name
          try {
            const response = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=f36aabc0f660437ba1a91516250410&q=${latitude},${longitude}`
            )
            const data = await response.json()
            if (data.location && data.location.name) {
              setCity(data.location.name)
            }
          } catch (error) {
            console.error("Error fetching city:", error)
          }

          setIsFetchingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to fetch location. Please enable location access.")
          setIsFetchingLocation(false)
        }
      )
    } catch (error) {
      console.error("Location fetch error:", error)
      setIsFetchingLocation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (phone.length !== 10) return
    
    setIsSubmitting(true)
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      console.log('Sending OTP to phone:', phone);
      console.log('Using backendUrl:', backendUrl);
      
      // Send OTP to phone number
      const response = await fetch(`${backendUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      })

      console.log('Send OTP response status:', response.status);
      const data = await response.json()
      console.log('Send OTP response data:', data);

      if (response.ok) {
        // Store signup data if it's signup flow
        if (isSignup) {
          sessionStorage.setItem("signupData", JSON.stringify({
            name,
            email,
            password,
            location,
            city,
            phone
          }))
        }
        // Proceed to OTP verification
        onSuccess(phone, { isSignup })
      } else {
        console.error("Send OTP failed:", data)
        alert(data.message || "Failed to send OTP. Please try again.")
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      alert("Failed to send OTP. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-md p-8 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Enter your phone number to get started" : "Enter your phone number to login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                {password.length > 0 && password.length < 6 && (
                  <p className="text-xs text-destructive">Password must be at least 6 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    type="text"
                    placeholder={city || "Fetch your location"}
                    value={city}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchLocation}
                    disabled={isFetchingLocation}
                    className="shrink-0"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isFetchingLocation ? "Fetching..." : "Get Location"}
                  </Button>
                </div>
                {city && (
                  <p className="text-xs text-muted-foreground">City: {city}</p>
                )}
              </div>
            </>
          )}
<div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">+91</span>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onPaste={handlePhonePaste}
                className="pl-12"
                required
              />
            </div>
            {phone.length > 0 && phone.length !== 10 && (
              <p className="text-xs text-destructive">Please enter a valid 10-digit phone number</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={
            isSignup 
              ? (phone.length !== 10 || !name || !email || password.length < 6 || isSubmitting)
              : (phone.length !== 10 || isSubmitting)
          }>
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </Button>

          <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
            Back to Welcome
          </Button>
        </form>
      </Card>
    </div>
  )
}
