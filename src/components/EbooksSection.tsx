import { useState } from 'react'
import { motion } from 'motion/react'
import {
  BookOpen,
  Download,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react'

const WHATSAPP_PHONE = '553184759120'

interface Ebook {
  id: string
  title: string
  subtitle: string
  tag: string
  tagColor: string
  price: string
  originalPrice?: string
  isFree?: boolean
  description: string
  highlights: string[]
  format: string
  pages: string
  actionLabel: string
  whatsappMessage: string
  accentColor: string
}

const EBOOKS_DATA: Ebook[] = [
  {
    id: 'ebook-gratuito',
    title: 'Guia de Alimentação Sem Neuras',
    subtitle: 'O passo a passo para se alimentar bem sem dietas restritivas',
    tag: 'Gratuito',
    tagColor: 'bg-[#5E6B1E] text-white',
    price: 'R$ 0,00',
    isFree: true,
    description:
      'Aprenda como descomplicar o seu prato e criar hábitos alimentares sustentáveis para a rotina diária sem abrir mão do que você gosta.',
    highlights: [
      'Como montar um prato inteligente em 5 minutos',
      'Estratégias simples para controlar a compulsão noturna',
      'Checklist de compras econômicas para a feira e supermercado',
      'Receitas fáceis para o café da manhã e lanches rápidos'
    ],
    format: 'PDF Digital de Alta Resolução',
    pages: '28 páginas ilustradas',
    actionLabel: 'Baixar Gratuitamente',
    whatsappMessage: 'Olá, Ana Luiza! Gostaria de receber o seu Guia Gratuito de Alimentação Sem Neuras.',
    accentColor: '#5E6B1E'
  },
  {
    id: 'ebook-mitos',
    title: 'Desvendando os Mitos da Nutrição',
    subtitle: 'O que a ciência comprovou sobre jejum, glúten e carboidratos',
    tag: 'Mais Vendido',
    tagColor: 'bg-[#E8701A] text-white',
    price: 'R$ 29,90',
    originalPrice: 'R$ 59,90',
    isFree: false,
    description:
      'Chega de acreditar em terrorismo nutricional da internet. Entenda o que é verdade e o que é armadilha da indústria para você emagrecer com saúde.',
    highlights: [
      'Carboidrato à noite realmente engorda?',
      'Como o metabolismo funciona sem precisar de suplementos caros',
      'A verdade sobre jejum intermitente e dietas da moda',
      'Orientações práticas baseadas nas diretrizes científicas mais recentes'
    ],
    format: 'E-book Completo + Guia de Dúvidas',
    pages: '64 páginas com referências científicas',
    actionLabel: 'Garantir E-book por R$ 29,90',
    whatsappMessage: 'Olá, Ana Luiza! Gostaria de adquirir o E-book Desvendando os Mitos da Nutrição.',
    accentColor: '#E8701A'
  },
  {
    id: 'ebook-mealprep',
    title: 'Manual de Organização & Meal Prep',
    subtitle: 'Cozinhe para a semana toda em apenas 2 horas com sabor',
    tag: 'Lançamento',
    tagColor: 'bg-[#48679D] text-white',
    price: 'R$ 34,90',
    originalPrice: 'R$ 67,00',
    isFree: false,
    description:
      'Tenha marmitas saborosas e frescas prontas para a semana. Economize tempo, dinheiro e garanta adesão ao seu plano alimentar mesmo na correria.',
    highlights: [
      'Cardápio semanal estruturado com lista de compras pronta',
      'Técnicas de congelamento e descongelamento sem perder textura',
      'Guia de potes e conservação segura de saladas e proteínas',
      'Temperos curinga que transformam qualquer refeição simples'
    ],
    format: 'E-book + Planilha de Planejamento',
    pages: '52 páginas práticas com passo a passo',
    actionLabel: 'Garantir Acesso por R$ 34,90',
    whatsappMessage: 'Olá, Ana Luiza! Gostaria de adquirir o Manual de Organização e Meal Prep.',
    accentColor: '#48679D'
  }
]

export function EbooksSection() {
  const [activeTab, setActiveTab] = useState<'todos' | 'gratuitos' | 'pagos'>('todos')

  function handleOrder(message: string) {
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const filteredEbooks = EBOOKS_DATA.filter((item) => {
    if (activeTab === 'gratuitos') return item.isFree
    if (activeTab === 'pagos') return !item.isFree
    return true
  })

  return (
    <section id="ebooks" className="py-24 bg-[#FAF8F2] relative overflow-hidden border-t border-[#EFE9D2]">
      {/* Detalhe de fundo sutil */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#EEA4C2]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#5E6B1E]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9D2] border border-[#5E6B1E]/20 text-[#5E6B1E] text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen size={14} className="text-[#5E6B1E]" />
            <span>Materiais & E-books Digitais</span>
          </div>

          <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2913] tracking-tight leading-tight mb-4">
            Conhecimento prático para transformar sua relação com a comida.
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Materiais desenvolvidos com rigor científico e aplicabilidade real, para te guiar em qualquer lugar e no seu próprio ritmo.
          </p>

          {/* Filtros em Abas */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'todos'
                  ? 'bg-[#5E6B1E] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/60'
              }`}
            >
              Todos os Materiais
            </button>
            <button
              onClick={() => setActiveTab('gratuitos')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'gratuitos'
                  ? 'bg-[#5E6B1E] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/60'
              }`}
            >
              Gratuitos
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'pagos'
                  ? 'bg-[#5E6B1E] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/60'
              }`}
            >
              E-books Completos
            </button>
          </div>
        </div>

        {/* Grade de E-books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredEbooks.map((ebook, idx) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Topo do Card com Cobertura Visual de Livro */}
              <div className="p-7 pb-5 bg-gradient-to-br from-[#FAF8F2] to-[#EFE9D2]/40 border-b border-[#EFE9D2]/80 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${ebook.tagColor}`}>
                    {ebook.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText size={14} className="text-[#5E6B1E]" />
                    <span>{ebook.pages}</span>
                  </div>
                </div>

                <h3 className="font-title text-xl font-bold text-gray-900 group-hover:text-[#5E6B1E] transition-colors mb-2 leading-snug">
                  {ebook.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {ebook.subtitle}
                </p>
              </div>

              {/* Corpo com Destaques */}
              <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {ebook.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      O que você vai aprender:
                    </p>
                    {ebook.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                        <CheckCircle2 size={15} className="text-[#5E6B1E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preço e Botão de Ação */}
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-title text-2xl font-extrabold text-[#1F2913]">
                        {ebook.price}
                      </span>
                      {ebook.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {ebook.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {ebook.format}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrder(ebook.whatsappMessage)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-title text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                      ebook.isFree
                        ? 'bg-[#5E6B1E] hover:bg-[#4E5919] text-white hover:shadow-md'
                        : 'bg-[#E8701A] hover:bg-[#D46313] text-white hover:shadow-lg hover:scale-[1.01]'
                    }`}
                  >
                    {ebook.isFree ? <Download size={16} /> : <ShoppingBag size={16} />}
                    <span>{ebook.actionLabel}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Garantia e Suporte */}
        <div className="mt-14 max-w-2xl mx-auto rounded-2xl bg-[#EFE9D2]/50 border border-[#5E6B1E]/15 p-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#5E6B1E]/10 flex items-center justify-center text-[#5E6B1E] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">
              Acesso Imediato & Suporte Personalizado
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Receba o arquivo direto no seu e-mail e WhatsApp. Dúvidas sobre o conteúdo? Canal direto aberto com a equipe.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
