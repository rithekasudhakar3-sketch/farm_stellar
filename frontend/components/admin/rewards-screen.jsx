"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function AdminRewardsScreen({ onBack, t }) {
  const [rewards] = useState([
    { id: 1, name: "Seed Packet", points: 100, stock: 45 },
    { id: 2, name: "Organic Fertilizer", points: 200, stock: 23 },
    { id: 3, name: "Farming Tools Kit", points: 500, stock: 12 },
  ])

  const [showModal, setShowModal] = useState(false)
  const [xpAdjustment, setXpAdjustment] = useState([10])

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.manageRewards') || "Rewards Management"}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Button onClick={() => setShowModal(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          {t('admin.addNewReward') || "Add New Reward"}
        </Button>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">{t('admin.bulkXPAdjustment') || "Bulk XP Adjustment"}</h2>
          <div className="space-y-4">
            <div>
              <Label>{t('admin.xpMultiplier') || "XP Multiplier"}</Label>
              <Slider value={xpAdjustment} max={50} min={1} step={1} className="mt-2" onValueChange={setXpAdjustment} />
              <div className="text-sm text-muted-foreground mt-1">{xpAdjustment}x {t('admin.multiplier') || "multiplier"}</div>
            </div>
            <Button>{t('admin.applyToAllQuests') || "Apply to All Quests"}</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{reward.name}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>{reward.points} {t('common.points') || "points"}</span>
                <span>{reward.stock} {t('common.inStock') || "in stock"}</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                {t('admin.editReward') || "Edit Reward"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card rounded-2xl p-6 shadow-xl z-50">
            <h2 className="text-xl font-bold mb-4">{t('admin.addNewReward') || "Add New Reward"}</h2>
            <div className="space-y-4">
              <div>
                <Label>{t('admin.rewardName') || "Reward Name"}</Label>
                <Input placeholder={t('admin.enterRewardName') || "Enter reward name"} />
              </div>
              <div>
                <Label>{t('admin.pointsRequired') || "Points Required"}</Label>
                <Input type="number" placeholder="100" />
              </div>
              <div>
                <Label>{t('admin.stockQuantity') || "Stock Quantity"}</Label>
                <Input type="number" placeholder="50" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowModal(false)} className="flex-1">
                  {t('common.add') || "Add Reward"}
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  {t('common.cancel') || "Cancel"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
