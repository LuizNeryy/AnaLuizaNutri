import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react'
import {
  caminhoDaArea,
  caminhoDaLinha,
  escalaDoTempo,
  indiceMaisProximo,
  indicesDosRotulos,
  marcasDoEixo,
  type PontoDeSerie,
} from '../../../lib/grafico'
import type { FaixaImc } from '../../../lib/imc'
import { dataCurta, diaMes } from '../../../lib/medidas'
import { EASE_PAINEL, formatarNumero } from '../painel/formato'

const ALTURA_MINIMA = 240
const MARGEM = { topo: 12, direita: 14, baixo: 28, esquerda: 42 }

interface GraficoProgressaoProps {
  // Cronológico (do mais antigo ao mais novo), no mínimo dois pontos
  pontos: PontoDeSerie[]
  dominio: { min: number; max: number }
  casas: number
  unidade?: string
  // Faixas da OMS desenhadas ao fundo (só no gráfico do IMC)
  faixas?: FaixaImc[]
  // Resumo em texto para leitor de tela; os mesmos números estão na tabela do histórico
  rotulo: string
}

// Gráfico de linha em SVG, sem biblioteca. O eixo x é proporcional ao tempo. Passe o mouse
// (ou o dedo) para ver o valor de cada medida.
export function GraficoProgressao({ pontos, dominio, casas, unidade, faixas, rotulo }: GraficoProgressaoProps) {
  const reduceMotion = useReducedMotion()
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const caixa = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 })
  const [ativo, setAtivo] = useState<number | null>(null)

  useEffect(() => {
    const elemento = caixa.current
    if (!elemento) return
    const observador = new ResizeObserver(([entrada]) =>
      setTamanho({ largura: Math.round(entrada.contentRect.width), altura: Math.round(entrada.contentRect.height) }),
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  const formatar = (valor: number) => `${formatarNumero(valor, casas)}${unidade ? ` ${unidade}` : ''}`

  const { largura } = tamanho
  const altura = Math.max(ALTURA_MINIMA, tamanho.altura)
  let conteudo = null
  if (largura > 0) {
    const x0 = MARGEM.esquerda
    const x1 = largura - MARGEM.direita
    const y0 = MARGEM.topo
    const y1 = altura - MARGEM.baixo
    const escalaX = escalaDoTempo(
      pontos.map((p) => p.data),
      x0 + 8,
      x1 - 8,
    )
    const escalaY = (valor: number) => y1 - ((valor - dominio.min) / (dominio.max - dominio.min)) * (y1 - y0)
    const coordenadas = pontos.map((p) => ({ x: escalaX(p.data), y: escalaY(p.valor) }))
    const marcas = marcasDoEixo(dominio.min, dominio.max, 4)
    const variosAnos = new Set(pontos.map((p) => p.data.slice(0, 4))).size > 1
    const indicesX = indicesDosRotulos(
      coordenadas.map((c) => c.x),
      56,
    )
    const ultimo = pontos.length - 1

    const moverPonteiro = (evento: PointerEvent<SVGRectElement>) => {
      const caixaSvg = svg.current?.getBoundingClientRect()
      if (!caixaSvg) return
      setAtivo(
        indiceMaisProximo(
          coordenadas.map((c) => c.x),
          evento.clientX - caixaSvg.left,
        ),
      )
    }

    const pontoAtivo = ativo !== null ? coordenadas[ativo] : null
    const dadosAtivos = ativo !== null ? pontos[ativo] : null

    conteudo = (
      <>
        <svg ref={svg} width={largura} height={altura} role="img" aria-label={rotulo} className="absolute left-0 top-0 overflow-visible">
          <defs>
            <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {faixas?.map((faixa) => {
            const de = Math.max(faixa.min, dominio.min)
            const ate = Math.min(faixa.max, dominio.max)
            if (ate <= de) return null
            return (
              <rect
                key={faixa.nome}
                x={x0}
                y={escalaY(ate)}
                width={x1 - x0}
                height={escalaY(de) - escalaY(ate)}
                fill={faixa.cor}
                aria-hidden="true"
              />
            )
          })}

          <g aria-hidden="true">
            {marcas.map((marca) => (
              <g key={marca}>
                <line
                  x1={x0}
                  x2={x1}
                  y1={escalaY(marca)}
                  y2={escalaY(marca)}
                  stroke="var(--color-border)"
                  strokeOpacity={0.35}
                  strokeDasharray="3 4"
                />
                <text
                  x={x0 - 8}
                  y={escalaY(marca) + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="var(--color-ink-muted)"
                  className="tabular-nums"
                >
                  {formatarNumero(marca, Number.isInteger(marca) ? 0 : 1)}
                </text>
              </g>
            ))}
            {indicesX.map((indice) => (
              <text
                key={indice}
                x={coordenadas[indice].x}
                y={altura - 8}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-ink-muted)"
                className="tabular-nums"
              >
                {variosAnos ? dataCurta(pontos[indice].data).slice(0, 6) + pontos[indice].data.slice(2, 4) : diaMes(pontos[indice].data)}
              </text>
            ))}
          </g>

          {pontoAtivo && (
            <line
              x1={pontoAtivo.x}
              x2={pontoAtivo.x}
              y1={y0}
              y2={y1}
              stroke="var(--color-primary)"
              strokeOpacity={0.35}
              aria-hidden="true"
            />
          )}

          <motion.path
            d={caminhoDaArea(coordenadas, y1)}
            fill={`url(#area-${id})`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            aria-hidden="true"
          />
          <motion.path
            d={caminhoDaLinha(coordenadas)}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: EASE_PAINEL }}
            aria-hidden="true"
          />
          {coordenadas.map((ponto, i) => (
            <motion.circle
              key={`${pontos[i].data}-${i}`}
              cx={ponto.x}
              cy={ponto.y}
              r={ativo === i ? 7 : i === ultimo ? 6 : 4}
              fill={i === ultimo ? 'var(--color-primary)' : 'var(--color-surface)'}
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.2 + (0.9 * i) / Math.max(1, ultimo) }}
              aria-hidden="true"
            />
          ))}

          <rect
            x={x0}
            y={y0 - 4}
            width={x1 - x0}
            height={y1 - y0 + 8}
            fill="transparent"
            style={{ touchAction: 'pan-y' }}
            onPointerMove={moverPonteiro}
            onPointerDown={moverPonteiro}
            onPointerLeave={() => setAtivo(null)}
          />
        </svg>

        {pontoAtivo && dadosAtivos && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 text-caption shadow-md"
            style={{
              left: Math.min(Math.max(pontoAtivo.x, 56), largura - 56),
              top: pontoAtivo.y > 56 ? pontoAtivo.y - 52 : pontoAtivo.y + 14,
            }}
          >
            <span className="block text-ink-secondary">{dataCurta(dadosAtivos.data)}</span>
            <strong className="text-body-sm text-ink tabular-nums">{formatar(dadosAtivos.valor)}</strong>
          </div>
        )}
      </>
    )
  }

  return (
    <div ref={caixa} className="relative w-full flex-1" style={{ minHeight: ALTURA_MINIMA }}>
      {conteudo}
    </div>
  )
}
