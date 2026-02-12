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

      // Override timestamp to ensure it's treated as a fresh capture for this session
      if (captureLocation) {
        captureLocation = {
          ...captureLocation,
          timestamp: new Date().toISOString()
        };
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

    // 1. Capture Location immediately (Required for verification)
    let uploadLocation = location; // current tracked location if available
    try {
      if (navigator.geolocation) {
        console.log("Getting location for upload...");
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
        });

        uploadLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        setLocation(uploadLocation); // Update state too
        console.log("Location secured for upload:", uploadLocation);
      }
    } catch (geoError) {
      console.warn("Could not get fresh location for upload:", geoError);
      // Fallback: If we have a previously tracked location, use it.
      // If not, the user might be warned by the backend later.
      if (!uploadLocation) {
        alert("⚠️ Location Warning: We couldn't get your GPS location. Verification may fail if you are far from your farm.");
      }
    }

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
            preview: reader.result,
            location: uploadLocation // Attach the captured location!
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
                imageUrl: uploadedImage.url,
                gpsCoordinates: uploadedImage.location // 📍 Send GPS Data
              })
            })

            if (verifyResponse.ok) {
              const rawResult = await verifyResponse.json();
              console.log('Cotton verification result:', rawResult);

              // Normalize cotton result to standard schema
              const isSuccess = rawResult.success && rawResult.has_cotton && rawResult.is_healthy;
              const reasons = [];
              if (!rawResult.has_cotton) reasons.push("No cotton bolls detected.");
              else if (!rawResult.is_healthy) reasons.push("Cotton bolls appear unhealthy or not fully open.");
              else reasons.push("Healthy cotton bolls detected!");

              if (rawResult.message) reasons.push(rawResult.message);

              verificationResult = {
                status: isSuccess ? 'verified' : 'rejected',
                reasons: reasons,
                suggestions: isSuccess ? ["Great job!"] : ["Please ensure the boll is clearly visible and healthy."]
              };

              setVerificationResult(verificationResult);

              // Strict block if not cotton
              if (!rawResult.has_cotton) {
                setIsVerifying(false);
                setIsSubmitting(false);
                return; // Stop here, UI will show rejection
              }
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.message || 'Cotton verification failed');
            }
          } else {
            // Generic quest verification 
            console.log('Using generic quest verification...');

            // Fetch quest details first
            const questResponse = await fetch(`${backendUrl}/api/quests/${questId}`, {
              headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
            });

            if (!questResponse.ok) {
              // If quest fetch fails, we proceed with description as fallback or fail gracefully
              console.warn('Failed to fetch quest details, using generic criteria');
            }

            const questData = questResponse.ok ? await questResponse.json() : {};
            const successCriteria = questData.verification_data?.success_criteria || quest?.description || "Quest completion";

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
                questId: questId,
                gpsCoordinates: uploadedImage.location // 📍 Send GPS Data
              })
            });

            if (verifyResponse.ok) {
              const rawResult = await verifyResponse.json();
              console.log('Generic quest verification result:', rawResult);

              // Ensure we have the standard schema
              verificationResult = {
                status: rawResult.status || (rawResult.verified ? 'verified' : 'rejected'),
                reasons: rawResult.reasons || [rawResult.response || rawResult.message || 'Verification completed'],
                suggestions: rawResult.suggestions || [],
                locationDetails: rawResult.locationDetails
              };

              setVerificationResult(verificationResult);
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.message || 'Quest verification failed');
            }
          }

          setIsVerifying(false);

        } catch (verifyError) {
          console.error('Verification error:', verifyError);
          setIsVerifying(false);
          // Set a rejected result instead of alerting
          setVerificationResult({
            status: 'rejected',
            reasons: [verifyError.message || "Verification system error"],
            suggestions: ["Please try uploading a clearer image."]
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Step 2: Submit to backend
      // Only proceed if verification PASSED or if there is no image (text only)
      // If image exists and verification FAILED, do not submit.
      if (uploadedImage && verificationResult && verificationResult.status === 'rejected') {
        setIsSubmitting(false);
        console.log("Blocking submission due to rejection");
        return;
      }

      const submissionData = {
        questId: questId,
        proofType: uploadedImage ? "photo" : "text",
        proofUrl: uploadedImage?.url || "",
        description: notes || "Quest completed as per instructions",
        status: "pending" // Always pending initially
      };

      // ... (rest of submission payload construction) ... 
      if (uploadedImage?.key) {
        submissionData.media = [{ key: uploadedImage.key, mimeType: "image/jpeg", sizeBytes: uploadedImage.sizeBytes || 0 }];
      }

      if (verificationResult) {
        submissionData.questVerification = {
          success: verificationResult.status === 'verified',
          verified: verificationResult.status === 'verified',
          response: verificationResult.reasons.join('. '),
          error: verificationResult.status === 'rejected' ? verificationResult.reasons[0] : null
        };
      }

      // ... (fetch call to submit) ...
      console.log('Submission payload:', submissionData);

      const response = await fetch(`${backendUrl}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(verificationResult);

    } catch (error) {
      console.error("Error submitting proof:", error);
      alert(`Failed to submit proof: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // ... (render return) ...

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={startCamera}
                  className="block w-full cursor-pointer group"
                >
                  <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 rounded-2xl sm:rounded-3xl p-6 hover:border-primary hover:from-primary/20 hover:to-accent/20 transition-all text-center group-hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl h-full flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-base font-bold text-foreground mb-1">📸 Take Live Photo</p>
                    <p className="text-xs text-muted-foreground">📍 With GPS Tracking</p>
                  </div>
                </button>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full cursor-pointer group h-full"
                  >
                    <div className="relative bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-dashed border-blue-500/30 rounded-2xl sm:rounded-3xl p-6 hover:border-blue-500 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all text-center group-hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl h-full flex flex-col items-center justify-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 mb-3 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                      </div>
                      <p className="text-base font-bold text-foreground mb-1">🖼️ Upload from Device</p>
                      <p className="text-xs text-muted-foreground">Select from Gallery</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* This block replaces the existing verificationResult && (...) block */}
        {/* standardized VERIFICATION UI */}
        {verificationResult && (
          <div className={`p-5 rounded-3xl border-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 ${verificationResult.status === 'verified'
            ? 'bg-green-500/10 border-green-500/50'
            : 'bg-red-500/10 border-red-500/50'
            }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${verificationResult.status === 'verified' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                {verificationResult.status === 'verified' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <X className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-lg mb-1 capitalize ${verificationResult.status === 'verified' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                  {verificationResult.status === 'verified' ? "Verification Successful" : "Verification Failed"}
                </h4>

                {/* Reasons List */}
                <div className="space-y-2 mt-2">
                  {verificationResult.reasons && verificationResult.reasons.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {verificationResult.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 📍 LOCATION COMPARISON CARD - For Judges & User Transparency */}
                  {verificationResult.locationDetails && (
                    <div className="mt-4 bg-background/60 backdrop-blur-sm rounded-2xl p-4 text-sm border border-border/50 shadow-sm">
                      <h5 className="font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b border-border/50 flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location Check</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${verificationResult.locationDetails.isInside ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                          {verificationResult.locationDetails.isInside ? "MATCHED" : "OUTSIDE BOUNDARY"}
                        </span>
                      </h5>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Registered */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Registered Farm</p>
                          <p className="font-semibold text-foreground text-xs leading-tight truncate" title={verificationResult.locationDetails.registered.placeName}>
                            {verificationResult.locationDetails.registered.placeName || "Unknown"}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground opacity-70">
                            {verificationResult.locationDetails.registered.lat.toFixed(5)}, {verificationResult.locationDetails.registered.lng.toFixed(5)}
                          </p>
                        </div>

                        {/* Current */}
                        <div className="space-y-1 relative pl-4 border-l border-border/50">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Your Location</p>
                          <p className="font-semibold text-foreground text-xs leading-tight truncate" title={verificationResult.locationDetails.current.placeName}>
                            {verificationResult.locationDetails.current.placeName || "Unknown"}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground opacity-70">
                            {verificationResult.locationDetails.current.lat.toFixed(5)}, {verificationResult.locationDetails.current.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>

                      {/* Distance Analysis */}
                      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground">Distance from center</span>
                          {!verificationResult.locationDetails.isInside && (
                            <span className="text-[10px] text-red-500 font-medium">Limit: {verificationResult.locationDetails.allowedRadius}m</span>
                          )}
                        </div>
                        <span className={`text-lg font-black font-mono tracking-tight ${verificationResult.locationDetails.isInside ? "text-green-600" : "text-red-600"}`}>
                          {verificationResult.locationDetails.distance}m
                        </span>
                      </div>
                    </div>
                  )}

                  {verificationResult.status === 'rejected' && verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
                    <div className="mt-3 bg-blue-500/10 text-blue-800 dark:text-blue-200 border border-blue-500/20 rounded-xl p-3 text-sm">
                      <p className="font-bold text-[10px] opacity-70 uppercase tracking-wider mb-1">💡 Suggestion</p>
                      <p>{verificationResult.suggestions[0]}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ... (Submit Button - Unchanged or slightly modified logic above handles it) ... */}


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
// Force rebuild