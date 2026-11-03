// Busca enquanto digita: espera o usuário parar (debounce) e garante que só a resposta da
// última requisição seja usada, mesmo que uma anterior, mais lenta, chegue depois.

export function criarDebounce<A extends unknown[]>(funcao: (...args: A) => void, esperaMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    chamar(...args: A) {
      clearTimeout(timer)
      timer = setTimeout(() => funcao(...args), esperaMs)
    },
    cancelar() {
      clearTimeout(timer)
    },
  }
}

// Cada nova requisição cancela a anterior (AbortController) e a marca como antiga
export function criarControleDeRequisicoes() {
  let atual: AbortController | null = null
  return {
    nova() {
      atual?.abort()
      const controle = new AbortController()
      atual = controle
      return { signal: controle.signal, ehAtual: () => atual === controle && !controle.signal.aborted }
    },
    cancelar() {
      atual?.abort()
      atual = null
    },
  }
}
