import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

export default function Footer() {
  const logos = import.meta.env.BASE_URL + 'logos-ead.svg'
  return (
    <footer className="bg-udem-black text-white py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Logos */}
        <img
          src={logos}
          alt="Escuela de Arte y Diseño, Centro Roberto Garza Sada, Universidad de Monterrey"
          className="w-full max-w-2xl mx-auto h-auto opacity-90 mb-8"
        />

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Event title + meta */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-udem-yellow" />
            <span className="font-black text-sm tracking-widest uppercase">Ticket to Fly</span>
            <span className="text-white/40 text-xs font-light tracking-widest">2026</span>
          </div>
          <p className="text-white/50 text-xs leading-relaxed max-w-md mx-auto">
            Exposición de Proyectos de Evaluación Final de la Escuela de Arte y Diseño · Centro Roberto Garza Sada · UDEM
          </p>
        </div>

        {/* Event details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs mb-8">
          <div>
            <p className="text-white/30 uppercase tracking-wider font-bold mb-0.5">Fecha</p>
            <p className="font-semibold text-white">26 de Mayo</p>
          </div>
          <div>
            <p className="text-white/30 uppercase tracking-wider font-bold mb-0.5">Inauguración</p>
            <p className="font-semibold text-white tabular-nums">5:00 PM</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-white/30 uppercase tracking-wider font-bold mb-0.5">Lugar</p>
            <p className="font-semibold text-white">6to piso · CRGS</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50 mb-6">
          <Link to="/" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Inicio</Link>
          <Link to="/vote" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Votar</Link>
          <Link to="/upload" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Subir Proyecto</Link>
          <Link to="/info" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Información</Link>
        </div>

        <p className="text-center text-white/30 text-[10px] tracking-wider uppercase">
          © 2026 Universidad de Monterrey
        </p>
      </div>
    </footer>
  )
}
