import { Flame } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { dataLocal, type Streak, type StreakDia, type StreakStatus } from '../../lib/streak'
import { mensagemDaSequencia } from '../../lib/textosDoPainel'
import { PortalCard } from './PortalCard'

const STATUS_TEXTO: Record<StreakStatus, string> = {
  cumprido: 'cumprido',
  nao_cumprido: 'não cumprido',
  sem_plano: 'sem plano',
  hoje_pendente: 'pendente',
}

export function SequenciaCard({ streak }: { streak: Streak }) {
  const mensagem = mensagemDaSequencia(streak)

  return (
    <PortalCard>
      <div className="flex items-center gap-2 text-ink-secondary">
        <Flame size={18} strokeWidth={1.75} aria-hidden="true" />
        <h2 className="text-label">Sequência</h2>
      </div>

      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-display text-ink tabular-nums">{streak.atual}</span>
        <span className="text-body text-ink-secondary">
          {streak.atual === 1 ? 'dia seguido' : 'dias seguidos'}
        </span>
      </p>
      {mensagem && <p className="mt-1 text-body-sm text-ink-secondary">{mensagem}</p>}

      <ul className="mt-4 flex justify-between" aria-label="Últimos 7 dias">
        {streak.ultimos7.map((dia, indice) => (
          <Marcador key={dia.data} dia={dia} indice={indice} />
        ))}
      </ul>

      <p className="mt-4 text-caption text-ink-muted">
        Melhor sequência: {streak.melhor} {streak.melhor === 1 ? 'dia' : 'dias'}
      </p>
    </PortalCard>
  )
}

function Marcador({ dia, indice }: { dia: StreakDia; indice: number }) {
  const reduceMotion = useReducedMotion()
  const data = dataLocal(dia.data)
  const nomeDoDia = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(data)
  const inicial = nomeDoDia.charAt(0).toUpperCase()

  // Hoje virou "cumprido" durante a sessão: o círculo preenche e o check se desenha.
  // Ajuste de estado durante o render (padrão do React para reagir a mudança de prop).
  const [statusAnterior, setStatusAnterior] = useState(dia.status)
  const [acabouDeCumprir, setAcabouDeCumprir] = useState(false)
  if (statusAnterior !== dia.status) {
    setAcabouDeCumprir(statusAnterior === 'hoje_pendente' && dia.status === 'cumprido')
    setStatusAnterior(dia.status)
  }
  const animarPreenchimento = acabouDeCumprir && !reduceMotion

  return (
    <motion.li
      className="flex flex-col items-center gap-1.5"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: indice * 0.04 }}
    >
      <span className="sr-only">
        {nomeDoDia}, {STATUS_TEXTO[dia.status]}
      </span>

      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center">
        {dia.status === 'cumprido' && (
          <motion.span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary"
            initial={animarPreenchimento ? { scale: 0.6, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <motion.path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animarPreenchimento ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              />
            </svg>
          </motion.span>
        )}
        {dia.status === 'hoje_pendente' && (
          <span className="h-8 w-8 rounded-full border-2 border-primary" />
        )}
        {dia.status === 'nao_cumprido' && (
          <span className="h-8 w-8 rounded-full border-2 border-border" />
        )}
        {dia.status === 'sem_plano' && <span className="text-h3 text-ink-muted">–</span>}
      </span>

      <span aria-hidden="true" className="text-caption text-ink-muted">
        {inicial}
      </span>
    </motion.li>
  )
}
