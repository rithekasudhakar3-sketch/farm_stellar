"use client"

import { AdminVerificationScreen } from "@/components/admin/verification-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function AdminVerificationPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return <AdminVerificationScreen onBack={() => router.push(`/${lng}/admin/dashboard`)} t={t} />
}
