"use client"

import React, { useState, useEffect } from "react"
import {
    ArrowLeft, Plus, Sparkles, TrendingUp, Search,
    MapPin, Award, Users, Camera, Filter, LayoutGrid, List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "./PostCard"
import { CreatePostFlow } from "./CreatePostFlow"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MOCK_MEMBER_STORIES = [
    { id: 1, name: "Ramesh K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh", farm: "Green Fields", badges: 5 },
    { id: 2, name: "Sita Devi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sita", farm: "Sunshine Farm", badges: 3 },
    { id: 3, name: "Arjun S.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", farm: "Golden Harvest", badges: 4 },
    { id: 4, name: "Meera P.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera", farm: "Organic Oasis", badges: 6 },
    { id: 5, name: "Amit B.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit", farm: "Smart Soil", badges: 2 },
]

const MOCK_POSTS = [
    {
        id: 1,
        userId: { name: "Ramesh Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh", location: "Punjab, IN", isVerified: true },
        content: "Just harvested my first batch of organic tomatoes! 🍅 The soil booster quest really helped improve the yield. #Organic #SustainableFarming",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop",
        cropType: "Tomato",
        method: "Organic",
        likesCount: 124,
        commentsCount: 12,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
        isImpactPost: true,
        tags: ["Organic", "Tomato", "Harvest2024"]
    },
    {
        id: 2,
        userId: { name: "Sita Devi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sita", location: "Kerala, IN", isVerified: true },
        content: "Transitioning to drip irrigation today. Every drop counts! 💧🙏 #WaterConservation #SmartFarming",
        imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1000&auto=format&fit=crop",
        cropType: "Rice",
        method: "Smart Farm",
        likesCount: 89,
        commentsCount: 5,
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2h ago
        isImpactPost: true,
        tags: ["WaterSaving", "SmartFarming"]
    },
    {
        id: 3,
        userId: { name: "Arjun Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", location: "Haryana, IN", isVerified: false },
        content: "Can anyone identify this pest on my mustard leaves? Looking for organic solutions. 🐛",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
        cropType: "Mustard",
        method: "Pest Control",
        likesCount: 45,
        commentsCount: 28,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        tags: ["HelpNeeded", "Mustard"]
    }
]

export function CommunityScreen({ userData, onBack }) {
    const [posts, setPosts] = useState(MOCK_POSTS)
    const [isPostingOpen, setIsPostingOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("all")
    const [viewType, setViewType] = useState("feed") // "feed" or "grid"

    const handleCreatePost = (newPost) => {
        setPosts([newPost, ...posts])
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24">
            {/* Premium Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-black text-primary leading-tight flex items-center gap-2" style={{ fontFamily: "Mali, cursive" }}>
                            Community <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Farmer Social Feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src={userData?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{userData?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* Sustainable Stories (Avatar Scroll) */}
            <div className="py-4 bg-white border-b border-border/40">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-4 px-4">
                        {/* Create Story trigger */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="h-16 w-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group"
                                onClick={() => setIsPostingOpen(true)}
                            >
                                <Plus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">Post</span>
                        </div>

                        {MOCK_MEMBER_STORIES.map((member) => (
                            <div key={member.id} className="flex flex-col items-center gap-1 group cursor-pointer">
                                <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-primary to-emerald-500">
                                    <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white">
                                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-foreground/80">{member.name}</span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
            </div>

            <div className="max-w-md mx-auto sm:px-4">
                {/* Top Sustainable Posts Header */}
                <div className="px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-amber-600" />
                            </div>
                            <h2 className="font-bold text-lg">Top Sustainable Posts</h2>
                        </div>
                        <Button variant="link" className="text-primary text-xs font-bold">View Leaderboard</Button>
                    </div>

                    {/* Top Post Miniature Carousel */}
                    <ScrollArea className="w-full">
                        <div className="flex gap-3 pb-2">
                            {MOCK_POSTS.filter(p => p.isImpactPost).map(post => (
                                <div key={post.id} className="relative w-40 h-52 shrink-0 rounded-2xl overflow-hidden group shadow-md border border-border/50">
                                    <img src={post.imageUrl} className="w-full h-full object-cover" alt="Top post" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Avatar className="h-4 w-4 border border-white/40">
                                                <AvatarImage src={post.userId.avatar} />
                                            </Avatar>
                                            <span className="text-[10px] text-white font-bold truncate">{post.userId.name}</span>
                                        </div>
                                        <p className="text-[10px] text-white/90 line-clamp-2 leading-tight">{post.content}</p>
                                        <div className="mt-1 flex items-center gap-1">
                                            <Award className="h-2.5 w-2.5 text-amber-400" />
                                            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Top Impact</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="w-40 h-52 shrink-0 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-4 text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => setIsPostingOpen(true)}>
                                <Camera className="h-8 w-8 text-primary/40" />
                                <p className="text-[10px] font-bold text-primary/60">Share your impact to be featured!</p>
                            </div>
                        </div>
                        <ScrollBar orientation="horizontal" className="hidden" />
                    </ScrollArea>
                </div>

                {/* Feed Filters & View Toggle */}
                <div className="px-4 mb-4 flex items-center justify-between gap-4 sticky top-[60px] z-30 bg-[#FDFCFB]/90 backdrop-blur-sm py-2">
                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-white/50 border border-border shadow-sm rounded-full w-full p-1 h-10">
                            <TabsTrigger value="all" className="rounded-full text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white flex-1 transition-all">Global</TabsTrigger>
                            <TabsTrigger value="village" className="rounded-full text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white flex-1 transition-all">My Village</TabsTrigger>
                            <TabsTrigger value="panchayat" className="rounded-full text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white flex-1 transition-all">Panchayat</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex bg-white border border-border rounded-full p-1 h-10">
                        <Button
                            variant={viewType === "feed" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setViewType("feed")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewType === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setViewType("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* The Feed */}
                <div className={viewType === "feed" ? "space-y-4" : "grid grid-cols-2 gap-2 px-2"}>
                    {posts.map((post) => (
                        viewType === "feed" ? (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={(id) => console.log("Liked", id)}
                                onComment={(post) => console.log("Commenting on", post)}
                            />
                        ) : (
                            <div key={post.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Post" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <div className="flex items-center gap-1 text-white font-bold text-xs">
                                        <Heart className="h-4 w-4 fill-white" /> {post.likesCount}
                                    </div>
                                    <div className="flex items-center gap-1 text-white font-bold text-xs">
                                        <MessageCircle className="h-4 w-4 fill-white" /> {post.commentsCount}
                                    </div>
                                </div>
                                {post.isImpactPost && (
                                    <div className="absolute top-2 right-2 h-6 w-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                                        <Sparkles className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>

                {/* End of Feed */}
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                    <div className="h-1 bg-gradient-to-r from-transparent via-border to-transparent w-full mb-4"></div>
                    <Users className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium">You've reached the end of the Garden!</p>
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Back to Top
                    </Button>
                </div>
            </div>

            {/* Floating Create Post Button (Mobile) */}
            <Button
                onClick={() => setIsPostingOpen(true)}
                className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white z-50 transition-all active:scale-90 flex md:hidden items-center justify-center"
            >
                <Plus className="h-8 w-8" />
            </Button>

            {/* Post Creation Flow */}
            <CreatePostFlow
                isOpen={isPostingOpen}
                onClose={() => setIsPostingOpen(false)}
                user={userData}
                onPostCreated={handleCreatePost}
            />
        </div>
    )
}
