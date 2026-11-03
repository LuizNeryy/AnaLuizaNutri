import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { Alert } from './ui/alert'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

type Medicao = {
  id: string
  pesoKg: number
  alturaCm: number
  data: string
  imc: number
}

type MedicoesHistoricoProps =
  | { contexto: 'profissional'; pacienteId: string }
  | { contexto: 'paciente' }

export function MedicoesHistorico(props: MedicoesHistoricoProps) {
  const endpoint =
    props.contexto === 'profissional'
      ? `/pacientes/${props.pacienteId}/medicoes`
      : '/portal-paciente/medicoes'

  const [medicoes, setMedicoes] = useState<Medicao[] | null>(null)
  const [pesoKg, setPesoKg] = useState('')
  const [alturaCm, setAlturaCm] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    api.get<Medicao[]>(endpoint).then(setMedicoes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  async function registrarMedicao(event: FormEvent) {
    event.preventDefault()
    if (props.contexto !== 'profissional') return
    setErro(null)
    setSalvando(true)

    try {
      await api.post(`/pacientes/${props.pacienteId}/medicoes`, {
        pesoKg: Number(pesoKg),
        alturaCm: Number(alturaCm),
      })
      const atualizado = await api.get<Medicao[]>(endpoint)
      setMedicoes(atualizado)
      setPesoKg('')
      setAlturaCm('')
    } catch {
      setErro('Não foi possível registrar a medição.')
    } finally {
      setSalvando(false)
    }
  }

  if (!medicoes) {
    return null
  }

  const atual = medicoes[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.contexto === 'profissional' ? 'Medidas corporais' : 'Minhas medidas'}</CardTitle>
      </CardHeader>
      <CardContent>
        {atual ? (
          <div className="mb-4 flex gap-6 text-body-sm">
            <div>
              <dt className="text-label text-ink-secondary">Peso</dt>
              <dd className="text-ink">{atual.pesoKg} kg</dd>
            </div>
            <div>
              <dt className="text-label text-ink-secondary">Altura</dt>
              <dd className="text-ink">{atual.alturaCm} cm</dd>
            </div>
            <div>
              <dt className="text-label text-ink-secondary">IMC</dt>
              <dd className="text-ink">{atual.imc}</dd>
            </div>
          </div>
        ) : (
          <p className="mb-4 text-body-sm text-ink-muted">Nenhuma medição registrada ainda.</p>
        )}

        {props.contexto === 'profissional' && (
          <form onSubmit={registrarMedicao} className="mb-4 flex items-end gap-3">
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              value={pesoKg}
              onChange={(event) => setPesoKg(event.target.value)}
            />
            <Input
              label="Altura (cm)"
              type="number"
              step="0.1"
              value={alturaCm}
              onChange={(event) => setAlturaCm(event.target.value)}
            />
            <Button type="submit" disabled={salvando}>
              Registrar medição
            </Button>
          </form>
        )}

        {erro && <Alert variant="error">{erro}</Alert>}

        {medicoes.length > 0 && (
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-border text-left text-label text-ink-secondary">
                <th className="py-2">Data</th>
                <th className="py-2">Peso</th>
                <th className="py-2">Altura</th>
                <th className="py-2">IMC</th>
              </tr>
            </thead>
            <tbody>
              {medicoes.map((medicao) => (
                <tr key={medicao.id} className="border-b border-border last:border-0">
                  <td className="py-2 text-ink">{medicao.data.slice(0, 10)}</td>
                  <td className="py-2 text-ink">{medicao.pesoKg} kg</td>
                  <td className="py-2 text-ink">{medicao.alturaCm} cm</td>
                  <td className="py-2 text-ink">{medicao.imc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
