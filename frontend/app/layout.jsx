import { Analytics } from "@vercel/analytics/next"
import { Quicksand, Mali } from "next/font/google"
import "./globals.css"
import { PreferencesProvider } from "@/components/preferences-provider"
import { ChatbotWidget } from "@/components/chatbot-widget"

const _quicksand = Quicksand({ weight: ["400", "600", "700"], subsets: ["latin"] })
const _mali = Mali({ weight: ["400", "600", "700"], subsets: ["latin"] })

export const metadata = {
  title: "FarmStellar - Learn Sustainable Farming",
  description: "Gamified farming education app for beginners",
  // icons: {
  //   icon: [
  //     {
  //       url: "/icon-light-32x32.png",
  //       media: "(prefers-color-scheme: light)",
  //     },
  //     {
  //       url: "/icon-dark-32x32.png",
  //       media: "(prefers-color-scheme: dark)",
  //     },
  //     {/8
  //       url: "/icon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: "/apple-icon.png",
  // },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <PreferencesProvider>
          {children}
          <ChatbotWidget />
          <Analytics />
        </PreferencesProvider>
      </body>
    </html>
  )
}
