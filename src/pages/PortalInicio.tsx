import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AntesDepoisCard } from '../components/portal/inicio/AntesDepoisCard'
import { HistoricoMedidasCard } from '../components/portal/inicio/HistoricoMedidasCard'
import { MeuCorpoCard } from '../components/portal/inicio/MeuCorpoCard'
import { PlanoDeHojeCard, type RefeicaoDeHoje } from '../components/portal/inicio/PlanoDeHojeCard'
import { ProgressaoCard } from '../components/portal/inicio/ProgressaoCard'
import { RegistrarMedidaModal } from '../components/portal/inicio/RegistrarMedidaModal'
import { Alert } from '../components/ui/alert'
import { api } from '../lib/api'
import { useAgora } from '../lib/hooks'
import { dataIsoLocal, ordenarCronologico, type MedidaDoPortal } from '../lib/medidas'
import { calcularProximaRefeicao } from '../lib/progressoDoDia'
import type { SexoSilhueta } from '../lib/silhueta'

type MeusDados = { nome: string; sexo: SexoSilhueta }
type PlanoResponse = { data: string; plano: { id: string; refeicoes: RefeicaoDeHoje[] } | null }

function saudacao(agora: Date) {
  const hora = agora.getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

function hojePorExtenso(agora: Date) {
  const texto = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(agora)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function Esqueleto({ altura, className }: { altura: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-surface-sunken ${className ?? ''}`}
      style={{ height: altura }}
    />
  )
}

// Tela onde o paciente cai ao entrar: o corpo (IMC e silhueta), o plano de hoje, a evolução
// das medidas e a comparação com o passado. Marcar refeições continua na aba Plano.
export function PortalInicio() {
  const agora = useAgora(true)
  const hoje = dataIsoLocal(agora)
  const [dados, setDados] = useState<MeusDados | null>(null)
  // Do mais antigo ao mais novo
  const [medidas, setMedidas] = useState<MedidaDoPortal[] | null>(null)
  const [erroMedidas, setErroMedidas] = useState(false)
  const [refeicoes, setRefeicoes] = useState<RefeicaoDeHoje[] | null | undefined>(undefined)
  const [erroPlano, setErroPlano] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [destaqueId, setDestaqueId] = useState<string | null>(null)
  const timerAviso = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timerAviso.current), [])

  const carregarMedidas = useCallback(async () => {
    try {
      setMedidas(ordenarCronologico(await api.get<MedidaDoPortal[]>('/portal-paciente/medicoes')))
      setErroMedidas(false)
    } catch {
      setErroMedidas(true)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    api
      .get<MeusDados>('/portal-paciente/me')
      .then((resposta) => ativo && setDados(resposta))
      .catch(() => ativo && setErroMedidas(true))
    api
      .get<PlanoResponse>(`/portal-paciente/plano?data=${dataIsoLocal()}`)
      .then((resposta) => ativo && setRefeicoes(resposta.plano?.refeicoes ?? null))
      .catch(() => ativo && setErroPlano(true))
    // Mesma chamada de carregarMedidas, mas descartando a resposta se a tela já foi fechada
    api
      .get<MedidaDoPortal[]>('/portal-paciente/medicoes')
      .then((resposta) => ativo && setMedidas(ordenarCronologico(resposta)))
      .catch(() => ativo && setErroMedidas(true))
    return () => {
      ativo = false
    }
  }, [])

  async function aoSalvarMedida(nova: MedidaDoPortal) {
    setRegistrando(false)
    await carregarMedidas()
    setDestaqueId(nova.id)
    setAviso('Medida registrada. Seus gráficos já foram atualizados.')
    clearTimeout(timerAviso.current)
    timerAviso.current = setTimeout(() => {
      setAviso(null)
      setDestaqueId(null)
    }, 4000)
  }

  const proxima = refeicoes ? calcularProximaRefeicao(refeicoes, agora) : null
  const primeiroNome = dados?.nome.trim().split(/\s+/)[0]
  const atual = medidas && medidas.length > 0 ? medidas[medidas.length - 1] : null
  const abrirRegistro = () => setRegistrando(true)

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1280px] bg-bg px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-ink">
            {saudacao(agora)}
            {primeiroNome ? `, ${primeiroNome}` : ''}
          </h1>
          <p className="text-body-sm text-ink-secondary">{hojePorExtenso(agora)}</p>
        </div>

        <button
          type="button"
          onClick={abrirRegistro}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-button-label text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
          Registrar medida
        </button>
      </div>

      <div role="status" className="mt-4 empty:hidden">
        {aviso && <Alert variant="success">{aviso}</Alert>}
      </div>

      {erroMedidas && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-danger-subtle px-4 py-3 text-body-sm text-on-danger-subtle">
          <p>Não foi possível carregar suas medidas.</p>
          <button
            type="button"
            onClick={() => {
              void carregarMedidas()
              api
                .get<MeusDados>('/portal-paciente/me')
                .then(setDados)
                .catch(() => setErroMedidas(true))
            }}
            className="min-h-11 rounded-md px-3 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
        {dados && medidas ? (
          <>
            <MeuCorpoCard
              sexo={dados.sexo}
              atual={atual}
              hoje={hoje}
              onRegistrar={abrirRegistro}
              className="lg:col-span-7"
            />
            <PlanoDeHojeCard
              hoje={hoje}
              refeicoes={refeicoes}
              proxima={proxima}
              erro={erroPlano}
              className="lg:col-span-5"
            />
            <ProgressaoCard medidas={medidas} onRegistrar={abrirRegistro} className="lg:col-span-7" />
            <AntesDepoisCard
              medidas={medidas}
              sexo={dados.sexo}
              onRegistrar={abrirRegistro}
              className="lg:col-span-5"
            />
            <HistoricoMedidasCard medidas={medidas} destaqueId={destaqueId} className="lg:col-span-12" />
          </>
        ) : (
          !erroMedidas && (
            <>
              <Esqueleto altura={400} className="lg:col-span-7" />
              <Esqueleto altura={400} className="lg:col-span-5" />
              <Esqueleto altura={380} className="lg:col-span-7" />
              <Esqueleto altura={380} className="lg:col-span-5" />
            </>
          )
        )}
      </div>

      {registrando && (
        <RegistrarMedidaModal
          alturaSugerida={atual?.alturaCm ?? null}
          onFechar={() => setRegistrando(false)}
          onSalvo={(nova) => void aoSalvarMedida(nova)}
        />
      )}
    </main>
  )
}
