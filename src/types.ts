export type Career = 'LDG' | 'LAED' | 'LDM' | 'LINT' | 'LDI' | 'LA'

export const CAREERS: { key: Career; name: string }[] = [
  { key: 'LDG', name: 'Diseño Gráfico' },
  { key: 'LAED', name: 'Animación y Efectos Digitales' },
  { key: 'LDM', name: 'Diseño de Modas' },
  { key: 'LINT', name: 'Diseño de Interiores' },
  { key: 'LDI', name: 'Diseño Industrial' },
  { key: 'LA', name: 'Artes' },
]

export interface Project {
  id: string
  career: Career
  projectName: string
  teamName: string
  description: string
  coverUrl: string
  slotId?: string  // assigned floor plan slot (e.g., "LDG-3")
  createdAt: Date
}

export interface Vote {
  id: string
  voterName: string
  career: Career | 'general'
  projectId: string
  voteType: 'career' | 'general'
  createdAt: Date
}

export interface VotingSettings {
  votingOpen: boolean
  updatedAt: Date
}
