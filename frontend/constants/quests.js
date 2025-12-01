export const QUESTS_DATA = {
  soil_scout: {
    id: "soil_scout",
    title: "Meet the Soil",
    description: "Analyze the physical health of your garden soil to understand what plants will thrive in it.",
    activities: [
      "Collect soil samples",
      "Perform texture test (sand/silt/clay)",
      "Check moisture levels",
      "Evaluate smell and color"
    ],
    outcomes: [
      "Understand soil composition",
      "Identify soil quality indicators",
      "Recognize healthy vs poor soil"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 10,
    badgeName: "Soil Scout",
    steps: [
      {
        title: "Preparation & Gear Check",
        objective: "Before you head out, gather your kit.",
        subSteps: [
          "Small trowel or sturdy spoon",
          "3 Clean jars or Ziploc bags",
          "Permanent marker",
          "Water bottle",
          "Notebook & Camera (Phone)",
          "Optional: Ruler & Gloves"
        ],
        tip: "Pro Tip: Soil tests are best done when the soil is slightly damp, but not soaking wet from heavy rain.",
        image: "/images/quests/soil_scout/step1.png"
      },
      {
        title: "Step 1 — The Harvest (Sampling)",
        objective: "Collect a representative sample of your soil.",
        subSteps: [
          "Select 3 Spots: Pick three distinct areas in your plot (e.g., near a plant, center of the row, and an empty corner).",
          "Dig: Clear away surface leaves/mulch. Dig 6–10 cm deep (about finger-length).",
          "Collect: Scoop about 1 cup of soil from each spot into separate bags/jars.",
          "Label: Mark them clearly: S1, S2, S3."
        ],
        reason: "Why? Soil changes across a garden. Three spots give you an average, not an anomaly.",
        image: "/images/quests/soil_scout/step2.jpg"
      },
      {
        title: "Step 2 — Texture Analysis (The Physics)",
        objective: "Determine if your soil is Sandy, Silty, or Clay-heavy.",
        subSteps: [
          "Method A: Take a moist pinch of soil (add a drop of water if needed).",
          "Knead it into a ball, then press it between your thumb and finger to push out a 'ribbon.'",
          "Check Ribbon: Sandy (No ribbon), Silty (Weak ribbon), Clay (Strong ribbon >2cm).",
          "Method B: Fill a clear jar 2/3 with soil and top with water.",
          "Add a pinch of salt and shake vigorously for 2 minutes.",
          "Wait 24 Hours and observe layers (Sand bottom, Silt middle, Clay top)."
        ],
        image: "/images/quests/soil_scout/step3.png"
      },
      {
        title: "Step 3 — Hydration Check",
        objective: "Check water retention and drainage.",
        subSteps: [
          "The Squeeze Test: Pick up a handful of soil and squeeze gently. Open your hand.",
          "Check if Dry: Falls apart immediately (Needs irrigation).",
          "Check if Moist: Holds loose shape but crumbles (Ideal).",
          "Check if Wet: Drips water, sticky blob (Poor drainage)."
        ],
        image: "/images/quests/soil_scout/step4.png"
      },
      {
        title: "Step 4 — Sensory Check (Color & Smell)",
        objective: "Assess organic health and aeration.",
        subSteps: [
          "Smell Test: Earthy/Fresh (Good) vs Sour/Rotten (Bad/Anaerobic).",
          "Color Code: Dark Brown/Black (Rich Organic Matter).",
          "Color Code: Red/Yellow (High Iron).",
          "Color Code: Gray/Blue-ish (Waterlogged).",
          "Color Code: Pale/White (Leached/Salty)."
        ],
        image: "/images/quests/soil_scout/step5.png"
      },
      {
        title: "Conclusion & Learning Summary",
        objective: "Mission Complete! Compile your notes.",
        subSteps: [
          "Determine Texture (e.g., Sandy Loam)",
          "Determine Moisture (e.g., Well-drained)",
          "Determine Health (e.g., Dark & Earthy)",
          "Review: Texture dictates strategy.",
          "Review: Color indicates diet.",
          "Review: Smell reveals breath."
        ],
        image: null
      }
    ]
  },

  crop_quest: {
    id: "crop_quest",
    title: "Crops that Fits",
    description: "Discover the best sustainable crops for your region.",
    activities: [
      "Browse recommended crops",
      "Choose 3 crops suited to your climate",
      "Check water and season needs"
    ],
    outcomes: [
      "Identify suitable crops",
      "Understand seasonal planting",
      "Learn water requirements"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 75,
    badgeName: "Crop Explorer"
  },

  compost_kickoff: {
    id: "compost_kickoff",
    title: "Soil Booster",
    description: "Turn organic waste into nutrient-rich compost.",
    activities: [
      "Choose compost spot",
      "Add kitchen waste",
      "Mix with dry leaves",
      "Maintain moisture"
    ],
    outcomes: [
      "Start composting",
      "Reduce household waste",
      "Produce organic fertilizer"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 40,
    badgeName: "Compost Master"
  },

  zero_waste: {
    id: "zero_waste",
    title: "Zero Waste Warrior",
    description: "Learn to segregate waste for eco-friendly farming.",
    activities: [
      "Separate organic and non-organic waste",
      "Collect dry leaves for mulch",
      "Prepare a mini waste station at home"
    ],
    outcomes: [
      "Adopt zero-waste habits",
      "Reduce farm waste",
      "Improve sustainability"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 85,
    badgeName: "Zero Waste Warrior"
  },

  mini_garden: {
    id: "mini_garden",
    title: "Miniplot Mastery",
    description: "Create your first small garden with 5 easy plants.",
    activities: [
      "Select 5 beginner-friendly plants",
      "Prepare soil patch",
      "Plant seeds/saplings",
      "Water and mulch"
    ],
    outcomes: [
      "Start home gardening",
      "Understand plant basics",
      "Build confidence in growing crops"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 100,
    badgeName: "Garden Starter"
  },

  mulch_master: {
    id: "mulch_master",
    title: "Soil Shield",
    description: "Protect your soil using natural mulch.",
    activities: [
      "Collect dry leaves/straw",
      "Spread mulch around plants",
      "Water lightly to settle mulch"
    ],
    outcomes: [
      "Reduce soil temperature",
      "Improve moisture retention",
      "Suppress weeds naturally"
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 60,
    badgeName: "Mulch Master"
  },

  boll_keeper: {
    id: "boll_keeper",
    title: "Boll Keeper Mastery Challenge",
    description: "Master the art of cotton boll retention through strategic interventions. Learn to prevent premature shedding and maximize yield from every square.",
    activities: [
      "Scout for early boll shedding patterns",
      "Identify stress factors causing shedding",
      "Apply balanced foliar nutrition",
      "Manage pest damage to bolls",
      "Monitor and track boll retention rates"
    ],
    outcomes: [
      "Increase boll retention by 15-25%",
      "Improve cotton yield by 2-3 quintals/acre",
      "Reduce premature shedding by 40%",
      "Boost farmer income by ₹8,000-12,000/acre"
    ],
    difficulty: "Pro",
    cropType: "Cotton",
    xpReward: 150,
    badgeName: "Boll Keeper Master",
    steps: [
      {
        title: "Step 1 — Field Scouting for Shedding Patterns",
        objective: "Identify WHERE, WHEN, and HOW MUCH shedding is occurring in your field.",
        subSteps: [
          "TIMING: Scout every 5-7 days starting from square formation (40-50 days after sowing)",
          "SAMPLE SIZE: Select 10 random plants diagonally across the field (avoid edges)",
          "COUNT STRUCTURES: Per plant - Total squares/bolls, Freshly shed (last 2-3 days - look yellowish), Old shed (brown/dried)",
          "SHEDDING RATE CALCULATION: (Fresh shed / Total structures) × 100. Normal = 5-10% per week. Alert if >15%",
          "LOCATION MAPPING: Note if shedding is uniform or concentrated in wet/dry/shaded areas",
          "POSITION ON PLANT: Check which branches shed most - Lower (water stress), Middle (nutrient stress), Upper (pest damage)",
          "RECORD DATA: Use phone or notebook - date, plant number, shedding count, weather conditions"
        ],
        reason: "Why Scout Regularly? Shedding patterns reveal the CAUSE. Bottom shedding = irrigation issue. Top shedding = pest/temperature. Uniform shedding = nutrient deficiency. This guides your intervention.",
        image: "/images/quests/boll_keeper/step2.jpg"
      },
      {
        title: "Step 2 — Diagnosing the Root Cause",
        objective: "Use simple field tests to identify what's stressing your cotton plants.",
        subSteps: [
          "WATER STRESS TEST: Dig 6 inches near root zone. Soil should be moist like a wrung sponge. Dry = water stress. Soggy = waterlogging",
          "LEAF COLOR CHECK: Dark green = excess nitrogen (vegetative growth, less fruiting). Light green/yellow = nitrogen deficiency",
          "BORON DEFICIENCY SIGNS: Thick, brittle leaves. Short internodes. Squares turning brown before shedding (boron critical for boll retention)",
          "POTASSIUM DEFICIENCY: Leaf edges yellowing/browning. Weak stems. Bolls shedding from base",
          "PEST DAMAGE INSPECTION: Cut open shed squares - Presence of pink bollworm larvae or Entry holes = pest damage",
          "TEMPERATURE STRESS: If shedding coincides with >38°C temperatures for 3+ consecutive days = heat stress",
          "GROWTH STAGE: If plant is too vegetative (tall, leafy, few fruits) = excess nitrogen or water"
        ],
        tip: "QUICK DIAGNOSIS TIP: If plants look healthy but shed bolls = Boron deficiency (invisible). If plants look stressed (yellowing, stunted) = N/K deficiency or water stress.",
        image: "/images/quests/boll_keeper/step3.jpg"
      },
      {
        title: "Step 3 — Irrigation Management for Retention",
        objective: "Optimize water supply during critical boll development period.",
        subSteps: [
          "CRITICAL STAGE: Flowering to boll development (60-90 days after sowing) - DO NOT stress plants here",
          "IRRIGATION FREQUENCY: Every 7-10 days depending on soil type. Sandy soil = 7 days. Clay = 10 days",
          "DEPTH: Irrigate to 1.5-2 feet depth (root zone depth). Light frequent irrigation = shallow roots = stress",
          "TIMING: Early morning (before 10 AM) or evening (after 4 PM) to minimize evaporation",
          "AVOID WATERLOGGING: Ensure good drainage. Standing water for >6 hours = root rot + boll shedding",
          "MULCHING: Apply organic mulch to conserve moisture and reduce irrigation frequency by 20-30%",
          "DROUGHT RECOVERY: If plants wilted due to drought, irrigate lightly first, then deep - sudden heavy water can shock plants"
        ],
        reason: "Why Critical Period Matters? During flowering/boll formation, even 2-3 days of water stress triggers massive shedding. Plant aborts young bolls to conserve water for survival.",
        image: "/images/quests/boll_keeper/step4.jpg"
      },
      {
        title: "Step 4 — Foliar Nutrition for Boll Retention",
        objective: "Provide quick-acting nutrients directly through leaves to stop shedding.",
        subSteps: [
          "BORON SPRAY (Most Critical): Mix 0.5g Borax per liter of water (500g per 1000L). Spray at square formation and boll development",
          "WHY BORON? Strengthens pollen tubes for fertilization. Deficiency = poor pollination = boll shedding. Apply 2-3 sprays, 15 days apart",
          "POTASSIUM BOOST: Mix 5g MOP (Muriate of Potash) per liter OR 2% KCl solution. Spray during boll filling. Strengthens boll walls",
          "DAP SPRAY (for N+P): 10g DAP per liter water. 1-2 sprays during peak flowering if plants are light green",
          "MICRONUTRIENT MIX: Zinc (0.5g/L) + Magnesium (1g/L) + Boron (0.5g/L) - comprehensive spray for stressed plants",
          "SPRAY TIMING: Early morning (6-9 AM) or evening (4-6 PM) when stomata are open. Never in afternoon heat",
          "COVERAGE: Spray both upper and lower leaf surfaces. Use fine mist, not large droplets. 400-500L spray solution per acre"
        ],
        tip: "Emergency Intervention: If shedding is severe (>20% weekly), spray Boron + Potassium immediately. Boll shedding can reduce by 50% within 10 days of proper foliar spray!",
        image: "/images/quests/boll_keeper/step5.jpg"
      },
      {
        title: "Step 5 — Pest Management for Boll Protection",
        objective: "Protect bolls from pest damage that triggers premature shedding.",
        subSteps: [
          "TARGET PESTS: Pink bollworm (internal damage), American bollworm (external), Jassids (sap sucking causes stress)",
          "SCOUTING: Check 10 plants for pest eggs/larvae. Egg threshold = 5 eggs per plant for spray decision",
          "PHEROMONE TRAPS: Install 8-10 traps per acre to catch adult moths. Reduces egg laying by 40-50%",
          "BIO-PESTICIDES: Neem oil (3ml/L) + Bacillus thuringiensis (Bt) spray. Safe, effective against young larvae",
          "CHEMICAL OPTION (if severe): Emamectin benzoate or Chlorantraniliprole - follow label instructions. Spray only if damage >5%",
          "HAND PICKING: Remove and destroy visibly damaged bolls to prevent pest spread to healthy bolls",
          "SPRAY ROTATION: Alternate between bio-pesticides and chemicals to prevent resistance. Never use same chemical twice in a row"
        ],
        reason: "Pest-Shedding Link: Bollworm damage to squares/young bolls causes plant to abort them. One larvae can damage 5-10 bolls in its lifetime. Early pest control = saved bolls.",
        image: "/images/quests/boll_keeper/step6.jpg"
      },
      {
        title: "Step 6 — Monitoring Retention Success",
        objective: "Track boll retention improvements and measure intervention impact.",
        subSteps: [
          "BASELINE RECORDING: Before intervention - Count total bolls + shedding rate on 10 tagged plants",
          "WEEKLY TRACKING: Count new bolls formed vs bolls shed on same tagged plants",
          "RETENTION RATE: (Bolls retained / Total bolls formed) × 100. Target = 30-35% retention (good). 40%+ = excellent",
          "COMPARE ZONES: If you treated only part of field, compare treated vs untreated area. Measure the difference",
          "YIELD ESTIMATION: At maturity, count open bolls per plant. Average 25-30 bolls/plant = good yield (3-4 quintals/acre)",
          "ECONOMIC ANALYSIS: Calculate spray cost vs extra yield. Typical ROI = 300-400% (spend ₹1000, gain ₹3000-4000)",
          "PHOTO DOCUMENTATION: Click weekly photos of tagged plants to show progress over time"
        ],
        tip: "Success Indicators: Week 1-2 after intervention - Shedding slows. Week 3-4 - New boll formation increases. Week 5-6 - Existing bolls grow healthy. By harvest - Visible yield increase!",
        image: "/images/quests/boll_keeper/step7.jpg"
      },
      {
        title: "Conclusion & Season-End Review",
        objective: "You've completed the Boll Keeper Challenge! Review learnings and plan for next season.",
        subSteps: [
          "INTEGRATED APPROACH WORKS: No single factor - Water + Nutrition + Pest control = Maximum boll retention",
          "BORON IS KING: Single most important micronutrient for cotton. 2-3 foliar sprays can increase retention by 20-30%",
          "TIMING IS EVERYTHING: Intervene during flowering-boll formation stage (60-90 DAS). Too early or too late = less impact",
          "ECONOMIC BENEFIT: ₹2000-3000 intervention cost. ₹10,000-15,000 extra income from saved bolls. Net profit ₹8,000-12,000/acre",
          "KNOWLEDGE GAINED: You can now diagnose shedding causes, apply targeted solutions, track results like a pro",
          "NEXT SEASON: Start interventions early (preventive). Don't wait for shedding to begin (curative)",
          "SHARE KNOWLEDGE: Teach neighboring farmers - community-level boll retention = better regional cotton yields"
        ],
        tip: "Advanced Strategy: Combine boll retention practices with drip irrigation + timely pest control = potential 30-40% yield increase. Some progressive farmers achieve 7-8 quintals/acre with these methods!",
        image: null
      }
    ]
  },

  coconut_basin: {
    id: "coconut_basin",
    title: "Build the Life Ring",
    description: "Create water-saving basins around coconut trees.",
    activities: [
      "Mark 1–1.5m radius",
      "Dig shallow circular basin",
      "Level inner part",
      "Fill with mulch",
      "Water gently"
    ],
    outcomes: [
      "Save 20–30% irrigation water",
      "Improve coconut root health",
      "Increase moisture retention"
    ],
    difficulty: "Pro",
    cropType: "Coconut",
    xpReward: 140,
    badgeName: "Basin Builder"
  },

  coconut_bioenzyme: {
    id: "coconut_bioenzyme",
    title: "Coconut Water Bio-Elixir",
    description: "Create a natural bio-enzyme using coconut water.",
    activities: [
      "Collect coconut water",
      "Mix with jaggery",
      "Ferment for 7 days",
      "Dilute and apply"
    ],
    outcomes: [
      "Boost soil microbes",
      "Enhance plant growth",
      "Improve soil health"
    ],
    difficulty: "Pro",
    cropType: "Coconut",
    xpReward: 125,
    badgeName: "Bio-Elixir Maker"
  },

  rust_shield: {
    id: "rust_shield",
    title: "Rust Shield Challenge",
    description: "Protect your wheat crop from devastating rust disease using integrated organic management practices. Learn to identify, prevent, and control rust infections naturally.",
    activities: [
      "Scout and identify rust symptoms early",
      "Remove and destroy infected plant parts",
      "Improve air circulation and spacing",
      "Apply organic fungicidal treatments",
      "Monitor and track disease progression"
    ],
    outcomes: [
      "Reduce rust infection by 60-70%",
      "Protect wheat yield and quality",
      "Build long-term disease resistance",
      "Save on chemical fungicide costs"
    ],
    difficulty: "Pro",
    cropType: "Wheat",
    xpReward: 160,
    badgeName: "Rust Shield Guardian",
    steps: [
      {
        title: "Step 1 — Field Scouting & Identification",
        objective: "Learn to identify rust symptoms early before it spreads across your entire field.",
        subSteps: [
          "WHEN TO SCOUT: Start from 30 days after sowing, scout weekly during tillering stage",
          "LEAF RUST: Small circular/oval orange-brown pustules scattered on upper leaf surface",
          "STEM RUST: Dark reddish-brown elongated pustules on stems and leaf sheaths (most severe)",
          "STRIPE RUST: Yellow-orange pustules in linear stripes parallel to leaf veins",
          "CHECK LOWER LEAVES: Disease usually starts on older, lower leaves and moves upward",
          "PUSTULE TEST: Rub infected leaf - rust spores will stain your fingers orange/brown",
          "FIELD PATTERN: Look for patches near water sources or shaded areas first"
        ],
        reason: "Why Scout Weekly? Rust has a 10-14 day cycle. Early detection within the first infection cycle prevents exponential spread. Waiting even 2 weeks can mean going from 5% to 40% infection.",
        image: "/images/quests/rust_shield/step2.jpg"
      },
      {
        title: "Step 2 — Sanitation & Removal",
        objective: "Remove the source of infection to prevent spore multiplication.",
        subSteps: [
          "EARLY STAGE (Less than 5% infection): Remove only the infected lower leaves",
          "Cut or pluck infected leaves carefully to avoid shaking spores onto healthy plants",
          "DISPOSAL: DO NOT compost! Burn infected material or bury deep (minimum 2 feet)",
          "Clean tools with alcohol/sanitizer after use to avoid spreading spores",
          "If infection is above 20%, complete removal may not be feasible - focus on control",
          "After removal, apply organic treatment immediately to protect remaining foliage",
          "VOLUNTEER WHEAT: Remove any self-sown wheat plants from previous season (they harbor rust)"
        ],
        tip: "Best Time for Removal: Early morning when leaves are dewy - spores are less likely to become airborne. Avoid windy days.",
        image: "/images/quests/rust_shield/step3.jpg"
      },
      {
        title: "Step 3 — Cultural Practices for Prevention",
        objective: "Modify your field environment to make it unfavorable for rust fungus.",
        subSteps: [
          "SPACING: Ensure proper row spacing (20-23cm for wheat) to improve air circulation",
          "AVOID OVER-CROWDING: Reduce seed rate if you're planting too densely",
          "IRRIGATION MANAGEMENT: Avoid overhead irrigation - use drip or furrow irrigation instead",
          "TIMING OF IRRIGATION: Water early morning (before 9 AM) so leaves dry by noon",
          "NITROGEN CONTROL: Excess nitrogen makes plants succulent and rust-susceptible - use balanced NPK",
          "WEEDING: Remove weeds that increase humidity and block airflow",
          "RESISTANT VARIETIES: For next season, choose rust-resistant wheat varieties for your region"
        ],
        reason: "The Strategy: Rust thrives in humid, crowded conditions. By improving airflow and reducing leaf wetness duration (aim for less than 6 hours), you make the environment hostile to spore germination.",
        image: "/images/quests/rust_shield/step4.jpg"
      },
      {
        title: "Step 4 — Organic Fungicidal Spray Preparation",
        objective: "Prepare effective organic fungicides using locally available materials.",
        subSteps: [
          "OPTION 1 - Neem Solution: Mix 30ml neem oil + 5ml liquid soap in 10L water (Azadirachtin inhibits spore germination)",
          "OPTION 2 - Garlic-Chili Spray: Blend 100g garlic + 50g green chili in 1L water, strain, dilute to 10L (antifungal compounds)",
          "OPTION 3 - Baking Soda Spray: Mix 10g baking soda + 10ml vegetable oil + 5ml soap in 10L water (changes leaf pH)",
          "OPTION 4 - Sulfur Spray: 20g wettable sulfur powder in 10L water (approved organic fungicide)",
          "OPTION 5 - Cow Urine: Fermented cow urine diluted 1:10 with water (has antifungal properties)",
          "Add STICKER: Always add 5-10ml liquid soap as a spreader-sticker for better coverage"
        ],
        tip: "ROTATION IS KEY: Don't use the same spray repeatedly. Rotate between 2-3 options every week to prevent fungal resistance and maximize effectiveness.",
        image: "/images/quests/rust_shield/step5.jpg"
      },
      {
        title: "Step 5 — Application Protocol",
        objective: "Apply organic fungicides correctly for maximum disease suppression.",
        subSteps: [
          "FREQUENCY: Spray every 7-10 days once rust is detected, continue for 3-4 weeks",
          "TIMING: Spray early morning (6-9 AM) or evening (4-6 PM) - never in hot sun",
          "COVERAGE: Spray both upper AND lower leaf surfaces - rust often starts underneath",
          "EQUIPMENT: Use knapsack sprayer with fine nozzle for good coverage (avoid coarse droplets)",
          "VOLUME: 400-500 L per acre for good coverage (adjust based on crop density)",
          "WEATHER CHECK: Don't spray if rain is expected within 6 hours",
          "PROTECTIVE MEASURES: In severe cases, start preventive spraying even before symptoms appear"
        ],
        reason: "Timing Matters: Organic fungicides work by prevention and contact action, not systemic action. They must be present on the leaf before spores land. Once rust establishes inside the leaf, organic methods are less effective.",
        image: "/images/quests/rust_shield/step6.jpg"
      },
      {
        title: "Step 6 — Monitoring & Record Keeping",
        objective: "Track disease progression and treatment effectiveness.",
        subSteps: [
          "SEVERITY SCORING: Count infected leaves in random 10 plants weekly",
          "Note: 0-5% = Trace, 5-20% = Low, 20-40% = Moderate, 40%+ = Severe",
          "RECORD TREATMENTS: Note what you sprayed, when, and weather conditions",
          "VISUAL TRACKING: Take photos of the same marked area every week",
          "YIELD COMPARISON: At harvest, compare yield from treated vs untreated areas (if any)",
          "LESSONS LEARNED: Document what worked and what didn't for next season",
          "SHARE DATA: Connect with local extension services to report rust outbreaks"
        ],
        tip: "Success Indicator: If new pustule formation slows down and existing pustules dry up (turn black) within 2-3 weeks of treatment, your approach is working!",
        image: "/images/quests/rust_shield/step7.jpg"
      },
      {
        title: "Conclusion & Season-End Review",
        objective: "You've completed the Rust Shield Challenge! Review your learnings and plan for future seasons.",
        subSteps: [
          "INTEGRATED APPROACH WINS: No single method works - combining scouting, sanitation, cultural practices, and sprays gives 60-70% control",
          "PREVENTION > CURE: Rust-resistant varieties + proper spacing + balanced nutrition = 80% of the battle",
          "ORGANIC CAN WORK: With diligence, organic methods can match synthetic fungicides for moderate infections",
          "ECONOMIC BENEFIT: Saved ₹2000-4000/acre on chemical fungicides; preserved beneficial insects and soil health",
          "KNOWLEDGE GAINED: You can now identify rust types, understand disease cycles, and act decisively",
          "NEXT SEASON: Choose resistant varieties, maintain wider spacing, start preventive sprays earlier",
          "COMMUNITY IMPACT: Share your knowledge with neighboring farmers to create a rust-resistant zone"
        ],
        tip: "ADVANCED TIP: Rust spores overwinter on volunteer wheat and grasses. A community-wide effort to eliminate these 'green bridges' between seasons can dramatically reduce rust pressure next year.",
        image: null
      }
    ]
  },

  biodiversity_strip: {
    id: "biodiversity_strip",
    title: "Biodiversity Bloom Bar",
    description: "Create a vibrant strip of flowering plants to attract beneficial insects, pollinators, and natural predators - your farm's living defense system.",
    activities: [
      "Select 5-7 pollinator-friendly native plants",
      "Prepare 1-meter wide biodiversity strip",
      "Plant flowers in species clusters",
      "Mulch, water, and maintain regularly",
      "Monitor beneficial insect activity"
    ],
    outcomes: [
      "Increase beneficial insect presence by 300%",
      "Improve natural pest control",
      "Boost pollination and crop yields",
      "Create a beautiful, functional farm ecosystem"
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 190,
    badgeName: "Biodiversity Hero",
    steps: [
      {
        title: "Step 1 — Plant Selection (The Champions)",
        objective: "Choose 5-7 flower species that bloom at different times and attract diverse beneficial insects.",
        subSteps: [
          "EARLY BLOOMERS (Spring): Mustard family flowers, Coriander, Fennel - attract early parasitic wasps",
          "MID-SEASON (Summer): Marigold, Sunflower, Cosmos, Zinnia - attract bees, butterflies, and predatory beetles",
          "LATE BLOOMERS (Fall): Buckwheat, Sweet Alyssum, Basil flowers - provide food when pests peak",
          "SPECIALIST ATTRACTORS: Plant Dill/Parsley for lacewings, Yarrow for ladybugs, Lantana for butterflies",
          "HEIGHT VARIETY: Mix tall (sunflower 6ft), medium (zinnia 2-3ft), and low (alyssum 6in) plants",
          "AVOID: Exotic ornamentals that local insects don't recognize; Minimize single-species monoculture",
          "BUDGET TIP: Many beneficial flowers self-seed - plant once, harvest seeds, replant next year for free"
        ],
        reason: "Why Diversity? Different insects need different flower shapes, colors, and nectar types. A diverse strip = diverse beneficial insects = comprehensive pest control.",
        image: "/images/quests/biodiversity_strip/step2.jpg"
      },
      {
        title: "Step 2 — Site Selection & Preparation",
        objective: "Choose the best location and prepare the soil for your biodiversity strip.",
        subSteps: [
          "LOCATION: Field edges, between crop rows, along irrigation channels, near vegetable patches",
          "SUNLIGHT: Most flowers need 6+ hours of direct sun - avoid deep shade",
          "WIDTH: Minimum 1 meter (3 feet), ideal 1.5-2 meters for maximum impact",
          "LENGTH: Start with 10-20 meters; even a small strip helps, but longer is better",
          "CLEAR THE STRIP: Remove existing weeds, grass, and debris - you want flowers, not competition",
          "LOOSEN SOIL: Use a spade or hoe to break up compacted soil to 6-8 inches deep",
          "OPTIONAL COMPOST: Mix in 2-inch layer of compost for nutrient-poor soils (most flowers prefer lean soil)"
        ],
        tip: "Strategic Placement: Install strips UPWIND of your main crops. Beneficials will fly downwind from flowers into your crops, bringing pest control with them.",
        image: "/images/quests/biodiversity_strip/step3.jpg"
      },
      {
        title: "Step 3 — Planting in Clusters",
        objective: "Plant your flowers in species-specific clusters to create visual 'targets' for insects.",
        subSteps: [
          "CLUSTER STRATEGY: Group the same species in patches of 3-5 plants, rather than mixing randomly",
          "WHY? Insects are attracted to large color blocks - easier to spot from a distance",
          "SPACING WITHIN CLUSTER: Follow seed packet instructions (usually 6-12 inches apart)",
          "ROW ARRANGEMENT: Tall plants at the back (north side), medium in middle, short at front (south side) - prevents shading",
          "DIRECT SEEDING: For hardy species like marigold, cosmos, sunflower - scatter seeds and cover lightly with soil",
          "TRANSPLANTS: For basil, zinnia - use seedlings to get quicker blooms",
          "WATERING: Water gently after planting to settle soil around roots"
        ],
        reason: "The Science: Bees have color vision but poor detail resolution. A cluster of 5 yellow sunflowers is 10x more visible than 5 individual sunflowers scattered randomly.",
        image: "/images/quests/biodiversity_strip/step4.jpg"
      },
      {
        title: "Step 4 — Mulching & Initial Care",
        objective: "Protect young seedlings and conserve moisture with proper mulching.",
        subSteps: [
          "MULCH TYPE: Use organic mulch - dried grass clippings, straw, or shredded leaves",
          "APPLICATION: Spread 2-3 inch layer around plants (not touching stems directly)",
          "BENEFITS: Suppresses weeds, retains moisture, moderates soil temperature",
          "WATERING SCHEDULE: Water every 2-3 days for first 2 weeks until established",
          "AFTER ESTABLISHMENT: Most flowers are drought-tolerant and need watering only during dry spells",
          "WEED PATROL: Hand-pull any weeds that emerge in first month - after that, flowers will outcompete them",
          "THINNING: If seedlings are overcrowded, thin to recommended spacing after 2 weeks"
        ],
        tip: "Avoid Overwatering: Most beneficial flowers (marigold, cosmos, sunflower) THRIVE in slightly dry conditions. Overwatering encourages fungal diseases and weak stems.",
        image: "/images/quests/biodiversity_strip/step5.jpg"
      },
      {
        title: "Step 5 — Bloom Management & Maintenance",
        objective: "Keep your biodiversity strip flowering continuously throughout the season.",
        subSteps: [
          "DEADHEADING: Remove faded flowers weekly - this triggers plants to produce more blooms (especially for zinnias, cosmos)",
          "EXCEPTION: Leave some flowers to go to seed for self-seeding next year (mark these plants)",
          "SUCCESSION PLANTING: Every 2-3 weeks, plant a few more fast-bloomers like marigold to ensure continuous flowers",
          "FERTILIZATION: Generally NOT needed - lean soil produces more flowers; rich soil produces leaves",
          "PEST MANAGEMENT ON FLOWERS: Tolerate minor pest damage - they attract the predators you want!",
          "SEASONAL REFRESH: Replant annual species each season; perennial flowers (if used) return yearly",
          "PRUNING: Trim overgrown plants by 1/3 in mid-season to promote bushier growth and more blooms"
        ],
        reason: "Continuous Bloom = Continuous Protection: A strip that flowers March-November provides season-long beneficial insect recruitment, matching your crop's pest pressure cycles.",
        image: "/images/quests/biodiversity_strip/step6.jpg"
      },
      {
        title: "Step 6 — Monitoring Beneficial Insect Activity",
        objective: "Track the increase in beneficial insects and measure the impact on your farm.",
        subSteps: [
          "VISUAL SURVEYS: Walk the strip 2x per week and count beneficial insects you see (bees, ladybugs, butterflies, hoverflies)",
          "COMPARISON: Compare pest levels in crops NEAR the biodiversity strip vs crops far away",
          "TRACKING METRICS: Week 1-2: Few insects. Week 3-4: Butterflies and bees arrive. Week 6-8: Predatory insects establish.",
          "SUCCESS SIGNS: Ladybug larvae on crop leaves, Parasitized pest eggs (brown/shriveled), Reduced aphid colonies",
          "PHOTO DOCUMENTATION: Take weekly photos of the strip and nearby crops to show progress",
          "FARMER NETWORK: Share results with neighbors - encourage them to create strips too (landscape-level impact)",
          "ECONOMIC ANALYSIS: Estimate pesticide savings (₹500-2000/acre/season typical)"
        ],
        tip: "Patience Required: Full biodiversity strip benefits appear in 6-8 weeks. By Year 2, the strip self-maintains and beneficial insect populations are 5x higher than Year 1!",
        image: "/images/quests/biodiversity_strip/step7.jpg"
      },
      {
        title: "Conclusion & Ecological Impact",
        objective: "You've created a thriving biodiversity strip! Understand the long-term benefits and next steps.",
        subSteps: [
          "ECOSYSTEM SERVICES UNLOCKED: Pollination (±40% crop yield), Pest control (saves ₹1500/acre), Soil health (flower roots prevent erosion)",
          "BEYOND INSECTS: Your strip also attracts birds (eat caterpillars), spiders (eat flies), and small predators",
          "CLIMATE RESILIENCE: Diverse ecosystems are more resilient to heat, drought, and pest outbreaks",
          "SCALING UP: If this strip works, add more strips every season until 5-10% of your farm is biodiversity habitat",
          "COMMUNITY EFFECT: If 5 neighboring farmers create strips, benefits multiply due to insect movement between farms",
          "KNOWLEDGE SHARING: You're now a biodiversity advocate - teach others how easy and effective this is",
          "NEXT LEVEL: Explore native wildflower mixes, insect hotels, or perennial hedgerows for permanent biodiversity infrastructure"
        ],
        tip: "Biodiversity Economics: Initial investment ₹500-800 for seeds. Annual pesticide savings ₹2000-3000. Yield increase from pollination ₹3000-5000. ROI = 600% or more!",
        image: null
      }
    ]
  },

  rainwater_hero: {
    id: "rainwater_hero",
    title: "Rainwater Hero",
    description: "Set up a simple rainwater collection system.",
    activities: [
      "Place barrel under roof edge",
      "Attach filter mesh",
      "Install outlet tap",
      "Use water for plants"
    ],
    outcomes: [
      "Reduce water usage",
      "Increase self-sufficiency",
      "Improve sustainability"
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 185,
    badgeName: "Water Saver"
  },

  biochar_maker: {
    id: "biochar_maker",
    title: "Biochar Mastery Challenge",
    description: "Create biochar using farm waste to enrich soil.",
    activities: [
      "Collect woody waste",
      "Burn in low-oxygen pit",
      "Crush cooled charcoal",
      "Mix with compost"
    ],
    outcomes: [
      "Improve soil fertility",
      "Increase carbon storage",
      "Boost microbial activity"
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 200,
    badgeName: "Biochar Master"
  },

  jeevamrutham: {
    id: "jeevamrutham",
    title: "Panchakavya",
    description: "Create a batch of panchakavya, a potent traditional microbial culture that acts as an immunity booster for your garden.",
    activities: [
      "Mix cow dung & urine",
      "Add jaggery + flour",
      "Ferment for 5–7 days",
      "Apply near root zone"
    ],
    outcomes: [
      "Boost soil microbial life",
      "Enhance nutrient availability",
      "Increase crop health"
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 150,
    badgeName: "Microbe Booster",
    steps: [
      {
        title: "Prep & Inventory",
        objective: "Before you brew, gather your alchemical ingredients. Note: This recipe is scaled for a standard 'Home Garden Bucket' (approx. 20 Liters).",
        subSteps: [
          "1 Plastic Bucket (20L capacity) – Do not use metal",
          "A wooden stick (for stirring)",
          "Breathable cloth (cotton or jute) & string/rope",
          "1 kg Fresh Cow Dung (Indigenous cow dung is best, but any fresh dung works)",
          "1 Liter Cow Urine (Aged is fine)",
          "250g Jaggery (Black/chemical-free is best) OR fruit pulp",
          "250g Pulse Flour (Besan/Gram flour or any dicot flour)",
          "Handful of Soil (Undisturbed soil from a forest or healthy farm bund)"
        ],
        tip: "Time Required: 20 Minutes (Active) + 5 Days (Passive Fermentation). Goal: Brew a living culture that converts soil nutrients into a form plants can eat.",
        image: "/images/quests/jeevamrutham/step1.jpg"
      },
      {
        title: "Step 1 — The Base (The Culture)",
        objective: "Create the liquid medium for the microbes.",
        subSteps: [
          "Water: Fill your 20L bucket with about 15–17 Liters of water (leave space at the top for foam)",
          "The Source: Add the 1 kg of Cow Dung and 1 Liter of Cow Urine to the water",
          "Mix: Use your wooden stick and mix thoroughly until the dung is dissolved and no large lumps remain"
        ],
        reason: "Why? Cow dung is the primary source of the beneficial bacteria/fungi. Cow urine is anti-fungal and acts as an electrolyte.",
        image: "/images/quests/jeevamrutham/step2.jpg"
      },
      {
        title: "Step 2 — The Fuel (The Food)",
        objective: "Feed the microbes so they multiply rapidly.",
        subSteps: [
          "Add Energy: Dissolve the 250g Jaggery in the bucket (This is sugar/carbohydrate energy for the microbes)",
          "Add Protein: Sprinkle in the 250g Pulse Flour (This provides protein for the microbes to build their bodies)",
          "The Inoculant: Toss in the Handful of Soil (This introduces native microbes that are already adapted to your local climate)",
          "Stir: Mix vigorously"
        ],
        image: "/images/quests/jeevamrutham/step3.jpg"
      },
      {
        title: "Step 3 — The Fermentation (The Magic)",
        objective: "Let the culture brew.",
        subSteps: [
          "Cover: Tie the breathable cloth over the top of the bucket (This keeps flies out but lets air/oxygen in)",
          "Place: Store the bucket in the shade (Direct sunlight/UV rays will kill the microbes)",
          "The Ritual: Stir the mixture clockwise for 1 minute, twice a day (Morning and Evening)",
          "Wait: Let it ferment for 5 to 7 days"
        ],
        tip: "The Clockwise Stir: Stirring creates a vortex that oxygenates the pile, helping aerobic bacteria thrive.",
        image: "/images/quests/jeevamrutham/step4.jpg"
      },
      {
        title: "Step 4 — Application (The Boost)",
        objective: "Feed your soil. Status Check: After 5–7 days, the mixture should smell fermented (slightly sour, like yeast/alcohol) and have bubbles on top. It is ready!",
        subSteps: [
          "Dilute: Important! Do not use it pure. Dilute this bucket with water at a 1:10 ratio (1 mug of Jeevamrutham to 10 mugs of water)",
          "Apply: Pour the diluted liquid on moist soil near the root zone of your plants",
          "Mulch: For best results, cover the wet soil with dry leaves (mulch) immediately after applying",
          "Note: Use the batch within 7 days of fermentation finishing"
        ],
        image: "/images/quests/jeevamrutham/step5.jpg"
      },
      {
        title: "Conclusion & Learning Summary",
        objective: "Mission Complete! You have successfully created a microbial inoculum.",
        subSteps: [
          "It's not a fertilizer: Jeevamrutham is not primarily about N-P-K (Nitrogen/Phosphorus/Potassium). It is a culture.",
          "Microbes do the work: You introduced millions of microbes into the soil. These microbes eat the biomass (mulch/compost) in your garden and unlock the nutrients for the plants.",
          "The Symbiosis: The Jaggery was the starter energy; the Flour was the building block; the Dung was the source.",
          "Shade is Key: You learned that UV light is the enemy of soil microbes, which is why we ferment in the shade and apply near roots."
        ],
        image: null
      }
    ]
  },

  coconut_bioenzyme: {
    id: "coconut_bioenzyme",
    title: "Coconut Water Bio-Elixir",
    description: "Create a powerful bio-enzyme from tender coconut water - a natural growth promoter, disease controller, and soil conditioner all in one fermented solution.",
    activities: [
      "Collect fresh tender coconut water",
      "Add jaggery and starter culture",
      "Ferment for 30-45 days with weekly stirring",
      "Strain and bottle the bio-enzyme",
      "Apply as foliar spray or soil drench"
    ],
    outcomes: [
      "Create multi-purpose organic bio-enzyme",
      "Boost plant immunity and growth",
      "Control fungal and bacterial diseases",
      "Improve soil microbial diversity",
      "Save ₹5000-8000 on chemical inputs"
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 180,
    badgeName: "Bio-Enzyme Master",
    steps: [
      {
        title: "Step 1 — Ingredient Collection & Preparation",
        objective: "Gather high-quality ingredients for your bio-enzyme fermentation. Quality inputs = Quality output!",
        subSteps: [
          "TENDER COCONUT WATER: 10 Liters from fresh green coconuts (7-8 months old). Avoid old brown coconuts",
          "JAGGERY: 1 kg organic jaggery (unrefined cane sugar). Dark/black jaggery works best for microbial food",
          "STARTER CULTURE (Choose ONE): 500ml buttermilk OR 200g old curd OR 100ml EM (Effective Microorganisms) solution",
          "CONTAINER: 20-liter plastic barrel/drum with tight-fitting lid. DO NOT use metal (reacts with acids)",
          "TOOLS: Wooden ladle for stirring, Clean cloth for filtering, Funnel, Dark glass bottles for storage",
          "OPTIONAL BOOSTERS: 5-6 curry leaves, Small piece of turmeric root, Handful of neem leaves (enhances antimicrobial properties)",
          "WORKSPACE: Shaded, well-ventilated area away from direct sunlight. Temperature 25-35°C ideal"
        ],
        tip: "Pro Tip: Use coconut water within 2-3 hours of extraction. Fresher = More enzymes! If coconuts are unavailable, substitute with sugarcane juice (but coconut is superior for plant growth hormones).",
        image: "/images/quests/coconut_bioenzyme/step1.jpg"
      },
      {
        title: "Step 2 — The Base Preparation",
        objective: "Create the nutrient-rich liquid base that will feed billions of beneficial microbes.",
        subSteps: [
          "DISSOLVE JAGGERY: Pour 10L coconut water into the plastic barrel",
          "Add 1kg jaggery and stir vigorously with wooden ladle until completely dissolved (10-15 minutes)",
          "CHECK SWEETNESS: Taste should be moderately sweet (like sweet lemonade). Too sweet = adjust with water",
          "TEMPERATURE CHECK: Liquid should be at room temperature (25-30°C). If chilled coconut, let it warm naturally",
          "OPTIONAL: Add curry leaves, turmeric, neem leaves now if using (crush lightly to release compounds)",
          "WHY JAGGERY? It's unrefined, rich in minerals (Fe, Mg, Ca) and trace elements that microbes need to multiply"
        ],
        reason: "Science: Coconut water contains cytokinins (growth hormones), enzymes (catalase, peroxidase), minerals, and amino acids. Jaggery provides carbon energy. Together they create the perfect microbial banquet!",
        image: "/images/quests/coconut_bioenzyme/step2.jpg"
      },
      {
        title: "Step 3 — Inoculation (Adding the Culture)",
        objective: "Introduce beneficial microbes that will transform simple ingredients into a bio-active elixir.",
        subSteps: [
          "ADD STARTER: Pour 500ml buttermilk OR 200g curd (whisked smooth) into the barrel",
          "STIR THOROUGHLY: Mix for 5 minutes to distribute microbes evenly throughout the liquid",
          "INITIAL BUBBLING: You may see some foam/bubbles - this is good! Microbes are starting to work",
          "ALTERNATIVE STARTER: If using EM solution, add 100ml and mix well",
          "COVER LOOSELY: Place lid on barrel but DON'T seal tight. Microbes need air (aerobic fermentation)",
          "BREATHABLE COVER: Better option - tie thick cotton cloth over opening instead of lid (allows gas exchange, keeps insects out)"
        ],
        tip: "Microbe Magic: Buttermilk/curd contains Lactobacillus (lactic acid bacteria), Saccharomyces (yeasts), and Acetobacter (acetic acid bacteria). These will multiply exponentially in the coconut-jaggery mix!",
        image: "/images/quests/coconut_bioenzyme/step3.jpg"
      },
      {
        title: "Step 4 — Fermentation Process (The Waiting Game)",
        objective: "Let microbes work their magic over 30-45 days. Patience required!",
        subSteps: [
          "PLACEMENT: Keep barrel in shaded area (garage, shed, under tree). Avoid direct sunlight and rain",
          "DAILY STIRRING (First 7 days): Stir clockwise for 2-3 minutes once daily. This oxygenates and prevents mold",
          "WEEKLY STIRRING (After day 7): Stir once every 3-4 days until day 30",
          "WEEK 1 SIGNS: Sweet smell, bubbles/foam, slight warming of container (metabolic heat)",
          "WEEK 2-3 SIGNS: Smell turns sour-tangy (like vinegar/wine), liquid darkens, foam reduces",
          "WEEK 4-6 SIGNS: Strong vinegar smell, clear liquid (sediment settles), minimal bubbling = READY!",
          "pH CHECK (Optional): Use pH paper. Ready enzyme has pH 3.5-4.5 (acidic like vinegar)"
        ],
        reason: "Fermentation Stages: Week 1-2 = Yeast dominance (alcohol production). Week 3-4 = Bacteria convert alcohol to acetic acid. Week 5-6 = Enzyme maturation and stabilization.",
        image: "/images/quests/coconut_bioenzyme/step4.jpg"
      },
      {
        title: "Step 5 — Harvesting & Storage",
        objective: "Extract, filter, and store your bio-enzyme for long-term use.",
        subSteps: [
          "READINESS TEST: After 30-45 days, smell should be sharp vinegar-like, taste very sour, no sweet taste remaining",
          "FILTERING: Place clean cotton cloth over a large container. Pour liquid through to remove sediment/leaves",
          "OPTIONAL 2nd FILTER: For ultra-clean enzyme, filter again through fine muslin cloth",
          "BOTTLING: Pour filtered liquid into dark glass bottles (brown/green). Fill to 90% (leave air gap)",
          "CAP TIGHTLY: Unlike fermentation, storage bottles should be sealed tight to prevent evaporation",
          "STORAGE LOCATION: Cool, dark place (pantry, cellar). Avoid heat and direct sunlight",
          "SHELF LIFE: Properly stored = 2-3 years! Gets more potent with age (like wine)"
        ],
        tip: "Sediment Gold: Don't discard the sediment! Mix it into compost pile or apply directly to soil as microbial inoculant. It's packed with dormant microbes!",
        image: "/images/quests/coconut_bioenzyme/step5.jpg"
      },
      {
        title: "Step 6 — Application Methods & Dosage",
        objective: "Use your bio-enzyme effectively for maximum plant benefit.",
        subSteps: [
          "FOLIAR SPRAY (For disease control): Dilute 1:20 (50ml enzyme + 1L water). Spray on leaves early morning or evening",
          "SOIL DRENCH (For root health): Dilute 1:10 (100ml enzyme + 1L water). Pour around root zone, not on stem",
          "SEED TREATMENT: Soak seeds in 1:50 dilution for 30 minutes before sowing (improves germination)",
          "FREQUENCY: Foliar - Once every 10-15 days. Soil drench - Once a month",
          "PEST REPELLENT: Stronger dilution 1:5 repels aphids, whiteflies, mealybugs (spray directly on pests)",
          "COMPOST ACTIVATOR: Add 250ml undiluted enzyme per 100kg compost to speed decomposition",
          "CAUTION: Never use undiluted on plants - too acidic! Always dilute"
        ],
        reason: "How It Works: Enzymes break down complex nutrients into plant-available forms. Organic acids (acetic, lactic) create unfavorable conditions for pathogens. Beneficial microbes colonize leaf surface and rhizosphere.",
        image: "/images/quests/coconut_bioenzyme/step6.jpg"
      },
      {
        title: "Conclusion & Benefits Recap",
        objective: "You've created a powerful multi-purpose bio-solution! Understand the full potential.",
        subSteps: [
          "PLANT BENEFITS: Enhanced growth (cytokinins from coconut), Better flowering/fruiting, Improved stress tolerance",
          "DISEASE CONTROL: Suppresses fungal diseases (powdery mildew, anthracnose), Controls bacterial leaf spots, Repels common pests",
          "SOIL HEALTH: Increases beneficial microbial population, Improves nutrient cycling, Enhances soil structure",
          "COST SAVINGS: One 10L batch costs ₹150-200 to make. Replaces ₹5000-8000 worth of chemical fungicides, growth promoters, and pesticides annually",
          "SUSTAINABILITY: 100% organic, Zero chemical residue, Safe for beneficial insects and soil organisms",
          "MULTIPURPOSE: Use on vegetables, fruits, flowers, ornamentals, even indoor plants",
          "SHARE KNOWLEDGE: Teach others - bio-enzymes are a game-changer for organic farming"
        ],
        tip: "Advanced Use: Mix with neem oil (10ml neem + 1ml enzyme + 1L water) for super-effective pest and disease control spray. This combination is a powerhouse!",
        image: null
      }
    ]
  }
};




export const QUEST_DIFFICULTY_LEVELS = {
  BEGINNER: "Beginner",
  PRO: "Pro"
};
