// Roda com o test runner nativo do Node (npm test), sem dependência nova
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  caminhoDaArea,
  caminhoDaLinha,
  dominioDoImc,
  dominioDoPeso,
  escalaDoTempo,
  indiceMaisProximo,
  indicesDosRotulos,
  marcasDoEixo,
} from '../src/lib/grafico.ts'
import { calcularImc, faixaDoImc, posicaoNaRegua } from '../src/lib/imc.ts'
import {
  dataCurta,
  dataIsoLocal,
  diaMes,
  diasEntre,
  diferenca,
  erroDaAltura,
  erroDaData,
  erroDoPeso,
  lerDecimal,
  ordenarCronologico,
} from '../src/lib/medidas.ts'
import { caminhoSuave, caminhosDaSilhueta, fatorDoImc } from '../src/lib/silhueta.ts'

// Largura do desenho a partir das coordenadas x do caminho (comandos M/C alternam x y)
function larguraDoCaminho(d: string) {
  const numeros = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const xs = numeros.filter((_, i) => i % 2 === 0)
  return Math.max(...xs) - Math.min(...xs)
}

describe('fatorDoImc', () => {
  it('vai de 0 (IMC 17) a 1 (IMC 40) e prende nas pontas', () => {
    assert.equal(fatorDoImc(17), 0)
    assert.equal(fatorDoImc(40), 1)
    assert.equal(fatorDoImc(12), 0)
    assert.equal(fatorDoImc(55), 1)
    assert.ok(Math.abs(fatorDoImc(28.5) - 0.5) < 1e-9)
  })

  it('valor inválido vira o desenho mais magro em vez de NaN no SVG', () => {
    assert.equal(fatorDoImc(Number.NaN), 0)
    assert.equal(fatorDoImc(Number.POSITIVE_INFINITY), 0)
  })
})

describe('caminhosDaSilhueta', () => {
  for (const sexo of ['FEMININO', 'MASCULINO'] as const) {
    it(`${sexo}: caminhos válidos, sem NaN, e o corpo alarga com o IMC`, () => {
      const larguras = [0, 0.25, 0.5, 0.75, 1].map((fator) => {
        const c = caminhosDaSilhueta(sexo, fator)
        for (const d of [c.corpo, c.bracoDireito, c.bracoEsquerdo, c.cabeloTopo]) {
          assert.match(d, /^M[\d. ]+(C[\d. ]+)+Z$/)
          assert.ok(!d.includes('NaN'))
        }
        return larguraDoCaminho(c.corpo)
      })
      for (let i = 1; i < larguras.length; i++) assert.ok(larguras[i] > larguras[i - 1])
    })
  }

  it('o corpo é simétrico em torno do centro (x = 100)', () => {
    const numeros = caminhosDaSilhueta('MASCULINO', 0.4).corpo.match(/-?\d+(\.\d+)?/g)!.map(Number)
    const xs = numeros.filter((_, i) => i % 2 === 0)
    assert.ok(Math.abs(Math.max(...xs) - 100 - (100 - Math.min(...xs))) < 0.5)
  })

  it('só o feminino tem cabelo atrás da cabeça', () => {
    assert.equal(caminhosDaSilhueta('MASCULINO', 0.5).cabeloAtras, '')
    assert.notEqual(caminhosDaSilhueta('FEMININO', 0.5).cabeloAtras, '')
  })

  it('fator fora de 0..1 é preso', () => {
    assert.deepEqual(caminhosDaSilhueta('FEMININO', 3), caminhosDaSilhueta('FEMININO', 1))
    assert.deepEqual(caminhosDaSilhueta('FEMININO', -1), caminhosDaSilhueta('FEMININO', 0))
  })

  it('caminhoSuave passa por todos os pontos e fecha', () => {
    const d = caminhoSuave([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ])
    assert.ok(d.startsWith('M0 0'))
    assert.ok(d.endsWith('0 0Z'))
    assert.equal(d.match(/C/g)!.length, 3)
    assert.equal(caminhoSuave([{ x: 0, y: 0 }]), '')
  })
})

