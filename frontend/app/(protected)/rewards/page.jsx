"use client"

import { RewardStore } from "@/components/farmer/reward-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RewardsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [])

    const handlePurchase = (item) => {
        // Update user data with new XP balance and purchased items
        if (userData) {
            const newXP = userData.xp - item.cost
            const purchasedRewards = userData.purchasedRewards || []

            const updatedData = {
                ...userData,
                xp: newXP,
                purchasedRewards: [...purchasedRewards, item.id]
            }

            localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData))
            setUserData(updatedData)
        }
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <RewardStore
            userData={userData}
            onBack={() => router.push("/dashboard")}
            onPurchase={handlePurchase}
        />
    )
}
