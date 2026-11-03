import { Clock, Link2, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HistoricoConvites } from '../components/convites/HistoricoConvites'
import { LinkGerado } from '../components/convites/LinkGerado'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ApiError, api } from '../lib/api'
import { CONVITES_PATH, IDENTIFICACAO_MAX, type ConviteGerado } from '../lib/convitesAutocadastro'

const PASSOS = [
  { titulo: 'Gere o link', texto: 'Se quiser, dê um nome só seu para reconhecê-lo depois no histórico.' },
  { titulo: 'Envie ao paciente', texto: 'Copie o link ou abra direto no WhatsApp com a mensagem pronta.' },
  { titulo: 'O paciente se cadastra', texto: 'Ele preenche os dados, cria a senha de acesso e aparece na sua lista de pacientes.' },
]

// RF-A6: a nutricionista não cadastra o paciente; ela gera um link de uso único (72 horas)
// e o paciente se cadastra sozinho pelo passo a passo de /cadastro.
export function PacienteNovo() {
  const [convite, setConvite] = useState<ConviteGerado | null>(null)
  const [identificacao, setIdentificacao] = useState('')
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [versaoHistorico, setVersaoHistorico] = useState(0)
  const [nomeNutricionista, setNomeNutricionista] = useState<string | null>(null)
  const [destaqueId, setDestaqueId] = useState<string | null>(null)
  const tituloDoLink = useRef<HTMLHeadingElement>(null)
  const timerDestaque = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timerDestaque.current), [])

  // Nome para a mensagem do WhatsApp; sem ele, a mensagem sai sem a apresentação
  useEffect(() => {
    api
      .get<{ nome: string }>('/auth/me')
      .then((dados) => setNomeNutricionista(dados.nome))
      .catch(() => setNomeNutricionista(null))
  }, [])

  function mostrarNovoLink(novo: ConviteGerado) {
    setConvite(novo)
    setErro(null)
    setVersaoHistorico((versao) => versao + 1)
    // A linha nova aparece destacada no topo do histórico por alguns segundos
    setDestaqueId(novo.id)
    clearTimeout(timerDestaque.current)
    timerDestaque.current = setTimeout(() => setDestaqueId(null), 3000)
    // Leva o foco (e a tela) até o link recém-gerado
    requestAnimationFrame(() => {
      tituloDoLink.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      tituloDoLink.current?.focus({ preventScroll: true })
    })
  }

  async function gerarLink(event: FormEvent) {
    event.preventDefault()
    setGerando(true)
    setErro(null)
    try {
      const rotulo = identificacao.trim()
      mostrarNovoLink(
        await api.post<ConviteGerado>(CONVITES_PATH, rotulo ? { identificacao: rotulo } : {}),
      )
    } catch (error) {
      setErro(
        error instanceof ApiError && error.status === 400 && error.mensagens[0]
          ? error.mensagens[0]
          : 'Não foi possível gerar o link. Tente novamente.',
      )
    } finally {
      setGerando(false)
    }
  }

  function gerarOutro() {
    setConvite(null)
    setIdentificacao('')
    setErro(null)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to="/pacientes" className="text-body-sm text-primary">
        ← Pacientes
      </Link>
      <h1 className="mt-3 text-h1 text-ink">Novo paciente</h1>
      <p className="mt-2 max-w-2xl text-body text-ink-secondary">
        Gere um link e envie para o paciente. Ele faz o cadastro sozinho e aparece na sua lista de
        pacientes ao concluir.
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
      <section aria-labelledby="secao-gerar-link" className="lg:col-span-7">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <h2
              id="secao-gerar-link"
              ref={tituloDoLink}
              tabIndex={-1}
              className="scroll-mt-24 text-h3 text-ink focus:outline-none"
            >
              {convite ? 'Link gerado' : 'Gerar link'}
            </h2>

            {!convite ? (
              <form onSubmit={gerarLink} className="flex flex-col gap-4" noValidate>
                <div>
                  <Input
                    label="Identificação do paciente (opcional)"
                    value={identificacao}
                    onChange={(event) => setIdentificacao(event.target.value)}
                    maxLength={IDENTIFICACAO_MAX}
                    placeholder="Ex.: Maria, indicação da Ana"
                    aria-describedby="identificacao-ajuda"
                    autoComplete="off"
                  />
                  <p id="identificacao-ajuda" className="mt-1 text-caption text-ink-muted">
                    Só para você reconhecer o link no histórico; não é o nome oficial do paciente.{' '}
                    {identificacao.length}/{IDENTIFICACAO_MAX}
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={gerando}
                  className="inline-flex items-center justify-center gap-2 self-start"
                >
                  <Link2 size={18} strokeWidth={1.75} aria-hidden="true" />
                  {gerando ? 'Gerando...' : 'Gerar link'}
                </Button>
              </form>
            ) : (
              <>
                <LinkGerado key={convite.id} convite={convite} nomeNutricionista={nomeNutricionista} />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={gerarOutro}
                  className="inline-flex items-center justify-center gap-2 self-start"
                >
                  <RefreshCw size={18} strokeWidth={1.75} aria-hidden="true" />
                  Gerar link para outro paciente
                </Button>
              </>
            )}

            <div role="alert" className="empty:hidden">
              {erro && <Alert variant="error">{erro}</Alert>}
            </div>
          </CardContent>
        </Card>
      </section>

      <aside aria-labelledby="secao-como-funciona" className="lg:col-span-5">
        <Card>
          <CardContent className="pt-6">
            <h2 id="secao-como-funciona" className="text-h3 text-ink">
              Como funciona
            </h2>
            <ol className="mt-4 flex flex-col gap-4">
              {PASSOS.map((passo, indice) => (
                <li key={passo.titulo} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label text-on-primary-subtle"
                  >
                    {indice + 1}
                  </span>
                  <div>
                    <p className="text-body-sm font-semibold text-ink">{passo.titulo}</p>
                    <p className="text-body-sm text-ink-secondary">{passo.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-start gap-2 rounded-md bg-surface-sunken px-3 py-2.5 text-body-sm text-ink-secondary">
              <Clock size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
              Cada link vale por 72 horas e serve para um paciente só.
            </p>
          </CardContent>
        </Card>
      </aside>
      </div>

      <HistoricoConvites versao={versaoHistorico} destaqueId={destaqueId} onNovoLink={mostrarNovoLink} />
    </main>
  )
}
