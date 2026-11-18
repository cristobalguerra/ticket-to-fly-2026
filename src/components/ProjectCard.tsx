import type { Project } from '../types'
import { Check } from 'lucide-react'
import CoverPlaceholder from './CoverPlaceholder'

interface Props {
  project: Project
  selected?: boolean
  onClick?: () => void
  showCareer?: boolean
}

export default function ProjectCard({ project, selected, onClick, showCareer }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`project-card relative w-full text-left bg-white overflow-hidden border-[3px] ${
        selected ? 'selected border-udem-black' : 'border-transparent'
      } cursor-pointer`}
    >
      <div
        className={`absolute top-0 right-0 z-10 w-10 h-10 bg-udem-black flex items-center justify-center ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transition: 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <Check className="w-5 h-5 text-udem-yellow" strokeWidth={3} />
      </div>
      <div className="aspect-[4/3] overflow-hidden bg-black/5">
        {project.coverUrl ? (
          <img src={project.coverUrl} alt={project.projectName} className="w-full h-full object-cover" />
        ) : (
          <CoverPlaceholder title={project.projectName} />
        )}
      </div>
      <div className="p-4">
        {showCareer && <p className="code text-[13px] md:text-sm text-udem-black/60 mb-2">{project.career}</p>}
        <h3 className="font-bold text-lg leading-[1.15]">{project.projectName}</h3>
        <p className="text-sm text-udem-black/65 mt-1.5">{project.teamName}</p>
        {project.description && (
          <p className="text-sm text-udem-black/55 mt-2 line-clamp-2">{project.description}</p>
        )}
      </div>
    </button>
  )
}
