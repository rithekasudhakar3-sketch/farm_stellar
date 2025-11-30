"use client"

import { FarmDetailsScreen } from "@/components/auth/farm-details-screen"
import { useRouter } from "next/navigation"

export default function FarmDetailsPage() {
    const router = useRouter()

    return (
        <FarmDetailsScreen
            onSuccess={(farmDetails) => {
                // Store farm details temporarily
                localStorage.setItem("farmquest_temp_farmDetails", JSON.stringify(farmDetails))
                router.push("/auth/permissions")
            }}
            onBack={() => router.push("/auth/farmer-type")}
        />
    )
}
