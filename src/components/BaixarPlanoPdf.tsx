import { Download, Loader2 } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { ApiError, baixarPlanoPdf } from '../lib/api'
import { salvarArquivo } from '../lib/salvarArquivo'
import { Alert } from './ui/alert'
import { Button } from './ui/button'

function hojeIso() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

// Sem nome do paciente no arquivo: dado pessoal vaza no histórico de downloads
function nomePadrao() {
  return `plano-alimentar-${hojeIso()}.pdf`
}

// resumo: conteúdo à esquerda da linha do botão (desktop) ou acima dele (mobile).
// A mensagem de erro ocupa a largura toda, abaixo da linha.
export function BaixarPlanoPdf({ resumo }: { resumo?: ReactNode }) {
  const [baixando, setBaixando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  // O estado só é aplicado no próximo render; a ref bloqueia o segundo clique na hora
  const emAndamento = useRef(false)

  async function baixar() {
    if (emAndamento.current) return
    emAndamento.current = true
    setBaixando(true)
    setErro(null)

    try {
      const { blob, nomeArquivo } = await baixarPlanoPdf()
      salvarArquivo(blob, nomeArquivo ?? nomePadrao())
    } catch (error) {
      setErro(
        error instanceof ApiError && error.status === 404
          ? 'Esse plano não está disponível para download.'
          : 'Não foi possível baixar o PDF. Tente novamente.',
      )
    } finally {
      emAndamento.current = false
      setBaixando(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {resumo && <div className="min-w-0">{resumo}</div>}
        <Button
          type="button"
          variant="secondary"
          onClick={baixar}
          disabled={baixando}
          aria-busy={baixando}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 sm:min-h-0 sm:w-auto"
        >
          {baixando ? (
            <Loader2
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : (
            <Download size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
          {baixando ? 'Baixando...' : 'Baixar PDF'}
        </Button>
      </div>

      <div role="alert">
        {erro && (
          <div className="mt-3">
            <Alert variant="error">{erro}</Alert>
          </div>
        )}
      </div>
    </div>
  )
}
