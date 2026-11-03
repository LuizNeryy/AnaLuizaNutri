import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

type Paciente = {
  id: string
  nome: string
  contato: string
  dataNascimento: string
  objetivos: { id: string; nome: string }[]
  cadastroConcluido: boolean
}

function calcularIdade(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
  if (aindaNaoFezAniversario) idade -= 1
  return idade
}

export function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[] | null>(null)

  useEffect(() => {
    api.get<Paciente[]>('/pacientes').then(setPacientes)
  }, [])

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Pacientes</h1>
        <Link
          to="/pacientes/novo"
          className="rounded-md bg-primary px-3 py-2 text-button-label text-on-primary"
        >
          + Novo paciente
        </Link>
      </div>

      {pacientes === null && <p className="mt-6 text-body-sm text-ink-muted">Carregando...</p>}

      {pacientes?.length === 0 && (
        <p className="mt-6 rounded-md bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
          Nenhum paciente cadastrado ainda.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pacientes?.map((paciente) => (
          <Link
            key={paciente.id}
            to={`/pacientes/${paciente.id}`}
            className="rounded-lg bg-surface p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-h3 text-ink">{paciente.nome}</h3>
              {!paciente.cadastroConcluido && (
                <span className="shrink-0 rounded-sm bg-warning-subtle px-2 py-0.5 text-caption text-on-warning-subtle">
                  Aguardando cadastro
                </span>
              )}
            </div>
            <p className="mt-1 text-body-sm text-ink-secondary">
              {paciente.objetivos.map((objetivo) => objetivo.nome).join(', ')}
            </p>
            <p className="mt-3 text-caption text-ink-muted">
              {calcularIdade(paciente.dataNascimento)} anos · {paciente.contato}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
