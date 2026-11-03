import { CheckCircle2 } from 'lucide-react'
import type { ProgressoDoDia } from '../../lib/progressoDoDia'
import { rotuloAcessivel, textoRefeicoes, unidadeDoAnel } from '../../lib/textosDoPainel'
import { ProgressRing } from '../ui/progress-ring'
import { PortalCard } from './PortalCard'

interface ProgressoProps {
  progresso: ProgressoDoDia | null
  carregando: boolean
  dia: string
  rotuloDoDia: string
}

export function ProgressoCard({ progresso, carregando, dia, rotuloDoDia }: ProgressoProps) {
  const completo = progresso !== null && progresso.feito >= progresso.total

  return (
    <PortalCard>
      <h2 className="text-label text-ink-secondary">Progresso do dia</h2>

      {carregando && !progresso && <p className="mt-3 text-body-sm text-ink-muted">Carregando...</p>}

      {!carregando && !progresso && (
        <p className="mt-3 text-body-sm text-ink-secondary">Sem plano para este dia</p>
      )}

      {progresso && (
        <div className="mt-4 flex flex-col items-center text-center">
          <ProgressRing
            size={148}
            strokeWidth={12}
            value={progresso.feito / progresso.total}
            total={progresso.total}
            unitLabel={unidadeDoAnel(progresso)}
            ariaLabel={rotuloAcessivel(progresso, rotuloDoDia)}
            contextKey={dia}
            valueClassName="text-[32px]"
          />
          {/* No modo refeições o centro já diz "2 de 5 refeições" */}
          {progresso.modo === 'kcal' && (
            <p className="mt-3 text-body-sm text-ink-secondary">{textoRefeicoes(progresso)}</p>
          )}
          {completo && (
            <p className="mt-3 flex items-center gap-1.5 text-body-sm font-semibold text-on-primary-subtle">
              <CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" />
              Plano do dia completo
            </p>
          )}
        </div>
      )}
    </PortalCard>
  )
}
