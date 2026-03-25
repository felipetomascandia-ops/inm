import { NextResponse } from "next/server"

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

const demoPlayers: FiveMPlayer[] = [
  { id: 1, name: "InmortalCrew", ping: 42 },
  { id: 2, name: "RoleplayMx", ping: 55 },
  { id: 3, name: "VidaNocturna", ping: 61 }
]

const demoState: FiveMState = {
  serverName: "Inmortal RP",
  players: demoPlayers,
  maxClients: 128,
  online: demoPlayers.length
}

function normalizeEndpointData(data: any): FiveMState | null {
  const payload = data?.Data
  if (!payload) return null
  const players: FiveMPlayer[] = Array.isArray(payload.players)
    ? payload.players.map((player: any, index: number) => ({
        id: player.id ?? index,
        name: player.name ?? "Desconocido",
        identifiers: player.identifiers,
        ping: player.ping
      }))
    : []
  return {
    serverName: payload.hostname ?? "Inmortal RP",
    players,
    maxClients: payload.sv_maxclients ?? 128,
    online: payload.clients ?? players.length
  }
}

async function fetchFromEndpoint(endpoint: string) {
  const resolved = endpoint.startsWith("http")
    ? endpoint
    : `https://servers-frontend.fivem.net/api/servers/single/${endpoint}`
  const response = await fetch(resolved, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("No se pudo obtener el estado del servidor.")
  }
  const data = await response.json()
  const normalized = normalizeEndpointData(data)
  if (!normalized) {
    throw new Error("Datos inválidos desde FiveM.")
  }
  return normalized
}

async function fetchFromHost(host: string, port: string) {
  const base = `http://${host}:${port}`
  const [infoResponse, playersResponse] = await Promise.all([
    fetch(`${base}/info.json`, { cache: "no-store" }),
    fetch(`${base}/players.json`, { cache: "no-store" })
  ])
  if (!infoResponse.ok || !playersResponse.ok) {
    throw new Error("No se pudo conectar con el servidor FiveM.")
  }
  const info = await infoResponse.json()
  const playersData = await playersResponse.json()
  const players: FiveMPlayer[] = Array.isArray(playersData)
    ? playersData.map((player: any, index: number) => ({
        id: player.id ?? index,
        name: player.name ?? "Desconocido",
        identifiers: player.identifiers,
        ping: player.ping
      }))
    : []
  return {
    serverName: info?.vars?.sv_projectName ?? info?.vars?.sv_hostname ?? "Inmortal RP",
    players,
    maxClients: info?.vars?.sv_maxClients ?? info?.vars?.sv_maxclients ?? 128,
    online: players.length
  }
}

export async function GET() {
  try {
    const endpoint = process.env.FIVEM_ENDPOINT_ID || ""
    const host = process.env.FIVEM_HOST || process.env.NEXT_PUBLIC_FIVEM_HOST || ""
    const port = process.env.FIVEM_PORT || process.env.NEXT_PUBLIC_FIVEM_PORT || ""

    if (host && port) {
      const data = await fetchFromHost(host, port)
      return NextResponse.json(data)
    }

    if (endpoint) {
      const data = await fetchFromEndpoint(endpoint)
      return NextResponse.json(data)
    }

    return NextResponse.json(demoState)
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error inesperado." },
      { status: 500 }
    )
  }
}
