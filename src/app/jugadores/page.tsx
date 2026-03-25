"use client"

import { PlayersList } from "@/components/FiveMPlayers"
import { useState, useEffect } from "react"

type FiveMPlayer = {
  id: number
  name: string
  identifiers?: string[]
  ping?: number
}

type FiveMState = {
  serverName: string
  players: FiveMPlayer[]
  maxClients: number
  online: number
}

const mockPlayers: FiveMPlayer[] = [
  { id: 1, name: "Tortu_MVP", ping: 42 },
  { id: 2, name: "CocoRP", ping: 55 },
  { id: 3, name: "PlayaGold", ping: 61 },
  { id: 4, name: "VioletaDusk", ping: 49 }
]

const mockState: FiveMState = {
  serverName: "Inmortal RP",
  players: mockPlayers,
  maxClients: 128,
  online: mockPlayers.length
}

const hasPublicHost = Boolean(process.env.NEXT_PUBLIC_FIVEM_HOST)
const hasPublicPort = Boolean(process.env.NEXT_PUBLIC_FIVEM_PORT)
const hasPublicEndpoint = Boolean(process.env.NEXT_PUBLIC_FIVEM_ENDPOINT_ID)
const hasConnection = hasPublicEndpoint || (hasPublicHost && hasPublicPort)

function useFiveMData() {
  const [state, setState] = useState<FiveMState>(mockState)
  const [loading, setLoading] = useState(hasConnection)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasConnection) {
      setLoading(false)
      return
    }

    let active = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/fivem", { cache: "no-store" })
        if (!res.ok) throw new Error("Error al obtener datos")

        const data = await res.json()
        if (active) {
          setState(data)
          setError(null)
        }
      } catch (err) {
        if (active) {
          setError("No se pudo conectar con el servidor")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return { state, loading, error }
}

function CustomPlayersCounter() {
  const { state, loading } = useFiveMData()

  const percentage = (state.online / state.maxClients) * 100
  const stroke = (percentage / 100) * 251.2

  return (
    <div className="relative rounded-2xl border border-violet-400/20 bg-emerald-900/20 p-6 backdrop-blur-xl shadow-xl text-center">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-emerald-500/10 opacity-30 blur-xl" />

      <p className="text-xs uppercase tracking-[0.3em] text-violet-200">
        {loading ? "Actualizando..." : "En línea"}
      </p>

      <div className="relative w-36 h-36 mx-auto mt-6 flex items-center justify-center">

        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            strokeWidth="8"
            className="stroke-emerald-700"
            fill="transparent"
          />

          <circle
            cx="50%"
            cy="50%"
            r="40"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            className="stroke-[url(#grad)] drop-shadow-[0_0_8px_rgba(128,0,128,0.8)] transition-all duration-500"
            strokeDasharray={`${stroke} 251.2`}
          />

          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#8b5cf6" /> {/* violet-500 */}
              <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-violet-300">
            {state.online}
          </span>
          <span className="text-sm text-emerald-300/60">
            / {state.maxClients}
          </span>
        </div>
      </div>

      <p className="mt-4 text-violet-100/70">
        {state.serverName}
      </p>
    </div>
  )
}

export default function JugadoresPage() {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-tr from-violet-900 to-emerald-900"
    >
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_250px] gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Jugadores activos
            </p>
            <h1 className="mt-3 text-3xl font-semibold bg-gradient-to-r from-violet-400 to-emerald-500 bg-clip-text text-transparent">
              Estado en tiempo real del servidor
            </h1>
            <div className="mt-10">
              <PlayersList />
            </div>
          </div>
          {/* PANEL LATERAL */}
          <div className="flex flex-col items-center lg:items-end">
            <CustomPlayersCounter />

            <div className="mt-4 text-xs text-white/50">
              Actualización automática cada 15s
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}