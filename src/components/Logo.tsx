import { cn } from '../lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
        Ana Luiza
      </span>
      <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold font-sans">
        Nutricionista
      </span>
    </div>
  )
}
