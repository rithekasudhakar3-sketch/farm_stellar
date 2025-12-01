"use client"

import { AdminPasskeyLoginScreen } from "@/components/auth/admin-passkey-login-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLoginPage() {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check if already logged in as admin
        const adminToken = localStorage.getItem("farmquest_admin_token")
        const adminInfo = localStorage.getItem("farmquest_admin")
        
        if (adminToken && adminInfo) {
            router.push("/admin/dashboard")
            return
        }
        setIsChecking(false)
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
        <AdminPasskeyLoginScreen
            onSuccess={() => {
                // Token is already stored by the AdminPasskeyLoginScreen component
                router.push("/admin/dashboard")
            }}
            onBack={() => router.push("/welcome")}
        />
    )
}
