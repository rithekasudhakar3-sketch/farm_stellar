import { useState, useEffect } from 'react'

export function useQuests() {
  const [questsData, setQuestsData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuests = async () => {
      try {
        // Dynamic import to ensure fresh data
        const questModule = await import('@/constants/quests')
        setQuestsData(questModule.QUESTS_DATA)
        console.log('[useQuests] Loaded quests:', Object.keys(questModule.QUESTS_DATA))
      } catch (error) {
        console.error('[useQuests] Error loading quests:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuests()
  }, [])

  return { questsData, loading }
}