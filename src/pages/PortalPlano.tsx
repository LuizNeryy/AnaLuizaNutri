import { useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BaixarPlanoPdf } from '../components/BaixarPlanoPdf'
import { DadosDoPlanoCard } from '../components/portal/DadosDoPlanoCard'
import { ProgressoCard } from '../components/portal/ProgressoCard'
import { ProximaRefeicaoCard } from '../components/portal/ProximaRefeicaoCard'
import { ResumoCompacto } from '../components/portal/ResumoCompacto'
import { SequenciaCard } from '../components/portal/SequenciaCard'
import { useStreak } from '../components/portal/useStreak'
import { Checkbox } from '../components/ui/checkbox'
import { api } from '../lib/api'
import { iconeDoAlimento } from '../lib/alimentoIcones'
import { useAgora, useMediaQuery } from '../lib/hooks'
import { calcularProgresso, calcularProximaRefeicao } from '../lib/progressoDoDia'
import { temaDaRefeicao } from '../lib/refeicaoTema'
import { TOPO_DO_PORTAL_PX } from '../lib/topbar'

type ItemPlano = {
  id: string
  quantidade: number
  unidade: string
  alimento: { id: string; nome: string; icone: string | null }
  consumido: boolean
  // kcal do item na quantidade prescrita. O portal ainda NÃO envia: sem ele em todos os
  // itens do dia, o progresso usa o modo refeições.
  kcal?: number | null
}

type PlanoResumo = { id: string; criadoEm: string }

type RefeicaoPlano = {
  id: string
  nome: string
  horario: string
  itens: ItemPlano[]
}

type PlanoResponse = {
  data: string
  plano: { id: string; refeicoes: RefeicaoPlano[] } | null
}

function paraIso(date: Date): string {
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function diasDaSemana(): { iso: string; diaSemana: string; diaMes: number }[] {
  const hoje = new Date()
  const dias = []

  for (let offset = -3; offset <= 3; offset++) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() + offset)
    dias.push({
      iso: paraIso(data),
      diaSemana: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
        .format(data)
        .replace('.', ''),
      diaMes: data.getDate(),
    })
  }

  return dias
}

