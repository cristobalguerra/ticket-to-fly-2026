import { Link } from 'react-router-dom'
import Footer from './Footer'
import { CURRENT } from '../lib/editions'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  showFooter?: boolean
}

export default function Layout({ children, showBack, showFooter = true }: Props) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-board text-white px-4 md:px-8 h-12 flex items-center gap-3 sticky top-0 z-30">
        {showBack && (
          <Link
            to="/"
            className="code text-[11px] text-white/70 hover:text-udem-yellow focus-visible:text-udem-yellow outline-none"
            style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            ← Inicio
          </Link>
        )}
        <p className="code text-[11px] text-white/70 ml-auto">
          Ticket to Fly <span className="text-udem-yellow">{CURRENT.key}</span>
        </p>
      </header>
      <main className="flex-1 bg-paper page-enter">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
