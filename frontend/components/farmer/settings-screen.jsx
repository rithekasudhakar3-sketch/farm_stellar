"use client"

import { useState } from "react"
import { ArrowLeft, User, Lock, MapPin, Leaf, Globe, Sun, Moon, Monitor, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "react-i18next"

export function SettingsScreen({ userData, onBack }) {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useState({
    displayName: userData?.name || "",
    email: userData?.email || "",
    emailVerified: !!userData?.emailVerified,
    bio: userData?.bio || "",
    phoneNumber: userData?.phoneNumber || "",
    location: userData?.location || "",
    app: {
      language: "english",
      theme: "auto",
      fontSize: "medium",
    },
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({ ...prev, [category]: { ...prev[category], [key]: value } }))

    if (category === "app" && key === "language") {
      const langMap = {
        "english": "en",
        "hindi": "hi",
        "Malayalam": "ml",
        "marathi": "mr",
        "tamil": "ta",
        "telugu": "te"
      }
      const langCode = langMap[value] || "en"
      i18n.changeLanguage(langCode)
    }

    showSuccessToast(t("settings.toast.saved"))
  }

  const updateTopLevel = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    showSuccessToast(t("settings.toast.saved"))
  }

  const showSuccessToast = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    showSuccessToast(t("settings.toast.deletionSent"))
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-[1.5px] border-border rounded-2xl p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-primary/10 rounded-2xl" aria-label={t("common.goBack")}>
            <ArrowLeft className="icon-md" />
          </button>
          <div>
            <h1 className="text-h2">{t("settings.title")}</h1>
            <p className="text-small text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Account Settings */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2">
            <User className="icon-md text-primary" />
            {t("settings.accountSettings")}
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-h4 font-semibold">{t("settings.profileInfo")}</h3>

            <div className="space-y-4">
              <div>
                <Label className="text-small text-muted-foreground">{t("settings.displayName")}</Label>
                <Input
                  value={settings.displayName}
                  onChange={(e) => updateTopLevel("displayName", e.target.value)}
                  className="mt-2 rounded-2xl border-2"
                  placeholder={t("settings.placeholders.name")}
                />
              </div>

              <div>
                <Label className="text-small text-muted-foreground">{t("settings.phoneNumber")}</Label>
                <div className="relative mt-2">
                  <Input
                    value={settings.phoneNumber}
                    onChange={(e) => updateTopLevel("phoneNumber", e.target.value)}
                    className="rounded-2xl border-2 pr-24"
                    placeholder="+91 98765 43210"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">
                    {t("settings.verified")}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">{t("settings.location")}</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm text-muted-foreground" />
                  <Input
                    value={settings.location}
                    onChange={(e) => updateTopLevel("location", e.target.value)}
                    className="rounded-2xl border-2 pl-10"
                    placeholder={t("settings.placeholders.location")}
                  />
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">{t("settings.email")}</Label>
                <div className="relative mt-2">
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateTopLevel("email", e.target.value)}
                    className="rounded-2xl border-2 pr-24"
                    placeholder="your@email.com"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full ${settings.emailVerified ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {settings.emailVerified ? t("settings.verified") : t("settings.unverified")}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">{t("settings.bio")}</Label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => updateTopLevel("bio", e.target.value)}
                  className="mt-2 w-full p-3 rounded-2xl border-2 bg-background min-h-[100px] resize-none"
                  placeholder={t("settings.placeholders.bio")}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Lock className="icon-sm text-primary" />
              {t("settings.loginSecurity")}
            </h3>

            <button className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="font-medium">{t("settings.changePassword")}</span>
              </div>
            </button>

            <div className="flex items-center justify-between p-4 hover:bg-muted rounded-2xl">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{t("settings.twoFactor")}</div>
                  <div className="text-xs text-muted-foreground">{t("settings.twoFactorDesc")}</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Application Preferences - Display & Language only */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2">
            <Leaf className="icon-md text-primary" />
            {t("settings.appPreferences")}
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Globe className="icon-sm text-primary" />
              {t("settings.displayLanguage")}
            </h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">{t("settings.language")}</Label>
              <select
                value={settings.app.language}
                onChange={(e) => updateSetting("app", "language", e.target.value)}
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
              <Label className="text-small text-muted-foreground mb-2">{t("settings.theme")}</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "light", icon: Sun, label: t("settings.themes.light") },
                  { value: "dark", icon: Moon, label: t("settings.themes.dark") },
                  { value: "auto", icon: Monitor, label: t("settings.themes.auto") },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("app", "theme", option.value)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-2xl border-2 font-medium ${settings.app.theme === option.value ? "bg-primary text-primary-foreground border-primary" : "border-border"
                      }`}
                  >
                    <option.icon className="icon-md" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">{t("settings.fontSize")}</Label>
              <div className="flex gap-2 mt-2">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting("app", "fontSize", size)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize ${settings.app.fontSize === size ? "bg-primary text-primary-foreground border-primary" : "border-border"
                      }`}
                  >
                    {t(`settings.fontSizes.${size}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4 border-2 border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="icon-md text-destructive" />
              </div>
              <div>
                <h3 className="text-h4 font-bold">{t("settings.deleteAccount.title")}</h3>
                <p className="text-small text-muted-foreground">{t("settings.deleteAccount.subtitle")}</p>
              </div>
            </div>

            <p className="text-small">{t("settings.deleteAccount.confirm")}</p>

            <div className="flex gap-3">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1 rounded-2xl">
                {t("common.cancel")}
              </Button>
              <Button onClick={handleDeleteAccount} className="flex-1 bg-destructive text-destructive-foreground rounded-2xl">
                {t("settings.deleteAccount.button")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
          <div className="bg-accent text-accent-foreground px-6 py-3 rounded-2xl shadow-2xl border-2 border-accent/30 flex items-center gap-2">
            <Check className="icon-sm" />
            <p className="text-small font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsScreen
