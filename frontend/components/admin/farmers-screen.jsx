"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, X, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function AdminFarmersScreen({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('farmquest_admin_token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const response = await fetch(`${backendUrl}/api/admin/farmers?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch farmers')
      }

      const data = await response.json()
      setFarmers(data.farmers || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching farmers:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const filteredFarmers = farmers.filter((farmer) => 
    farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleView = (farmer) => {
    setSelectedFarmer(farmer)
    setViewDialogOpen(true)
  }

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer)
    setEditFormData({
      name: farmer.name || '',
      email: farmer.email || '',
      phone: farmer.phone || '',
      city: farmer.city || farmer.location || '',
      level: farmer.level || 'beginner',
      xp: farmer.xp || 0
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      setSaveLoading(true)
      const token = localStorage.getItem('farmquest_admin_token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const response = await fetch(`${backendUrl}/api/admin/farmers/${selectedFarmer._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      if (!response.ok) {
        throw new Error('Failed to update farmer')
      }

      // Refresh farmers list
      await fetchFarmers()
      setEditDialogOpen(false)
      setSaveLoading(false)
    } catch (err) {
      console.error('Error updating farmer:', err)
      alert('Failed to update farmer: ' + err.message)
      setSaveLoading(false)
    }
  }

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

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
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Level</th>
                  <th className="text-left p-4 font-semibold">XP</th>
                  <th className="text-left p-4 font-semibold">Quests</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-muted-foreground">
                      Loading farmers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-destructive">
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-muted-foreground">
                      No farmers found
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <tr key={farmer._id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground">{farmer.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{farmer.city || farmer.location || 'N/A'}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
                          {farmer.level || 'beginner'}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{farmer.xp || 0}</td>
                      <td className="p-4 text-muted-foreground">{farmer.questsProgress?.filter(q => q.status === 'completed').length || 0}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(farmer)}>
                            View
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(farmer)}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Farmer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Farmer Details</DialogTitle>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedFarmer.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedFarmer.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedFarmer.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedFarmer.city || selectedFarmer.location || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Level</Label>
                  <p className="font-medium capitalize">{selectedFarmer.level || 'beginner'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">XP</Label>
                  <p className="font-medium">{selectedFarmer.xp || 0}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Completed Quests</Label>
                  <p className="font-medium">{selectedFarmer.questsProgress?.filter(q => q.status === 'completed').length || 0}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Quests</Label>
                  <p className="font-medium">{selectedFarmer.questsProgress?.length || 0}</p>
                </div>
              </div>
              
              {selectedFarmer.questsProgress && selectedFarmer.questsProgress.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Quest Progress</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 text-sm">Quest</th>
                          <th className="text-left p-2 text-sm">Status</th>
                          <th className="text-left p-2 text-sm">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFarmer.questsProgress.map((quest, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2 text-sm">{quest.questId}</td>
                            <td className="p-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                quest.status === 'completed' ? 'bg-green-100 text-green-700' :
                                quest.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {quest.status}
                              </span>
                            </td>
                            <td className="p-2 text-sm">{quest.currentStep || 0} / {quest.totalSteps || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Farmer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Farmer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ''}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => handleEditFormChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone || ''}
                onChange={(e) => handleEditFormChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-city">Location</Label>
              <Input
                id="edit-city"
                value={editFormData.city || ''}
                onChange={(e) => handleEditFormChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-level">Level</Label>
              <select
                id="edit-level"
                className="w-full p-2 border rounded-md"
                value={editFormData.level || 'beginner'}
                onChange={(e) => handleEditFormChange('level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-xp">XP</Label>
              <Input
                id="edit-xp"
                type="number"
                value={editFormData.xp || 0}
                onChange={(e) => handleEditFormChange('xp', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={saveLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saveLoading}>
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
