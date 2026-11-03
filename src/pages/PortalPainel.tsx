import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PortalCard } from '../components/portal/PortalCard'
import { DistribuicaoMacros } from '../components/portal/painel/DistribuicaoMacros'
import { KcalPorRefeicao } from '../components/portal/painel/KcalPorRefeicao'
import { MacroCard } from '../components/portal/painel/MacroCard'
import { formatarNumero } from '../components/portal/painel/formato'
import { NumeroAnimado } from '../components/portal/painel/NumeroAnimado'
import { ProgressRing } from '../components/ui/progress-ring'
import { api } from '../lib/api'
import { calcularNutricao, MACROS } from '../lib/nutricaoDoDia'

type ItemPlano = {
  id: string
  consumido: boolean
  kcal: number | null
  proteina: number | null
  carboidrato: number | null
  gordura: number | null
}

type PlanoResponse = {
  data: string
  plano: { id: string; refeicoes: { id: string; nome: string; horario: string; itens: ItemPlano[] }[] } | null
}

function paraIso(date: Date): string {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function somarDias(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return paraIso(new Date(ano, mes - 1, dia + dias))
}

function diaPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const texto = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(ano, mes - 1, dia),
  )
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Painel de nutrientes do dia: kcal e macros do plano contra o que o paciente marcou como
// consumido na aba Plano. Só leitura; os checks continuam na aba Plano.
export function PortalPainel() {
  const hoje = paraIso(new Date())
  const [dia, setDia] = useState(hoje)
  const [resposta, setResposta] = useState<PlanoResponse | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  function mudarDia(novoDia: string) {
    setErro(null)
    setDia(novoDia)
  }

  useEffect(() => {
    let ativo = true
    api
      .get<PlanoResponse>(`/portal-paciente/plano?data=${dia}`)
      .then((dados) => {
        if (!ativo) return
        setResposta(dados)
        setErro(null)
      })
      .catch(() => ativo && setErro('Não foi possível carregar o painel.'))
    return () => {
      ativo = false
    }
  }, [dia])

  // Resposta de outro dia ainda na tela = carregando
  const carregando = resposta?.data !== dia && erro === null
  const plano = resposta?.data === dia ? resposta.plano : null
  const nutricao = useMemo(() => calcularNutricao(plano?.refeicoes ?? null), [plano])
  const ehHoje = dia === hoje
  const restante = nutricao ? Math.max(0, nutricao.plano.kcal - nutricao.consumido.kcal) : 0

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1120px] bg-bg px-4 pb-12 pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h1 text-ink">Seu painel</h1>
          <p className="text-body-sm text-ink-secondary">{diaPorExtenso(dia)}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Dia anterior"
            onClick={() => mudarDia(somarDias(dia, -1))}
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => mudarDia(hoje)}
            disabled={ehHoje}
            className="rounded-md px-3 py-2 text-button-label text-primary hover:bg-primary-subtle disabled:text-ink-muted disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Hoje
          </button>
          <button
            type="button"
            aria-label="Próximo dia"
            onClick={() => mudarDia(somarDias(dia, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {erro && (
        <p className="mt-4 rounded-sm bg-danger-subtle px-3 py-2 text-body-sm text-on-danger-subtle">Erro: {erro}</p>
      )}

      {carregando && <p className="mt-6 text-body-sm text-ink-muted">Carregando...</p>}

      {!carregando && !erro && !nutricao && (
        <p className="mt-6 rounded-md bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
          {plano
            ? 'Os alimentos deste plano não têm peso em gramas, então ainda não dá para calcular os nutrientes.'
            : 'Nenhum plano alimentar para este dia.'}
        </p>
      )}

      {!carregando && nutricao && (
        // key: trocar de dia remonta e anima tudo de novo a partir do zero
        <div key={dia} className="mt-6 grid gap-4 lg:grid-cols-3">
          <PortalCard className="flex flex-col items-center gap-5 sm:flex-row lg:col-span-2">
            <ProgressRing
              size={176}
              strokeWidth={14}
              value={nutricao.consumido.kcal / nutricao.plano.kcal}
              total={nutricao.plano.kcal}
              unitLabel={`de ${formatarNumero(nutricao.plano.kcal)} kcal`}
              ariaLabel={`${formatarNumero(nutricao.consumido.kcal)} de ${formatarNumero(nutricao.plano.kcal)} kcal consumidas ${ehHoje ? 'hoje' : 'no dia'}`}
              contextKey={dia}
              valueClassName="text-[34px]"
            />

            <div className="flex w-full flex-col gap-4 text-center sm:text-left">
              <div>
                <h2 className="text-label text-ink-secondary">Calorias {ehHoje ? 'de hoje' : 'do dia'}</h2>
                <p className="mt-1 text-body text-ink">
                  {nutricao.consumido.kcal === 0
                    ? 'Marque na aba Plano o que você comeu para acompanhar aqui.'
                    : restante < 1
                      ? 'Você completou as calorias do plano. Muito bem!'
                      : 'Siga o plano para completar o dia.'}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-surface-sunken px-3 py-2.5">
                  <dt className="text-caption text-ink-secondary">Consumidas</dt>
                  <dd className="text-h2 text-ink">
                    <NumeroAnimado valor={nutricao.consumido.kcal} /> <span className="text-body-sm">kcal</span>
                  </dd>
                </div>
                <div className="rounded-md bg-surface-sunken px-3 py-2.5">
                  <dt className="text-caption text-ink-secondary">Faltam</dt>
                  <dd className="text-h2 text-ink">
                    <NumeroAnimado valor={restante} atraso={0.15} /> <span className="text-body-sm">kcal</span>
                  </dd>
                </div>
              </dl>

              <Link to="/portal/plano" className="text-body-sm font-semibold text-primary hover:underline">
                Marcar refeições no plano →
              </Link>
            </div>
          </PortalCard>

          <div className="lg:row-span-2">
            <DistribuicaoMacros plano={nutricao.plano} className="h-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {MACROS.map((macro, indice) => (
              <MacroCard
                key={macro.chave}
                nome={macro.nome}
                cor={macro.cor}
                consumido={nutricao.consumido[macro.chave]}
                plano={nutricao.plano[macro.chave]}
                atraso={0.2 + indice * 0.12}
              />
            ))}
          </div>

          <div className="lg:col-span-3">
            <KcalPorRefeicao refeicoes={nutricao.refeicoes} />
          </div>

          {nutricao.itensSemPeso > 0 && (
            <p className="flex items-start gap-2 text-body-sm text-ink-secondary lg:col-span-3">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {nutricao.itensSemPeso === 1
                ? '1 alimento do plano não tem peso em gramas e ficou fora das contas.'
                : `${nutricao.itensSemPeso} alimentos do plano não têm peso em gramas e ficaram fora das contas.`}
            </p>
          )}
        </div>
      )}
    </main>
  )
}