describe('IMC', () => {
  it('uma casa decimal, igual ao backend', () => {
    assert.equal(calcularImc(62.5, 187), 17.9)
    assert.equal(calcularImc(84.2, 172), 28.5)
  })

  it('posição na régua de 15 a 40, presa nas pontas', () => {
    assert.equal(posicaoNaRegua(15), 0)
    assert.equal(posicaoNaRegua(40), 1)
    assert.equal(posicaoNaRegua(10), 0)
    assert.equal(posicaoNaRegua(52), 1)
    assert.equal(posicaoNaRegua(27.5), 0.5)
  })

  it('faixas da OMS nas fronteiras', () => {
    assert.equal(faixaDoImc(18.4).nome, 'Abaixo do peso')
    assert.equal(faixaDoImc(18.5).nome, 'Peso normal')
    assert.equal(faixaDoImc(25).nome, 'Sobrepeso')
    assert.equal(faixaDoImc(30).nome, 'Obesidade')
  })
})

describe('leitura e validação das medidas', () => {
  it('aceita vírgula ou ponto e rejeita o resto', () => {
    assert.equal(lerDecimal('62,5'), 62.5)
    assert.equal(lerDecimal(' 62.5 '), 62.5)
    assert.equal(lerDecimal('187'), 187)
    for (const ruim of ['', 'abc', '1,2,3', '-5', '62,', '6 2']) assert.equal(lerDecimal(ruim), null)
  })

  it('peso: obrigatório, numérico, uma casa e entre 20 e 350', () => {
    assert.equal(erroDoPeso('62,5'), null)
    assert.equal(erroDoPeso('20'), null)
    assert.equal(erroDoPeso('350'), null)
    assert.match(erroDoPeso('')!, /Informe/)
    assert.match(erroDoPeso('abc')!, /números/)
    assert.match(erroDoPeso('62,55')!, /uma casa/)
    assert.match(erroDoPeso('19,9')!, /entre 20 e 350/)
    assert.match(erroDoPeso('351')!, /entre 20 e 350/)
  })

  it('altura: em centímetros, entre 100 e 250 (metros viram erro com dica)', () => {
    assert.equal(erroDaAltura('187'), null)
    assert.equal(erroDaAltura('170,5'), null)
    assert.match(erroDaAltura('1,87')!, /centímetros/)
    assert.match(erroDaAltura('251')!, /entre 100 e 250/)
    assert.match(erroDaAltura('')!, /Informe/)
  })

  it('data: existente, no formato certo e não futura', () => {
    assert.equal(erroDaData('2026-10-16', '2026-10-16'), null)
    assert.equal(erroDaData('2026-10-15', '2026-10-16'), null)
    assert.match(erroDaData('2026-10-17', '2026-10-16')!, /futuro/)
    assert.match(erroDaData('2026-02-30', '2026-10-16')!, /não existe/)
    assert.match(erroDaData('', '2026-10-16')!, /Informe/)
    assert.match(erroDaData('16/10/2026', '2026-10-16')!, /Informe/)
  })

  it('dataIsoLocal usa o dia do aparelho', () => {
    assert.equal(dataIsoLocal(new Date(2026, 9, 5, 23, 59)), '2026-10-05')
  })
})

describe('histórico de medidas', () => {
  const medidas = [
    { id: 'c', data: '2026-10-01T00:00:00.000Z', criadoEm: '2026-10-01T09:00:00Z' },
    { id: 'a', data: '2026-08-12T00:00:00.000Z', criadoEm: '2026-08-12T09:00:00Z' },
    { id: 'b2', data: '2026-09-05T00:00:00.000Z', criadoEm: '2026-09-05T15:00:00Z' },
    { id: 'b1', data: '2026-09-05T00:00:00.000Z', criadoEm: '2026-09-05T08:00:00Z' },
  ]

  it('datas pela parte do dia, sem fuso jogar para o dia anterior', () => {
    assert.equal(diaMes('2026-10-01T00:00:00.000Z'), '01/10')
    assert.equal(dataCurta('2026-10-01T00:00:00.000Z'), '01/10/2026')
  })

  it('ordena do mais antigo ao mais novo; no mesmo dia vale a hora do registro', () => {
    const copia = [...medidas]
    assert.deepEqual(ordenarCronologico(medidas).map((m) => m.id), ['a', 'b1', 'b2', 'c'])
    assert.deepEqual(medidas, copia)
  })

  it('sem criadoEm mantém a ordem original dentro do mesmo dia', () => {
    const lista = [
      { id: 'x', data: '2026-09-05' },
      { id: 'y', data: '2026-09-05' },
    ]
    assert.deepEqual(ordenarCronologico(lista).map((m) => m.id), ['x', 'y'])
  })

  it('diferença arredondada, com sinal e sem juízo de valor', () => {
    assert.deepEqual(diferenca(84.2, 90.3, 'kg'), { valor: -6.1, texto: '−6,1 kg', direcao: 'desceu' })
    assert.deepEqual(diferenca(61, 60.5, 'kg'), { valor: 0.5, texto: '+0,5 kg', direcao: 'subiu' })
    assert.equal(diferenca(28.5, 30.5).texto, '−2,0')
    assert.deepEqual(diferenca(70.04, 70, 'kg'), { valor: 0, texto: 'Sem mudança', direcao: 'igual' })
  })

  it('dias entre datas ignora hora e fuso', () => {
    assert.equal(diasEntre('2026-10-01T00:00:00.000Z', '2026-10-16'), 15)
    assert.equal(diasEntre('2026-10-16', '2026-10-16'), 0)
  })
})

