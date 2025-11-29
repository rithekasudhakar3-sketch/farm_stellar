"use client"

import { WelcomeScreen } from "@/components/welcome-screen"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
    const router = useRouter()

    return (
        <WelcomeScreen
            onFarmerLogin={() => router.push("/auth/login")}
            onSignup={() => router.push("/auth/signup")}
            onAdminLogin={() => router.push("/admin/login")}
        />
    )
}
