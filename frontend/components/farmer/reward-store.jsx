"use client"

import { ShoppingBag, Sparkles, Leaf, Award, Star, Zap, ChevronLeft, Check, Sprout, Wrench } from "lucide-react"
import { useState } from "react"

// Seed Store Categories
const SEED_STORE_CATEGORIES = {
    vegetable_seeds: {
        name: "Vegetable Seeds",
        icon: Leaf,
        color: "from-green-500 to-emerald-500",
        description: "Small, affordable XP rewards for kitchen gardens and small farmers",
        items: [
            { id: "tomato_seeds", name: "Tomato Seeds", description: "High germination rate, fast-growing hybrid varieties. Perfect for Kerala climate.", cost: 150, icon: "🍅", rarity: "common", details: "Includes 50g packet with 95% germination guarantee" },
            { id: "okra_seeds", name: "Okra Seeds (Lady's Finger)", description: "Suitable for warm climates, disease-resistant traits. Thrives in Kerala weather.", cost: 120, icon: "🌿", rarity: "common", details: "30g packet, resistant to yellow vein mosaic virus" },
            { id: "brinjal_seeds", name: "Brinjal Seeds (Eggplant)", description: "Long and round varieties, specially suited for Kerala soils. High yield potential.", cost: 180, icon: "🍆", rarity: "uncommon", details: "Includes both long purple and round varieties, 40g packet" },
            { id: "chilli_seeds", name: "Chilli Seeds", description: "High-yield varieties, resistant to common fungal diseases. Spice up your farm!", cost: 140, icon: "🌶️", rarity: "common", details: "25g packet, includes Kanthari and Bird's Eye varieties" },
        ],
        benefits: "Improves vegetable self-production, reduces household expenses, promotes organic growing"
    },
    paddy_seeds: {
        name: "Paddy Seeds",
        icon: Award,
        color: "from-yellow-600 to-amber-600",
        description: "Most relevant for Kerala farmers - traditional and hybrid varieties",
        items: [
            { id: "matta_rice", name: "Matta Rice Seeds (Traditional)", description: "Premium Kerala Matta variety. Rich in nutrients, authentic taste, high market value.", cost: 400, icon: "🌾", rarity: "rare", details: "5kg certified seeds, 120-day maturity, red rice variety" },
            { id: "uma_rice", name: "Uma Rice Seeds (Traditional)", description: "Traditional Kerala variety with excellent cooking quality and aroma.", cost: 350, icon: "🌾", rarity: "uncommon", details: "5kg certified seeds, 110-day maturity, white rice variety" },
            { id: "hybrid_paddy", name: "High-Yield Hybrid Paddy", description: "Modern hybrid varieties with 30% higher yield than traditional types.", cost: 500, icon: "🌾", rarity: "rare", details: "5kg certified hybrid seeds, 100-day maturity, disease resistant" },
            { id: "flood_resistant_paddy", name: "Flood-Resistant Paddy", description: "Stress-tolerant variety, survives waterlogging up to 14 days. Perfect for monsoon.", cost: 600, icon: "🌊", rarity: "epic", details: "5kg certified seeds, submergence tolerant, 115-day maturity" },
            { id: "drought_resistant_paddy", name: "Drought-Resistant Paddy", description: "Requires 30% less water, ideal for areas with irrigation challenges.", cost: 550, icon: "☀️", rarity: "epic", details: "5kg certified seeds, aerobic rice variety, 105-day maturity" },
        ],
        benefits: "Better yields, faster growth, improved resistance to pests and climate problems"
    },
    premium_seeds: {
        name: "Premium Seeds",
        icon: Star,
        color: "from-purple-500 to-pink-500",
        description: "High-yield and climate-resilient varieties for farmers upgrading productivity",
        items: [
            { id: "drought_maize", name: "Drought-Resistant Maize", description: "Climate-smart maize that handles water stress. 40% more drought tolerant.", cost: 450, icon: "🌽", rarity: "rare", details: "1kg hybrid seeds, 90-day maturity, suitable for dry spells" },
            { id: "short_duration_rice", name: "Short-Duration Rice", description: "Harvest in just 75-80 days! Allows multiple cropping cycles per year.", cost: 550, icon: "⚡", rarity: "epic", details: "5kg certified seeds, ultra-early variety, good for double cropping" },
            { id: "hybrid_chilli", name: "High-Yield Hybrid Chilli", description: "Premium hybrid with 3x yield of traditional varieties. Export quality.", cost: 300, icon: "🔥", rarity: "uncommon", details: "50g F1 hybrid seeds, continuous fruiting, disease resistant" },
            { id: "hybrid_tomato", name: "High-Yield Hybrid Tomato", description: "Commercial-grade hybrid tomato. Uniform size, long shelf life, high market value.", cost: 350, icon: "🍅", rarity: "rare", details: "25g F1 hybrid seeds, determinate type, suitable for staking" },
            { id: "climate_vegetable_mix", name: "Climate-Resilient Vegetable Mix", description: "Curated seed collection of 8 vegetables bred for climate stress tolerance.", cost: 700, icon: "🌱", rarity: "legendary", details: "Includes beans, cucumber, radish, carrot, beetroot, spinach, coriander, fenugreek" },
        ],
        benefits: "Handles climate stress, gives more output with less water, reduces risk of crop failure"
    }
}

