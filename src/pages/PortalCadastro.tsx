import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Logo } from '../components/Logo'
import { api } from '../lib/api'

type Convite = { nome: string; cpf: string }

// Página aberta pelo link de convite: o paciente escolhe a própria senha.
export function PortalCadastro() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [convite, setConvite] = useState<Convite | null>(null)
  const [linkInvalido, setLinkInvalido] = useState(false)
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!token) return
    api
      .get<Convite>(`/portal-paciente/convite/${token}`)
      .then(setConvite)
      .catch(() => setLinkInvalido(true))
  }, [token])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErro(null)

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.')
      return
    }

    setEnviando(true)
    try {
      await api.post(`/portal-paciente/convite/${token}`, { senha })
      navigate('/portal/inicio')
    } catch {
      setErro('Não foi possível concluir o cadastro. O link pode ter expirado.')
      setEnviando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo className="h-12" />
        </div>

        <Card>
          {linkInvalido ? (
            <CardHeader>
              <CardTitle>Link inválido</CardTitle>
              <CardDescription>
                Este link expirou ou já foi usado. Peça um novo link à sua nutricionista.
              </CardDescription>
            </CardHeader>
          ) : !convite ? (
            <CardContent>
              <p className="text-body-sm text-ink-muted">Carregando...</p>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Olá, {convite.nome.split(' ')[0]}!</CardTitle>
                <CardDescription>
                  Crie sua senha com pelo menos 6 caracteres (letras, números ou símbolos). Depois é só entrar com seu CPF ({convite.cpf}) e
                  essa senha.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Senha (mínimo 6 caracteres)"
                    type="password"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                  />
                  <Input
                    label="Confirme a senha"
                    type="password"
                    autoComplete="new-password"
                    value={confirmacao}
                    onChange={(event) => setConfirmacao(event.target.value)}
                  />

                  {erro && <Alert variant="error">{erro}</Alert>}

                  <Button type="submit" disabled={enviando}>
                    {enviando ? 'Salvando...' : 'Criar senha e entrar'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  )
}
