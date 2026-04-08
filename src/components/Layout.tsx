import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

interface Props {
  children: React.ReactNode
  showBack?: boolean
}

export default function Layout({ children, showBack }: Props) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-udem-black text-white px-4 py-3 flex items-center gap-3">
        {showBack && (
          <Link to="/" className="text-udem-yellow font-bold text-sm hover:underline">
            &larr; Inicio
          </Link>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Plane className="w-5 h-5 text-udem-yellow" />
          <span className="font-bold text-sm tracking-wide">TICKET TO FLY 2026</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
