"use client"

import { useState } from "react"
import { ChevronLeft, CreditCard, MapPin, CloudRain, Sprout } from "lucide-react"
import { useRouter } from "next/navigation"

export function FarmerSignupScreen({ onSuccess, onBack }) {
  const [step, setStep] = useState("aadhaar")
  const [aadhaar, setAadhaar] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    district: "",
    state: "",
    experience: "",
    farmSize: "",
    crops: "",
    fertilizer: "",
    pesticide: "",
  })
  const [location, setLocation] = useState(null)
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleFetchDetails = () => {
    if (aadhaar.length === 12) {
      setFormData({
        name: "Rajesh Kumar",
        age: "42",
        phone: "9876543210",
        district: "Bangalore Rural",
        state: "Karnataka",
        experience: "",
        farmSize: "",
        crops: "",
        fertilizer: "",
        pesticide: "",
      })
      setStep("details")
    }
  }

  const handleDetectLocation = () => {
    setLocation({
      district: "Bangalore Rural",
      state: "Karnataka",
      weather: "Partly Cloudy",
      temp: "24°C",
      humidity: "65%",
      climate: "Tropical Savanna",
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    const signupData = { name, email, password, location: "Default Location" }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

    console.log("Attempting to sign up with data:", signupData)
    console.log("Sending request to:", `${backendUrl}/api/auth/signup`)

    try {
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem("token", data.token)
        router.push("/dashboard")
      } else {
        const errorData = await res.json()
        console.error("Signup failed:", errorData.message)
        // Here you can add logic to show an error message to the user
      }
    } catch (error) {
      console.error("An error occurred during signup:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Farmer Signup</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {step === "aadhaar" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Identity</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter your Aadhaar number to fetch your details
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Aadhaar Number</label>
                  <input
                    type="text"
                    maxLength="12"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 12 digit Aadhaar"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  onClick={handleFetchDetails}
                  disabled={aadhaar.length !== 12}
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fetch Details
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              {/* Auto-filled Details */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Verified Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-input bg-muted text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <input
                      type="text"
                      value={formData.age}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-input bg-muted text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-input bg-muted text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-input bg-muted text-foreground text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-input bg-muted text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4">Farming Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["Beginner", "Pro"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, experience: level })}
                      className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                        formData.experience === level
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Weather */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location & Climate
                </h3>
                <button
                  onClick={handleDetectLocation}
                  className="w-full bg-accent/10 text-accent border border-accent/30 font-bold py-3 rounded-xl hover:bg-accent/20 transition-colors mb-4"
                >
                  Auto Detect Location
                </button>

                {location && (
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <CloudRain className="w-6 h-6 text-accent mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{location.weather}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.temp} • Humidity {location.humidity}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Climate Type</p>
                      <p className="text-sm font-bold text-primary">{location.climate}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Farm Details */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  Farm Details (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Farm Size (acres)</label>
                    <input
                      type="text"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                      placeholder="e.g., 2.5"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Primary Crops</label>
                    <input
                      type="text"
                      value={formData.crops}
                      onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                      placeholder="e.g., Rice, Wheat"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Current Fertilizer Usage</label>
                    <input
                      type="text"
                      value={formData.fertilizer}
                      onChange={(e) => setFormData({ ...formData, fertilizer: e.target.value })}
                      placeholder="e.g., Urea, DAP"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Current Pesticide Usage</label>
                    <input
                      type="text"
                      value={formData.pesticide}
                      onChange={(e) => setFormData({ ...formData, pesticide: e.target.value })}
                      placeholder="e.g., Chlorpyrifos"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSuccess}
                disabled={!formData.experience}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
