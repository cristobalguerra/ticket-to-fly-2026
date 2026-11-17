import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FlyingPlane from '../components/FlyingPlane'
import Footer from '../components/Footer'
import { ARCHIVED, CURRENT } from '../lib/editions'
import { onVotingStatusChange } from '../lib/settings'

export default function Home() {
  const [votingStatus, setVotingStatus] = useState('')

  useEffect(
    () =>
      onVotingStatusChange((open) => {
        const opensAt = CURRENT.event.votingOpensAt
        const scheduled = opensAt !== null && Date.now() < opensAt.getTime()
        setVotingStatus(open && !scheduled ? 'Abierta' : 'Cerrada')
      }),
    [],
  )

  const { event } = CURRENT

  return (
    <>
      <div className="board min-h-dvh flex flex-col px-5 md:px-8 pt-5 md:pt-7 pb-6">
        <FlyingPlane />

        <img
          src={import.meta.env.BASE_URL + 'udem-logo.svg'}
          alt="UDEM"
          width={526}
          height={264}
          className="absolute top-0 right-0 z-10 h-12 md:h-16 w-auto"
        />

        <header className="stagger-in relative z-10 pr-28 md:pr-36" data-i="0">
          <p className="code text-[11px] leading-[1.5] text-white/70">
            Escuela de Arte y Diseño
            <br />
            Proyectos de Evaluación Final
          </p>
        </header>

        <h1 className="stagger-in cond board-title relative z-10 mt-8 md:mt-5 -ml-[0.03em] whitespace-nowrap" data-i="1">
          Ticket <br className="md:hidden" />
          to Fly
        </h1>

        <div className="relative z-10 flex-1 flex flex-col md:flex-row md:items-end gap-10 md:gap-16 mt-8 md:mt-6">
          <nav className="md:flex-1 md:max-w-[62%]" aria-label="Principal">
            <Link to="/vote" className="stagger-in cond board-row" data-primary data-i="2">
              <span className="board-arrow" aria-hidden>→</span>
              Votar
              {votingStatus && <span className="code board-status">{votingStatus}</span>}
            </Link>
            <Link to="/projects" className="stagger-in cond board-row" data-i="3">
              <span className="board-arrow" aria-hidden>→</span>
              Proyectos
              <span className="code board-status">{CURRENT.key}</span>
            </Link>
            {ARCHIVED.map((e) => (
              <Link key={e.key} to={`/archivo/${e.key}`} className="stagger-in cond board-row" data-i="4">
                <span className="board-arrow" aria-hidden>→</span>
                Archivo
                <span className="code board-status">{e.key}</span>
              </Link>
            ))}
            <Link to="/info" className="stagger-in cond board-row" data-i="5">
              <span className="board-arrow" aria-hidden>→</span>
              Información
            </Link>
            <Link to="/upload" className="stagger-in cond board-row" data-i="6">
              <span className="board-arrow" aria-hidden>→</span>
              Subir proyecto
            </Link>
          </nav>

          <div className="stagger-in code text-[11px] leading-[1.7] text-white/70 md:text-right md:ml-auto" data-i="7">
            <p className="text-udem-yellow">{CURRENT.label}</p>
            {event.day && <p>{event.day}</p>}
            {event.day && <p>Inauguración {event.inauguracion}</p>}
            <p>Sexto piso, Centro Roberto Garza Sada</p>
            <p className="mt-4">
              <Link to="/admin" className="text-white/40 hover:text-white focus-visible:text-white outline-none">
                Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