// Organic Manure Categories
const ORGANIC_MANURE_CATEGORIES = {
    organic_manure: {
        name: "Organic Manure",
        icon: Leaf,
        color: "from-amber-600 to-orange-600",
        description: "Natural soil enhancers rich in nutrients",
        items: [
            { id: "cow_dung_manure", name: "Cow Dung Manure", description: "Premium quality cow dung manure. Improves soil structure and enhances water retention.", cost: 200, icon: "🐄", rarity: "common", details: "10kg bag, well-decomposed, ready to use" },
            { id: "farmyard_manure", name: "Farmyard Manure (FYM)", description: "Mixed organic manure from farm animals. Boosts overall plant growth and supports organic farming.", cost: 250, icon: "🌾", rarity: "common", details: "15kg bag, aged 6 months, nutrient-rich" },
            { id: "organic_nutrient_mix", name: "Organic Nutrient Mixture", description: "Balanced blend of organic materials. Complete nutrition for all crops.", cost: 300, icon: "🌿", rarity: "uncommon", details: "10kg bag, NPK balanced, suitable for all crops" },
        ],
        benefits: "Improves soil structure, enhances water retention, boosts plant growth, supports organic farming"
    },
    compost_kits: {
        name: "Compost Kits",
        icon: Award,
        color: "from-green-600 to-teal-600",
        description: "Starter kits to convert organic waste into high-quality compost",
        items: [
            { id: "basic_compost_kit", name: "Basic Compost Kit", description: "Everything you need to start composting. Includes bin and microbial starter.", cost: 400, icon: "♻️", rarity: "uncommon", details: "50L bin + 500g microbial starter + instruction manual" },
            { id: "premium_compost_kit", name: "Premium Compost Kit", description: "Advanced composting system with temperature monitor. Faster decomposition.", cost: 600, icon: "🔄", rarity: "rare", details: "100L bin + thermometer + aerator + starter culture" },
            { id: "community_compost_kit", name: "Community Compost Kit", description: "Large-scale composting for farmer groups. Processes 50kg waste daily.", cost: 900, icon: "👥", rarity: "epic", details: "500L capacity + industrial starter + training guide" },
        ],
        benefits: "Reduces farm waste, produces nutrient-rich compost at home, cuts fertilizer cost, encourages sustainable practices"
    },
    vermicompost: {
        name: "Vermicompost",
        icon: Star,
        color: "from-emerald-600 to-green-700",
        description: "Nutrient-rich compost made using earthworms",
        items: [
            { id: "vermicompost_1kg", name: "Vermicompost (1kg)", description: "High nutrient content (NPK). Promotes soil aeration and enhances root growth.", cost: 100, icon: "🪱", rarity: "common", details: "1kg bag, ready to use, safe for all crops" },
            { id: "vermicompost_5kg", name: "Vermicompost (5kg)", description: "Economy pack for small gardens. Rich in beneficial microorganisms.", cost: 400, icon: "🪱", rarity: "uncommon", details: "5kg bag, moisture-controlled packaging" },
            { id: "vermicompost_10kg", name: "Vermicompost (10kg)", description: "Best value for regular farmers. Complete nutrition for healthy crops.", cost: 700, icon: "🪱", rarity: "rare", details: "10kg bag, premium quality, lab-tested NPK" },
        ],
        benefits: "High nutrient content (NPK), promotes soil aeration, enhances root growth, safe for all crops"
    },
    biofertilizers: {
        name: "Biofertilizers",
        icon: Sparkles,
        color: "from-blue-600 to-indigo-600",
        description: "Microbial fertilizers that enrich soil naturally",
        items: [
            { id: "azospirillum", name: "Azospirillum Biofertilizer", description: "Ideal for paddy, wheat, maize. Improves nitrogen fixation naturally.", cost: 250, icon: "🦠", rarity: "uncommon", details: "500g packet, treats 1 acre, increases N availability" },
            { id: "rhizobium", name: "Rhizobium Biofertilizer", description: "Perfect for pulses and legumes. Forms root nodules for nitrogen fixation.", cost: 250, icon: "🦠", rarity: "uncommon", details: "500g packet, specific for legumes, boosts yield 20%" },
            { id: "bio_combo_pack", name: "Biofertilizer Combo Pack", description: "Complete microbial solution. Includes Azospirillum, Rhizobium, and PSB.", cost: 600, icon: "🧬", rarity: "rare", details: "3x500g packets, covers 3 acres, comprehensive nutrition" },
            { id: "premium_bio_mix", name: "Premium Bio Mix", description: "Advanced microbial consortium. Reduces chemical fertilizer need by 50%.", cost: 800, icon: "✨", rarity: "epic", details: "1kg premium blend, 7 beneficial microbes, 2-acre coverage" },
        ],
        benefits: "Reduces chemical fertilizer need, naturally improves soil fertility, increases plant resistance, boosts crop yield"
    }
}

