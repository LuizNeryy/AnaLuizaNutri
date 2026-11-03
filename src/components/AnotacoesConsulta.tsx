import { useEffect, useId, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { Alert } from './ui/alert'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

type Consulta = {
  id: string
  data: string
  observacoes: string
  metasCombinadas: string
  criadoEm: string
}

type AnotacoesConsultaProps = {
  pacienteId: string
}

export function AnotacoesConsulta({ pacienteId }: AnotacoesConsultaProps) {
  const endpoint = `/pacientes/${pacienteId}/consultas`
  const observacoesId = useId()
  const metasId = useId()

  const [consultas, setConsultas] = useState<Consulta[] | null>(null)
  const [data, setData] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [metasCombinadas, setMetasCombinadas] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    api.get<Consulta[]>(endpoint).then(setConsultas)
  }, [endpoint])

  async function salvarAnotacao(event: FormEvent) {
    event.preventDefault()
    setErro(null)

    if (!data || !observacoes.trim() || !metasCombinadas.trim()) {
      setErro('Preencha a data, as observações e as metas combinadas.')
      return
    }

    setSalvando(true)

    try {
      await api.post(endpoint, {
        data,
        observacoes: observacoes.trim(),
        metasCombinadas: metasCombinadas.trim(),
      })
      const atualizado = await api.get<Consulta[]>(endpoint)
      setConsultas(atualizado)
      setData('')
      setObservacoes('')
      setMetasCombinadas('')
    } catch {
      setErro('Não foi possível salvar a anotação de consulta.')
    } finally {
      setSalvando(false)
    }
  }

  if (!consultas) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anotações de consulta</CardTitle>
        <CardDescription>
          Registro de observações e metas combinadas em cada sessão, substituindo anotação em
          papel.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {consultas.length > 0 ? (
          <div className="flex flex-col gap-3">
            {consultas.map((consulta) => (
              <dl
                key={consulta.id}
                className="rounded-md border border-border/40 bg-surface-sunken p-4 text-body-sm"
              >
                <p className="text-caption text-ink-muted">
                  Consulta em{' '}
                  {new Date(consulta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
                <div className="mt-2">
                  <dt className="text-label text-ink-secondary">Observações</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-ink">{consulta.observacoes}</dd>
                </div>
                <div className="mt-2">
                  <dt className="text-label text-ink-secondary">Metas combinadas</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-ink">
                    {consulta.metasCombinadas}
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-ink-muted">Nenhuma anotação de consulta registrada ainda.</p>
        )}

        <div>
          <h4 className="text-h3 text-ink">Nova anotação</h4>
          <form onSubmit={salvarAnotacao} className="mt-3 flex flex-col gap-3">
            <Input
              label="Data da consulta"
              type="date"
              required
              value={data}
              onChange={(event) => setData(event.target.value)}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor={observacoesId} className="text-label text-ink-secondary">
                Observações
              </label>
              <textarea
                id={observacoesId}
                required
                rows={3}
                placeholder="O que foi conversado na sessão"
                value={observacoes}
                onChange={(event) => setObservacoes(event.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-ink placeholder:text-ink-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={metasId} className="text-label text-ink-secondary">
                Metas combinadas
              </label>
              <textarea
                id={metasId}
                required
                rows={3}
                placeholder="O que ficou combinado até a próxima consulta"
                value={metasCombinadas}
                onChange={(event) => setMetasCombinadas(event.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-ink placeholder:text-ink-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {erro && <Alert variant="error">{erro}</Alert>}

            <Button type="submit" disabled={salvando} className="self-start">
              Salvar anotação
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
