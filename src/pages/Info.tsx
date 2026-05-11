import Layout from '../components/Layout'
import { Calendar, Clock, MapPin, Trophy, Check, X, Ruler, Vote, Mail, Info as InfoIcon } from 'lucide-react'

export default function Info() {
  return (
    <Layout showBack>
      <div className="max-w-2xl mx-auto p-4 pb-12">
        <div className="mt-4 mb-6 stagger-in" data-i="0">
          <h1 className="text-3xl font-black tracking-tight">Ticket to Fly PR26</h1>
          <p className="text-udem-black/60 text-sm mt-2">
            Exposición de proyectos de Evaluación Final de los alumnos de la Escuela de Arte y Diseño del Centro Roberto Garza Sada de la Universidad de Monterrey.
          </p>
        </div>

        {/* Event details card */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6" data-i="1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-udem-black/40 mb-4">Detalles del Evento</h2>
          <div className="space-y-3">
            <Detail icon={<Calendar className="w-4 h-4" />} label="Día" value="Martes 26 de Mayo" />
            <Detail icon={<Clock className="w-4 h-4" />} label="Montaje" value="3:00 PM" highlight />
            <Detail icon={<Clock className="w-4 h-4" />} label="Inauguración" value="5:00 PM" />
            <Detail icon={<MapPin className="w-4 h-4" />} label="Lugar Exposición" value="6to piso del Centro Roberto Garza Sada Campus UDEM" />
            <Detail icon={<Trophy className="w-4 h-4" />} label="Lugar Premiación" value="Aula Crítica" highlight />
          </div>
        </div>

        {/* Intro */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6" data-i="2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-udem-black/40 mb-3 flex items-center gap-2">
            <InfoIcon className="w-3.5 h-3.5" /> Sobre el Evento
          </h2>
          <p className="text-sm text-udem-black/75 leading-relaxed">
            Buscando como cada semestre, la difusión del talento de nuestros alumnos. Como también la seguridad e integridad de maestros y expositores, para la exposición TTF PR26, se seguirán una serie de lineamientos de estandarización que agilizarán y facilitarán la exposición, así como el desplazamiento de los visitantes durante el evento.
          </p>
          <p className="text-sm text-udem-black/75 leading-relaxed mt-3">
            Se realizó una distribución estandarizada de dimensiones y necesidades por cada carrera, utilizando el mobiliario fijo en las áreas de uso común del 6to piso del CRGS. Los proyectos se distribuirán por programa y se asignarán de manera aleatoria.
          </p>
        </div>

        {/* Instructions for students */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6" data-i="3">
          <h2 className="text-lg font-bold mb-4">Indicaciones para Alumnos</h2>
          <ul className="space-y-3 text-sm text-udem-black/80">
            <Bullet>Se montarán los carteles (se recomiendan dos) sobre las islas de mesas del 6to piso insertándose en la división de las mesas.</Bullet>
            <Bullet>
              <span className="font-bold text-udem-black">IMPORTANTE:</span> deberán ser impresos sobre una superficie rígida para evitar pandeos o deformaciones. Cuidar el corte y montaje.
            </Bullet>
            <Bullet>Se solicita un soporte triangular de foamboard detrás de cada poster para que se mantengan verticales.</Bullet>
            <Bullet>Las mesas utilizadas de las islas serán las que den hacia el centro del 6to piso.</Bullet>
            <Bullet>Se montarán 3 proyectos por isla, dejando una mesa libre entre mesas con proyectos y dejando libres todas las mesas de atrás.</Bullet>
            <Bullet>Se asignará un número por proyecto y se indicarán en las mesas el número de equipo.</Bullet>
            <Bullet>Se indicarán las mesas en donde no se podrá poner nada absolutamente.</Bullet>
          </ul>
        </div>

        {/* What's allowed / not allowed */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="stagger-in bg-white rounded-2xl border border-green-200 shadow-sm p-5" data-i="4">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3 text-green-700">
              <Check className="w-4 h-4" /> SÍ se permite
            </h3>
            <ul className="space-y-1.5 text-sm text-udem-black/80">
              <li>• Prototipos a escala</li>
              <li>• Dummies, mockups</li>
              <li>• Renders, fotografías</li>
              <li>• Merch del proyecto</li>
              <li>• Posters</li>
              <li>• Maquetas</li>
              <li>• Laptops, iPads</li>
              <li>• Un maniquí</li>
            </ul>
          </div>

          <div className="stagger-in bg-white rounded-2xl border border-red-200 shadow-sm p-5" data-i="5">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3 text-red-700">
              <X className="w-4 h-4" /> NO se permite
            </h3>
            <ul className="space-y-1.5 text-sm text-udem-black/80">
              <li>• Invadir mesas no habilitadas o de otros proyectos</li>
              <li>• Pantallas superiores a laptops o iPads</li>
              <li>• Piezas reales superiores al tamaño de la mesa</li>
              <li>• Manteles o coberturas sobre las mesas</li>
              <li>• Sonido ambiental o música individual</li>
              <li>• Comida o bebida individual (catering en 5to piso)</li>
            </ul>
          </div>
        </div>

        {/* Measurements */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6" data-i="6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-udem-black/40 mb-4 flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5" /> Medidas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-udem-black/50">Mesa de exposición</p>
              <p className="font-bold text-lg tabular-nums">160 × 65 cm</p>
            </div>
            <div>
              <p className="text-xs text-udem-black/50">Carteles</p>
              <p className="font-bold text-lg tabular-nums">74 × 120 cm</p>
            </div>
          </div>
          <p className="text-xs text-udem-black/50 mt-4">
            Impresión sobre Foamboard. Incluyan información y fotografías de su proyecto con la jerarquía y diseño que mejor consideren.
          </p>
        </div>

        {/* Mounting diagram */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6" data-i="7">
          <h2 className="text-lg font-bold mb-4">Cómo Montar</h2>
          <MountingDiagram />
          <ul className="mt-4 space-y-1.5 text-xs text-udem-black/70">
            <li>• <strong>Posters:</strong> Foam rígido</li>
            <li>• <strong>Soporte triangular:</strong> Foam, mínimo 15 × 15 cm</li>
            <li>• Fijar con cinta doble cara a la base</li>
            <li>• Usar solo la mesa indicada (la que da al centro del piso)</li>
          </ul>
        </div>

        {/* Teacher info */}
        <div className="stagger-in bg-udem-black text-white rounded-2xl p-5 mb-6" data-i="7">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Vote className="w-5 h-5 text-udem-yellow" /> Para Docentes
          </h2>
          <div className="space-y-3 text-sm text-white/80 leading-relaxed">
            <p>
              <strong className="text-white">Premiación:</strong> Una categoría por programa (mejor proyecto por programa) y una categoría de toda la Escuela (mejor proyecto de la EAD).
            </p>
            <p>
              <strong className="text-white">Votación:</strong> Por parte de los profesores en plataforma digital. Liga llegará por email el día del evento.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs">
              <div>
                <p className="text-white/40 uppercase tracking-wider">Abre</p>
                <p className="font-bold tabular-nums text-udem-yellow">6:30 PM</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-white/40 uppercase tracking-wider">Cierra</p>
                <p className="font-bold tabular-nums">8:30 PM</p>
              </div>
            </div>
            <p className="text-xs text-white/60 pt-2">
              Es de suma importancia que consideren su asistencia al evento para que sea válido su voto.
            </p>
          </div>
        </div>

        {/* Pre-event preview */}
        <div className="stagger-in bg-white rounded-2xl border border-gray-100 shadow-sm p-5" data-i="7">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" /> Dos días antes
          </h3>
          <p className="text-sm text-udem-black/70 leading-relaxed">
            Se enviará una liga para subir imágenes de sus proyectos, accesible para todos los maestros — esto con el fin de poder valorar con tiempo los trabajos y emitir su voto el día de la exposición.
          </p>
        </div>

        <p className="text-xs text-udem-black/40 text-center mt-8">
          Aproximadamente 60 proyectos. Gracias a DPAS, asesores y estudiantes.
        </p>
      </div>
    </Layout>
  )
}

function Detail({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 ${highlight ? 'text-red-500' : 'text-udem-black/40'}`}>{icon}</span>
      <div className="flex-1">
        <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-red-500' : 'text-udem-black/50'}`}>{label}</p>
        <p className="font-semibold text-sm text-udem-black mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed">
      <span className="text-orange-500 mt-1.5 shrink-0" style={{ width: 6, height: 6, borderRadius: 9999, background: '#F97316' }} />
      <span className="flex-1">{children}</span>
    </li>
  )
}

function MountingDiagram() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100">
      <svg viewBox="0 0 320 200" className="w-full max-w-md mx-auto block" xmlns="http://www.w3.org/2000/svg">
        {/* Table (3D perspective) */}
        <polygon points="60,150 260,150 290,170 90,170" fill="white" stroke="#9CA3AF" strokeWidth={1.5} />
        <polygon points="260,150 290,170 290,180 260,160" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1.5} />
        <polygon points="60,150 90,170 90,180 60,160" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1.5} />
        {/* Table divider line */}
        <line x1="160" y1="150" x2="190" y2="170" stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3,3" />
        {/* Posters (foam rigido) */}
        <polygon points="115,40 175,30 175,150 115,150" fill="#F97316" stroke="#C2410C" strokeWidth={1.5} />
        <polygon points="145,35 205,25 205,148 145,150" fill="#FB923C" stroke="#C2410C" strokeWidth={1.5} />
        {/* Triangular support */}
        <polygon points="100,150 130,150 115,110" fill="#EA580C" stroke="#9A3412" strokeWidth={1.5} />
        {/* Labels */}
        <text x="62" y="172" fontSize="6" fontWeight="700" fill="#991B1B">NO USAR</text>
        <text x="62" y="180" fontSize="6" fontWeight="700" fill="#991B1B">ESTA MESA</text>
        <text x="200" y="172" fontSize="6" fontWeight="700" fill="#15803D">USAR ESTA MESA</text>
        <text x="206" y="180" fontSize="6" fontWeight="700" fill="#15803D">PARA EXPONER</text>
      </svg>
    </div>
  )
}
