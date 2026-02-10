"use client"

import * as React from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState([
        { role: "bot", content: "Hi there! I'm Stella. How can I help you with your farm today? 🌱" }
    ])
    const [inputValue, setInputValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [sessionId, setSessionId] = React.useState("")
    const scrollAreaRef = React.useRef(null)

    React.useEffect(() => {
        // Generate or retrieve session ID
        let sid = typeof window !== 'undefined' ? localStorage.getItem("chat_session_id") : null
        if (!sid) {
            sid = "session-" + Math.random().toString(36).slice(2)
            if (typeof window !== 'undefined') localStorage.setItem("chat_session_id", sid)
        }
        setSessionId(sid)
    }, [])

    const toggleChat = () => setIsOpen(!isOpen)

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputValue.trim() || isLoading) return

        const userMsg = inputValue.trim()
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setInputValue("")
        setIsLoading(true)

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
            const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

            const response = await fetch(`${backendUrl}/api/chatbot/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMsg,
                    session_id: sessionId
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || "Failed to get response");
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: "bot", content: data.response }])
        } catch (error) {
            console.error("Chat error:", error)

            if (error.message === "Token is not valid" || error.message === "No token, authorization denied") {
                setMessages(prev => [...prev, { role: "bot", content: "❌ Session expired. Logging you out..." }]);
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/auth/login";
                    }
                }, 2000);
            } else {
                setMessages(prev => [...prev, { role: "bot", content: `❌ Error: ${error.message}. Please try refreshing the page or logging in again.` }])
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-scroll
    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen, isLoading])

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Panel */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out transform origin-bottom-right",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-10 pointer-events-none absolute bottom-16 right-0"
                )}
            >
                <Card className="w-[350px] max-w-[calc(100vw-3rem)] h-[500px] shadow-xl border-primary/20 flex flex-col overflow-hidden bg-card">
                    <CardHeader className="bg-primary/10 p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/20 p-2 rounded-full">
                                <MessageCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-medium">Stella AI</CardTitle>
                                <p className="text-xs text-muted-foreground">Farm Assistant</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20" onClick={toggleChat}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground self-end rounded-br-none"
                                                : "bg-white dark:bg-muted text-foreground self-start rounded-bl-none border border-border/50"
                                        )}
                                    >
                                        {msg.role === "bot" ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1" {...props} />,
                                                        li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="bg-white dark:bg-muted text-foreground self-start rounded-2xl rounded-bl-none px-4 py-3 border border-border/50 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 bg-background border-t">
                        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                            <Input
                                placeholder="Ask about crops, soil, weather..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 rounded-full focus-visible:ring-primary bg-muted/30"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full h-10 w-10 shrink-0 transition-transform active:scale-95"
                                disabled={!inputValue.trim() || isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            {/* Toggle Button */}
            <Button
                onClick={toggleChat}
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-primary text-primary-foreground hover:bg-primary/90",
                    isOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"
                )}
            >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Open Chat</span>
            </Button>
        </div>
    )
}
