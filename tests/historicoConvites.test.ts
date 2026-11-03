// Lógica da busca e da paginação do histórico de links (npm test, test runner do Node)
import assert from 'node:assert/strict'
import { describe, it, mock } from 'node:test'
import {
  caminhoDoHistorico,
  estadoDoHistorico,
  faixaExibida,
  paginaParaVoltar,
  paginasCompactas,
  type PaginaDeConvites,
} from '../src/lib/convitesAutocadastro.ts'
import { criarControleDeRequisicoes, criarDebounce } from '../src/lib/requisicaoRecente.ts'

const pagina = (extra: Partial<PaginaDeConvites>): PaginaDeConvites => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  ...extra,
})
const itens = (n: number) => Array.from({ length: n }, () => ({}) as PaginaDeConvites['items'][number])

describe('busca com debounce', () => {
  it('só dispara 300 ms depois da última tecla, com o último texto', () => {
    mock.timers.enable({ apis: ['setTimeout'] })
    try {
      const buscas: string[] = []
      const debounce = criarDebounce((texto: string) => buscas.push(texto), 300)

      debounce.chamar('m')
      mock.timers.tick(200)
      debounce.chamar('ma')
      mock.timers.tick(200)
      debounce.chamar('mar')
      mock.timers.tick(299)
      assert.deepEqual(buscas, [])
      mock.timers.tick(1)
      assert.deepEqual(buscas, ['mar'])
    } finally {
      mock.timers.reset()
    }
  })

  it('cancelar (ex.: botão limpar) descarta a busca agendada', () => {
    mock.timers.enable({ apis: ['setTimeout'] })
    try {
      const buscas: string[] = []
      const debounce = criarDebounce((texto: string) => buscas.push(texto), 300)
      debounce.chamar('maria')
      debounce.cancelar()
      mock.timers.tick(1000)
      assert.deepEqual(buscas, [])
    } finally {
      mock.timers.reset()
    }
  })
})

describe('requisições fora de ordem', () => {
  it('nova requisição aborta a anterior e só a última é aplicada', async () => {
    const controle = criarControleDeRequisicoes()
    const aplicadas: string[] = []
    const responder = (texto: string, ms: number) =>
      new Promise<string>((resolve) => setTimeout(() => resolve(texto), ms))

    const lenta = controle.nova()
    const pendenteLenta = responder('ma', 30).then((r) => lenta.ehAtual() && aplicadas.push(r))
    const rapida = controle.nova()
    const pendenteRapida = responder('maria', 5).then((r) => rapida.ehAtual() && aplicadas.push(r))
    await Promise.all([pendenteLenta, pendenteRapida])

    assert.equal(lenta.signal.aborted, true)
    assert.equal(rapida.signal.aborted, false)
    assert.deepEqual(aplicadas, ['maria'])
  })

  it('cancelar invalida a requisição em andamento', () => {
    const controle = criarControleDeRequisicoes()
    const requisicao = controle.nova()
    controle.cancelar()
    assert.equal(requisicao.ehAtual(), false)
  })
})

describe('troca de página', () => {
  it('monta a URL só com page, q (com trim) e status; nunca o tamanho da página', () => {
    assert.equal(caminhoDoHistorico({ page: 2, q: '', status: '' }), '/pacientes/convites-autocadastro?page=2')
    assert.equal(
      caminhoDoHistorico({ page: 1, q: '  maria & joão ', status: 'pendente' }),
      '/pacientes/convites-autocadastro?page=1&q=maria+%26+jo%C3%A3o&status=pendente',
    )
  })

  it('faixa "Mostrando a–b de N"', () => {
    assert.equal(faixaExibida(pagina({ items: itens(10), total: 25, page: 1 })), 'Mostrando 1–10 de 25')
    assert.equal(faixaExibida(pagina({ items: itens(5), total: 25, page: 3 })), 'Mostrando 21–25 de 25')
  })

  it('página que ficou vazia volta para a última válida', () => {
    // Revogou o único item da página 3 com o filtro "Pendentes": agora há 20
    assert.equal(paginaParaVoltar(pagina({ items: [], total: 20, page: 3 })), 2)
    assert.equal(paginaParaVoltar(pagina({ items: [], total: 0, page: 2 })), 1)
    assert.equal(paginaParaVoltar(pagina({ items: itens(3), total: 23, page: 3 })), null)
    assert.equal(paginaParaVoltar(pagina({ items: [], total: 0, page: 1 })), null)
  })

  it('números compactos com reticências', () => {
    assert.deepEqual(paginasCompactas(1, 5), [1, 2, 3, 4, 5])
    assert.deepEqual(paginasCompactas(1, 20), [1, 2, 3, 4, 'reticencias', 20])
    assert.deepEqual(paginasCompactas(10, 20), [1, 'reticencias', 9, 10, 11, 'reticencias', 20])
    assert.deepEqual(paginasCompactas(20, 20), [1, 'reticencias', 17, 18, 19, 20])
    assert.deepEqual(paginasCompactas(4, 20), [1, 2, 3, 4, 5, 'reticencias', 20])
  })
})

describe('estados da lista', () => {
  it('carregando, erro, vazio, sem resultado e lista', () => {
    assert.equal(estadoDoHistorico({ pagina: null, erro: false, comFiltro: false }), 'carregando')
    assert.equal(estadoDoHistorico({ pagina: null, erro: true, comFiltro: false }), 'erro')
    assert.equal(estadoDoHistorico({ pagina: pagina({}), erro: false, comFiltro: false }), 'vazio')
    assert.equal(estadoDoHistorico({ pagina: pagina({}), erro: false, comFiltro: true }), 'sem-resultado')
    assert.equal(
      estadoDoHistorico({ pagina: pagina({ items: itens(1), total: 1 }), erro: false, comFiltro: true }),
      'lista',
    )
  })
})
