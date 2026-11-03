import {
  Apple,
  Banana,
  Beef,
  Carrot,
  Cherry,
  Citrus,
  Coffee,
  Cookie,
  CupSoda,
  Drumstick,
  Egg,
  Fish,
  Grape,
  IceCreamCone,
  Milk,
  Nut,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

// Chaves compartilhadas com backend/src/alimentos/icones-disponiveis.ts.
// Mantenha as duas listas em sincronia ao adicionar/remover um ícone.
export const ICONES_ALIMENTO: { chave: string; label: string; Icon: LucideIcon }[] = [
  { chave: 'apple', label: 'Maçã', Icon: Apple },
  { chave: 'banana', label: 'Banana', Icon: Banana },
  { chave: 'carrot', label: 'Cenoura', Icon: Carrot },
  { chave: 'cherry', label: 'Cereja', Icon: Cherry },
  { chave: 'citrus', label: 'Cítrico', Icon: Citrus },
  { chave: 'grape', label: 'Uva', Icon: Grape },
  { chave: 'wheat', label: 'Cereal', Icon: Wheat },
  { chave: 'egg', label: 'Ovo', Icon: Egg },
  { chave: 'fish', label: 'Peixe', Icon: Fish },
  { chave: 'beef', label: 'Carne', Icon: Beef },
  { chave: 'drumstick', label: 'Frango', Icon: Drumstick },
  { chave: 'milk', label: 'Leite', Icon: Milk },
  { chave: 'coffee', label: 'Café', Icon: Coffee },
  { chave: 'salad', label: 'Salada', Icon: Salad },
  { chave: 'soup', label: 'Sopa', Icon: Soup },
  { chave: 'cookie', label: 'Biscoito', Icon: Cookie },
  { chave: 'ice-cream-cone', label: 'Sobremesa', Icon: IceCreamCone },
  { chave: 'nut', label: 'Oleaginosa', Icon: Nut },
  { chave: 'cup-soda', label: 'Bebida', Icon: CupSoda },
  { chave: 'sandwich', label: 'Sanduíche', Icon: Sandwich },
  { chave: 'pizza', label: 'Pizza', Icon: Pizza },
]

const MAPA_ICONES = new Map(ICONES_ALIMENTO.map((item) => [item.chave, item.Icon]))

export function iconeDoAlimento(chave?: string | null): LucideIcon {
  return (chave && MAPA_ICONES.get(chave)) || Utensils
}
