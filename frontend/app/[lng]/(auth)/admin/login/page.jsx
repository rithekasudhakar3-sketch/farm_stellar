"use client"

import { AdminPasskeyLoginScreen } from "@/components/auth/admin-passkey-login-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function AdminLoginPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return (
        <AdminPasskeyLoginScreen
            onSuccess={() => {
                localStorage.setItem("farmquest_auth", JSON.stringify({ userType: "admin", authenticated: true }))
                router.push(`/${lng}/admin/dashboard`)
            }}
            onBack={() => router.push(`/${lng}/welcome`)}
            t={t}
        />
    )
}
