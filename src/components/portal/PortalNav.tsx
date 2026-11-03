import { ChartPie, House, Utensils, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

const ITENS: { para: string; rotulo: string; Icone: LucideIcon }[] = [
  { para: '/portal/inicio', rotulo: 'Início', Icone: House },
  { para: '/portal/plano', rotulo: 'Plano', Icone: Utensils },
  { para: '/portal/painel', rotulo: 'Painel', Icone: ChartPie },
]

// Navegação do portal. Fica no topo fixo (Topbar): "barra" é a linha única do desktop,
// "abas" é a segunda linha do celular. O item ativo ganha o traço verde embaixo.
export function PortalNav({ variante }: { variante: 'barra' | 'abas' }) {
  const barra = variante === 'barra'

  return (
    <nav
      aria-label="Portal do paciente"
      className={cn(barra ? 'hidden h-full items-stretch gap-1 md:flex' : 'flex h-11 border-t border-border md:hidden')}
    >
      {ITENS.map(({ para, rotulo, Icone }) => (
        <NavLink
          key={para}
          to={para}
          className={({ isActive }) =>
            cn(
              'relative flex items-center justify-center gap-2 text-button-label transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
              barra ? 'px-4' : 'flex-1',
              isActive ? 'text-primary' : 'text-ink-secondary hover:text-ink',
              // Traço do item ativo: encostado na borda de baixo da barra
              "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:content-['']",
              isActive ? 'after:bg-primary' : 'after:bg-transparent',
            )
          }
        >
          <Icone size={18} strokeWidth={1.75} aria-hidden="true" />
          {rotulo}
        </NavLink>
      ))}
    </nav>
  )
}
