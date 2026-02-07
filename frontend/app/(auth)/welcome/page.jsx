"use client"

import { WelcomeScreen } from "@/components/shared/welcome-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function WelcomePage() {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            const farmerToken = localStorage.getItem("token")
            const adminToken = localStorage.getItem("farmquest_admin_token")

            if (farmerToken) {
                // Verify farmer token
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                    const res = await fetch(`${backendUrl}/api/users/me`, {
                        headers: { "Authorization": `Bearer ${farmerToken}` }
                    })

                    if (res.ok) {
                        // Valid farmer session, redirect to dashboard
                        router.push("/dashboard")
                        return
                    } else {
                        // Invalid token, clean up
                        localStorage.removeItem("token")
                        localStorage.removeItem("farmquest_auth")
                        localStorage.removeItem("farmquest_userdata")
                    }
                } catch (error) {
                    console.error("Error verifying farmer session:", error)
                    localStorage.removeItem("token")
                    localStorage.removeItem("farmquest_auth")
                    localStorage.removeItem("farmquest_userdata")
                }
            }

            if (adminToken) {
                // Check if admin token exists
                const adminInfo = localStorage.getItem("farmquest_admin")
                if (adminInfo) {
                    // Valid admin session, redirect to admin dashboard
                    router.push("/admin/dashboard")
                    return
                } else {
                    localStorage.removeItem("farmquest_admin_token")
                }
            }

            setIsChecking(false)
        }

        checkAuth()
    }, [router])

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
        <WelcomeScreen
            onFarmerLogin={() => router.push("/auth/login")}
            onSignup={() => router.push("/auth/signup")}
            onAdminLogin={() => router.push("/admin/login")}
        />
    )
}
