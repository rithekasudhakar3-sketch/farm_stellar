"use client"

import { ChevronLeft, Camera, MessageSquare, CheckCircle2, X, MapPin } from "lucide-react"
import { useState, useRef } from "react"

export function SubmitProofScreen({ quest, onSubmit, onBack }) {
  const [checkedItems, setCheckedItems] = useState([false, false, false])
  const [notes, setNotes] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const showPhotoOption = quest.id !== "crops"

  const toggleCheck = (index) => {
    const newChecked = [...checkedItems]
    newChecked[index] = !newChecked[index]
    setCheckedItems(newChecked)
  }

  const canSubmit = quest.id === "crops" ? checkedItems.some(Boolean) : checkedItems.every(Boolean)

  const startCamera = async () => {
    try {
      setShowCamera(true)
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            console.error("Location error:", error)
            alert("Unable to get location. Please enable location services.")
          }
        )
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert("Unable to access camera. Please check permissions.")
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = async () => {
    if (!videoRef.current) return
    
    setIsUploading(true)
    
    try {
      // Create canvas to capture photo
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      ctx.drawImage(videoRef.current, 0, 0)
      
      // Convert to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9))
      
      // Create preview
      const preview = canvas.toDataURL("image/jpeg", 0.9)
      
      // Upload to backend
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const uploadRes = await fetch(`${backendUrl}/api/uploads/proxy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              mimeType: "image/jpeg",
              sizeBytes: blob.size,
              fileData: reader.result
            })
          })
          
          if (!uploadRes.ok) {
            throw new Error("Failed to upload photo")
          }
          
          const { key, url } = await uploadRes.json()
          
          setUploadedImage({
            url: url,
            key: key,
            preview: preview,
            location: location
          })
          setIsUploading(false)
          stopCamera()
        } catch (error) {
          console.error("Upload error:", error)
          alert("Failed to upload photo. Please try again.")
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error("Capture error:", error)
      alert("Failed to capture photo. Please try again.")
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      
      try {
        const token = localStorage.getItem("token")
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        
        // Read file as base64 for preview
        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            // Upload through backend proxy (bypasses CORS)
            const uploadRes = await fetch(`${backendUrl}/api/uploads/proxy`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                mimeType: file.type,
                sizeBytes: file.size,
                fileData: reader.result
              })
            })
            
            if (!uploadRes.ok) {
              throw new Error("Failed to upload file")
            }
            
            const { key, url } = await uploadRes.json()
            
            setUploadedImage({
              url: url,
              key: key,
              preview: reader.result
            })
            setIsUploading(false)
          } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image. Please try again.")
            setIsUploading(false)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Upload error:", error)
        alert("Failed to upload image. Please try again.")
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
      
      // Create submission for admin review
      const response = await fetch(`${backendUrl}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          questId: quest.id,
          proofType: uploadedImage ? "photo" : "text",
          proofUrl: uploadedImage?.url || "",
          description: notes || "Quest completed as per instructions",
          status: "pending",
          media: uploadedImage ? [{
            key: uploadedImage.key,
            mimeType: "image/jpeg",
            sizeBytes: 0
          }] : []
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to submit proof")
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit()
    } catch (error) {
      console.error("Error submitting proof:", error)
      alert(`Failed to submit proof: ${error.message}. Please try again.`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Submit Proof</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6 pb-32">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Show Your Work</h2>
          <p className="text-sm text-muted-foreground">Submit evidence of quest completion</p>
        </div>

        {/* Upload Options */}
        {showPhotoOption && (
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-sm">Upload Media</h3>
            {showCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-96 object-cover rounded-2xl border-2 border-primary"
                />
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location ? "Location Tracked" : "Getting Location..."}
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={stopCamera}
                    className="bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={isUploading}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "📸 Capture"}
                  </button>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage.preview || uploadedImage.url}
                  alt="Uploaded proof"
                  className="w-full h-64 object-cover rounded-2xl border-2 border-primary"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Photo Ready!
                </div>
                {uploadedImage.location && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location: {uploadedImage.location.latitude.toFixed(4)}, {uploadedImage.location.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={startCamera}
                className="block w-full cursor-pointer"
              >
                <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <Camera className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Take Live Photo 📸</p>
                  <p className="text-xs text-muted-foreground mt-1">With GPS Location</p>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-3">
          <h3 className="font-bold text-foreground text-sm">Completion Checklist</h3>
          <div className="space-y-2">
            {["All steps completed", "Instructions followed correctly", "Quality of work is satisfactory"].map(
              (item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[idx]}
                    onChange={() => toggleCheck(idx)}
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ),
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <h3 className="font-bold text-foreground text-sm">Additional Notes</h3>
          <div className="relative">
            <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any challenges, discoveries, or insights from this quest..."
              className="w-full pl-10 pt-3 pr-4 pb-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Submit Button - Fixed at bottom for thumb reach */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-background via-background to-transparent border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${
            canSubmit && !isSubmitting
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Submitting...
            </span>
          ) : (
            "Submit for Review ✓"
          )}
        </button>
      </div>
    </div>
  )
}
