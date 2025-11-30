"use client"

import { PermissionsScreen } from "@/components/auth/permissions-screen"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PermissionsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleComplete = async (permissions) => {
        setIsLoading(true)
        setError("")
        
        try {
            // Combine all temp data
            const phone = localStorage.getItem("farmquest_temp_phone") || ""
            const farmerType = localStorage.getItem("farmquest_temp_farmerType") || "beginner"
            const farmDetails = JSON.parse(localStorage.getItem("farmquest_temp_farmDetails") || "{}")
            const signupTempData = JSON.parse(localStorage.getItem("signup_temp_data") || "{}")

            // Validate that we have required data
            if (!phone && !signupTempData.phone) {
                setError("Phone number is missing. Please start the signup process again.")
                setIsLoading(false)
                setTimeout(() => router.push("/auth/signup"), 2000)
                return
            }

            // Create user in backend
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            
            // Use data from phone login screen if available, otherwise fallback to auto-generated
            const signupData = {
                name: signupTempData.name || farmDetails.name || `Farmer_${phone}`,
                phone: signupTempData.phone || phone,
                email: signupTempData.email || `${phone}@farmstellar.app`,
                password: signupTempData.password || `farm_${phone}_pass`,
                location: signupTempData.location || `${farmDetails.district || ""}, ${farmDetails.state || ""}`,
                city: signupTempData.city || farmDetails.district || ""
            }

            const farmData = {
                name: farmDetails.farmName || `${farmDetails.name}'s Farm`,
                address: farmDetails.address || `${farmDetails.district}, ${farmDetails.state}`,
                size: parseFloat(farmDetails.farmSize) || 0,
                primaryCrop: farmDetails.crops || ""
            }

            console.log("Signing up with:", signupData)

            const signupRes = await fetch(`${backendUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            })

            if (!signupRes.ok) {
                const errorData = await signupRes.json()
                const errorMessage = errorData.message || "Signup failed"
                
                // Handle specific error cases
                if (errorMessage.includes("User already exists")) {
                    setError("This phone number or email is already registered. Please login instead.")
                    setIsLoading(false)
                    setTimeout(() => router.push("/auth/login"), 2000)
                    return
                } else {
                    throw new Error(errorMessage)
                }
            }

            const { token } = await signupRes.json()
            localStorage.setItem("token", token)

            // Update farm details
            try {
                await fetch(`${backendUrl}/api/farm/me`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(farmData),
                })
            } catch (farmError) {
                console.warn("Farm update failed:", farmError)
                // Continue even if farm update fails
            }

            // Update user level based on farmer type
            try {
                await fetch(`${backendUrl}/api/users/me`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        level: farmerType === "Pro" ? "pro" : "beginner"
                    }),
                })
            } catch (levelError) {
                console.warn("Level update failed:", levelError)
                // Continue even if level update fails
            }

            // Save to local storage for quick access
            const userData = {
                farmerType,
                farmDetails,
                permissions,
                xp: 0,
                level: 1,
                completedQuests: [],
                badges: [],
            }

            localStorage.setItem("farmquest_userdata", JSON.stringify(userData))
            localStorage.setItem("farmquest_auth", JSON.stringify({ userType: "farmer", authenticated: true }))

            // Clean up temp data
            localStorage.removeItem("farmquest_temp_phone")
            localStorage.removeItem("farmquest_temp_farmerType")
            localStorage.removeItem("farmquest_temp_farmDetails")
            localStorage.removeItem("signup_temp_data")

            router.push("/dashboard")
        } catch (error) {
            console.error("Signup error:", error)
            setError(error.message || "Failed to create account. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="relative">
            {error && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
                    <div className="bg-destructive text-destructive-foreground px-6 py-4 rounded-xl shadow-2xl border border-destructive/20">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium text-sm leading-relaxed">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            <PermissionsScreen
                onSuccess={handleComplete}
                onSkip={() => handleComplete({})}
                isLoading={isLoading}
            />
        </div>
    )
}
