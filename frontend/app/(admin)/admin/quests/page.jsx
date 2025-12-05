"use client"

import { AdminQuestsScreen } from "@/components/admin/quests-screen"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AdminQuestsPage() {
    const router = useRouter()
    const [quests, setQuests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                setLoading(true)
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
                const token = localStorage.getItem("farmquest_admin_token")
                
                const response = await fetch(`${backendUrl}/api/quests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch quests: ${response.statusText}`)
                }

                const data = await response.json()
                setQuests(data)
                setError(null)
            } catch (err) {
                console.error("Error fetching quests:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchQuests()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quests...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return <AdminQuestsScreen quests={quests} onBack={() => router.push("/admin/dashboard")} />
}
