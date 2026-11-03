import { api } from './api'

/*
 * Sequência (streak) de dias do paciente.
 *
 * O BACKEND AINDA NÃO EXISTE. Contrato esperado (para a issue do backend):
 *
 *   GET /portal-paciente/sequencia  (PatientAuthGuard, sessão por cookie)
 *   200 → Streak
 *
 * Regras, todas no backend (o front não calcula sequência):
 * - "hoje_pendente" NÃO quebra a sequência: hoje ainda pode ser cumprido.
 * - "sem_plano" NÃO quebra e NÃO soma.
 * - O limiar de "cumprido" (sugestão: 80% dos alimentos do dia marcados) é UMA
 *   constante no backend, fácil de mudar.
 * - ultimos7 vem do mais antigo ao mais recente; o último item é hoje.
 * - Datas são strings "AAAA-MM-DD" no fuso do paciente (America/Sao_Paulo).
 *
 * Mock: só em desenvolvimento e só com VITE_STREAK_MOCK=true (padrão: desligado).
 */

export type StreakStatus = 'cumprido' | 'nao_cumprido' | 'sem_plano' | 'hoje_pendente'

export type StreakDia = {
  data: string // "AAAA-MM-DD"
  status: StreakStatus
}

export type Streak = { atual: number; melhor: number; ultimos7: StreakDia[] }

export const STREAK_PATH = '/portal-paciente/sequencia'

const usarMock = import.meta.env.DEV && import.meta.env.VITE_STREAK_MOCK === 'true'

export function getStreak(): Promise<Streak> {
  return usarMock ? Promise.resolve(streakMock()) : api.get<Streak>(STREAK_PATH)
}

// NUNCA new Date("AAAA-MM-DD"): o JS lê como UTC e no Brasil vira o dia anterior
export function dataLocal(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

function isoLocal(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

function streakMock(): Streak {
  const status: StreakStatus[] = [
    'cumprido',
    'nao_cumprido',
    'sem_plano',
    'cumprido',
    'cumprido',
    'cumprido',
    'hoje_pendente',
  ]
  const hoje = new Date()
  const ultimos7 = status.map((valor, indice) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (6 - indice))
    return { data: isoLocal(data), status: valor }
  })
  return { atual: 3, melhor: 5, ultimos7 }
}
