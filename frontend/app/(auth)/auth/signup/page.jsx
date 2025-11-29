"use client"

import { PhoneLoginScreen } from "@/components/auth/phone-login-screen"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const router = useRouter()

    return (
        <PhoneLoginScreen
            isSignup={true}
            onSuccess={(phone) => router.push(`/auth/verify?phone=${phone}&type=signup`)}
            onBack={() => router.push("/welcome")}
        />
    )
}
