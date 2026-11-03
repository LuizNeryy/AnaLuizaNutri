import { useEffect, useRef, useState } from 'react'
import { getStreak, type Streak } from '../../lib/streak'

const REFETCH_DEBOUNCE_MS = 1000

// Busca a sequência uma vez por página. `assinaturaChecks` muda quando o paciente marca
// ou desmarca alimentos; ~1s depois da última mudança a sequência é buscada de novo,
// para refletir o dia cumprido (a regra fica no backend).
// assinaturaChecks = null enquanto o plano do dia carrega.
export function useStreak(dia: string, assinaturaChecks: string | null): Streak | null {
  const [streak, setStreak] = useState<Streak | null>(null)
  const anterior = useRef<{ dia: string; assinatura: string | null } | null>(null)

  useEffect(() => {
    let ativo = true
    getStreak()
      .then((resposta) => ativo && setStreak(resposta))
      .catch(() => ativo && setStreak(null))
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    const antes = anterior.current
    anterior.current = { dia, assinatura: assinaturaChecks }
    // Trocar de dia (ou terminar de carregar) muda a assinatura sem check novo: não refaz a busca
    if (
      !antes ||
      antes.dia !== dia ||
      antes.assinatura === null ||
      assinaturaChecks === null ||
      antes.assinatura === assinaturaChecks
    ) {
      return
    }

    let ativo = true
    const id = setTimeout(() => {
      getStreak()
        .then((resposta) => ativo && setStreak(resposta))
        .catch(() => {})
    }, REFETCH_DEBOUNCE_MS)
    return () => {
      ativo = false
      clearTimeout(id)
    }
  }, [dia, assinaturaChecks])

  return streak
}
