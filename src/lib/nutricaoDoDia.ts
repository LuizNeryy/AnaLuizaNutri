// Totais de kcal e macronutrientes do dia, a partir dos itens do plano que a API devolve
// (GET /portal-paciente/plano). Itens sem peso em gramas vêm com nutrientes null e ficam
// fora das somas: o painel avisa quantos são, em vez de inventar um valor.

export type Macro = 'proteina' | 'carboidrato' | 'gordura'

export const MACROS: { chave: Macro; nome: string; cor: string; kcalPorGrama: number }[] = [
  { chave: 'proteina', nome: 'Proteína', cor: 'var(--color-macro-proteina)', kcalPorGrama: 4 },
  { chave: 'carboidrato', nome: 'Carboidrato', cor: 'var(--color-macro-carboidrato)', kcalPorGrama: 4 },
  { chave: 'gordura', nome: 'Gordura', cor: 'var(--color-macro-gordura)', kcalPorGrama: 9 },
]

type ItemComNutrientes = {
  consumido: boolean
  kcal?: number | null
  proteina?: number | null
  carboidrato?: number | null
  gordura?: number | null
}

type RefeicaoComNutrientes = {
  id: string
  nome: string
  horario: string
  itens: ItemComNutrientes[]
}

export type Totais = { kcal: number } & Record<Macro, number>

export type RefeicaoNoPainel = {
  id: string
  nome: string
  horario: string
  kcalPlano: number
  kcalConsumida: number
}

export type NutricaoDoDia = {
  plano: Totais
  consumido: Totais
  refeicoes: RefeicaoNoPainel[]
  // Itens sem peso conhecido (ex.: "2 fatias"), fora das somas
  itensSemPeso: number
}

const zerado = (): Totais => ({ kcal: 0, proteina: 0, carboidrato: 0, gordura: 0 })

function somar(totais: Totais, item: ItemComNutrientes) {
  totais.kcal += item.kcal ?? 0
  for (const { chave } of MACROS) totais[chave] += item[chave] ?? 0
}

// null = sem plano ou nenhum item com peso (nada a mostrar em números)
export function calcularNutricao(refeicoes: RefeicaoComNutrientes[] | null): NutricaoDoDia | null {
  if (!refeicoes) return null

  const plano = zerado()
  const consumido = zerado()
  let itensSemPeso = 0

  const porRefeicao = refeicoes.map((refeicao) => {
    let kcalPlano = 0
    let kcalConsumida = 0
    for (const item of refeicao.itens) {
      if (typeof item.kcal !== 'number') {
        itensSemPeso += 1
        continue
      }
      somar(plano, item)
      kcalPlano += item.kcal
      if (item.consumido) {
        somar(consumido, item)
        kcalConsumida += item.kcal
      }
    }
    return { id: refeicao.id, nome: refeicao.nome, horario: refeicao.horario, kcalPlano, kcalConsumida }
  })

  if (plano.kcal <= 0) return null
  return { plano, consumido, refeicoes: porRefeicao, itensSemPeso }
}

// Parte das kcal do plano que vem de cada macro (4/4/9 kcal por grama), somando 100%
export function distribuicaoDasKcal(totais: Totais): Record<Macro, number> {
  const kcal = MACROS.map((macro) => totais[macro.chave] * macro.kcalPorGrama)
  const soma = kcal.reduce((total, valor) => total + valor, 0)
  return Object.fromEntries(
    MACROS.map((macro, indice) => [macro.chave, soma > 0 ? kcal[indice] / soma : 0]),
  ) as Record<Macro, number>
}
