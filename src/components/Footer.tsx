import { Link } from 'react-router-dom'
import { Plane, Shield } from 'lucide-react'

export default function Footer() {
  const logos = import.meta.env.BASE_URL + 'logos-ead.svg'
  return (
    <footer className="bg-udem-black text-white py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Title left, logos right */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-baseline gap-1.5">
            <Plane className="w-3.5 h-3.5 text-udem-yellow translate-y-0.5" />
            <span className="font-black text-xs tracking-widest uppercase">Ticket to Fly</span>
            <span className="text-white/40 text-[10px] font-light tracking-widest">2026</span>
          </div>
          <img
            src={logos}
            alt="EAD · CRGS · UDEM"
            className="h-12 opacity-90"
          />
        </div>

        <div className="h-px bg-white/10 mb-6" />

        {/* About */}
        <div className="mb-5">
          <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1.5">Acerca de</h3>
          <p className="text-white/70 text-xs leading-relaxed">
            Ticket to Fly es la exposición semestral de Proyectos de Evaluación Final de los alumnos egresados de la Escuela de Arte y Diseño de la Universidad de Monterrey. Cada edición presenta el trabajo culminante de los futuros diseñadores, artistas y creadores formados en el Centro Roberto Garza Sada, así como el reconocimiento al mejor proyecto de cada programa académico y al mejor proyecto de toda la Escuela.
          </p>
        </div>

        {/* Privacy */}
        <div className="mb-5">
          <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Privacidad de Datos
          </h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Esta plataforma recopila únicamente el nombre del profesor votante con fines de validación interna de la votación. Los datos personales no se comparten con terceros y se conservarán únicamente durante el periodo del evento. Las imágenes y contenidos de los proyectos son propiedad intelectual de sus autores y se utilizan exclusivamente para fines académicos y de exposición.
          </p>
        </div>

        {/* Use of platform */}
        <div className="mb-6">
          <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1.5">Uso de la Plataforma</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            El sistema de votación está reservado a los profesores acreditados de la EAD. Cada profesor puede emitir un único voto por carrera y un voto general por edición. La administración del evento se reserva el derecho de anular votos duplicados o emitidos con identidades no verificables.
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-white/50 mb-4">
          <Link to="/" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Inicio</Link>
          <Link to="/vote" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Votar</Link>
          <Link to="/upload" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Subir Proyecto</Link>
          <Link to="/info" className="hover:text-white" style={{ transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>Información</Link>
        </div>

        <p className="text-center text-white/30 text-[10px] tracking-wider uppercase">
          © 2026 Universidad de Monterrey · Escuela de Arte y Diseño
        </p>
      </div>
    </footer>
  )
}
