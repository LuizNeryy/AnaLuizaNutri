export type Anamnese = {
  motivoConsulta?: string
  expectativaProfissional?: string
  transitoIntestinal?: string
  horasSono?: number
  fumante?: boolean
  consomeAlcool?: boolean
  estadoCivil?: string
  exerciciosPorSemana?: number
  raca?: string
  horaAcordar?: string
  horaDormir?: string
  dietaEspecifica?: string
  alimentosExcluir?: string
  alimentosIncluir?: string
  alergiaAlimentar?: string
  intoleranciaAlimentar?: string
  deficienciaNutricional?: string
  consumoAgua?: string
  doencas?: string
  medicacaoAtual?: string
  condicaoSaudeRelevante?: string
  historicoFamiliar?: string
  observacoesGerais?: string
  observacoesAntesConsulta?: string
}

type TipoCampo = 'text' | 'textarea' | 'number' | 'boolean'

type CampoAnamnese = {
  chave: keyof Anamnese
  label: string
  tipo: TipoCampo
}

type SecaoAnamnese = {
  titulo: string
  campos: CampoAnamnese[]
}

export const SECOES_ANAMNESE: SecaoAnamnese[] = [
  {
    titulo: 'Consulta',
    campos: [
      { chave: 'motivoConsulta', label: 'Motivo da consulta', tipo: 'textarea' },
      {
        chave: 'expectativaProfissional',
        label: 'O que espera da profissional e desta consulta',
        tipo: 'textarea',
      },
    ],
  },
  {
    titulo: 'Hábitos de vida',
    campos: [
      { chave: 'transitoIntestinal', label: 'Como funciona o trânsito intestinal', tipo: 'text' },
      { chave: 'horasSono', label: 'Horas de sono por dia', tipo: 'number' },
      { chave: 'fumante', label: 'Fumante', tipo: 'boolean' },
      { chave: 'consomeAlcool', label: 'Consome bebidas alcoólicas', tipo: 'boolean' },
      { chave: 'estadoCivil', label: 'Estado civil', tipo: 'text' },
      { chave: 'exerciciosPorSemana', label: 'Exercício físico (vezes por semana)', tipo: 'number' },
      { chave: 'raca', label: 'Raça', tipo: 'text' },
      { chave: 'horaAcordar', label: 'Horário que costuma acordar', tipo: 'text' },
      { chave: 'horaDormir', label: 'Horário que costuma dormir', tipo: 'text' },
    ],
  },
  {
    titulo: 'Alimentação',
    campos: [
      { chave: 'dietaEspecifica', label: 'Segue algum tipo específico de dieta', tipo: 'text' },
      { chave: 'alimentosExcluir', label: 'Alimento que NÃO deseja no plano', tipo: 'text' },
      { chave: 'alimentosIncluir', label: 'Alimento que GOSTARIA de incluir', tipo: 'text' },
      { chave: 'alergiaAlimentar', label: 'Alergia alimentar', tipo: 'text' },
      { chave: 'intoleranciaAlimentar', label: 'Intolerância alimentar', tipo: 'text' },
      { chave: 'deficienciaNutricional', label: 'Deficiência nutricional', tipo: 'text' },
      { chave: 'consumoAgua', label: 'Quantidade de água que bebe por dia', tipo: 'text' },
    ],
  },
  {
    titulo: 'Saúde',
    campos: [
      { chave: 'doencas', label: 'Possui alguma doença', tipo: 'text' },
      { chave: 'medicacaoAtual', label: 'Medicação atual', tipo: 'text' },
      {
        chave: 'condicaoSaudeRelevante',
        label: 'Condição ou informação relevante de saúde',
        tipo: 'textarea',
      },
      { chave: 'historicoFamiliar', label: 'Histórico familiar de condição de saúde', tipo: 'text' },
    ],
  },
  {
    titulo: 'Observações',
    campos: [
      { chave: 'observacoesGerais', label: 'Outra observação ou preocupação', tipo: 'textarea' },
      {
        chave: 'observacoesAntesConsulta',
        label: 'Observação ou preocupação antes da consulta',
        tipo: 'textarea',
      },
    ],
  },
]

export function construirCorpoAnamnese(valores: Record<string, string>): Partial<Anamnese> {
  const corpo: Record<string, string | number | boolean> = {}

  for (const secao of SECOES_ANAMNESE) {
    for (const campo of secao.campos) {
      const valor = valores[campo.chave]
      if (!valor) continue

      if (campo.tipo === 'number') {
        corpo[campo.chave] = Number(valor)
      } else if (campo.tipo === 'boolean') {
        corpo[campo.chave] = valor === 'true'
      } else {
        corpo[campo.chave] = valor
      }
    }
  }

  return corpo as Partial<Anamnese>
}
