"use client"

import { OtpVerificationScreen } from "@/components/auth/otp-verification-screen"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const phone = searchParams.get("phone") || ""
    const type = searchParams.get("type") || "login"

    const handleSuccess = async (data) => {
        if (data.isNewUser || type === "signup") {
            // New user - get signup data from sessionStorage and complete registration
            const signupData = JSON.parse(sessionStorage.getItem("signupData") || "{}")
            
            if (signupData.phone) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                    const response = await fetch(`${backendUrl}/api/auth/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(signupData)
                    })

                    if (response.ok) {
                        const result = await response.json()
                        localStorage.setItem("token", result.token)
                        sessionStorage.removeItem("signupData")
                        router.push("/auth/farmer-type")
                    } else {
                        const error = await response.json()
                        alert(error.message || "Signup failed. Please try again.")
                        router.push("/auth/signup")
                    }
                } catch (error) {
                    console.error("Signup completion error:", error)
                    alert("Failed to complete signup. Please try again.")
                    router.push("/auth/signup")
                }
            } else {
                router.push("/auth/farmer-type")
            }
        } else {
            // Existing user - token already set in OTP verification
            router.push("/dashboard")
        }
    }

    return (
        <OtpVerificationScreen
            phone={phone}
            onSuccess={handleSuccess}
            onBack={() => router.push(type === "signup" ? "/auth/signup" : "/auth/login")}
        />
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    )
}
