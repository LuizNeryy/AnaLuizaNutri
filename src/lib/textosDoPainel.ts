import type { ProgressoDoDia } from './progressoDoDia'
import type { Streak } from './streak'

const numero = (valor: number) => Math.round(valor).toLocaleString('pt-BR')

export function textoRefeicoes(progresso: ProgressoDoDia) {
  return `${progresso.refeicoesConcluidas} de ${progresso.refeicoesComAlimentos} ${
    progresso.refeicoesComAlimentos === 1 ? 'refeição' : 'refeições'
  }`
}

// "1.240 de 2.100 kcal" ou "2 de 5 refeições"
export function textoProgresso(progresso: ProgressoDoDia) {
  return progresso.modo === 'kcal'
    ? `${numero(progresso.feito)} de ${numero(progresso.total)} kcal`
    : textoRefeicoes(progresso)
}

export function rotuloAcessivel(progresso: ProgressoDoDia, rotuloDoDia: string) {
  const percentual = Math.round(Math.min(1, progresso.feito / progresso.total) * 100)
  return progresso.modo === 'kcal'
    ? `${textoProgresso(progresso)} do plano ${rotuloDoDia}, ${percentual} por cento`
    : `${textoRefeicoes(progresso)} concluídas ${rotuloDoDia}, ${percentual} por cento`
}

// Texto abaixo do número no centro do anel
export function unidadeDoAnel(progresso: ProgressoDoDia) {
  return progresso.modo === 'kcal'
    ? `de ${numero(progresso.total)} kcal`
    : `de ${progresso.total} ${progresso.total === 1 ? 'refeição' : 'refeições'}`
}

export function textoDiasSeguidos(atual: number) {
  return `${atual} ${atual === 1 ? 'dia seguido' : 'dias seguidos'}`
}

// Texto neutro: nunca "perdeu" ou "falhou"
export function mensagemDaSequencia(streak: Streak): string | null {
  if (streak.atual > 0) return null
  if (streak.melhor > 0) return 'Uma nova sequência começa hoje.'
  return 'Marque as refeições de hoje para começar uma sequência.'
}
