"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { PERMISSION_TYPES } from "@/constants/app"

export function PermissionsScreen({ onSuccess, onSkip, isLoading = false }) {
  const [permissions, setPermissions] = useState({
    [PERMISSION_TYPES.LOCATION]: false,
    [PERMISSION_TYPES.NOTIFICATIONS]: false,
    [PERMISSION_TYPES.CAMERA]: false,
  })

  const permissionDetails = [
    {
      type: PERMISSION_TYPES.LOCATION,
      title: "Location Access",
      description: "Get weather updates and local farming tips for your area",
      icon: "📍",
    },
    {
      type: PERMISSION_TYPES.NOTIFICATIONS,
      title: "Push Notifications",
      description: "Receive reminders for quests and important farming alerts",
      icon: "🔔",
    },
    {
      type: PERMISSION_TYPES.CAMERA,
      title: "Camera Access",
      description: "Upload photos of your farm progress and proof submissions",
      icon: "📷",
    },
  ]

  const handleContinue = () => {
    onSuccess(permissions)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-lg p-8 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enable Permissions</h2>
          <p className="text-sm text-muted-foreground">Grant access to enhance your FarmQuest experience</p>
        </div>

        <div className="space-y-4 mb-6">
          {permissionDetails.map((permission) => (
            <div
              key={permission.type}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                permissions[permission.type]
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-muted/30 border-border hover:border-primary/20'
              }`}
              onClick={() => setPermissions({ ...permissions, [permission.type]: !permissions[permission.type] })}
            >
              <span className="text-3xl">{permission.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{permission.title}</h3>
                <p className="text-sm text-muted-foreground">{permission.description}</p>
              </div>
              <Switch
                checked={permissions[permission.type]}
                onCheckedChange={(checked) => setPermissions({ ...permissions, [permission.type]: checked })}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Button onClick={handleContinue} className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Continue with Selected Permissions"}
          </Button>
          <Button variant="ghost" onClick={onSkip} className="w-full" disabled={isLoading}>
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  )
}
