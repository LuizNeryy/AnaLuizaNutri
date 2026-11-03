import { SECOES_ANAMNESE } from '../lib/anamnese'

type AnamneseFormProps = {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  // 'app' combina com o tema claro/escuro do resto do sistema (tokens de cor);
  // 'light' é pro wizard de autocadastro público, que usa cores fixas claras,
  // não os tokens — sem isso o campo escuro ficava ilegível em cima do card branco.
  variant?: 'app' | 'light'
}

const CLASSES_POR_VARIANTE = {
  app: {
    label: 'text-label text-ink-secondary',
    secao: 'rounded-sm border border-border p-3',
    titulo: 'cursor-pointer text-body-sm font-medium text-ink',
    campoLabel: 'text-body-sm text-ink-secondary',
    campo:
      'rounded-sm border border-border bg-surface px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  },
  light: {
    label: 'text-sm font-semibold text-gray-800',
    secao: 'rounded-xl border border-gray-200 bg-white p-4',
    titulo: 'cursor-pointer text-sm font-semibold text-gray-800',
    campoLabel: 'text-sm font-semibold text-gray-800',
    campo:
      'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
  },
} as const

export function AnamneseForm({ value, onChange, variant = 'app' }: AnamneseFormProps) {
  const classes = CLASSES_POR_VARIANTE[variant]

  function definir(chave: string, valor: string) {
    onChange({ ...value, [chave]: valor })
  }

  return (
    <div className="flex flex-col gap-2">
      <span className={classes.label}>Anamnese (opcional)</span>
      {SECOES_ANAMNESE.map((secao) => (
        <details key={secao.titulo} className={classes.secao}>
          <summary className={classes.titulo}>{secao.titulo}</summary>
          <div className="mt-3 flex flex-col gap-3">
            {secao.campos.map((campo) => (
              <label key={campo.chave} className="flex flex-col gap-1">
                <span className={classes.campoLabel}>{campo.label}</span>
                {campo.tipo === 'textarea' ? (
                  <textarea
                    className={classes.campo}
                    rows={2}
                    value={value[campo.chave] ?? ''}
                    onChange={(event) => definir(campo.chave, event.target.value)}
                  />
                ) : campo.tipo === 'boolean' ? (
                  <select
                    className={classes.campo}
                    value={value[campo.chave] ?? ''}
                    onChange={(event) => definir(campo.chave, event.target.value)}
                  >
                    <option value="">Não informado</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                ) : (
                  <input
                    className={classes.campo}
                    type={campo.tipo === 'number' ? 'number' : 'text'}
                    value={value[campo.chave] ?? ''}
                    onChange={(event) => definir(campo.chave, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
