"use client"

import { useEffect, useMemo, useState } from "react"

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
      setError(null)
      return
    }

    let active = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/fivem", { cache: "no-store" })
        if (!response.ok) {
          throw new Error("No se pudo obtener el estado del servidor.")
        }
        const data = (await response.json()) as FiveMState
        if (active) {
          setState(data)
          setError(null)
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al conectar con FiveM."
          )
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

  return { state, loading, error, hasConnection }
}

export function PlayersCounter() {
  const { state, loading, error, hasConnection } = useFiveMData()
  const label = useMemo(() => {
    if (!hasConnection) return "Modo demo activo"
    if (loading) return "Actualizando..."
    if (error) return "Sin conexión en este momento"
    return "En línea ahora mismo"
  }, [hasConnection, loading, error])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-4xl font-semibold text-gold-300">
          {state.online}
        </span>
        <span className="text-sm text-white/60">
          / {state.maxClients} jugadores
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">{state.serverName}</p>
      {error && (
        <p className="mt-2 text-xs text-orange-200/80">{error}</p>
      )}
    </div>
  )
}

export function PlayersList() {
  const { state, loading, error } = useFiveMData()
  const players = state.players

  return (
    <div className="rounded-3xl border border-violet-400/20 bg-emerald-900/20 p-6 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Jugadores activos
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {state.online} conectados
          </h3>
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-700/10 px-4 py-2 text-xs text-emerald-300">
          Actualización cada 15s
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {loading && players.length === 0 ? (
          <div className="rounded-2xl border border-violet-400/10 bg-emerald-900/30 px-5 py-4 text-sm text-white/70">
            Cargando jugadores...
          </div>
        ) : null}
        {players.map((player) => (
          <div
            key={`${player.id}-${player.name}`}
            className="flex items-center justify-between rounded-xl border border-violet-400/5 bg-emerald-900/60 px-5 py-3 text-sm transition hover:scale-[1.01] hover:border-violet-400/10"
          >
            <div>
              <p className="font-medium text-violet-200">{player.name}</p>
              <p className="text-xs text-emerald-300/50">
                ID {player.id.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="text-xs text-violet-400">
              {player.ping ? `${player.ping} ms` : "Ping N/D"}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-xs text-orange-200/80">{error}</p>
      )}
    </div>
  )
}
