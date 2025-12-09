'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download } from 'lucide-react'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    console.log(`User response to the install prompt: ${outcome}`)

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Optionally set a flag in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(parseInt(dismissed))
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      if (dismissedDate > weekAgo) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (!showInstallPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
              <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Install FarmStellar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add to your home screen for quick access
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleInstallClick} className="flex-1">
            Install
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  )
}