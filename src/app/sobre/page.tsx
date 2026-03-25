import React from "react"

const extras = [
  {
    title: "Reglas claras",
    description:
      "Normativas enfocadas en un rol serio y de calidad, con sistemas de sanción transparentes.",
    icon: "📜"
  },
  {
    title: "Staff activo",
    description:
      "Un equipo comprometido que guía, modera y garantiza una experiencia justa.",
    icon: "🛡️"
  },
  {
    title: "Eventos únicos",
    description:
      "Eventos dinámicos, historias vivas y contenido constante dentro del servidor.",
    icon: "🎉"
  }
]

export default function SobrePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-violet-900 to-emerald-900 text-white overflow-hidden">

      {/* 🔥 Fondo pro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(128,0,128,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,128,0,0.1),transparent_60%)]" />

      <section className="relative mx-auto max-w-6xl px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">

          {/* TEXTO PRINCIPAL */}
          <div className="relative rounded-3xl border border-violet-400/20 bg-emerald-900/20 p-10 backdrop-blur-xl shadow-xl">

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-xl opacity-40" />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.4em] text-violet-300">
                Inmortal RP
              </p>

              <h1 className="mt-4 text-4xl font-bold bg-gradient-to-r from-violet-400 to-emerald-500 bg-clip-text text-transparent">
                Una historia creada por jugadores
              </h1>

              <p className="mt-6 text-emerald-100/70 leading-relaxed">
                Inmortal RP no es solo un servidor, es un mundo donde cada decisión
                tiene consecuencias. Nació como un proyecto enfocado en el rol serio
                y ha evolucionado gracias a su comunidad.
              </p>

              <p className="mt-4 text-emerald-100/60 leading-relaxed">
                Aquí, cada historia importa. Desde el primer contacto hasta las
                grandes alianzas, buscamos ofrecer una experiencia inmersiva,
                equilibrada y en constante evolución.
              </p>
            </div>
          </div>

          {/* CARDS */}
          <div className="space-y-6">
            {extras.map((extra, index) => (
              <div
                key={extra.title}
                className="group relative rounded-2xl border border-violet-400/10 bg-emerald-900/20 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-violet-500/40"
              >
                {/* Glow hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-xl" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="text-3xl">{extra.icon}</div>

                  <div>
                    <p className="text-lg font-semibold">{extra.title}</p>
                    <p className="mt-2 text-sm text-emerald-100/60 leading-relaxed">
                      {extra.description}
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-violet-100/30">
                    0{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}