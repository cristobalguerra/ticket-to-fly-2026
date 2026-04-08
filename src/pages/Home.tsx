import { Link } from 'react-router-dom'
import { Vote, Upload, Settings, Plane } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-dvh bg-udem-black flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-udem-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
          <Plane className="w-10 h-10 text-udem-black" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Ticket to Fly
        </h1>
        <p className="text-udem-yellow font-bold text-lg mt-2 tracking-widest uppercase">
          2026
        </p>
        <p className="text-gray-400 mt-3 text-sm max-w-xs mx-auto">
          Escuela de Arte y Diseño &mdash; UDEM
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/vote"
          className="flex items-center justify-center gap-3 bg-udem-yellow text-udem-black font-bold text-lg py-4 rounded-2xl hover:brightness-95 transition-all active:scale-[0.98] shadow-lg shadow-yellow-500/20"
        >
          <Vote className="w-6 h-6" />
          Votar
        </Link>

        <Link
          to="/upload"
          className="flex items-center justify-center gap-3 bg-white/10 text-white font-semibold py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all active:scale-[0.98]"
        >
          <Upload className="w-5 h-5" />
          Subir Proyecto
        </Link>

        <Link
          to="/admin"
          className="flex items-center justify-center gap-3 text-gray-500 font-medium py-3 rounded-2xl hover:text-gray-300 transition-all text-sm"
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      </div>
    </div>
  )
}
