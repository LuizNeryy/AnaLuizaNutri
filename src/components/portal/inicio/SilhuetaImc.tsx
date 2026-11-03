import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useId } from 'react'
import {
  CABECA,
  SILHUETA_VIEWBOX,
  caminhosDaSilhueta,
  fatorDoImc,
  type SexoSilhueta,
} from '../../../lib/silhueta'
import { cn } from '../../../lib/utils'
import { EASE_PAINEL } from '../painel/formato'

// Sem medição: figura neutra (IMC 22) bem apagada
const IMC_NEUTRO = 22

interface SilhuetaImcProps {
  imc: number | null
  sexo: SexoSilhueta
  // Quem usa decide o texto; a figura em si é decorativa quando o texto já está ao lado
  rotulo?: string
  className?: string
}

// Sempre na cor da marca: a cor da faixa fica no selo e na régua, nunca no corpo
export function SilhuetaImc({ imc, sexo, rotulo, className }: SilhuetaImcProps) {
  const reduceMotion = useReducedMotion()
  const alvo = fatorDoImc(imc ?? IMC_NEUTRO)
  // Primeira montagem já sai do magro e "preenche" até o alvo
  const fator = useMotionValue(reduceMotion ? alvo : fatorDoImc(IMC_NEUTRO))
  const id = useId()
  // useId traz caracteres que quebram o url(#...) do fill
  const gradiente = `silhueta-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    if (reduceMotion) {
      fator.jump(alvo)
      return
    }
    const controles = animate(fator, alvo, { duration: 1.1, ease: EASE_PAINEL })
    return () => controles.stop()
  }, [alvo, reduceMotion, fator])

  const corpo = useTransform(fator, (f) => caminhosDaSilhueta(sexo, f).corpo)
  const bracoDireito = useTransform(fator, (f) => caminhosDaSilhueta(sexo, f).bracoDireito)
  const bracoEsquerdo = useTransform(fator, (f) => caminhosDaSilhueta(sexo, f).bracoEsquerdo)
  const cabeloTopo = useTransform(fator, (f) => caminhosDaSilhueta(sexo, f).cabeloTopo)
  const cabeloAtras = caminhosDaSilhueta(sexo, alvo).cabeloAtras

  const cabelo = 'color-mix(in srgb, var(--color-primary) 55%, black)'

  return (
    <svg
      viewBox={`0 0 ${SILHUETA_VIEWBOX.largura} ${SILHUETA_VIEWBOX.altura}`}
      className={cn('h-auto w-full', imc === null && 'opacity-35', className)}
      {...(rotulo ? { role: 'img', 'aria-label': rotulo } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={gradiente} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--color-primary) 78%, black)" />
        </linearGradient>
      </defs>

      <ellipse cx={CABECA.cx} cy={388} rx={62} ry={7} fill="var(--color-ink)" opacity={0.07} />

      {cabeloAtras && <path d={cabeloAtras} fill={cabelo} />}
      <motion.path d={bracoDireito} fill={`url(#${gradiente})`} opacity={0.82} />
      <motion.path d={bracoEsquerdo} fill={`url(#${gradiente})`} opacity={0.82} />
      <motion.path d={corpo} fill={`url(#${gradiente})`} />
      <circle cx={CABECA.cx} cy={CABECA.cy} r={CABECA.r} fill="var(--color-primary)" />
      <motion.path d={cabeloTopo} fill={cabelo} />
    </svg>
  )
}
