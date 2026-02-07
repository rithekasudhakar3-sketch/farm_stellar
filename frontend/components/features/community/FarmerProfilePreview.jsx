"use client"

import React from "react"
import { Award, Heart, CheckCircle2, MapPin, Sprout, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FarmerProfilePreview({ farmer }) {
    if (!farmer) return null;

    return (
        <Card className="w-full max-w-[300px] border-none shadow-lg bg-gradient-to-b from-white to-[#FDFCFB] overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 relative">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                        <AvatarImage src={farmer.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                            {farmer.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <CardContent className="pt-10 pb-6 px-4 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-bold text-lg text-foreground">{farmer.name}</h3>
                    <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500" />
                </div>

                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mb-4">
                    <MapPin className="h-3 w-3" /> {farmer.location || "Punjab, IN"}
                </p>

                <div className="grid grid-cols-3 w-full gap-2 mb-6 text-center">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold">{farmer.completedQuests || 24}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Quests</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold">{farmer.likesReceived || "1.2k"}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Likes</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold">{farmer.badgesCount || 8}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Badges</span>
                    </div>
                </div>

                <div className="w-full space-y-3">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Sprout className="h-3 w-3" /> Crops Grown
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {["Rice", "Wheat", "Tomato"].map(crop => (
                                <Badge key={crop} variant="secondary" className="px-2 py-0 h-5 text-[10px] font-medium bg-primary/5 text-primary border-primary/10">
                                    {crop}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Award className="h-3 w-3" /> Impact Badges
                        </p>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200" title="Soil Savior">
                                <CheckCircle2 className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200" title="Water Hero">
                                <Heart className="h-4 w-4 text-blue-600 fill-blue-600" />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center border border-green-200" title="Organic Pro">
                                <Award className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
