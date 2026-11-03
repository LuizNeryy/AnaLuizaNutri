import { useState, type FormEvent } from 'react'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { api } from '../lib/api'

export function Conta() {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function handleTrocarSenha(event: FormEvent) {
    event.preventDefault()
    setErro(null)
    setMensagem(null)

    try {
      await api.patch('/auth/senha', { senhaAtual, novaSenha })
      setMensagem('Senha alterada com sucesso.')
      setSenhaAtual('')
      setNovaSenha('')
    } catch {
      setErro('Não foi possível trocar a senha. Confira a senha atual.')
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-h1 text-ink">Minha conta</h1>

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
              label="Nova senha"
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
