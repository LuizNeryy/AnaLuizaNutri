import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  BookOpen,
  ArrowLeft,
  MessageCircle,
  FileText,
  CheckCircle2,
  Download,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react'

const WHATSAPP_PHONE = '553184759120'

export interface EbookItem {
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
  whatsappMessage?: string
  externalUrl?: string
}

// Quando a nutricionista não tiver cadastrado materiais, basta deixar o array vazio []
// Exemplo ativo:
export const EBOOKS_CATALOG: EbookItem[] = [
  /* Pode ser deixado vazio [] quando não houver materiais cadastrados */
]

export function EbooksPage() {
  const [activeTab, setActiveTab] = useState<'todos' | 'gratuitos' | 'pagos'>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  function openWhatsApp(msg?: string) {
    const text =
      msg ||
      'Olá, Ana Luiza! Acessei sua página de materiais e gostaria de mais informações.'
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  function handleAction(item: EbookItem) {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank')
    } else {
      openWhatsApp(item.whatsappMessage || `Olá, Ana Luiza! Gostaria de adquirir o material: ${item.title}`)
    }
  }

  const hasItems = EBOOKS_CATALOG.length > 0

  const filteredEbooks = EBOOKS_CATALOG.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (activeTab === 'gratuitos') return item.isFree
    if (activeTab === 'pagos') return !item.isFree
    return true
  })

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-gray-900 font-sans selection:bg-[#EEA4C2]/40 selection:text-[#5E6B1E]">
      
      {/* 1. Header Minimalista da Página de E-books */}
      <header className="sticky top-0 z-50 bg-[#5E6B1E] text-white shadow-md border-b border-[#4E5919]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition">
              <ArrowLeft size={16} />
            </div>
            <span>Voltar ao Início</span>
          </Link>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#4E5919] border border-[#EEA4C2]/40 flex items-center justify-center text-white font-title font-bold text-sm shadow-inner">
              AL
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <span className="block font-title text-base font-bold text-white tracking-wide">Ana Luiza</span>
              <span className="block text-[10px] uppercase tracking-widest text-[#EFE9D2] font-semibold">Nutricionista</span>
            </div>
          </Link>

          <button
            onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei sua página de e-books e materiais e gostaria de falar com você.')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E8701A] hover:bg-[#D46313] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>
        </div>
      </header>

      {/* 2. Hero da Página de Materiais */}
      <section className="relative py-16 sm:py-20 border-b border-[#EFE9D2] overflow-hidden bg-gradient-to-b from-[#FAF8F2] to-[#EFE9D2]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9D2] border border-[#5E6B1E]/20 text-[#5E6B1E] text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen size={14} className="text-[#5E6B1E]" />
            <span>Biblioteca Digital & E-books</span>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2913] tracking-tight leading-tight mb-4">
            E-books & Materiais Educativos
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Guias práticos, receitas e estratégias com embasamento científico para você ter autonomia alimentar e cuidar da sua saúde no dia a dia.
          </p>

          {/* Se houver materiais, mostra o filtro e busca */}
          {hasItems && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por tema ou título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#EFE9D2] rounded-full focus:outline-none focus:border-[#5E6B1E] transition shadow-2xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('todos')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'todos'
                      ? 'bg-[#5E6B1E] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/50'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveTab('gratuitos')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'gratuitos'
                      ? 'bg-[#5E6B1E] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/50'
                  }`}
                >
                  Gratuitos
                </button>
                <button
                  onClick={() => setActiveTab('pagos')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'pagos'
                      ? 'bg-[#5E6B1E] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#EFE9D2]/50'
                  }`}
                >
                  Pagos
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Caso 1: SEM CONTEÚDOS */}
        {!hasItems || filteredEbooks.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#EFE9D2] border border-[#5E6B1E]/20 flex items-center justify-center text-[#5E6B1E] mx-auto mb-6 shadow-inner">
              <BookOpen size={32} />
            </div>
            
            <h2 className="font-title text-2xl font-bold text-[#1F2913] mb-3">
              Não há conteúdos ainda.
            </h2>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Novos e-books, guias nutricionais e materiais práticos estão sendo preparados com carinho e ciência. Fique atento(a) ou fale comigo para novidades!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openWhatsApp('Olá, Ana Luiza! Gostaria de saber quando saem novos e-books e materiais.')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#5E6B1E] hover:bg-[#4E5919] px-6 py-3 text-sm font-bold text-white shadow-md transition cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Avisar-me no WhatsApp</span>
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition"
              >
                <ArrowLeft size={16} />
                <span>Voltar ao site</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Caso 2: GRADE DE E-BOOKS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredEbooks.map((ebook, idx) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="p-7 pb-5 bg-gradient-to-br from-[#FAF8F2] to-[#EFE9D2]/40 border-b border-[#EFE9D2]/80">
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
                      onClick={() => handleAction(ebook)}
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
        )}

        {/* Garantia e Suporte */}
        <div className="mt-16 max-w-2xl mx-auto rounded-2xl bg-[#EFE9D2]/50 border border-[#5E6B1E]/15 p-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#5E6B1E]/10 flex items-center justify-center text-[#5E6B1E] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">
              Canal de Atendimento Aberto
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Dúvidas sobre os materiais ou quer um tema específico? Converse diretamente pelo WhatsApp da Ana Luiza.
            </p>
          </div>
        </div>
      </main>

      {/* 4. Rodapé */}
      <footer className="bg-stone-900 text-gray-400 text-sm py-10 border-t border-stone-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>© {new Date().getFullYear()} Ana Luiza Nutricionista (CRN 38501). Todos os direitos reservados.</p>
          <p className="text-xs text-gray-500">Atendimento 100% Online para todo o Brasil e exterior.</p>
        </div>
      </footer>

    </div>
  )
}
