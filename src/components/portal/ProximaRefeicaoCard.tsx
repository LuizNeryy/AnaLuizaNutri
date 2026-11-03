import { ChevronRight, Clock } from 'lucide-react'
import { textoProximaRefeicao, type ProximaRefeicao } from '../../lib/progressoDoDia'
import { PortalCard } from './PortalCard'

interface ProximaRefeicaoCardProps {
  info: ProximaRefeicao
  onIrParaRefeicao: (refeicaoId: string) => void
}

export function ProximaRefeicaoCard({ info, onIrParaRefeicao }: ProximaRefeicaoCardProps) {
  if (info.tipo !== 'proxima') {
    return (
      <PortalCard>
        <h2 className="text-label text-ink-secondary">Próxima refeição</h2>
        <p className="mt-2 text-body text-ink">{textoProximaRefeicao(info)}</p>
      </PortalCard>
    )
  }

  return (
    <PortalCard padding="none">
      <button
        type="button"
        onClick={() => onIrParaRefeicao(info.refeicao.id)}
        className="flex w-full items-center gap-3 rounded-lg p-5 text-left hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-on-primary-subtle">
          <Clock size={18} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-label text-ink-secondary">Próxima refeição</span>
          <span className="block text-h3 text-ink">{info.refeicao.nome}</span>
          <span className="block text-body-sm text-ink-secondary">{info.refeicao.horario}</span>
        </span>
        <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" className="text-ink-muted" />
      </button>
    </PortalCard>
  )
}
