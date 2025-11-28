"use client"

import { AdminPasskeyLoginScreen } from "@/components/auth/admin-passkey-login-screen"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
    const router = useRouter()

    return (
        <AdminPasskeyLoginScreen
            onSuccess={() => {
                localStorage.setItem("farmquest_auth", JSON.stringify({ userType: "admin", authenticated: true }))
                router.push("/admin/dashboard")
            }}
            onBack={() => router.push("/welcome")}
        />
    )
}
