import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { api, BASE_URL } from '../lib/api'
import { ICONES_ALIMENTO, iconeDoAlimento } from '../lib/alimentoIcones'
import { PlanoRefeicoesView } from './PlanoRefeicoesView'

type Alimento = {
  id: string
  nome: string
  grupoEquivalencia: string
  calorias: number
  proteina: number
  carboidrato: number
  gordura: number
  icone: string | null
}

type ItemPlano = {
  id: string
  quantidade: number
  unidade: string
  alimento: { id: string; nome: string; icone: string | null }
}

type RefeicaoPlano = {
  id: string
  nome: string
  horario: string
  itens: ItemPlano[]
}

type PlanoData = {
  id: string
  refeicoes: RefeicaoPlano[]
}

type HistoricoPlano = {
  id: string
  criadoEm: string
  ativo: boolean
  totalRefeicoes: number
}

function HistoricoPlanos({ pacienteId }: { pacienteId: string }) {
  const [historico, setHistorico] = useState<HistoricoPlano[] | null>(null)
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoData | null>(null)

  useEffect(() => {
    api.get<HistoricoPlano[]>(`/pacientes/${pacienteId}/planos`).then(setHistorico)
  }, [pacienteId])

  async function abrir(planoId: string) {
    if (selecionado === planoId) {
      setSelecionado(null)
      setPlanoSelecionado(null)
      return
    }
    setSelecionado(planoId)
    const plano = await api.get<PlanoData>(`/pacientes/${pacienteId}/planos/${planoId}`)
    setPlanoSelecionado(plano)
  }

  if (!historico || historico.length === 0) {
    return null
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <h2 className="text-h2 text-ink">Histórico de planos</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {historico.map((versao) => (
          <li key={versao.id}>
            <button
              type="button"
              onClick={() => abrir(versao.id)}
              className="w-full rounded-sm bg-surface-sunken px-3 py-2 text-left text-body-sm text-ink hover:bg-primary-subtle"
            >
              {new Date(versao.criadoEm).toLocaleDateString('pt-BR')}
              {versao.ativo && ' (atual)'} — {versao.totalRefeicoes} refeição(ões)
            </button>
            {selecionado === versao.id && planoSelecionado && (
              <div className="mt-2 pl-2">
                <PlanoRefeicoesView refeicoes={planoSelecionado.refeicoes} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function useDebounce(valor: string, atraso: number): string {
  const [debounced, setDebounced] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), atraso)
    return () => clearTimeout(timer)
  }, [valor, atraso])

  return debounced
}

function SeletorAlimento({ onEscolher }: { onEscolher: (alimento: Alimento) => void }) {
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<Alimento[]>([])
  const buscaDebounced = useDebounce(busca, 300)

  useEffect(() => {
    if (!buscaDebounced.trim()) {
      setResultados([])
      return
    }
    api
      .get<Alimento[]>(`/alimentos?busca=${encodeURIComponent(buscaDebounced)}`)
      .then(setResultados)
  }, [buscaDebounced])

  return (
    <div className="relative">
      <input
        className="w-full rounded-sm border border-border px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="text"
        placeholder="Buscar alimento..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />
      {resultados.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-sm border border-border bg-surface shadow-md">
          {resultados.map((alimento) => (
            <li key={alimento.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-body-sm hover:bg-surface-sunken"
                onClick={() => {
                  onEscolher(alimento)
                  setBusca('')
                  setResultados([])
                }}
              >
                {alimento.nome}
                <span className="ml-2 text-caption text-ink-muted">
                  {alimento.calorias} kcal/100g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SeletorIcone({
  alimento,
  onEscolher,
}: {
  alimento: Alimento
  onEscolher: (icone: string) => void
}) {
  const [aberto, setAberto] = useState(false)
  const IconeAtual = iconeDoAlimento(alimento.icone)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Escolher ícone do alimento"
        onClick={() => setAberto((atual) => !atual)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <IconeAtual size={18} />
      </button>

      {aberto && (
        <div className="absolute z-10 mt-1 grid w-56 grid-cols-6 gap-1 rounded-sm border border-border bg-surface p-2 shadow-md">
          {ICONES_ALIMENTO.map(({ chave, label, Icon }) => (
            <button
              key={chave}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => {
                onEscolher(chave)
                setAberto(false)
              }}
              className={
                'flex h-8 w-8 items-center justify-center rounded-sm hover:bg-surface-sunken focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ' +
                (alimento.icone === chave ? 'bg-primary-subtle text-on-primary-subtle' : 'text-ink-secondary')
              }
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function NovoItemForm({
  pacienteId,
  refeicaoId,
  onCriado,
}: {
  pacienteId: string
  refeicaoId: string
  onCriado: () => void
}) {
  const [alimento, setAlimento] = useState<Alimento | null>(null)
  const [quantidade, setQuantidade] = useState('')
  const [unidade, setUnidade] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function adicionar() {
    if (!alimento || !quantidade || !unidade) return
    setEnviando(true)
    try {
      await api.post(`/pacientes/${pacienteId}/refeicoes/${refeicaoId}/itens`, {
        alimentoId: alimento.id,
        quantidade: Number(quantidade),
        unidade,
      })
      setAlimento(null)
      setQuantidade('')
      setUnidade('')
      onCriado()
    } finally {
      setEnviando(false)
    }
  }

  async function escolherIcone(icone: string) {
    if (!alimento) return
    setAlimento({ ...alimento, icone })
    await api.patch(`/alimentos/${alimento.id}`, { icone })
  }

  return (
    <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-border pt-3">
      <div className="min-w-48 flex-1">
        {alimento ? (
          <div className="flex items-center justify-between gap-2 rounded-sm bg-surface-sunken px-3 py-2 text-body-sm">
            <div className="flex items-center gap-2">
              <SeletorIcone alimento={alimento} onEscolher={escolherIcone} />
              <span>{alimento.nome}</span>
            </div>
            <button type="button" className="text-ink-muted" onClick={() => setAlimento(null)}>
              trocar
            </button>
          </div>
        ) : (
          <SeletorAlimento onEscolher={setAlimento} />
        )}
      </div>
      <input
        className="w-24 rounded-sm border border-border px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="number"
        placeholder="Qtd."
        value={quantidade}
        onChange={(event) => setQuantidade(event.target.value)}
      />
      <input
        className="w-28 rounded-sm border border-border px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="text"
        placeholder="Unidade"
        value={unidade}
        onChange={(event) => setUnidade(event.target.value)}
      />
      <button
        type="button"
        disabled={!alimento || !quantidade || !unidade || enviando}
        onClick={adicionar}
        className="rounded-md bg-primary px-3 py-2 text-button-label text-on-primary disabled:opacity-50"
      >
        Adicionar
      </button>
    </div>
  )
}

function NovaRefeicaoForm({
  pacienteId,
  onCriada,
}: {
  pacienteId: string
  onCriada: () => void
}) {
  const [nome, setNome] = useState('')
  const [horario, setHorario] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function adicionar() {
    if (!nome || !horario) return
    setEnviando(true)
    try {
      await api.post(`/pacientes/${pacienteId}/refeicoes`, { nome, horario })
      setNome('')
      setHorario('')
      onCriada()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-4">
      <input
        className="min-w-40 flex-1 rounded-sm border border-border px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="text"
        placeholder="Nome da refeição (ex.: Café da manhã)"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />
      <input
        className="w-28 rounded-sm border border-border px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        type="time"
        value={horario}
        onChange={(event) => setHorario(event.target.value)}
      />
      <button
        type="button"
        disabled={!nome || !horario || enviando}
        onClick={adicionar}
        className="rounded-md bg-primary px-3 py-2 text-button-label text-on-primary disabled:opacity-50"
      >
        + Nova refeição
      </button>
    </div>
  )
}

export function PlanoEditor({ pacienteId }: { pacienteId: string }) {
  const [plano, setPlano] = useState<PlanoData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [confirmandoNovoPlano, setConfirmandoNovoPlano] = useState(false)
  const [historicoVersao, setHistoricoVersao] = useState(0)

  function recarregar() {
    return api
      .get<PlanoData | undefined>(`/pacientes/${pacienteId}/plano`)
      .then((dados) => setPlano(dados ?? null))
  }

  useEffect(() => {
    setCarregando(true)
    recarregar().finally(() => setCarregando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId])

  async function iniciarNovoPlano() {
    await api.post(`/pacientes/${pacienteId}/planos`)
    setConfirmandoNovoPlano(false)
    setHistoricoVersao((atual) => atual + 1)
    await recarregar()
  }

  async function excluirRefeicao(refeicaoId: string) {
    await api.delete(`/pacientes/${pacienteId}/refeicoes/${refeicaoId}`)
    recarregar()
  }

  async function excluirItem(refeicaoId: string, itemId: string) {
    await api.delete(`/pacientes/${pacienteId}/refeicoes/${refeicaoId}/itens/${itemId}`)
    recarregar()
  }

  if (carregando) {
    return <p className="text-body-sm text-ink-muted">Carregando plano alimentar...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-h2 text-ink">Plano alimentar</h2>
        <div className="flex items-center gap-3">
          <a
            href={`${BASE_URL}/pacientes/${pacienteId}/plano/pdf`}
            target="_blank"
            rel="noreferrer"
            className="text-body-sm text-primary"
          >
            Baixar PDF
          </a>
          {confirmandoNovoPlano ? (
            <button
              type="button"
              onClick={iniciarNovoPlano}
              className="rounded-md bg-danger px-3 py-2 text-button-label text-on-primary"
            >
              Confirmar novo plano
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmandoNovoPlano(true)}
              className="rounded-md border border-border px-3 py-2 text-button-label text-ink"
            >
              Novo plano
            </button>
          )}
        </div>
      </div>

      {(!plano || plano.refeicoes.length === 0) && (
        <p className="mt-2 text-body-sm text-ink-secondary">
          Nenhuma refeição cadastrada ainda.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {plano?.refeicoes.map((refeicao) => (
          <div key={refeicao.id} className="rounded-lg bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-h3 text-ink">{refeicao.nome}</h3>
                <p className="text-caption text-ink-muted">{refeicao.horario}</p>
              </div>
              <button
                type="button"
                aria-label="Excluir refeição"
                className="text-ink-muted hover:text-danger"
                onClick={() => excluirRefeicao(refeicao.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-2">
              {refeicao.itens.map((item) => {
                const IconeAlimento = iconeDoAlimento(item.alimento.icone)

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-sm bg-surface-sunken px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink-secondary">
                        <IconeAlimento size={16} />
                      </span>
                      <div>
                        <p className="text-body text-ink">{item.alimento.nome}</p>
                        <p className="text-body-sm text-ink-secondary">
                          {item.quantidade} {item.unidade}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Excluir item"
                      className="text-ink-muted hover:text-danger"
                      onClick={() => excluirItem(refeicao.id, item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>

            <NovoItemForm
              pacienteId={pacienteId}
              refeicaoId={refeicao.id}
              onCriado={recarregar}
            />
          </div>
        ))}
      </div>

      <NovaRefeicaoForm pacienteId={pacienteId} onCriada={recarregar} />

      <HistoricoPlanos key={historicoVersao} pacienteId={pacienteId} />
    </div>
  )
}
