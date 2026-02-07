"use client"

import { RewardStore } from "@/components/features/farmer/reward-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RewardsPage() {
    const router = useRouter()
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showOrderModal, setShowOrderModal] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [deliveryAddress, setDeliveryAddress] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    })

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/welcome")
                return
            }

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            const response = await fetch(`${backendUrl}/api/users/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch user data")
            }

            const user = await response.json()
            const localData = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")

            const mergedData = {
                ...localData,
                name: user.name,
                phone: user.phone,
                city: user.city,
                xp: user.xp || 0,
                xpLevel: user.xpLevel || 0,
                purchasedRewards: user.purchasedRewards || localData.purchasedRewards || []
            }

            setUserData(mergedData)
            localStorage.setItem("farmquest_userdata", JSON.stringify(mergedData))

            // Pre-fill delivery address
            setDeliveryAddress({
                name: user.name || '',
                phone: user.phone || '',
                address: '',
                city: user.city || '',
                state: '',
                pincode: ''
            })
        } catch (error) {
            console.error("Error fetching user data:", error)
            // Fallback to local data
            const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}")
            setUserData(data)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePurchase = async (item) => {
        // Add item to cart and show order form
        setSelectedItems([{
            itemId: item.id,
            name: item.name,
            category: item.category || 'Reward',
            xpCost: item.cost,
            quantity: 1,
            icon: item.icon
        }])
        setShowOrderModal(true)
        return { success: true, updatedXP: userData.xp } // Temporary, actual deduction happens on order creation
    }

    const handleSubmitOrder = async () => {
        try {
            const token = localStorage.getItem("token")
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

            // Validate delivery address
            if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
                alert("Please fill in all delivery address fields")
                return
            }

            // Create purchase order
            const response = await fetch(`${backendUrl}/api/purchase-orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: selectedItems,
                    deliveryAddress,
                    notes: ''
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to create purchase order")
            }

            const result = await response.json()

            // Update local XP (it's been reserved)
            const updatedData = {
                ...userData,
                xp: result.updatedXP
            }
            localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData))
            setUserData(updatedData)

            // Close modal and show success
            setShowOrderModal(false)
            setSelectedItems([])

            alert(`✅ Purchase order created successfully!\n\nOrder Number: ${result.purchaseOrder.billNumber}\nStatus: Pending Admin Approval\n\nYour XP has been reserved. You'll receive a notification once the admin approves your order.`)

            // Refresh user data
            await fetchUserData()
        } catch (error) {
            console.error("Error creating purchase order:", error)
            alert(`Failed to create purchase order: ${error.message}`)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Please log in to access rewards</div>
    }

    return (
        <>
            <RewardStore
                userData={userData}
                onBack={() => router.push("/dashboard")}
                onPurchase={handlePurchase}
            />

            {/* Order Confirmation Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black mb-6">Complete Your Order</h2>

                        {/* Order Summary */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <h3 className="font-bold mb-3">Order Summary</h3>
                            {selectedItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center mb-2">
                                    <span className="flex items-center gap-2">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </span>
                                    <span className="font-bold text-primary">{item.xpCost} XP</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-300 dark:border-gray-700 mt-3 pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">{selectedItems.reduce((sum, item) => sum + item.xpCost, 0)} XP</span>
                            </div>
                        </div>

                        {/* Delivery Address Form */}
                        <div className="space-y-4 mb-6">
                            <h3 className="font-bold">Delivery Address</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={deliveryAddress.name}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={deliveryAddress.phone}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                            />
                            <textarea
                                placeholder="Street Address"
                                value={deliveryAddress.address}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                                rows="2"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={deliveryAddress.city}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={deliveryAddress.state}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={deliveryAddress.pincode}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                ℹ️ Your XP will be reserved when you submit this order. Once an admin approves your order, you'll receive a bill and your items will be shipped to the address above.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowOrderModal(false)
                                    setSelectedItems([])
                                }}
                                className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitOrder}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Submit Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
