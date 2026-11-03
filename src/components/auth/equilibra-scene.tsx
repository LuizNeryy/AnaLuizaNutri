import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/utils'
import { BalanceScale, BEAM_HALF, VIEW_WIDTH as BALANCE_VIEW_WIDTH } from './balance-scale'
import { FloatingFoods } from './floating-foods'
import {
  Handwriting,
  TEXT_WIDTH,
  VIEW_WIDTH as HANDWRITING_VIEW_WIDTH,
} from './handwriting'
import { TIMELINE } from './timeline'

// A palavra mede 1.4x a travessa da balança
const WORD_TO_BEAM = 1.4

function sizes(balanceWidth: number) {
  const beamWidth = (BEAM_HALF * 2 * balanceWidth) / BALANCE_VIEW_WIDTH
  const wordWidth = (beamWidth * WORD_TO_BEAM * HANDWRITING_VIEW_WIDTH) / TEXT_WIDTH
  return { balanceWidth, wordWidth: Math.round(wordWidth) }
}

const SIZE = sizes(288)

interface EquilibraSceneProps {
  className?: string
}

// Painel animado do desktop (no mobile o AuthLayout não renderiza a cena)
export function EquilibraScene({ className }: EquilibraSceneProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative isolate overflow-hidden bg-linear-[165deg] from-equilibra-mint to-equilibra-sand',
        className,
      )}
    >
      <FloatingFoods />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-10">
        <BalanceScale breathe className="shrink-0" style={{ width: SIZE.balanceWidth }} />

        <div className="flex w-full max-w-md min-w-0 flex-col items-center">
          <Handwriting width={SIZE.wordWidth} />

          <motion.p
            className="mt-3 text-center text-body text-ink-secondary"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: TIMELINE.tagline, duration: TIMELINE.taglineDuration }}
          >
            Seu plano alimentar, do jeito que cabe na sua rotina.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
