"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [adminData, setAdminData] = useState({ name: "Admin", organization: "" })

    useEffect(() => {
        const token = localStorage.getItem("farmquest_admin_token")
        const adminInfo = localStorage.getItem("farmquest_admin")

        if (!token || !adminInfo) {
            router.push("/admin/login")
            return
        }

        try {
            const admin = JSON.parse(adminInfo)
            setAdminData({
                name: admin.name,
                organization: admin.organization
            })
        } catch (error) {
            console.error('Error parsing admin data:', error)
            router.push("/admin/login")
        }
    }, [router])

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    )
}
