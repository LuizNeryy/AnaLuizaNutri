import { Plus } from 'lucide-react'
import { faixaDoImc } from '../../../lib/imc'
import { dataCurta, diasEntre, type MedidaDoPortal } from '../../../lib/medidas'
import type { SexoSilhueta } from '../../../lib/silhueta'
import { cn } from '../../../lib/utils'
import { PortalCard } from '../PortalCard'
import { NumeroAnimado } from '../painel/NumeroAnimado'
import { formatarNumero } from '../painel/formato'
import { ReguaImc } from './ReguaImc'
import { SilhuetaImc } from './SilhuetaImc'

// Depois disso, vale lembrar o paciente de registrar uma medida nova
const DIAS_PARA_LEMBRAR = 30

interface MeuCorpoCardProps {
  sexo: SexoSilhueta
  // Mais recente; null = nenhuma medida ainda
  atual: MedidaDoPortal | null
  // "YYYY-MM-DD" de hoje
  hoje: string
  onRegistrar: () => void
  className?: string
}

export function MeuCorpoCard({ sexo, atual, hoje, onRegistrar, className }: MeuCorpoCardProps) {
  const faixa = atual ? faixaDoImc(atual.imc) : null
  const descricao = atual && faixa ? `IMC ${formatarNumero(atual.imc, 1)}, ${faixa.nome.toLowerCase()}` : undefined
  const dias = atual ? diasEntre(atual.data, hoje) : 0

  return (
    <PortalCard className={cn('flex h-full flex-col', className)} aria-labelledby="titulo-meu-corpo">
      <h2 id="titulo-meu-corpo" className="text-label text-ink-secondary">
        Meu corpo
      </h2>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-3 sm:flex-row sm:gap-8">
        <div className="relative w-36 shrink-0 sm:w-44">
          {/* Círculo de fundo na cor suave da faixa: a cor aparece sem pintar o corpo */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[12%] aspect-square rounded-full transition-colors duration-700"
            style={{ background: faixa?.cor ?? 'var(--color-surface-sunken)' }}
          />
          <SilhuetaImc imc={atual?.imc ?? null} sexo={sexo} rotulo={descricao} className="relative" />
        </div>

        <div className="w-full min-w-0 flex-1">
          {atual && faixa ? (
            <>
              <p className="text-caption text-ink-secondary">IMC</p>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-display text-ink">
                  <NumeroAnimado valor={atual.imc} casas={1} />
                </p>
                <span className="rounded-full px-3 py-1 text-label" style={{ background: faixa.cor, color: faixa.corTexto }}>
                  {faixa.nome}
                </span>
              </div>

              <ReguaImc imc={atual.imc} />

              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-surface-sunken px-3 py-2.5">
                  <dt className="text-caption text-ink-secondary">Peso</dt>
                  <dd className="text-h2 text-ink">
                    <NumeroAnimado valor={atual.pesoKg} casas={1} atraso={0.1} /> <span className="text-body-sm">kg</span>
                  </dd>
                </div>
                <div className="rounded-md bg-surface-sunken px-3 py-2.5">
                  <dt className="text-caption text-ink-secondary">Altura</dt>
                  <dd className="text-h2 text-ink">
                    <NumeroAnimado valor={atual.alturaCm} atraso={0.2} /> <span className="text-body-sm">cm</span>
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-caption text-ink-muted">
                Medido em {dataCurta(atual.data)}. O IMC é uma referência geral; seu nutricionista avalia o conjunto.
              </p>
              {dias >= DIAS_PARA_LEMBRAR && (
                <p className="mt-1 text-caption text-on-warning-subtle">
                  Sua última medida tem {dias} dias. Que tal registrar uma nova?
                </p>
              )}
            </>
          ) : (
            <div className="text-center sm:text-left">
              <p className="text-h3 text-ink">Ainda sem medidas</p>
              <p className="mt-1 text-body-sm text-ink-secondary">
                Registre seu peso e altura para ver seu IMC, a silhueta e a sua evolução.
              </p>
              <button
                type="button"
                onClick={onRegistrar}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-button-label text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <Plus size={18} aria-hidden="true" />
                Registrar primeira medida
              </button>
            </div>
          )}
        </div>
      </div>
    </PortalCard>
  )
}
