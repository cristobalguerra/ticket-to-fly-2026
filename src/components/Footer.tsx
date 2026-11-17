import { Link } from 'react-router-dom'
import { ARCHIVED, CURRENT } from '../lib/editions'

const LINK = 'hover:text-udem-yellow focus-visible:text-udem-yellow outline-none'
const LINK_STYLE = { transition: 'color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }

export default function Footer() {
  const logos = import.meta.env.BASE_URL + 'logos-ead.svg'
  return (
    <footer className="bg-black text-white px-5 md:px-8 pt-12 pb-8 overflow-hidden">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="cond text-5xl md:text-6xl">Ticket to Fly</p>
          <p className="code text-[11px] text-udem-yellow mt-3">{CURRENT.label}</p>
          <nav className="code text-[11px] text-white/70 mt-8 flex flex-col gap-2 items-start" aria-label="Pie">
            <Link to="/" className={LINK} style={LINK_STYLE}>Inicio</Link>
            <Link to="/vote" className={LINK} style={LINK_STYLE}>Votar</Link>
            <Link to="/projects" className={LINK} style={LINK_STYLE}>Proyectos</Link>
            {ARCHIVED.map((e) => (
              <Link key={e.key} to={`/archivo/${e.key}`} className={LINK} style={LINK_STYLE}>
                Archivo {e.label}
              </Link>
            ))}
            <Link to="/info" className={LINK} style={LINK_STYLE}>Información</Link>
            <Link to="/upload" className={LINK} style={LINK_STYLE}>Subir proyecto</Link>
          </nav>
        </div>

        <div className="md:col-span-7 grid gap-7 sm:grid-cols-2 text-[13px] leading-[1.55] text-white/75">
          <div className="sm:col-span-2 max-w-[62ch]">
            <h3 className="code text-[11px] text-white/45 mb-2">Acerca de</h3>
            <p>
              Ticket to Fly es la exposición semestral de Proyectos de Evaluación Final de los alumnos egresados de la Escuela de Arte y Diseño de la Universidad de Monterrey. Cada edición presenta el trabajo culminante de los futuros diseñadores, artistas y creadores formados en el Centro Roberto Garza Sada, así como el reconocimiento al mejor proyecto de cada programa académico y al mejor proyecto de toda la Escuela.
            </p>
          </div>
          <div>
            <h3 className="code text-[11px] text-white/45 mb-2">Privacidad de datos</h3>
            <p>
              Esta plataforma recopila únicamente el nombre del profesor votante con fines de validación interna de la votación. Los datos personales no se comparten con terceros y se conservarán únicamente durante el periodo del evento. Las imágenes y contenidos de los proyectos son propiedad intelectual de sus autores y se utilizan exclusivamente para fines académicos y de exposición.
            </p>
          </div>
          <div>
            <h3 className="code text-[11px] text-white/45 mb-2">Uso de la plataforma</h3>
            <p>
              El sistema de votación está reservado a los profesores acreditados de la EAD. Cada profesor puede emitir un único voto por carrera y un voto general por edición. La administración del evento se reserva el derecho de anular votos duplicados o emitidos con identidades no verificables.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <img src={logos} alt="EAD · CRGS · UDEM" className="h-14 sm:h-20 w-auto max-w-full self-start" />
        <p className="code text-[11px] text-white/45">
          © {CURRENT.year} Universidad de Monterrey · Escuela de Arte y Diseño
        </p>
      </div>
    </footer>
  )
}
