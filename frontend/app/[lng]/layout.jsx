import { Quicksand, Mali, Noto_Sans_Malayalam, Noto_Sans_Devanagari } from "next/font/google";
import "../globals.css";
import { languages } from '../i18n/settings'
import { dir } from 'i18next'

const quicksand = Quicksand({ weight: ["400", "600", "700"], subsets: ["latin"] });
const mali = Mali({ weight: ["400", "600", "700"], subsets: ["latin"] });
const notoSansMalayalam = Noto_Sans_Malayalam({ weight: ["400", "700"], subsets: ["malayalam"] });
const notoSansDevanagari = Noto_Sans_Devanagari({ weight: ["400", "700"], subsets: ["devanagari"] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export const metadata = {
  title: "FarmStellar - Learn Sustainable Farming",
  description: "Gamified farming education app for beginners",
}

export default async function RootLayout({ children, params }) {
  const { lng } = await params

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`${quicksand.className} ${notoSansMalayalam.className} ${notoSansDevanagari.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