// Farming Tools Categories
const FARMING_TOOLS_CATEGORIES = {
    small_tools: {
        name: "Essential Farming Tools",
        icon: Award,
        color: "from-slate-600 to-gray-700",
        description: "Affordable daily-use tools for small and medium farmers",
        items: [
            { id: "hand_gloves", name: "Hand Gloves (Farming Gloves)", description: "Durable gloves to protect hands while planting, weeding, and handling manure. Prevents injuries and improves grip.", cost: 80, icon: "🧤", rarity: "common", details: "Pair of cotton-rubber gloves, washable, ensures hygienic work" },
            { id: "secateurs", name: "Secateurs (Garden Cutter)", description: "Sharp handheld cutting tool for trimming small branches, removing weeds, and cutting stems.", cost: 150, icon: "✂️", rarity: "common", details: "Stainless steel blade, supports healthy plant growth and easy pruning" },
            { id: "pruning_shears", name: "Pruning Shears (Katti)", description: "Stronger than secateurs, used for cutting tougher branches of coconut, banana, vegetables, or fruit plants.", cost: 250, icon: "✂️", rarity: "uncommon", details: "Heavy-duty steel, helps maintain plant structure for better yield" },
            { id: "hand_sprayer", name: "Manual Hand Sprayer (1-2L)", description: "Small pesticide sprayer for applying organic pesticides like neem oil. Perfect for home gardens.", cost: 200, icon: "💧", rarity: "common", details: "2L capacity, easy to operate, suitable for small farms" },
            { id: "water_test_strips", name: "Water Testing Strips", description: "Quick test strips to check irrigation water quality (pH, hardness). Ensures crops receive safe water.", cost: 120, icon: "🧪", rarity: "uncommon", details: "50 strips pack, prevents nutrient imbalance, easy to use" },
            { id: "soil_ph_meter", name: "Soil pH Meter", description: "Simple device to measure soil acidity/alkalinity. Helps decide the correct fertilizer.", cost: 400, icon: "📊", rarity: "rare", details: "Digital display, battery-operated, essential for soil health monitoring" },
            { id: "manvetti", name: "Manvetti (മൺവെട്ടി)", description: "Traditional Kerala soil-digging tool for breaking soil, removing weeds, and preparing planting pits.", cost: 180, icon: "⛏️", rarity: "common", details: "Durable iron blade, wooden handle, works well in clay/wet soils" },
            { id: "aruva", name: "Aruva (അറുവ) / Sickle", description: "Curved cutting tool for harvesting crops, cutting grass, clearing weeds, and preparing fodder.", cost: 150, icon: "🔪", rarity: "common", details: "Lightweight steel, ideal for paddy, banana, and vegetable farms" },
        ],
        benefits: "Essential for daily farm work, improves efficiency, prevents injuries, supports organic farming practices"
    }
}

