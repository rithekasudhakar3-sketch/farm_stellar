"use client"

import { AdminRewardsScreen } from "@/components/admin/rewards-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function AdminRewardsPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return <AdminRewardsScreen onBack={() => router.push(`/${lng}/admin/dashboard`)} t={t} />
}
