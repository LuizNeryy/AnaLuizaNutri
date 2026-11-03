import { motion, useReducedMotion } from 'motion/react'
import { FAIXAS_IMC, REGUA_IMC, faixaDoImc, posicaoNaRegua } from '../../../lib/imc'
import { EASE_PAINEL } from '../painel/formato'

const LIMITES = [18.5, 25, 30]

// Barra das quatro faixas da OMS com um marcador no IMC atual. Decorativa: o número e a
// faixa já estão escritos ao lado.
export function ReguaImc({ imc }: { imc: number }) {
  const reduceMotion = useReducedMotion()
  const ativa = faixaDoImc(imc)
  const posicao = `${posicaoNaRegua(imc) * 100}%`

  return (
    <div aria-hidden="true" className="pt-3">
      <div className="relative">
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {FAIXAS_IMC.map((faixa) => {
            const inicio = Math.max(faixa.min, REGUA_IMC.min)
            const fim = Math.min(faixa.max, REGUA_IMC.max)
            return (
              <div
                key={faixa.nome}
                style={{
                  flexGrow: fim - inicio,
                  background: faixa === ativa ? faixa.corForte : faixa.cor,
                }}
              />
            )
          })}
        </div>

        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface shadow-sm"
          style={{ background: ativa.corForte }}
          initial={reduceMotion ? false : { left: '0%' }}
          animate={{ left: posicao }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: EASE_PAINEL }}
        />
      </div>

      <div className="relative mt-2 h-4 text-caption text-ink-muted">
        {LIMITES.map((limite) => (
          <span
            key={limite}
            className="absolute -translate-x-1/2 tabular-nums"
            style={{ left: `${posicaoNaRegua(limite) * 100}%` }}
          >
            {limite.toLocaleString('pt-BR')}
          </span>
        ))}
      </div>
    </div>
  )
}
