import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

const EASE = [0.32, 0.85, 0.35, 1] as const
const MOUNT_DURATION = 1.1
const UPDATE_DURATION = 0.6
const REVERT_WINDOW_MS = 1500

interface ProgressRingProps {
  size: number
  strokeWidth: number
  // Fração concluída (0..1); valores acima de 1 são limitados a 100%
  value: number
  // Total em unidades (kcal ou refeições): o número central é round(progresso * total)
  total: number
  unitLabel?: string
  ariaLabel: string
  // Muda ao trocar de dia: cruzar 100% por troca de dia não dá pulso
  contextKey: string
  valueClassName?: string
  className?: string
}

export function ProgressRing({
  size,
  strokeWidth,
  value,
  total,
  unitLabel,
  ariaLabel,
  contextKey,
  valueClassName,
  className,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion()
  const target = Math.min(1, Math.max(0, value))

  // Fonte única do arco E do número: os dois nunca divergem
  const progress = useMotionValue(reduceMotion ? target : 0)
  const totalValue = useMotionValue(total)
  const scale = useMotionValue(1)
  const label = useTransform([progress, totalValue], ([p, t]: number[]) =>
    Math.round(p * t).toLocaleString('pt-BR'),
  )
  // Com linecap round, pathLength 0 ainda desenha um ponto: esconde o arco em 0%
  const arcOpacity = useTransform(progress, (p) => (p > 0.0005 ? 1 : 0))

  // O anel só é montado com os dados prontos; o efeito que roda logo em seguida é a
  // animação de montagem (inclusive a segunda execução do StrictMode em dev).
  const [mountedAt] = useState(() => performance.now())
  const previous = useRef<{ value: number; contextKey: string } | null>(null)
  const dropBelowFullAt = useRef(Number.NEGATIVE_INFINITY)
  const latestLabel = useRef(ariaLabel)
  useEffect(() => {
    latestLabel.current = ariaLabel
  }, [ariaLabel])
  // Anunciado só quando a animação termina, nunca a cada quadro
  const [announced, setAnnounced] = useState('')

  useMotionValueEvent(progress, 'animationComplete', () => setAnnounced(latestLabel.current))

  useEffect(() => {
    totalValue.set(total)
    const before = previous.current
    previous.current = { value: target, contextKey }

    if (reduceMotion) {
      progress.jump(target)
      return
    }

    const agora = performance.now()
    const isMount = agora - mountedAt < 100
    if (before && before.value >= 1 && target < 1) dropBelowFullAt.current = agora
    // Volta a 100% logo depois de cair é um check revertido (falha na API), não uma conquista
    const reverted = agora - dropBelowFullAt.current < REVERT_WINDOW_MS
    // Pulso só quando o próprio paciente cruza 100% (mesmo dia, depois da montagem)
    const crossedByUser =
      !isMount &&
      !reverted &&
      before !== null &&
      before.contextKey === contextKey &&
      before.value < 1 &&
      target >= 1

    // Nova chamada cancela a anterior e parte do valor atual: cliques rápidos não enfileiram
    const controls = animate(progress, target, {
      duration: isMount ? MOUNT_DURATION : UPDATE_DURATION,
      ease: EASE,
    })
    if (crossedByUser) {
      animate(scale, [1, 1.04, 1], { duration: 0.4, ease: 'easeInOut' })
    }

    return () => controls.stop()
  }, [target, total, contextKey, reduceMotion, progress, totalValue, scale, mountedAt])

  const radius = (size - strokeWidth) / 2
  const center = size / 2

  return (
    <div className={cn('relative inline-flex shrink-0', className)} style={{ width: size, height: size }}>
      <motion.div role="img" aria-label={ariaLabel} className="absolute inset-0" style={{ scale }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-surface-sunken"
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-primary"
            style={{ pathLength: progress, opacity: arcOpacity }}
          />
        </svg>

        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <motion.span className={cn('font-bold leading-none text-ink tabular-nums', valueClassName)}>
            {label}
          </motion.span>
          {unitLabel && <span className="mt-1 text-body-sm text-ink-secondary">{unitLabel}</span>}
        </div>
      </motion.div>

      <span className="sr-only" aria-live="polite">
        {reduceMotion ? ariaLabel : announced}
      </span>
    </div>
  )
}
