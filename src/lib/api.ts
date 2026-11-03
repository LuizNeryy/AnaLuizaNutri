export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Contrato da issue #3 (RF-B5): PDF do plano atual do paciente logado (sessão por cookie)
export const PLANO_PDF_PATH = '/portal-paciente/plano/pdf'

export class ApiError extends Error {
  readonly status: number
  // Mensagens do corpo de erro do Nest ({ message: string | string[] }), quando houver
  readonly mensagens: string[]

  constructor(status: number, path: string, mensagens: string[] = []) {
    super(`Erro ${status} ao chamar ${path}`)
    this.status = status
    this.mensagens = mensagens
  }
}

async function mensagensDoErro(response: Response): Promise<string[]> {
  try {
    const corpo = (await response.json()) as { message?: unknown }
    if (Array.isArray(corpo.message)) return corpo.message.filter((m) => typeof m === 'string')
    return typeof corpo.message === 'string' ? [corpo.message] : []
  } catch {
    return []
  }
}

async function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    throw new ApiError(response.status, path, await mensagensDoErro(response))
  }

  return response
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchApi(path, init)

  if (response.status === 204) {
    return undefined as T
  }

  const texto = await response.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

export const api = {
  // signal: para cancelar a requisição (ex.: busca que ficou velha)
  get: <T>(path: string, opcoes?: { signal?: AbortSignal }) => request<T>(path, opcoes),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

function nomeDoContentDisposition(header: string | null): string | null {
  if (!header) return null

  const codificado = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (codificado) {
    try {
      return decodeURIComponent(codificado[1].trim())
    } catch {
      // segue para o filename simples
    }
  }

  const simples = /filename="?([^";]+)"?/i.exec(header)
  return simples ? simples[1].trim() : null
}

export async function baixarPlanoPdf(): Promise<{ blob: Blob; nomeArquivo: string | null }> {
  const response = await fetchApi(PLANO_PDF_PATH, { headers: { Accept: 'application/pdf' } })
  const blob = await response.blob()

  // Erro mascarado com status 200 (JSON ou HTML no lugar do PDF)
  if (!blob.type.startsWith('application/pdf')) {
    throw new Error(`Resposta inesperada (${blob.type || 'sem content-type'}) ao baixar o PDF`)
  }

  // Em requisição cross-origin o header só é legível se o backend o expuser via CORS
  const nomeArquivo = nomeDoContentDisposition(response.headers.get('Content-Disposition'))
  return { blob, nomeArquivo }
}
