"use client"

import { WelcomeScreen } from "@/components/welcome-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../i18n/client"

export default function WelcomePage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return (
        <WelcomeScreen
            onFarmerLogin={() => router.push(`/${lng}/auth/login`)}
            onSignup={() => router.push(`/${lng}/auth/signup`)}
            onAdminLogin={() => router.push(`/${lng}/admin/login`)}
            t={t}
        />
    )
}
