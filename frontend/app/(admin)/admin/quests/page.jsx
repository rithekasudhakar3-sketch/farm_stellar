"use client"

import { AdminQuestsScreen } from "@/components/admin/quests-screen"
import { QUESTS_DATA } from "@/constants/quests"
import { useRouter } from "next/navigation"

export default function AdminQuestsPage() {
    const router = useRouter()

    return <AdminQuestsScreen quests={QUESTS_DATA} onBack={() => router.push("/admin/dashboard")} />
}