const RARITY_STYLES = {
    common: "border-gray-400 bg-gray-50 dark:bg-gray-900",
    uncommon: "border-green-400 bg-green-50 dark:bg-green-900/20",
    rare: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
    epic: "border-purple-400 bg-purple-50 dark:bg-purple-900/20",
    legendary: "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
}

const RARITY_LABELS = {
    common: { text: "Common", color: "text-gray-600 dark:text-gray-400" },
    uncommon: { text: "Uncommon", color: "text-green-600 dark:text-green-400" },
    rare: { text: "Rare", color: "text-blue-600 dark:text-blue-400" },
    epic: { text: "Epic", color: "text-purple-600 dark:text-purple-400" },
    legendary: { text: "Legendary", color: "text-yellow-600 dark:text-yellow-400" }
}

export function RewardStore({ userData, onBack, onPurchase }) {
    const [mainTab, setMainTab] = useState("seeds") // "seeds", "manure", or "tools"
    const [purchasedItems, setPurchasedItems] = useState(userData?.purchasedRewards || [])
    const [showPurchaseModal, setShowPurchaseModal] = useState(null)

    const userXP = userData?.xp || 0
    const currentCategories = mainTab === "seeds" ? SEED_STORE_CATEGORIES :
        mainTab === "manure" ? ORGANIC_MANURE_CATEGORIES :
            FARMING_TOOLS_CATEGORIES

    const handlePurchase = (item) => {
        if (userXP >= item.cost && !purchasedItems.includes(item.id)) {
            setPurchasedItems([...purchasedItems, item.id])
            setShowPurchaseModal(item)

            if (onPurchase) {
                onPurchase(item)
            }

            setTimeout(() => setShowPurchaseModal(null), 3000)
        }
    }

    const canAfford = (cost) => userXP >= cost
    const isPurchased = (itemId) => purchasedItems.includes(itemId)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
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

                        <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                <div>
                                    <p className="text-xs opacity-90">Your Balance</p>
                                    <p className="text-2xl font-black">{userXP} XP</p>
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
                            Organic Manure
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
                    const Icon = category.icon

                    return (
                        <div key={categoryKey} className="space-y-6">
                            {/* Category Header */}
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 bg-gradient-to-r ${category.color} text-white px-6 py-4 rounded-2xl shadow-lg`}>
                                    <Icon className="w-8 h-8" />
                                    <div>
                                        <h2 className="text-2xl font-black">{category.name}</h2>
                                        <p className="text-sm opacity-90">{category.description}</p>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-xl p-4">
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
                                                <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
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
                                                    disabled={!affordable || purchased}
                                                    className={`w-full py-3 rounded-xl font-bold transition-all ${purchased ? "bg-muted text-muted-foreground cursor-not-allowed" :
                                                        affordable ? `bg-gradient-to-r ${category.color} text-white hover:shadow-lg active:scale-95` :
                                                            "bg-muted text-muted-foreground cursor-not-allowed"
                                                        }`}
                                                >
                                                    {purchased ? "Already Redeemed" : affordable ? "Redeem Now" : "Insufficient XP"}
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

            {/* Purchase Success Modal */}
            {showPurchaseModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-accent animate-in zoom-in-95">
                        <div className="text-center space-y-4">
                            <div className="text-7xl animate-bounce">{showPurchaseModal.icon}</div>
                            <h2 className="text-3xl font-black text-foreground">Redeemed Successfully! 🎉</h2>
                            <p className="text-lg text-muted-foreground">
                                You've unlocked <span className="text-accent font-bold">{showPurchaseModal.name}</span>
                            </p>
                            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                                <p className="text-xs text-muted-foreground">{showPurchaseModal.details}</p>
                                <p className="text-sm text-muted-foreground">
                                    Remaining Balance: <span className="text-primary font-bold text-xl">{userXP - showPurchaseModal.cost} XP</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPurchaseModal(null)}
                                className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
