import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const PADDING = { md: 'p-5', sm: 'p-4', none: '' }

// Card do painel do portal: radius-lg, borda, sem sombra.
// Padding como prop: o cn do projeto (clsx) não resolve conflito entre classes.
export function PortalCard({
  className,
  padding = 'md',
  ...props
}: HTMLAttributes<HTMLElement> & { padding?: keyof typeof PADDING }) {
  return (
    <section
      className={cn('rounded-lg border border-border bg-surface', PADDING[padding], className)}
      {...props}
    />
  )
}
