import Layout from '../components/Layout'
import { CURRENT } from '../lib/editions'

const EVENT = CURRENT.event

const LABEL = 'code text-[13px] md:text-sm text-udem-black/70'
const BODY = 'text-base md:text-[17px] leading-[1.6] text-udem-black/85 max-w-[62ch]'

export default function Info() {
  return (
    <Layout showBack>
      <div className="px-4 md:px-8 pb-20">
        <div className="pt-8 md:pt-10 stagger-in flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-i="0">
          <h1 className="cond text-[17vw] sm:text-[8.5rem] md:text-[11rem] -ml-[0.015em]">Información</h1>
          <p className="code text-[13px] md:text-[15px] leading-[1.7] pb-2 md:pb-4">{CURRENT.label}</p>
        </div>

        {/* Horarios: lo primero que se consulta, a todo el ancho */}
        <dl className="stagger-in grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-10 md:mt-14" data-i="1">
          {EVENT.day && <Fact value={EVENT.headline?.date ?? ''} label={EVENT.day} />}
          <Fact value={EVENT.montaje} label="Montaje" />
          <Fact value={EVENT.inauguracion} label="Inicio del evento" accent />
          <Fact value={EVENT.votingOpens} label={`Votación, cierra ${EVENT.votingCloses}`} />
        </dl>

        <Row label="Lugar" i={2}>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-[62ch]">
            <Place label="Exposición" value={EVENT.place} />
            <Place label="Premiación" value={EVENT.awardsPlace} />
          </dl>
        </Row>

        <Row label="Sobre el evento" i={3}>
          <div className={`${BODY} space-y-4`}>
            <p>
              Exposición de proyectos de Evaluación Final de los alumnos de la Escuela de Arte y Diseño del Centro Roberto Garza Sada de la Universidad de Monterrey.
            </p>
            <p>
              Buscando como cada semestre, la difusión del talento de nuestros alumnos. Como también la seguridad e integridad de maestros y expositores, para la exposición TTF {CURRENT.key}, se seguirán una serie de lineamientos de estandarización que agilizarán y facilitarán la exposición, así como el desplazamiento de los visitantes durante el evento.
            </p>
            <p>
              Se realizó una distribución estandarizada de dimensiones y necesidades por cada carrera, utilizando el mobiliario fijo en las áreas de uso común del 6to piso del CRGS. Los proyectos se distribuirán por programa y se asignarán de manera aleatoria.
            </p>
          </div>
        </Row>

        <Row label="Indicaciones para alumnos" i={4}>
          <ul className={`${BODY} space-y-3`}>
            <Bullet>Se montarán los carteles (se recomiendan dos) sobre las islas de mesas del 6to piso insertándose en la división de las mesas.</Bullet>
            <Bullet>
              <strong className="font-bold text-udem-black">Importante:</strong> deberán ser impresos sobre una superficie rígida para evitar pandeos o deformaciones. Cuidar el corte y montaje.
            </Bullet>
            <Bullet>Se solicita un soporte triangular de foamboard detrás de cada poster para que se mantengan verticales.</Bullet>
            <Bullet>Las mesas utilizadas de las islas serán las que den hacia el centro del 6to piso.</Bullet>
            <Bullet>Se montarán 3 proyectos por isla, dejando una mesa libre entre mesas con proyectos y dejando libres todas las mesas de atrás.</Bullet>
            <Bullet>Se asignará un número por proyecto y se indicarán en las mesas el número de equipo.</Bullet>
            <Bullet>Se indicarán las mesas en donde no se podrá poner nada absolutamente.</Bullet>
          </ul>
        </Row>

        <Row label="Qué se permite" i={5}>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            <div className="bg-white p-5 md:p-7">
              <h3 className={LABEL}>Sí</h3>
              <ul className="text-base md:text-[17px] leading-[1.6] text-udem-black/85 mt-4 space-y-1.5">
                <li>Prototipos a escala</li>
                <li>Dummies, mockups</li>
                <li>Renders, fotografías</li>
                <li>Merch del proyecto</li>
                <li>Posters</li>
                <li>Maquetas</li>
                <li>Laptops, iPads</li>
                <li>Un maniquí</li>
              </ul>
            </div>
            <div className="bg-udem-black text-white p-5 md:p-7">
              <h3 className="code text-[13px] md:text-sm text-udem-yellow">No</h3>
              <ul className="text-base md:text-[17px] leading-[1.6] text-white/90 mt-4 space-y-1.5">
                <li>Invadir mesas no habilitadas o de otros proyectos</li>
                <li>Pantallas superiores a laptops o iPads</li>
                <li>Piezas reales superiores al tamaño de la mesa</li>
                <li>Manteles o coberturas sobre las mesas</li>
                <li>Sonido ambiental o música individual</li>
                <li>Comida o bebida individual (catering en 5to piso)</li>
              </ul>
            </div>
          </div>
        </Row>

        <Row label="Medidas" i={6}>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 max-w-2xl">
            <Fact value="160 × 65" label="Mesa de exposición · cm" />
            <Fact value="74 × 120" label="Carteles · cm" />
          </dl>
          <p className={`${BODY} mt-8`}>
            Impresión sobre Foamboard. Incluyan información y fotografías de su proyecto con la jerarquía y diseño que mejor consideren.
          </p>
        </Row>

        <Row label="Cómo montar" i={7}>
          <img
            src={import.meta.env.BASE_URL + 'como-montar.png'}
            alt="Diagrama de montaje: posters sobre foam rígido con soporte triangular, usar solo la mesa frontal"
            className="w-full max-w-2xl bg-white"
          />
          <ul className={`${BODY} mt-6 space-y-3`}>
            <Bullet><strong className="font-bold text-udem-black">Posters:</strong> foam rígido</Bullet>
            <Bullet><strong className="font-bold text-udem-black">Soporte triangular:</strong> foam, mínimo 15 × 15 cm</Bullet>
            <Bullet>Fijar con cinta doble cara a la base</Bullet>
            <Bullet>Usar solo la mesa indicada (la que da al centro del piso)</Bullet>
          </ul>
        </Row>

        <Row label="Para docentes" i={7}>
          <div className="bg-udem-black text-white p-5 md:p-8 max-w-4xl">
            <div className="text-base md:text-[17px] leading-[1.6] text-white/90 max-w-[62ch] space-y-4">
              <p>
                <strong className="font-bold text-white">Premiación:</strong> Una categoría por programa (mejor proyecto por programa) y una categoría de toda la Escuela (mejor proyecto de la EAD).
              </p>
              <p>
                <strong className="font-bold text-white">Votación:</strong> Por parte de los profesores en plataforma digital. Liga llegará por email el día del evento.
              </p>
              <p>Es de suma importancia que consideren su asistencia al evento para que sea válido su voto.</p>
            </div>
            <dl className="flex flex-wrap gap-x-12 gap-y-6 mt-8">
              <div>
                <dd className="cond text-6xl md:text-7xl tabular-nums text-udem-yellow">{EVENT.votingOpens}</dd>
                <dt className="code text-[13px] md:text-sm text-white/70 mt-3">Abre la votación</dt>
              </div>
              <div>
                <dd className="cond text-6xl md:text-7xl tabular-nums">{EVENT.votingCloses}</dd>
                <dt className="code text-[13px] md:text-sm text-white/70 mt-3">Cierra</dt>
              </div>
            </dl>
            <p className="bg-udem-yellow text-udem-black font-bold text-base leading-[1.5] p-4 max-w-[46ch] mt-8">
              Solamente pueden votar profesores. Los proyectos quedarán descalificados si un alumno vota en cualquiera de los proyectos.
            </p>
          </div>
        </Row>

        <Row label="Dos días antes" i={7}>
          <p className={BODY}>
            Se enviará una liga para subir imágenes de sus proyectos, accesible para todos los maestros — esto con el fin de poder valorar con tiempo los trabajos y emitir su voto el día de la exposición.
          </p>
          <p className={`${BODY} mt-4`}>Gracias a DPAS, asesores y estudiantes.</p>
        </Row>
      </div>
    </Layout>
  )
}

/** Fila editorial: etiqueta a la izquierda, contenido a la derecha. */
function Row({ label, i, children }: { label: string; i: number; children: React.ReactNode }) {
  return (
    <section className="stagger-in grid md:grid-cols-12 gap-x-8 gap-y-4 mt-14 md:mt-20" data-i={i}>
      <h2 className={`${LABEL} md:col-span-3`}>{label}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

function Fact({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col-reverse justify-end">
      <dt className={`${LABEL} mt-3`}>
        <span className={accent ? 'bg-udem-yellow text-udem-black px-1.5 py-0.5 -ml-1.5' : undefined}>{label}</span>
      </dt>
      <dd className="cond text-[15vw] sm:text-7xl xl:text-8xl tabular-nums whitespace-nowrap">{value}</dd>
    </div>
  )
}

function Place({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={LABEL}>{label}</dt>
      <dd className="font-bold text-lg md:text-xl leading-snug mt-1.5">{value}</dd>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-1.5 h-1.5 bg-udem-black mt-[0.62em]" aria-hidden />
      <span className="flex-1">{children}</span>
    </li>
  )
}
