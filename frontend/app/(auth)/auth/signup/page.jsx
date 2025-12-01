"use client"

import { PhoneLoginScreen } from "@/components/auth/phone-login-screen"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const router = useRouter()

    const handleSignupSuccess = (phone, data) => {
        // Phone number and OTP sent - navigate to verification
        router.push(`/auth/verify?phone=${phone}&type=signup`)
    }

    return (
        <PhoneLoginScreen
            isSignup={true}
            onSuccess={handleSignupSuccess}
            onBack={() => router.push("/welcome")}
        />
    )
}
