import Image from "next/image"
import { PlayersCounter } from "@/components/FiveMPlayers"

const host = process.env.NEXT_PUBLIC_FIVEM_HOST || ""
const port = process.env.NEXT_PUBLIC_FIVEM_PORT || ""
const joinUrl =
  host && port
    ? `fivem://connect/${host}:${port}`
    : process.env.NEXT_PUBLIC_FIVEM_JOIN_URL || "https://cfx.re/join/"

export default function PresentacionPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/images/fivem-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-violet-900/50"></div>
      <div className="relative z-10 max-w-2xl mx-auto p-8">
        <Image
          src="/images/logo.gif"
          alt="Inmortal RP Logo"
          width={120}
          height={120}
          className="mx-auto mb-6 rounded-xl"
        />
        <h1 className="text-4xl lg:text-5xl font-bold text-emerald-300 leading-tight">Inmortal RP</h1>
        <p className="mt-4 text-lg text-emerald-100/80 leading-relaxed">
          Tu historia, tu ciudad, tu destino. Vive el roleplay con una comunidad
          activa y experiencias únicas.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 text-emerald-100 text-base">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Jugadores online: <PlayersCounter /></span>
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href={joinUrl}
            className="relative inline-flex items-center justify-center rounded-3xl px-10 py-5 text-lg font-semibold text-white transition hover:scale-[1.05] shadow-lg"
          >
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500 to-emerald-600 blur-lg opacity-70"></span>
            <span className="relative rounded-3xl bg-gradient-to-r from-violet-500 to-emerald-600 px-10 py-5">
              Conectarse al servidor
            </span>
          </a>
          <a
            href="https://discord.gg/QRk8MMXvBD" // Reemplaza con tu enlace de Discord
            className="relative inline-flex items-center justify-center rounded-3xl px-10 py-5 text-lg font-semibold text-emerald-100 transition hover:scale-[1.05] shadow-lg"
          >
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 to-violet-600 blur-lg opacity-70"></span>
            <span className="relative rounded-3xl border border-emerald-400/50 bg-violet-900/50 px-10 py-5">
              Unirse al Discord
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
