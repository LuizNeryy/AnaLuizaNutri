export const EASE_PAINEL = [0.32, 0.85, 0.35, 1] as const

export function formatarNumero(valor: number, casas = 0) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
}
