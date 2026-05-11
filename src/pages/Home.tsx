import { Link } from 'react-router-dom'
import { Vote, Upload, Settings, Info, LayoutGrid, ArrowRight } from 'lucide-react'
import FlyingPlane from '../components/FlyingPlane'
import Footer from '../components/Footer'

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export default function Home() {
  return (
    <>
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

        <div className="mb-12 relative z-10">
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

        {/* CTAs — pyramid hierarchy */}
        <div className="w-full max-w-sm relative z-10">
          {/* PRIMARY: Votar */}
          <Link
            to="/vote"
            data-i="3"
            className="stagger-in group block relative overflow-hidden bg-udem-black text-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-udem-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{ transition: `transform 200ms ${EASE}, box-shadow 240ms ${EASE}` }}
          >
            {/* Yellow accent bar at top */}
            <span
              className="absolute top-0 left-0 h-1 bg-udem-yellow"
              style={{ width: '24%', transition: `width 320ms ${EASE}` }}
              aria-hidden
            />
            <span
              className="absolute top-0 left-0 h-1 bg-udem-yellow opacity-0 group-hover:opacity-100"
              style={{ width: '100%', transition: `opacity 280ms ${EASE}` }}
              aria-hidden
            />

            <div className="flex items-center justify-between gap-3 px-6 py-5">
              <div className="flex items-center gap-3">
                <Vote className="w-5 h-5 text-udem-yellow" strokeWidth={2.5} />
                <span className="font-black text-xl tracking-tight">Votar</span>
              </div>
              <ArrowRight
                className="w-5 h-5 text-white/60 group-hover:text-udem-yellow group-hover:translate-x-1"
                style={{ transition: `transform 220ms ${EASE}, color 200ms ${EASE}` }}
              />
            </div>
          </Link>

          {/* SECONDARY: pair (Ver Proyectos + Información) */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/projects"
              data-i="4"
              className="stagger-in group relative border-2 border-udem-black text-udem-black rounded-[14px] py-3 px-4 font-bold text-sm overflow-hidden focus-visible:ring-2 focus-visible:ring-udem-black focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ transition: `transform 160ms ${EASE}` }}
            >
              <span
                className="absolute inset-0 bg-udem-black"
                style={{ clipPath: 'inset(100% 0 0 0)', transition: `clip-path 280ms ${EASE}` }}
                aria-hidden
              />
              <style>{`
                a.group:hover > span[aria-hidden] { clip-path: inset(0 0 0 0); }
              `}</style>
              <span className="relative flex items-center justify-center gap-2 group-hover:text-white" style={{ transition: `color 240ms ${EASE} 80ms` }}>
                <LayoutGrid className="w-4 h-4" strokeWidth={2.25} />
                Proyectos
              </span>
            </Link>

            <Link
              to="/info"
              data-i="4"
              className="stagger-in group relative border-2 border-udem-black text-udem-black rounded-[14px] py-3 px-4 font-bold text-sm overflow-hidden focus-visible:ring-2 focus-visible:ring-udem-black focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ transition: `transform 160ms ${EASE}` }}
            >
              <span
                className="absolute inset-0 bg-udem-black"
                style={{ clipPath: 'inset(100% 0 0 0)', transition: `clip-path 280ms ${EASE}` }}
                aria-hidden
              />
              <span className="relative flex items-center justify-center gap-2 group-hover:text-white" style={{ transition: `color 240ms ${EASE} 80ms` }}>
                <Info className="w-4 h-4" strokeWidth={2.25} />
                Información
              </span>
            </Link>
          </div>

          {/* TERTIARY: Subir Proyecto — inline link with underline accent */}
          <Link
            to="/upload"
            data-i="5"
            className="stagger-in mt-5 inline-flex items-center gap-2 text-udem-black/70 hover:text-udem-black text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-udem-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
            style={{ transition: `color 180ms ${EASE}` }}
          >
            <Upload className="w-4 h-4" strokeWidth={2.25} />
            <span className="relative">
              Subir un proyecto
              <span
                className="absolute -bottom-0.5 left-0 h-px bg-current"
                style={{ width: '100%', transform: 'scaleX(0)', transformOrigin: 'left', transition: `transform 260ms ${EASE}` }}
                aria-hidden
              />
            </span>
          </Link>

          {/* ADMIN — tiniest */}
          <div className="mt-2">
            <Link
              to="/admin"
              data-i="6"
              className="stagger-in inline-flex items-center gap-1.5 text-udem-black/35 hover:text-udem-black/70 text-[11px] font-medium tracking-wider uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-udem-black/30 rounded px-1"
              style={{ transition: `color 180ms ${EASE}` }}
            >
              <Settings className="w-3 h-3" strokeWidth={2.25} />
              Admin
            </Link>
          </div>
        </div>

        {/* Event info */}
        <div className="stagger-in absolute bottom-6 left-6 text-left text-udem-black/60 text-xs leading-relaxed z-10 hidden md:block" data-i="6">
          <p className="font-bold text-udem-black/80">Fecha/ 26 de Mayo</p>
          <p>Hora/ 19:00 h</p>
          <p>Lugar/ Sexto piso, Centro</p>
          <p>Roberto Garza Sada</p>
        </div>

        {/* Hover effect for tertiary underline */}
        <style>{`
          a.group:hover .relative > span[aria-hidden] { transform: scaleX(1); }
        `}</style>
      </div>
      <Footer />
    </>
  )
}
