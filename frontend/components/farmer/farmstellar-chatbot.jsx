"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FarmstellarChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "👋 Namaste! I'm FarmStellar Bot, your farming companion. How can I help you today?",
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages, isLoading])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return

        const userMessage = {
            id: messages.length + 1,
            role: "user",
            content: inputMessage,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage("")
        setIsLoading(true)

        try {
            // TODO: Replace with your actual chatbot API endpoint
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            const token = localStorage.getItem("token")

            const response = await fetch(`${backendUrl}/api/chatbot/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: inputMessage })
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()

            const botMessage = {
                id: messages.length + 2,
                role: "assistant",
                content: data.response || "I'm here to help! Ask me anything about farming.",
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error("Chatbot error:", error)

            // Fallback response
            const fallbackMessage = {
                id: messages.length + 2,
                role: "assistant",
                content: "I'm currently learning! In the meantime, you can ask me about:\n\n🌱 Crop recommendations\n💧 Watering schedules\n🐛 Pest control\n🌾 Soil health\n📚 Quest tips\n\nWhat would you like to know?",
                timestamp: new Date()
            }

            setMessages(prev => [...prev, fallbackMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 border-2 border-white/30 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
                        aria-label="Open FarmStellar Bot"
                    >
                        {/* Animated background pulse */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-green-200/30 rounded-full animate-ping opacity-75" />

                        {/* Rotating background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" style={{ animation: 'spin 3s linear infinite' }} />

                        {/* Icon - Farming themed */}
                        <div className="relative z-10 flex items-center justify-center">
                            <svg
                                className="h-9 w-9 text-white drop-shadow-lg"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Sun/Growth icon */}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                                <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
                            </svg>
                        </div>

                        {/* Glowing notification badge */}
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                    </Button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[400px] max-h-[calc(100vh-80px)] h-[600px] bg-background rounded-2xl shadow-2xl border-2 border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-700 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">FarmStellar Bot</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                                    <p className="text-white/90 text-xs">Online</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-green-50/30 to-background">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                                            : "bg-white border border-border shadow-sm"
                                            }`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <Bot className="h-4 w-4 text-green-600" />
                                                <span className="text-xs font-semibold text-green-600">FarmStellar Bot</span>
                                            </div>
                                        )}
                                        <p className={`text-sm whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-foreground"
                                            }`}>
                                            {message.content}
                                        </p>
                                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-muted-foreground"
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-green-600" />
                                            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                            <span className="text-sm text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-background">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Ask me anything about farming..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 rounded-full border-2 focus-visible:ring-green-500"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="rounded-full h-10 w-10 p-0 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                size="icon"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Powered by FarmStellar AI 🌾
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
