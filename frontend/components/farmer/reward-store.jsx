"use client"

import { ShoppingBag, Sparkles, Leaf, Award, Star, Zap, ChevronLeft, Check, Sprout, Wrench } from "lucide-react"
import { useState } from "react"

// Seed Store Categories
const SEED_STORE_CATEGORIES = {
    vegetable_seeds: {
        name: "🌱 Vegetable Seeds",
        icon: "🥬",
        color: "from-green-500/80 to-emerald-600/80",
        description: "Perfect starter seeds for your kitchen garden",
        items: [
            { id: "tomato_seeds", name: "Tomato Seeds", category: "Vegetable Seeds", description: "Grow juicy tomatoes easily! Perfect for Kerala weather, fast-growing.", cost: 150, icon: "🍅", rarity: "common", details: "50g pack - Grows in about 2-3 months" },
            { id: "okra_seeds", name: "Bhindi Seeds (Lady's Finger)", category: "Vegetable Seeds", description: "Easy-to-grow, disease-resistant variety. Loves Kerala's climate!", cost: 120, icon: "🌿", rarity: "common", details: "30g pack - Ready to harvest in 50-60 days" },
            { id: "brinjal_seeds", name: "Brinjal Seeds (Eggplant)", category: "Vegetable Seeds", description: "Get fresh brinjals from your garden. Grows well in Kerala soil!", cost: 180, icon: "🍆", rarity: "uncommon", details: "40g pack - Long and round varieties" },
            { id: "chilli_seeds", name: "Chilli Seeds", category: "Vegetable Seeds", description: "Grow your own fresh chillis! Strong plants, good yield.", cost: 140, icon: "🌶️", rarity: "common", details: "25g pack - Kerala Kanthari and other varieties" },
        ],
        benefits: "Grow your own veggies • Save money • Fresh & organic • Easy to maintain"
    },
    paddy_seeds: {
        name: "🌾 Rice Seeds",
        icon: "🌾",
        color: "from-amber-500/80 to-yellow-600/80",
        description: "Traditional and modern rice varieties for better harvest",
        items: [
            { id: "matta_rice", name: "Matta Rice Seeds", category: "Paddy Seeds", description: "Kerala's famous red rice! Nutritious, tasty, and sells well in the market.", cost: 400, icon: "🌾", rarity: "rare", details: "5kg pack - Ready in 4 months" },
            { id: "uma_rice", name: "Uma Rice Seeds", category: "Paddy Seeds", description: "Traditional Kerala white rice with excellent taste and aroma.", cost: 350, icon: "🌾", rarity: "uncommon", details: "5kg pack - Ready in 3.5 months" },
            { id: "hybrid_paddy", name: "High-Yield Rice Seeds", category: "Paddy Seeds", description: "Modern variety that gives 30% more harvest than traditional types!", cost: 500, icon: "🌾", rarity: "rare", details: "5kg pack - Ready in 100 days" },
            { id: "flood_resistant_paddy", name: "Monsoon-Safe Rice Seeds", category: "Paddy Seeds", description: "Can survive heavy rains and floods up to 2 weeks. Perfect for monsoon!", cost: 600, icon: "🌊", rarity: "epic", details: "5kg pack - Waterlogging resistant" },
            { id: "drought_resistant_paddy", name: "Drought-Tolerant Rice Seeds", category: "Paddy Seeds", description: "Needs less water! Great for areas with water shortage.", cost: 550, icon: "☀️", rarity: "epic", details: "5kg pack - Uses 30% less water" },
        ],
        benefits: "Better harvest • Stronger plants • Survives tough weather • Good market value"
    },
    premium_seeds: {
        name: "✨ Special Seeds",
        icon: "⭐",
        color: "from-purple-500/80 to-pink-600/80",
        description: "Premium quality seeds for professional farmers",
        items: [
            { id: "drought_maize", name: "Drought-Safe Corn Seeds", category: "Premium Seeds", description: "Corn that grows well even with less rain. Smart choice for dry seasons!", cost: 450, icon: "🌽", rarity: "rare", details: "1kg pack - 40% more drought tolerant" },
            { id: "short_duration_rice", name: "Quick-Harvest Rice", category: "Premium Seeds", description: "Get your harvest in just 75-80 days! Grow crops faster.", cost: 550, icon: "⚡", rarity: "epic", details: "5kg pack - Great for multiple harvests per year" },
            { id: "hybrid_chilli", name: "Super Chilli Seeds", category: "Premium Seeds", description: "Produces 3 times more chillis! Export quality, high market price.", cost: 300, icon: "🔥", rarity: "uncommon", details: "50g pack - Continuous harvest" },
            { id: "hybrid_tomato", name: "Premium Tomato Seeds", category: "Premium Seeds", description: "Commercial quality tomatoes. Uniform size, lasts longer, good price!", cost: 350, icon: "🍅", rarity: "rare", details: "25g pack - Professional grade" },
            { id: "climate_vegetable_mix", name: "8-in-1 Veggie Pack", category: "Premium Seeds", description: "Complete vegetable garden in one pack! 8 different vegetables that handle any weather.", cost: 700, icon: "🌱", rarity: "legendary", details: "Beans, cucumber, radish, carrot, beetroot, spinach, coriander, fenugreek" },
        ],
        benefits: "Handles all weather • Higher yields • Better quality • Smart investment"
    }
}

