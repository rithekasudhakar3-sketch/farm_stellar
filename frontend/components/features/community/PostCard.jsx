"use client"

import React, { useState } from "react"
import { Heart, MessageCircle, Bookmark, Share2, MapPin, MoreHorizontal, BadgeCheck, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FarmerProfilePreview } from "./FarmerProfilePreview"

export function PostCard({ post, onLike, onComment, onSave }) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false)
    const [likesCount, setLikesCount] = useState(post.likesCount || 0)
    const [isSaved, setIsSaved] = useState(false)
    const [animateLike, setAnimateLike] = useState(false)

    const handleLike = () => {
        setAnimateLike(true)
        setTimeout(() => setAnimateLike(false), 500)

        const newLikedState = !isLiked
        setIsLiked(newLikedState)
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)

        if (onLike) onLike(post._id || post.id)
    }

    const handleSave = () => {
        setIsSaved(!isSaved)
        if (onSave) onSave(post._id || post.id)
    }

    // Formatting timestamp
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m`
        if (hours < 24) return `${hours}h`
        return date.toLocaleDateString()
    }

    return (
        <Card className="w-full max-w-md mx-auto mb-6 border-none shadow-none bg-background sm:border sm:border-border sm:rounded-2xl overflow-hidden transition-all duration-300">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
                <div className="flex items-center gap-3">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Avatar className="h-10 w-10 border-2 border-primary/20 cursor-pointer">
                                <AvatarImage src={post.userId?.avatar || post.userAvatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {post.userId?.name?.charAt(0) || "F"}
                                </AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-fit p-0 border-none shadow-2xl">
                            <FarmerProfilePreview farmer={post.userId} />
                        </HoverCardContent>
                    </HoverCard>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span className="font-bold text-sm text-foreground leading-none hover:underline cursor-pointer">
                                        {post.userId?.name || post.userName || "Farmer"}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-fit p-0 border-none shadow-2xl">
                                    <FarmerProfilePreview farmer={post.userId} />
                                </HoverCardContent>
                            </HoverCard>
                            {(post.userId?.isVerified || post.isVerified) && (
                                <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-current" />
                            )}
                            {post.isImpactPost && (
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" title="Eco-Impact Post" />
                            )}
                        </div>
                        <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
                            <MapPin className="h-2.5 w-2.5 mr-1" />
                            <span>{post.userId?.location || post.location || "Earth"}</span>
                            <span className="mx-1">•</span>
                            <span>{formatTime(post.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </CardHeader>

            {/* Image Container */}
            <div
                className="relative aspect-square w-full bg-muted flex items-center justify-center overflow-hidden"
                onDoubleClick={handleLike}
            >
                <img
                    src={post.images?.[0]?.url || post.imageUrl || "/placeholder-field.jpg"}
                    alt="Post content"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {animateLike && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Heart className="h-24 w-24 text-white fill-white animate-ping opacity-75" />
                    </div>
                )}

                {/* Method/Crop Badges */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    {post.cropType && (
                        <Badge className="bg-black/40 backdrop-blur-md border-white/20 text-white text-[10px] py-0 px-2 h-5">
                            🌱 {post.cropType}
                        </Badge>
                    )}
                    {post.method && (
                        <Badge className="bg-primary/60 backdrop-blur-md border-white/20 text-white text-[10px] py-0 px-2 h-5">
                            🚜 {post.method}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Actions */}
            <CardFooter className="flex flex-col items-start p-4 gap-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "transition-all duration-200 active:scale-125",
                                isLiked ? "text-red-500" : "text-foreground hover:text-muted-foreground"
                            )}
                        >
                            <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                        </button>
                        <button
                            onClick={() => onComment && onComment(post)}
                            className="text-foreground hover:text-muted-foreground transition-all active:scale-110"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </button>
                        <button className="text-foreground hover:text-muted-foreground transition-all active:scale-110">
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>
                    <button
                        onClick={handleSave}
                        className={cn(
                            "transition-all duration-200 active:scale-110",
                            isSaved ? "text-amber-500" : "text-foreground hover:text-muted-foreground"
                        )}
                    >
                        <Bookmark className={cn("h-6 w-6", isSaved && "fill-current")} />
                    </button>
                </div>

                {/* Likes Count */}
                <div className="font-bold text-sm">
                    {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
                </div>

                {/* Caption */}
                <div className="text-sm leading-relaxed">
                    <span className="font-bold mr-2">{post.userId?.name || post.userName || "Farmer"}</span>
                    <span className="text-foreground/90">{post.content}</span>

                    {/* Tags */}
                    <div className="mt-1 flex flex-wrap gap-1">
                        {post.tags?.map(tag => (
                            <span key={tag} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                #{tag}{' '}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Comments Count */}
                {(post.commentsCount > 0) && (
                    <button
                        onClick={() => onComment && onComment(post)}
                        className="text-xs text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
                    >
                        View all {post.commentsCount} comments
                    </button>
                )}
            </CardFooter>
        </Card>
    )
}
