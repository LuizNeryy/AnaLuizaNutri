// Linha do tempo única da cena de login (segundos a partir da montagem).
// Ajuste o ritmo aqui; os componentes só leem estas constantes.
export const TIMELINE = {
  pillar: 0,
  pillarDuration: 0.4,
  beam: 0.3,
  beamDuration: 0.3,
  // Início de cada queda, na ordem de FALLING_FOODS (balance-scale.tsx)
  drops: [0.7, 1.3, 1.9, 2.5],
  fallDuration: 0.55,
  handwriting: 2.8,
  revealDuration: 1.8,
  underlineDuration: 0.5,
  tagline: 4.8,
  taglineDuration: 0.4,
} as const
