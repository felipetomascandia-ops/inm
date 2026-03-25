"use client"

import Link from "next/link"
import Image from "next/image"

const host = process.env.NEXT_PUBLIC_FIVEM_HOST || ""
const port = process.env.NEXT_PUBLIC_FIVEM_PORT || ""

const joinUrl =
  host && port
    ? `fivem://connect/${host}:${port}`
    : process.env.NEXT_PUBLIC_FIVEM_JOIN_URL || "https://cfx.re/join/"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-violet-500 bg-emerald-900/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">

          <div className="relative h-12 w-12">

            {/* Glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-600 blur-md opacity-60 group-hover:opacity-100 transition" />

            <Image
              src="/images/logo.png"
              alt="Inmortal RP Logo"
              width={48}
              height={48}
              className="relative object-contain rounded-xl"
              priority
            />
          </div>

          <div>
            <p className="text-lg font-semibold text-emerald-100">
              Inmortal RP
            </p>
            <p className="text-xs text-violet-200/50">
              FiveM Roleplay Server
            </p>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-emerald-200/70">
          {[
            { name: "Inicio", href: "/" },
            { name: "Jugadores", href: "/jugadores" },
            { name: "Sobre", href: "/sobre" },
            { name: "Unirse", href: "/unirse" },
            { name: "Discord", href: "/discord" },
            { name: "Comunidad", href: "/comunidad" }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative transition hover:text-emerald-100 group"
            >
              {item.name}

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* BOTÓN */}
        <a
          href={joinUrl}
          className="relative hidden md:inline-flex items-center justify-center text-sm font-semibold text-emerald-100"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-emerald-600 blur-lg opacity-70"></span>

          <span className="relative rounded-full bg-gradient-to-r from-violet-500 to-emerald-600 px-6 py-2 transition hover:scale-105">
            🚀 Conectar
          </span>
        </a>

      </div>
    </header>
  )
}