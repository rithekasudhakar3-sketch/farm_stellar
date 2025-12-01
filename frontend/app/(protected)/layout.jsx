"use client"

import { NavigationMenu } from "@/components/shared/navigation-menu"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            // TEMPORARY: Bypass auth for testing i18n
            /*
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }
            */

            try {
                // TEMPORARY: Skip backend calls
                /*
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                const res = await fetch(`${backendUrl}/api/users/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    // Token invalid or expired, clear storage and redirect
                    localStorage.removeItem("token")
                    localStorage.removeItem("farmquest_auth")
                    localStorage.removeItem("farmquest_userdata")
                    router.push("/welcome")
                    return
                }

                const user = await res.json()
                
                // Load local storage data for compatibility
                const localData = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")

                const mergedData = {
                    name: user.name || "Farmer",
                    level: user.level === "pro" ? 5 : 3,
                    xp: user.xp || 0,
                    xpLevel: user.xpLevel || 0,
                    location: user.city || user.location || localData.city || localData.location || "Unknown Location",
                    ...localData
                }

                setUserData(mergedData)
                */

                // Mock user data
                const mockUser = {
                    name: "Test Farmer",
                    level: 3,
                    xp: 100,
                    xpLevel: 1,
                    location: "Test Location"
                }
                setUserData(mockUser)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching user data:", error)
                // Clear storage and redirect on error
                /*
                localStorage.removeItem("token")
                localStorage.removeItem("farmquest_auth")
                localStorage.removeItem("farmquest_userdata")
                router.push("/welcome")
                */
                setUserData({ name: "Test Farmer" })
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("farmquest_auth")
        localStorage.removeItem("farmquest_userdata")
        router.push("/welcome")
    }

    const handleNavigate = (screen) => {
        const routes = {
            "farmer-dashboard": "/dashboard",
            "quests-list": "/quests",
            "community": "/community",
            "rewards": "/rewards",
            "farmer-profile": "/profile",
            "settings": "/settings",
            "impact-tracker": "/impact",
        }

        if (routes[screen]) {
            router.push(routes[screen])
        }
    }

    if (loading || !userData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <NavigationMenu
                userName={userData.name}
                userLevel={userData.xpLevel}
                userLocation={userData.location}
                onLogout={handleLogout}
                currentScreen={pathname}
                onNavigate={handleNavigate}
            />
            {children}
        </div>
    )
}
