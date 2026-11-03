import { useEffect, useState } from 'react'
import { SECOES_ANAMNESE, type Anamnese } from '../lib/anamnese'
import { api } from '../lib/api'

function formatarValor(valor: unknown): string {
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não'
  return String(valor)
}

export function AnamneseResumo({ pacienteId }: { pacienteId: string }) {
  const [anamnese, setAnamnese] = useState<Anamnese | null>(null)
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    // Corpo vazio (sem anamnese ainda) vira `undefined` no cliente de API — não dá
    // pra usar isso como sentinela de "carregando", precisa de uma flag própria.
    api.get<Anamnese | null>(`/pacientes/${pacienteId}/anamnese`).then((dados) => {
      setAnamnese(dados ?? null)
      setCarregado(true)
    })
  }, [pacienteId])

  if (!carregado) {
    return null
  }

  const secoesPreenchidas = SECOES_ANAMNESE.map((secao) => ({
    titulo: secao.titulo,
    campos: secao.campos.filter((campo) => {
      const valor = anamnese?.[campo.chave]
      return valor !== null && valor !== undefined && valor !== ''
    }),
  })).filter((secao) => secao.campos.length > 0)

  return (
    <div className="rounded-lg bg-surface p-6 shadow-sm">
      <h2 className="text-h2 text-ink">Anamnese</h2>

      {secoesPreenchidas.length === 0 ? (
        <p className="mt-3 text-body-sm text-ink-secondary">Anamnese ainda não preenchida.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {secoesPreenchidas.map((secao) => (
            <div key={secao.titulo}>
              <h3 className="text-h3 text-ink">{secao.titulo}</h3>
              <dl className="mt-2 flex flex-col gap-2">
                {secao.campos.map((campo) => (
                  <div key={campo.chave}>
                    <dt className="text-label text-ink-secondary">{campo.label}</dt>
                    <dd className="text-body-sm text-ink">
                      {formatarValor(anamnese?.[campo.chave])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
