"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, X, MessageSquare, ImageIcon, Video, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminVerificationScreen({ onBack }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [showImageModal, setShowImageModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('farmquest_admin_token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const response = await fetch(`${backendUrl}/api/admin/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data = await response.json()
      setSubmissions(data.submissions || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('farmquest_admin_token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const response = await fetch(`${backendUrl}/api/admin/submissions/${submissionId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to approve submission')
      }

      // Remove from list after successful approval
      setSubmissions(submissions.filter((s) => s._id !== submissionId))
      setSelectedSubmission(null)
      setFeedback("")
      setActionLoading(false)
    } catch (err) {
      console.error('Error approving submission:', err)
      alert('Failed to approve submission: ' + err.message)
      setActionLoading(false)
    }
  }

  const handleReject = async (submissionId) => {
    if (!feedback.trim()) {
      alert("Please provide feedback before rejecting")
      return
    }

    try {
      setActionLoading(true)
      const token = localStorage.getItem('farmquest_admin_token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const response = await fetch(`${backendUrl}/api/admin/submissions/${submissionId}/reject`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      })

      if (!response.ok) {
        throw new Error('Failed to reject submission')
      }

      // Remove from list after successful rejection
      setSubmissions(submissions.filter((s) => s._id !== submissionId))
      setSelectedSubmission(null)
      setFeedback("")
      setActionLoading(false)
    } catch (err) {
      console.error('Error rejecting submission:', err)
      alert('Failed to reject submission: ' + err.message)
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4 shadow-sm">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-xl transition-colors" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Verification Queue</h1>
          <span className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm">
            {submissions.length} Pending
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Error: {error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-accent" />
            </div>
            <p className="text-xl font-bold text-foreground mb-2">All Caught Up!</p>
            <p className="text-sm text-muted-foreground">No pending submissions to verify at the moment.</p>
          </div>
        ) : (
          submissions.map((submission) => {
            const farmerName = submission.userId?.name || 'Unknown Farmer'
            const farmerPhone = submission.userId?.phone || 'N/A'
            const questName = submission.questId || 'Unknown Quest'
            const submittedTime = submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'Unknown'
            const proofType = submission.proofType || 'photo'
            const proofUrl = submission.proofUrl || '/placeholder.svg'
            const description = submission.description || 'No description provided'

            return (
              <div
                key={submission._id}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Proof Preview */}
                  <div className="w-full md:w-64 flex-shrink-0">
                    <div
                      className="relative aspect-video bg-muted rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setShowImageModal(true)
                      }}
                    >
                      <img
                        src={proofUrl}
                        alt="Proof submission"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-white text-xs font-medium flex items-center gap-1">
                        {proofType === "photo" && <ImageIcon className="w-3 h-3" />}
                        {proofType === "video" && <Video className="w-3 h-3" />}
                        {proofType}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">{questName}</h3>
                      <p className="text-sm text-muted-foreground">{submission.stepName || 'Quest submission'}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Farmer:</span>{" "}
                        <span className="font-medium text-foreground">{farmerName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span className="font-medium text-foreground">{farmerPhone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>{" "}
                        <span className="font-medium text-foreground">{submittedTime}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Farmer's Notes:</p>
                      <p className="text-sm text-foreground">{description}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="default"
                        className="bg-accent hover:bg-accent/90 text-white"
                        onClick={() => handleApprove(submission._id)}
                        disabled={actionLoading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve Submission
                      </Button>
                      <Button
                        size="default"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white bg-transparent"
                        onClick={() => setSelectedSubmission(submission)}
                        disabled={actionLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Request Resubmission
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                {selectedSubmission?._id === submission._id && !showImageModal && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Feedback (required for rejection)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Please provide specific feedback on why this submission needs improvement..."
                      className="w-full p-4 rounded-xl border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={4}
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(submission._id)}
                        disabled={!feedback.trim() || actionLoading}
                      >
                        {actionLoading ? 'Processing...' : 'Send Feedback & Request Resubmission'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedSubmission(null)
                          setFeedback("")
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-5xl w-full">
            <img
              src={selectedSubmission.proofUrl || "/placeholder.svg"}
              alt="Full size proof"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
