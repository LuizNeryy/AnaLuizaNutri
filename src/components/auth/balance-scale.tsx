import {
  animate,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { TIMELINE } from './timeline'

export const VIEW_WIDTH = 240
const VIEW_HEIGHT = 200
// Ponto onde a travessa toca a haste (coordenadas do viewBox)
const PIVOT_X = 120
const PIVOT_Y = 52
export const BEAM_HALF = 84

// Coordenadas locais do prato: origem no ponto de suspensão, eixo y para baixo
const DISH_Y = 58
const DISH_HALF = 26
const DROP_HEIGHT = 220
const FALL_EASE = [0.55, 0, 1, 0.45] as const
const IMPULSE = 40
const MAX_TILT = 12

const BEAM_SPRING = { type: 'spring', stiffness: 60, damping: 8 } as const
const PAN_SPRING = { stiffness: 35, damping: 9 }
const SQUASH_SPRING = { type: 'spring', stiffness: 500, damping: 14 } as const

// Grupos aninhados (pratos, alimentos) não podem usar view-box: o navegador resolve a
// origem a partir do viewport do SVG, ignorando o translate do grupo pai. Eles usam
// fill-box com uma caixa invisível simétrica em torno do ponto de giro (BOUNDS), o que
// põe o centro do bounding box exatamente nesse ponto.
const CENTER_ORIGIN = { transformBox: 'fill-box', transformOrigin: '50% 50%' } as const
const BOUNDS_HALF = 300

function Bounds() {
  return (
    <rect
      x={-BOUNDS_HALF}
      y={-BOUNDS_HALF}
      width={BOUNDS_HALF * 2}
      height={BOUNDS_HALF * 2}
      fill="none"
    />
  )
}

type Side = 'left' | 'right'

interface FallingFood {
  side: Side
  weight: number
  // Base do alimento dentro do prato (x local) e tamanho em unidades do viewBox
  x: number
  size: number
  spin: number
  color: string
  shape: ReactNode
}

// Ordem das quedas; silhuetas em viewBox 24x24
const FALLING_FOODS: FallingFood[] = [
  {
    side: 'left',
    weight: 1,
    x: -7,
    size: 20,
    spin: 14,
    color: '#C8553D',
    shape: (
      <path d="M12 7.2C10 5.6 6.2 5.6 4.9 9C3.6 12.5 5.6 18.6 8.6 20.1C10 20.8 11 20.2 12 20.2C13 20.2 14 20.8 15.4 20.1C18.4 18.6 20.4 12.5 19.1 9C17.8 5.6 14 5.6 12 7.2ZM12.6 6C13 3.8 15 2.6 17.4 3C17 5.2 15.1 6.3 12.6 6Z" />
    ),
  },
  {
    side: 'right',
    weight: 1.4,
    x: -7,
    size: 23,
    spin: -18,
    color: '#6E8B3D',
    shape: (
      <path
        fillRule="evenodd"
        d="M12 2.5C9.4 2.5 8.4 5 7.9 8C7.4 10.6 5 12.6 5 16.1C5 19.6 8 21.5 12 21.5C16 21.5 19 19.6 19 16.1C19 12.6 16.6 10.6 16.1 8C15.6 5 14.6 2.5 12 2.5ZM12 13A3 3 0 1 0 12 19A3 3 0 1 0 12 13Z"
      />
    ),
  },
  {
    side: 'left',
    weight: 0.8,
    x: 7,
    size: 22,
    spin: 10,
    color: '#3F7A4A',
    shape: (
      <path d="M10 14.5H14L13.4 21.5H10.6ZM12 2.8A4.4 4.4 0 0 1 16.2 6.1A4 4 0 0 1 16.6 14H7.4A4 4 0 0 1 7.8 6.1A4.4 4.4 0 0 1 12 2.8Z" />
    ),
  },
  {
    side: 'right',
    weight: 0.4,
    x: 8,
    size: 20,
    spin: -20,
    color: '#D9822B',
    shape: (
      <path d="M3.5 20.5L13.3 8.6C14.8 7.1 17 9.2 15.4 10.7ZM15.3 8C14.8 5.5 15.9 3.5 18 3C18.3 5.1 17.4 7 15.3 8ZM16 8.7C18 7.5 20 7.6 21.5 8.6C20 10.1 17.9 10.2 16 8.7Z" />
    ),
  },
]

interface FoodMotion {
  y: MotionValue<number>
  rotate: MotionValue<number>
  opacity: MotionValue<number>
  scaleX: MotionValue<number>
  scaleY: MotionValue<number>
}

function tiltFor(left: number, right: number) {
  // Positivo = lado direito desce
  return Math.min(MAX_TILT, Math.max(-MAX_TILT, 10 * (right - left)))
}

interface BalanceScaleProps {
  // Respiração em loop depois do equilíbrio (desligada no mobile para poupar bateria)
  breathe?: boolean
  className?: string
  style?: CSSProperties
}

export function BalanceScale({ breathe = true, className, style }: BalanceScaleProps) {
  const reduceMotion = useReducedMotion()
  const angle = useMotionValue(0)
  // Os pratos aplicam a rotação inversa da travessa com uma mola mais lenta:
  // pendem na vertical pela "gravidade", mas chegam lá com atraso.
  const panRotate = useSpring(
    useTransform(angle, (value) => -value),
    PAN_SPRING,
  )
  const [foods] = useState<FoodMotion[]>(() =>
    FALLING_FOODS.map((food) => ({
      y: motionValue(reduceMotion ? 0 : -DROP_HEIGHT),
      rotate: motionValue(reduceMotion ? 0 : food.spin),
      opacity: motionValue(reduceMotion ? 1 : 0),
      scaleX: motionValue(1),
      scaleY: motionValue(1),
    })),
  )

  useEffect(() => {
    if (reduceMotion) {
      angle.jump(0)
      panRotate.jump(0)
      foods.forEach((food) => {
        food.y.jump(0)
        food.rotate.jump(0)
        food.opacity.jump(1)
      })
      return
    }

    let cancelled = false
    const running: AnimationPlaybackControls[] = []
    const track = (controls: AnimationPlaybackControls) => {
      running.push(controls)
      return controls
    }

    // Toda a sequência das quedas mora aqui; os horários vêm de TIMELINE.
    async function run() {
      const start = performance.now()
      const elapsed = () => (performance.now() - start) / 1000
      angle.jump(0)
      FALLING_FOODS.forEach((food, index) => {
        foods[index].y.jump(-DROP_HEIGHT)
        foods[index].rotate.jump(food.spin)
        foods[index].opacity.jump(0)
      })

      const weight = { left: 0, right: 0 }
      let settle: AnimationPlaybackControls | undefined

      for (const [index, food] of FALLING_FOODS.entries()) {
        const values = foods[index]
        const delay = Math.max(0, TIMELINE.drops[index] - elapsed())
        const fall = { duration: TIMELINE.fallDuration, ease: FALL_EASE, delay }

        track(animate(values.opacity, 1, { duration: 0.08, delay }))
        track(animate(values.rotate, 0, fall))
        await track(animate(values.y, 0, fall))
        if (cancelled) return

        // Pouso: squash curto e impulso na travessa para o lado que recebeu o peso
        values.scaleX.jump(1.1)
        values.scaleY.jump(0.85)
        track(animate(values.scaleX, 1, { ...SQUASH_SPRING, delay: 0.09 }))
        track(animate(values.scaleY, 1, { ...SQUASH_SPRING, delay: 0.09 }))

        weight[food.side] += food.weight
        settle = track(
          animate(angle, tiltFor(weight.left, weight.right), {
            ...BEAM_SPRING,
            velocity: food.side === 'right' ? IMPULSE : -IMPULSE,
          }),
        )
      }

      if (!breathe || !settle) return
      await settle
      if (cancelled) return
      // Equilibrada: a travessa "respira" ±0.6°, ciclo de 5s
      track(
        animate(angle, [0, 0.6, 0, -0.6, 0], {
          duration: 5,
          ease: 'easeInOut',
          repeat: Infinity,
        }),
      )
    }

    run()

    return () => {
      cancelled = true
      running.forEach((controls) => controls.stop())
    }
  }, [reduceMotion, breathe, angle, panRotate, foods])

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      aria-hidden="true"
      focusable="false"
      className={cn('h-auto overflow-visible', className)}
      style={style}
    >
      {/* Pilar: base + haste, estáticos */}
      <motion.g
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: TIMELINE.pillarDuration, delay: TIMELINE.pillar, ease: 'easeOut' }}
      >
        <path d="M84 192 H156 L144 176 H96 Z" className="fill-primary" />
        <rect x={PIVOT_X - 4} y={PIVOT_Y} width={8} height={128} rx={4} className="fill-primary" />
      </motion.g>

      <motion.g
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: TIMELINE.beamDuration, delay: TIMELINE.beam }}
      >
        {/* Travessa + ponteiro: giram em torno do pivô. Grupo de nível superior, então
            view-box + origem em coordenadas do viewBox cai exatamente no topo da haste. */}
        <motion.g
          style={{
            rotate: angle,
            transformBox: 'view-box',
            transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px`,
          }}
        >
          <path
            d={`M${PIVOT_X} ${PIVOT_Y - 26} L${PIVOT_X + 3.5} ${PIVOT_Y} H${PIVOT_X - 3.5} Z`}
            className="fill-ink"
          />
          <rect
            x={PIVOT_X - BEAM_HALF}
            y={PIVOT_Y - 3}
            width={BEAM_HALF * 2}
            height={6}
            rx={3}
            className="fill-primary"
          />

          {(['left', 'right'] as const).map((side) => (
            <g
              key={side}
              transform={`translate(${PIVOT_X + (side === 'left' ? -BEAM_HALF : BEAM_HALF)} ${PIVOT_Y})`}
            >
              <Plate rotate={panRotate}>
                {FALLING_FOODS.map((food, index) =>
                  food.side === side ? (
                    <FoodOnPlate key={index} food={food} values={foods[index]} />
                  ) : null,
                )}
              </Plate>
            </g>
          ))}
        </motion.g>

        {/* Eixo sobre o pivô (fica fora do grupo que gira) */}
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={6} className="fill-ink" />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={2.5} className="fill-surface" />
      </motion.g>
    </svg>
  )
}

function Plate({ rotate, children }: { rotate: MotionValue<number>; children: ReactNode }) {
  return (
    // Contra-rotação em torno do ponto de suspensão: fios, alimentos e prato pendem juntos
    <motion.g style={{ rotate, ...CENTER_ORIGIN }}>
      <Bounds />
      <path
        d={`M0 0 L${-DISH_HALF + 4} ${DISH_Y} M0 0 L${DISH_HALF - 4} ${DISH_Y}`}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        className="stroke-ink-secondary"
      />
      <circle r={3} className="fill-ink" />
      {/* Alimentos antes do prato: a borda cobre a base deles */}
      {children}
      <path
        d={`M${-DISH_HALF} ${DISH_Y} H${DISH_HALF} Q${DISH_HALF - 4} ${DISH_Y + 10} 0 ${DISH_Y + 10} Q${-DISH_HALF + 4} ${DISH_Y + 10} ${-DISH_HALF} ${DISH_Y} Z`}
        className="fill-primary"
      />
    </motion.g>
  )
}

function FoodOnPlate({ food, values }: { food: FallingFood; values: FoodMotion }) {
  const { size } = food

  return (
    // Origem na base do alimento, apoiada na superfície do prato
    <g transform={`translate(${food.x} ${DISH_Y + 2})`}>
      {/* Queda: gira em torno do centro do alimento */}
      <motion.g
        style={{ y: values.y, rotate: values.rotate, opacity: values.opacity, ...CENTER_ORIGIN }}
      >
        {/* Squash: escala a partir da base, onde o alimento toca o prato */}
        <motion.g
          style={{
            scaleX: values.scaleX,
            scaleY: values.scaleY,
            transformBox: 'fill-box',
            transformOrigin: '50% 100%',
          }}
        >
          <rect x={-size / 2} y={-size} width={size} height={size} fill="none" />
          <g
            transform={`translate(${-size / 2} ${-size}) scale(${size / 24})`}
            fill={food.color}
          >
            {food.shape}
          </g>
        </motion.g>
      </motion.g>
    </g>
  )
}
