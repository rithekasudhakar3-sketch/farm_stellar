"use client"

import { ChevronLeft, Camera, MessageSquare, CheckCircle2, X, MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"


export function SubmitProofScreen({ quest, onSubmit, onBack }) {
  const [notes, setNotes] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null) // { url, key, preview, location? }
 // { url, key, preview, location? }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [location, setLocation] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const showPhotoOption = quest?.id !== "crops"


  const canSubmit = uploadedImage !== null

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startCamera = async () => {
    try {
      console.log("Starting camera...")
      setIsCameraActive(true)
      
      // attempt to get location (best-effort)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained:", position.coords)
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            console.warn("Location not available:", error)
            // don't block camera if location fails
          },
          { maximumAge: 60_000, timeout: 5000 }
        )
      }

      const constraints = {
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }
      
      console.log("Requesting camera with constraints:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Camera stream obtained:", stream.getVideoTracks())

      streamRef.current = stream
      
      // Wait for video ref to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (videoRef.current) {
        console.log("Setting video srcObject")
        videoRef.current.srcObject = stream
        
        // Wait for metadata to load
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, playing...")
          videoRef.current.play().catch(err => {
            console.error("Video play error:", err)
            alert("Failed to start video preview: " + err.message)
          })
        }
      } else {
        console.error("Video ref is null!")
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check camera permissions.\nError: " + error.message)
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())

      streamRef.current = null
    }
    setIsCameraActive(false)

  }

  const capturePhoto = async () => {
    if (!videoRef.current) return
    setIsUploading(true)


    try {
      const video = videoRef.current

      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720

      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // create blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9))
      if (!blob) throw new Error("Failed to capture image")

      // preview data URL
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // create blob


      // preview data URL
      const preview = canvas.toDataURL("image/jpeg", 0.9)

      // read blob to base64

      // read blob to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {

          const token = localStorage.getItem("token")
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

          const uploadRes = await fetch(`${backendUrl}/api/uploads/proxy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : ""

            },
            body: JSON.stringify({
              mimeType: "image/jpeg",
              sizeBytes: blob.size,
              fileData: reader.result
            })
          })


          if (!uploadRes.ok) {
            const errText = await uploadRes.text().catch(() => "")
            throw new Error(errText || "Failed to upload photo")

          }

          const { key, url } = await uploadRes.json().catch(() => ({}))




          setUploadedImage({
            url: url || preview,
            key: key || null,
            preview,
            location

          })
        } catch (error) {
          console.error("Upload error:", error)
          alert("Failed to upload photo. Please try again.")

        } finally {
          setIsUploading(false)
          stopCamera()
          stopCamera()
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
    const file = e?.target?.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const uploadRes = await fetch(`${backendUrl}/api/uploads/proxy`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify({
              mimeType: file.type,
              sizeBytes: file.size,
              fileData: reader.result
            })
          })

          if (!uploadRes.ok) {
            const errText = await uploadRes.text().catch(() => "")
            throw new Error(errText || "Failed to upload file")
          }

          const { key, url } = await uploadRes.json().catch(() => ({}))

          setUploadedImage({
            url: url || reader.result,
            key: key || null,
            preview: reader.result
          })
        } catch (error) {
          console.error("Upload error:", error)
          alert("Failed to upload image. Please try again.")
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image. Please try again.")
      setIsUploading(false)
      const file = e?.target?.files?.[0]
      if (!file) return

      setIsUploading(true)
      try {
        const token = localStorage.getItem("token")
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            const uploadRes = await fetch(`${backendUrl}/api/uploads/proxy`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
              },
              body: JSON.stringify({
                mimeType: file.type,
                sizeBytes: file.size,
                fileData: reader.result
              })
            })

            if (!uploadRes.ok) {
              const errText = await uploadRes.text().catch(() => "")
              throw new Error(errText || "Failed to upload file")
            }

            const { key, url } = await uploadRes.json().catch(() => ({}))

            setUploadedImage({
              url: url || reader.result,
              key: key || null,
              preview: reader.result
            })
          } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image. Please try again.")
          } finally {
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

    const handleSubmit = async () => {
      if (!onSubmit) return
      if (!onSubmit) return
      setIsSubmitting(true)


      try {
        const token = localStorage.getItem("token")
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

        const questId = quest?._id || quest?.id || quest?.slug
      
        if (!questId) {
          throw new Error("Quest ID is missing")
        }

        console.log('Submitting proof for quest:', questId, quest)

        // Step 1: Send photo to verification endpoint if we have verification_data
        let verificationResult = null
        if (uploadedImage && quest?.verification_data) {
          try {
            console.log('Sending to verification endpoint:', quest.verification_data)
          
            // Prepare verification payload
            const verificationPayload = {
              task_name: quest.verification_data.task_name,
              success_criteria: quest.verification_data.success_criteria,
              use_before_image: quest.verification_data.use_before_image || false,
              image_url: uploadedImage.url || uploadedImage.preview
            }

            console.log('Verification payload:', verificationPayload)

            const verifyResponse = await fetch('http://127.0.0.1:8000/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(verificationPayload)
            })

            if (verifyResponse.ok) {
              verificationResult = await verifyResponse.json()
              console.log('Verification result:', verificationResult)
            } else {
              console.warn('Verification endpoint returned error:', verifyResponse.status)
            }
          } catch (verifyError) {
            console.warn('Verification endpoint not available:', verifyError)
            // Continue with submission even if verification fails
          }
        }

        // Step 2: Submit to backend as normal
        const submissionData = {
          questId: questId,
          proofType: uploadedImage ? "photo" : "text",
          proofUrl: uploadedImage?.url || "",
          description: notes || "Quest completed as per instructions",
          status: "pending"
        }

        // Only add media if we have a valid S3 key
        if (uploadedImage?.key) {
          submissionData.media = [
            {
              key: uploadedImage.key,
              mimeType: "image/jpeg",
              sizeBytes: uploadedImage.sizeBytes || 0
            }
          ]
        }

        // Add verification result if available
        if (verificationResult) {
          submissionData.verificationResult = verificationResult
        }

        console.log('Submission payload:', submissionData)

        const response = await fetch(`${backendUrl}/api/submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""

          },
          body: JSON.stringify(submissionData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Submission failed:", response.status, errorData)
          throw new Error(errorData.message || `Server error: ${response.status}`)
        }

        const result = await response.json()
        console.log("Submission successful:", result)

        // small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 500))
      
        // Pass verification result to parent
        onSubmit(verificationResult)
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
          <div className="w-9" />
          <div className="w-9" />
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

              {/* Camera View */}
              {isCameraActive ? (
                <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-primary">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ display: 'block', width: '100%', height: '24rem', objectFit: 'cover' }}
                    className="w-full h-96"
                    onLoadedMetadata={(e) => {
                      console.log('Video metadata loaded event', e.target.videoWidth, 'x', e.target.videoHeight)
                    }}
                    onPlay={() => console.log('Video playing')}
                    onError={(e) => console.error('Video error:', e)}
                  />
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
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
                <div className="space-y-2">
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

                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  
                  </label>
                </div>
              )}
            </div>
          )}

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
            className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${canSubmit && !isSubmitting
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
}
