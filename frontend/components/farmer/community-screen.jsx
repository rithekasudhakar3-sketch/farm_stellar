"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft, Plus, Heart, MessageCircle, MapPin, Send, ImageIcon, X,
  Leaf, Flower2, Filter, TrendingUp, Camera
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function CommunityScreen({ userData, onBack }) {
  const [posts, setPosts] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [newPost, setNewPost] = useState("")
  const [uploadedImages, setUploadedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState("all") // "all", "village", "panchayat", "block"
  const [showLevelFilter, setShowLevelFilter] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [selectedLevel])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      let url = `${backendUrl}/api/community/posts?limit=20`

      console.log("Fetching posts with level:", selectedLevel, "User Data:", userData)

      if (selectedLevel === "district" && userData?.district) {
        url += `&level=district&location=${encodeURIComponent(userData.district)}`
      } else if (selectedLevel === "panchayat" && userData?.panchayat) {
        url += `&level=panchayat&location=${encodeURIComponent(userData.panchayat)}`
      } else if (selectedLevel !== "all") {
        console.warn("Missing location data for level:", selectedLevel)
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
    if (!newPost.trim()) return

    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      // Convert images to base64
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
          content: newPost,
          images: base64Images,
          postType: "general"
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPosts([data.post, ...posts])
        setNewPost("")
        setUploadedImages([])
        setShowPostModal(false)
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    }
  }

  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token")
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

      const response = await fetch(`${backendUrl}/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Update post in state
        setPosts(posts.map(post =>
          post._id === postId
            ? { ...post, likesCount: data.likesCount, isLiked: data.isLiked }
            : post
        ))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const openCommentModal = (post) => {
    setSelectedPost(post)
    setShowCommentModal(true)
  }

  const submitComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment")
      return
    }

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
        // Update post in state
        setPosts(posts.map(post =>
          post._id === selectedPost._id
            ? { ...post, commentsCount: data.commentsCount }
            : post
        ))
        setNewComment("")
        setShowCommentModal(false)
        setSelectedPost(null)
      } else {
        const error = await response.json()
        alert(error.message || "Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment")
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getLevelLabel = (level) => {
    const labels = {
      all: "All",
      district: "My District",
      panchayat: "My Panchayat"
    }
    return labels[level] || "All"
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-[1.5px] border-border rounded-2xl shadow-lg border-b-2 border-primary/20 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto relative">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className="text-2xl font-bold text-foreground flex items-center gap-2"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <Flower2 className="w-6 h-6 text-accent" />
            Community Garden
          </h1>
          <div className="absolute -top-2 right-4 opacity-20">
            <Leaf className="w-8 h-8 text-primary animate-sway" />
          </div>
        </div>

        {/* Level Filter */}
        <div className="mt-4 max-w-4xl mx-auto relative">
          <button
            onClick={() => setShowLevelFilter(!showLevelFilter)}
            className="w-full flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              {getLevelLabel(selectedLevel)}
            </span>
            <TrendingUp className={`w-4 h-4 transition-transform ${showLevelFilter ? "rotate-180" : ""}`} />
          </button>

          {showLevelFilter && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-20">
              {["all", "district", "panchayat"].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedLevel(level)
                    setShowLevelFilter(false)
                  }}
                  className={`w-full p-3 text-left text-sm hover:bg-primary/10 transition-colors ${selectedLevel === level ? "bg-primary/20 font-semibold" : ""
                    }`}
                >
                  {getLevelLabel(level)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filter Indicator */}
        {selectedLevel !== 'all' && (
          <div className="text-center mt-2">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Showing posts from: {selectedLevel === 'district' ? userData?.district : userData?.panchayat || "Unknown"}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-5">
        {/* Create Post Button */}
        <Button
          onClick={() => setShowPostModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-2xl h-12 text-base font-semibold"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Your Story 🌱
        </Button>

        {/* Posts Feed */}
        <div className="space-y-5">
          {loading ? (
            <div className="bg-card border-[1.5px] border-border rounded-2xl p-12 text-center shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)]">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-card border-[1.5px] border-border rounded-2xl p-12 text-center shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)]">
              <Flower2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share your farming story! 🌱</p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div
                key={post._id}
                className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity animate-grow"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-bold border-2 border-primary/20">
                    {post.userId?.name?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                      {post.userId?.name || "Unknown User"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{post.district || post.userId?.district || "Unknown"}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {post.title && (
                  <h4 className="font-bold text-foreground mb-2 text-lg">{post.title}</h4>
                )}
                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-3 mb-4 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url || img.key || "/placeholder.svg"}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-52 object-cover rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-colors"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-6 text-muted-foreground pt-3 border-t-2 border-dashed border-border">
                  <button
                    onClick={() => toggleLike(post._id, post.isLiked)}
                    className={`flex items-center gap-2 hover:text-primary transition-colors group ${post.isLiked ? 'text-primary' : ''}`}
                  >
                    <Heart className={`w-5 h-5 group-hover:scale-110 transition-all ${post.isLiked ? 'fill-primary' : ''}`} />
                    <span className="text-sm font-medium">{post.likesCount || 0} 💚</span>
                  </button>
                  <button
                    onClick={() => openCommentModal(post)}
                    className="flex items-center gap-2 hover:text-primary transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{post.commentsCount || 0} 💬</span>
                  </button>
                </div>
              </div>
            )))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <>
          <div className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-40" onClick={() => setShowPostModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold" style={{ fontFamily: "Mali, cursive" }}>
                Share Your Story
              </h2>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Post Title"
              className="w-full p-3 mb-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none bg-background text-foreground"
              autoComplete="off"
            />

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your farming tips, questions, or experiences... 🌿"
              className="w-full min-h-32 mb-4 p-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none resize-none bg-background text-foreground"
            />

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {uploadedImages.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-2xl border-2 border-border"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors">
                <Camera className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  Add Photos ({uploadedImages.length}/4) 📸
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadedImages.length >= 4}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreatePost}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-2xl h-11"
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
              <Button
                onClick={() => {
                  setShowPostModal(false)
                  setUploadedImages([])
                  setNewPost("")
                }}
                variant="outline"
                className="flex-1 rounded-2xl h-11 border-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {showCommentModal && selectedPost && (
        <>
          <div className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-40" onClick={() => setShowCommentModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-2xl z-50 relative">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold" style={{ fontFamily: "Mali, cursive" }}>
                Add Comment
              </h2>
            </div>

            <div className="mb-4 p-4 bg-muted/30 rounded-2xl">
              <p className="font-semibold text-sm mb-1">{selectedPost.userName}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{selectedPost.content}</p>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment... 💬"
              className="w-full min-h-24 mb-4 p-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none resize-none bg-background text-foreground"
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                onClick={submitComment}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-2xl h-11"
              >
                <Send className="w-4 h-4 mr-2" />
                Comment
              </Button>
              <Button
                onClick={() => {
                  setShowCommentModal(false)
                  setNewComment("")
                  setSelectedPost(null)
                }}
                variant="outline"
                className="flex-1 rounded-2xl h-11 border-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
