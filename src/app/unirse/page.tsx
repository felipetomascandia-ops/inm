const host = process.env.NEXT_PUBLIC_FIVEM_HOST || ""
const port = process.env.NEXT_PUBLIC_FIVEM_PORT || ""

const joinUrl =
  host && port
    ? `fivem://connect/${host}:${port}`
    : process.env.NEXT_PUBLIC_FIVEM_JOIN_URL || "https://cfx.re/join/"

const steps = [
  {
    title: "Descarga FiveM",
    description:
      "Instala FiveM desde su web oficial y asegúrate de tener GTA V actualizado.",
    icon: "⬇️"
  },
  {
    title: "Configura tu perfil",
    description:
      "Inicia sesión, ajusta tu nombre y revisa las normas de Inmortal RP.",
    icon: "⚙️"
  },
  {
    title: "Conéctate al servidor",
    description:
      "Haz clic en el botón o busca Inmortal RP dentro de FiveM.",
    icon: "🎮"
  }
]

export default function UnirsePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-tr from-purple-900 to-emerald-900 text-white">

      {/* 🔥 Fondo con efecto glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(128,0,128,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,128,0,0.1),transparent_60%)]" />

      <section className="relative mx-auto w-full max-w-6xl px-6 py-20">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-purple-500/70">
            Inmortal RP
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-emerald-500 bg-clip-text text-transparent">
            Únete en 3 simples pasos
          </h1>

          <p className="mt-4 text-emerald-100/60 max-w-xl mx-auto">
            Empieza tu historia dentro del mejor servidor de roleplay. Rápido, fácil y sin complicaciones.
          </p>
        </div>

        {/* STEPS */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-purple-400/10 bg-emerald-900/20 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-purple-500/40"
            >
              {/* Glow hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-purple-500/10 to-emerald-500/10" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-sm text-purple-100/40">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-emerald-100/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-6">

          <a
            href={joinUrl}
            className="relative inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105"
          >
            {/* Glow botón */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-emerald-600 blur-lg opacity-70"></span>

            {/* Botón real */}
            <span className="relative rounded-full bg-gradient-to-r from-purple-500 to-emerald-600 px-8 py-4">
              🚀 Conectarme a Inmortal RP
            </span>
          </a>

          <p className="text-sm text-emerald-100/50">
            ¿Problemas para entrar? Únete a nuestro Discord y te ayudamos.
          </p>

        </div>

      </section>
    </div>
  )
}