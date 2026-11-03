import { Coffee, Moon, Soup, Utensils, UtensilsCrossed, type LucideIcon } from 'lucide-react'

type RefeicaoTema = {
  Icon: LucideIcon
  badgeBg: string
  badgeText: string
  headerBg: string
}

const TEMAS: { palavras: string[]; tema: RefeicaoTema }[] = [
  {
    palavras: ['cafe da manha', 'cafe'],
    tema: {
      Icon: Coffee,
      badgeBg: 'bg-primary-subtle',
      badgeText: 'text-on-primary-subtle',
      headerBg: 'bg-primary-subtle',
    },
  },
  {
    palavras: ['almoco'],
    tema: {
      Icon: UtensilsCrossed,
      badgeBg: 'bg-warning-subtle',
      badgeText: 'text-on-warning-subtle',
      headerBg: 'bg-warning-subtle',
    },
  },
  {
    palavras: ['lanche'],
    tema: {
      Icon: Utensils,
      badgeBg: 'bg-accent-subtle',
      badgeText: 'text-on-accent-subtle',
      headerBg: 'bg-accent-subtle',
    },
  },
  {
    palavras: ['jantar'],
    tema: {
      Icon: Soup,
      badgeBg: 'bg-surface-sunken',
      badgeText: 'text-ink-secondary',
      headerBg: 'bg-surface-sunken',
    },
  },
  {
    palavras: ['ceia'],
    tema: {
      Icon: Moon,
      badgeBg: 'bg-surface-sunken',
      badgeText: 'text-ink-secondary',
      headerBg: 'bg-surface-sunken',
    },
  },
]

const TEMA_PADRAO: RefeicaoTema = {
  Icon: Utensils,
  badgeBg: 'bg-surface-sunken',
  badgeText: 'text-ink-secondary',
  headerBg: 'bg-surface-sunken',
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function temaDaRefeicao(nome: string): RefeicaoTema {
  const nomeNormalizado = normalizar(nome)
  const encontrado = TEMAS.find(({ palavras }) =>
    palavras.some((palavra) => nomeNormalizado.includes(palavra)),
  )
  return encontrado?.tema ?? TEMA_PADRAO
}
