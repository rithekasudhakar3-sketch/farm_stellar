"use client"

import { FarmerTypeSelectionScreen } from "@/components/auth/farmer-type-selection-screen"
import { useRouter } from "next/navigation"

export default function FarmerTypePage() {
    const router = useRouter()

    return (
        <FarmerTypeSelectionScreen
            onSuccess={(farmerType) => {
                // Store farmer type in localStorage
                localStorage.setItem("farmquest_temp_farmerType", farmerType)
                router.push("/auth/farm-details")
            }}
            onBack={() => router.push("/auth/verify")}
        />
    )
}
