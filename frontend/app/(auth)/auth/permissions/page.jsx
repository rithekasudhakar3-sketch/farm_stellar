"use client"

import { PermissionsScreen } from "@/components/auth/permissions-screen"
import { useRouter } from "next/navigation"

export default function PermissionsPage() {
    const router = useRouter()

    const handleComplete = (permissions) => {
        // Combine all temp data and save to final storage
        const farmerType = localStorage.getItem("farmquest_temp_farmerType")
        const farmDetails = JSON.parse(localStorage.getItem("farmquest_temp_farmDetails") || "{}")

        const userData = {
            farmerType,
            farmDetails,
            permissions,
            xp: 0,
            level: 1,
            completedQuests: [],
            badges: [],
        }

        localStorage.setItem("farmquest_userdata", JSON.stringify(userData))
        localStorage.setItem("farmquest_auth", JSON.stringify({ userType: "farmer", authenticated: true }))

        // Clean up temp data
        localStorage.removeItem("farmquest_temp_farmerType")
        localStorage.removeItem("farmquest_temp_farmDetails")

        router.push("/dashboard")
    }

    return (
        <PermissionsScreen
            onSuccess={handleComplete}
            onSkip={() => handleComplete({})}
        />
    )
}