// "Segunda-feira, 5 de outubro"
function diaPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(ano, mes - 1, dia))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function plural(quantidade: number, singular: string, plural: string) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`
}

function resumoDoPlano(plano: NonNullable<PlanoResponse['plano']>): string {
  const alimentos = plano.refeicoes.reduce((total, refeicao) => total + refeicao.itens.length, 0)
  return `${plural(plano.refeicoes.length, 'refeição', 'refeições')} · ${plural(alimentos, 'alimento', 'alimentos')}`
}

export function PortalPlano() {
  const [dias] = useState(diasDaSemana)
  const [diaSelecionado, setDiaSelecionado] = useState(() => paraIso(new Date()))
  const [plano, setPlano] = useState<PlanoResponse['plano']>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    setCarregando(true)
    setErro(null)

    api
      .get<PlanoResponse>(`/portal-paciente/plano?data=${diaSelecionado}`)
      .then((resposta) => setPlano(resposta.plano))
      .catch(() => setErro('Não foi possível carregar o plano alimentar.'))
      .finally(() => setCarregando(false))
  }, [diaSelecionado])

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // Abaixo de 768px a navegação ocupa uma segunda linha no topo fixo
  const HEADER_PX = useMediaQuery('(min-width: 768px)') ? TOPO_DO_PORTAL_PX.barra : TOPO_DO_PORTAL_PX.comAbas
  const reduceMotion = useReducedMotion()
  const hoje = paraIso(new Date())
  const ehHoje = diaSelecionado === hoje
  const rotuloDoDia = ehHoje ? 'de hoje' : `de ${diaPorExtenso(diaSelecionado).toLowerCase()}`

  // Derivado do MESMO estado dos checkboxes: um check revertido volta o anel junto
  const progresso = useMemo(() => calcularProgresso(plano?.refeicoes ?? null), [plano])

  const assinaturaChecks = carregando
    ? null
    : (plano?.refeicoes
        .flatMap((refeicao) => refeicao.itens.filter((item) => item.consumido).map((item) => item.id))
        .join(',') ?? '')
  const streak = useStreak(diaSelecionado, assinaturaChecks)

  const agora = useAgora(ehHoje)
  const proxima = ehHoje && plano ? calcularProximaRefeicao(plano.refeicoes, agora) : null

  const [planos, setPlanos] = useState<PlanoResumo[]>([])
  useEffect(() => {
    api
      .get<PlanoResumo[]>('/portal-paciente/planos')
      .then(setPlanos)
      .catch(() => setPlanos([]))
  }, [])
  const emitidoEm = plano ? (planos.find((item) => item.id === plano.id)?.criadoEm ?? null) : null

  function irParaRefeicao(refeicaoId: string) {
    document
      .getElementById(`refeicao-${refeicaoId}`)
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  async function alternarConsumo(item: ItemPlano) {
    if (!plano) return

    const novoValor = !item.consumido

    setPlano({
      ...plano,
      refeicoes: plano.refeicoes.map((refeicao) => ({
        ...refeicao,
        itens: refeicao.itens.map((itemAtual) =>
          itemAtual.id === item.id ? { ...itemAtual, consumido: novoValor } : itemAtual,
        ),
      })),
    })

    try {
      await api.post(`/portal-paciente/plano/itens/${item.id}/consumo`, {
        data: diaSelecionado,
        consumido: novoValor,
      })
    } catch {
      setPlano((atual) =>
        atual === null
          ? atual
          : {
              ...atual,
              refeicoes: atual.refeicoes.map((refeicao) => ({
                ...refeicao,
                itens: refeicao.itens.map((itemAtual) =>
                  itemAtual.id === item.id ? { ...itemAtual, consumido: item.consumido } : itemAtual,
                ),
              })),
            },
      )
      setErro('Não foi possível salvar. Tente novamente.')
    }
  }

  const resumoDoDia = plano && (
    <>
      <h2 className="text-h2 text-ink">{diaPorExtenso(diaSelecionado)}</h2>
      <p className="text-body-sm text-ink-secondary">{resumoDoPlano(plano)}</p>
    </>
  )

  // PDF do plano inteiro: a key limpa o erro ao trocar de data
  const baixarPdf = <BaixarPlanoPdf key={diaSelecionado} />

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1120px] bg-bg px-4 pb-12 pt-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,640px)_320px] lg:items-start lg:justify-center lg:gap-12 xl:gap-16">
      <div className="mx-auto w-full max-w-[640px] lg:mx-0">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Seu plano alimentar</h1>
        <Link to="/portal/perfil" className="text-button-label text-primary">
          Meus dados
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Link to="/portal/planos-historico" className="text-body-sm text-primary">
          Histórico de planos
        </Link>
        <input
          type="date"
          value={diaSelecionado}
          onChange={(event) => setDiaSelecionado(event.target.value)}
          className="rounded-sm border border-border px-2 py-1 text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        />
      </div>

      <div className="mt-3 flex justify-between gap-1.5">
        {dias.map((dia) => {
          const selecionado = dia.iso === diaSelecionado
          return (
            <button
              key={dia.iso}
              type="button"
              onClick={() => setDiaSelecionado(dia.iso)}
              className={
                'flex flex-1 flex-col items-center gap-0.5 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ' +
                (selecionado
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface text-ink-secondary shadow-sm')
              }
            >
              <span className="text-caption uppercase">{dia.diaSemana}</span>
              <span className="text-h3">{dia.diaMes}</span>
            </button>
          )
        })}
      </div>

      {!isDesktop && (
        <ResumoCompacto
          progresso={progresso}
          carregando={carregando}
          dia={diaSelecionado}
          rotuloDoDia={rotuloDoDia}
          streak={streak}
          proxima={proxima}
          onIrParaRefeicao={irParaRefeicao}
        />
      )}

      {erro && (
        <p className="mt-4 rounded-sm bg-danger-subtle px-3 py-2 text-body-sm text-on-danger-subtle">
          Erro: {erro}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {carregando && <p className="text-body-sm text-ink-muted">Carregando...</p>}

        {!carregando && !plano && (
          <p className="rounded-md bg-surface-sunken px-4 py-3 text-body-sm text-ink-secondary">
            Nenhum plano alimentar cadastrado ainda.
          </p>
        )}

        {/* Desktop: o botão de PDF vai para o card "Dados do plano" do painel */}
        {!carregando &&
          plano &&
          (isDesktop ? (
            <div>{resumoDoDia}</div>
          ) : (
            <BaixarPlanoPdf key={diaSelecionado} resumo={resumoDoDia} />
          ))}

        {!carregando &&
          plano?.refeicoes.map((refeicao) => {
            const tema = temaDaRefeicao(refeicao.nome)
            const IconeRefeicao = tema.Icon

            return (
              <section
                key={refeicao.id}
                id={`refeicao-${refeicao.id}`}
                style={{ scrollMarginTop: HEADER_PX + 16 }}
                className="overflow-hidden rounded-lg bg-surface shadow-sm"
              >
                <div className={`flex items-center justify-between gap-3 px-4 py-3 ${tema.headerBg}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tema.badgeBg} ${tema.badgeText}`}>
                      <IconeRefeicao size={18} />
                    </span>
                    <h2 className="text-h3 text-ink">{refeicao.nome}</h2>
                  </div>
                  <span className="text-caption text-ink-muted">{refeicao.horario}</span>
                </div>

                {refeicao.itens.length === 0 && (
                  <p className="p-4 text-body-sm text-ink-secondary">
                    Nenhum alimento cadastrado nesta refeição
                  </p>
                )}

                <ul className="flex flex-col gap-3 p-4 empty:hidden">
                  {refeicao.itens.map((item) => {
                    const IconeAlimento = iconeDoAlimento(item.alimento.icone)

                    return (
                      <li key={item.id} className="flex items-center gap-3">
                        <Checkbox
                          checked={item.consumido}
                          onChange={() => alternarConsumo(item)}
                        />
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-secondary">
                          <IconeAlimento size={18} />
                        </span>
                        <div className={item.consumido ? 'opacity-50' : undefined}>
                          <p className="text-body text-ink">{item.alimento.nome}</p>
                          <p className="text-body-sm text-ink-secondary">
                            {item.quantidade} {item.unidade}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
      </div>

      {/* Mobile/tablet: dados do plano no fim da página (o PDF fica no bloco do dia) */}
      {!isDesktop && !carregando && plano && emitidoEm !== null && (
        <DadosDoPlanoCard emitidoEm={emitidoEm} className="mt-6" />
      )}
      </div>

      {isDesktop && (
        <aside
          aria-label="Resumo do dia"
          className="sticky flex flex-col gap-4 overflow-y-auto [scrollbar-width:thin]"
          style={{ top: HEADER_PX + 24, maxHeight: `calc(100vh - ${HEADER_PX + 48}px)` }}
        >
          <ProgressoCard
            progresso={progresso}
            carregando={carregando}
            dia={diaSelecionado}
            rotuloDoDia={rotuloDoDia}
          />
          {streak && <SequenciaCard streak={streak} />}
          {proxima && <ProximaRefeicaoCard info={proxima} onIrParaRefeicao={irParaRefeicao} />}
          {!carregando && plano && <DadosDoPlanoCard emitidoEm={emitidoEm} rodape={baixarPdf} />}
        </aside>
      )}
    </main>
  )
}
