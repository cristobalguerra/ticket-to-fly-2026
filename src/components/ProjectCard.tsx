import type { Project } from '../types'
import { Check } from 'lucide-react'

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
      className={`project-card relative w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border-2 ${
        selected ? 'selected border-udem-black' : 'border-transparent'
      } shadow-md shadow-black/5 cursor-pointer`}
    >
      <div
        className={`absolute top-3 right-3 z-10 w-8 h-8 bg-udem-black rounded-full flex items-center justify-center shadow-lg ${
          selected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{ transition: 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), transform 220ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <Check className="w-5 h-5 text-white" strokeWidth={3} />
      </div>
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {project.coverUrl ? (
          <img
            src={project.coverUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">?</div>
        )}
      </div>
      <div className="p-4">
        {showCareer && (
          <span className="inline-block text-xs font-black bg-udem-black text-white px-2.5 py-0.5 rounded-full mb-2 tracking-wider">
            {project.career}
          </span>
        )}
        <h3 className="font-bold text-base leading-tight">{project.projectName}</h3>
        <p className="text-sm text-udem-black/50 mt-1">{project.teamName}</p>
        {project.description && (
          <p className="text-sm text-udem-black/30 mt-2 line-clamp-2">{project.description}</p>
        )}
      </div>
    </button>
  )
}
