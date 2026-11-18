import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FlyingPlane from '../components/FlyingPlane'
import Footer from '../components/Footer'
import { ARCHIVED, CURRENT } from '../lib/editions'
import { onVotingStatusChange } from '../lib/settings'

function Arrow() {
  // Grosor igual al asta de las mayúsculas; altura igual a la altura de caja alta.
  return (
    <svg className="board-arrow" viewBox="0 0 60 68.8" fill="none" stroke="currentColor" strokeWidth="15" aria-hidden>
      <path d="M0 34.4H48M24 9.4l25 25-25 25" />
    </svg>
  )
}

export default function Home() {
  const [votingStatus, setVotingStatus] = useState<string[]>([])

  useEffect(
    () =>
      onVotingStatusChange((open) => {
        const opensAt = CURRENT.event.votingOpensAt
        const scheduled = opensAt !== null && Date.now() < opensAt.getTime()
        setVotingStatus(open && !scheduled ? ['Abierta'] : (CURRENT.event.votingSoon ?? ['Cerrada']))
      }),
    [],
  )

  const { event } = CURRENT

  return (
    <>
      <div className="board min-h-dvh flex flex-col px-5 md:px-8 pt-5 md:pt-7 pb-6">
        <img
          src={import.meta.env.BASE_URL + 'udem-logo.svg'}
          alt="UDEM"
          width={526}
          height={264}
          className="absolute top-0 right-0 z-10 h-12 md:h-16 w-auto"
        />

        <header className="stagger-in relative z-10 pr-24 md:pr-36" data-i="0">
          <p className="code text-xs md:text-[15px] leading-[1.5] text-white/70">
            Escuela de Arte y Diseño
            <br />
            Proyectos de Evaluación Final
          </p>
        </header>

        <h1 className="stagger-in cond board-title relative z-10 mt-8 md:mt-5 -ml-[0.015em] whitespace-nowrap" data-i="1">
          Ticket <br className="md:hidden" />
          <span className="flight-anchor">
            to
            <FlyingPlane />
          </span>{' '}
          Fly
        </h1>

        <div className="flight-gap">
          {event.headline && (
            <p className="stagger-in board-date" data-i="2" aria-label={event.headline.spoken}>
              <span aria-hidden>{event.headline.date}</span>
              <span aria-hidden>{event.headline.time}</span>
            </p>
          )}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-10 md:gap-16">
          <nav className="md:flex-1 md:max-w-[62%]" aria-label="Principal">
            <Link to="/vote" className="stagger-in cond board-row" data-primary data-i="2">
              <Arrow />
              Votar
              {votingStatus.length > 0 && (
                <span className="code board-status">
                  {votingStatus.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </span>
              )}
            </Link>
            <Link to="/projects" className="stagger-in cond board-row" data-i="3">
              <Arrow />
              Proyectos
              <span className="code board-status">{CURRENT.key}</span>
            </Link>
            {ARCHIVED.map((e) => (
              <Link key={e.key} to={`/archivo/${e.key}`} className="stagger-in cond board-row" data-i="4">
                <Arrow />
                Archivo
                <span className="code board-status">{e.key}</span>
              </Link>
            ))}
            <Link to="/info" className="stagger-in cond board-row" data-i="5">
              <Arrow />
              Información
            </Link>
            <Link to="/upload" className="stagger-in cond board-row" data-i="6">
              <Arrow />
              Subir proyecto
            </Link>
          </nav>

          <div className="stagger-in code text-[13px] md:text-[15px] leading-[1.7] text-white/70 md:text-right md:ml-auto" data-i="7">
            <p className="text-udem-yellow">{CURRENT.label}</p>
            {/* Si la fecha ya va en grande bajo el título, no se repite aquí. */}
            {event.day && !event.headline && <p>{event.day}</p>}
            {event.day && !event.headline && <p>Inicio {event.inauguracion}</p>}
            <p>Sexto piso, Centro Roberto Garza Sada</p>
            <p className="mt-4">
              <Link to="/admin" className="text-white/60 hover:text-white focus-visible:text-white outline-none">
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
