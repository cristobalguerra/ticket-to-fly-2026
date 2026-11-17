import Layout from '../components/Layout'
import { CURRENT } from '../lib/editions'

const EVENT = CURRENT.event

const LABEL = 'code text-[11px] text-udem-black/70'
const BODY = 'text-[15px] leading-[1.6] text-udem-black/85'

export default function Info() {
  return (
    <Layout showBack>
      <div className="px-4 md:px-8 pb-16">
        <div className="pt-8 md:pt-10 stagger-in flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-i="0">
          <h1 className="cond text-[17vw] sm:text-[8.5rem] md:text-[11rem] -ml-[0.015em]">Información</h1>
          <p className="code text-[11px] leading-[1.7] pb-2 md:pb-4">{CURRENT.label}</p>
        </div>

        <div className="max-w-3xl mt-8 md:mt-12 space-y-4">
          <p className={`stagger-in ${BODY} max-w-[62ch] pb-4`} data-i="1">
            Exposición de proyectos de Evaluación Final de los alumnos de la Escuela de Arte y Diseño del Centro Roberto Garza Sada de la Universidad de Monterrey.
          </p>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="2">
            <h2 className={LABEL}>Detalles del evento</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {EVENT.day && <Detail label="Día" value={EVENT.day} />}
              <Detail label="Montaje" value={EVENT.montaje} highlight />
              <Detail label="Inauguración" value={EVENT.inauguracion} />
              <Detail label="Lugar de premiación" value={EVENT.awardsPlace} highlight />
              <Detail label="Lugar de exposición" value={EVENT.place} wide />
            </dl>
          </section>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="3">
            <h2 className={LABEL}>Sobre el evento</h2>
            <div className={`${BODY} max-w-[62ch] mt-4 space-y-3`}>
              <p>
                Buscando como cada semestre, la difusión del talento de nuestros alumnos. Como también la seguridad e integridad de maestros y expositores, para la exposición TTF {CURRENT.key}, se seguirán una serie de lineamientos de estandarización que agilizarán y facilitarán la exposición, así como el desplazamiento de los visitantes durante el evento.
              </p>
              <p>
                Se realizó una distribución estandarizada de dimensiones y necesidades por cada carrera, utilizando el mobiliario fijo en las áreas de uso común del 6to piso del CRGS. Los proyectos se distribuirán por programa y se asignarán de manera aleatoria.
              </p>
            </div>
          </section>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="4">
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.01em]">Indicaciones para alumnos</h2>
            <ul className={`${BODY} max-w-[62ch] mt-5 space-y-3`}>
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
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <section className="stagger-in bg-white p-5 md:p-7" data-i="5">
              <h2 className={LABEL}>Sí se permite</h2>
              <ul className={`${BODY} mt-4 space-y-1.5`}>
                <li>Prototipos a escala</li>
                <li>Dummies, mockups</li>
                <li>Renders, fotografías</li>
                <li>Merch del proyecto</li>
                <li>Posters</li>
                <li>Maquetas</li>
                <li>Laptops, iPads</li>
                <li>Un maniquí</li>
              </ul>
            </section>

            <section className="stagger-in bg-udem-black text-white p-5 md:p-7" data-i="5">
              <h2 className="code text-[11px] text-udem-yellow">No se permite</h2>
              <ul className="text-[15px] leading-[1.6] text-white/90 mt-4 space-y-1.5">
                <li>Invadir mesas no habilitadas o de otros proyectos</li>
                <li>Pantallas superiores a laptops o iPads</li>
                <li>Piezas reales superiores al tamaño de la mesa</li>
                <li>Manteles o coberturas sobre las mesas</li>
                <li>Sonido ambiental o música individual</li>
                <li>Comida o bebida individual (catering en 5to piso)</li>
              </ul>
            </section>
          </div>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="6">
            <h2 className={LABEL}>Medidas</h2>
            <div className="grid grid-cols-2 gap-6 mt-5">
              <div>
                <p className="cond text-5xl md:text-7xl tabular-nums">160 × 65</p>
                <p className={`${LABEL} mt-3`}>Mesa de exposición · cm</p>
              </div>
              <div>
                <p className="cond text-5xl md:text-7xl tabular-nums">74 × 120</p>
                <p className={`${LABEL} mt-3`}>Carteles · cm</p>
              </div>
            </div>
            <p className={`${BODY} max-w-[62ch] mt-6`}>
              Impresión sobre Foamboard. Incluyan información y fotografías de su proyecto con la jerarquía y diseño que mejor consideren.
            </p>
          </section>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="7">
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.01em]">Cómo montar</h2>
            <img
              src={import.meta.env.BASE_URL + 'como-montar.png'}
              alt="Diagrama de montaje: posters sobre foam rígido con soporte triangular, usar solo la mesa frontal"
              className="w-full mt-5"
            />
            <ul className={`${BODY} max-w-[62ch] mt-5 space-y-3`}>
              <Bullet><strong className="font-bold text-udem-black">Posters:</strong> foam rígido</Bullet>
              <Bullet><strong className="font-bold text-udem-black">Soporte triangular:</strong> foam, mínimo 15 × 15 cm</Bullet>
              <Bullet>Fijar con cinta doble cara a la base</Bullet>
              <Bullet>Usar solo la mesa indicada (la que da al centro del piso)</Bullet>
            </ul>
          </section>

          <section className="stagger-in bg-udem-black text-white p-5 md:p-7" data-i="7">
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.01em]">Para docentes</h2>
            <div className="text-[15px] leading-[1.6] text-white/90 max-w-[62ch] mt-5 space-y-3">
              <p>
                <strong className="font-bold text-white">Premiación:</strong> Una categoría por programa (mejor proyecto por programa) y una categoría de toda la Escuela (mejor proyecto de la EAD).
              </p>
              <p>
                <strong className="font-bold text-white">Votación:</strong> Por parte de los profesores en plataforma digital. Liga llegará por email el día del evento.
              </p>
            </div>
            <div className="flex gap-10 mt-7">
              <div>
                <p className="cond text-5xl md:text-6xl tabular-nums text-udem-yellow">{EVENT.votingOpens}</p>
                <p className="code text-[11px] text-white/70 mt-3">Abre</p>
              </div>
              <div>
                <p className="cond text-5xl md:text-6xl tabular-nums">{EVENT.votingCloses}</p>
                <p className="code text-[11px] text-white/70 mt-3">Cierra</p>
              </div>
            </div>
            <p className="text-[15px] leading-[1.6] text-white/90 max-w-[62ch] mt-7">
              Es de suma importancia que consideren su asistencia al evento para que sea válido su voto.
            </p>
          </section>

          <section className="stagger-in bg-white p-5 md:p-7" data-i="7">
            <h2 className={LABEL}>Dos días antes</h2>
            <p className={`${BODY} max-w-[62ch] mt-4`}>
              Se enviará una liga para subir imágenes de sus proyectos, accesible para todos los maestros — esto con el fin de poder valorar con tiempo los trabajos y emitir su voto el día de la exposición.
            </p>
          </section>

          <p className={`${LABEL} pt-6`}>
            Aproximadamente 60 proyectos. Gracias a DPAS, asesores y estudiantes.
          </p>
        </div>
      </div>
    </Layout>
  )
}

function Detail({ label, value, highlight, wide }: { label: string; value: string; highlight?: boolean; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="code text-[11px] text-udem-black/70">
        <span className={highlight ? 'bg-udem-yellow text-udem-black px-1.5 py-0.5 -ml-1.5' : undefined}>{label}</span>
      </dt>
      <dd className="font-bold text-lg leading-snug mt-1.5">{value}</dd>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-1.5 h-1.5 bg-udem-black mt-[0.6em]" aria-hidden />
      <span className="flex-1">{children}</span>
    </li>
  )
}
