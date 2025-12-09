"use client"

import { ChevronRight } from "lucide-react"

const summaryData = {
  soil_scout: [
    "Soil feel tells water holding and crop fit.",
    "Check soil wetness to know when to water.",
    "Soil colour and smell show soil health.",
    "Good soil gives strong roots and good yield.",
  ],

  crop_quest: [
    "Choose crops that suit your area.",
    "Follow weather to plan crops.",
    "Give crops the needed water.",
    "Grow crops in the right season.",
  ],

  compost_kickoff: [
    "Compost reduces farm waste.",
    "Mix green and dry waste for fast compost.",
    "Right moisture avoids bad smell.",
    "Compost makes soil rich.",
  ],

  zero_waste: [
    "Separate waste to make work easy.",
    "Dry leaves help in mulch and compost.",
    "Zero waste keeps farm clean.",
    "Good waste handling helps the farm.",
  ],

  mini_garden: [
    "Start small to learn easily.",
    "Five plants teach basics.",
    "Learn watering and spacing slowly.",
    "Small garden builds daily care habit.",
  ],

  mulch_master: [
    "Mulch saves water.",
    "Mulch keeps soil cool.",
    "Mulch controls weeds.",
    "Mulch improves soil slowly.",
  ],

  boll_keeper: [
    "Check early boll drop.",
    "Right nutrients help bolls grow.",
    "Remove damaged bolls fast.",
    "Good bolls give good harvest.",
  ],

  coconut_basin: [
    "Round basin keeps water near roots.",
    "Basins help water go deep.",
    "Mulch in basin boosts soil life.",
    "Trees handle dry days better.",
  ],

  coconut_bioenzyme: [
    "Bio-enzyme adds good soil life.",
    "It makes plants stronger.",
    "Diluted enzyme helps plants eat nutrients.",
    "Less need for chemicals.",
  ],

  rust_shield: [
    "Find rust early.",
    "Keep space between plants.",
    "Remove sick leaves soon.",
    "Use organic spray on time.",
  ],

  biodiversity_strip: [
    "Flowers bring helpful insects.",
    "Helpful insects reduce pests.",
    "More insects keep farm balance.",
    "Hedgerows protect soil.",
  ],

  rainwater_hero: [
    "Rainwater saves well water.",
    "Filter rainwater for clean use.",
    "Stored rainwater helps in dry time.",
    "Simple rain systems help the farm.",
  ],

  biochar_maker: [
    "Biochar makes soil loose.",
    "Low-oxygen burn keeps carbon.",
    "Mix biochar with compost.",
    "Biochar keeps soil good for years.",
  ],

  jeevamrutham: [
    "Jeevamrutham adds soil life.",
    "Fermentation makes nutrients ready.",
    "Roots grow strong with it.",
    "Use often for good soil.",
  ],
};

export function LearningSummaryScreen({ quest, onContinue }) {
  const summaryPoints = summaryData[quest.id] || []

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-3xl font-bold text-foreground text-balance mb-2">What You Learned</h2>
        <p className="text-muted-foreground text-sm">Key knowledge from this quest</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-3">
        {summaryPoints.map((point, idx) => (
          <div key={idx} className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">{idx + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-0.5">{point}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={onContinue}
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Back to Home
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
