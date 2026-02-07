"use client"

import { AdminRewardsScreen } from "@/components/features/admin/rewards-screen"
import { useRouter } from "next/navigation"

export default function AdminRewardsPage() {
    const router = useRouter()

    return <AdminRewardsScreen onBack={() => router.push("/admin/dashboard")} />
}
