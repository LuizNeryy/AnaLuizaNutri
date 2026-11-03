// Roda com o test runner nativo do Node (npm test), sem dependência nova
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  digitosDoTelefone,
  erroDoTelefone,
  formatarTelefone,
  linkWhatsApp,
  mensagemDoConvite,
} from '../src/lib/telefone.ts'

describe('digitosDoTelefone', () => {
  it('fica só com os dígitos, no máximo 11', () => {
    assert.equal(digitosDoTelefone('(31) 99876-5432'), '31998765432')
    assert.equal(digitosDoTelefone('3199876543299'), '31998765432')
    assert.equal(digitosDoTelefone('abc'), '')
  })

  it('tira o 55 do país de um número colado com +55', () => {
    assert.equal(digitosDoTelefone('+55 (31) 99876-5432'), '31998765432')
    assert.equal(digitosDoTelefone('5531998765432'), '31998765432')
  })

  it('não tira 55 quando é o DDD', () => {
    assert.equal(digitosDoTelefone('55998765432'), '55998765432')
  })
})

describe('formatarTelefone', () => {
  it('aplica a máscara (DD) 9XXXX-XXXX enquanto digita', () => {
    assert.equal(formatarTelefone(''), '')
    assert.equal(formatarTelefone('3'), '(3')
    assert.equal(formatarTelefone('31'), '(31')
    assert.equal(formatarTelefone('319'), '(31) 9')
    assert.equal(formatarTelefone('3199876'), '(31) 99876')
    assert.equal(formatarTelefone('31998765'), '(31) 99876-5')
    assert.equal(formatarTelefone('31998765432'), '(31) 99876-5432')
  })
})

describe('erroDoTelefone', () => {
  it('aceita celular com 11 dígitos, DDD válido e 9 na frente', () => {
    assert.equal(erroDoTelefone('31998765432'), null)
    assert.equal(erroDoTelefone('11912345678'), null)
    assert.equal(erroDoTelefone('99912345678'), null)
  })

  it('recusa número incompleto ou fixo (10 dígitos)', () => {
    assert.match(erroDoTelefone('3198765432') ?? '', /11 dígitos/)
    assert.match(erroDoTelefone('') ?? '', /11 dígitos/)
  })

  it('recusa DDD fora de 11 a 99', () => {
    assert.match(erroDoTelefone('10998765432') ?? '', /DDD/)
    assert.match(erroDoTelefone('01998765432') ?? '', /DDD/)
  })

  it('recusa quando o terceiro dígito não é 9', () => {
    assert.match(erroDoTelefone('31898765432') ?? '', /começar com 9/)
  })
})

describe('linkWhatsApp', () => {
  it('normaliza para 55 + DDD + número e codifica a mensagem', () => {
    const link = linkWhatsApp('31998765432', 'Olá! Link: https://x.com/cadastro/a_b-c?d=1&e=2')
    const url = new URL(link)
    assert.equal(url.origin, 'https://wa.me')
    assert.equal(url.pathname, '/5531998765432')
    assert.equal(url.searchParams.get('text'), 'Olá! Link: https://x.com/cadastro/a_b-c?d=1&e=2')
    assert.ok(link.includes(encodeURIComponent('&e=2')))
  })
})

describe('mensagemDoConvite', () => {
  it('apresenta a nutricionista quando o nome está disponível', () => {
    assert.equal(
      mensagemDoConvite('https://app/cadastro/t', 'Ana Luiza'),
      'Olá! Aqui é Ana Luiza. Use este link para criar seu acesso ao Equilibra (válido por 72 horas): https://app/cadastro/t',
    )
  })

  it('omite a apresentação sem o nome', () => {
    assert.equal(
      mensagemDoConvite('https://app/cadastro/t', null),
      'Olá! Use este link para criar seu acesso ao Equilibra (válido por 72 horas): https://app/cadastro/t',
    )
  })
})
