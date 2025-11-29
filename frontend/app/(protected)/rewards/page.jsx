"use client"

import { RewardsScreen } from "@/components/farmer/rewards-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RewardsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [])

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return <RewardsScreen userData={userData} onBack={() => router.push("/dashboard")} />
}
