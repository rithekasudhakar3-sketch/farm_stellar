"use client"

import { ImpactTrackerScreen } from "@/components/farmer/impact-tracker-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ImpactPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [])

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return <ImpactTrackerScreen userData={userData} onBack={() => router.push("/dashboard")} />
}
