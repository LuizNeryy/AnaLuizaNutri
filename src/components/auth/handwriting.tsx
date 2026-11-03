import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { TIMELINE } from './timeline'

const WORD = 'Equilibre-se'
const FONT_FAMILY = '"Kaushan Script"'
const FONT_SIZE = 100

export const VIEW_WIDTH = 520
const VIEW_HEIGHT = 184
const BASELINE = 116
// Largura da palavra em Kaushan Script a 100px (medida no navegador). Usada para
// dimensionar o SVG em relação à travessa; a máscara usa a medida real em runtime.
export const TEXT_WIDTH = 484
const MEASURED_BOX = { x: 18, y: 8, width: TEXT_WIDTH, height: 146 }

const SKEW_DEG = 18
const SKEW = Math.tan((SKEW_DEG * Math.PI) / 180)
const REVEAL_EASE = [0.65, 0, 0.35, 1] as const
const UNDERLINE_STROKE_PX = 4

// Momento (fração da duração) em que a revelação chega a 85% do caminho
const UNDERLINE_START = (() => {
  const ease = cubicBezier(...REVEAL_EASE)
  let low = 0
  let high = 1
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2
    if (ease(mid) < 0.85) low = mid
    else high = mid
  }
  return high
})()

type Box = typeof MEASURED_BOX

function maskGeometry(box: Box) {
  // Deslocamento horizontal máximo que o skew causa no topo/base do retângulo
  const skewReach = SKEW * (box.height / 2 + 10)
  const left = box.x - skewReach - 4
  // 120% da palavra, ou mais se for preciso para a borda suave (85–100%) passar do fim do texto
  const width = Math.max(1.2 * box.width, (box.width + 2 * skewReach + 8) / 0.85)
  return { left, width, centerY: box.y + box.height / 2 }
}

function underlinePath(box: Box) {
  const x0 = box.x + box.width * 0.1
  const x1 = box.x + box.width * 0.9
  const bottom = box.y + box.height
  // Sobe levemente da esquerda para a direita
  return `M${x0} ${bottom + 14} C${x0 + box.width * 0.3} ${bottom + 15} ${x1 - box.width * 0.3} ${bottom + 9} ${x1} ${bottom + 3}`
}

async function waitForFont() {
  try {
    await document.fonts.load(`${FONT_SIZE}px ${FONT_FAMILY}`, WORD)
    await document.fonts.ready
  } catch {
    // Sem a fonte (offline), revela com o fallback em vez de não mostrar nada
  }
}

interface HandwritingProps {
  // Largura renderizada do SVG, em px
  width: number
  className?: string
}

export function Handwriting({ width, className }: HandwritingProps) {
  const reduceMotion = useReducedMotion()
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const textRef = useRef<SVGTextElement>(null)
  const [box, setBox] = useState<Box>(MEASURED_BOX)
  const mask = maskGeometry(box)

  const revealX = useMotionValue(-mask.width)
  const underline = useMotionValue(0)
  const underlineOpacity = useTransform(underline, (value) => (value > 0 ? 1 : 0))

  useEffect(() => {
    const mountedAt = performance.now()
    let cancelled = false
    const running: AnimationPlaybackControls[] = []

    // A revelação só começa com a fonte carregada: assim a máscara nunca mostra o fallback
    waitForFont().then(() => {
      if (cancelled || !textRef.current) return
      const measured = textRef.current.getBBox()
      const nextBox = { x: measured.x, y: measured.y, width: measured.width, height: measured.height }
      setBox(nextBox)

      if (reduceMotion) {
        revealX.jump(0)
        underline.jump(1)
        return
      }

      const delay = Math.max(0, TIMELINE.handwriting - (performance.now() - mountedAt) / 1000)
      revealX.jump(-maskGeometry(nextBox).width)
      running.push(
        animate(revealX, 0, { duration: TIMELINE.revealDuration, ease: REVEAL_EASE, delay }),
        animate(underline, 1, {
          duration: TIMELINE.underlineDuration,
          ease: 'easeOut',
          delay: delay + UNDERLINE_START * TIMELINE.revealDuration,
        }),
      )
    })

    return () => {
      cancelled = true
      running.forEach((controls) => controls.stop())
    }
  }, [reduceMotion, revealX, underline])

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      width={width}
      aria-hidden="true"
      focusable="false"
      className={cn('h-auto max-w-full overflow-visible', className)}
    >
      <defs>
        <linearGradient id={`${id}-ink`} x1="0" x2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-ink)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-primary)' }} />
        </linearGradient>
        <linearGradient id={`${id}-feather`} x1="0" x2="1">
          <stop offset="85%" stopColor="white" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask
          id={`${id}-reveal`}
          maskUnits="userSpaceOnUse"
          x={-VIEW_WIDTH}
          y={-VIEW_HEIGHT}
          width={VIEW_WIDTH * 3}
          height={VIEW_HEIGHT * 3}
        >
          {/* Frente da revelação inclinada como a caligrafia: tinta correndo, não cortina */}
          <g transform={`translate(${SKEW * mask.centerY} 0) skewX(${-SKEW_DEG})`}>
            <motion.g style={{ x: revealX }}>
              <rect
                x={mask.left}
                y={box.y - 10}
                width={mask.width}
                height={box.height + 20}
                fill={`url(#${id}-feather)`}
              />
            </motion.g>
          </g>
        </mask>
      </defs>

      <text
        ref={textRef}
        x={VIEW_WIDTH / 2}
        y={BASELINE}
        textAnchor="middle"
        fontFamily={`${FONT_FAMILY}, cursive`}
        fontSize={FONT_SIZE}
        fill={`url(#${id}-ink)`}
        mask={`url(#${id}-reveal)`}
      >
        {WORD}
      </text>

      <motion.path
        d={underlinePath(box)}
        fill="none"
        strokeWidth={(UNDERLINE_STROKE_PX * VIEW_WIDTH) / width}
        strokeLinecap="round"
        className="stroke-primary"
        style={{ pathLength: underline, opacity: underlineOpacity }}
      />
    </svg>
  )
}
