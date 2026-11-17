// Cada semestre es una edición. Los proyectos y votos viven en las mismas
// colecciones de Firestore; la edición se resuelve por la fecha de creación,
// así los datos de ediciones pasadas no se tocan ni se migran.

export type EditionKey = 'PR26' | 'OT26'

export interface EditionEvent {
  /** Día del evento en texto, p. ej. "Martes 8 de diciembre". null = por definir */
  day: string | null
  /** Momento en que la votación se desbloquea sola. null = solo la abre Admin */
  votingOpensAt: Date | null
  /** Aviso mientras la votación sigue cerrada, una línea por elemento. null = «Cerrada» */
  votingSoon: string[] | null
  montaje: string
  inauguracion: string
  votingOpens: string
  votingCloses: string
  place: string
  awardsPlace: string
}

export interface Edition {
  key: EditionKey
  season: string
  year: number
  label: string
  /** Inicio del semestre (inclusive) */
  from: Date
  /** Fin del semestre (exclusivo). null = edición en curso */
  to: Date | null
  event: EditionEvent
}

const PLACE = '6to piso del Centro Roberto Garza Sada Campus UDEM'

export const EDITIONS: Edition[] = [
  {
    key: 'OT26',
    season: 'Otoño',
    year: 2026,
    label: 'Otoño 2026',
    from: new Date('2026-07-01T00:00:00-06:00'),
    to: null,
    event: {
      day: null,
      votingOpensAt: null,
      votingSoon: ['Próximamente', '10 de diciembre'],
      montaje: '3:00 PM',
      inauguracion: '5:00 PM',
      votingOpens: '6:30 PM',
      votingCloses: '8:30 PM',
      place: PLACE,
      awardsPlace: 'Aula Crítica',
    },
  },
  {
    key: 'PR26',
    season: 'Primavera',
    year: 2026,
    label: 'Primavera 2026',
    from: new Date('2026-01-01T00:00:00-06:00'),
    to: new Date('2026-07-01T00:00:00-06:00'),
    event: {
      day: 'Martes 26 de mayo',
      votingOpensAt: new Date('2026-05-26T18:00:00-06:00'),
      votingSoon: null,
      montaje: '3:00 PM',
      inauguracion: '5:00 PM',
      votingOpens: '6:30 PM',
      votingCloses: '8:30 PM',
      place: PLACE,
      awardsPlace: 'Aula Crítica',
    },
  },
]

export const CURRENT: Edition = EDITIONS[0]
export const ARCHIVED: Edition[] = EDITIONS.slice(1)

export function getEdition(key: string | undefined): Edition | undefined {
  return EDITIONS.find((e) => e.key === key?.toUpperCase())
}

export function inEdition(date: Date, edition: Edition): boolean {
  const t = date.getTime()
  return t >= edition.from.getTime() && (edition.to === null || t < edition.to.getTime())
}
