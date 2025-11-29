"use client"

import { OtpVerificationScreen } from "@/components/auth/otp-verification-screen"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const phone = searchParams.get("phone") || ""
    const type = searchParams.get("type") || "login"

    const handleSuccess = () => {
        if (type === "signup") {
            router.push("/auth/farmer-type")
        } else {
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
