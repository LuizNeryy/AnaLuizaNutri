import { motion, useReducedMotion } from 'motion/react'
import { distribuicaoDasKcal, MACROS, type Totais } from '../../../lib/nutricaoDoDia'
import { EASE_PAINEL, formatarNumero } from './formato'
import { NumeroAnimado } from './NumeroAnimado'
import { PortalCard } from '../PortalCard'

const TAMANHO = 168
const ESPESSURA = 18
// Folga entre fatias, em fração da volta
const FOLGA = 0.012

// Rosca com a parte das kcal do plano que vem de cada macro; as fatias se desenham em sequência
export function DistribuicaoMacros({ plano, className }: { plano: Totais; className?: string }) {
  const reduceMotion = useReducedMotion()
  const partes = distribuicaoDasKcal(plano)
  const raio = (TAMANHO - ESPESSURA) / 2
  const centro = TAMANHO / 2

  // Cada fatia começa onde as anteriores terminam
  const fatias = MACROS.map((macro, indice) => ({
    ...macro,
    indice,
    fracao: partes[macro.chave],
    inicio: MACROS.slice(0, indice).reduce((soma, anterior) => soma + partes[anterior.chave], 0),
  }))

  const descricao = MACROS.map(
    (macro) => `${macro.nome} ${Math.round(partes[macro.chave] * 100)}%`,
  ).join(', ')

  return (
    <PortalCard className={className}>
      <h2 className="text-label text-ink-secondary">De onde vêm as calorias do plano</h2>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:flex-col">
        <div className="relative shrink-0" style={{ width: TAMANHO, height: TAMANHO }}>
          <svg
            role="img"
            aria-label={`Distribuição das calorias do plano: ${descricao}`}
            width={TAMANHO}
            height={TAMANHO}
            viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}
          >
            <circle
              cx={centro}
              cy={centro}
              r={raio}
              fill="none"
              strokeWidth={ESPESSURA}
              className="stroke-surface-sunken"
            />
            {fatias
              .filter((fatia) => fatia.fracao > FOLGA)
              .map((fatia) => (
                // Rotação no <g> com atributo SVG puro: o círculo começa no topo e na posição da fatia
                <g key={fatia.chave} transform={`rotate(${fatia.inicio * 360 - 90} ${centro} ${centro})`}>
                  <motion.circle
                    cx={centro}
                    cy={centro}
                    r={raio}
                    fill="none"
                    strokeWidth={ESPESSURA}
                    style={{ stroke: fatia.cor }}
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: fatia.fracao - FOLGA }}
                    transition={{ duration: 0.7, delay: 0.2 + fatia.indice * 0.35, ease: EASE_PAINEL }}
                  />
                </g>
              ))}
          </svg>

          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <NumeroAnimado valor={plano.kcal} className="text-[26px] font-bold leading-none text-ink" />
            <span className="mt-1 text-caption text-ink-secondary">kcal no plano</span>
          </div>
        </div>

        <ul className="flex w-full max-w-[220px] flex-col gap-2.5">
          {MACROS.map((macro) => (
            <li key={macro.chave} className="flex items-center gap-2.5 text-body-sm">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: macro.cor }} />
              <span className="flex-1 text-ink">{macro.nome}</span>
              <span className="whitespace-nowrap text-ink-secondary tabular-nums">{formatarNumero(plano[macro.chave])} g</span>
              <span className="w-10 text-right font-semibold text-ink tabular-nums">
                {Math.round(partes[macro.chave] * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PortalCard>
  )
}
