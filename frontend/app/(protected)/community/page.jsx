"use client"

import { CommunityScreen } from "@/components/features/farmer/community-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CommunityPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                const response = await fetch(`${backendUrl}/api/users/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const user = await response.json()
                    setUserData(user)
                } else {
                    // Fallback to localStorage
                    const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
                    setUserData(data)
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
                const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
                setUserData(data)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router])

    if (loading || !userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return <CommunityScreen userData={userData} onBack={() => router.push("/dashboard")} />
}
