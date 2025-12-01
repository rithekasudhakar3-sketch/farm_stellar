"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FARMER_TYPES } from "@/constants/app"

export function FarmerTypeSelectionScreen({ onSuccess, onBack }) {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState(null)

  const farmerTypes = [
    {
      type: FARMER_TYPES.BEGINNER,
      title: t("auth.beginnerFarmer"),
      description: t("auth.beginnerDesc"),
      icon: "🌱",
      color: "bg-green-100 border-green-300 text-green-700",
    },
    {
      type: FARMER_TYPES.PRO,
      title: t("auth.proFarmer"),
      description: t("auth.proDesc"),
      icon: "🌳",
      color: "bg-teal-100 border-teal-300 text-teal-700",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t("auth.experienceTitle")}</h2>
          <p className="text-muted-foreground">{t("auth.experienceDesc")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {farmerTypes.map((farmer) => (
            <Card
              key={farmer.type}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${selectedType === farmer.type ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                }`}
              onClick={() => setSelectedType(farmer.type)}
            >
              <div className="text-center space-y-3">
                <div className="text-5xl mb-2">{farmer.icon}</div>
                <h3 className="font-bold text-lg">{farmer.title}</h3>
                <p className="text-sm text-muted-foreground">{farmer.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            {t("common.back")}
          </Button>
          <Button onClick={() => onSuccess(selectedType)} disabled={!selectedType} className="flex-1">
            {t("common.continue")}
          </Button>
        </div>
      </div>
    </div>
  )
}
