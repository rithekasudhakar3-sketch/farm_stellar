"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export function AadharVerificationScreen({ onSuccess, onBack }) {
  const [aadhar, setAadhar] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [farmerData, setFarmerData] = useState(null)

  const handleFetchDetails = async () => {
    if (aadhar.length !== 12) return

    setIsFetching(true)
    // Simulate API call to fetch Aadhar details
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setFarmerData({
      name: "Rajesh Kumar",
      address: "Village Rampur, Dist. Bhopal, MP",
      dob: "15/06/1985",
    })
    setIsFetching(false)
  }

  const handleConfirm = async () => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSuccess({ number: aadhar, ...farmerData })
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
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Aadhar Verification</h2>
          <p className="text-sm text-muted-foreground">Enter your Aadhar number to verify your identity</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aadhar">Aadhar Number</Label>
            <Input
              id="aadhar"
              type="text"
              placeholder="1234 5678 9012"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value.replace(/\D/g, "").slice(0, 12))}
              required
              disabled={farmerData !== null}
            />
            {aadhar.length > 0 && aadhar.length !== 12 && (
              <p className="text-xs text-destructive">Please enter a valid 12-digit Aadhar number</p>
            )}
          </div>

          {!farmerData ? (
            <Button onClick={handleFetchDetails} className="w-full" disabled={aadhar.length !== 12 || isFetching}>
              {isFetching ? "Fetching Details..." : "Fetch Details"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{farmerData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{farmerData.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">{farmerData.dob}</p>
                </div>
              </div>

              <Button onClick={handleConfirm} className="w-full" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Confirm & Continue"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setFarmerData(null)
                  setAadhar("")
                }}
                className="w-full"
              >
                Edit Aadhar Number
              </Button>
            </div>
          )}

          <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