// Organic Fertilizer Categories
const ORGANIC_MANURE_CATEGORIES = {
    organic_manure: {
        name: "🌿 Natural Fertilizers",
        icon: "🍂",
        color: "from-amber-600/80 to-orange-600/80",
        description: "Natural nutrients to make your soil healthy and rich",
        items: [
            { id: "cow_dung_manure", name: "Cow Dung Fertilizer", category: "Organic Manure", description: "Natural cow manure. Makes soil soft and helps plants grow strong!", cost: 200, icon: "🐄", rarity: "common", details: "10kg bag - Ready to use immediately" },
            { id: "farmyard_manure", name: "Farm Manure Mix", category: "Organic Manure", description: "Mixed natural fertilizer from farm animals. All-round nutrition for plants.", cost: 250, icon: "🌾", rarity: "common", details: "15kg bag - Fully aged and ready" },
            { id: "organic_nutrient_mix", name: "Complete Organic Mix", category: "Organic Manure", description: "Balanced natural fertilizer. Works for all types of crops!", cost: 300, icon: "🌿", rarity: "uncommon", details: "10kg bag - Perfect balance of nutrients" },
        ],
        benefits: "Makes soil healthy • Holds water better • Natural & safe • Boosts plant growth"
    },
    compost_kits: {
        name: "♻️ Composting Kits",
        icon: "♻️",
        color: "from-green-600/80 to-teal-600/80",
        description: "Turn your farm waste into valuable fertilizer",
        items: [
            { id: "basic_compost_kit", name: "Beginner Compost Kit", category: "Compost Kits", description: "Everything to start making your own fertilizer. Easy to use!", cost: 400, icon: "♻️", rarity: "uncommon", details: "50L bin + starter powder + instruction guide" },
            { id: "premium_compost_kit", name: "Advanced Compost Kit", category: "Compost Kits", description: "Professional composting setup. Makes fertilizer faster!", cost: 600, icon: "🔄", rarity: "rare", details: "100L bin + tools + temperature gauge" },
            { id: "community_compost_kit", name: "Group Compost Kit", category: "Compost Kits", description: "Large kit for farmer groups. Handles 50kg waste every day!", cost: 900, icon: "👥", rarity: "epic", details: "500L capacity - Perfect for communities" },
        ],
        benefits: "Save money • Use farm waste • Make your own fertilizer • Help environment"
    },
    vermicompost: {
        name: "🪱 Earthworm Compost",
        icon: "🪱",
        color: "from-emerald-600/80 to-green-700/80",
        description: "Super nutritious fertilizer made with earthworms",
        items: [
            { id: "vermicompost_1kg", name: "Vermicompost Small Pack", category: "Vermicompost", description: "High quality fertilizer made by earthworms. Excellent for all plants!", cost: 100, icon: "🪱", rarity: "common", details: "1kg bag - Safe for all crops" },
            { id: "vermicompost_5kg", name: "Vermicompost Medium Pack", category: "Vermicompost", description: "Economy pack for small gardens. Full of good bacteria for soil!", cost: 400, icon: "🪱", rarity: "uncommon", details: "5kg bag - Good value pack" },
            { id: "vermicompost_10kg", name: "Vermicompost Large Pack", category: "Vermicompost", description: "Best value for farmers! Premium quality, tested and certified.", cost: 700, icon: "🪱", rarity: "rare", details: "10kg bag - Lab-tested quality" },
        ],
        benefits: "Rich in nutrients • Improves soil quality • Strengthens roots • Works for all plants"
    },
    biofertilizers: {
        name: "✨ Bio-Fertilizers",
        icon: "✨",
        color: "from-blue-600/80 to-indigo-600/80",
        description: "Helpful microbes that make soil naturally fertile",
        items: [
            { id: "azospirillum", name: "Azospirillum Pack", category: "Biofertilizers", description: "Helpful bacteria for rice, wheat, corn. Adds natural nitrogen to soil!", cost: 250, icon: "🦠", rarity: "uncommon", details: "500g pack - Treats 1 acre land" },
            { id: "rhizobium", name: "Rhizobium Pack", category: "Biofertilizers", description: "Special bacteria for pulses and beans. Forms helpful nodules on roots!", cost: 250, icon: "🦠", rarity: "uncommon", details: "500g pack - 20% better yield" },
            { id: "bio_combo_pack", name: "Complete Bio Pack", category: "Biofertilizers", description: "All-in-one microbial solution. Three types of helpful bacteria!", cost: 600, icon: "🧬", rarity: "rare", details: "3 packs - Covers 3 acres" },
            { id: "premium_bio_mix", name: "Premium Bio Mix", category: "Biofertilizers", description: "Advanced bacteria mix. Reduce chemical fertilizer use by half!", cost: 800, icon: "✨", rarity: "epic", details: "1kg premium pack - 7 types of microbes" },
        ],
        benefits: "Less chemical use • Natural soil health • Stronger plants • Better harvest"
    }
}

