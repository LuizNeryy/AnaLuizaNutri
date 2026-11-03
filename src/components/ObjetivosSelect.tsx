import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { Alert } from './ui/alert'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Modal } from './ui/modal'

type Objetivo = {
  id: string
  nome: string
}

type ObjetivosSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function ObjetivosSelect({ value, onChange }: ObjetivosSelectProps) {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    api.get<Objetivo[]>('/objetivos').then(setObjetivos)
  }, [])

  function alternar(id: string) {
    onChange(value.includes(id) ? value.filter((atual) => atual !== id) : [...value, id])
  }

  async function criarObjetivo(event: FormEvent) {
    // stopPropagation é necessário mesmo com o Modal em portal: eventos React se
    // propagam pela árvore de componentes, não pela árvore DOM — sem isso, o
    // submit também dispara o onSubmit do formulário de paciente por fora.
    event.preventDefault()
    event.stopPropagation()
    setErro(null)
    setSalvando(true)

    try {
      const objetivo = await api.post<Objetivo>('/objetivos', { nome: novoNome })
      setObjetivos((atual) => [...atual, objetivo].sort((a, b) => a.nome.localeCompare(b.nome)))
      onChange([...value, objetivo.id])
      setNovoNome('')
      setModalAberto(false)
    } catch {
      setErro('Não foi possível criar. Talvez já exista um objetivo com esse nome.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-label text-ink-secondary">Objetivos</span>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          aria-label="Criar novo objetivo"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-on-primary-subtle"
        >
          +
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {objetivos.map((objetivo) => (
          <label key={objetivo.id} className="flex items-center gap-2 text-body-sm text-ink">
            <Checkbox
              checked={value.includes(objetivo.id)}
              onChange={() => alternar(objetivo.id)}
            />
            {objetivo.nome}
          </label>
        ))}
      </div>

      {modalAberto && (
        <Modal onClose={() => setModalAberto(false)}>
          <h3 className="text-h3 text-ink">Novo objetivo</h3>
          <form onSubmit={criarObjetivo} className="mt-4 flex flex-col gap-4">
            <Input
              label="Nome"
              value={novoNome}
              onChange={(event) => setNovoNome(event.target.value)}
              autoFocus
            />
            {erro && <Alert variant="error">{erro}</Alert>}
            <Button type="submit" disabled={!novoNome || salvando}>
              Criar
            </Button>
          </form>
        </Modal>
      )}
    </div>
  )
}
