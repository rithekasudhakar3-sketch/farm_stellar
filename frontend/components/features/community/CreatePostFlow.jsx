"use client"

import React, { useState, useRef } from "react"
import { Camera, Image as ImageIcon, X, MapPin, Loader2, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function CreatePostFlow({ isOpen, onClose, user, onPostCreated }) {
    const [step, setStep] = useState(1) // 1: Select/Capture, 2: Details
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [caption, setCaption] = useState("")
    const [cropType, setCropType] = useState("")
    const [method, setMethod] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
                setStep(2)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePost = async () => {
        if (!preview || isSubmitting) return

        setIsSubmitting(true)

        try {
            // Simulate API call and XP gain
            await new Promise(resolve => setTimeout(resolve, 1500))

            const newPost = {
                id: Date.now(),
                userId: user,
                content: caption,
                imageUrl: preview,
                cropType,
                method,
                tags: ["Community", cropType, method].filter(Boolean),
                likesCount: 0,
                commentsCount: 0,
                createdAt: new Date().toISOString(),
            }

            onPostCreated(newPost)
            reset()
            onClose()
        } catch (error) {
            console.error("Failed to create post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const reset = () => {
        setStep(1)
        setImage(null)
        setPreview(null)
        setCaption("")
        setCropType("")
        setMethod("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background max-h-[90vh] flex flex-col">
                <DialogHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold">
                            {step === 1 ? "Create Post" : "Post Details"}
                        </DialogTitle>
                        {step === 2 && (
                            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-muted-foreground h-8 px-2">
                                Back
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {step === 1 ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Camera className="h-10 w-10 text-primary" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-xl">Share your farm journey</h3>
                                <p className="text-sm text-muted-foreground">Photos of your crops and fields inspire others!</p>
                            </div>
                            <div className="flex w-full gap-3 mt-4">
                                <Button
                                    className="flex-1 gap-2 h-12"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <ImageIcon className="h-5 w-5" />
                                    Gallery
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 h-12"
                                    onClick={() => fileInputRef.current.click()} // In real mobile, this triggers camera
                                >
                                    <Camera className="h-5 w-5" />
                                    Camera
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                            <div className="aspect-square w-full bg-muted">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Textarea
                                        placeholder="Write a caption... (max 220 chars)"
                                        className="flex-1 min-h-[80px] border-none focus-visible:ring-0 p-0 text-sm resize-none"
                                        value={caption}
                                        maxLength={220}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Crop Type</label>
                                        <Select value={cropType} onValueChange={setCropType}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue placeholder="Select Crop" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Rice">Rice</SelectItem>
                                                <SelectItem value="Wheat">Wheat</SelectItem>
                                                <SelectItem value="Tomato">Tomato</SelectItem>
                                                <SelectItem value="Chili">Chili</SelectItem>
                                                <SelectItem value="Organic Veg">Organic Veg</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Farming Method</label>
                                        <Select value={method} onValueChange={setMethod}>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue placeholder="Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Organic">Organic</SelectItem>
                                                <SelectItem value="Sustainable">Sustainable</SelectItem>
                                                <SelectItem value="Traditional">Traditional</SelectItem>
                                                <SelectItem value="Smart Farm">Smart Farm</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground py-2 border-t border-b">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-xs">{user?.location || "Detecting location..."}</span>
                                </div>

                                <div className="bg-primary/5 rounded-xl p-3 flex items-center justify-between border border-primary/10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase">Estimated Rewards</p>
                                            <p className="text-xs font-bold">+50 XP Community Bonus</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-primary/40" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {step === 2 && (
                    <DialogFooter className="p-4 border-t gap-3 sm:flex-row">
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11"
                            disabled={isSubmitting}
                            onClick={handlePost}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post to Feed"
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
