import { Link } from 'react-router-dom'
import { Vote, Upload, Settings, Info } from 'lucide-react'
import FlyingPlane from '../components/FlyingPlane'

export default function Home() {
  return (
    <div className="home-bg min-h-dvh flex flex-col items-center justify-center p-6 text-center relative">
      <FlyingPlane />

      {/* UDEM badge */}
      <div className="stagger-in absolute top-6 right-6 bg-udem-yellow text-udem-black font-black text-lg px-4 py-2 tracking-wider z-10" data-i="0">
        UDEM
      </div>

      {/* Edition badge */}
      <div className="stagger-in absolute top-6 left-6 border-2 border-udem-black text-udem-black font-black text-sm px-3 py-1 z-10" data-i="0">
        PR 2026
      </div>

      <div className="mb-10 relative z-10">
        <h1 className="stagger-in text-outline text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tight uppercase" data-i="1">
          Ticket
          <br />
          to Fly
        </h1>
        <p className="stagger-in text-udem-black/80 text-sm md:text-base mt-6 max-w-xs mx-auto font-medium leading-relaxed" data-i="2">
          Exposición de Proyectos de Evaluación Final
          <br />
          de la Escuela de Arte y Diseño
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
        <Link
          to="/vote"
          className="stagger-in flex items-center justify-center gap-3 bg-udem-black text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-black/20 hover:bg-udem-black/90"
          style={{ transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          data-i="3"
        >
          <Vote className="w-6 h-6" />
          Votar
        </Link>

        <Link
          to="/upload"
          className="stagger-in flex items-center justify-center gap-3 bg-white/40 backdrop-blur-sm text-udem-black font-bold py-3 rounded-2xl border-2 border-udem-black/20 hover:bg-white/60"
          style={{ transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          data-i="4"
        >
          <Upload className="w-5 h-5" />
          Subir Proyecto
        </Link>

        <Link
          to="/info"
          className="stagger-in flex items-center justify-center gap-3 bg-white/40 backdrop-blur-sm text-udem-black font-bold py-3 rounded-2xl border-2 border-udem-black/20 hover:bg-white/60"
          style={{ transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          data-i="4"
        >
          <Info className="w-5 h-5" />
          Información del Evento
        </Link>

        <Link
          to="/admin"
          className="stagger-in flex items-center justify-center gap-3 text-udem-black/50 font-medium py-3 rounded-2xl hover:text-udem-black/80 text-sm"
          style={{ transition: 'color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          data-i="5"
        >
          <Settings className="w-4 h-4" />
          Admin
        </Link>
      </div>

      {/* Event info */}
      <div className="stagger-in absolute bottom-6 left-6 text-left text-udem-black/60 text-xs leading-relaxed z-10 hidden md:block" data-i="6">
        <p className="font-bold text-udem-black/80">Fecha/ 26 de Mayo</p>
        <p>Hora/ 19:00 h</p>
        <p>Lugar/ Sexto piso, Centro</p>
        <p>Roberto Garza Sada</p>
      </div>
    </div>
  )
}
