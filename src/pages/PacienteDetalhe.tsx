import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnotacoesConsulta } from '../components/AnotacoesConsulta'
import { AnamneseResumo } from '../components/AnamneseResumo'
import { MedicoesHistorico } from '../components/MedicoesHistorico'
import { ObjetivosSelect } from '../components/ObjetivosSelect'
import { PlanoEditor } from '../components/PlanoEditor'
import { api } from '../lib/api'

type Sexo = 'FEMININO' | 'MASCULINO'

type Paciente = {
  id: string
  nome: string
  contato: string
  sexo: Sexo
  dataNascimento: string
  cpf: string
  objetivos: { id: string; nome: string }[]
  observacoesObjetivo: string | null
  cadastroConcluido: boolean
  convite: { token: string; expiraEm: string } | null
}

function linkDoConvite(token: string): string {
  return `${window.location.origin}/portal/cadastro/${token}`
}

export function PacienteDetalhe() {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const navigate = useNavigate()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [editando, setEditando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const [nome, setNome] = useState('')
  const [contato, setContato] = useState('')
  const [sexo, setSexo] = useState<Sexo>('FEMININO')
  const [dataNascimento, setDataNascimento] = useState('')
  const [objetivos, setObjetivos] = useState<string[]>([])
  const [observacoesObjetivo, setObservacoesObjetivo] = useState('')

  useEffect(() => {
    if (!pacienteId) return
    api.get<Paciente>(`/pacientes/${pacienteId}`).then(carregarFormulario)
  }, [pacienteId])

  function carregarFormulario(dados: Paciente) {
    setPaciente(dados)
    setNome(dados.nome)
    setContato(dados.contato)
    setSexo(dados.sexo)
    setDataNascimento(dados.dataNascimento.slice(0, 10))
    setObjetivos(dados.objetivos.map((objetivo) => objetivo.id))
    setObservacoesObjetivo(dados.observacoesObjetivo ?? '')
  }

  async function gerarNovoLink() {
    if (!pacienteId) return
    setErro(null)
    try {
      const atualizado = await api.post<Paciente>(`/pacientes/${pacienteId}/convite`)
      setPaciente(atualizado)
      setCopiado(false)
    } catch {
      setErro('Não foi possível gerar um novo link.')
    }
  }

  async function copiarLink(token: string) {
    await navigator.clipboard.writeText(linkDoConvite(token))
    setCopiado(true)
  }

  async function salvar(event: FormEvent) {
    event.preventDefault()
    if (!pacienteId) return
    setErro(null)
    setSalvando(true)

    try {
      const atualizado = await api.patch<Paciente>(`/pacientes/${pacienteId}`, {
        nome,
        contato,
        sexo,
        dataNascimento,
        objetivoIds: objetivos,
        observacoesObjetivo: observacoesObjetivo || null,
      })
      carregarFormulario(atualizado)
      setEditando(false)
    } catch {
      setErro('Não foi possível salvar as alterações.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir() {
    if (!pacienteId) return
    setErro(null)
    try {
      await api.delete(`/pacientes/${pacienteId}`)
      navigate('/pacientes')
    } catch {
      setErro('Não foi possível excluir o paciente.')
      setConfirmandoExclusao(false)
    }
  }

  if (!paciente) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="text-body-sm text-ink-muted">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="rounded-lg bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-h1 text-ink">{paciente.nome}</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (editando) carregarFormulario(paciente)
                setEditando((atual) => !atual)
              }}
              className="rounded-md border border-border px-3 py-2 text-button-label text-ink"
            >
              {editando ? 'Cancelar' : 'Editar'}
            </button>
            {confirmandoExclusao ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(false)}
                  className="rounded-md border border-border px-3 py-2 text-button-label text-ink"
                >
                  Manter
                </button>
                <button
                  type="button"
                  onClick={excluir}
                  className="rounded-md bg-danger px-3 py-2 text-button-label text-on-primary"
                >
                  Confirmar exclusão
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoExclusao(true)}
                className="rounded-md border border-danger px-3 py-2 text-button-label text-danger"
              >
                Excluir
              </button>
            )}
          </div>
        </div>

        {confirmandoExclusao && (
          <p className="mt-4 rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-on-warning-subtle">
            Isso apaga o paciente e todos os planos, consultas e registros dele. Não pode ser
            desfeito.
          </p>
        )}

        {erro && (
          <p className="mt-4 rounded-sm bg-danger-subtle px-3 py-2 text-body-sm text-on-danger-subtle">
            Erro: {erro}
          </p>
        )}

        {editando ? (
          <form onSubmit={salvar} className="mt-4 flex flex-col gap-3">
            <input
              className="rounded-sm border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
            <div className="flex gap-3">
              <input
                className="w-1/2 rounded-sm border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                type="date"
                value={dataNascimento}
                onChange={(event) => setDataNascimento(event.target.value)}
              />
              <select
                className="w-1/2 rounded-sm border border-border px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                value={sexo}
                onChange={(event) => setSexo(event.target.value as Sexo)}
              >
                <option value="FEMININO">Feminino</option>
                <option value="MASCULINO">Masculino</option>
              </select>
            </div>
            <input
              className="rounded-sm border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              type="text"
              value={contato}
              onChange={(event) => setContato(event.target.value)}
            />
            <ObjetivosSelect value={objetivos} onChange={setObjetivos} />
            <textarea
              className="rounded-sm border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              placeholder="Observações sobre o objetivo (opcional)"
              rows={2}
              value={observacoesObjetivo}
              onChange={(event) => setObservacoesObjetivo(event.target.value)}
            />
            <button
              type="submit"
              disabled={salvando}
              className="self-start rounded-md bg-primary px-3 py-2 text-button-label text-on-primary disabled:opacity-50"
            >
              Salvar
            </button>
          </form>
        ) : (
          <dl className="mt-4 grid grid-cols-2 gap-4 text-body-sm">
            <div>
              <dt className="text-label text-ink-secondary">CPF</dt>
              <dd className="text-ink">{paciente.cpf}</dd>
            </div>
            <div>
              <dt className="text-label text-ink-secondary">Nascimento / Sexo</dt>
              <dd className="text-ink">
                {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}{' '}
                / {paciente.sexo === 'FEMININO' ? 'Feminino' : 'Masculino'}
              </dd>
            </div>
            <div>
              <dt className="text-label text-ink-secondary">Contato</dt>
              <dd className="text-ink">{paciente.contato}</dd>
            </div>
            <div>
              <dt className="text-label text-ink-secondary">Objetivo</dt>
              <dd className="text-ink">
                {paciente.objetivos.map((objetivo) => objetivo.nome).join(', ')}
              </dd>
            </div>
            {paciente.observacoesObjetivo && (
              <div className="col-span-2">
                <dt className="text-label text-ink-secondary">Observações</dt>
                <dd className="text-ink">{paciente.observacoesObjetivo}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <div className="mt-6">
        <MedicoesHistorico contexto="profissional" pacienteId={paciente.id} />
      </div>

      <div className="mt-6">
        <AnamneseResumo pacienteId={paciente.id} />
      </div>

      <div className="mt-6">
        <AnotacoesConsulta pacienteId={paciente.id} />
      </div>

      <div className="mt-6 rounded-lg bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 text-ink">Acesso ao portal</h2>
          <span
            className={
              paciente.cadastroConcluido
                ? 'rounded-sm bg-primary-subtle px-2 py-1 text-caption text-on-primary-subtle'
                : 'rounded-sm bg-warning-subtle px-2 py-1 text-caption text-on-warning-subtle'
            }
          >
            {paciente.cadastroConcluido ? 'Senha criada' : 'Aguardando cadastro'}
          </span>
        </div>

        {paciente.convite ? (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-body-sm text-ink-secondary">
              Envie este link ao paciente para ele {paciente.cadastroConcluido ? 'redefinir' : 'criar'}{' '}
              a senha. Válido até{' '}
              {new Date(paciente.convite.expiraEm).toLocaleDateString('pt-BR')}.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={linkDoConvite(paciente.convite.token)}
                onFocus={(event) => event.target.select()}
                className="min-w-0 flex-1 rounded-sm border border-border bg-surface-sunken px-3 py-2 text-body-sm text-ink"
              />
              <button
                type="button"
                onClick={() => copiarLink(paciente.convite!.token)}
                className="rounded-md bg-primary px-3 py-2 text-button-label text-on-primary"
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-body-sm text-ink-secondary">
            {paciente.cadastroConcluido
              ? 'O paciente já criou a senha. Se ele esquecer, gere um novo link para redefinir.'
              : 'O link de cadastro expirou. Gere um novo para enviar ao paciente.'}
          </p>
        )}

        <button
          type="button"
          onClick={gerarNovoLink}
          className="mt-3 rounded-md border border-border px-3 py-2 text-button-label text-ink"
        >
          Gerar novo link
        </button>
      </div>

      <div className="mt-6 rounded-lg bg-surface p-6 shadow-sm">
        <PlanoEditor pacienteId={paciente.id} />
      </div>
    </main>
  )
}
