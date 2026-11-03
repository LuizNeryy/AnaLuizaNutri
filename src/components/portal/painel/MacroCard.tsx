import { motion, useReducedMotion } from 'motion/react'
import { EASE_PAINEL, formatarNumero } from './formato'
import { NumeroAnimado } from './NumeroAnimado'
import { PortalCard } from '../PortalCard'

interface MacroCardProps {
  nome: string
  cor: string
  consumido: number
  plano: number
  atraso?: number
}

// Gramas consumidas do macro contra a meta do plano, com barra que enche
export function MacroCard({ nome, cor, consumido, plano, atraso = 0 }: MacroCardProps) {
  const reduceMotion = useReducedMotion()
  const fracao = plano > 0 ? Math.min(1, consumido / plano) : 0
  const faltam = Math.max(0, plano - consumido)

  return (
    <PortalCard padding="sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-label text-ink-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cor }} />
          {nome}
        </h3>
        <span className="text-caption text-ink-muted tabular-nums">{Math.round(fracao * 100)}%</span>
      </div>

      <p className="mt-3 flex items-baseline gap-1">
        <NumeroAnimado valor={consumido} atraso={atraso} className="text-[28px] font-bold leading-none text-ink" />
        <span className="text-body-sm text-ink-secondary">de {formatarNumero(plano)} g</span>
      </p>

      <div
        role="progressbar"
        aria-label={`${nome}: ${formatarNumero(consumido)} de ${formatarNumero(plano)} gramas`}
        aria-valuemin={0}
        aria-valuemax={Math.round(plano)}
        aria-valuenow={Math.round(consumido)}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-sunken"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: cor }}
          initial={reduceMotion ? false : { width: '0%' }}
          animate={{ width: `${fracao * 100}%` }}
          transition={{ duration: 1, delay: atraso, ease: EASE_PAINEL }}
        />
      </div>

      <p className="mt-2 text-caption text-ink-muted">
        {faltam < 0.5 ? 'Meta do dia atingida' : `Faltam ${formatarNumero(faltam)} g`}
      </p>
    </PortalCard>
  )
}
