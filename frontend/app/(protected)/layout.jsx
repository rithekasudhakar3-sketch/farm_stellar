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
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }

            try {
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
                    ...localData,  // Start with local data as base
                    // Override with fresh backend data
                    name: user.name || localData.name || "Farmer",
                    level: user.level === "pro" ? 5 : 3,
                    xp: user.xp || 0,
                    xpLevel: user.xpLevel || 0,
                    location: user.city || user.location || localData.city || localData.location || "Unknown Location",
                }

                setUserData(mergedData)
                // Update localStorage with fresh backend data
                localStorage.setItem("farmquest_userdata", JSON.stringify(mergedData))
                setLoading(false)
            } catch (error) {
                console.error("Error fetching user data:", error)
                // Clear storage and redirect on error
                localStorage.removeItem("token")
                localStorage.removeItem("farmquest_auth")
                localStorage.removeItem("farmquest_userdata")
                router.push("/welcome")
            }
        }


        fetchUserData()

        // Listen for local updates (e.g. from profile page)
        const handleStorageChange = (e) => {
            if (e.key === "farmquest_userdata") {
                const newData = JSON.parse(e.newValue || "{}")
                if (newData) {
                    setUserData(prev => ({ ...prev, ...newData }))
                }
            }
        }

        // Custom event for same-tab updates
        const handleCustomUpdate = () => {
            const localData = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
            setUserData(prev => ({ ...prev, ...localData }))
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('farmquest_user_update', handleCustomUpdate)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('farmquest_user_update', handleCustomUpdate)
        }
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
            "settings": "/profile", // Redirects to profile since settings are integrated there
            "impact-tracker": "/rewards",
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
                userHandle={userData.username} // Pass username as userHandle
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
