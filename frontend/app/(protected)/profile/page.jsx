"use client"

import { FarmerProfileScreen } from "@/components/farmer/profile-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
        setUserData(data)
    }, [])

    const handleUpdate = (updatedData) => {
        const newData = { ...userData, ...updatedData }
        setUserData(newData)
        localStorage.setItem("farmquest_userdata", JSON.stringify(newData))
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <FarmerProfileScreen
            userData={userData}
            onUpdate={handleUpdate}
            onBack={() => router.push("/dashboard")}
        />
    )
}
