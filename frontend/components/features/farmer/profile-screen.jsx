
"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Edit2, MapPin, TrendingUp, Award, Leaf, Lock, Globe, Sun, Moon, Monitor, Check, ChevronDown, ChevronUp, Save, Loader2, AlertCircle, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { usePreferences } from "@/components/providers/preferences-provider"

export function FarmerProfileScreen({ onBack, userData }) {
  const { theme, setTheme, fontSize, setFontSize, highContrast, setHighContrast } = usePreferences()
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState(null)

  // Accordion states
  const [isSecurityOpen, setIsSecurityOpen] = useState(false)
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState({})

  const [profile, setProfile] = useState({
    name: userData?.name || "Raj Kumar",
    phone: userData?.phone || "+91 98765 43210",
    username: userData?.username || "",
    district: userData?.district || userData?.location?.split(',')[0] || "Patiala",
    state: userData?.state || "Punjab",
    experience: userData?.level === 5 ? "Pro" : "Intermediate",
    fieldSize: userData?.farmSize || 5, // Assuming farmSize might come in future
    crops: userData?.crops || ["Wheat", "Rice", "Sugarcane"],
  })

  // Settings state
  const [settings, setSettings] = useState({
    email: "raj.kumar@example.com",
    emailVerified: true,
    language: "english",
  })

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success") // success, error, info

  const achievements = [
    { date: "March 2024", title: "Completed first quest 🌱", icon: Award },
    { date: "April 2024", title: "Reached Level 3 ⭐", icon: TrendingUp },
    { date: "May 2024", title: "5 quests completed 🏆", icon: Award },
  ]

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/
    return phoneRegex.test(phone)
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break
      case "phone":
        if (!validatePhone(value)) {
          newErrors.phone = "Please enter a valid phone number"
        } else {
          delete newErrors.phone
        }
        break
      case "name":
        if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters"
        } else {
          delete newErrors.name
        }
        break
      case "username":
        // Allow empty username (optional) unless user is currently typing content
        if (value && value.trim().length > 0) {
          if (value.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters"
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores"
          } else {
            delete newErrors.username
          }
        } else {
          delete newErrors.username
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
    validateField(key, value)
    triggerAutoSave()
  }

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
    validateField(key, value)
    triggerAutoSave()
  }

  const showSuccessToast = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    const timer = setTimeout(() => {
      if (hasUnsavedChanges && Object.keys(errors).length === 0) {
        handleSaveChanges(true) // true = auto-save
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    setAutoSaveTimer(timer)
  }, [hasUnsavedChanges, errors])

  const handleSaveChanges = async (isAutoSave = false) => {
    // Validate all fields before saving
    const isEmailValid = validateField("email", settings.email)
    const isPhoneValid = validateField("phone", profile.phone)
    const isNameValid = validateField("name", profile.name)

    if (!isEmailValid || !isPhoneValid || !isNameValid) {
      showSuccessToast("Please fix validation errors before saving", "error")
      return
    }

    setIsSaving(true)

    try {
      // API call to update profile
      const userToken = localStorage.getItem("token");

      // Construct payload dynamically
      const payload = {
        name: profile.name,
        phone: profile.phone,
        location: `${profile.district}, ${profile.state}`,
        // Add other fields as needed
      };

      // Only include username if it is present and valid (non-empty)
      if (profile.username && profile.username.trim().length >= 3) {
        payload.username = profile.username;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      localStorage.setItem("farmquest_userdata", JSON.stringify(updatedUser));

      // Notify other components (like NavigationMenu in layout)
      window.dispatchEvent(new Event('farmquest_user_update'));

      setHasUnsavedChanges(false)
      setIsEditing(false)

      if (isAutoSave) {
        showSuccessToast("Changes auto-saved ✓", "info")
      } else {
        showSuccessToast("All changes saved successfully!")
      }
    } catch (error) {
      showSuccessToast("Failed to save changes. Please try again.", "error")
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setShowDiscardDialog(false)
    setHasUnsavedChanges(false)
    setIsEditing(false)
    setErrors({})

    // Reset to original values (in real app, fetch from server)
    setProfile({
      name: "Raj Kumar",
      phone: "+91 98765 43210",
      district: "Patiala",
      state: "Punjab",
      experience: "Intermediate",
      fieldSize: 5,
      crops: ["Wheat", "Rice", "Sugarcane"],
    })
    setSettings({
      email: "raj.kumar@example.com",
      emailVerified: true,
      language: "english",
    })

    showSuccessToast("Changes discarded", "info")
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    const themeLabel = newTheme === 'light' ? 'Light' : newTheme === 'dark' ? 'Dark' : 'Auto'
    showSuccessToast(`Theme changed to ${themeLabel}`)
  }

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize)
    const sizeLabel = newSize.charAt(0).toUpperCase() + newSize.slice(1)
    showSuccessToast(`Font size changed to ${sizeLabel}`)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    showSuccessToast("Account deletion request sent", "info")
    // TODO: Implement actual account deletion API call
  }

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (hasUnsavedChanges && !isSaving) {
          handleSaveChanges()
        }
      }

      // ESC to cancel editing
      if (e.key === 'Escape' && isEditing) {
        if (hasUnsavedChanges) {
          setShowDiscardDialog(true)
        } else {
          setIsEditing(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasUnsavedChanges, isSaving, isEditing])

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [autoSaveTimer])

  return (
    <div className="min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] border-b-2 border-primary/20 p-4 watercolor-bg">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1
              className="text-2xl font-bold text-foreground flex items-center gap-2"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              <Leaf className="w-6 h-6 text-primary" />
              Settings
            </h1>
            {hasUnsavedChanges && (
              <p className="text-xs text-muted-foreground mt-1">
                Auto-saving in 2s... or press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-8 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all watercolor-bg border-2 border-primary/20 relative overflow-hidden soft-glow">
          {/* <div className="absolute bottom-4 left-4 opacity-10">
            <Leaf className="w-20 h-20 text-primary" />
          </div> */}

          <div className="flex items-center gap-5 mb-5 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-primary/20 shadow-lg">
              RK
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <Input
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    className={`text-2xl font-bold mb-2 rounded-2xl border-2 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mb-2">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Mali, cursive" }}>
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {profile.district}, {profile.state}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-3 gap-4 pt-5 border-t-2 border-dashed border-primary/20 relative z-10">
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-primary">150</div>
              <div className="text-sm text-muted-foreground mt-1">Total XP ✨</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground mt-1">Level 🌱</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-secondary">5</div>
              <div className="text-sm text-muted-foreground mt-1">Quests 📋</div>
            </div>
          </div> */}
        </div>

        {/* Personal Details Card */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity space-y-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Leaf className="w-5 h-5 text-primary" />
            Personal Details
          </h3>

          <div>
            <Label className="text-muted-foreground mb-2">Phone Number</Label>
            <Input
              value={profile.phone}
              disabled={!isEditing}
              onChange={(e) => updateProfile("phone", e.target.value)}
              className={`mt-1 rounded-2xl border-2 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground mb-2">Experience Level</Label>
            <select
              value={profile.experience}
              disabled={!isEditing}
              onChange={(e) => updateProfile("experience", e.target.value)}
              className="w-full mt-1 p-3 rounded-2xl border-2 bg-background disabled:opacity-50"
            >
              <option value="Beginner">Beginner</option>
              {/* <option value="Intermediate">Intermediate</option> */}
              <option value="Pro">Pro</option>
              {/* <option value="Expert">Expert</option> */}
            </select>
          </div>

          <div>
            <Label className="text-muted-foreground mb-2">Field Size (acres)</Label>
            <Slider
              value={[profile.fieldSize]}
              max={20}
              step={1}
              disabled={!isEditing}
              className="mt-3"
              onValueChange={(value) => updateProfile("fieldSize", value[0])}
            />
            <div className="text-sm text-muted-foreground mt-2">{profile.fieldSize} acres 🌾</div>
          </div>

          {/* <div>
            <Label className="text-muted-foreground mb-2">Primary Crops</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.crops.map((crop) => (
                <span
                  key={crop}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border-2 border-primary/20"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div> */}
        </div>

        {/* Achievement Timeline */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Award className="w-5 h-5 text-accent" />
            Achievement Timeline
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                  <achievement.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">{achievement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLLAPSIBLE: Login & Security Section */}
        {/* Account Settings Section */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] transition-all">
          <button
            onClick={() => setIsSecurityOpen(!isSecurityOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-muted/30 rounded-2xl transition-colors"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              <Lock className="w-5 h-5 text-primary" />
              Account Settings
            </h3>
            {isSecurityOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {isSecurityOpen && (
            <div className="px-6 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label className="text-small text-muted-foreground">Username</Label>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    value={profile.username}
                    onChange={(e) => updateProfile("username", e.target.value)}
                    className={`rounded-2xl border-2 ${errors.username ? 'border-red-500' : ''}`}
                    placeholder="Choose a unique username"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.username}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique handle for your profile. 3+ characters.
                  </p>
                </div>
              </div>

              {/* Email Section (Read Only or Editable if needed) */}
              <div>
                <Label className="text-small text-muted-foreground">Email Address</Label>
                <div className="relative mt-2">
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className={`rounded-2xl border-2 pr-24 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full ${settings.emailVerified ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {settings.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLLAPSIBLE: Display & Language Section */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] transition-all">
          <button
            onClick={() => setIsDisplayOpen(!isDisplayOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-muted/30 rounded-2xl transition-colors"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              <Globe className="w-5 h-5 text-primary" />
              Display & Language
            </h3>
            {isDisplayOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {isDisplayOpen && (
            <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label className="text-small text-muted-foreground mb-2">Language</Label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="w-full mt-2 p-3 rounded-2xl border-2 bg-background"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                  <option value="marathi">Marathi</option>
                </select>
              </div>

              <div>
                <Label className="text-small text-muted-foreground mb-2">Theme Preference</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: "light", label: "Light", bg: "bg-white", border: "border-gray-200", text: "text-slate-900", accent: "bg-green-500" },
                    { value: "dark", label: "Dark", bg: "bg-slate-950", border: "border-slate-800", text: "text-slate-100", accent: "bg-green-600" },
                    { value: "system", label: "Auto", bg: "bg-gradient-to-br from-white to-slate-950", border: "border-gray-300", text: "text-slate-900", accent: "bg-blue-500" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`relative group flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${theme === option.value
                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                        : "border-transparent hover:border-primary/50 hover:scale-[1.02]"
                        }`}
                    >
                      <div className={`w-full aspect-video rounded-lg ${option.bg} ${option.border} border shadow-sm relative overflow-hidden`}>
                        {/* Mock UI for preview */}
                        <div className="absolute top-2 left-2 right-2 h-2 rounded-full bg-current opacity-10"></div>
                        <div className="absolute top-6 left-2 w-8 h-8 rounded-full bg-current opacity-10"></div>
                        <div className="absolute top-6 left-12 right-2 h-16 rounded-lg bg-current opacity-5"></div>
                        {/* Active indicator */}
                        {theme === option.value && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground mb-2">Font Size</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { value: "small", label: "Small", size: "text-sm" },
                    { value: "medium", label: "Medium", size: "text-base" },
                    { value: "large", label: "Large", size: "text-lg" }
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => handleFontSizeChange(size.value)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${fontSize === size.value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className={size.size}>Aa</div>
                      <div className="text-xs opacity-80">{size.label}</div>
                    </button>
                  ))}
                </div>

                {/* Font Size Sample Text Preview */}
                {/* <div className="mt-4 p-4 rounded-xl bg-muted/30 border-2 border-dashed border-border">
                  <p className="text-muted-foreground text-xs mb-2 font-medium uppercase tracking-wider">Preview</p>
                  <p
                    className="text-foreground leading-relaxed transition-all duration-300"
                    style={{
                      fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px'
                    }}
                  >
                    The quick brown fox jumps over the lazy dog. 🌱
                  </p>
                </div> */}
              </div>

              {/* High Contrast Mode Toggle */}
              {/* <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-foreground flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-foreground"></div>
                  </div>
                  <div>
                    <div className="font-medium">High Contrast</div>
                    <div className="text-xs text-muted-foreground">Increase visibility and reduce eye strain</div>
                  </div>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={(checked) => {
                    setHighContrast(checked)
                    showSuccessToast(checked ? "High contrast mode enabled" : "High contrast mode disabled")
                  }}
                />
              </div> */}
            </div>
          )}
        </div>

        {/* DANGER ZONE - Account Deletion */}
        <div className="bg-destructive/5 border-[1.5px] border-destructive/20 rounded-2xl shadow-[0_2px_8px_rgba(239,68,68,0.08)] transition-all">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Danger Zone
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="w-full rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* STICKY SAVE BUTTON - Only shows when there are unsaved changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t-2 border-primary/30 p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">
                {Object.keys(errors).length > 0
                  ? `${Object.keys(errors).length} validation error(s)`
                  : "You have unsaved changes"}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDiscardDialog(true)}
                disabled={isSaving}
                className="rounded-2xl"
              >
                Discard
              </Button>
              <Button
                onClick={() => handleSaveChanges(false)}
                disabled={isSaving || Object.keys(errors).length > 0}
                className="rounded-2xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-destructive/30 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Delete Account?</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground">
                Your profile, quests, achievements, and all associated data will be permanently removed from our servers.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Delete My Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Discard Changes?</h3>
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes. Are you sure you want to discard them? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDiscardDialog(false)}
                className="rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDiscard}
                className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Discard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error/Info Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl border-2 flex items-center gap-2 ${toastType === 'success' ? 'bg-accent text-accent-foreground border-accent/30' :
            toastType === 'error' ? 'bg-destructive text-destructive-foreground border-destructive/30' :
              'bg-primary text-primary-foreground border-primary/30'
            }`}>
            {toastType === 'success' && <Check className="w-4 h-4" />}
            {toastType === 'error' && <X className="w-4 h-4" />}
            {toastType === 'info' && <AlertCircle className="w-4 h-4" />}
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
