import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Logo } from './Logo'
import { PortalNav } from './portal/PortalNav'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'
import { Avatar } from './ui/avatar'

type TopbarProps = {
  area: 'admin' | 'patient'
}

export function Topbar({ area }: TopbarProps) {
  const navigate = useNavigate()
  const [nome, setNome] = useState<string | null>(null)

  useEffect(() => {
    if (area === 'admin') {
      api.get<{ nome: string }>('/auth/me').then((dados) => setNome(dados.nome))
    } else {
      api.get<{ nome: string }>('/portal-paciente/me').then((dados) => setNome(dados.nome))
    }
  }, [area])

  async function sair() {
    if (area === 'admin') {
      await api.post('/auth/logout')
    } else {
      await api.post('/portal-paciente/logout')
    }
    navigate('/login')
  }

  if (area === 'patient') {
    // Navegação sempre no mesmo lugar: na linha do topo (desktop) ou numa segunda linha
    // (celular). As alturas (57px / 101px) estão em lib/topbar.ts.
    return (
      <header className="sticky top-0 z-10 border-b border-border bg-surface shadow-sm">
        <div className="flex h-14 w-full items-center gap-4 px-4 sm:px-6">
          <Link to="/portal/inicio" aria-label="Ana Luiza Nutricionista, ir para o início" className="shrink-0 md:mr-4">
            <Logo />
          </Link>

          <PortalNav variante="barra" />

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <AnimatedThemeToggler className="text-ink-secondary hover:text-ink" />

            {nome && (
              <>
                <Link
                  to="/portal/perfil"
                  aria-label="Meus dados"
                  className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <Avatar nome={nome} />
                  <span className="hidden max-w-40 truncate text-body-sm text-ink-secondary sm:inline">{nome}</span>
                </Link>
                <button
                  type="button"
                  onClick={sair}
                  aria-label="Sair"
                  className="flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <PortalNav variante="abas" />
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-3 shadow-sm">
      <Link to="/dashboard">
        <Logo />
      </Link>

      <div className="flex items-center gap-4">
        <AnimatedThemeToggler className="text-ink-secondary hover:text-ink" />

        {nome && (
          <div className="flex items-center gap-2">
            <Link to="/conta" className="flex items-center gap-2">
              <Avatar nome={nome} />
              <span className="text-body-sm text-ink-secondary">{nome}</span>
            </Link>
            <button
              type="button"
              onClick={sair}
              aria-label="Sair"
              className="text-ink-muted hover:text-ink"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
