import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout, ForgotPassword, SubmitButton } from '../components/auth/auth-layout'
import { Alert } from '../components/ui/alert'
import { Input } from '../components/ui/input'
import { api } from '../lib/api'

// Login unificado: nutricionista (usuário) e paciente (CPF) entram pela mesma tela
export function Login() {
  const navigate = useNavigate()
  const [identificador, setIdentificador] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function entrarComoPaciente(cpf: string) {
    await api.post('/portal-paciente/login', { cpf, senha: password })
    navigate('/portal/inicio')
  }

  async function entrarComoNutricionista(username: string) {
    await api.post('/auth/login', { username, password })
    navigate('/dashboard')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const raw = identificador.trim()
    const apenasDigitos = raw.replace(/\D/g, '')
    const pareceCpf = apenasDigitos.length === 11 && !raw.includes('@')

    // Tenta primeiro o perfil mais provável e cai para o outro
    const tentativas = pareceCpf
      ? [() => entrarComoPaciente(raw), () => entrarComoNutricionista(raw)]
      : [() => entrarComoNutricionista(raw), ...(apenasDigitos ? [() => entrarComoPaciente(raw)] : [])]

    try {
      for (const tentar of tentativas) {
        try {
          await tentar()
          return
        } catch {
          // tenta o próximo perfil
        }
      }
      setError('CPF/usuário ou senha inválidos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      description="Use seu CPF (paciente) ou seu usuário (nutricionista)."
      footer={<>Primeira vez aqui? Peça à sua nutricionista o link de cadastro.</>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="CPF ou usuário"
          type="text"
          autoComplete="username"
          autoFocus
          required
          value={identificador}
          onChange={(event) => setIdentificador(event.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <ForgotPassword>
          Paciente: peça à sua nutricionista um novo link de acesso. Nutricionista: a senha do
          painel é redefinida pelo suporte da nutricionista Ana Luiza.
        </ForgotPassword>

        <div role="alert">{error && <Alert variant="error">{error}</Alert>}</div>

        <SubmitButton loading={submitting}>Entrar</SubmitButton>
      </form>
    </AuthLayout>
  )
}
