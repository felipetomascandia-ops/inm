"use client"

const discordInvite =
  process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/QRk8MMXvBD"
const discordWidgetId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_ID || ""

export default function DiscordPage() {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-tr from-violet-900 to-emerald-900"
    >
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-violet-400/20 bg-emerald-900/20 p-8 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300">
              Discord
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              La base social de Inmortal RP
            </h1>
            <p className="mt-4 text-emerald-100/70">
              Comunicados oficiales, soporte y eventos en vivo. Únete a la
              comunidad para enterarte de todo y conectar con otros jugadores.
            </p>
            <a
              href={discordInvite}
              className="mt-6 inline-flex rounded-3xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.05] hover:bg-amber-700 shadow-lg"
            >
              Unirme a Discord
            </a>
          </div>

          <div className="rounded-3xl border border-violet-400/20 bg-emerald-900/20 p-6 shadow-lg backdrop-blur">
            {discordWidgetId ? (
              <iframe
                title="Discord Inmortal RP"
                src={`https://discord.com/widget?id=${discordWidgetId}&theme=dark`}
                width="100%"
                height="400"
                className="rounded-2xl border border-white/10"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-400/20 bg-emerald-900/30 text-center text-sm text-violet-100/60">
                <p>Agrega el ID del widget de Discord para mostrar el panel.</p>
                <p>Configura NEXT_PUBLIC_DISCORD_WIDGET_ID</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}