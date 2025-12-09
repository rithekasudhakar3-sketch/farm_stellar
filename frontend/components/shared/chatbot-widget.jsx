"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { MessageCircle, X, Send, Leaf, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hello! I'm Stella AI. Ask me about crops, soil, or farming! 🌱" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const scrollRef = useRef(null)

    useEffect(() => {
        // Generate or retrieve session ID
        let storedSession = localStorage.getItem("farmstellar_chat_session")
        if (!storedSession) {
            storedSession = "session_" + Date.now()
            localStorage.setItem("farmstellar_chat_session", storedSession)
        }
        setSessionId(storedSession)
    }, [])

    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSendMessage = async () => {
        if (!input.trim()) return

        const userMessage = input.trim()
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:4000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to fetch response")
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: "bot", content: data.answer }])
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting to the farm. Please try again later. 🚜" }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-xl border-2 border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex flex-col overflow-hidden">
                    <CardHeader className="bg-primary/10 border-b border-primary/10 py-3 px-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/20 p-1.5 rounded-full">
                                    <Leaf className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-primary">Stella AI</CardTitle>
                                    <p className="text-xs text-muted-foreground">Your farming assistant</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Close chat</span>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0 relative">
                        <div
                            ref={scrollRef}
                            className="h-full overflow-y-auto p-4 space-y-4"
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex w-full mb-2",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted text-foreground rounded-bl-none border border-border"
                                        )}
                                    >
                                        {msg.content.split('\n').map((line, i) => (
                                            <span key={i} className="block min-h-[1.2em]">
                                                {line}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start w-full">
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none border border-border flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 bg-muted/30 border-t border-border mt-auto shrink-0">
                        <form
                            className="flex w-full items-center gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        >
                            <Input
                                placeholder="Ask about farming..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-background focus-visible:ring-primary"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                            >
                                <Send className="w-4 h-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl p-0",
                    isOpen ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground rotate-90" : "bg-primary hover:bg-primary/90 text-primary-foreground animate-bounce-slow"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
                <span className="sr-only">Toggle Chat</span>
            </Button>
        </div>
    )
}
