"use client"

import { AdminQuestsScreen } from "@/components/admin/quests-screen"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "../../../../i18n/client"

export default function AdminQuestsPage() {
    const router = useRouter()
    const params = useParams()
    const lng = params.lng
    const { t } = useTranslation(lng)

    return <AdminQuestsScreen quests={QUESTS_DATA} onBack={() => router.push(`/${lng}/admin/dashboard`)} t={t} />
}
