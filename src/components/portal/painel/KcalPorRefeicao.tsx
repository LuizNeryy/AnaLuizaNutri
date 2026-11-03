import { motion, useReducedMotion } from 'motion/react'
import type { RefeicaoNoPainel } from '../../../lib/nutricaoDoDia'
import { temaDaRefeicao } from '../../../lib/refeicaoTema'
import { EASE_PAINEL, formatarNumero } from './formato'
import { PortalCard } from '../PortalCard'

// Uma barra por refeição: comprimento = kcal planejadas (relativo à maior refeição),
// preenchimento = parte já marcada como consumida. As barras entram uma depois da outra.
export function KcalPorRefeicao({ refeicoes }: { refeicoes: RefeicaoNoPainel[] }) {
  const reduceMotion = useReducedMotion()
  const maior = Math.max(...refeicoes.map((refeicao) => refeicao.kcalPlano), 1)

  return (
    <PortalCard>
      <h2 className="text-label text-ink-secondary">Calorias por refeição</h2>

      <ul className="mt-4 flex flex-col gap-4">
        {refeicoes.map((refeicao, indice) => {
          const tema = temaDaRefeicao(refeicao.nome)
          const Icone = tema.Icon
          const atraso = 0.15 + indice * 0.12
          const largura = (refeicao.kcalPlano / maior) * 100
          const consumida = refeicao.kcalPlano > 0 ? Math.min(1, refeicao.kcalConsumida / refeicao.kcalPlano) : 0

          return (
            <li key={refeicao.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tema.badgeBg} ${tema.badgeText}`}
              >
                <Icone size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-body-sm">
                  <span className="truncate text-ink">
                    {refeicao.nome}
                    <span className="ml-2 text-caption text-ink-muted">{refeicao.horario}</span>
                  </span>
                  <span className="shrink-0 text-ink-secondary tabular-nums">
                    {refeicao.kcalConsumida > 0 && (
                      <span className="font-semibold text-ink">{formatarNumero(refeicao.kcalConsumida)} / </span>
                    )}
                    {formatarNumero(refeicao.kcalPlano)} kcal
                  </span>
                </div>

                <div className="mt-1.5 h-2.5">
                  <motion.div
                    className="relative h-full overflow-hidden rounded-full bg-primary-subtle"
                    initial={reduceMotion ? false : { width: '0%' }}
                    animate={{ width: `${largura}%` }}
                    transition={{ duration: 0.8, delay: atraso, ease: EASE_PAINEL }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={reduceMotion ? false : { width: '0%' }}
                      animate={{ width: `${consumida * 100}%` }}
                      transition={{ duration: 0.8, delay: atraso + 0.4, ease: EASE_PAINEL }}
                    />
                  </motion.div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 flex items-center gap-4 text-caption text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary" /> Consumido
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary-subtle" /> Planejado
        </span>
      </p>
    </PortalCard>
  )
}
