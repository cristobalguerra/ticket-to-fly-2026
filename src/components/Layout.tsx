import { Link } from 'react-router-dom'
import Footer from './Footer'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  showFooter?: boolean
}

export default function Layout({ children, showBack, showFooter = true }: Props) {
  const logos = import.meta.env.BASE_URL + 'logos-ead.svg'
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-udem-black text-white px-4 py-2 flex items-center gap-3 sticky top-0 z-30">
        {showBack && (
          <Link
            to="/"
            className="text-white/70 font-bold text-xs hover:text-white"
            style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            &larr; Inicio
          </Link>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-[7px] tracking-widest uppercase text-white/60">Ticket to Fly</span>
          <span className="text-white/40 text-[7px] font-light tracking-widest">2026</span>
        </div>
        <img
          src={logos}
          alt="EAD · CRGS · UDEM"
          className="h-24 opacity-90 ml-auto"
        />
      </header>
      <main className="flex-1 bg-gradient-to-b from-[#f0fdf4] to-[#ecfeff] page-enter">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
