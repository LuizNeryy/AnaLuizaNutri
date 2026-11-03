import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { api } from '../lib/api'

type ItemContagem = { total: number }

type Resumo = {
  totalPacientes: number
  pacientesSemPlano: number
  porObjetivo: ({ nome: string } & ItemContagem)[]
  porFaixaImc: ({ faixa: string } & ItemContagem)[]
}

function BarraHorizontal({ itens, rotulo }: { itens: ({ rotulo: string } & ItemContagem)[]; rotulo?: string }) {
  if (itens.length === 0) {
    return <p className="text-body-sm text-ink-muted">{rotulo ?? 'Sem dados ainda.'}</p>
  }

  const maior = Math.max(...itens.map((item) => item.total), 1)

  return (
    <ul className="flex flex-col gap-2.5">
      {itens.map((item) => (
        <li key={item.rotulo} className="flex items-center gap-3">
          <span className="w-36 shrink-0 text-body-sm text-ink-secondary">{item.rotulo}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.total / maior) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-body-sm text-ink">{item.total}</span>
        </li>
      ))}
    </ul>
  )
}

export function Dashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null)

  useEffect(() => {
    api.get<Resumo>('/dashboard').then(setResumo)
  }, [])

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-h1 text-ink">Painel</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pacientes cadastrados</CardDescription>
            <CardTitle className="text-display">
              {resumo === null ? '—' : resumo.totalPacientes}
            </CardTitle>
          </CardHeader>
        </Card>

        <Link to="/pacientes/novo">
          <Card className="h-full transition hover:shadow-md">
            <CardHeader>
              <CardTitle>+ Novo paciente</CardTitle>
              <CardDescription>Cadastrar um paciente atendido pessoalmente.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/pacientes">
          <Card className="h-full transition hover:shadow-md">
            <CardHeader>
              <CardTitle>Ver pacientes</CardTitle>
              <CardDescription>Lista completa, com acesso ao plano de cada um.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {resumo && resumo.pacientesSemPlano > 0 && (
        <Link to="/pacientes">
          <Card className="mt-4 border border-danger transition hover:shadow-md">
            <CardHeader>
              <CardTitle>
                {resumo.pacientesSemPlano} paciente(s) sem plano alimentar cadastrado
              </CardTitle>
              <CardDescription>Clique para ver a lista de pacientes.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pacientes por objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            {resumo && (
              <BarraHorizontal
                itens={resumo.porObjetivo.map((item) => ({ rotulo: item.nome, total: item.total }))}
                rotulo="Nenhum paciente com objetivo cadastrado ainda."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de IMC</CardTitle>
          </CardHeader>
          <CardContent>
            {resumo && (
              <BarraHorizontal
                itens={resumo.porFaixaImc.map((item) => ({ rotulo: item.faixa, total: item.total }))}
                rotulo="Nenhum paciente com medição registrada ainda."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
