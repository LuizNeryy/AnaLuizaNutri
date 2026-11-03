import { calcularImc } from './imc.ts'

// Medidas corporais do portal. Os limites repetem os do backend
// (registrar-minha-medicao.dto.ts): aqui só dão a mensagem antes de enviar.
export const LIMITES_MEDIDA = {
  pesoKg: { min: 20, max: 350 },
  alturaCm: { min: 100, max: 250 },
} as const

export type MedidaDoPortal = {
  id: string
  pesoKg: number
  alturaCm: number
  data: string
  imc: number
  criadoEm?: string
}

const formatarNumero = (valor: number, casas: number) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

// "62,5" ou "62.5" → 62.5; qualquer outra coisa (vazio, letras, "1,2,3") → null
export function lerDecimal(texto: string): number | null {
  const limpo = texto.trim()
  if (!/^\d+([.,]\d+)?$/.test(limpo)) return null
  return Number(limpo.replace(',', '.'))
}

function casasDecimais(texto: string): number {
  const fracao = texto.trim().split(/[.,]/)[1]
  return fracao ? fracao.length : 0
}

export function erroDoPeso(texto: string): string | null {
  if (!texto.trim()) return 'Informe o peso.'
  const valor = lerDecimal(texto)
  if (valor === null) return 'Use só números, como 62,5.'
  if (casasDecimais(texto) > 1) return 'Use no máximo uma casa decimal.'
  const { min, max } = LIMITES_MEDIDA.pesoKg
  if (valor < min || valor > max) return `O peso deve estar entre ${min} e ${max} kg.`
  return null
}

export function erroDaAltura(texto: string): string | null {
  if (!texto.trim()) return 'Informe a altura.'
  const valor = lerDecimal(texto)
  const { min, max } = LIMITES_MEDIDA.alturaCm
  if (valor === null) return 'Use só números, em centímetros, como 170.'
  if (valor < min || valor > max) return `A altura deve estar em centímetros, entre ${min} e ${max}. Ex.: 170.`
  if (casasDecimais(texto) > 1) return 'Use no máximo uma casa decimal.'
  return null
}

export function erroDaData(texto: string, hoje: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return 'Informe a data da medida.'
  const [ano, mes, dia] = texto.split('-').map(Number)
  const existe = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDate() === dia && mes >= 1 && mes <= 12
  if (!existe) return 'Essa data não existe.'
  if (texto > hoje) return 'A data da medida não pode ser no futuro.'
  return null
}

// "YYYY-MM-DD" no fuso do aparelho
export function dataIsoLocal(data: Date = new Date()): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

// Mesmo cálculo do backend (uma casa decimal), para a prévia do formulário
export function imcDaMedida(pesoKg: number, alturaCm: number): number {
  return calcularImc(pesoKg, alturaCm)
}

// A medida é um dia, não um instante: usa só a parte da data, sem converter fuso
export function diaMes(data: string): string {
  const [, mes, dia] = data.slice(0, 10).split('-')
  return `${dia}/${mes}`
}

export function dataCurta(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

// Da mais antiga para a mais nova; no mesmo dia, vale a ordem de registro
export function ordenarCronologico<T extends Pick<MedidaDoPortal, 'data' | 'criadoEm'>>(medidas: T[]): T[] {
  const chave = (m: T) => `${m.data.slice(0, 10)}|${m.criadoEm ?? ''}`
  return medidas
    .map((medida, indice) => ({ medida, indice }))
    .sort((a, b) => chave(a.medida).localeCompare(chave(b.medida)) || a.indice - b.indice)
    .map(({ medida }) => medida)
}

export type Diferenca = { valor: number; texto: string; direcao: 'subiu' | 'desceu' | 'igual' }

// Atual menos anterior, arredondado. Sem juízo de valor: subir ou descer depende do objetivo.
export function diferenca(atual: number, anterior: number, unidade = '', casas = 1): Diferenca {
  const fator = 10 ** casas
  const valor = Math.round((atual - anterior) * fator) / fator
  if (valor === 0) return { valor: 0, texto: 'Sem mudança', direcao: 'igual' }
  const numero = formatarNumero(Math.abs(valor), casas)
  const sinal = valor < 0 ? '−' : '+'
  return {
    valor,
    texto: `${sinal}${numero}${unidade ? ` ${unidade}` : ''}`,
    direcao: valor < 0 ? 'desceu' : 'subiu',
  }
}

// Dias inteiros entre duas datas "YYYY-MM-DD"
export function diasEntre(inicio: string, fim: string): number {
  const dia = (iso: string) => {
    const [a, m, d] = iso.slice(0, 10).split('-').map(Number)
    return Date.UTC(a, m - 1, d) / 86_400_000
  }
  return Math.round(dia(fim) - dia(inicio))
}
