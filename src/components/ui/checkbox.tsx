import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <span className={cn('relative inline-flex h-6 w-6 shrink-0', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border-[1.5px] border-border bg-surface transition-colors checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <Check
        size={16}
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto text-on-primary opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  )
})
