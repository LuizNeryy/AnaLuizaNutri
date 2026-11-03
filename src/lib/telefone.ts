// Celular brasileiro para o envio do link pelo WhatsApp. O número existe só no navegador:
// nunca vai para o backend, nem é salvo ou logado.

const DIGITOS_CELULAR = 11

// Só os dígitos, no máximo 11. Quem cola "+55 (31) 9..." perde o 55 do país na frente.
export function digitosDoTelefone(texto: string): string {
  const digitos = texto.replace(/\D/g, '')
  const semPais = digitos.length > DIGITOS_CELULAR && digitos.startsWith('55') ? digitos.slice(2) : digitos
  return semPais.slice(0, DIGITOS_CELULAR)
}

// Máscara progressiva: (DD) 9XXXX-XXXX
export function formatarTelefone(digitos: string): string {
  if (digitos.length === 0) return ''
  if (digitos.length <= 2) return `(${digitos}`
  const ddd = digitos.slice(0, 2)
  const numero = digitos.slice(2)
  if (numero.length <= 5) return `(${ddd}) ${numero}`
  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`
}

// null = válido
export function erroDoTelefone(digitos: string): string | null {
  if (digitos.length !== DIGITOS_CELULAR) {
    return 'Informe o celular com DDD: 11 dígitos, no formato (DD) 9XXXX-XXXX.'
  }
  const ddd = Number(digitos.slice(0, 2))
  if (ddd < 11 || ddd > 99) {
    return 'DDD inválido: use um DDD entre 11 e 99.'
  }
  if (digitos[2] !== '9') {
    return 'Celular inválido: o número deve começar com 9 depois do DDD.'
  }
  return null
}

export function linkWhatsApp(digitos: string, mensagem: string): string {
  return `https://wa.me/55${digitos}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemDoConvite(link: string, nomeNutricionista: string | null): string {
  const apresentacao = nomeNutricionista?.trim() ? ` Aqui é ${nomeNutricionista.trim()}.` : ''
  return `Olá!${apresentacao} Use este link para criar seu acesso ao portal do paciente (válido por 72 horas): ${link}`
}