// Farming Tools Categories
const FARMING_TOOLS_CATEGORIES = {
    small_tools: {
        name: "🛠️ Farm Tools",
        icon: "🔧",
        color: "from-slate-600/80 to-gray-700/80",
        description: "Essential tools every farmer needs for daily work",
        items: [
            { id: "hand_gloves", name: "Farming Gloves", category: "Farming Tools", description: "Protect your hands while working. Comfortable and long-lasting!", cost: 80, icon: "🧤", rarity: "common", details: "Washable cotton-rubber gloves - One pair" },
            { id: "secateurs", name: "Garden Cutter", category: "Farming Tools", description: "Sharp cutting tool for trimming plants and removing weeds. Very handy!", cost: 150, icon: "✂️", rarity: "common", details: "Stainless steel - Easy to use" },
            { id: "pruning_shears", name: "Heavy Pruning Tool (Katti)", category: "Farming Tools", description: "Strong cutter for tough branches. Works on coconut, banana, and fruit trees!", cost: 250, icon: "✂️", rarity: "uncommon", details: "Heavy-duty steel - Professional quality" },
            { id: "hand_sprayer", name: "Hand Spray Bottle", category: "Farming Tools", description: "Easy-to-use sprayer for organic pesticides. Perfect for home gardens!", cost: 200, icon: "💧", rarity: "common", details: "2 liter capacity - Simple operation" },
            { id: "water_test_strips", name: "Water Quality Checker", category: "Farming Tools", description: "Quick strips to check if your water is good for crops. Very easy!", cost: 120, icon: "🧪", rarity: "uncommon", details: "50 test strips - Simple to use" },
            { id: "soil_ph_meter", name: "Soil Testing Device", category: "Farming Tools", description: "Check if your soil is acidic or alkaline. Helps choose right fertilizer!", cost: 400, icon: "📊", rarity: "rare", details: "Digital meter - Battery included" },
            { id: "manvetti", name: "Manvetti (മൺവെട്ടി)", category: "Farming Tools", description: "Traditional Kerala digging tool. Perfect for breaking soil and making planting holes!", cost: 180, icon: "⛏️", rarity: "common", details: "Iron blade with wooden handle - Kerala style" },
            { id: "aruva", name: "Aruva (അറുവ) Sickle", category: "Farming Tools", description: "Curved cutting tool for harvesting crops, grass, and weeds. Essential farm tool!", cost: 150, icon: "🔪", rarity: "common", details: "Lightweight steel - Traditional design" },
        ],
        benefits: "Makes work easier • Saves time • Prevents injuries • Lasts long"
    }
}

const RARITY_STYLES = {
    common: "border-border bg-card dark:bg-card",
    uncommon: "border-primary/40 bg-card dark:bg-card shadow-sm",
    rare: "border-accent/40 bg-card dark:bg-card shadow-md",
    epic: "border-purple-400/40 bg-card dark:bg-card shadow-lg",
    legendary: "border-yellow-400/50 bg-card dark:bg-card shadow-xl"
}

const RARITY_LABELS = {
    common: { text: "Common", color: "text-muted-foreground" },
    uncommon: { text: "Good Quality", color: "text-primary" },
    rare: { text: "Premium", color: "text-accent" },
    epic: { text: "Professional", color: "text-purple-600 dark:text-purple-400" },
    legendary: { text: "Legendary", color: "text-yellow-600 dark:text-yellow-400" }
}


