import { ArrowDown, ArrowRight, ArrowUp, Minus, Plus, type LucideIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { faixaDoImc } from '../../../lib/imc'
import { dataCurta, diferenca, type Diferenca, type MedidaDoPortal } from '../../../lib/medidas'
import type { SexoSilhueta } from '../../../lib/silhueta'
import { PortalCard } from '../PortalCard'
import { formatarNumero } from '../painel/formato'
import { SilhuetaImc } from './SilhuetaImc'

const ICONE_DA_DIRECAO: Record<Diferenca['direcao'], LucideIcon> = {
  subiu: ArrowUp,
  desceu: ArrowDown,
  igual: Minus,
}

function Figura({ titulo, medida, sexo }: { titulo: string; medida: MedidaDoPortal; sexo: SexoSilhueta }) {
  const faixa = faixaDoImc(medida.imc)
  return (
    <figure className="flex min-w-0 flex-col items-center text-center">
      <figcaption className="text-label text-ink-secondary">{titulo}</figcaption>
      <div className="mt-2 w-full max-w-[120px] rounded-md bg-surface-sunken px-3 pt-3">
        <SilhuetaImc imc={medida.imc} sexo={sexo} />
      </div>
      <p className="mt-2 text-body-sm text-ink">{dataCurta(medida.data)}</p>
      <p className="text-caption text-ink-secondary tabular-nums">
        {formatarNumero(medida.pesoKg, 1)} kg · IMC {formatarNumero(medida.imc, 1)}
      </p>
      <span className="mt-1.5 rounded-full px-2.5 py-0.5 text-caption" style={{ background: faixa.cor, color: faixa.corTexto }}>
        {faixa.nome}
      </span>
    </figure>
  )
}

interface AntesDepoisCardProps {
  // Do mais antigo ao mais novo
  medidas: MedidaDoPortal[]
  sexo: SexoSilhueta
  onRegistrar: () => void
  className?: string
}

// Compara a medida mais recente com qualquer uma do histórico (por padrão, a primeira)
export function AntesDepoisCard({ medidas, sexo, onRegistrar, className }: AntesDepoisCardProps) {
  const [escolhidaId, setEscolhidaId] = useState<string | null>(null)
  const idSelect = useId()
  const atual = medidas[medidas.length - 1]
  const anteriores = medidas.slice(0, -1)
  const referencia = anteriores.find((m) => m.id === escolhidaId) ?? anteriores[0]

  let linhas: { rotulo: string; dif: Diferenca }[] = []
  let faixaTexto = ''
  if (atual && referencia) {
    linhas = [
      { rotulo: 'Peso', dif: diferenca(atual.pesoKg, referencia.pesoKg, 'kg') },
      { rotulo: 'IMC', dif: diferenca(atual.imc, referencia.imc) },
    ]
    const antes = faixaDoImc(referencia.imc).nome
    const agora = faixaDoImc(atual.imc).nome
    faixaTexto = antes === agora ? `Continua em ${agora}` : `${antes} → ${agora}`
  }

  return (
    <PortalCard className={className} aria-labelledby="titulo-antes-depois">
      <h2 id="titulo-antes-depois" className="text-label text-ink-secondary">
        Antes e agora
      </h2>

      {!atual || !referencia ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-md bg-surface-sunken p-4">
          <p className="text-body-sm text-ink-secondary">
            Registre mais uma medida para comparar como você está agora com uma medida anterior.
          </p>
          <button
            type="button"
            onClick={onRegistrar}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-button-label text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Plus size={18} aria-hidden="true" />
            Registrar medida
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 flex flex-col gap-1">
            <label htmlFor={idSelect} className="text-label text-ink-secondary">
              Comparar com
            </label>
            <select
              id={idSelect}
              value={referencia.id}
              onChange={(evento) => setEscolhidaId(evento.target.value)}
              className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:min-h-10"
            >
              {anteriores.map((medida) => (
                <option key={medida.id} value={medida.id}>
                  {dataCurta(medida.data)} · {formatarNumero(medida.pesoKg, 1)} kg
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            <Figura titulo="Antes" medida={referencia} sexo={sexo} />
            <ArrowRight size={20} strokeWidth={1.75} className="text-ink-muted" aria-hidden="true" />
            <Figura titulo="Agora" medida={atual} sexo={sexo} />
          </div>

          <dl className="mt-5 divide-y divide-border border-t border-border text-body-sm">
            {linhas.map(({ rotulo, dif }) => {
              const Icone = ICONE_DA_DIRECAO[dif.direcao]
              return (
                <div key={rotulo} className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="text-ink-secondary">{rotulo}</dt>
                  <dd className="flex items-center gap-1.5 font-semibold text-ink tabular-nums">
                    <Icone size={16} strokeWidth={1.75} aria-hidden="true" className="text-ink-muted" />
                    {dif.texto}
                  </dd>
                </div>
              )
            })}
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-ink-secondary">Faixa do IMC</dt>
              <dd className="text-right font-semibold text-ink">{faixaTexto}</dd>
            </div>
          </dl>
        </>
      )}
    </PortalCard>
  )
}
