// Faixas de IMC da OMS, as mesmas de backend/src/common/calcular-imc.ts
export type FaixaImc = {
  nome: string
  min: number
  max: number
  cor: string
  corForte: string
  // Texto legível sobre `cor` (selo da faixa)
  corTexto: string
}

export const FAIXAS_IMC: FaixaImc[] = [
  { nome: 'Abaixo do peso', min: 0, max: 18.5, cor: 'var(--color-accent-subtle)', corForte: 'var(--color-accent)', corTexto: 'var(--color-on-accent-subtle)' },
  { nome: 'Peso normal', min: 18.5, max: 25, cor: 'var(--color-primary-subtle)', corForte: 'var(--color-primary)', corTexto: 'var(--color-on-primary-subtle)' },
  { nome: 'Sobrepeso', min: 25, max: 30, cor: 'var(--color-warning-subtle)', corForte: 'var(--color-warning)', corTexto: 'var(--color-on-warning-subtle)' },
  { nome: 'Obesidade', min: 30, max: Number.POSITIVE_INFINITY, cor: 'var(--color-danger-subtle)', corForte: 'var(--color-danger)', corTexto: 'var(--color-on-danger-subtle)' },
]

// Uma casa decimal, como o backend (common/calcular-imc.ts)
export function calcularImc(pesoKg: number, alturaCm: number): number {
  const alturaM = alturaCm / 100
  return Math.round((pesoKg / (alturaM * alturaM)) * 10) / 10
}

export function faixaDoImc(imc: number): FaixaImc {
  return FAIXAS_IMC.find((faixa) => imc < faixa.max) ?? FAIXAS_IMC[FAIXAS_IMC.length - 1]
}

// Peso (kg) que dá um certo IMC para a altura: peso = IMC × altura²
export function pesoParaImc(imc: number, alturaCm: number): number {
  const alturaM = alturaCm / 100
  return imc * alturaM * alturaM
}

// Régua do portal: de 15 a 40, o resto fica preso nas pontas
export const REGUA_IMC = { min: 15, max: 40 }

export function posicaoNaRegua(imc: number): number {
  const fracao = (imc - REGUA_IMC.min) / (REGUA_IMC.max - REGUA_IMC.min)
  return Math.min(1, Math.max(0, fracao))
}
