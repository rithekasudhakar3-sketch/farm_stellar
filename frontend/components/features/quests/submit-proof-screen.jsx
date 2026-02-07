"use client"

import { ChevronLeft, Camera, MessageSquare, CheckCircle2, X, MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"


export function SubmitProofScreen({ quest, onSubmit, onBack }) {
  console.log("SubmitProofScreen rendered with quest:", quest)

  const [notes, setNotes] = useState("")
  const [uploadedImage, setUploadedImage] = useState(null) // { url, key, preview, location? }
  // { url, key, preview, location? }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [location, setLocation] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

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

      // attempt to get location (best-effort) with high accuracy
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained:", position.coords)
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            })
          },
          (error) => {
            console.warn("Location not available:", error)
            if (error.code === error.PERMISSION_DENIED) {
              alert("Location permission denied. Photos will be captured without GPS data. Please enable location access for better tracking.")
            }
            // don't block camera if location fails
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
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
      // Get fresh location right before capturing
      let captureLocation = location
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            })
          })
          captureLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }
          setLocation(captureLocation)
          console.log("Fresh location captured:", captureLocation)
        } catch (geoError) {
          console.warn("Could not get fresh location:", geoError)
          // Use existing location if available, or continue without
        }
      }

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
      const preview = canvas.toDataURL("image/jpeg", 0.9)

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
            location: captureLocation

          })

          // Show location info to user if captured
          if (captureLocation) {
            console.log("Photo captured with location:", captureLocation)
          }
        } catch (error) {
          console.error("Upload error:", error)
          alert("Failed to upload photo. Please try again.")

        } finally {
          setIsUploading(false)
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
    }
  }

  const handleSubmit = async () => {
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

      // Step 1: Verify quest based on type
      let verificationResult = null
      const isBollKeeperQuest = questId === 'boll_keeper' || quest?.slug === 'boll_keeper'

      if (uploadedImage) {
        try {
          console.log('Verifying quest...')
          setIsVerifying(true)

          if (isBollKeeperQuest) {
            // Cotton boll verification
            console.log('Using cotton verification...')
            const verifyResponse = await fetch(`${backendUrl}/api/cotton/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
              },
              body: JSON.stringify({
                imageKey: uploadedImage.key,
                imageUrl: uploadedImage.url
              })
            })

            if (verifyResponse.ok) {
              verificationResult = await verifyResponse.json()
              console.log('Cotton verification result:', verificationResult)
              setVerificationResult(verificationResult)

              // Check if cotton was detected
              if (!verificationResult.has_cotton) {
                setIsVerifying(false)
                setIsSubmitting(false)
                alert('No cotton bolls detected in the image. Please take a clear photo of cotton bolls and try again.')
                return
              }
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}))
              throw new Error(errorData.message || 'Cotton verification failed')
            }
          } else {
            // Generic quest verification for all other quests
            console.log('Using generic quest verification...')

            // Fetch quest details to get success_criteria
            const questResponse = await fetch(`${backendUrl}/api/quests/${questId}`, {
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
              }
            })

            if (!questResponse.ok) {
              throw new Error('Failed to fetch quest details')
            }

            const questData = await questResponse.json()
            const successCriteria = questData.verification_data?.success_criteria || questData.description

            console.log('Quest success criteria:', successCriteria)

            const verifyResponse = await fetch(`${backendUrl}/api/quest-verification/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
              },
              body: JSON.stringify({
                imageKey: uploadedImage.key,
                imageUrl: uploadedImage.url,
                successCriteria: successCriteria,
                questId: questId
              })
            })

            if (verifyResponse.ok) {
              verificationResult = await verifyResponse.json()
              console.log('Generic quest verification result:', verificationResult)
              setVerificationResult(verificationResult)

              // Check if quest was verified
              if (!verificationResult.verified && !verificationResult.success) {
                setIsVerifying(false)
                setIsSubmitting(false)
                alert(`Quest verification failed: ${verificationResult.response || 'Image does not meet quest requirements'}. Please try again with a better image.`)
                return
              }
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}))
              throw new Error(errorData.message || 'Quest verification failed')
            }
          }

          setIsVerifying(false)
        } catch (verifyError) {
          console.error('Verification error:', verifyError)
          setIsVerifying(false)
          alert(`Verification failed: ${verifyError.message}. Please ensure the image meets quest requirements.`)
          setIsSubmitting(false)
          return
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
        if (isBollKeeperQuest) {
          submissionData.cottonVerification = verificationResult
        } else {
          submissionData.questVerification = verificationResult
        }
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
    <div className="flex flex-col h-screen overflow-hidden pb-safe bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-background/80 backdrop-blur-sm shadow-sm flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-primary/10 rounded-xl transition-all hover:scale-105 active:scale-95">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Submit Quest</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 max-w-2xl mx-auto w-full">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Submit Your Proof</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Capture or upload evidence of quest completion</p>
        </div>

        {/* Upload Options */}
        {showPhotoOption && (
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Upload Media
            </h3>

            {/* Camera View */}
            {isCameraActive ? (
              <div className="relative bg-black rounded-3xl overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20">
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
                <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 z-10 shadow-lg animate-pulse">
                  <MapPin className="w-3.5 h-3.5" />
                  {location ? "📍 Location Tracked" : "📡 Getting Location..."}
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
                  <button
                    onClick={stopCamera}
                    className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    ✕ Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={isUploading}
                    className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "⏳ Uploading..." : "📸 Capture"}
                  </button>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={uploadedImage.preview || uploadedImage.url}
                  alt="Uploaded proof"
                  className="relative w-full h-72 sm:h-80 object-cover rounded-3xl border-2 border-primary/50 shadow-2xl"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                  aria-label="Remove photo"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Photo Ready!
                </div>
                {uploadedImage.location && (
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <MapPin className="w-3.5 h-3.5" />
                    📍 {uploadedImage.location.latitude.toFixed(4)}, {uploadedImage.location.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={startCamera}
                  className="block w-full cursor-pointer group"
                >
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 rounded-2xl sm:rounded-3xl p-8 hover:border-primary hover:from-primary/20 hover:to-accent/20 transition-all text-center group-hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-base sm:text-lg font-bold text-foreground mb-1">📸 Take Live Photo</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">📍 With GPS Location Tracking</p>
                  </div>
                </button>

                {/* File Upload Option for Development */}
                <label className="block w-full cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-dashed border-border rounded-2xl sm:rounded-3xl p-6 hover:border-primary hover:bg-primary/5 transition-all text-center group-hover:scale-[1.02] active:scale-[0.98]">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform inline-block">📁</div>
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">Upload from Device</p>
                    <p className="text-xs text-muted-foreground">For Development/Testing</p>
                  </div>
                </label>
              </div>
            )}
          </div>
        )}
        {verificationResult && (
          <div className={`p-4 rounded-2xl border-2 ${verificationResult.verified || (verificationResult.success && verificationResult.is_healthy)
            ? 'bg-green-50 border-green-500 dark:bg-green-950/30'
            : 'bg-amber-50 border-amber-500 dark:bg-amber-950/30'
            }`}>
            <div className="flex items-start gap-3">
              {verificationResult.verified || (verificationResult.success && verificationResult.is_healthy) ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-6 h-6 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">⚠️</div>
              )}

              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">
                  {quest?.id === 'boll_keeper' || quest?.slug === 'boll_keeper'
                    ? (verificationResult.success && verificationResult.is_healthy ? 'Healthy Cotton Detected!' : 'Cotton Analysis Result')
                    : (verificationResult.verified ? 'AI Verification Success' : 'AI Analysis Result')
                  }
                </h4>

                {(quest?.id === 'boll_keeper' || quest?.slug === 'boll_keeper') ? (
                  verificationResult.success ? (
                    <div className="text-xs space-y-1">
                      <p>Cotton Detected: {verificationResult.has_cotton ? 'Yes' : 'No'}</p>
                      <p>Healthy Status: {verificationResult.is_healthy ? 'Healthy' : 'Not Fully Opened'}</p>
                      {verificationResult.detected_classes && verificationResult.detected_classes.length > 0 && (
                        <p>Detected: {verificationResult.detected_classes.join(', ')}</p>
                      )}
                      {verificationResult.message && <p className="text-muted-foreground">{verificationResult.message}</p>}
                    </div>
                  ) : (
                    <p className="text-xs text-destructive">
                      {verificationResult.error || 'Verification failed'}
                    </p>
                  )
                ) : (
                  <div className="text-xs space-y-1">
                    <p className={`font-semibold ${verificationResult.verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {verificationResult.verified ? '✅ Verified' : '❌ Requirements Not Met'}
                    </p>
                    <p className="text-muted-foreground">
                      {verificationResult.response || verificationResult.message || (verificationResult.verified ? 'Good job!' : 'Please check required items.')}
                    </p>
                    {verificationResult.error && (
                      <p className="text-destructive font-bold mt-1">Error: {verificationResult.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Submit Button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isVerifying}
            className={`w-full font-bold py-4 sm:py-5 rounded-2xl sm:rounded-3xl transition-all shadow-xl text-base sm:text-lg ${canSubmit && !isSubmitting && !isVerifying
              ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl hover:shadow-primary/40 active:scale-95 hover:scale-[1.02]"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Verifying Quest...
              </span>
            ) : isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">📤</span> Submitting Proof...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✨ Submit for Review
              </span>
            )}
          </button>
          {!canSubmit && (
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3">📸 Please capture or upload a photo to continue</p>
          )}
        </div>
      </div>
    </div>
  )
}