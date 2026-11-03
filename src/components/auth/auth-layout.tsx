import { Loader2 } from 'lucide-react'
import { useId, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Button } from '../ui/button'
import { Logo } from '../Logo'
import { EquilibraScene } from './equilibra-scene'

const DESKTOP_QUERY = '(min-width: 1024px)'

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches)
}

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  const isDesktop = useIsDesktop()

  return (
    <main className="grid min-h-dvh bg-surface lg:grid-cols-2">
      {/* A animação da balança só aparece no desktop; no mobile fica só o formulário */}
      {isDesktop && <EquilibraScene className="min-h-dvh" />}

      <div className="flex items-start justify-center px-4 py-6 sm:px-6 lg:items-center lg:py-12">
        <div className="w-full max-w-[380px]">
          <Logo className="mx-auto mb-8 block h-11 lg:h-14" />
          <h1 className="text-h1 text-ink">{title}</h1>
          <p className="mt-1 mb-6 text-body-sm text-ink-secondary">{description}</p>

          {children}

          {footer && <div className="mt-6 text-center text-body-sm text-ink-secondary">{footer}</div>}
        </div>
      </div>
    </main>
  )
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <Button type="submit" disabled={loading} aria-busy={loading} className="relative w-full">
      <span className={loading ? 'opacity-0' : undefined}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
          <span className="sr-only">Entrando…</span>
        </span>
      )}
    </Button>
  )
}

// Não há redefinição de senha por e-mail: o link explica o caminho certo para cada perfil
export function ForgotPassword({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const hintId = useId()

  return (
    <div className="-mt-2 flex flex-col items-end gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={hintId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-sm text-body-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Esqueceu a senha?
      </button>
      {open && (
        <p id={hintId} className="w-full rounded-sm bg-primary-subtle px-3 py-2 text-body-sm text-on-primary-subtle">
          {children}
        </p>
      )}
    </div>
  )
}
