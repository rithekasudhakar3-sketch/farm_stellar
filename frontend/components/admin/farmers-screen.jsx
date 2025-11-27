"use client"

import { useState } from "react"
import { ArrowLeft, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AdminFarmersScreen({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [farmers] = useState([
    // { id: 1, name: "Raj Kumar", district: "Patiala", xp: 150, level: 3, experience: "Intermediate" },
    { id: 2, name: "Priya Singh", district: "Ludhiana", xp: 200, level: 4, experience: "Advanced" },
    { id: 3, name: "Amit Verma", district: "Amritsar", xp: 80, level: 2, experience: "Beginner" },
    // { id: 4, name: "Sunita Kaur", district: "Jalandhar", xp: 120, level: 3, experience: "Intermediate" },
  ])

  const filteredFarmers = farmers.filter((farmer) => farmer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Farmers Management</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmers..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">District</th>
                  <th className="text-left p-4 font-semibold">Experience</th>
                  <th className="text-left p-4 font-semibold">XP</th>
                  <th className="text-left p-4 font-semibold">Level</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{farmer.name}</td>
                    <td className="p-4 text-muted-foreground">{farmer.district}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {farmer.experience}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{farmer.xp}</td>
                    <td className="p-4 text-muted-foreground">{farmer.level}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
