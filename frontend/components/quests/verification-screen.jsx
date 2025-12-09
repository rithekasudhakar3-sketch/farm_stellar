"use client"

import { CheckCircle2, Sparkles, Brain, Eye, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export function VerificationScreen({ quest, onContinue, isAutoVerified = false, verificationData = null }) {
  const [verificationStage, setVerificationStage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [verificationResults, setVerificationResults] = useState([])
  const [learningOutcomes, setLearningOutcomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [genericVerificationResult, setGenericVerificationResult] = useState(null)

  const stages = [
    { icon: Eye, text: "Analyzing submitted image...", duration: 0 },
    { icon: Brain, text: "AI identifying key elements...", duration: 0 },
    { icon: Sparkles, text: "Verifying completion criteria...", duration: 0 },
    { icon: Zap, text: "Generating feedback...", duration: 0 }
  ]

  useEffect(() => {
    // Fetch quest learning outcomes from backend
    const fetchQuestData = async () => {
      try {
        const token = localStorage.getItem("token")
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
        const questId = quest?._id || quest?.id
        
        if (questId && token) {
          const response = await fetch(`${backendUrl}/api/quests/${questId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
          
          if (response.ok) {
            const questData = await response.json()
            console.log('Fetched quest data:', questData)
            setLearningOutcomes(questData.outcomes || [])
          }
        } else {
          // Fallback to quest prop data if available
          setLearningOutcomes(quest?.outcomes || [])
        }
      } catch (error) {
        console.error('Error fetching quest data:', error)
        // Fallback to quest prop data
        setLearningOutcomes(quest?.outcomes || [])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestData()

    // Process quest verification data
    if (verificationData) {
      console.log('Generic quest verification data received from props:', verificationData)
      setGenericVerificationResult(verificationData)
      
      // Set verification results immediately
      const results = [
        {
          label: 'Verification Status',
          status: verificationData.verified ? 'Verified ✓' : 'Not Verified',
          color: verificationData.verified ? 'text-green-500' : 'text-red-500'
        }
      ]

      setVerificationResults(results)
    }

    // Process verification results from API or simulate
    const runVerification = async () => {
      for (let i = 0; i < stages.length; i++) {
        setVerificationStage(i)
        await new Promise(resolve => setTimeout(resolve, stages[i].duration))
      }

      // Use actual verification data from API if available
      if (verificationData) {
        console.log('Displaying verification data from API:', verificationData)
        
        // Map API response to display format for other quests
        const results = []
          
        // Add all fields from the verification response
        Object.entries(verificationData).forEach(([key, value]) => {
            if (key === 'verified' || key === 'success') {
              results.push({
                label: 'Verification Status',
                status: value ? 'Verified ✓' : 'Failed',
                color: value ? 'text-green-500' : 'text-red-500'
              })
            } else if (key === 'score') {
              results.push({
                label: 'Overall Score',
                status: `${value}/100`,
                color: value >= 80 ? 'text-green-500' : value >= 60 ? 'text-yellow-500' : 'text-red-500'
              })
            } else if (key === 'confidence') {
              results.push({
                label: 'Confidence',
                status: `${Math.round(value * 100)}%`,
                color: value >= 0.8 ? 'text-green-500' : value >= 0.6 ? 'text-yellow-500' : 'text-red-500'
              })
            } else if (key === 'message' || key === 'feedback') {
              // Skip message field, we'll display it separately
            } else if (typeof value === 'boolean') {
              results.push({
                label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                status: value ? 'Passed ✓' : 'Failed',
                color: value ? 'text-green-500' : 'text-red-500'
              })
            } else if (typeof value === 'string' || typeof value === 'number') {
              results.push({
                label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                status: String(value),
                color: 'text-primary'
              })
            }
          })
          
          setVerificationResults(results)
        }

      setIsComplete(true)
    }

    runVerification()
  }, [verificationData])

  const CurrentIcon = stages[verificationStage]?.icon || Sparkles

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-md w-full">
          {/* AI Icon Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center animate-pulse">
                <CurrentIcon className="w-16 h-16 text-primary" />
              </div>
              {!isComplete && (
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              )}
              {isComplete && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 animate-bounce">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
              AI Verification
            </h2>
            
          </div>

          {/* Progress Stages */}
          {!isComplete && (
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const StageIcon = stage.icon
                const isActive = idx === verificationStage
                const isCompleted = idx < verificationStage

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                        ? "bg-primary/10 border-2 border-primary scale-105"
                        : isCompleted
                          ? "bg-accent/5 border border-accent/20"
                          : "bg-muted/30 border border-border opacity-50"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-accent" : isActive ? "bg-primary" : "bg-muted"
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <StageIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? "text-primary" : isCompleted ? "text-accent" : "text-muted-foreground"
                      }`}>
                      {stage.text}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Verification Results */}
          {isComplete && verificationResults.length > 0 && (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                Verification Results
              </h3>
              <div className="space-y-2">
                {verificationResults.map((result, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all">
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">{result.label}</span>
                    <span className={`text-sm sm:text-base font-bold ${result.color}`}>{result.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quest Verification Details */}
          {isComplete && genericVerificationResult && (
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-blue-200 dark:border-blue-800">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Response
                </h3>
              </div>
                
              {/* AI Response Content */}
              <div className={`p-4 sm:p-5 rounded-xl backdrop-blur-sm border-2 ${
                genericVerificationResult.verified || genericVerificationResult.success
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-300 dark:border-red-700'
              }`}>
                {(() => {
                  const responseText = genericVerificationResult.response || genericVerificationResult.message || ''
                  
                  // Function to format the response into bullet points
                  const formatResponse = (text) => {
                    if (!text) {
                      return genericVerificationResult.verified || genericVerificationResult.success
                        ? ['✓ Quest verified successfully', '✓ All criteria met', '✓ Submission accepted']
                        : ['✗ Quest verification failed', '✗ Please review requirements', '✗ Submit again with correct proof']
                    }

                    // Split by common delimiters and clean up
                    let points = text
                      .split(/[.!?]\s+(?=[A-Z])|[\n•\-–—]+/)
                      .map(point => point.trim())
                      .filter(point => point.length > 10) // Filter out very short fragments
                    
                    // If we have numbered points (1., 2., etc), split by those
                    if (text.match(/\d+\.\s/)) {
                      points = text.split(/\d+\.\s+/).filter(p => p.trim().length > 10)
                    }
                    
                    // Limit to 3-4 most important points
                    points = points.slice(0, 4)
                    
                    // Add bullet points if not present
                    return points.map(point => {
                      // Clean up and shorten if needed
                      let cleaned = point
                        .replace(/^(VERIFIED:|YES|NO|Therefore,?|The clear|This image|In summary)/gi, '')
                        .trim()
                      
                      // Limit length to ~100 characters
                      if (cleaned.length > 100) {
                        cleaned = cleaned.substring(0, 100).trim() + '...'
                      }
                      
                      return cleaned
                    }).filter(p => p.length > 0)
                  }

                  const bulletPoints = formatResponse(responseText)
                  const isVerified = genericVerificationResult.verified || genericVerificationResult.success

                  return (
                    <ul className="space-y-2">
                      {bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className={`mt-1 flex-shrink-0 ${
                            isVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {isVerified ? '✓' : '✗'}
                          </span>
                          <span className={`text-sm sm:text-base leading-relaxed ${
                            isVerified
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-red-800 dark:text-red-200'
                          }`}>
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>
            </div>
          )}

          {/* AI Info */}
          {!isComplete && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left">
              
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <button
          onClick={onContinue}
          disabled={!isComplete}
          className={`w-full font-bold py-3 sm:py-4 rounded-2xl transition-all text-sm sm:text-base ${isComplete
              ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {isAutoVerified ? "Proceed to Summary & Learning Outcomes" : "Proceed to Summary & Learning Outcomes"}
        </button>
      </div>
    </div>
  )
}
