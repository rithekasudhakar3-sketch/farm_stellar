"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const LOCATION_DATA = {
  "Kerala": {
    "Alappuzha": ["Kainakary", "Nedumudi", "Ramankary", "Champakulam", "Thakazhy"],
    "Malappuram": ["Vengara", "Parappanangadi", "Edappal", "Kuttippuram", "Perinthalmanna"],
    "Wayanad": ["Meenangadi", "Sulthan Bathery", "Ambalavayal", "Pulpally", "Noolpuzha"],
    "Kasaragod": ["Muliyar", "Kumbla", "Bedadka", "Cheruvathur", "Karadka"]
  },
  "Maharashtra": {
    "Nagpur": ["Kanhalgaon GP", "Khasarmari GP", "Kinhalmakadi GP", "Kirnapur GP", "Titur GP"]
  }
}

export function FarmDetailsScreen({ onSuccess, onBack }) {
  const [hasLand, setHasLand] = useState(true)

  const [farmDetails, setFarmDetails] = useState({
    farmName: "",
    state: "",
    district: "",
    panchayat: "",
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
        state: "",
        district: "",
        panchayat: "",
        landSize: "",
        soilType: "",
        waterSource: "",
        city: "", // For backward compatibility
        location: "" // For backward compatibility
      })
    } else {
      onSuccess({
        hasLand: true,
        ...farmDetails,
        city: farmDetails.district, // Map district to city for backward compatibility
        location: `${farmDetails.panchayat}, ${farmDetails.district}, ${farmDetails.state}` // Map to location string
      })
    }
  }

  const handleNoLandToggle = (checked) => {
    setHasLand(!checked)
    if (checked) {
      setFarmDetails({
        farmName: "",
        state: "",
        district: "",
        panchayat: "",
        landSize: "",
        soilType: "",
        waterSource: "",
      })
    }
  }

  const handleStateChange = (value) => {
    setFarmDetails({
      ...farmDetails,
      state: value,
      district: "",
      panchayat: ""
    })
  }

  const handleDistrictChange = (value) => {
    setFarmDetails({
      ...farmDetails,
      district: value,
      panchayat: ""
    })
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Tell Us About Your Farm</h2>
          <p className="text-sm text-muted-foreground">Help us customize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 border-2 border-border/50 hover:border-primary/30 transition-colors">
            <Checkbox id="noLand" checked={!hasLand} onCheckedChange={handleNoLandToggle} className="mt-1 h-5 w-5 border-2 border-black" />
            <div className="flex-1">
              <Label htmlFor="noLand" className="text-base font-medium cursor-pointer leading-relaxed text-foreground">
                I am a beginner and don't have a farm yet
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Start learning the basics. You can add farm details later from your profile settings.
              </p>
            </div>
          </div>

          {hasLand && (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name (Optional)</Label>
                <Input
                  id="farmName"
                  placeholder="Green Valley Farm"
                  value={farmDetails.farmName}
                  onChange={(e) => setFarmDetails({ ...farmDetails, farmName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={farmDetails.state}
                    onValueChange={handleStateChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(LOCATION_DATA).map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={farmDetails.district}
                    onValueChange={handleDistrictChange}
                    disabled={!farmDetails.state}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmDetails.state && Object.keys(LOCATION_DATA[farmDetails.state]).map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="panchayat">Panchayat</Label>
                <Select
                  value={farmDetails.panchayat}
                  onValueChange={(value) => setFarmDetails({ ...farmDetails, panchayat: value })}
                  disabled={!farmDetails.district}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmDetails.state && farmDetails.district && LOCATION_DATA[farmDetails.state][farmDetails.district].map((panchayat) => (
                      <SelectItem key={panchayat} value={panchayat}>{panchayat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size (in acres)</Label>
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
                <Label htmlFor="soilType">Soil Type</Label>
                <Select
                  value={farmDetails.soilType}
                  onValueChange={(value) => setFarmDetails({ ...farmDetails, soilType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterSource">Water Source</Label>
                <Select
                  value={farmDetails.waterSource}
                  onValueChange={(value) => setFarmDetails({ ...farmDetails, waterSource: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well">Well</SelectItem>
                    <SelectItem value="borewell">Borewell</SelectItem>
                    <SelectItem value="canal">Canal</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="rainwater">Rainwater Harvesting</SelectItem>
                    <SelectItem value="pond">Pond</SelectItem>
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
                  <p className="text-sm font-medium text-foreground mb-1">Perfect! Let's start your farming journey</p>
                  <p className="text-xs text-muted-foreground">
                    You'll access knowledge-based quests and tutorials. When you're ready to start your own farm, you
                    can add the details anytime from your profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
