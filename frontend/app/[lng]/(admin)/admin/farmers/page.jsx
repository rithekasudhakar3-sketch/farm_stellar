"use client"

import { AdminFarmersScreen } from "@/components/admin/farmers-screen"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function AdminFarmersPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return <AdminFarmersScreen onBack={() => router.push(`/${lng}/admin/dashboard`)} t={t} />
}
