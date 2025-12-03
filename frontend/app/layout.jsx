import { Analytics } from "@vercel/analytics/next"
import { Quicksand, Mali } from "next/font/google"
import "./globals.css"

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
  //     {
  //       url: "/icon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: "/apple-icon.png",
  // },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
