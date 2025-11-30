"use client"

import { PhoneLoginScreen } from "@/components/auth/phone-login-screen"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check if already logged in
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                    const res = await fetch(`${backendUrl}/api/users/me`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                    if (res.ok) {
                        router.push("/dashboard")
                        return
                    }
                } catch (error) {
                    console.error("Session check error:", error)
                }
            }
            setIsChecking(false)
        }
        checkAuth()
    }, [router])

    const handleSendOTP = (phone, data) => {
        // Navigate to OTP verification screen
        router.push(`/auth/verify?phone=${phone}`)
    }

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-green-800 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <PhoneLoginScreen
                isSignup={false}
                onSuccess={handleSendOTP}
                onBack={() => router.push("/welcome")}
            />
        </>
    )
}
