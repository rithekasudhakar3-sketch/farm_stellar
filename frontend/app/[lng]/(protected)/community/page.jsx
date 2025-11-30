"use client"

import { CommunityScreen } from "@/components/farmer/community-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CommunityPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [])

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return <CommunityScreen userData={userData} onBack={() => router.push("/dashboard")} />
}
