import { Plus } from 'lucide-react'
import { useState } from 'react'
import { dominioDoImc, dominioDoPeso } from '../../../lib/grafico'
import { FAIXAS_IMC, faixaDoImc } from '../../../lib/imc'
import { dataCurta, diaMes, diferenca, type MedidaDoPortal } from '../../../lib/medidas'
import { cn } from '../../../lib/utils'
import { PortalCard } from '../PortalCard'
import { formatarNumero } from '../painel/formato'
import { GraficoProgressao } from './GraficoProgressao'

type Indicador = 'peso' | 'imc'

const INDICADORES: { chave: Indicador; rotulo: string }[] = [
  { chave: 'peso', rotulo: 'Peso' },
  { chave: 'imc', rotulo: 'IMC' },
]

interface ProgressaoCardProps {
  // Do mais antigo ao mais novo
  medidas: MedidaDoPortal[]
  onRegistrar: () => void
  className?: string
}

export function ProgressaoCard({ medidas, onRegistrar, className }: ProgressaoCardProps) {
  const [indicador, setIndicador] = useState<Indicador>('peso')
  const peso = indicador === 'peso'
  const primeira = medidas[0]
  const ultima = medidas[medidas.length - 1]

  const valor = (m: MedidaDoPortal) => (peso ? m.pesoKg : m.imc)
  const variacao = medidas.length > 1 ? diferenca(valor(ultima), valor(primeira), peso ? 'kg' : '') : null
  const pontos = medidas.map((m) => ({ data: m.data.slice(0, 10), valor: valor(m) }))
  const dominio = (peso ? dominioDoPeso : dominioDoImc)(pontos.map((p) => p.valor))
  const unidade = peso ? 'kg' : undefined
  // Só as faixas que aparecem no gráfico entram na legenda
  const faixasVisiveis = FAIXAS_IMC.filter((faixa) => faixa.max > dominio.min && faixa.min < dominio.max)
  const rotulo = `Gráfico de ${peso ? 'peso' : 'IMC'}: ${formatarNumero(valor(primeira), 1)}${peso ? ' kg' : ''} em ${diaMes(primeira.data)} e ${formatarNumero(valor(ultima), 1)}${peso ? ' kg' : ''} em ${diaMes(ultima.data)}`

  return (
    <PortalCard className={cn('flex h-full flex-col', className)} aria-labelledby="titulo-progressao">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-progressao" className="text-label text-ink-secondary">
          Progressão
        </h2>

        <div role="group" aria-label="Indicador do gráfico" className="flex gap-1 rounded-md bg-surface-sunken p-1">
          {INDICADORES.map(({ chave, rotulo: texto }) => (
            <button
              key={chave}
              type="button"
              aria-pressed={indicador === chave}
              onClick={() => setIndicador(chave)}
              className={cn(
                'min-h-9 rounded-sm px-4 text-button-label focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                indicador === chave ? 'bg-surface text-ink shadow-sm' : 'text-ink-secondary hover:text-ink',
              )}
            >
              {texto}
            </button>
          ))}
        </div>
      </div>

      {medidas.length < 2 ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-md bg-surface-sunken p-4">
          <p className="text-body-sm text-ink-secondary">
            {medidas.length === 0
              ? 'Registre sua primeira medida para começar a acompanhar a evolução.'
              : 'Com mais uma medida você já vê a linha da sua evolução aqui.'}
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
          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1">
            <p className="text-h1 text-ink tabular-nums">
              {formatarNumero(valor(ultima), 1)}
              {peso && <span className="ml-1 text-body-sm text-ink-secondary">kg</span>}
            </p>
            {variacao && (
              <p className="pb-1 text-body-sm text-ink-secondary">
                <span className="font-semibold text-ink">{variacao.texto}</span> desde {dataCurta(primeira.data)}
              </p>
            )}
            {!peso && (
              <span
                className="mb-1 rounded-full px-3 py-0.5 text-label"
                style={{ background: faixaDoImc(ultima.imc).cor, color: faixaDoImc(ultima.imc).corTexto }}
              >
                {faixaDoImc(ultima.imc).nome}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-1 flex-col">
            {/* key: trocar o indicador refaz a animação do traço */}
            <GraficoProgressao
              key={indicador}
              pontos={pontos}
              dominio={dominio}
              casas={1}
              unidade={unidade}
              faixas={peso ? undefined : FAIXAS_IMC}
              rotulo={rotulo}
            />
          </div>

          {!peso && (
            <ul aria-label="Faixas do IMC" className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {faixasVisiveis.map((faixa) => (
                <li key={faixa.nome} className="flex items-center gap-1.5 text-caption text-ink-secondary">
                  <span aria-hidden="true" className="h-3 w-3 rounded-sm border border-border/40" style={{ background: faixa.cor }} />
                  {faixa.nome}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </PortalCard>
  )
}
