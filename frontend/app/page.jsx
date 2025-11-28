"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("farmquest_auth")

    if (auth) {
      const { userType } = JSON.parse(auth)
      if (userType === "admin") {
        router.replace("/admin/dashboard")
      } else {
        router.replace("/dashboard")
      }
    } else {
      router.replace("/welcome")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
