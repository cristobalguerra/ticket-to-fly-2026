// Carátula tipográfica para proyectos que todavía no suben su imagen:
// el nombre corto del proyecto (lo que va antes de los dos puntos).
export default function CoverPlaceholder({ title, className = '' }: { title: string; className?: string }) {
  const short = title.split(':')[0].trim()
  return (
    <div className={`w-full h-full bg-udem-black text-white flex items-end p-4 ${className}`} aria-hidden>
      <p className="cond text-[clamp(1.75rem,9vw,2.75rem)] sm:text-[clamp(1.5rem,3.2vw,2.75rem)] line-clamp-4 break-words">
        {short}
      </p>
    </div>
  )
}
