"use client"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, CheckCircle2 } from "lucide-react"

export function SoilEvaluationScreen({ quest, onSubmit, onBack }) {
    const { t } = useTranslation("quests")
    const [texture, setTexture] = useState("")
    const [moisture, setMoisture] = useState("")
    const [health, setHealth] = useState("")

    const isComplete = texture && moisture && health

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold">{t('quests.soilEvaluation')}</h1>
                <div className="w-9"></div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">{t('quests.mySoilProfile')}</h2>
                    <p className="text-muted-foreground">{t('quests.soilProfileDesc')}</p>
                </div>

                <div className="space-y-4">
                    <label className="block font-medium">{t('quests.textureTest')}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Sandy", "Silty", "Clay", "Loam"].map(type => (
                            <button
                                key={type}
                                onClick={() => setTexture(type)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${texture === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {t(`quests.soilTypes.${type}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block font-medium">{t('quests.moistureTest')}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Dry", "Moist (Ideal)", "Wet / Waterlogged"].map(type => (
                            <button
                                key={type}
                                onClick={() => setMoisture(type)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${moisture === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {t(`quests.moistureTypes.${type}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block font-medium">{t('quests.healthTest')}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Dark Brown / Earthy", "Red / Yellow", "Gray / Blue-ish", "Pale / White"].map(type => (
                            <button
                                key={type}
                                onClick={() => setHealth(type)}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${health === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {t(`quests.healthTypes.${type}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-border">
                <button
                    onClick={() => onSubmit({ texture, moisture, health })}
                    disabled={!isComplete}
                    className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${isComplete ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                >
                    <span>{t('quests.submitEvaluation')}</span>
                    {isComplete && <CheckCircle2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    )
}
