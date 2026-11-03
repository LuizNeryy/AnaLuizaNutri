import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MedicoesHistorico } from '../components/MedicoesHistorico'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { api } from '../lib/api'

type MeusDados = {
  id: string
  nome: string
  contato: string
  sexo: 'FEMININO' | 'MASCULINO'
  dataNascimento: string
  objetivos: { id: string; nome: string }[]
}

export function PortalPerfil() {
  const [dados, setDados] = useState<MeusDados | null>(null)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    api.get<MeusDados>('/portal-paciente/me').then(setDados)
  }, [])

  async function handleTrocarSenha(event: FormEvent) {
    event.preventDefault()
    setErro(null)
    setMensagem(null)

    try {
      await api.patch('/portal-paciente/senha', { senhaAtual, novaSenha })
      setMensagem('Senha alterada com sucesso.')
      setSenhaAtual('')
      setNovaSenha('')
    } catch {
      setErro('Não foi possível trocar a senha. Confira a senha atual.')
    }
  }

  if (!dados) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-body-sm text-ink-muted">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Meus dados</h1>
        <Link to="/portal/plano" className="text-body-sm text-primary">
          Ver plano
        </Link>
      </div>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <dl className="flex flex-col gap-3 text-body-sm">
            <div>
              <dt className="text-ink-muted">Nome</dt>
              <dd className="text-ink">{dados.nome}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Contato</dt>
              <dd className="text-ink">{dados.contato}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Objetivo</dt>
              <dd className="text-ink">{dados.objetivos.map((objetivo) => objetivo.nome).join(', ')}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="mt-4">
        <MedicoesHistorico contexto="paciente" />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Trocar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrocarSenha} className="flex flex-col gap-4">
            <Input
              label="Senha atual"
              type="password"
              value={senhaAtual}
              onChange={(event) => setSenhaAtual(event.target.value)}
            />
            <Input
              label="Nova senha (mínimo 6 caracteres)"
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
            />

            {erro && <Alert variant="error">{erro}</Alert>}
            {mensagem && <Alert variant="success">{mensagem}</Alert>}

            <Button type="submit">Salvar nova senha</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
