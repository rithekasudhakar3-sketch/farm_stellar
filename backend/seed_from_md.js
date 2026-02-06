const mongoose = require('mongoose');
require('dotenv').config();
const Quest = require('./models/Quest');

const quests = [
  {
    "id": "biochar_maker",
    "title": "Biochar Mastery Challenge",
    "description": "This folder should contain images for the Biochar Mastery Challenge quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Material Collection & Pit Preparation",
        "image": "/images/quests/biochar_maker/step1.jpg",
        "subSteps": [
          "Collection of woody waste (twigs, branches, corn cobs)",
          "Digging the cone-shaped pit",
          "Tools required (shovel, matchbox, water bucket)",
          "Dry biomass ready for burning"
        ],
        "objective": "Collection of woody waste (twigs, branches, corn cobs)",
        "tip": ""
      },
      {
        "title": "The Initial Burn",
        "image": "/images/quests/biochar_maker/step2.jpg",
        "subSteps": [
          "Starting the fire at the bottom of the pit",
          "Small fire established with dry twigs",
          "Smoke rising initially",
          "Safety precautions visible (water nearby)"
        ],
        "objective": "Starting the fire at the bottom of the pit",
        "tip": ""
      },
      {
        "title": "Layering Process",
        "image": "/images/quests/biochar_maker/step3.jpg",
        "subSteps": [
          "Adding layers of biomass gradually",
          "Fire burning evenly",
          "Covering the flames with new material",
          "\"Quenching\" the smoke with new layers"
        ],
        "objective": "Adding layers of biomass gradually",
        "tip": ""
      },
      {
        "title": "The Pyrolysis Phase",
        "image": "/images/quests/biochar_maker/step4.jpg",
        "subSteps": [
          "Pit full of glowing embers",
          "No visible flames, just heat",
          "Covering the pit with soil or metal sheet",
          "Cutting off oxygen supply"
        ],
        "objective": "Pit full of glowing embers",
        "tip": ""
      },
      {
        "title": "Quenching & Crushing",
        "image": "/images/quests/biochar_maker/step5.jpg",
        "subSteps": [
          "Pouring water/slurry on the hot char",
          "Steam rising (quenching)",
          "Crushing the cooled charcoal",
          "Final biochar texture (crumbly, black)"
        ],
        "objective": "Pouring water/slurry on the hot char",
        "tip": ""
      },
      {
        "title": "Activation & Application",
        "image": "/images/quests/biochar_maker/step6.jpg",
        "subSteps": [
          "Mixing biochar with compost or cow dung slurry",
          "\"Charging\" the biochar",
          "Applying to soil/garden beds",
          "Incorporating into the root zone",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Farm setting, practical demonstration",
          "Focus: Fire safety, process steps, and final product",
          "Show safe fire management practices",
          "Clearly demonstrate the \"cone pit\" method",
          "Highlight the difference between ash (white) and char (black)",
          "Show the quenching process clearly"
        ],
        "objective": "Mixing biochar with compost or cow dung slurry",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Material Collection & Pit Preparation",
      "The Initial Burn",
      "Layering Process"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/biochar_maker/step1.jpg"
  },
  {
    "id": "biodiversity_strip",
    "title": "Biodiversity Bloom Bar",
    "description": "This folder should contain images for the Biodiversity Strip creation quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Understanding Biodiversity Strips",
        "image": "/images/quests/biodiversity_strip/step1.jpg",
        "subSteps": [
          "Overview of a biodiversity strip along farm edge",
          "Colorful flowering strip next to crop field",
          "Show diverse flowers and visiting insects (bees, butterflies)",
          "Educational/illustrative showing the concept",
          "Wide angle showing integration with farm"
        ],
        "objective": "Overview of a biodiversity strip along farm edge",
        "tip": ""
      },
      {
        "title": "Plant Selection (The Champions)",
        "image": "/images/quests/biodiversity_strip/step2.jpg",
        "subSteps": [
          "Display of various pollinator-friendly flowers",
          "Seed packets or labeled flower varieties",
          "Mix of heights: tall sunflowers, medium zinnias, low alyssum",
          "Colorful arrangement showing diversity",
          "Garden planning or selection scene"
        ],
        "objective": "Display of various pollinator-friendly flowers",
        "tip": ""
      },
      {
        "title": "Site Selection & Preparation",
        "image": "/images/quests/biodiversity_strip/step3.jpg",
        "subSteps": [
          "Farmer preparing soil along field edge",
          "Cleared strip of land ready for planting",
          "Tools: spade, rake, hoe visible",
          "Show the 1-2 meter width clearly",
          "Field or vegetable garden in background"
        ],
        "objective": "Farmer preparing soil along field edge",
        "tip": ""
      },
      {
        "title": "Planting in Clusters",
        "image": "/images/quests/biodiversity_strip/step4.jpg",
        "subSteps": [
          "Farmer planting flowers in clustered groups",
          "Seeds or seedlings being planted",
          "Show cluster arrangement (3-5 plants per species)",
          "Hands in soil, planting action",
          "Row arrangement visible"
        ],
        "objective": "Farmer planting flowers in clustered groups",
        "tip": ""
      },
      {
        "title": "Mulching & Initial Care",
        "image": "/images/quests/biodiversity_strip/step5.jpg",
        "subSteps": [
          "Mulch being applied around young flower seedlings",
          "Organic mulch (straw, grass clippings, leaves)",
          "Watering can or irrigation visible",
          "Young plants with mulch layer",
          "Care and maintenance scene"
        ],
        "objective": "Mulch being applied around young flower seedlings",
        "tip": ""
      },
      {
        "title": "Bloom Management & Maintenance",
        "image": "/images/quests/biodiversity_strip/step6.jpg",
        "subSteps": [
          "Farmer deadheading flowers or maintaining blooms",
          "Vibrant, fully blooming biodiversity strip",
          "Mix of flowers at peak bloom",
          "Maintenance tools (pruning shears)",
          "Healthy, thriving flower display"
        ],
        "objective": "Farmer deadheading flowers or maintaining blooms",
        "tip": ""
      },
      {
        "title": "Monitoring Beneficial Insect Activity",
        "image": "/images/quests/biodiversity_strip/step7.jpg",
        "subSteps": [
          "Beneficial insects on flowers (bees, ladybugs, butterflies, hoverflies)",
          "Farmer observing or photographing insects",
          "Close-up of insects on flowers",
          "Notebook or tablet for tracking",
          "Active ecosystem with visible insect activity",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Vibrant, colorful, showing biodiversity and ecosystem health",
          "Focus: Beneficial insects, diverse flowers, integrated farm ecosystem",
          "Show diverse, colorful flowering plants",
          "Include visible beneficial insects where applicable",
          "Demonstrate integrated pest management",
          "Emphasize beauty AND functionality",
          "Show realistic farm/garden settings",
          "Highlight diversity and ecosystem services"
        ],
        "objective": "Beneficial insects on flowers (bees, ladybugs, butterflies, hoverflies)",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Understanding Biodiversity Strips",
      "Plant Selection (The Champions)",
      "Site Selection & Preparation"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/biodiversity_strip/step1.jpg"
  },
  {
    "id": "boll_keeper",
    "title": "Boll Keeper Mastery Challenge",
    "description": "This folder should contain images for the Cotton Boll Retention Management quest.",
    "difficulty": "Beginner",
    "cropType": "Cotton",
    "xpReward": 100,
    "steps": [
      {
        "title": "Field Scouting for Shedding Patterns",
        "image": "/images/quests/boll_keeper/step2.jpg",
        "subSteps": [
          "Farmer inspecting cotton plants in field",
          "Examining squares and bolls on cotton plant",
          "Counting shed bolls on ground",
          "Close-up of cotton plant with developing bolls",
          "Note-taking or data recording visible"
        ],
        "objective": "Farmer inspecting cotton plants in field",
        "tip": ""
      },
      {
        "title": "Diagnosing the Root Cause",
        "image": "/images/quests/boll_keeper/step3.jpg",
        "subSteps": [
          "Farmer conducting field diagnostic tests",
          "Soil moisture check (digging near roots)",
          "Leaf color inspection for deficiency symptoms",
          "Cut-open shed square showing internal condition",
          "Diagnostic tools: soil probe, hand trowel"
        ],
        "objective": "Farmer conducting field diagnostic tests",
        "tip": ""
      },
      {
        "title": "Irrigation Management for Retention",
        "image": "/images/quests/boll_keeper/step4.jpg",
        "subSteps": [
          "Cotton field being irrigated (drip or furrow)",
          "Healthy cotton plants with adequate moisture",
          "Water management demonstration",
          "Mulching around cotton plants",
          "Proper soil moisture visible"
        ],
        "objective": "Cotton field being irrigated (drip or furrow)",
        "tip": ""
      },
      {
        "title": "Foliar Nutrition for Boll Retention",
        "image": "/images/quests/boll_keeper/step5.jpg",
        "subSteps": [
          "Farmer preparing foliar nutrient spray",
          "Mixing boron or potassium spray solution",
          "Spray equipment (knapsack sprayer, containers)",
          "Ingredients: borax, MOP, measuring tools",
          "Field preparation for foliar application"
        ],
        "objective": "Farmer preparing foliar nutrient spray",
        "tip": ""
      },
      {
        "title": "Pest Management for Boll Protection",
        "image": "/images/quests/boll_keeper/step6.jpg",
        "subSteps": [
          "Cotton boll with pest damage identification",
          "Pheromone trap installation in cotton field",
          "Farmer inspecting bolls for bollworm damage",
          "Pest control spray application",
          "Damaged vs healthy boll comparison"
        ],
        "objective": "Cotton boll with pest damage identification",
        "tip": ""
      },
      {
        "title": "Monitoring Retention Success",
        "image": "/images/quests/boll_keeper/step7.jpg",
        "subSteps": [
          "Farmer counting bolls on tagged cotton plants",
          "Notebook/tablet with tracking data",
          "Healthy cotton plants with retained bolls",
          "Before/after comparison photos",
          "Measuring yield/retention metrics",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Practical cotton farming, field-based demonstrations",
          "Focus: Cotton bolls, squares, shedding management techniques",
          "Show realistic cotton cultivation practices",
          "Include Indian cotton farming context",
          "Demonstrate boll retention techniques clearly",
          "Show healthy vs stressed cotton plants",
          "Include diagnostic and intervention methods",
          "Emphasize practical, actionable content"
        ],
        "objective": "Farmer counting bolls on tagged cotton plants",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Field Scouting for Shedding Patterns",
      "Diagnosing the Root Cause",
      "Irrigation Management for Retention"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/boll_keeper/step2.jpg"
  },
  {
    "id": "coconut_bioenzyme",
    "title": "Coconut Water Bio-Elixir",
    "description": "This folder should contain images for the Coconut Water Bio-Enzyme creation quest.",
    "difficulty": "Beginner",
    "cropType": "Coconut",
    "xpReward": 100,
    "steps": [
      {
        "title": "Ingredient Collection & Preparation",
        "image": "/images/quests/coconut_bioenzyme/step1.jpg",
        "subSteps": [
          "Fresh tender coconuts (green, young coconuts)",
          "Ingredients displayed: coconut water, jaggery, buttermilk/curd",
          "Plastic barrel/container",
          "Optional boosters: curry leaves, turmeric, neem leaves",
          "Preparation workspace setup"
        ],
        "objective": "Fresh tender coconuts (green, young coconuts)",
        "tip": ""
      },
      {
        "title": "The Base Preparation",
        "image": "/images/quests/coconut_bioenzyme/step2.jpg",
        "subSteps": [
          "Pouring coconut water into barrel",
          "Dissolving jaggery in coconut water",
          "Stirring the mixture with wooden ladle",
          "Sweet liquid base preparation",
          "Ingredients being mixed together"
        ],
        "objective": "Pouring coconut water into barrel",
        "tip": ""
      },
      {
        "title": "Inoculation (Adding the Culture)",
        "image": "/images/quests/coconut_bioenzyme/step3.jpg",
        "subSteps": [
          "Adding buttermilk or curd starter to the mixture",
          "Stirring process to distribute microbes",
          "Initial foam/bubbles visible",
          "Covering barrel with breathable cloth",
          "Inoculation demonstration"
        ],
        "objective": "Adding buttermilk or curd starter to the mixture",
        "tip": ""
      },
      {
        "title": "Fermentation Process",
        "image": "/images/quests/coconut_bioenzyme/step4.jpg",
        "subSteps": [
          "Barrel in shaded area (under tree, garage, shed)",
          "Fermenting mixture with visible changes",
          "Daily/weekly stirring demonstration",
          "Foam, bubbles, or fermentation signs",
          "Timeline progression visual"
        ],
        "objective": "Barrel in shaded area (under tree, garage, shed)",
        "tip": ""
      },
      {
        "title": "Harvesting & Storage",
        "image": "/images/quests/coconut_bioenzyme/step5.jpg",
        "subSteps": [
          "Filtering fermented bio-enzyme through cloth",
          "Dark glass bottles for storage",
          "Clear, fermented liquid visible",
          "Bottling and packaging process",
          "Final product appearance"
        ],
        "objective": "Filtering fermented bio-enzyme through cloth",
        "tip": ""
      },
      {
        "title": "Application Methods & Dosage",
        "image": "/images/quests/coconut_bioenzyme/step6.jpg",
        "subSteps": [
          "Diluted bio-enzyme spray application on plants",
          "Foliar spraying demonstration",
          "Soil drench application",
          "Measuring and dilution setup",
          "Plants being treated with bio-enzyme",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Organic farming, traditional fermentation aesthetic",
          "Focus: Bio-enzyme preparation, fermentation, and application",
          "Show realistic coconut water extraction and fermentation",
          "Include Indian farming/home garden context",
          "Demonstrate fermentation stages clearly",
          "Show proper storage and application methods",
          "Emphasize organic, natural bio-enzyme creation",
          "Include safety and hygiene practices"
        ],
        "objective": "Diluted bio-enzyme spray application on plants",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Ingredient Collection & Preparation",
      "The Base Preparation",
      "Inoculation (Adding the Culture)"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/coconut_bioenzyme/step1.jpg"
  },
  {
    "id": "compost_kickoff",
    "title": "Compost Kickoff",
    "description": "This folder should contain images for the Compost Kickoff quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Pick a Spot ✅ ADDED",
        "image": "/images/quests/compost_kickoff/step1.jpg",
        "subSteps": [
          "A simple compost bin or a pile in a garden corner.",
          "Shows twigs at the bottom.",
          "Shady spot.",
          "**Image shows:** Wooden compost bin in a garden setting with \"Compost Corner\" sign"
        ],
        "objective": "A simple compost bin or a pile in a garden corner.",
        "tip": ""
      },
      {
        "title": "Mix Greens & Browns ✅ ADDED",
        "image": "/images/quests/compost_kickoff/step2.jpg",
        "subSteps": [
          "Shows green waste (peels, scraps) and brown waste (leaves, paper).",
          "Mixing them together.",
          "Visual \"No\" sign for meat/dairy.",
          "**Image shows:** Compost bin filled with greens and browns, with \"Greens & Browns\" sign"
        ],
        "objective": "Shows green waste (peels, scraps) and brown waste (leaves, paper).",
        "tip": ""
      },
      {
        "title": "Water & Wait ✅ ADDED",
        "image": "/images/quests/compost_kickoff/step3.jpg",
        "subSteps": [
          "Watering the pile with a can.",
          "Turning the pile with a pitchfork.",
          "Final dark compost soil.",
          "**Image shows:** Person watering compost bin with green watering can, showing greens and browns mixture",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: Clear and simple",
          "Style: Cartoon or simple photo"
        ],
        "objective": "Watering the pile with a can.",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Pick a Spot ✅ ADDED",
      "Mix Greens & Browns ✅ ADDED",
      "Water & Wait ✅ ADDED"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/compost_kickoff/step1.jpg"
  },
  {
    "id": "crop_quest",
    "title": "Crops That Fit",
    "description": "This folder should contain images for the Crops That Fit quest - a beginner-friendly guide to choosing the right crops.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Understanding Your Climate",
        "image": "/images/quests/crop_quest/step1.jpg",
        "subSteps": [
          "Farmer checking weather/temperature",
          "Different climate zones visualization",
          "Seasonal calendar",
          "Simple climate assessment"
        ],
        "objective": "Farmer checking weather/temperature",
        "tip": ""
      },
      {
        "title": "Know Your Soil Type",
        "image": "/images/quests/crop_quest/step2.jpg",
        "subSteps": [
          "Different soil samples (sandy, clay, loamy)",
          "Simple soil testing",
          "Farmer examining soil texture",
          "Soil comparison demonstration"
        ],
        "objective": "Different soil samples (sandy, clay, loamy)",
        "tip": ""
      },
      {
        "title": "Water Availability Check",
        "image": "/images/quests/crop_quest/step3.jpg",
        "subSteps": [
          "Water sources (well, rain, irrigation)",
          "Measuring water availability",
          "Different irrigation methods",
          "Water planning for crops"
        ],
        "objective": "Water sources (well, rain, irrigation)",
        "tip": ""
      },
      {
        "title": "Choosing Your First 3 Crops",
        "image": "/images/quests/crop_quest/step4.jpg",
        "subSteps": [
          "Variety of beginner-friendly crops displayed",
          "Crop selection guide",
          "Seeds or seedlings of different crops",
          "Farmer selecting crops"
        ],
        "objective": "Variety of beginner-friendly crops displayed",
        "tip": ""
      },
      {
        "title": "Understanding Planting Seasons",
        "image": "/images/quests/crop_quest/step5.jpg",
        "subSteps": [
          "Seasonal planting calendar",
          "Kharif, Rabi, Zaid seasons",
          "Best planting times",
          "Seasonal crop examples"
        ],
        "objective": "Seasonal planting calendar",
        "tip": ""
      },
      {
        "title": "Planning Your Garden Layout",
        "image": "/images/quests/crop_quest/step6.jpg",
        "subSteps": [
          "Simple garden layout sketch",
          "Crop spacing demonstration",
          "Companion planting examples",
          "Garden bed preparation",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Beginner-friendly, educational",
          "Focus: Simple, accessible farming knowledge",
          "Show diverse crop options",
          "Include visual guides and charts",
          "Demonstrate simple assessment methods",
          "Focus on beginner-appropriate crops",
          "Emphasize sustainable choices"
        ],
        "objective": "Simple garden layout sketch",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Understanding Your Climate",
      "Know Your Soil Type",
      "Water Availability Check"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/crop_quest/step1.jpg"
  },
  {
    "id": "mini_garden",
    "title": "Mini Garden",
    "description": "Please place the following images in this directory: - `step1.jpg` - Image for Step 1: Pick Your Top 5 - `step2.jpg` - Image for Step 2: Make the Bed - `step3.jpg` - Image for Step 3: Plant Your Map - `step4.jpg` - Image for Step 4: The Magic Touch",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [],
    "active": true,
    "activities": [],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ]
  },
  {
    "id": "mulch_master",
    "title": "Mulch Master (Soil Shield)",
    "description": "This folder contains images for the Mulch Master quest.",
    "difficulty": "Pro",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Collect Mulch ✅ ADDED",
        "image": "/images/quests/mulch_master/step1.jpg",
        "subSteps": [
          "Dry leaves, straw, or grass clippings in bags or baskets.",
          "Natural mulching materials gathered together.",
          "Person collecting fallen leaves from yard.",
          "Various mulch options displayed (leaves, straw, shredded paper).",
          "**Image shows:** Person in garden sorting different types of mulch materials (straw, dry leaves, wood chips) into bags and baskets, demonstrating the variety of mulching options available"
        ],
        "objective": "Dry leaves, straw, or grass clippings in bags or baskets.",
        "tip": ""
      },
      {
        "title": "Spread the Mulch ✅ ADDED",
        "image": "/images/quests/mulch_master/step2.jpg",
        "subSteps": [
          "Mulch being spread around plants in a circle.",
          "2-3 inch thick layer of mulch covering soil.",
          "Gap between mulch and plant stem clearly visible.",
          "Person spreading mulch around garden plants.",
          "**Image shows:** Person kneeling in garden, carefully spreading mulch around a young pepper plant from a bag, creating a protective circle on the soil"
        ],
        "objective": "Mulch being spread around plants in a circle.",
        "tip": ""
      },
      {
        "title": "Water & Watch ✅ ADDED",
        "image": "/images/quests/mulch_master/step3.jpg",
        "subSteps": [
          "Watering can sprinkling water over mulch.",
          "Settled mulch around healthy plants.",
          "Before/after comparison showing mulched vs unmulched soil.",
          "Happy plants thriving with mulch protection.",
          "**Image shows:** Person watering the newly mulched plant with a green watering can, helping the mulch settle into place",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: Clear and simple",
          "Style: Beginner-friendly, showing the simplicity of mulching"
        ],
        "objective": "Watering can sprinkling water over mulch.",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Collect Mulch ✅ ADDED",
      "Spread the Mulch ✅ ADDED",
      "Water & Watch ✅ ADDED"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/mulch_master/step1.jpg"
  },
  {
    "id": "panchakavya",
    "title": "Panchakavya",
    "description": "This folder should contain the following images for the Panchakavya preparation quest:",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Preparation & Sacred Ingredients",
        "image": "/images/quests/panchakavya/step1.jpg",
        "subSteps": [
          "Traditional farming scene with ingredients laid out on a wooden table",
          "Should show: cow dung, cow urine bottle, milk jar, curd bowl, ghee jar",
          "Optional items: jaggery, coconut, bananas, earthen pot",
          "Rustic, traditional Indian farming aesthetic"
        ],
        "objective": "Traditional farming scene with ingredients laid out on a wooden table",
        "tip": ""
      },
      {
        "title": "The Foundation (Ghee + Dung mixing)",
        "image": "/images/quests/panchakavya/step2.jpg",
        "subSteps": [
          "Farmer's hands mixing cow ghee with fresh cow dung in earthen pot",
          "Close-up shot showing the mixing process",
          "Natural outdoor setting with warm lighting"
        ],
        "objective": "Farmer's hands mixing cow ghee with fresh cow dung in earthen pot",
        "tip": ""
      },
      {
        "title": "The Liquid Phase",
        "image": "/images/quests/panchakavya/step3.jpg",
        "subSteps": [
          "Adding liquid cow products (milk, curd, urine) to the mixture",
          "Earthen pot with milky liquid",
          "Farm background, natural lighting"
        ],
        "objective": "Adding liquid cow products (milk, curd, urine) to the mixture",
        "tip": ""
      },
      {
        "title": "Optional Boosters",
        "image": "/images/quests/panchakavya/step4.jpg",
        "subSteps": [
          "Adding jaggery, coconut water, or ripe bananas to the fermentation",
          "Golden jaggery dissolving in the mixture",
          "Traditional preparation aesthetic"
        ],
        "objective": "Adding jaggery, coconut water, or ripe bananas to the fermentation",
        "tip": ""
      },
      {
        "title": "Fermentation Process",
        "image": "/images/quests/panchakavya/step5.jpg",
        "subSteps": [
          "Covered earthen pot with breathable cloth tied on top",
          "Pot sitting in shade under tree or in farm shed",
          "Peaceful, traditional fermentation scene"
        ],
        "objective": "Covered earthen pot with breathable cloth tied on top",
        "tip": ""
      },
      {
        "title": "Quality Check & Storage",
        "image": "/images/quests/panchakavya/step6.jpg",
        "subSteps": [
          "Checking the ready panchakavya mixture",
          "Creamy whitish mixture in the pot",
          "Storage containers nearby"
        ],
        "objective": "Checking the ready panchakavya mixture",
        "tip": ""
      },
      {
        "title": "Application",
        "image": "/images/quests/panchakavya/step7.jpg",
        "subSteps": [
          "Farmer spraying diluted panchakavya on healthy green crops",
          "Lush vegetable garden or crop field",
          "Plants looking vibrant and healthy",
          "Morning or evening light",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Natural, organic farming aesthetic with warm tones"
        ],
        "objective": "Farmer spraying diluted panchakavya on healthy green crops",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Preparation & Sacred Ingredients",
      "The Foundation (Ghee + Dung mixing)",
      "The Liquid Phase"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/panchakavya/step1.jpg"
  },
  {
    "id": "rainwater_hero",
    "title": "Rainwater Hero",
    "description": "This folder should contain images for the Rainwater Hero quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Site Assessment & Planning",
        "image": "/images/quests/rainwater_hero/step1.jpg",
        "subSteps": [
          "Farmer examining roof area and gutters",
          "Measuring roof catchment area",
          "Identifying downspout locations",
          "Planning the collection system layout"
        ],
        "objective": "Farmer examining roof area and gutters",
        "tip": ""
      },
      {
        "title": "Barrel Selection & Preparation",
        "image": "/images/quests/rainwater_hero/step2.jpg",
        "subSteps": [
          "Different types of collection barrels/drums",
          "Cleaning and preparing the barrel",
          "Drilling holes for tap and overflow",
          "Food-grade barrel preparation"
        ],
        "objective": "Different types of collection barrels/drums",
        "tip": ""
      },
      {
        "title": "Filter Installation",
        "image": "/images/quests/rainwater_hero/step3.jpg",
        "subSteps": [
          "Installing mesh filter at inlet",
          "First flush diverter setup",
          "Debris screen installation",
          "Filter materials (gravel, sand, mesh)"
        ],
        "objective": "Installing mesh filter at inlet",
        "tip": ""
      },
      {
        "title": "Barrel Positioning & Connection",
        "image": "/images/quests/rainwater_hero/step4.jpg",
        "subSteps": [
          "Placing barrel on stable platform",
          "Connecting to downspout",
          "Ensuring proper height and stability",
          "Overflow pipe installation"
        ],
        "objective": "Placing barrel on stable platform",
        "tip": ""
      },
      {
        "title": "Tap Installation & Testing",
        "image": "/images/quests/rainwater_hero/step5.jpg",
        "subSteps": [
          "Installing outlet tap/spigot",
          "Testing for leaks",
          "Water flow demonstration",
          "Tap positioning for easy access"
        ],
        "objective": "Installing outlet tap/spigot",
        "tip": ""
      },
      {
        "title": "Usage & Maintenance",
        "image": "/images/quests/rainwater_hero/step6.jpg",
        "subSteps": [
          "Using collected water for plants",
          "Cleaning the filter",
          "Checking water quality",
          "Seasonal maintenance tasks",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Practical DIY demonstration",
          "Focus: Simple, replicable rainwater harvesting",
          "Show affordable, accessible materials",
          "Demonstrate proper installation techniques",
          "Include safety considerations",
          "Show both rural and urban applications",
          "Emphasize water conservation benefits"
        ],
        "objective": "Using collected water for plants",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Site Assessment & Planning",
      "Barrel Selection & Preparation",
      "Filter Installation"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/rainwater_hero/step1.jpg"
  },
  {
    "id": "rust_shield",
    "title": "Rust Shield Challenge",
    "description": "This folder should contain images for the Wheat Rust Disease Management quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Understanding Rust Disease",
        "image": "/images/quests/rust_shield/step1.jpg",
        "subSteps": [
          "Educational diagram or real photo showing wheat rust disease",
          "Should display: rust pustules on wheat leaves (orange-brown spots)",
          "Close-up of infected wheat leaf",
          "Labels showing different types: Leaf Rust, Stem Rust, Stripe Rust",
          "Educational/scientific style"
        ],
        "objective": "Educational diagram or real photo showing wheat rust disease",
        "tip": ""
      },
      {
        "title": "Field Scouting & Identification",
        "image": "/images/quests/rust_shield/step2.jpg",
        "subSteps": [
          "Farmer scouting wheat field, examining leaves",
          "Close inspection of wheat plants",
          "Hand holding wheat leaf showing rust symptoms",
          "Early morning field scene, natural lighting",
          "Focus on identification process"
        ],
        "objective": "Farmer scouting wheat field, examining leaves",
        "tip": ""
      },
      {
        "title": "Sanitation & Removal",
        "image": "/images/quests/rust_shield/step3.jpg",
        "subSteps": [
          "Farmer carefully removing infected wheat leaves",
          "Proper disposal: infected leaves being burned or buried",
          "Hands wearing gloves, using tools",
          "Emphasis on careful handling to prevent spore spread",
          "Practical demonstration scene"
        ],
        "objective": "Farmer carefully removing infected wheat leaves",
        "tip": ""
      },
      {
        "title": "Cultural Practices for Prevention",
        "image": "/images/quests/rust_shield/step4.jpg",
        "subSteps": [
          "Well-spaced wheat field with good air circulation",
          "Proper row spacing demonstration",
          "Healthy, well-ventilated wheat crop",
          "Furrow or drip irrigation system (not overhead)",
          "Clean, weed-free field environment"
        ],
        "objective": "Well-spaced wheat field with good air circulation",
        "tip": ""
      },
      {
        "title": "Organic Fungicidal Spray Preparation",
        "image": "/images/quests/rust_shield/step5.jpg",
        "subSteps": [
          "Farmer preparing organic spray solutions",
          "Ingredients displayed: neem oil, garlic, baking soda, sulfur",
          "Mixing container with spray preparation",
          "Natural, organic farming scene",
          "Traditional preparation methods"
        ],
        "objective": "Farmer preparing organic spray solutions",
        "tip": ""
      },
      {
        "title": "Application Protocol",
        "image": "/images/quests/rust_shield/step6.jpg",
        "subSteps": [
          "Farmer spraying wheat crop with knapsack sprayer",
          "Early morning or evening application",
          "Good spray coverage on wheat plants",
          "Protective equipment if applicable",
          "Active treatment scene"
        ],
        "objective": "Farmer spraying wheat crop with knapsack sprayer",
        "tip": ""
      },
      {
        "title": "Monitoring & Record Keeping",
        "image": "/images/quests/rust_shield/step7.jpg",
        "subSteps": [
          "Farmer taking notes or photos of wheat field",
          "Comparing infected vs treated areas",
          "Progress tracking documentation",
          "Phone camera taking photos of plants",
          "Assessment and monitoring scene",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: High resolution, photorealistic",
          "Style: Organic farming, agricultural education aesthetic",
          "Focus: Clear demonstration of wheat rust management practices",
          "Show realistic wheat rust disease symptoms",
          "Emphasize organic/natural farming methods",
          "Include Indian/South Asian farming context when possible",
          "Educational and practical demonstrations",
          "Professional agricultural photography style"
        ],
        "objective": "Farmer taking notes or photos of wheat field",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Understanding Rust Disease",
      "Field Scouting & Identification",
      "Sanitation & Removal"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/rust_shield/step1.jpg"
  },
  {
    "id": "zero_waste",
    "title": "Zero Waste Warrior",
    "description": "This folder contains images for the Zero Waste Warrior quest.",
    "difficulty": "Beginner",
    "cropType": "General",
    "xpReward": 100,
    "steps": [
      {
        "title": "Sort Your Waste ✅ ADDED",
        "image": "/images/quests/zero_waste/step1.jpg",
        "subSteps": [
          "Three bins or bags labeled: Green, Brown, and Trash.",
          "Visual examples of what goes in each bin.",
          "Kitchen scraps, dry leaves, and recyclables separated.",
          "**Image shows:** Three labeled bins (Green for kitchen scraps, Brown for dry leaves/paper, Black for recyclables) with \"Sort Your Waste\" poster above"
        ],
        "objective": "Three bins or bags labeled: Green, Brown, and Trash.",
        "tip": ""
      },
      {
        "title": "Set Up Your Waste Station ✅ ADDED",
        "image": "/images/quests/zero_waste/step2.jpg",
        "subSteps": [
          "A corner setup with 3 bins side by side.",
          "Labels on each bin.",
          "Clean and organized waste sorting area.",
          "Optional: Small kitchen bucket for daily collection.",
          "**Image shows:** Person actively sorting kitchen scraps into the green bin, with all three bins set up in a clean indoor space with \"Daily Scraps\" container visible"
        ],
        "objective": "A corner setup with 3 bins side by side.",
        "tip": ""
      },
      {
        "title": "Use Your Waste Wisely ✅ ADDED",
        "image": "/images/quests/zero_waste/step3.jpg",
        "subSteps": [
          "Green waste being added to compost pile.",
          "Brown waste/dry leaves being used as mulch around plants.",
          "Visual showing the transformation: waste → useful resources.",
          "**Image shows:** Person using finished compost as fertilizer for garden plants, with compost bin labeled \"Greens & Browns\" and green/brown bins visible in background, demonstrating the full cycle of waste to resource"
        ],
        "objective": "Green waste being added to compost pile.",
        "tip": ""
      },
      {
        "title": "Track Your Progress ✅ ADDED",
        "image": "/images/quests/zero_waste/step4.jpg",
        "subSteps": [
          "Before and after comparison of trash bin.",
          "Visual showing reduced waste over time.",
          "Happy person celebrating waste reduction success.",
          "Optional: Chart or graph showing progress.",
          "**Image shows:** Person smiling while checking nearly empty trash bin, with full green and brown bins showing successful waste diversion, compost bin and healthy plants in background demonstrating the positive impact",
          "Format: JPG",
          "Recommended size: 800x600 to 1200x900 pixels",
          "Aspect ratio: 4:3 or 16:9",
          "Quality: Clear and simple",
          "Style: Beginner-friendly, encouraging, and easy to understand"
        ],
        "objective": "Before and after comparison of trash bin.",
        "tip": ""
      }
    ],
    "active": true,
    "activities": [
      "Sort Your Waste ✅ ADDED",
      "Set Up Your Waste Station ✅ ADDED",
      "Use Your Waste Wisely ✅ ADDED"
    ],
    "outcomes": [
      " improved yield",
      "sustainable farming",
      "soil conservation"
    ],
    "image": "/images/quests/zero_waste/step1.jpg"
  }
];

const seedQuests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Quest.deleteMany({});
        await Quest.insertMany(quests);
        console.log('Seeded ' + quests.length + ' quests');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedQuests();
