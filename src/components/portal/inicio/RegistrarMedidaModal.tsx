import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ApiError, api } from '../../../lib/api'
import { faixaDoImc } from '../../../lib/imc'
import {
  dataIsoLocal,
  erroDaAltura,
  erroDaData,
  erroDoPeso,
  imcDaMedida,
  lerDecimal,
  type MedidaDoPortal,
} from '../../../lib/medidas'
import { Alert } from '../../ui/alert'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Modal } from '../../ui/modal'
import { formatarNumero } from '../painel/formato'

interface RegistrarMedidaModalProps {
  // Altura da última medida: pré-preenche, já que quase nunca muda
  alturaSugerida: number | null
  onFechar: () => void
  onSalvo: (medida: MedidaDoPortal) => void
}

// O paciente registra uma nova medida (peso, altura e dia). A prévia do IMC aparece enquanto
// ele digita; o servidor valida de novo e calcula o IMC que fica guardado.
export function RegistrarMedidaModal({ alturaSugerida, onFechar, onSalvo }: RegistrarMedidaModalProps) {
  const idTitulo = useId()
  const hoje = dataIsoLocal()
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState(alturaSugerida === null ? '' : formatarNumero(alturaSugerida, alturaSugerida % 1 === 0 ? 0 : 1))
  const [data, setData] = useState(hoje)
  const [tentou, setTentou] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)
  const campoPeso = useRef<HTMLInputElement>(null)
  const campoAltura = useRef<HTMLInputElement>(null)
  const campoData = useRef<HTMLInputElement>(null)

  // Foco no primeiro campo; ao fechar, o foco volta para o botão que abriu o formulário
  useEffect(() => {
    const abriu = document.activeElement as HTMLElement | null
    campoPeso.current?.focus()
    return () => abriu?.focus?.()
  }, [])

  const erroPeso = erroDoPeso(peso)
  const erroAltura = erroDaAltura(altura)
  const erroData = erroDaData(data, hoje)
  const pesoNumero = erroPeso ? null : lerDecimal(peso)
  const alturaNumero = erroAltura ? null : lerDecimal(altura)
  const imc = pesoNumero !== null && alturaNumero !== null ? imcDaMedida(pesoNumero, alturaNumero) : null
  const faixa = imc !== null ? faixaDoImc(imc) : null

  async function salvar(evento: FormEvent) {
    evento.preventDefault()
    setErroApi(null)
    if (erroPeso || erroAltura || erroData) {
      setTentou(true)
      if (erroPeso) campoPeso.current?.focus()
      else if (erroAltura) campoAltura.current?.focus()
      else campoData.current?.focus()
      return
    }

    setSalvando(true)
    try {
      onSalvo(await api.post<MedidaDoPortal>('/portal-paciente/medicoes', { pesoKg: pesoNumero, alturaCm: alturaNumero, data }))
    } catch (error) {
      setErroApi(
        error instanceof ApiError && error.status === 400 && error.mensagens[0]
          ? error.mensagens[0]
          : 'Não foi possível salvar a medida. Tente novamente.',
      )
      setSalvando(false)
    }
  }

  return (
    <Modal onClose={onFechar} labelledBy={idTitulo}>
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <div>
          <h2 id={idTitulo} className="text-h2 text-ink">
            Registrar medida
          </h2>
          <p className="mt-1 text-body-sm text-ink-secondary">
            Ela entra no seu histórico e nos gráficos. Seu nutricionista também consegue vê-la.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            ref={campoPeso}
            label="Peso (kg)"
            inputMode="decimal"
            autoComplete="off"
            placeholder="62,5"
            value={peso}
            onChange={(evento) => setPeso(evento.target.value)}
            error={tentou ? (erroPeso ?? undefined) : undefined}
          />
          <Input
            ref={campoAltura}
            label="Altura (cm)"
            inputMode="decimal"
            autoComplete="off"
            placeholder="170"
            value={altura}
            onChange={(evento) => setAltura(evento.target.value)}
            error={tentou ? (erroAltura ?? undefined) : undefined}
          />
        </div>

        <Input
          ref={campoData}
          label="Data da medida"
          type="date"
          max={hoje}
          value={data}
          onChange={(evento) => setData(evento.target.value)}
          error={tentou ? (erroData ?? undefined) : undefined}
        />

        <div aria-live="polite" className="rounded-md bg-surface-sunken px-3 py-2.5 text-body-sm">
          {imc !== null && faixa ? (
            <p className="flex flex-wrap items-center gap-2 text-ink">
              <span>
                IMC <strong className="tabular-nums">{formatarNumero(imc, 1)}</strong>
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-caption" style={{ background: faixa.cor, color: faixa.corTexto }}>
                {faixa.nome}
              </span>
            </p>
          ) : (
            <p className="text-ink-secondary">O IMC aparece aqui assim que você preencher peso e altura.</p>
          )}
        </div>

        <div role="alert" className="empty:hidden">
          {erroApi && <Alert variant="error">{erroApi}</Alert>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onFechar} disabled={salvando} className="min-h-11">
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando} className="min-h-11">
            {salvando ? 'Salvando...' : 'Salvar medida'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
