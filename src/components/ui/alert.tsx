import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type AlertVariant = 'error' | 'success' | 'warning'

const config: Record<AlertVariant, { label: string; icon: typeof AlertCircle; classes: string }> = {
  error: { label: 'Erro', icon: AlertCircle, classes: 'bg-danger-subtle text-on-danger-subtle' },
  success: {
    label: 'Sucesso',
    icon: CheckCircle2,
    classes: 'bg-primary-subtle text-on-primary-subtle',
  },
  warning: {
    label: 'Atenção',
    icon: AlertTriangle,
    classes: 'bg-warning-subtle text-on-warning-subtle',
  },
}

export function Alert({ variant, children }: { variant: AlertVariant; children: ReactNode }) {
  const { label, icon: Icon, classes } = config[variant]

  return (
    <div className={cn('flex items-start gap-2 rounded-sm px-3 py-2 text-body-sm', classes)}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p>
        <span className="font-semibold">{label}: </span>
        {children}
      </p>
    </div>
  )
}
