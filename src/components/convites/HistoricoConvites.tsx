import { Ban, ChevronLeft, ChevronRight, RefreshCw, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, api } from '../../lib/api'
import {
  CONVITES_PATH,
  FILTROS_DE_STATUS,
  IDENTIFICACAO_MAX,
  STATUS_CONVITE,
  caminhoDoHistorico,
  estadoDoHistorico,
  faixaExibida,
  formatarDataHora,
  paginaParaVoltar,
  paginasCompactas,
  tempoRestante,
  totalDePaginas,
  type ConviteDoHistorico,
  type ConviteGerado,
  type PaginaDeConvites,
  type StatusConvite,
} from '../../lib/convitesAutocadastro'
import { useAgora } from '../../lib/hooks'
import { criarControleDeRequisicoes, criarDebounce } from '../../lib/requisicaoRecente'
import { Alert } from '../ui/alert'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Modal } from '../ui/modal'

const ESPERA_BUSCA_MS = 300
// Alvo de toque de 44px no mobile; mais compacto na tabela do desktop
const ALVO_TOQUE = 'min-h-11 md:min-h-9'

function mensagemDeErro(error: unknown, padrao: string) {
  return error instanceof ApiError && error.mensagens[0] ? error.mensagens[0] : padrao
}

// Histórico dos links da nutricionista logada (o backend filtra por ela), 10 por página.
// Busca e filtro de status rodam no servidor. `versao` muda quando um link novo é gerado:
// a lista volta para a página 1, sem filtros, e a linha `destaqueId` pisca de leve.
export function HistoricoConvites({
  versao,
  destaqueId,
  onNovoLink,
}: {
  versao: number
  destaqueId: string | null
  onNovoLink: (convite: ConviteGerado) => void
}) {
  const [busca, setBusca] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')
  const [status, setStatus] = useState<StatusConvite | ''>('')
  const [page, setPage] = useState(1)
  const [recarga, setRecarga] = useState(0)
  const [resultado, setResultado] = useState<{ chave: string; dados: PaginaDeConvites } | null>(null)
  const [erro, setErro] = useState<{ chave: string; mensagem: string } | null>(null)
  const [totalGeral, setTotalGeral] = useState<number | null>(null)
  const [erroAcao, setErroAcao] = useState<string | null>(null)
  const [emAndamento, setEmAndamento] = useState<string | null>(null)
  const [revogando, setRevogando] = useState<ConviteDoHistorico | null>(null)
  const campoBusca = useRef<HTMLInputElement>(null)
  const [controle] = useState(criarControleDeRequisicoes)
  const [debounce] = useState(() =>
    criarDebounce((texto: string) => {
      setBuscaAplicada(texto.trim())
      setPage(1)
    }, ESPERA_BUSCA_MS),
  )

  // Link novo gerado (aqui ou no formulário): volta ao início, sem filtros
  const [versaoVista, setVersaoVista] = useState(versao)
  if (versaoVista !== versao) {
    setVersaoVista(versao)
    setBusca('')
    setBuscaAplicada('')
    setStatus('')
    setPage(1)
  }

  const chave = `${page}|${buscaAplicada}|${status}|${recarga}|${versao}`

  useEffect(() => {
    const requisicao = controle.nova()
    api
      .get<PaginaDeConvites>(caminhoDoHistorico({ page, q: buscaAplicada, status }), {
        signal: requisicao.signal,
      })
      .then((dados) => {
        if (!requisicao.ehAtual()) return
        const voltarPara = paginaParaVoltar(dados)
        if (voltarPara !== null) {
          setPage(voltarPara)
          return
        }
        setResultado({ chave, dados })
        if (!buscaAplicada && !status) setTotalGeral(dados.total)
      })
      .catch((error: unknown) => {
        if (!requisicao.ehAtual()) return
        setErro({ chave, mensagem: mensagemDeErro(error, 'Não foi possível carregar os links.') })
      })
  }, [controle, chave, page, buscaAplicada, status])

  useEffect(
    () => () => {
      debounce.cancelar()
      controle.cancelar()
    },
    [debounce, controle],
  )

  const pagina = resultado?.dados ?? null
  const erroAtual = erro?.chave === chave ? erro.mensagem : null
  const atualizando = resultado?.chave !== chave && !erroAtual
  const comFiltro = buscaAplicada !== '' || status !== ''
  const estado = estadoDoHistorico({ pagina, erro: erroAtual !== null, comFiltro })
  const agora = useAgora(pagina?.items.some((item) => item.status === 'pendente') ?? false)

  function aoDigitar(texto: string) {
    setBusca(texto)
    debounce.chamar(texto)
  }

  function limparBusca() {
    debounce.cancelar()
    setBusca('')
    setBuscaAplicada('')
    setPage(1)
    campoBusca.current?.focus()
  }

  function limparFiltros() {
    debounce.cancelar()
    setBusca('')
    setBuscaAplicada('')
    setStatus('')
    setPage(1)
  }

  async function confirmarRevogacao() {
    if (!revogando) return
    const alvo = revogando
    setEmAndamento(alvo.id)
    setErroAcao(null)
    try {
      await api.post<ConviteDoHistorico>(`${CONVITES_PATH}/${alvo.id}/revogar`)
    } catch (error) {
      setErroAcao(mensagemDeErro(error, 'Não foi possível revogar o link.'))
    } finally {
      setRevogando(null)
      setEmAndamento(null)
      // Recarrega a página atual; se ela ficar vazia (ex.: filtro "Pendentes"), volta uma
      setRecarga((atual) => atual + 1)
    }
  }

  async function gerarNovo(item: ConviteDoHistorico) {
    setEmAndamento(item.id)
    setErroAcao(null)
    try {
      onNovoLink(await api.post<ConviteGerado>(`${CONVITES_PATH}/${item.id}/gerar-novo`))
    } catch (error) {
      setErroAcao(mensagemDeErro(error, 'Não foi possível gerar um novo link.'))
      setRecarga((atual) => atual + 1)
    } finally {
      setEmAndamento(null)
    }
  }

  function acoes(item: ConviteDoHistorico) {
    if (item.status === 'usado') return <span className="text-body-sm text-ink-muted">—</span>
    const ocupado = emAndamento === item.id
    const nome = item.identificacao ?? 'sem identificação'
    return (
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        {item.status === 'pendente' && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => setRevogando(item)}
            aria-label={`Revogar link de ${nome}`}
            className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-body-sm text-danger transition-colors hover:bg-danger-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${ALVO_TOQUE}`}
          >
            <Ban size={16} strokeWidth={1.75} aria-hidden="true" />
            Revogar
          </button>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={ocupado}
          onClick={() => gerarNovo(item)}
          aria-label={`Gerar novo link para ${nome}`}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap ${ALVO_TOQUE}`}
        >
          <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
          {ocupado ? 'Gerando...' : 'Gerar novo'}
        </Button>
      </div>
    )
  }

  function expira(item: ConviteDoHistorico) {
    if (item.status !== 'pendente') return formatarDataHora(item.expiraEm)
    return <span title={formatarDataHora(item.expiraEm)}>em {tempoRestante(item.expiraEm, agora)}</span>
  }

  function paciente(item: ConviteDoHistorico) {
    return (
      <>
        {item.paciente ? (
          <Link to={`/pacientes/${item.paciente.id}`} className="font-semibold text-primary hover:underline">
            {item.paciente.nome}
          </Link>
        ) : (
          <span className="text-ink-muted">—</span>
        )}
        {item.usadoEm && (
          <span className="block text-caption text-ink-muted">Usado em {formatarDataHora(item.usadoEm)}</span>
        )}
      </>
    )
  }

  function identificacao(item: ConviteDoHistorico) {
    return item.identificacao ? (
      <span className="break-words text-ink">{item.identificacao}</span>
    ) : (
      <span className="italic text-ink-muted">Sem identificação</span>
    )
  }

  function selo(item: ConviteDoHistorico) {
    const { rotulo, classes } = STATUS_CONVITE[item.status]
    return (
      <span className={`inline-block whitespace-nowrap rounded-sm px-2 py-0.5 text-caption ${classes}`}>
        {rotulo}
      </span>
    )
  }

  const destaque = (item: ConviteDoHistorico) => (item.id === destaqueId ? 'destaque-linha' : '')
  const rotuloDoStatus = FILTROS_DE_STATUS.find((filtro) => filtro.valor === status)?.rotulo

  return (
    <section aria-labelledby="historico-links" className="mt-10">
      <h2 id="historico-links" className="text-h2 text-ink">
        Links gerados{totalGeral !== null && ` (${totalGeral})`}
      </h2>

      {/* Barra de ferramentas: busca à esquerda, filtro de status à direita */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="busca-links" className="sr-only">
            Buscar links
          </label>
          <Search
            size={18}
            strokeWidth={1.75}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="busca-links"
            ref={campoBusca}
            type="search"
            value={busca}
            maxLength={IDENTIFICACAO_MAX}
            onChange={(event) => aoDigitar(event.target.value)}
            placeholder="Buscar por identificação ou paciente"
            autoComplete="off"
            className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-11 text-body text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:h-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {busca && (
            <button
              type="button"
              onClick={limparBusca}
              aria-label="Limpar busca"
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md text-ink-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-10 md:w-10"
            >
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filtro-status" className="text-label text-ink-secondary">
            Status
          </label>
          <select
            id="filtro-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as StatusConvite | '')
              setPage(1)
            }}
            className="h-11 rounded-md border border-border bg-surface px-3 text-body text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:h-10"
          >
            {FILTROS_DE_STATUS.map((filtro) => (
              <option key={filtro.valor} value={filtro.valor}>
                {filtro.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div role="alert" className="mt-4 empty:hidden">
        {erroAcao && <Alert variant="error">{erroAcao}</Alert>}
      </div>

      {estado === 'carregando' && <EsqueletoDaLista />}

      {estado === 'erro' && (
        <Card className="mt-4 flex flex-col items-start gap-3 p-6">
          <Alert variant="error">{erroAtual}</Alert>
          <Button type="button" variant="secondary" onClick={() => setRecarga((atual) => atual + 1)}>
            Tentar novamente
          </Button>
        </Card>
      )}

      {estado === 'vazio' && (
        <Card className="mt-4 p-8 text-center">
          <p className="text-body font-semibold text-ink">Você ainda não gerou links</p>
          <p className="mt-1 text-body-sm text-ink-secondary">
            Os links que você gerar aparecem aqui, com o status de cada um.
          </p>
        </Card>
      )}

      {estado === 'sem-resultado' && (
        <Card className="mt-4 flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-body font-semibold text-ink">
            {buscaAplicada
              ? `Nenhum resultado para “${buscaAplicada}”${status ? ` em ${rotuloDoStatus?.toLowerCase()}` : ''}`
              : `Nenhum link em ${rotuloDoStatus?.toLowerCase()}`}
          </p>
          <Button type="button" variant="secondary" onClick={limparFiltros} className={ALVO_TOQUE}>
            {buscaAplicada ? 'Limpar busca' : 'Limpar filtro'}
          </Button>
        </Card>
      )}

      {estado === 'lista' && pagina && (
        <div aria-busy={atualizando} className={atualizando ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {/* Desktop: tabela */}
          <Card className="mt-4 hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <caption className="sr-only">Links de cadastro gerados, do mais recente para o mais antigo</caption>
                <thead className="whitespace-nowrap border-b border-border bg-surface-sunken text-label text-ink-secondary">
                  <tr>
                    <th scope="col" className="px-4 py-3">Identificação</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Criado em</th>
                    <th scope="col" className="px-4 py-3">Expira</th>
                    <th scope="col" className="px-4 py-3">Paciente</th>
                    <th scope="col" className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagina.items.map((item) => (
                    <tr key={item.id} className={`align-middle ${destaque(item)}`}>
                      <td className="max-w-[220px] px-4 py-3">{identificacao(item)}</td>
                      <td className="px-4 py-3">{selo(item)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-secondary">{formatarDataHora(item.criadoEm)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-secondary">{expira(item)}</td>
                      <td className="px-4 py-3">{paciente(item)}</td>
                      <td className="px-4 py-3">{acoes(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile: um cartão por link, com as mesmas informações e ações */}
          <ul aria-label="Links de cadastro gerados" className="mt-4 flex flex-col gap-3 md:hidden">
            {pagina.items.map((item) => (
              <li key={item.id}>
                <Card className={`flex flex-col gap-3 p-4 ${destaque(item)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-body">{identificacao(item)}</p>
                    {selo(item)}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-body-sm">
                    <div>
                      <dt className="text-caption text-ink-muted">Criado em</dt>
                      <dd className="text-ink-secondary">{formatarDataHora(item.criadoEm)}</dd>
                    </div>
                    <div>
                      <dt className="text-caption text-ink-muted">Expira</dt>
                      <dd className="text-ink-secondary">{expira(item)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-caption text-ink-muted">Paciente</dt>
                      <dd>{paciente(item)}</dd>
                    </div>
                  </dl>
                  {item.status !== 'usado' && acoes(item)}
                </Card>
              </li>
            ))}
          </ul>

          <Paginacao pagina={pagina} onIrPara={setPage} />
        </div>
      )}

      {/* Contagem anunciada a leitores de tela a cada busca, filtro ou troca de página */}
      <p aria-live="polite" className="sr-only">
        {estado === 'lista' && pagina ? faixaExibida(pagina) : estado === 'sem-resultado' ? 'Nenhum resultado' : ''}
      </p>

      {revogando && (
        <Modal onClose={() => emAndamento === null && setRevogando(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="revogar-titulo" aria-describedby="revogar-texto">
            <h2 id="revogar-titulo" className="text-h3 text-ink">
              Revogar este link?
            </h2>
            <p id="revogar-texto" className="mt-2 text-body-sm text-ink-secondary">
              {revogando.identificacao ? `O link de ${revogando.identificacao}` : 'O link'} para de funcionar na
              hora e ninguém mais consegue se cadastrar com ele. Não dá para desfazer, mas você pode gerar um
              novo depois.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                autoFocus
                disabled={emAndamento !== null}
                onClick={() => setRevogando(null)}
                className={ALVO_TOQUE}
              >
                Cancelar
              </Button>
              <button
                type="button"
                disabled={emAndamento !== null}
                onClick={confirmarRevogacao}
                className={`rounded-md bg-danger px-3 py-2 text-button-label text-on-primary transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${ALVO_TOQUE}`}
              >
                {emAndamento ? 'Revogando...' : 'Revogar link'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

function Paginacao({ pagina, onIrPara }: { pagina: PaginaDeConvites; onIrPara: (page: number) => void }) {
  const total = totalDePaginas(pagina.total, pagina.pageSize)
  const classeBotao = `inline-flex min-w-11 items-center justify-center gap-1 rounded-md px-2.5 text-body-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 md:min-w-9 ${ALVO_TOQUE}`

  return (
    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-body-sm text-ink-secondary">{faixaExibida(pagina)}</p>
      {total > 1 && (
        <nav aria-label="Paginação">
          <ul className="flex flex-wrap items-center justify-center gap-1">
            <li>
              <button
                type="button"
                onClick={() => onIrPara(pagina.page - 1)}
                disabled={pagina.page <= 1}
                aria-label="Página anterior"
                className={`${classeBotao} text-primary hover:bg-primary-subtle`}
              >
                <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            </li>
            {paginasCompactas(pagina.page, total).map((numero, indice) =>
              numero === 'reticencias' ? (
                <li key={`reticencias-${indice}`} aria-hidden="true" className="px-1 text-ink-muted">
                  …
                </li>
              ) : (
                <li key={numero}>
                  <button
                    type="button"
                    onClick={() => onIrPara(numero)}
                    aria-label={`Página ${numero}`}
                    aria-current={numero === pagina.page ? 'page' : undefined}
                    className={`${classeBotao} ${
                      numero === pagina.page
                        ? 'bg-primary font-semibold text-on-primary'
                        : 'text-ink hover:bg-surface-sunken'
                    }`}
                  >
                    {numero}
                  </button>
                </li>
              ),
            )}
            <li>
              <button
                type="button"
                onClick={() => onIrPara(pagina.page + 1)}
                disabled={pagina.page >= total}
                aria-label="Próxima página"
                className={`${classeBotao} text-primary hover:bg-primary-subtle`}
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

// Mesma altura da lista com 10 linhas: a tela não pula quando os dados chegam
function EsqueletoDaLista() {
  const linhas = Array.from({ length: 10 }, (_, indice) => indice)
  return (
    <div role="status" aria-label="Carregando links" className="mt-4">
      <Card className="hidden md:block">
        <div className="h-[45px] border-b border-border bg-surface-sunken" />
        <div className="divide-y divide-border">
          {linhas.map((linha) => (
            <div key={linha} className="flex h-[61px] items-center gap-6 px-4">
              <div className="h-3 w-40 animate-pulse rounded-sm bg-surface-sunken" />
              <div className="h-5 w-20 animate-pulse rounded-sm bg-surface-sunken" />
              <div className="h-3 w-28 animate-pulse rounded-sm bg-surface-sunken" />
              <div className="h-3 w-20 animate-pulse rounded-sm bg-surface-sunken" />
              <div className="ml-auto h-8 w-40 animate-pulse rounded-sm bg-surface-sunken" />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col gap-3 md:hidden">
        {linhas.slice(0, 4).map((linha) => (
          <Card key={linha} className="flex h-[180px] flex-col gap-3 p-4">
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-surface-sunken" />
            <div className="h-3 w-3/4 animate-pulse rounded-sm bg-surface-sunken" />
            <div className="h-3 w-2/3 animate-pulse rounded-sm bg-surface-sunken" />
            <div className="mt-auto h-11 w-40 animate-pulse rounded-sm bg-surface-sunken" />
          </Card>
        ))}
      </div>
      {/* Espaço do rodapé de paginação */}
      <div className="mt-4 h-[31px]" />
      <span className="sr-only">Carregando links…</span>
    </div>
  )
}
