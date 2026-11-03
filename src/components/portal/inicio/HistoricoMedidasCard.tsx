import { useState } from 'react'
import { faixaDoImc } from '../../../lib/imc'
import { dataCurta, diferenca, type MedidaDoPortal } from '../../../lib/medidas'
import { PortalCard } from '../PortalCard'
import { formatarNumero } from '../painel/formato'

const LINHAS_INICIAIS = 5

interface HistoricoMedidasCardProps {
  // Do mais antigo ao mais novo
  medidas: MedidaDoPortal[]
  destaqueId: string | null
  className?: string
}

export function HistoricoMedidasCard({ medidas, destaqueId, className }: HistoricoMedidasCardProps) {
  const [mostrarTodas, setMostrarTodas] = useState(false)
  // Da mais nova para a mais antiga; a variação de cada linha é contra a medida anterior no tempo
  const recentes = [...medidas].reverse()
  const visiveis = mostrarTodas ? recentes : recentes.slice(0, LINHAS_INICIAIS)

  return (
    <PortalCard className={className} aria-labelledby="titulo-historico-medidas">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-historico-medidas" className="text-label text-ink-secondary">
          Histórico de medidas
        </h2>
        {medidas.length > 0 && (
          <p className="text-caption text-ink-muted">
            {medidas.length === 1 ? '1 medida' : `${medidas.length} medidas`}
          </p>
        )}
      </div>

      {medidas.length === 0 ? (
        <p className="mt-3 text-body-sm text-ink-secondary">Suas medidas aparecem aqui conforme você registra.</p>
      ) : (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <caption className="sr-only">Medidas registradas, da mais recente para a mais antiga</caption>
              <thead>
                <tr className="border-b border-border text-label text-ink-secondary">
                  <th scope="col" className="py-2 pr-3 font-semibold">Data</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Peso</th>
                  <th scope="col" className="hidden py-2 pr-3 font-semibold sm:table-cell">Altura</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">IMC</th>
                  <th scope="col" className="hidden py-2 pr-3 font-semibold md:table-cell">Faixa</th>
                  <th scope="col" className="py-2 font-semibold">Variação</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((medida, indice) => {
                  const anterior = recentes[recentes.indexOf(medida) + 1]
                  const faixa = faixaDoImc(medida.imc)
                  return (
                    <tr
                      key={medida.id}
                      className={`border-b border-border last:border-0 ${medida.id === destaqueId ? 'destaque-linha' : ''}`}
                    >
                      <td className="py-2.5 pr-3 text-ink tabular-nums">
                        {dataCurta(medida.data)}
                        {indice === 0 && (
                          <span className="mt-1 block w-fit rounded-full bg-primary-subtle px-2 py-0.5 text-caption text-on-primary-subtle sm:ml-2 sm:mt-0 sm:inline-block">
                            Atual
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-2.5 pr-3 text-ink tabular-nums">{formatarNumero(medida.pesoKg, 1)} kg</td>
                      <td className="hidden whitespace-nowrap py-2.5 pr-3 text-ink tabular-nums sm:table-cell">
                        {formatarNumero(medida.alturaCm, 0)} cm
                      </td>
                      <td className="py-2.5 pr-3 text-ink tabular-nums">{formatarNumero(medida.imc, 1)}</td>
                      <td className="hidden py-2.5 pr-3 md:table-cell">
                        <span className="rounded-full px-2.5 py-0.5 text-caption" style={{ background: faixa.cor, color: faixa.corTexto }}>
                          {faixa.nome}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-2.5 text-ink-secondary tabular-nums">
                        {anterior ? diferenca(medida.pesoKg, anterior.pesoKg, 'kg').texto : '—'}
                        {!anterior && <span className="sr-only">primeira medida</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {recentes.length > LINHAS_INICIAIS && (
            <button
              type="button"
              onClick={() => setMostrarTodas((valor) => !valor)}
              aria-expanded={mostrarTodas}
              className="mt-3 inline-flex min-h-11 items-center text-body-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:min-h-0"
            >
              {mostrarTodas ? 'Ver menos' : `Ver todas as ${recentes.length} medidas`}
            </button>
          )}
        </>
      )}
    </PortalCard>
  )
}
