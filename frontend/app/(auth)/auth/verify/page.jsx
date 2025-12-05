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
            // New user - proceed to farmer type selection
            // Signup data is already in localStorage from PhoneLoginScreen
            router.push("/auth/farmer-type")
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
