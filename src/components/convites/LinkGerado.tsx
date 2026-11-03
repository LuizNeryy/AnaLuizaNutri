import { Check, Copy, MessageCircle } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { formatarDataHora, linkDoConvite, type ConviteGerado } from '../../lib/convitesAutocadastro'
import {
  digitosDoTelefone,
  erroDoTelefone,
  formatarTelefone,
  linkWhatsApp,
  mensagemDoConvite,
} from '../../lib/telefone'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const CLASSES_BOTAO_WHATSAPP =
  'inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-3 py-2 text-button-label text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-pressed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

// Link recém-gerado: só aparece agora (depois disso, só "Gerar novo"). O telefone fica só
// neste componente: não vai para o backend, não é salvo nem logado.
export function LinkGerado({
  convite,
  nomeNutricionista,
}: {
  convite: ConviteGerado
  nomeNutricionista: string | null
}) {
  const [copiado, setCopiado] = useState(false)
  const [erroCopia, setErroCopia] = useState(false)
  const [telefone, setTelefone] = useState('')
  const [mostrarErroTelefone, setMostrarErroTelefone] = useState(false)
  const campoLink = useRef<HTMLInputElement>(null)
  const idLink = useId()

  const link = linkDoConvite(convite.token)
  const erroTelefone = erroDoTelefone(telefone)
  const whatsapp = erroTelefone ? null : linkWhatsApp(telefone, mensagemDoConvite(link, nomeNutricionista))

  useEffect(() => {
    if (!copiado) return
    const id = setTimeout(() => setCopiado(false), 2500)
    return () => clearTimeout(id)
  }, [copiado])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link)
      setErroCopia(false)
      setCopiado(true)
    } catch {
      // Sem permissão de área de transferência: seleciona o texto para o Ctrl+C manual
      campoLink.current?.select()
      setErroCopia(true)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor={idLink} className="text-label text-ink-secondary">
          {convite.identificacao ? `Link de cadastro de ${convite.identificacao}` : 'Link de cadastro'}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={idLink}
            ref={campoLink}
            readOnly
            value={link}
            onFocus={(event) => event.target.select()}
            className="min-w-0 flex-1 rounded-md border border-border bg-surface-sunken px-3 py-2 text-body text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={copiar}
            className="inline-flex items-center justify-center gap-2"
          >
            {copiado ? (
              <Check size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Copy size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
            {copiado ? 'Copiado!' : 'Copiar'}
          </Button>
        </div>
        <p className="text-body-sm text-ink-secondary">
          Válido até {formatarDataHora(convite.expiraEm)} (72 horas). Por segurança, o link completo só
          aparece agora; depois, use "Gerar novo" no histórico.
        </p>
        <p aria-live="polite" className="text-body-sm text-ink-secondary">
          {copiado && <span className="sr-only">Copiado!</span>}
          {erroCopia && 'Não foi possível copiar automaticamente. O link está selecionado: use Ctrl+C.'}
        </p>
      </div>

      <section aria-labelledby={`${idLink}-whatsapp`} className="flex flex-col gap-3 border-t border-border pt-4">
        <h2 id={`${idLink}-whatsapp`} className="text-label text-ink">
          Enviar por WhatsApp
        </h2>
        <div className="max-w-xs">
          <Input
            label="Celular do paciente (com DDD)"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="(31) 91234-5678"
            value={formatarTelefone(telefone)}
            onChange={(event) => setTelefone(digitosDoTelefone(event.target.value))}
            onBlur={() => setMostrarErroTelefone(telefone.length > 0)}
            // Erro depois de sair do campo, ou já com os 11 dígitos digitados
            error={(mostrarErroTelefone || telefone.length === 11) && erroTelefone ? erroTelefone : undefined}
          />
        </div>

        {whatsapp ? (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={CLASSES_BOTAO_WHATSAPP}>
            <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
            Abrir no WhatsApp
          </a>
        ) : (
          <Button
            type="button"
            disabled
            aria-describedby={`${idLink}-dica-telefone`}
            className="inline-flex items-center justify-center gap-2 self-start"
          >
            <MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />
            Abrir no WhatsApp
          </Button>
        )}
        <p id={`${idLink}-dica-telefone`} className="text-caption text-ink-muted">
          O número é usado só para abrir a conversa e não fica salvo no Equilibra.
        </p>
      </section>
    </div>
  )
}
