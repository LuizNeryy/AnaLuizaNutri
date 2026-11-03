import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { cn } from '../../../lib/utils'
import { EASE_PAINEL, formatarNumero } from './formato'

interface NumeroAnimadoProps {
  valor: number
  casas?: number
  atraso?: number
  className?: string
}

// Conta de onde estava até o novo valor; o leitor de tela recebe só o valor final
export function NumeroAnimado({ valor, casas = 0, atraso = 0, className }: NumeroAnimadoProps) {
  const reduceMotion = useReducedMotion()
  const atual = useMotionValue(reduceMotion ? valor : 0)
  const texto = useTransform(atual, (numero) => formatarNumero(numero, casas))

  useEffect(() => {
    if (reduceMotion) {
      atual.jump(valor)
      return
    }
    const controles = animate(atual, valor, { duration: 1, delay: atraso, ease: EASE_PAINEL })
    return () => controles.stop()
  }, [valor, atraso, reduceMotion, atual])

  return (
    <span className={cn('tabular-nums', className)}>
      <motion.span aria-hidden="true">{texto}</motion.span>
      <span className="sr-only">{formatarNumero(valor, casas)}</span>
    </span>
  )
}
