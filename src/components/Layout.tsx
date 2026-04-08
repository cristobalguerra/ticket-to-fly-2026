import { Link } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  showBack?: boolean
}

export default function Layout({ children, showBack }: Props) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-udem-black text-white px-4 py-3 flex items-center gap-3">
        {showBack && (
          <Link to="/" className="text-white/70 font-bold text-sm hover:text-white transition-colors">
            &larr; Inicio
          </Link>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="font-black text-sm tracking-wider uppercase">Ticket to Fly</span>
          <span className="text-white/40 text-xs font-light tracking-widest">2026</span>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-[#f0fdf4] to-[#ecfeff]">{children}</main>
    </div>
  )
}
