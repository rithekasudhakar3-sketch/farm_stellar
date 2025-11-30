"use client"

import { OtpVerificationScreen } from "@/components/auth/otp-verification-screen"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Suspense } from "react"
import { useTranslation } from "../../../../i18n/client"

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)
    const phone = searchParams.get("phone") || ""
    const type = searchParams.get("type") || "login"

    const handleSuccess = () => {
        if (type === "signup") {
            router.push(`/${lng}/auth/farmer-type`)
        } else {
            router.push(`/${lng}/dashboard`)
        }
    }

    return (
        <OtpVerificationScreen
            phone={phone}
            onSuccess={handleSuccess}
            onBack={() => router.push(type === "signup" ? `/${lng}/auth/signup` : `/${lng}/auth/login`)}
            t={t}
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
