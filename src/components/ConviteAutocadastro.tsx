import { LinkIcon, MessageCircle } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ApiError, api } from '../lib/api'
import { Logo } from './Logo'

// sem-convite: abriu /cadastro direto (ex.: "Agendar Consulta" da landing), sem link válido
type Estado = 'carregando' | 'valido' | 'invalido' | 'sem-convite' | 'indisponivel'

// Mesmo número do WhatsApp da LandingPage
const WHATSAPP_NUTRICIONISTA = '553184759120'
const MENSAGEM_AGENDAR =
  'Olá, Ana Luiza! Acessei o seu site e gostaria de agendar uma consulta.'

function estadoDoErro(error: unknown, semToken: Estado): Estado {
  return error instanceof ApiError && error.status === 404 ? semToken : 'indisponivel'
}

const TEXTOS: Record<Exclude<Estado, 'valido' | 'carregando'>, { titulo: string; texto: string }> = {
  invalido: {
    titulo: 'Link de cadastro inválido',
    texto: 'Este link não existe, expirou ou já foi usado. Peça um novo link à sua nutricionista.',
  },
  'sem-convite': {
    titulo: 'Cadastro por convite',
    texto:
      'O cadastro é feito pelo link que a nutricionista envia depois do primeiro contato. Fale com ela para agendar sua consulta.',
  },
  indisponivel: {
    titulo: 'Não foi possível abrir o cadastro',
    texto: 'Tente novamente em alguns minutos.',
  },
}

function AvisoDoLink({ estado }: { estado: Exclude<Estado, 'valido'> }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="Ir para o site da Ana Luiza">
            <Logo className="h-11" />
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          {estado === 'carregando' ? (
            <p className="text-body-sm text-ink-secondary">Verificando seu link de cadastro...</p>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-subtle text-on-primary-subtle">
                <LinkIcon size={28} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h1 className="text-h1 text-ink">{TEXTOS[estado].titulo}</h1>
              <p className="mt-2 text-body text-ink-secondary">{TEXTOS[estado].texto}</p>
              {estado === 'sem-convite' && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUTRICIONISTA}?text=${encodeURIComponent(MENSAGEM_AGENDAR)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-button-label text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Conversar no WhatsApp
                </a>
              )}
              <p className="mt-6 text-body-sm text-ink-secondary">
                Já tem cadastro?{' '}
                <Link to="/login" className="font-semibold text-primary">
                  Fazer login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

// /cadastro/:token — o link que a nutricionista enviou. O backend valida o token e o guarda
// num cookie httpOnly; depois seguimos para /cadastro, sem o token na URL nem no histórico.
export function AbrirConviteAutocadastro() {
  const { token = '' } = useParams<{ token: string }>()
  const [estado, setEstado] = useState<Estado>('carregando')

  useEffect(() => {
    api
      .get(`/portal-paciente/autocadastro/${encodeURIComponent(token)}`)
      .then(() => setEstado('valido'))
      .catch((error: unknown) => setEstado(estadoDoErro(error, 'invalido')))
  }, [token])

  if (estado === 'valido') return <Navigate to="/cadastro" replace />
  return <AvisoDoLink estado={estado} />
}

// /cadastro — só mostra o formulário de autocadastro com um convite válido no cookie
export function ExigirConviteAutocadastro({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>('carregando')

  useEffect(() => {
    api
      .get('/portal-paciente/autocadastro')
      .then(() => setEstado('valido'))
      .catch((error: unknown) => setEstado(estadoDoErro(error, 'sem-convite')))
  }, [])

  if (estado === 'valido') return <>{children}</>
  return <AvisoDoLink estado={estado} />
}
