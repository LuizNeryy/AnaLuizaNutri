import { useEffect, useState, useSyncExternalStore } from 'react'

// Valor inicial lido de forma síncrona: a primeira renderização já escolhe a variante certa
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const lista = window.matchMedia(query)
      lista.addEventListener('change', onChange)
      return () => lista.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}

// Hora atual, recalculada a cada intervalo enquanto `ativo`
export function useAgora(ativo: boolean, intervaloMs = 60_000): Date {
  const [agora, setAgora] = useState(() => new Date())

  useEffect(() => {
    if (!ativo) return
    const id = setInterval(() => setAgora(new Date()), intervaloMs)
    return () => clearInterval(id)
  }, [ativo, intervaloMs])

  return agora
}
