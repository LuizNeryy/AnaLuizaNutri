import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, type ReactNode } from 'react'

type Tone = 'green' | 'amber'

interface Food {
  shape: ReactNode
  tone: Tone
  size: number
  // Lado do painel e distância extra (px) a partir da borda da zona livre
  side: 'left' | 'right'
  offset: number
  top: string
  opacity: number
  // Flutuação: amplitude (px / graus), duração e atraso próprios de cada forma.
  // Durações escolhidas para não serem múltiplas entre si e os ciclos não sincronizarem.
  float: { y: number; rotate: number; duration: number; delay: number }
  depth: number
}

const MAX_FLOAT = 14
const MAX_PARALLAX = 10
const PARALLAX_SPRING = { stiffness: 50, damping: 20 }

// Zona livre ao redor da balança, da palavra e do caminho das quedas: metade da coluna
// central (balança de 288px) + 40px de folga + o máximo que uma forma anda flutuando.
const CLEAR_HALF = 144 + 40 + MAX_FLOAT + MAX_PARALLAX

function circle(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`
}

// Silhuetas sólidas em viewBox 24x24. Nenhuma repete os alimentos que caem nos pratos.
const LEAF = <path d="M4.5 19.5C4.5 10.5 10.5 4 20 4C20 13.5 13.5 19.5 4.5 19.5Z" />
const WHEAT = (
  <path d="M11.3 8H12.7V22H11.3ZM12 2C13.4 3.2 13.4 5.4 12 6.6C10.6 5.4 10.6 3.2 12 2ZM11.6 10.2C9.4 10.4 8 8.9 8 7C10.1 6.9 11.6 8.3 11.6 10.2ZM12.4 10.2C14.6 10.4 16 8.9 16 7C13.9 6.9 12.4 8.3 12.4 10.2ZM11.6 14.4C9.4 14.6 8 13.1 8 11.2C10.1 11.1 11.6 12.5 11.6 14.4ZM12.4 14.4C14.6 14.6 16 13.1 16 11.2C13.9 11.1 12.4 12.5 12.4 14.4Z" />
)
const TOMATO = (
  <path d="M12 6.2C16.6 6.2 20 9.4 20 13.6C20 17.9 16.6 21 12 21C7.4 21 4 17.9 4 13.6C4 9.4 7.4 6.2 12 6.2ZM12 3L13.3 5.9L16.4 5.4L14.4 7.9H9.6L7.6 5.4L10.7 5.9Z" />
)
const PEAR = (
  <path d="M12 6C10.5 6 9.8 7.4 9.6 9C9.3 11 6 12.5 6 16.2C6 19.5 8.7 21.5 12 21.5C15.3 21.5 18 19.5 18 16.2C18 12.5 14.7 11 14.4 9C14.2 7.4 13.5 6 12 6ZM11.5 6.4V2.8H12.7V6.4Z" />
)
const LEMON = (
  <path d="M2.5 12C3.5 7.5 7.5 5 12 5C16.5 5 20.5 7.5 21.5 12C20.5 16.5 16.5 19 12 19C7.5 19 3.5 16.5 2.5 12Z" />
)
const GRAPES = (
  <path
    d={[
      'M11.4 1.5H12.6V5.5H11.4Z',
      circle(7, 8, 2.7),
      circle(12, 8, 2.7),
      circle(17, 8, 2.7),
      circle(9.5, 12.6, 2.7),
      circle(14.5, 12.6, 2.7),
      circle(12, 17.2, 2.7),
    ].join('')}
  />
)

const FOODS: Food[] = [
  { shape: LEAF, tone: 'green', size: 64, side: 'left', offset: 24, top: '8%', opacity: 0.16, depth: 1, float: { y: 12, rotate: 5, duration: 7.3, delay: 0 } },
  { shape: PEAR, tone: 'amber', size: 44, side: 'right', offset: 36, top: '14%', opacity: 0.14, depth: 0.6, float: { y: -10, rotate: -4, duration: 9.1, delay: 0.7 } },
  { shape: GRAPES, tone: 'green', size: 52, side: 'right', offset: 8, top: '44%', opacity: 0.12, depth: 0.85, float: { y: 14, rotate: -6, duration: 10.7, delay: 1.9 } },
  { shape: LEMON, tone: 'amber', size: 36, side: 'left', offset: 4, top: '50%', opacity: 0.17, depth: 0.5, float: { y: -13, rotate: 6, duration: 6.4, delay: 1.1 } },
  { shape: LEAF, tone: 'green', size: 72, side: 'right', offset: 0, top: '78%', opacity: 0.1, depth: 1, float: { y: 9, rotate: 3, duration: 8.3, delay: 2.6 } },
  { shape: WHEAT, tone: 'amber', size: 40, side: 'left', offset: 40, top: '82%', opacity: 0.15, depth: 0.7, float: { y: -11, rotate: -5, duration: 9.8, delay: 0.3 } },
  { shape: TOMATO, tone: 'amber', size: 30, side: 'left', offset: 70, top: '30%', opacity: 0.13, depth: 0.4, float: { y: 8, rotate: 6, duration: 6.9, delay: 3.2 } },
]

export function FloatingFoods() {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, PARALLAX_SPRING)
  const smoothY = useSpring(pointerY, PARALLAX_SPRING)

  useEffect(() => {
    if (reduceMotion) return
    // Parallax só com mouse: em telas touch não há ponteiro "pairando"
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    function handlePointerMove(event: PointerEvent) {
      // -1..1 a partir do centro da janela
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1)
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [reduceMotion, pointerX, pointerY])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FOODS.map((food, index) => (
        <FoodShape
          key={index}
          food={food}
          pointerX={smoothX}
          pointerY={smoothY}
          animated={!reduceMotion}
        />
      ))}
    </div>
  )
}

function FoodShape({
  food,
  pointerX,
  pointerY,
  animated,
}: {
  food: Food
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  animated: boolean
}) {
  const x = useTransform(pointerX, (value) => value * MAX_PARALLAX * food.depth)
  const y = useTransform(pointerY, (value) => value * MAX_PARALLAX * food.depth)
  const { float } = food
  // Ancorado no centro do painel, sempre fora da zona livre
  const distance = `calc(50% + ${CLEAR_HALF + food.offset}px)`

  return (
    <motion.div
      className="absolute"
      style={{
        top: food.top,
        [food.side === 'left' ? 'right' : 'left']: distance,
        opacity: food.opacity,
        x,
        y,
      }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width={food.size}
        height={food.size}
        className={food.tone === 'amber' ? 'fill-equilibra-amber' : 'fill-equilibra-green'}
        initial={animated ? { y: -float.y, rotate: -float.rotate } : false}
        animate={animated ? { y: float.y, rotate: float.rotate } : undefined}
        transition={{
          duration: float.duration,
          delay: float.delay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        {food.shape}
      </motion.svg>
    </motion.div>
  )
}