describe('gráfico', () => {
  it('escala do tempo: espaçada pelos dias, não pela posição', () => {
    const datas = ['2026-09-01', '2026-09-11', '2026-10-01']
    const x = escalaDoTempo(datas, 0, 300)
    assert.equal(x('2026-09-01'), 0)
    assert.equal(x('2026-09-11'), 100)
    assert.equal(x('2026-10-01'), 300)
  })

  it('escala do tempo com uma data só (ou todas iguais) fica no meio', () => {
    assert.equal(escalaDoTempo(['2026-09-01'], 10, 110)('2026-09-01'), 60)
    assert.equal(escalaDoTempo(['2026-09-01', '2026-09-01'], 10, 110)('2026-09-01'), 60)
  })

  it('marcas do eixo são números redondos dentro do intervalo', () => {
    assert.deepEqual(marcasDoEixo(60, 80, 4), [60, 65, 70, 75, 80])
    assert.deepEqual(marcasDoEixo(16, 24, 4), [16, 18, 20, 22, 24])
    for (const marca of marcasDoEixo(61.3, 66.9)) assert.ok(marca >= 61.3 && marca <= 66.9)
  })

  it('eixo do peso tem folga e altura mínima mesmo com peso constante', () => {
    const constante = dominioDoPeso([70, 70])
    assert.ok(constante.min < 70 && constante.max > 70 && constante.max - constante.min >= 4)
    const real = dominioDoPeso([84.2, 90.3])
    assert.ok(real.min <= 84.2 && real.max >= 90.3)
    assert.ok(Number.isInteger(real.min) && Number.isInteger(real.max))
  })

  it('eixo do IMC cobre os dados e tem ao menos 5 pontos de altura', () => {
    const d = dominioDoImc([28.5, 28.5])
    assert.ok(d.min <= 27 && d.max >= 30 && d.max - d.min >= 5)
    const amplo = dominioDoImc([17.9, 30.5])
    assert.ok(amplo.min <= 17.9 && amplo.max >= 30.5)
  })

  it('índice mais próximo para o tooltip', () => {
    assert.equal(indiceMaisProximo([10, 100, 300], 90), 1)
    assert.equal(indiceMaisProximo([10, 100, 300], 5), 0)
    assert.equal(indiceMaisProximo([10, 100, 300], 999), 2)
  })

  it('rótulos do eixo x: pulam os pontos apertados, mas o último sempre aparece', () => {
    assert.deepEqual(indicesDosRotulos([0, 100, 200, 300], 80), [0, 1, 2, 3])
    assert.deepEqual(indicesDosRotulos([0, 40, 80, 300], 70), [0, 2, 3])
    assert.deepEqual(indicesDosRotulos([0, 100, 110], 50), [0, 2])
    assert.deepEqual(indicesDosRotulos([0, 10], 50), [1])
    assert.deepEqual(indicesDosRotulos([5], 50), [0])
    assert.deepEqual(indicesDosRotulos([], 50), [])
  })

  it('caminhos da linha e da área', () => {
    const pontos = [
      { x: 0, y: 10 },
      { x: 50, y: 20 },
    ]
    assert.equal(caminhoDaLinha(pontos), 'M0 10 L50 20')
    assert.equal(caminhoDaArea(pontos, 100), 'M0 10 L50 20 L50 100 L0 100 Z')
    assert.equal(caminhoDaArea([pontos[0]], 100), '')
  })
})
