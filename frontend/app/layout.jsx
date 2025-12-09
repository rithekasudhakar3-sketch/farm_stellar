import { Analytics } from "@vercel/analytics/next"
import { Quicksand, Mali } from "next/font/google"
import { ChatbotWidget } from "@/components/shared/chatbot-widget"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import "./globals.css"
import { PreferencesProvider } from "@/components/preferences-provider"
import { GoogleTranslate } from "@/components/google-translate"

const _quicksand = Quicksand({ weight: ["400", "600", "700"], subsets: ["latin"] })
const _mali = Mali({ weight: ["400", "600", "700"], subsets: ["latin"] })

export const metadata = {
  title: "FarmStellar - Learn Sustainable Farming",
  description: "Gamified farming education app for beginners",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmStellar"
  },
  other: {
    google: "notranslate",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FarmStellar"
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#4CAF50"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4CAF50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FarmStellar" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <PreferencesProvider>
          {children}
          <ChatbotWidget />
          <GoogleTranslate />
          <PWAInstallPrompt />
          <Analytics />
        </PreferencesProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
