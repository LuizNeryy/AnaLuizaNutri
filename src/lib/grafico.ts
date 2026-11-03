// Matemática dos gráficos de linha do portal (sem biblioteca): escalas, eixos e caminhos SVG.
import { diasEntre } from './medidas.ts'

export type PontoDeSerie = { data: string; valor: number }

// x proporcional ao tempo: duas medidas com um mês de diferença ficam mais longe que duas
// com uma semana. Datas iguais ou uma só data ficam no meio.
export function escalaDoTempo(datas: string[], inicio: number, fim: number): (data: string) => number {
  const primeira = datas[0]
  const total = datas.length > 1 ? diasEntre(primeira, datas[datas.length - 1]) : 0
  return (data) => (total <= 0 ? (inicio + fim) / 2 : inicio + (diasEntre(primeira, data) / total) * (fim - inicio))
}

const PASSOS = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100]

// Marcas "redondas" dentro de [min, max], no máximo ~alvo
export function marcasDoEixo(min: number, max: number, alvo = 4): number[] {
  const passo = PASSOS.find((p) => (max - min) / p <= alvo) ?? PASSOS[PASSOS.length - 1]
  const marcas: number[] = []
  for (let v = Math.ceil(min / passo) * passo; v <= max + 1e-9; v += passo) marcas.push(Math.round(v * 100) / 100)
  return marcas
}

// Eixo do peso: folga em volta dos dados e uma altura mínima, para uma oscilação de 200 g
// não virar um morro. Os limites caem em números inteiros.
export function dominioDoPeso(valores: number[]): { min: number; max: number } {
  const menor = Math.min(...valores)
  const maior = Math.max(...valores)
  const centro = (menor + maior) / 2
  const extensao = Math.max((maior - menor) * 1.3, 4)
  return { min: Math.floor(centro - extensao / 2), max: Math.ceil(centro + extensao / 2) }
}

// Eixo do IMC: cobre os dados com uma folga e nunca fica menor que 5 pontos, para as faixas
// da OMS de fundo aparecerem
export function dominioDoImc(valores: number[]): { min: number; max: number } {
  const min = Math.floor(Math.min(...valores) - 1.5)
  const max = Math.ceil(Math.max(...valores) + 1.5)
  const falta = Math.max(0, 5 - (max - min))
  return { min: min - Math.floor(falta / 2), max: max + Math.ceil(falta / 2) }
}

export function indiceMaisProximo(xs: number[], x: number): number {
  let melhor = 0
  for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - x) < Math.abs(xs[melhor] - x)) melhor = i
  return melhor
}

// Quais pontos recebem rótulo no eixo x (xs = posição de cada ponto): vai da esquerda para a
// direita pulando os que ficam mais perto que distanciaMinima. O último sempre ganha rótulo.
export function indicesDosRotulos(xs: number[], distanciaMinima: number): number[] {
  if (xs.length === 0) return []
  const escolhidos = [0]
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] - xs[escolhidos[escolhidos.length - 1]] >= distanciaMinima) escolhidos.push(i)
  }
  const ultimo = xs.length - 1
  if (escolhidos[escolhidos.length - 1] !== ultimo) {
    if (xs[ultimo] - xs[escolhidos[escolhidos.length - 1]] < distanciaMinima) escolhidos.pop()
    escolhidos.push(ultimo)
  }
  return escolhidos
}

const arredondar = (n: number) => Math.round(n * 10) / 10

export function caminhoDaLinha(pontos: { x: number; y: number }[]): string {
  return pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${arredondar(p.x)} ${arredondar(p.y)}`).join(' ')
}

export function caminhoDaArea(pontos: { x: number; y: number }[], base: number): string {
  if (pontos.length < 2) return ''
  const ultimo = pontos[pontos.length - 1]
  return `${caminhoDaLinha(pontos)} L${arredondar(ultimo.x)} ${base} L${arredondar(pontos[0].x)} ${base} Z`
}
