// Links de autocadastro (RF-A6) gerados pela nutricionista: tipos da API e formatação

export const CONVITES_PATH = '/pacientes/convites-autocadastro'
export const IDENTIFICACAO_MAX = 80

// Resposta ao gerar: o token só vem aqui, uma vez (no banco fica só o hash)
export type ConviteGerado = {
  id: string
  token: string
  expiraEm: string
  identificacao: string | null
}

export type StatusConvite = 'pendente' | 'usado' | 'expirado' | 'revogado'

export type ConviteDoHistorico = {
  id: string
  identificacao: string | null
  status: StatusConvite
  criadoEm: string
  expiraEm: string
  usadoEm: string | null
  revogadoEm: string | null
  paciente: { id: string; nome: string } | null
}

// Uma página do histórico. O tamanho (pageSize) é fixo no servidor; o cliente só envia
// page, q e status.
export type PaginaDeConvites = {
  items: ConviteDoHistorico[]
  total: number
  page: number
  pageSize: number
}

export type FiltrosDoHistorico = { page: number; q: string; status: StatusConvite | '' }

export const FILTROS_DE_STATUS: { valor: StatusConvite | ''; rotulo: string }[] = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'pendente', rotulo: 'Pendentes' },
  { valor: 'usado', rotulo: 'Usados' },
  { valor: 'expirado', rotulo: 'Expirados' },
  { valor: 'revogado', rotulo: 'Revogados' },
]

export function caminhoDoHistorico({ page, q, status }: FiltrosDoHistorico): string {
  const params = new URLSearchParams({ page: String(page) })
  if (q.trim()) params.set('q', q.trim())
  if (status) params.set('status', status)
  return `${CONVITES_PATH}?${params.toString()}`
}

export function totalDePaginas(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

// A página pedida ficou vazia (ex.: revogou o último item dela): volta para a última válida
export function paginaParaVoltar(pagina: PaginaDeConvites): number | null {
  if (pagina.items.length > 0 || pagina.page <= 1) return null
  const ultima = totalDePaginas(pagina.total, pagina.pageSize)
  return pagina.page > ultima ? ultima : null
}

// "Mostrando 11–20 de 25"
export function faixaExibida({ page, pageSize, total, items }: PaginaDeConvites): string {
  if (total === 0) return 'Nenhum link encontrado'
  const inicio = (page - 1) * pageSize + 1
  return `Mostrando ${inicio}–${inicio + items.length - 1} de ${total}`
}

// Números de página compactos: sempre a primeira, a última e as vizinhas da atual
export function paginasCompactas(atual: number, total: number): (number | 'reticencias')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const paginas = new Set([1, total, atual - 1, atual, atual + 1])
  if (atual <= 3) [2, 3, 4].forEach((p) => paginas.add(p))
  if (atual >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => paginas.add(p))

  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const resultado: (number | 'reticencias')[] = []
  ordenadas.forEach((p, i) => {
    const anterior = ordenadas[i - 1]
    // Reticências só quando escondem 2+ páginas; para uma só, mostra o número
    if (i > 0 && p - anterior === 2) resultado.push(anterior + 1)
    else if (i > 0 && p - anterior > 2) resultado.push('reticencias')
    resultado.push(p)
  })
  return resultado
}

export type EstadoDoHistorico = 'carregando' | 'erro' | 'vazio' | 'sem-resultado' | 'lista'

// O que a seção mostra. Com dados de uma consulta anterior, segue mostrando a lista enquanto
// a próxima carrega (sem pular o layout).
export function estadoDoHistorico(entrada: {
  pagina: PaginaDeConvites | null
  erro: boolean
  comFiltro: boolean
}): EstadoDoHistorico {
  if (entrada.erro) return 'erro'
  if (!entrada.pagina) return 'carregando'
  if (entrada.pagina.total > 0) return 'lista'
  return entrada.comFiltro ? 'sem-resultado' : 'vazio'
}

export const STATUS_CONVITE: Record<StatusConvite, { rotulo: string; classes: string }> = {
  pendente: { rotulo: 'Pendente', classes: 'bg-accent-subtle text-on-accent-subtle' },
  usado: { rotulo: 'Usado', classes: 'bg-primary-subtle text-on-primary-subtle' },
  expirado: { rotulo: 'Expirado', classes: 'bg-surface-sunken text-ink-secondary' },
  revogado: { rotulo: 'Revogado', classes: 'bg-danger-subtle text-on-danger-subtle' },
}

export function linkDoConvite(token: string): string {
  return `${window.location.origin}/cadastro/${token}`
}

const FORMATO_DATA_HORA = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function formatarDataHora(iso: string): string {
  return FORMATO_DATA_HORA.format(new Date(iso))
}

// "2 d 5 h", "3 h 10 min", "menos de 1 min"
export function tempoRestante(iso: string, agora: Date): string {
  const minutos = Math.floor((new Date(iso).getTime() - agora.getTime()) / 60_000)
  if (minutos < 1) return 'menos de 1 min'
  const dias = Math.floor(minutos / 1440)
  const horas = Math.floor((minutos % 1440) / 60)
  const resto = minutos % 60
  if (dias > 0) return horas > 0 ? `${dias} d ${horas} h` : `${dias} d`
  if (horas > 0) return resto > 0 ? `${horas} h ${resto} min` : `${horas} h`
  return `${resto} min`
}
