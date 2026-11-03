import { cn } from '../../lib/utils'

export function Avatar({ nome, className }: { nome: string; className?: string }) {
  const inicial = nome.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-button-label text-on-primary',
        className,
      )}
    >
      {inicial}
    </div>
  )
}
