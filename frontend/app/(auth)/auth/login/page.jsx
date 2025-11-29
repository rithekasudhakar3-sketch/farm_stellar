"use client"

import { PhoneLoginScreen } from "@/components/auth/phone-login-screen"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    return (
        <PhoneLoginScreen
            isSignup={false}
            onSuccess={(phone) => router.push(`/auth/verify?phone=${phone}&type=login`)}
            onBack={() => router.push("/welcome")}
        />
    )
}
