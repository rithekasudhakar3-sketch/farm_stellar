import { Analytics } from "@vercel/analytics/next"
import { Quicksand, Mali } from "next/font/google"
import { ChatbotWidget } from "@/components/shared/chatbot-widget"
import "./globals.css"
import { PreferencesProvider } from "@/components/preferences-provider"
import { GoogleTranslate } from "@/components/google-translate"

const _quicksand = Quicksand({ weight: ["400", "600", "700"], subsets: ["latin"] })
const _mali = Mali({ weight: ["400", "600", "700"], subsets: ["latin"] })

export const metadata = {
  title: "FarmStellar - Learn Sustainable Farming",
  description: "Gamified farming education app for beginners",
  other: {
    google: "notranslate",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <PreferencesProvider>
          {children}
          <ChatbotWidget />
          <GoogleTranslate />
          <Analytics />
        </PreferencesProvider>  
      </body>
    </html>
  )
}
