import type { ReactNode } from 'react'
import { PortalCard } from './PortalCard'

// Só os campos que a API já devolve. Hoje: data de emissão (GET /portal-paciente/planos).
// Meta de água, reavaliação, nutricionista e orientações não existem no backend.
interface DadosDoPlanoCardProps {
  emitidoEm: string | null
  rodape?: ReactNode
  className?: string
}

export function DadosDoPlanoCard({ emitidoEm, rodape, className }: DadosDoPlanoCardProps) {
  return (
    <PortalCard className={className}>
      <h2 className="text-label text-ink-secondary">Dados do plano</h2>

      {emitidoEm && (
        <dl className="mt-3 flex items-baseline justify-between gap-3 text-body-sm">
          <dt className="text-ink-secondary">Emitido em</dt>
          <dd className="text-ink">
            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(emitidoEm))}
          </dd>
        </dl>
      )}

      {rodape && <div className="mt-4 border-t border-border pt-4">{rodape}</div>}
    </PortalCard>
  )
}
