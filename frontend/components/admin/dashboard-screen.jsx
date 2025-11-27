"use client"

import { useState } from "react"
import { Users, UserPlus, Activity, Target, Search, Eye, X, ChevronLeft } from "lucide-react"
import { SCREENS } from "@/constants/app"

export function AdminDashboardScreen({ onNavigate }) {
  const [selectedFarmer, setSelectedFarmer] = useState(null)

  const farmers = [
    // {
    //   id: 1,
    //   name: "Rajesh Kumar",
    //   experience: "Intermediate",
    //   district: "Bangalore Rural",
    //   crops: "Rice, Wheat",
    //   status: "Active",
    //   farmSize: "2.5 acres",
    //   fertilizers: "Urea, DAP",
    //   pesticides: "Chlorpyrifos",
    //   questsCompleted: 12,
    //   xp: 235,
    // },
    {
      id: 2,
      name: "Priya Sharma",
      experience: "Beginner",
      district: "Mysore",
      crops: "Finger Millet",
      status: "Active",
      farmSize: "1.8 acres",
      fertilizers: "Organic Compost",
      pesticides: "None",
      questsCompleted: 5,
      xp: 85,
    },
    {
      id: 3,
      name: "Suresh Reddy",
      experience: "Pro",
      district: "Tumkur",
      crops: "Paddy, Groundnut",
      status: "Inactive",
      farmSize: "4.2 acres",
      fertilizers: "NPK Mix",
      pesticides: "Cypermethrin",
      questsCompleted: 24,
      xp: 520,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-6 text-primary-foreground border-b border-border/20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
            <p className="text-sm opacity-90">Manage farmers and track progress</p>
          </div>
          <button
            onClick={() => onNavigate(SCREENS.HOME)}
            className="p-2 hover:bg-primary-foreground/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => onNavigate(SCREENS.ADMIN_FARMERS)}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all text-left"
          >
            <Users className="w-8 h-8 text-primary mb-3" />
            <p className="font-bold text-foreground">Manage Farmers</p>
            <p className="text-xs text-muted-foreground mt-1">View and manage farmer profiles</p>
          </button>

          <button
            onClick={() => onNavigate(SCREENS.ADMIN_QUESTS)}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all text-left"
          >
            <Target className="w-8 h-8 text-accent mb-3" />
            <p className="font-bold text-foreground">Manage Quests</p>
            <p className="text-xs text-muted-foreground mt-1">Create and edit quest content</p>
          </button>

          <button
            onClick={() => onNavigate(SCREENS.ADMIN_VERIFICATION)}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all text-left"
          >
            <Activity className="w-8 h-8 text-secondary mb-3" />
            <p className="font-bold text-foreground">Verify Activities</p>
            <p className="text-xs text-muted-foreground mt-1">Review farmer quest submissions</p>
          </button>

          <button
            onClick={() => onNavigate(SCREENS.ADMIN_REWARDS)}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all text-left"
          >
            <Target className="w-8 h-8 text-accent mb-3" />
            <p className="font-bold text-foreground">Manage Rewards</p>
            <p className="text-xs text-muted-foreground mt-1">Adjust XP and badge rewards</p>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">1,248</p>
            <p className="text-sm text-muted-foreground mt-1">Total Farmers</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">48</p>
            <p className="text-sm text-muted-foreground mt-1">New Signups (This Week)</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">892</p>
            <p className="text-sm text-muted-foreground mt-1">Active Users</p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">4,267</p>
            <p className="text-sm text-muted-foreground mt-1">Quests Completed</p>
          </div>
        </div>

        {/* Farmers List */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">Registered Farmers</h3>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Experience</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">District</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Crops</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{farmer.name}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block text-xs bg-accent/20 text-primary px-2 py-1 rounded-full font-medium">
                        {farmer.experience}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{farmer.district}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{farmer.crops}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                          farmer.status === "Active" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {farmer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedFarmer(farmer)}
                        className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Farmer Details Popup */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h3 className="font-bold text-foreground text-xl">Farmer Details</h3>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-bold text-foreground mb-3">Basic Information</h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Experience Level</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">District</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedFarmer.status === "Active" ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {selectedFarmer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div>
                <h4 className="font-bold text-foreground mb-3">Farm Details</h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Farm Size</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.farmSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Primary Crops</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.crops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fertilizers</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.fertilizers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pesticides</span>
                    <span className="text-sm font-medium text-foreground">{selectedFarmer.pesticides}</span>
                  </div>
                </div>
              </div>

              {/* Quest Progress */}
              <div>
                <h4 className="font-bold text-foreground mb-3">Quest Progress</h4>
                <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">{selectedFarmer.questsCompleted}</p>
                      <p className="text-xs text-muted-foreground mt-1">Quests Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{selectedFarmer.xp}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total XP</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h4 className="font-bold text-foreground mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {["Completed 'Soil Basics Quest'", "Started 'Compost Starter Quest'", "Updated farm details"].map(
                    (activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <p className="text-sm text-foreground flex-1">{activity}</p>
                        <span className="text-xs text-muted-foreground">{idx + 1}d ago</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
