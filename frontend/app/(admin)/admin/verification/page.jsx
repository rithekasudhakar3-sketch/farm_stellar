"use client"

import { AdminVerificationScreen } from "@/components/features/admin/verification-screen"
import { useRouter } from "next/navigation"

export default function AdminVerificationPage() {
    const router = useRouter()

    return <AdminVerificationScreen onBack={() => router.push("/admin/dashboard")} />
}
