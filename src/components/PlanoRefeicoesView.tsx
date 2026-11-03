import { iconeDoAlimento } from '../lib/alimentoIcones'

type ItemPlano = {
  id: string
  quantidade: number
  unidade: string
  alimento: { id: string; nome: string; icone?: string | null }
}

type RefeicaoPlano = {
  id: string
  nome: string
  horario: string
  itens: ItemPlano[]
}

export function PlanoRefeicoesView({ refeicoes }: { refeicoes: RefeicaoPlano[] }) {
  if (refeicoes.length === 0) {
    return <p className="text-body-sm text-ink-secondary">Nenhuma refeição nesta versão.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {refeicoes.map((refeicao) => (
        <div key={refeicao.id} className="rounded-lg bg-surface-sunken p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-body font-medium text-ink">{refeicao.nome}</h4>
            <span className="text-caption text-ink-muted">{refeicao.horario}</span>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {refeicao.itens.map((item) => {
              const IconeAlimento = iconeDoAlimento(item.alimento.icone ?? null)
              return (
                <li key={item.id} className="flex items-center gap-2 text-body-sm">
                  <IconeAlimento size={14} className="shrink-0 text-ink-secondary" />
                  <span className="text-ink">{item.alimento.nome}</span>
                  <span className="text-ink-secondary">
                    {item.quantidade} {item.unidade}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
