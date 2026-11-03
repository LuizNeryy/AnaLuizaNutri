// Silhueta frontal estilizada para o portal. Sem rosto e com variação moderada:
// é ilustração do IMC, não retrato do paciente.
//
// Cada ponto do contorno tem uma posição "magra" (fator 0) e "cheia" (fator 1); o desenho
// interpola entre as duas e suaviza com Catmull-Rom. Só a metade direita é descrita; a
// esquerda é o espelho em torno de CENTRO_X.

export type SexoSilhueta = 'FEMININO' | 'MASCULINO'

// [x magro, x cheio, y]: x é a distância até o centro
type PontoVariavel = readonly [number, number, number]

export const SILHUETA_VIEWBOX = { largura: 200, altura: 400 }
const CENTRO_X = SILHUETA_VIEWBOX.largura / 2

export const CABECA = { cx: CENTRO_X, cy: 46, r: 23 }

// Tronco + pernas, metade direita: do pescoço descendo pelo lado de fora até o pé e
// subindo pela parte de dentro da perna até a virilha.
const CORPO: Record<SexoSilhueta, PontoVariavel[]> = {
  MASCULINO: [
    [9, 11, 66],
    [10, 12, 80],
    [30, 36, 88],
    [40, 48, 100],
    [36, 47, 124],
    [33, 47, 150],
    [29, 50, 178],
    [32, 51, 205],
    [31, 46, 236],
    [24, 32, 290],
    [23, 30, 322],
    [15, 18, 362],
    [24, 27, 380],
    [6, 7, 384],
    [5, 6, 366],
    [6, 7, 322],
    [6, 5, 290],
    [4, 2, 244],
    [0, 0, 226],
  ],
  FEMININO: [
    [8, 10, 66],
    [9, 11, 82],
    [25, 31, 90],
    [33, 41, 102],
    [30, 41, 124],
    [31, 45, 146],
    [23, 42, 176],
    [36, 54, 210],
    [34, 50, 238],
    [22, 30, 292],
    [21, 28, 322],
    [13, 16, 362],
    [22, 25, 380],
    [6, 7, 384],
    [5, 6, 366],
    [6, 7, 322],
    [6, 5, 292],
    [5, 2, 248],
    [0, 0, 230],
  ],
}

// Braço direito, fechado: ombro → lado de fora → mão → lado de dentro → axila.
// Fica atrás do tronco, então a junção no ombro não aparece.
const BRACO: Record<SexoSilhueta, PontoVariavel[]> = {
  MASCULINO: [
    [34, 40, 92],
    [43, 52, 102],
    [48, 61, 150],
    [52, 68, 205],
    [53, 70, 226],
    [47, 63, 232],
    [44, 59, 212],
    [39, 52, 158],
    [34, 44, 120],
  ],
  FEMININO: [
    [28, 34, 94],
    [36, 45, 104],
    [41, 54, 150],
    [46, 62, 200],
    [47, 64, 220],
    [41, 57, 226],
    [39, 53, 206],
    [34, 46, 156],
    [29, 38, 122],
  ],
}

// Cabelo por cima da cabeça (topo) e, no feminino, também atrás dela até os ombros
const CABELO_TOPO: Record<SexoSilhueta, PontoVariavel[]> = {
  MASCULINO: [
    [0, 0, 21],
    [16, 16, 25],
    [23.5, 23.5, 36],
    [22, 22, 42],
    [18, 18, 33],
    [0, 0, 30],
  ],
  FEMININO: [
    [0, 0, 20.5],
    [17, 17, 25],
    [24, 24, 40],
    [22.5, 22.5, 52],
    [17, 17, 36],
    [0, 0, 31],
  ],
}

const CABELO_ATRAS: Record<SexoSilhueta, PontoVariavel[] | null> = {
  MASCULINO: null,
  FEMININO: [
    [0, 0, 19],
    [20, 20, 25],
    [28, 28, 44],
    [29, 30, 74],
    [24, 26, 86],
    [13, 14, 78],
    [12, 12, 56],
    [0, 0, 40],
  ],
}

// IMC → 0..1. Abaixo de 17 desenha como 17, acima de 40 como 40.
const IMC_MIN = 17
const IMC_MAX = 40

export function fatorDoImc(imc: number): number {
  if (!Number.isFinite(imc)) return 0
  return Math.min(1, Math.max(0, (imc - IMC_MIN) / (IMC_MAX - IMC_MIN)))
}

type Ponto = { x: number; y: number }

function interpolar(pontos: PontoVariavel[], fator: number): Ponto[] {
  return pontos.map(([magro, cheio, y]) => ({ x: magro + (cheio - magro) * fator, y }))
}

function espelhar(metade: Ponto[]): Ponto[] {
  const direita = metade.map((p) => ({ x: CENTRO_X + p.x, y: p.y }))
  // Pontos no eixo (x = 0) não se repetem do outro lado
  const esquerda = metade
    .filter((p) => p.x > 0)
    .reverse()
    .map((p) => ({ x: CENTRO_X - p.x, y: p.y }))
  return [...direita, ...esquerda]
}

const r = (n: number) => Math.round(n * 10) / 10

// Curva fechada suave passando por todos os pontos (Catmull-Rom → Bézier cúbica)
export function caminhoSuave(pontos: Ponto[]): string {
  const n = pontos.length
  if (n < 3) return ''
  const p = (i: number) => pontos[(i + n) % n]
  let d = `M${r(p(0).x)} ${r(p(0).y)}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += `C${r(c1.x)} ${r(c1.y)} ${r(c2.x)} ${r(c2.y)} ${r(p2.x)} ${r(p2.y)}`
  }
  return `${d}Z`
}

export type CaminhosDaSilhueta = {
  corpo: string
  bracoDireito: string
  bracoEsquerdo: string
  cabeloTopo: string
  // '' quando não há (cabelo curto)
  cabeloAtras: string
}

export function caminhosDaSilhueta(sexo: SexoSilhueta, fator: number): CaminhosDaSilhueta {
  const f = Math.min(1, Math.max(0, fator))
  const braco = interpolar(BRACO[sexo], f)
  const atras = CABELO_ATRAS[sexo]
  return {
    corpo: caminhoSuave(espelhar(interpolar(CORPO[sexo], f))),
    bracoDireito: caminhoSuave(braco.map((p) => ({ x: CENTRO_X + p.x, y: p.y }))),
    bracoEsquerdo: caminhoSuave(braco.map((p) => ({ x: CENTRO_X - p.x, y: p.y })).reverse()),
    cabeloTopo: caminhoSuave(espelhar(interpolar(CABELO_TOPO[sexo], f))),
    cabeloAtras: atras ? caminhoSuave(espelhar(interpolar(atras, f))) : '',
  }
}
