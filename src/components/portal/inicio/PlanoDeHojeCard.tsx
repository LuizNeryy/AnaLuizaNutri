import { CheckCircle2, Circle, Clock, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { calcularProgresso, textoProximaRefeicao, type ProximaRefeicao } from '../../../lib/progressoDoDia'
import { rotuloAcessivel, textoProgresso } from '../../../lib/textosDoPainel'
import { ProgressRing } from '../../ui/progress-ring'
import { cn } from '../../../lib/utils'
import { PortalCard } from '../PortalCard'

export type RefeicaoDeHoje = {
  id: string
  nome: string
  horario: string
  itens: { id: string; consumido: boolean; kcal?: number | null }[]
}

interface PlanoDeHojeCardProps {
  hoje: string
  // undefined = carregando; null = sem plano para hoje
  refeicoes: RefeicaoDeHoje[] | null | undefined
  proxima: ProximaRefeicao | null
  erro: boolean
  className?: string
}

export function PlanoDeHojeCard({ hoje, refeicoes, proxima, erro, className }: PlanoDeHojeCardProps) {
  const progresso = calcularProgresso(refeicoes ?? null)

  return (
    <PortalCard className={cn('flex h-full flex-col', className)} aria-labelledby="titulo-plano-hoje">
      <h2 id="titulo-plano-hoje" className="text-label text-ink-secondary">
        Plano de hoje
      </h2>

      {(erro || refeicoes === undefined || refeicoes === null) && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-subtle text-on-primary-subtle"
          >
            <UtensilsCrossed size={26} strokeWidth={1.75} />
          </span>
          <p className={erro ? 'max-w-xs text-body-sm text-on-danger-subtle' : 'max-w-xs text-body-sm text-ink-secondary'}>
            {erro
              ? 'Não foi possível carregar o plano de hoje.'
              : refeicoes === undefined
                ? 'Carregando...'
                : 'Seu nutricionista ainda não publicou um plano alimentar para hoje.'}
          </p>
        </div>
      )}

      {!erro && refeicoes && (
        <>
          <div className="mt-4 flex items-center gap-4">
            {progresso && (
              <ProgressRing
                size={96}
                strokeWidth={9}
                value={progresso.feito / progresso.total}
                total={progresso.total}
                ariaLabel={rotuloAcessivel(progresso, 'de hoje')}
                contextKey={hoje}
                valueClassName="text-[22px]"
              />
            )}
            <div className="min-w-0">
              <p className="text-h3 text-ink">{progresso ? textoProgresso(progresso) : 'Plano sem alimentos'}</p>
              {proxima && (
                <p className="mt-1 flex items-center gap-1.5 text-body-sm text-ink-secondary">
                  <Clock size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
                  {proxima.tipo === 'proxima' ? `Próxima: ${textoProximaRefeicao(proxima)}` : textoProximaRefeicao(proxima)}
                </p>
              )}
            </div>
          </div>

          <ul className="mt-4 divide-y divide-border border-t border-border">
            {refeicoes.map((refeicao) => {
              const feitos = refeicao.itens.filter((item) => item.consumido).length
              const concluida = refeicao.itens.length > 0 && feitos === refeicao.itens.length
              return (
                <li key={refeicao.id} className="flex items-center gap-3 py-2.5">
                  {concluida ? (
                    <CheckCircle2 size={20} strokeWidth={1.75} className="shrink-0 text-primary" aria-hidden="true" />
                  ) : (
                    <Circle size={20} strokeWidth={1.75} className="shrink-0 text-ink-muted" aria-hidden="true" />
                  )}
                  <span className="w-12 shrink-0 text-body-sm text-ink-secondary tabular-nums">{refeicao.horario}</span>
                  <span className="min-w-0 flex-1 truncate text-body-sm text-ink">{refeicao.nome}</span>
                  <span className="text-caption text-ink-muted tabular-nums">
                    {feitos}/{refeicao.itens.length}
                    <span className="sr-only">
                      {' '}
                      {refeicao.itens.length === 1 ? 'alimento marcado' : 'alimentos marcados'}
                      {concluida ? ', concluída' : ''}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <div className="pt-4" />
      <Link
        to="/portal/plano"
        className="mt-auto flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-button-label text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {refeicoes ? 'Marcar refeições de hoje' : 'Abrir plano alimentar'}
      </Link>
    </PortalCard>
  )
}
