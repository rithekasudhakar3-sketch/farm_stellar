"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function FarmDetailsScreen({ onSuccess, onBack }) {
  const { t } = useTranslation()
  const [hasLand, setHasLand] = useState(true)

  const [farmDetails, setFarmDetails] = useState({
    farmName: "",
    location: "",
    landSize: "",
    soilType: "",
    waterSource: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!hasLand) {
      onSuccess({
        hasLand: false,
        farmName: "",
        location: "",
        landSize: "",
        soilType: "",
        waterSource: "",
      })
    } else {
      onSuccess({
        hasLand: true,
        ...farmDetails,
      })
    }
  }

  const handleNoLandToggle = (checked) => {
    setHasLand(!checked)
    if (checked) {
      setFarmDetails({
        farmName: "",
        location: "",
        landSize: "",
        soilType: "",
        waterSource: "",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-lg p-8 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("auth.tellUsAboutFarm")}</h2>
          <p className="text-sm text-muted-foreground">{t("auth.customizeExperience")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 border-2 border-border/50 hover:border-primary/30 transition-colors">
            <Checkbox id="noLand" checked={!hasLand} onCheckedChange={handleNoLandToggle} className="mt-1 h-5 w-5 border-2 border-black" />
            <div className="flex-1">
              <Label htmlFor="noLand" className="text-base font-medium cursor-pointer leading-relaxed text-foreground">
                {t("auth.noLandCheckbox")}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {t("auth.noLandDesc")}
              </p>
            </div>
          </div>

          {hasLand && (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmName">{t("auth.farmNameOptional")}</Label>
                <Input
                  id="farmName"
                  placeholder={t("auth.farmNamePlaceholder")}
                  value={farmDetails.farmName}
                  onChange={(e) => setFarmDetails({ ...farmDetails, farmName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t("auth.location")}</Label>
                <Input
                  id="location"
                  placeholder={t("auth.locationPlaceholder")}
                  value={farmDetails.location}
                  onChange={(e) => setFarmDetails({ ...farmDetails, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landSize">{t("auth.landSize")}</Label>
                <Input
                  id="landSize"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={farmDetails.landSize}
                  onChange={(e) => setFarmDetails({ ...farmDetails, landSize: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">{t("auth.soilType")}</Label>
                <Select
                  value={farmDetails.soilType}
                  onValueChange={(value) => setFarmDetails({ ...farmDetails, soilType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("auth.selectSoilType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">{t("quests.soilTypes.Clay")}</SelectItem>
                    <SelectItem value="sandy">{t("quests.soilTypes.Sandy")}</SelectItem>
                    <SelectItem value="loamy">{t("quests.soilTypes.Loam")}</SelectItem>
                    <SelectItem value="silty">{t("quests.soilTypes.Silty")}</SelectItem>
                    <SelectItem value="peaty">{t("auth.soilTypes.peaty")}</SelectItem>
                    <SelectItem value="chalky">{t("auth.soilTypes.chalky")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterSource">{t("auth.waterSource")}</Label>
                <Select
                  value={farmDetails.waterSource}
                  onValueChange={(value) => setFarmDetails({ ...farmDetails, waterSource: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("auth.selectWaterSource")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well">{t("auth.waterSources.well")}</SelectItem>
                    <SelectItem value="borewell">{t("auth.waterSources.borewell")}</SelectItem>
                    <SelectItem value="canal">{t("auth.waterSources.canal")}</SelectItem>
                    <SelectItem value="river">{t("auth.waterSources.river")}</SelectItem>
                    <SelectItem value="rainwater">{t("auth.waterSources.rainwater")}</SelectItem>
                    <SelectItem value="pond">{t("auth.waterSources.pond")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {!hasLand && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🌱</div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{t("auth.beginnerJourneyTitle")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("auth.beginnerJourneyDesc")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              {t("common.back")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("common.continue")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
