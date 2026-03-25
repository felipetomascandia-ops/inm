export function SiteFooter() {
  return (
    <footer className="border-t-2 border-violet-500 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-emerald-200">
        <p>© {new Date().getFullYear()} Inmortal RP. Todos los derechos.</p>
      </div>
    </footer>
  )
}
