import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlanoRefeicoesView } from '../components/PlanoRefeicoesView'
import { api } from '../lib/api'

type HistoricoPlano = {
  id: string
  criadoEm: string
  ativo: boolean
  totalRefeicoes: number
}

type RefeicaoPlano = {
  id: string
  nome: string
  horario: string
  itens: { id: string; quantidade: number; unidade: string; alimento: { id: string; nome: string } }[]
}

type PlanoDetalhe = {
  id: string
  refeicoes: RefeicaoPlano[]
}

export function PortalHistoricoPlanos() {
  const [historico, setHistorico] = useState<HistoricoPlano[] | null>(null)
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoDetalhe | null>(null)

  useEffect(() => {
    api.get<HistoricoPlano[]>('/portal-paciente/planos').then(setHistorico)
  }, [])

  async function abrir(planoId: string) {
    if (selecionado === planoId) {
      setSelecionado(null)
      setPlanoSelecionado(null)
      return
    }
    setSelecionado(planoId)
    const plano = await api.get<PlanoDetalhe>(`/portal-paciente/planos/${planoId}`)
    setPlanoSelecionado(plano)
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-bg px-4 pb-12 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Histórico de planos</h1>
        <Link to="/portal/plano" className="text-button-label text-primary">
          Ver plano
        </Link>
      </div>

      {!historico && <p className="mt-4 text-body-sm text-ink-muted">Carregando...</p>}

      {historico && historico.length === 0 && (
        <p className="mt-4 rounded-md bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
          Nenhum plano cadastrado ainda.
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {historico?.map((versao) => (
          <li key={versao.id} className="rounded-lg bg-surface p-3 shadow-sm">
            <button
              type="button"
              onClick={() => abrir(versao.id)}
              className="w-full text-left text-body-sm text-ink"
            >
              {new Date(versao.criadoEm).toLocaleDateString('pt-BR')}
              {versao.ativo && ' (atual)'} — {versao.totalRefeicoes} refeição(ões)
            </button>
            {selecionado === versao.id && planoSelecionado && (
              <div className="mt-3">
                <PlanoRefeicoesView refeicoes={planoSelecionado.refeicoes} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
