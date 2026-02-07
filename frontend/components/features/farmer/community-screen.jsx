"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  ArrowLeft, Plus, Heart, MessageCircle, MapPin, Send, ImageIcon, X,
  Leaf, Flower2, Filter, TrendingUp, Camera, Sparkles, Award,
  BadgeCheck, Bookmark, Share2, MoreHorizontal, ChevronRight, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"

export function CommunityScreen({ userData, onBack }) {
  const [posts, setPosts] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [cropType, setCropType] = useState("")
  const [farmingMethod, setFarmingMethod] = useState("")
  const [uploadedImages, setUploadedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [showLevelFilter, setShowLevelFilter] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedLevel])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      let url = `${backendUrl}/api/community/posts?limit=20`

      if (selectedLevel === "district" && userData?.district) {
        url += `&level=district&location=${encodeURIComponent(userData.district)}`
      } else if (selectedLevel === "panchayat" && userData?.panchayat) {
        url += `&level=panchayat&location=${encodeURIComponent(userData.panchayat)}`
      }

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length + uploadedImages.length > 4) {
      alert("Maximum 4 images allowed")
      return
    }
    setUploadedImages([...uploadedImages, ...files])
  }

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      const imagePromises = uploadedImages.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const base64Images = await Promise.all(imagePromises)

      const response = await fetch(`${backendUrl}/api/community/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostContent,
          images: base64Images,
          postType: "general",
          cropType: cropType,
          method: farmingMethod
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPosts([data.post, ...posts])
        resetPostForm()
        setShowPostModal(false)
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetPostForm = () => {
    setNewPostContent("")
    setUploadedImages([])
    setCropType("")
    setFarmingMethod("")
  }

  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      // Optimistic UI update
      setPosts(currentPosts => currentPosts.map(post => {
        if (post._id === postId) {
          const isLiked = !post.isLiked
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? (post.likesCount || 0) + 1 : (post.likesCount || 0) - 1
          }
        }
        return post
      }))

      const response = await fetch(`${backendUrl}/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // Rollback on failure
        fetchPosts()
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      fetchPosts()
    }
  }

  const openCommentModal = (post) => {
    setSelectedPost(post)
    setShowCommentModal(true)
  }

  const submitComment = async () => {
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      const response = await fetch(`${backendUrl}/api/community/posts/${selectedPost._id}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newComment })
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(posts.map(post =>
          post._id === selectedPost._id
            ? { ...post, commentsCount: data.commentsCount }
            : post
        ))
        setNewComment("")
        setShowCommentModal(false)
        setSelectedPost(null)
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return date.toLocaleDateString()
  }

  const getLevelLabel = (level) => {
    const labels = {
      all: "Global Feed",
      district: "My District",
      panchayat: "My Panchayat"
    }
    return labels[level] || "Global Feed"
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-primary leading-tight flex items-center gap-2" style={{ fontFamily: "Mali, cursive" }}>
              Community <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{getLevelLabel(selectedLevel)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative"
            onClick={() => setShowLevelFilter(!showLevelFilter)}
          >
            <Filter className="h-5 w-5" />
            {selectedLevel !== 'all' && <div className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border border-white" />}
          </Button>
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarImage src={userData?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{userData?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Level Filter Dropdown */}
      {showLevelFilter && (
        <div className="mx-4 mt-2 p-2 bg-white rounded-2xl border-2 border-primary/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["all", "district", "panchayat"].map((level) => (
              <button
                key={level}
                onClick={() => {
                  setSelectedLevel(level)
                  setShowLevelFilter(false)
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                  selectedLevel === level
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {getLevelLabel(level)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simple "Stories" section for active users check */}
      <div className="py-4 bg-white border-b border-border/40">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-4">
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-14 w-14 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group"
                onClick={() => setShowPostModal(true)}
              >
                <Plus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">Post</span>
            </div>
            {posts.slice(0, 5).map((post, i) => (
              <div key={post._id + i} className="flex flex-col items-center gap-1">
                <div className="h-14 w-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-primary to-emerald-500">
                  <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white flex items-center justify-center">
                    {post.userId?.avatar ? (
                      <img src={post.userId.avatar} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-primary">{post.userId?.name?.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-foreground/80 truncate w-14 text-center">{post.userId?.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      <div className="max-w-md mx-auto py-4">
        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center animate-pulse">
              <Loader2 className="h-10 w-10 text-primary/40 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Tending our garden...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-primary/10 rounded-3xl p-12 text-center mx-4">
              <Flower2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">The field is empty</h3>
              <p className="text-sm text-muted-foreground">Be the first to share your farming story! 🌱</p>
              <Button onClick={() => setShowPostModal(true)} className="mt-6 rounded-full px-8">Create Post</Button>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div
                key={post._id}
                className="bg-white border-none shadow-none sm:border sm:border-border/50 sm:rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={post.userId?.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {post.userId?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">{post.userId?.name || "Farmer"}</span>
                        {post.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-current" />}
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 mr-1" />
                        <span>{post.userId?.location || post.district || "Punjab, IN"}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTimestamp(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Image(s) */}
                {post.images && post.images.length > 0 && (
                  <div className="relative aspect-square w-full bg-muted flex items-center justify-center overflow-hidden group">
                    <img
                      src={post.images[0].url || "/placeholder-field.jpg"}
                      alt="Post content"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Crop/Method Badges on Image */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
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
                )}

                {/* Post Actions */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleLike(post._id)}
                        className={cn(
                          "transition-all duration-200 active:scale-125",
                          post.isLiked ? "text-red-500" : "text-foreground hover:text-muted-foreground"
                        )}
                      >
                        <Heart className={cn("h-6 w-6", post.isLiked && "fill-current")} />
                      </button>
                      <button
                        onClick={() => openCommentModal(post)}
                        className="text-foreground hover:text-muted-foreground transition-all active:scale-110"
                      >
                        <MessageCircle className="h-6 w-6" />
                      </button>
                      <button className="text-foreground hover:text-muted-foreground transition-all active:scale-110">
                        <Share2 className="h-6 w-6" />
                      </button>
                    </div>
                    <button className="text-foreground hover:text-muted-foreground transition-all active:scale-110">
                      <Bookmark className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="font-bold text-sm">
                    {(post.likesCount || 0).toLocaleString()} likes
                  </div>

                  <div className="text-sm leading-relaxed">
                    <span className="font-bold mr-2">{post.userId?.name}</span>
                    <span className="text-foreground/90">{post.content}</span>
                    {/* Tags could be parsed here */}
                  </div>

                  {post.commentsCount > 0 && (
                    <button
                      onClick={() => openCommentModal(post)}
                      className="text-xs text-muted-foreground hover:text-foreground mt-0.5"
                    >
                      View all {post.commentsCount} comments
                    </button>
                  )}
                </div>
              </div>
            )))}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <Button
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white z-50 transition-all active:scale-90 flex items-center justify-center"
      >
        <Plus className="h-8 w-8" />
      </Button>

      {/* Improved Create Post Modal */}
      <Dialog open={showPostModal} onOpenChange={(open) => !open && setShowPostModal(false)}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" /> Create Post
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {uploadedImages.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-2 px-4">
                  <h3 className="font-bold text-xl">Share your farm journey</h3>
                  <p className="text-sm text-muted-foreground">Show off your hard work and help others learn!</p>
                </div>
                <Button
                  className="w-full gap-2 h-12 rounded-2xl max-w-[280px]"
                  onClick={() => fileInputRef.current.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                  Select Photo
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="aspect-square w-full bg-muted relative">
                  <img
                    src={URL.createObjectURL(uploadedImages[0])}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setUploadedImages([])}
                    className="absolute top-4 right-4 bg-black/50 text-white h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.avatar} />
                      <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="Write a caption about your farm..."
                      className="flex-1 min-h-[100px] border-none focus-visible:ring-0 p-0 text-sm resize-none"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Crop Type</label>
                      <Select value={cropType} onValueChange={setCropType}>
                        <SelectTrigger className="h-10 rounded-xl text-xs">
                          <SelectValue placeholder="Select Crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rice">Rice</SelectItem>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Tomato">Tomato</SelectItem>
                          <SelectItem value="Chili">Chili</SelectItem>
                          <SelectItem value="Grapes">Grapes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Method</label>
                      <Select value={farmingMethod} onValueChange={setFarmingMethod}>
                        <SelectTrigger className="h-10 rounded-xl text-xs">
                          <SelectValue placeholder="Select Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Organic">Organic</SelectItem>
                          <SelectItem value="Traditional">Traditional</SelectItem>
                          <SelectItem value="Smart Farm">Smart Farm</SelectItem>
                          <SelectItem value="Regenerative">Regenerative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Earn +20 XP</p>
                        <p className="text-[10px] text-muted-foreground font-medium">Community Bonus</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-primary/40" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t gap-3 sm:flex-row shadow-[0_-4px_10px_rgba(0,0,0,0.05)] bg-background">
            <Button
              variant="ghost"
              className="rounded-xl h-12 flex-1"
              onClick={() => setShowPostModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl"
              disabled={isSubmitting || !newPostContent.trim() || uploadedImages.length === 0}
              onClick={handleCreatePost}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Garden Story"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={(open) => !open && setShowCommentModal(false)}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-bold">Comments</DialogTitle>
          </DialogHeader>
          <div className="p-4 max-h-[300px] overflow-y-auto">
            {selectedPost && (
              <div className="flex gap-3 items-start mb-6">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedPost.userId?.avatar} />
                  <AvatarFallback>{selectedPost.userId?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/40 p-3 rounded-2xl">
                  <p className="text-xs font-bold mb-1">{selectedPost.userId?.name}</p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{selectedPost.content}</p>
                </div>
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground my-8">Be the first to share your thoughts!</p>
          </div>
          <div className="p-4 border-t bg-background flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="rounded-full h-11 bg-muted/30"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              size="icon"
              className="rounded-full h-11 w-11 shrink-0"
              onClick={submitComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
