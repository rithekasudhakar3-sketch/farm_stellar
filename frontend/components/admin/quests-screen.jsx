"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AdminQuestsScreen({ onBack, t }) {
  const [quests, setQuests] = useState([
    { id: 1, title: "Soil Basics Quest", difficulty: "Beginner", xp: 50, completions: 145 },
    { id: 2, title: "Identify Local Crops", difficulty: "Beginner", xp: 60, completions: 132 },
    { id: 3, title: "Compost Starter", difficulty: "Beginner", xp: 45, completions: 98 },
  ])
  const [showModal, setShowModal] = useState(false)
  const [newQuest, setNewQuest] = useState({ title: "", description: "", difficulty: "Beginner", xp: 50 })

  const handleAddQuest = () => {
    setQuests([...quests, { id: Date.now(), ...newQuest, completions: 0 }])
    setNewQuest({ title: "", description: "", difficulty: "Beginner", xp: 50 })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.manageQuests') || "Quest Management"}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <Button onClick={() => setShowModal(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          {t('admin.addNewQuest') || "Add New Quest"}
        </Button>

        <div className="grid gap-4">
          {quests.map((quest) => (
            <div key={quest.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{quest.title}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{quest.difficulty}</span>
                    <span>{quest.xp} XP</span>
                    <span>{quest.completions} {t('stats.completions') || "completions"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card rounded-2xl p-6 shadow-xl z-50">
            <h2 className="text-xl font-bold mb-4">{t('admin.addNewQuest') || "Add New Quest"}</h2>
            <div className="space-y-4">
              <div>
                <Label>{t('common.title') || "Title"}</Label>
                <Input
                  value={newQuest.title}
                  onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                  placeholder={t('admin.questTitle') || "Quest title"}
                />
              </div>
              <div>
                <Label>{t('common.description') || "Description"}</Label>
                <Textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  placeholder={t('admin.questDescription') || "Quest description"}
                />
              </div>
              <div>
                <Label>{t('admin.xpReward') || "XP Reward"}</Label>
                <Input
                  type="number"
                  value={newQuest.xp}
                  onChange={(e) => setNewQuest({ ...newQuest, xp: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddQuest} className="flex-1">
                  {t('common.add') || "Add Quest"}
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
