"use client"

import { AdminFarmersScreen } from "@/components/features/admin/farmers-screen"
import { useRouter } from "next/navigation"

export default function AdminFarmersPage() {
    const router = useRouter()

    return <AdminFarmersScreen onBack={() => router.push("/admin/dashboard")} />
}
