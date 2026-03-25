import "./globals.css"
import { Oxanium, Sora } from "next/font/google"
import type { Metadata } from "next"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-oxanium" })
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" })

export const metadata: Metadata = {
  title: "Inmortal RP | FiveM Roleplay",
  description:
    "Servidor de roleplay moderno con economía viva, staff activo y una comunidad enfocada en historias inolvidables."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${oxanium.variable} ${sora.variable}`}>
      <body className="font-[var(--font-sora)] antialiased">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
