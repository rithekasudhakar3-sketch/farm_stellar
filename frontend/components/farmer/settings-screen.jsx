"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Eye,
  Palette,
  User,
  Lock,
  Download,
  Trash2,
  Key,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor,
  TrendingUp,
  Users,
  Target,
  HelpCircle,
  Award,
  Leaf,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export function SettingsScreen({ userData, onBack, onUpdate }) {
  const [settings, setSettings] = useState({
    // Account Settings
    displayName: userData.name || "Raj Kumar",
    email: userData.email || "",
    emailVerified: false,
    bio: userData.bio || "",
    phoneNumber: userData.phoneNumber || "+91 98765 43210",
    location: userData.location || "Punjab, India",

    farmerIdentity: {
      level: userData.farmerType || "beginner", // beginner, pro
      farmSize: userData.farmSize || "small", // small, medium, large
      primaryCrops: userData.primaryCrops || ["wheat", "rice"],
      farmingType: userData.farmingType || "conventional", // organic, conventional, mixed
    },

    levelProgress: {
      autoLevelUp: true,
      showProgressBar: true,
      requestReassessment: false,
      showSkillsPublicly: true,
    },

    // Notification Preferences
    notifications: {
      questReminders: true,
      weeklyReports: true,
      announcements: true,
      communityMentions: true,
      pushQuestComplete: true,
      pushStreak: true,
      pushNewContent: false,
      pushFriendActivity: false,
      progressUpdates: true,
      levelUpNotifications: true,
      streakReminders: true,
      leaderboardUpdates: false,
      friendRequests: true,
      communityChallenge: true,
      mentorMessages: true,
      weatherWarnings: true,
      marketPriceUpdates: false,
    },

    // Privacy & Data
    privacy: {
      profileVisibility: "public", // public, private, friends
      activityVisible: true,
      showProgress: true,
      showRealName: true,
      showFarmingLevel: true,
      showCompletedQuests: true,
      shareQuestCompletions: true,
      displayBadgesPublicly: true,
      showProgressStats: true,
      communityFeedParticipation: true,
      anonymousDataSharing: false,
      researchParticipation: false,
    },

    // Application Preferences
    app: {
      language: "english",
      theme: "auto", // light, dark, auto
      fontSize: "medium", // small, medium, large
      highContrast: false,
      reducedAnimations: false,
      screenReader: false,
      dataSavingMode: false,
      imageQuality: "high", // low, medium, high
      autoDownloadUpdates: true,
      defaultLandingPage: "dashboard", // dashboard, quests, community
    },

    // Farm & Game Settings
    farm: {
      units: "metric", // metric, imperial
      farmView: "grid", // map, list, grid
      seasonalNotifications: true,
      plantingSeasonReminders: true,
      harvestTimeNotifications: true,
      weatherAlertSubscription: true,
    },

    game: {
      soundEffects: 80,
      backgroundMusic: false,
      difficulty: userData.farmerType || "beginner",
      dailyQuestLimit: 3,
      questSuggestionFrequency: "daily", // hourly, daily, weekly
      autoQuestAssignment: false,
      rewardNotificationStyle: "full", // minimal, full
      pointDisplayPreference: "visible", // visible, hidden, summary
      badgeAnimations: true,
      celebrationEffects: true,
      competitionParticipation: true,
      leaderboardVisibility: "public", // public, friends, hidden
      challengeDifficulty: "medium", // easy, medium, hard
      teamQuestPreferences: true,
    },

    community: {
      friendRequestPermissions: "everyone", // everyone, friends-of-friends, nobody
      messagePermissions: "friends", // everyone, friends, nobody
      onlineStatusDisplay: true,
      activityStatusSharing: true,
      profileDiscoverySettings: "public", // public, limited, private
      showContactInfo: false,
    },

    learning: {
      preferredContentType: "mixed", // video, text, images, mixed
      learningPace: "medium", // slow, medium, fast
      tutorialAutoPlay: true,
      stepByStepGuides: true,
    },

    support: {
      inAppTutorials: true,
      tooltipFrequency: "normal", // minimal, normal, detailed
      helpArticleSuggestions: true,
      supportContactMethod: "chat", // chat, email, phone
      feedbackFrequency: "monthly", // never, monthly, quarterly
      surveyParticipation: true,
      appRatingReminders: true,
      bugReportPreferences: true,
    },
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("Settings saved")

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
    showSuccessToast("Settings saved")
  }

  const updateTopLevel = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    showSuccessToast("Settings saved")
  }

  const showSuccessToast = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleDownloadData = () => {
    showSuccessToast("Download started - check your downloads")
  }

  const handleClearHistory = () => {
    showSuccessToast("Search history cleared")
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    showSuccessToast("Account deletion request sent")
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] border-b-2 border-primary/20 p-4 watercolor-bg">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="icon-md" />
          </button>
          <div>
            <h1 className="text-h2 text-foreground" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Settings
            </h1>
            <p className="text-small text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Section 1: Account Settings */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <User className="icon-md text-primary" />
            Account Settings
          </h2>

          {/* Profile Information */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Profile Information</h3>

            <div className="space-y-4">
              <div>
                <Label className="text-small text-muted-foreground">Display Name</Label>
                <Input
                  value={settings.displayName}
                  onChange={(e) => updateTopLevel("displayName", e.target.value)}
                  className="mt-2 rounded-2xl border-2"
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label className="text-small text-muted-foreground">Phone Number</Label>
                <div className="relative mt-2">
                  <Input
                    value={settings.phoneNumber}
                    onChange={(e) => updateTopLevel("phoneNumber", e.target.value)}
                    className="rounded-2xl border-2 pr-24"
                    placeholder="+91 98765 43210"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm text-muted-foreground" />
                  <Input
                    value={settings.location}
                    onChange={(e) => updateTopLevel("location", e.target.value)}
                    className="rounded-2xl border-2 pl-10"
                    placeholder="Village, District, State"
                  />
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">Email Address</Label>
                <div className="relative mt-2">
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateTopLevel("email", e.target.value)}
                    className="rounded-2xl border-2 pr-24"
                    placeholder="your@email.com"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full ${settings.emailVerified ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {settings.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-small text-muted-foreground">Bio / Description</Label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => updateTopLevel("bio", e.target.value)}
                  className="mt-2 w-full p-3 rounded-2xl border-2 border-border bg-background min-h-[100px] resize-none"
                  placeholder="Tell the community about yourself..."
                />
              </div>
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Leaf className="icon-sm text-primary" />
              Farmer Identity
            </h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Farmer Level</Label>
              <div className="flex gap-2 mt-2">
                {["beginner", "pro"].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSetting("farmerIdentity", "level", level)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.farmerIdentity.level === level
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Farm Size</Label>
              <div className="flex gap-2 mt-2">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting("farmerIdentity", "farmSize", size)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.farmerIdentity.farmSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Farming Type</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "organic", label: "Organic" },
                  { value: "conventional", label: "Conventional" },
                  { value: "mixed", label: "Mixed" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateSetting("farmerIdentity", "farmingType", type.value)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.farmerIdentity.farmingType === type.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Primary Crops</Label>
              <p className="text-xs text-muted-foreground mb-2">Select multiple crops you grow</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["wheat", "rice", "corn", "cotton", "sugarcane", "vegetables"].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => {
                      const current = settings.farmerIdentity.primaryCrops || []
                      const updated = current.includes(crop) ? current.filter((c) => c !== crop) : [...current, crop]
                      updateSetting("farmerIdentity", "primaryCrops", updated)
                    }}
                    className={`py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.farmerIdentity.primaryCrops?.includes(crop)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Login & Security */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Lock className="icon-sm text-primary" />
              Login & Security
            </h3>

            <button className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <Key className="icon-sm text-muted-foreground" />
                <span className="font-medium">Change Password</span>
              </div>
              <ChevronRight className="icon-sm text-muted-foreground" />
            </button>

            <div className="flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="icon-sm text-muted-foreground" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Add extra security</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <TrendingUp className="icon-md text-primary" />
            Farmer Level & Progress
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Level Management</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors">
                <div>
                  <div className="font-medium">Auto Level-Up</div>
                  <div className="text-xs text-muted-foreground">Automatically advance when ready</div>
                </div>
                <Switch
                  checked={settings.levelProgress.autoLevelUp}
                  onCheckedChange={(checked) => updateSetting("levelProgress", "autoLevelUp", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors">
                <div>
                  <div className="font-medium">Show Progress Bar</div>
                  <div className="text-xs text-muted-foreground">Display XP progress to next level</div>
                </div>
                <Switch
                  checked={settings.levelProgress.showProgressBar}
                  onCheckedChange={(checked) => updateSetting("levelProgress", "showProgressBar", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors">
                <div>
                  <div className="font-medium">Show Skills Publicly</div>
                  <div className="text-xs text-muted-foreground">Let others see your acquired skills</div>
                </div>
                <Switch
                  checked={settings.levelProgress.showSkillsPublicly}
                  onCheckedChange={(checked) => updateSetting("levelProgress", "showSkillsPublicly", checked)}
                />
              </div>

              <button
                onClick={() => showSuccessToast("Level reassessment request sent")}
                className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-colors border-2 border-border"
              >
                <div className="flex items-center gap-3">
                  <Award className="icon-sm text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Request Level Reassessment</div>
                    <div className="text-xs text-muted-foreground">Update your farmer level status</div>
                  </div>
                </div>
                <ChevronRight className="icon-sm text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Notification Preferences */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Bell className="icon-md text-primary" />
            Notification Preferences
          </h2>

          {/* Quest Notifications */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Quest & Learning Notifications</h3>

            <div className="space-y-3">
              {[
                { key: "questReminders", label: "Quest Reminders", desc: "Get notified about pending quests" },
                { key: "pushQuestComplete", label: "Quest Completions", desc: "Celebration notifications" },
                { key: "pushNewContent", label: "New Content Available", desc: "Fresh quests and modules" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.notifications[item.key]}
                    onCheckedChange={(checked) => updateSetting("notifications", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Progress Updates</h3>

            <div className="space-y-3">
              {[
                { key: "progressUpdates", label: "Progress Updates", desc: "Track your learning journey" },
                { key: "weeklyReports", label: "Weekly Progress Reports", desc: "Summary of your learning" },
                { key: "levelUpNotifications", label: "Level-Up Notifications", desc: "Celebrate milestones" },
                { key: "streakReminders", label: "Streak Maintenance", desc: "Keep your streak alive" },
                { key: "leaderboardUpdates", label: "Leaderboard Position", desc: "Track your ranking" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.notifications[item.key]}
                    onCheckedChange={(checked) => updateSetting("notifications", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Community Alerts</h3>

            <div className="space-y-3">
              {[
                { key: "pushFriendActivity", label: "Friend Activity", desc: "What your friends are learning" },
                { key: "friendRequests", label: "Friend Requests", desc: "New connection requests" },
                { key: "communityChallenge", label: "Community Challenges", desc: "New challenges available" },
                { key: "mentorMessages", label: "Mentor Messages", desc: "Messages from mentors" },
                { key: "communityMentions", label: "Mentions & Replies", desc: "When someone tags you" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.notifications[item.key]}
                    onCheckedChange={(checked) => updateSetting("notifications", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">System & Farming Alerts</h3>

            <div className="space-y-3">
              {[
                { key: "announcements", label: "Platform Announcements", desc: "Updates and new features" },
                { key: "weatherWarnings", label: "Weather Warnings", desc: "Important weather alerts" },
                { key: "marketPriceUpdates", label: "Market Price Updates", desc: "Crop price notifications" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.notifications[item.key]}
                    onCheckedChange={(checked) => updateSetting("notifications", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Data */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Shield className="icon-md text-primary" />
            Privacy & Community
          </h2>

          {/* Privacy Settings */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Eye className="icon-sm text-primary" />
              Profile Visibility
            </h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Profile Visibility</Label>
              <div className="flex gap-2 mt-2">
                {["public", "private", "friends"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("privacy", "profileVisibility", option)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.privacy.profileVisibility === option
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "showRealName", label: "Show Real Name", desc: "Display your actual name publicly" },
                { key: "showFarmingLevel", label: "Show Farming Level", desc: "Display your beginner/pro status" },
                { key: "showCompletedQuests", label: "Show Completed Quests", desc: "Display quest history" },
                { key: "activityVisible", label: "Activity Visibility", desc: "Show what you're working on" },
                { key: "showProgress", label: "Show Learning Progress", desc: "Display XP and badges publicly" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.privacy[item.key]}
                    onCheckedChange={(checked) => updateSetting("privacy", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Activity Sharing</h3>

            <div className="space-y-3">
              {[
                { key: "shareQuestCompletions", label: "Share Quest Completions", desc: "Post to community feed" },
                { key: "displayBadgesPublicly", label: "Display Badges Publicly", desc: "Show earned badges" },
                { key: "showProgressStats", label: "Show Progress Statistics", desc: "Display learning metrics" },
                {
                  key: "communityFeedParticipation",
                  label: "Community Feed Participation",
                  desc: "Appear in community activities",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.privacy[item.key]}
                    onCheckedChange={(checked) => updateSetting("privacy", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Data Privacy</h3>

            <div className="space-y-3">
              {[
                {
                  key: "anonymousDataSharing",
                  label: "Anonymous Data Sharing",
                  desc: "Help improve the platform anonymously",
                },
                {
                  key: "researchParticipation",
                  label: "Research Participation",
                  desc: "Contribute to farming research studies",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.privacy[item.key]}
                    onCheckedChange={(checked) => updateSetting("privacy", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Data Management</h3>

            <button
              onClick={handleDownloadData}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-2xl transition-colors text-left"
            >
              <Download className="icon-sm text-primary" />
              <div>
                <div className="font-medium">Download My Data</div>
                <div className="text-xs text-muted-foreground">Export all your information</div>
              </div>
            </button>

            <button
              onClick={handleClearHistory}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-2xl transition-colors text-left"
            >
              <Trash2 className="icon-sm text-muted-foreground" />
              <div>
                <div className="font-medium">Clear Search History</div>
                <div className="text-xs text-muted-foreground">Remove all search records</div>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-destructive/10 rounded-2xl transition-colors text-left text-destructive"
            >
              <Trash2 className="icon-sm" />
              <div>
                <div className="font-medium">Delete Account</div>
                <div className="text-xs">Permanently remove your account</div>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "Mali, cursive" }}>
            <Users className="icon-md text-primary" />
            Community & Social
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Social Features</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Friend Request Permissions</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "everyone", label: "Everyone" },
                  { value: "friends-of-friends", label: "Friends of Friends" },
                  { value: "nobody", label: "Nobody" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("community", "friendRequestPermissions", option.value)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all text-sm ${
                      settings.community.friendRequestPermissions === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Message Permissions</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "everyone", label: "Everyone" },
                  { value: "friends", label: "Friends Only" },
                  { value: "nobody", label: "Nobody" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("community", "messagePermissions", option.value)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.community.messagePermissions === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "onlineStatusDisplay", label: "Show Online Status", desc: "Let others see when you're active" },
                {
                  key: "activityStatusSharing",
                  label: "Share Activity Status",
                  desc: "Show what you're currently doing",
                },
                { key: "showContactInfo", label: "Show Contact Information", desc: "Display phone/email to friends" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.community[item.key]}
                    onCheckedChange={(checked) => updateSetting("community", item.key, checked)}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Profile Discovery</Label>
              <div className="flex gap-2 mt-2">
                {["public", "limited", "private"].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("community", "profileDiscoverySettings", option)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.community.profileDiscoverySettings === option
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Application Preferences */}
        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "Mali, cursive" }}>
            <Palette className="icon-md text-primary" />
            Application Preferences
          </h2>

          {/* Display & Language */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold flex items-center gap-2">
              <Globe className="icon-sm text-primary" />
              Display & Language
            </h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Language</Label>
              <select
                value={settings.app.language}
                onChange={(e) => updateSetting("app", "language", e.target.value)}
                className="w-full mt-2 p-3 rounded-2xl border-2 border-border bg-background"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="punjabi">Punjabi</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="marathi">Marathi</option>
              </select>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Theme Preference</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "auto", icon: Monitor, label: "Auto" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("app", "theme", option.value)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.app.theme === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <option.icon className="icon-md" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Font Size</Label>
              <div className="flex gap-2 mt-2">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting("app", "fontSize", size)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.app.fontSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Accessibility</h3>

            <div className="space-y-3">
              {[
                { key: "highContrast", label: "High Contrast Mode", desc: "Increase color contrast" },
                { key: "reducedAnimations", label: "Reduced Animations", desc: "Minimize motion effects" },
                { key: "screenReader", label: "Screen Reader Optimizations", desc: "Enhanced accessibility" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.app[item.key]}
                    onCheckedChange={(checked) => updateSetting("app", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Performance</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Image Quality</Label>
              <div className="flex gap-2 mt-2">
                {["low", "medium", "high"].map((quality) => (
                  <button
                    key={quality}
                    onClick={() => updateSetting("app", "imageQuality", quality)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.app.imageQuality === quality
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "dataSavingMode",
                  label: "Data Saving Mode",
                  desc: "Reduce data usage for mobile connections",
                },
                { key: "autoDownloadUpdates", label: "Auto-Download Updates", desc: "Update app automatically" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.app[item.key]}
                    onCheckedChange={(checked) => updateSetting("app", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Navigation</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Default Landing Page</Label>
              <div className="flex gap-2 mt-2">
                {["dashboard", "quests", "community"].map((page) => (
                  <button
                    key={page}
                    onClick={() => updateSetting("app", "defaultLandingPage", page)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.app.defaultLandingPage === page
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <Leaf className="icon-md text-primary" />
            Farming Preferences
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Measurement Units & Regional Settings</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Measurement Units</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "metric", label: "Metric (kg, L)" },
                  { value: "imperial", label: "Imperial (lb, gal)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("farm", "units", option.value)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.farm.units === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Default Farm View</Label>
              <div className="flex gap-2 mt-2">
                {["grid", "list"].map((view) => (
                  <button
                    key={view}
                    onClick={() => updateSetting("farm", "farmView", view)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.farm.farmView === view
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Farming Alerts</h3>

            <div className="space-y-3">
              {[
                {
                  key: "plantingSeasonReminders",
                  label: "Planting Season Reminders",
                  desc: "Get notified when it's time to plant",
                },
                {
                  key: "harvestTimeNotifications",
                  label: "Harvest Time Notifications",
                  desc: "Alerts for optimal harvest timing",
                },
                {
                  key: "weatherAlertSubscription",
                  label: "Weather Alert Subscription",
                  desc: "Important weather updates for your area",
                },
                {
                  key: "seasonalNotifications",
                  label: "Seasonal Notifications",
                  desc: "Get farming tips for each season",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.farm[item.key]}
                    onCheckedChange={(checked) => updateSetting("farm", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Learning Preferences</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Preferred Content Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["video", "text", "images", "mixed"].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateSetting("learning", "preferredContentType", type)}
                    className={`py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.learning.preferredContentType === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Learning Pace</Label>
              <div className="flex gap-2 mt-2">
                {["slow", "medium", "fast"].map((pace) => (
                  <button
                    key={pace}
                    onClick={() => updateSetting("learning", "learningPace", pace)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.learning.learningPace === pace
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "tutorialAutoPlay", label: "Tutorial Auto-Play", desc: "Automatically play tutorial videos" },
                { key: "stepByStepGuides", label: "Step-by-Step Guides", desc: "Show detailed instructions" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.learning[item.key]}
                    onCheckedChange={(checked) => updateSetting("learning", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "Mali, cursive" }}>
            <Target className="icon-md text-primary" />
            Quest & Game Preferences
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Quest Management</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Daily Quest Limit</Label>
              <div className="flex gap-2 mt-2">
                {[1, 3, 5, 10].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => updateSetting("game", "dailyQuestLimit", limit)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.game.dailyQuestLimit === limit
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Quest Suggestion Frequency</Label>
              <div className="flex gap-2 mt-2">
                {["hourly", "daily", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => updateSetting("game", "questSuggestionFrequency", freq)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.game.questSuggestionFrequency === freq
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors">
              <div>
                <div className="font-medium">Auto-Quest Assignment</div>
                <div className="text-xs text-muted-foreground">Automatically assign suggested quests</div>
              </div>
              <Switch
                checked={settings.game.autoQuestAssignment}
                onCheckedChange={(checked) => updateSetting("game", "autoQuestAssignment", checked)}
              />
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Reward Settings</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Reward Notification Style</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { value: "minimal", label: "Minimal" },
                  { value: "full", label: "Full Celebration" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSetting("game", "rewardNotificationStyle", option.value)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium transition-all ${
                      settings.game.rewardNotificationStyle === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Point Display Preference</Label>
              <div className="flex gap-2 mt-2">
                {["visible", "hidden", "summary"].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => updateSetting("game", "pointDisplayPreference", pref)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.game.pointDisplayPreference === pref
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "badgeAnimations", label: "Badge Animations", desc: "Animated badge unlock effects" },
                { key: "celebrationEffects", label: "Celebration Effects", desc: "Confetti and visual celebrations" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.game[item.key]}
                    onCheckedChange={(checked) => updateSetting("game", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Challenge Preferences</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Challenge Difficulty</Label>
              <div className="flex gap-2 mt-2">
                {["easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => updateSetting("game", "challengeDifficulty", diff)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.game.challengeDifficulty === diff
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Leaderboard Visibility</Label>
              <div className="flex gap-2 mt-2">
                {["public", "friends", "hidden"].map((vis) => (
                  <button
                    key={vis}
                    onClick={() => updateSetting("game", "leaderboardVisibility", vis)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.game.leaderboardVisibility === vis
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {vis}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "competitionParticipation",
                  label: "Competition Participation",
                  desc: "Join competitive challenges",
                },
                { key: "teamQuestPreferences", label: "Team Quest Preferences", desc: "Participate in team quests" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.game[item.key]}
                    onCheckedChange={(checked) => updateSetting("game", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sound & Game Effects */}
          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Sound & Effects</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Sound Effects Volume</Label>
              <div className="flex items-center gap-4 mt-3">
                <Slider
                  value={[settings.game.soundEffects]}
                  max={100}
                  step={10}
                  onValueChange={(value) => updateSetting("game", "soundEffects", value[0])}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{settings.game.soundEffects}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors">
              <div>
                <div className="font-medium">Background Music</div>
                <div className="text-xs text-muted-foreground">Play ambient farm sounds</div>
              </div>
              <Switch
                checked={settings.game.backgroundMusic}
                onCheckedChange={(checked) => updateSetting("game", "backgroundMusic", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 font-bold flex items-center gap-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <HelpCircle className="icon-md text-primary" />
            Support & Help
          </h2>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Help Preferences</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Tooltip Frequency</Label>
              <div className="flex gap-2 mt-2">
                {["minimal", "normal", "detailed"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => updateSetting("support", "tooltipFrequency", freq)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.support.tooltipFrequency === freq
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Support Contact Method</Label>
              <div className="flex gap-2 mt-2">
                {["chat", "email", "phone"].map((method) => (
                  <button
                    key={method}
                    onClick={() => updateSetting("support", "supportContactMethod", method)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.support.supportContactMethod === method
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "inAppTutorials", label: "In-App Tutorials", desc: "Show helpful onboarding guides" },
                {
                  key: "helpArticleSuggestions",
                  label: "Help Article Suggestions",
                  desc: "Suggest relevant help content",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.support[item.key]}
                    onCheckedChange={(checked) => updateSetting("support", item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 space-y-4 shadow-[0_2px_8px_rgba(107,166,115,0.08)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12)] transition-all">
            <h3 className="text-h4 font-semibold">Feedback Settings</h3>

            <div>
              <Label className="text-small text-muted-foreground mb-2">Feedback Frequency</Label>
              <div className="flex gap-2 mt-2">
                {["never", "monthly", "quarterly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => updateSetting("support", "feedbackFrequency", freq)}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 font-medium capitalize transition-all ${
                      settings.support.feedbackFrequency === freq
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "surveyParticipation", label: "Survey Participation", desc: "Help improve the platform" },
                { key: "appRatingReminders", label: "App Rating Reminders", desc: "Remind me to rate the app" },
                { key: "bugReportPreferences", label: "Bug Report Preferences", desc: "Enable bug reporting" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-2xl transition-colors"
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch
                    checked={settings.support[item.key]}
                    onCheckedChange={(checked) => updateSetting("support", item.key, checked)}
                  />
                </div>
              ))}
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
                <h3 className="text-h4 font-bold">Delete Account?</h3>
                <p className="text-small text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-small">
              All your data, including quests, progress, and community posts will be permanently deleted. Are you sure
              you want to proceed?
            </p>

            <div className="flex gap-3">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1 rounded-2xl">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl"
              >
                Delete Account
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
