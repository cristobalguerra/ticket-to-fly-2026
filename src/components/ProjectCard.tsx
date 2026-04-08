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
      className={`project-card relative w-full text-left bg-white rounded-2xl overflow-hidden border-2 ${
        selected ? 'selected border-udem-yellow' : 'border-transparent'
      } shadow-md cursor-pointer`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-udem-yellow rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-udem-black" strokeWidth={3} />
        </div>
      )}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {project.coverUrl ? (
          <img
            src={project.coverUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">?</div>
        )}
      </div>
      <div className="p-4">
        {showCareer && (
          <span className="inline-block text-xs font-bold bg-ead-teal text-white px-2 py-0.5 rounded-full mb-2">
            {project.career}
          </span>
        )}
        <h3 className="font-bold text-base leading-tight">{project.projectName}</h3>
        <p className="text-sm text-gray-500 mt-1">{project.teamName}</p>
        {project.description && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{project.description}</p>
        )}
      </div>
    </button>
  )
}
