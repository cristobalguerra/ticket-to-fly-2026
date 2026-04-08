import { Link } from 'react-router-dom'
import { Vote, Upload, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="home-bg min-h-dvh flex flex-col items-center justify-center p-6 text-center relative">
      {/* UDEM badge */}
      <div className="absolute top-6 right-6 bg-udem-black text-white font-black text-lg px-4 py-2 tracking-wider z-10">
        UDEM
      </div>

      {/* Edition badge */}
      <div className="absolute top-6 left-6 border-2 border-udem-black text-udem-black font-black text-sm px-3 py-1 z-10">
        PR 2026
      </div>

      <div className="mb-10 relative z-10">
        <h1 className="text-outline text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tight uppercase">
          Ticket
          <br />
          to Fly
        </h1>
        <p className="text-udem-black/80 text-sm md:text-base mt-6 max-w-xs mx-auto font-medium leading-relaxed">
          Exposicion de Proyectos de Evaluacion Final
          <br />
          de la Escuela de Arte y Diseno
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
        <Link
          to="/vote"
          className="flex items-center justify-center gap-3 bg-udem-black text-white font-bold text-lg py-4 rounded-2xl hover:bg-udem-black/90 transition-all active:scale-[0.98] shadow-xl shadow-black/20"
        >
          <Vote className="w-6 h-6" />
          Votar
        </Link>

        <Link
          to="/upload"
          className="flex items-center justify-center gap-3 bg-white/40 backdrop-blur-sm text-udem-black font-bold py-3 rounded-2xl border-2 border-udem-black/20 hover:bg-white/60 transition-all active:scale-[0.98]"
        >
          <Upload className="w-5 h-5" />
          Subir Proyecto
        </Link>

        <Link
          to="/admin"
          className="flex items-center justify-center gap-3 text-udem-black/50 font-medium py-3 rounded-2xl hover:text-udem-black/80 transition-all text-sm"
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      </div>

      {/* Event info */}
      <div className="absolute bottom-6 left-6 text-left text-udem-black/60 text-xs leading-relaxed z-10 hidden md:block">
        <p className="font-bold text-udem-black/80">Fecha/ 26 de Mayo</p>
        <p>Hora/ 19:00 h</p>
        <p>Lugar/ Sexto piso, Centro</p>
        <p>Roberto Garza Sada</p>
      </div>
    </div>
  )
}