export function RewardStore({ userData, onBack, onPurchase }) {
    const [mainTab, setMainTab] = useState("seeds") // "seeds", "manure", or "tools"
    const [purchasedItems, setPurchasedItems] = useState(userData?.purchasedRewards || [])
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [currentXP, setCurrentXP] = useState(userData?.xp || 0)

    const currentCategories = mainTab === "seeds" ? SEED_STORE_CATEGORIES :
        mainTab === "manure" ? ORGANIC_MANURE_CATEGORIES :
            FARMING_TOOLS_CATEGORIES

    const handlePurchase = async (item) => {
        if (currentXP >= item.cost && !purchasedItems.includes(item.id) && !isPurchasing) {
            setIsPurchasing(true)

            try {
                // Call the parent's onPurchase handler (which shows order form modal)
                const result = await onPurchase(item)

                if (result && result.success) {
                    // Don't show success modal here - parent will handle order form
                    // Just update local XP display
                    setCurrentXP(result.updatedXP)
                } else {
                    // Purchase failed
                    console.error("Purchase failed")
                }
            } catch (error) {
                console.error("Error during purchase:", error)
            } finally {
                setIsPurchasing(false)
            }
        }
    }

    const canAfford = (cost) => currentXP >= cost
    const isPurchased = (itemId) => purchasedItems.includes(itemId)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-muted rounded-xl transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                                    <ShoppingBag className="w-7 h-7 text-primary" />
                                    Reward Store
                                </h1>
                                <p className="text-sm text-muted-foreground">Redeem quality products with your XP!</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                <div>
                                    <p className="text-xs opacity-90">Your Balance</p>
                                    <p className="text-2xl font-black">{currentXP} XP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Tabs */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setMainTab("seeds")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mainTab === "seeds"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                                : "bg-card text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <Sprout className="w-5 h-5" />
                            Seed Store
                        </button>
                        <button
                            onClick={() => setMainTab("manure")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mainTab === "manure"
                                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105"
                                : "bg-card text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <Leaf className="w-5 h-5" />
                            Organic Fertilizers
                        </button>
                        <button
                            onClick={() => setMainTab("tools")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${mainTab === "tools"
                                ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg scale-105"
                                : "bg-card text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <Wrench className="w-5 h-5" />
                            Farming Tools
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-w-6xl mx-auto px-6 py-6 space-y-12">
                {Object.entries(currentCategories).map(([categoryKey, category]) => {
                    const iconDisplay = typeof category.icon === 'string' ? category.icon : '🌿'

                    return (
                        <div key={categoryKey} className="space-y-6">
                            {/* Category Header */}
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 bg-gradient-to-r ${category.color} text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all`}>
                                    <span className="text-5xl">{iconDisplay}</span>
                                    <div>
                                        <h2 className="text-2xl font-black">{category.name}</h2>
                                        <p className="text-sm opacity-90">{category.description}</p>
                                    </div>
                                </div>

                                <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-4 shadow-sm">
                                    <p className="text-xs text-accent font-semibold">✓ {category.benefits}</p>
                                </div>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((item) => {
                                    const affordable = canAfford(item.cost)
                                    const purchased = isPurchased(item.id)
                                    const rarity = RARITY_STYLES[item.rarity]
                                    const rarityLabel = RARITY_LABELS[item.rarity]

                                    return (
                                        <div key={item.id} className={`relative rounded-2xl border-2 p-6 transition-all ${rarity} ${purchased ? "opacity-60" : affordable ? "hover:scale-105 hover:shadow-xl" : ""}`}>
                                            <div className="absolute top-3 right-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${rarityLabel.color} bg-background/80`}>
                                                    {rarityLabel.text}
                                                </span>
                                            </div>

                                            {purchased && (
                                                <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                                                    <Check className="w-3 h-3" />
                                                    Owned
                                                </div>
                                            )}

                                            <div className="text-6xl mb-4 text-center">{item.icon}</div>

                                            <div className="space-y-2">
                                                <h3 className="font-bold text-lg text-foreground text-center">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground text-center min-h-[60px]">{item.description}</p>

                                                {item.details && (
                                                    <p className="text-xs text-muted-foreground/80 text-center italic border-t border-border pt-2">{item.details}</p>
                                                )}

                                                <div className="flex items-center justify-center gap-2 py-2">
                                                    <Zap className="w-5 h-5 text-accent" />
                                                    <span className="text-2xl font-black text-accent">{item.cost}</span>
                                                    <span className="text-sm text-muted-foreground">XP</span>
                                                </div>

                                                <button
                                                    onClick={() => handlePurchase(item)}
                                                    disabled={!affordable || purchased || isPurchasing}
                                                    className={`w-full py-3 rounded-xl font-bold transition-all ${purchased ? "bg-muted text-muted-foreground cursor-not-allowed" :
                                                        affordable && !isPurchasing ? `bg-gradient-to-r ${category.color} text-white hover:shadow-lg active:scale-95` :
                                                            "bg-muted text-muted-foreground cursor-not-allowed"
                                                        }`}
                                                >
                                                    {isPurchasing ? "Processing..." : purchased ? "Already Redeemed" : affordable ? "Redeem Now" : "Not Enough XP"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
