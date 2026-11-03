import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { api } from '../lib/api'
import { Topbar } from './Topbar'

export function RequirePatientAuth() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    'loading',
  )

  useEffect(() => {
    api
      .get('/portal-paciente/session')
      .then(() => setStatus('authenticated'))
      .catch(() => setStatus('unauthenticated'))
  }, [])

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-body-sm text-ink-muted">Carregando...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Topbar area="patient" />
      <Outlet />
    </>
  )
}
