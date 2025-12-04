"use client"

import * as React from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState([
        { role: "bot", content: "Hi there! How can I help you with your farm today?" }
    ])
    const [inputValue, setInputValue] = React.useState("")
    const scrollAreaRef = React.useRef(null)

    const toggleChat = () => setIsOpen(!isOpen)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const newMessages = [...messages, { role: "user", content: inputValue }]
        setMessages(newMessages)
        setInputValue("")

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "I'm just a demo bot for now, but I'm listening!" }
            ])
        }, 1000)
    }

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen])

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
                            <CardTitle className="text-base font-medium">Farm Assistant</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20" onClick={toggleChat}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground self-end rounded-br-none"
                                                : "bg-muted text-foreground self-start rounded-bl-none"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 bg-background border-t">
                        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                            <Input
                                placeholder="Ask something..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 rounded-full focus-visible:ring-primary"
                            />
                            <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={!inputValue.trim()}>
                                <Send className="h-4 w-4" />
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
                    "h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 bg-primary text-primary-foreground",
                    isOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"
                )}
            >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Open Chat</span>
            </Button>
        </div>
    )
}
