type ItemDoDia = { consumido: boolean; kcal?: number | null }
type RefeicaoDoDia = { id: string; nome: string; horario: string; itens: ItemDoDia[] }

export type ProgressoDoDia = {
  // "kcal" só quando TODOS os itens do dia têm kcal; senão o dia inteiro usa "refeicoes",
  // para não misturar parcial com total num número enganoso.
  modo: 'kcal' | 'refeicoes'
  feito: number
  total: number
  refeicoesConcluidas: number
  refeicoesComAlimentos: number
}

function refeicaoConcluida(refeicao: RefeicaoDoDia) {
  return refeicao.itens.length > 0 && refeicao.itens.every((item) => item.consumido)
}

// null = sem plano ou nada a medir (estado vazio do card)
export function calcularProgresso(refeicoes: RefeicaoDoDia[] | null): ProgressoDoDia | null {
  if (!refeicoes) return null

  const comAlimentos = refeicoes.filter((refeicao) => refeicao.itens.length > 0)
  const refeicoesConcluidas = comAlimentos.filter(refeicaoConcluida).length
  const itens = comAlimentos.flatMap((refeicao) => refeicao.itens)
  const todosComKcal =
    itens.length > 0 && itens.every((item) => typeof item.kcal === 'number' && item.kcal >= 0)

  if (todosComKcal) {
    const total = itens.reduce((soma, item) => soma + (item.kcal ?? 0), 0)
    const feito = itens.reduce((soma, item) => soma + (item.consumido ? (item.kcal ?? 0) : 0), 0)
    if (total <= 0) return null
    return {
      modo: 'kcal',
      feito,
      total,
      refeicoesConcluidas,
      refeicoesComAlimentos: comAlimentos.length,
    }
  }

  if (comAlimentos.length === 0) return null
  return {
    modo: 'refeicoes',
    feito: refeicoesConcluidas,
    total: comAlimentos.length,
    refeicoesConcluidas,
    refeicoesComAlimentos: comAlimentos.length,
  }
}

export type ProximaRefeicao =
  | { tipo: 'proxima'; refeicao: { id: string; nome: string; horario: string } }
  | { tipo: 'concluidas' }
  | { tipo: 'pendentes'; quantidade: number }

function horaMinuto(horario: string) {
  const [hora = '0', minuto = '0'] = horario.split(':')
  return Number(hora) * 60 + Number(minuto)
}

// Primeira refeição com horário >= agora (hora local do aparelho)
export function calcularProximaRefeicao(refeicoes: RefeicaoDoDia[], agora: Date): ProximaRefeicao {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes()
  const proxima = refeicoes.find((refeicao) => horaMinuto(refeicao.horario) >= minutosAgora)
  if (proxima) {
    return { tipo: 'proxima', refeicao: proxima }
  }

  const pendentes = refeicoes.filter(
    (refeicao) => refeicao.itens.length > 0 && !refeicaoConcluida(refeicao),
  ).length
  return pendentes === 0 ? { tipo: 'concluidas' } : { tipo: 'pendentes', quantidade: pendentes }
}

export function textoProximaRefeicao(info: ProximaRefeicao): string {
  if (info.tipo === 'proxima') return `${info.refeicao.nome} às ${info.refeicao.horario}`
  if (info.tipo === 'concluidas') return 'Todas as refeições de hoje concluídas'
  return info.quantidade === 1
    ? '1 refeição sem registro hoje'
    : `${info.quantidade} refeições sem registro hoje`
}
