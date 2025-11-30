"use client"

import { PhoneLoginScreen } from "@/components/auth/phone-login-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function LoginPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return (
        <PhoneLoginScreen
            isSignup={false}
            onSuccess={(phone) => router.push(`/${lng}/auth/verify?phone=${phone}&type=login`)}
            onBack={() => router.push(`/${lng}/welcome`)}
            t={t}
        />
    )
}
