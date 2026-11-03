import { ChevronRight, Clock, Flame } from 'lucide-react'
import type { ProgressoDoDia, ProximaRefeicao } from '../../lib/progressoDoDia'
import { textoProximaRefeicao } from '../../lib/progressoDoDia'
import type { Streak } from '../../lib/streak'
import {
  mensagemDaSequencia,
  rotuloAcessivel,
  textoDiasSeguidos,
  textoProgresso,
} from '../../lib/textosDoPainel'
import { ProgressRing } from '../ui/progress-ring'
import { PortalCard } from './PortalCard'

interface ResumoCompactoProps {
  progresso: ProgressoDoDia | null
  carregando: boolean
  dia: string
  rotuloDoDia: string
  streak: Streak | null
  proxima: ProximaRefeicao | null
  onIrParaRefeicao: (refeicaoId: string) => void
}

// Mobile/tablet: um card só abaixo dos chips
export function ResumoCompacto({
  progresso,
  carregando,
  dia,
  rotuloDoDia,
  streak,
  proxima,
  onIrParaRefeicao,
}: ResumoCompactoProps) {
  return (
    <PortalCard padding="sm" className="mt-4">
      <div className="flex items-center gap-4">
        {progresso ? (
          <ProgressRing
            size={72}
            strokeWidth={8}
            value={progresso.feito / progresso.total}
            total={progresso.total}
            ariaLabel={rotuloAcessivel(progresso, rotuloDoDia)}
            contextKey={dia}
            valueClassName="text-[16px]"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="text-h3 text-ink">
            {progresso
              ? textoProgresso(progresso)
              : carregando
                ? 'Carregando...'
                : 'Sem plano para este dia'}
          </p>
          {streak && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-ink-secondary">
              <Flame size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
              {streak.atual > 0 ? textoDiasSeguidos(streak.atual) : mensagemDaSequencia(streak)}
            </p>
          )}
        </div>
      </div>

      {proxima &&
        (proxima.tipo === 'proxima' ? (
          <button
            type="button"
            onClick={() => onIrParaRefeicao(proxima.refeicao.id)}
            className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-md bg-surface-sunken px-3 text-left text-body-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Clock size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-ink-secondary" />
            <span className="min-w-0 flex-1">
              <span className="text-ink-secondary">Próxima: </span>
              {textoProximaRefeicao(proxima)}
            </span>
            <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" className="text-ink-muted" />
          </button>
        ) : (
          <p className="mt-3 flex min-h-11 items-center gap-2 rounded-md bg-surface-sunken px-3 text-body-sm text-ink">
            <Clock size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-ink-secondary" />
            {textoProximaRefeicao(proxima)}
          </p>
        ))}
    </PortalCard>
  )
}
