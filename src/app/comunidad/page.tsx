"use client"

import { useState, useEffect } from "react"

const host = process.env.NEXT_PUBLIC_FIVEM_HOST || ""
const port = process.env.NEXT_PUBLIC_FIVEM_PORT || ""

const joinUrl =
  host && port
    ? `fivem://connect/${host}:${port}`
    : process.env.NEXT_PUBLIC_FIVEM_JOIN_URL || "https://cfx.re/join/"

const discordInvite =
  process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/"

type ContentBlock = {
  type: "paragraph" | "list" | "image" | "text-image";
  text?: string;
  listItems?: string[];
  imageUrl?: string;
  imagePosition?: "top" | "bottom" | "right";
};

type Section = {
  title: string;
  icon: string;
  isShop?: boolean;
  blocks: ContentBlock[];
};

export default function ComunidadPage() {
  const [active, setActive] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("/api/comunidad");
        if (!res.ok) {
          throw new Error("Failed to fetch sections");
        }
        const data: Section[] = await res.json();
        setSections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-900 to-emerald-900 text-white">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-900 to-emerald-900 text-white">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-violet-900 to-emerald-900 text-white overflow-hidden">

      {/* Fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(128,0,128,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,128,0,0.1),transparent_60%)]" />

      <section className="relative mx-auto max-w-6xl px-6 py-20">

        <h1 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
          Comunidad Inmortal RP
        </h1>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((item, index) => (
            <div
              key={item.title}
              onClick={() => setActive(index)}
              className="cursor-pointer group relative rounded-2xl border border-violet-400/10 bg-emerald-900/20 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-violet-500/40"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-xl" />

              <div className="relative z-10 flex flex-col h-full">

                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs text-violet-100/30">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-emerald-100/60">
                  Haz clic para ver más información
                </p>

                <div className="mt-4 text-xs text-violet-400">
                  Ver más →
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {active !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">

            <div className="relative w-full max-w-lg rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-900 to-emerald-900 p-8 shadow-xl flex flex-col max-h-[80vh] overflow-y-auto">

              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-xl opacity-40" />

              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                ✖
              </button>

              <div className="relative z-10 flex flex-col flex-grow">

                <div className="text-4xl">
                  {sections[active].icon}
                </div>

                <h2 className="mt-4 text-2xl font-bold mb-4">
                  {sections[active].title}
                </h2>
                <div>
                  {sections[active].blocks.map((block, blockIndex) => (
                    <div key={blockIndex} className="mb-4">
                      {block.type === "paragraph" && block.text && (
                        <p className="mt-4 text-emerald-100/70 leading-relaxed">
                          {block.text}
                        </p>
                      )}
                      {block.type === "list" && block.listItems && (
                        <ul className="mt-4 text-emerald-100/70 leading-relaxed list-decimal list-inside">
                          {block.listItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {block.type === "image" && block.imageUrl && (
                        <div className="mt-4 flex justify-center">
                          <img src={block.imageUrl} alt={`Imagen ${blockIndex}`} className="max-w-full h-auto rounded-lg shadow-lg" />
                        </div>
                      )}
                      {block.type === "text-image" && (
                        <div className={`mt-4 flex flex-col ${block.imagePosition === "right" ? "md:flex-row items-center" : ""}`}>
                          {block.imagePosition === "top" && block.imageUrl && (
                            <img src={block.imageUrl} alt={`Imagen ${blockIndex}`} className="max-w-full h-auto rounded-lg shadow-lg mb-4" />
                          )}
                          {block.text && (
                            <p className={`text-emerald-100/70 leading-relaxed ${block.imagePosition === "right" ? "md:mr-4" : ""}`}>
                              {block.text}
                            </p>
                          )}
                          {(block.imagePosition === "bottom" || block.imagePosition === "right") && block.imageUrl && (
                            <img src={block.imageUrl} alt={`Imagen ${blockIndex}`} className="max-w-full h-auto rounded-lg shadow-lg mt-4 md:mt-0" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* BOTÓN */}
                {sections[active].isShop ? (
                  <a
                    href={discordInvite}
                    target="_blank"
                    className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 px-6 py-3 font-semibold hover:scale-105 transition"
                  >
                    🛒 Abrir ticket en Discord
                  </a>
                ) : (
                  <a
                    href={discordInvite}
                    target="_blank"
                    className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 px-6 py-3 font-semibold hover:scale-105 transition"
                  >
                    💬 Ir a Discord
                  </a>
                )}

              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}