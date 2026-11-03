import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  BookOpen,
  Heart,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Sparkles,
  Leaf,
  Check,
  X,
  Menu,
  ExternalLink,
} from 'lucide-react'
import fotoBanner from '../assets/images/AnaLuiza1-feathered.png'
import fotoBio from '../assets/images/AnaLuiza2.PNG'

const WHATSAPP_PHONE = '553184759120'

function InstagramIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true)
    }, 4500)
    return () => clearTimeout(timer)
  }, [])

  // Dispara diretamente o WhatsApp da nutricionista com mensagem amigável sem formulário
  function openWhatsApp(customMsg?: string) {
    const text =
      customMsg ||
      'Olá, Ana Luiza! Acessei o seu site e gostaria de conversar com você para tirar dúvidas sobre o acompanhamento online.'
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  function toggleFaq(index: number) {
    setActiveFaq((prev) => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-gray-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. NAVBAR EM VERDE ESCURO COM ALTO CONTRASTE (z-50 SEMPRE ACIMA DE QUALQUER CONTEÚDO AO ROLAR) */}
      <header className="sticky top-0 z-50 bg-[#5E6B1E] text-white shadow-md border-b border-[#4E5919]">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 sm:px-6 lg:px-10 py-4.5 sm:py-5">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#4E5919] border border-[#EEA4C2]/40 flex items-center justify-center text-white font-title font-bold text-lg shadow-inner">AL</div>
            <div className="hidden sm:block text-left border-l border-emerald-700/80 pl-3 leading-tight">
              <span className="block font-title text-base font-bold text-white tracking-wide whitespace-nowrap">Ana Luiza</span>
              <span className="block text-[11px] uppercase tracking-widest text-[#EFE9D2] font-semibold whitespace-nowrap">Nutricionista • CRN 38501</span>
            </div>
          </Link>

          {/* Links de navegação desktop (incluindo Área do Paciente no mesmo estilo) */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-emerald-100 whitespace-nowrap">
            <a href="#metodo" className="hover:text-white transition">O Método</a>
            <a href="#especialidades" className="hover:text-white transition">Áreas de Atuação</a>
            <a href="#sobre" className="hover:text-white transition">Sobre Mim</a>
            <Link to="/ebooks" className="hover:text-white transition">E-books</Link>
                        <a href="#faq" className="hover:text-white transition">Dúvidas</a>
            
          </nav>

          {/* Ações à direita: Conversar com a Nutricionista e Agendar Consulta */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de agendar uma consulta.')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8701A] hover:bg-[#D46313] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <MessageCircle size={16} className="text-white" />
              <span>Agendar no WhatsApp</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden p-2 text-emerald-100 hover:text-white transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Gaveta Mobile */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-emerald-950 border-t border-emerald-800 px-6 py-5 space-y-3 shadow-xl text-sm">
            <a
              href="#metodo"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-white py-1"
            >
              O Método
            </a>
            <a
              href="#especialidades"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-white py-1"
            >
              Áreas de Atuação
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-white py-1"
            >
              Sobre Mim
            </a>
                        <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-white py-1"
            >
              Dúvidas
            </a>
                        <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de tirar dúvidas.')
                }}
                className="w-full bg-[#5E6B1E] text-emerald-100 font-bold py-2.5 rounded-xl border border-emerald-700 text-center flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Conversar com a Nutricionista</span>
              </button>

            </div>
          </div>
        )}
      </header>

      <main>
        {/* 3. HERO BANNER COM TEXTOS ORIGINAIS E FOTO COM RESPIRO E FADE SUAVE */}
        <section className="relative min-h-[660px] lg:min-h-[720px] flex items-center bg-[#E6E6E9] border-b border-[#D8D8DC] overflow-hidden">
          {/* Foto posicionada à direita com respiro vertical (não cola no topo) e fade suave na margem esquerda */}
          <div className="absolute right-0 bottom-0 top-6 sm:top-10 lg:top-8 w-full lg:w-[48%] xl:w-[46%] pointer-events-none select-none z-0 flex items-end justify-end pr-0 lg:pr-6">
            <img
              src={fotoBanner}
              alt="Nutricionista Ana Luiza"
              className="max-h-[580px] lg:max-h-[660px] w-auto object-contain object-bottom"
            />
          </div>

          {/* Conteúdo sobreposto com recuo elegante para a direita */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 w-full">
            <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl space-y-6">

<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9D2] border border-[#5E6B1E]/20 text-[#5E6B1E] text-xs font-semibold tracking-wider uppercase mb-2">
                <Leaf size={14} className="text-[#5E6B1E]" />
                <span>Nutrição Sem Neuras • Vida Real</span>
              </div>

              {/* Título Principal Original */}
              <h1 className="font-title text-4xl sm:text-5xl lg:text-6xl text-gray-950 font-bold tracking-tight leading-[1.15]">
                Coma com paz e veja seu corpo responder com{' '}
                <span className="italic font-normal text-[#5E6B1E] underline decoration-[#EEA4C2] underline-offset-8">
                  vitalidade real.
                </span>
              </h1>

              {/* Parágrafo Original */}
              <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed">
                A alimentação deve se adaptar à sua rotina, à sua realidade e aos seus objetivos, nunca o contrário.
                Conquiste resultados consistentes com acolhimento, leveza e respaldo científico individualizado.
              </p>

              {/* Botões Originais: Agendamento no WhatsApp + Conhecer E-books */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de agendar uma consulta com você.')}
                  className="bg-[#E8701A] hover:bg-[#D46313] text-white font-title text-sm sm:text-base font-bold px-8 py-4 rounded-full shadow-lg shadow-[#E8701A]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-3 cursor-pointer"
                >
                  <MessageCircle size={20} className="text-white" />
                  <span>Agendar Consulta no WhatsApp</span>
                </button>

                <Link
                  to="/ebooks"
                  className="bg-white/95 text-gray-800 hover:text-[#5E6B1E] border border-[#5E6B1E]/30 font-title text-sm sm:text-base font-bold px-7 py-4 rounded-full transition-all text-center hover:bg-white shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen size={18} className="text-[#5E6B1E]" />
                  <span>Conhecer E-books</span>
                </Link>
              </div>

              {/* Barra de Pilares de Apoio Originais */}
              <div className="pt-6 border-t border-[#D0D0D5] grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
                <div className="flex flex-col">
                  <p className="font-title text-base sm:text-lg lg:text-xl font-bold text-gray-950 whitespace-nowrap">
                    100% Online
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-snug">
                    Todo o Brasil e exterior
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-title text-base sm:text-lg lg:text-xl font-bold text-gray-950 whitespace-nowrap">
                    100% Individual
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-snug">
                    Respeito à sua rotina
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-title text-base sm:text-lg lg:text-xl font-bold text-gray-950 whitespace-nowrap">
                    Portal Digital
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-snug">
                    Plano no aplicativo
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. QUEM SOU EU / SOBRE MIM (#sobre) */}
        <section id="sobre" className="py-20 bg-white border-b border-gray-200 overflow-hidden relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Foto Fixa da Seção Quem Sou Eu (col 1 a 5) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Moldura decorativa verde oliva deslocada */}
                  <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#5E6B1E]/40 rounded-3xl -z-10" />
                  
                  {/* Card da Foto */}
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#EFE9D2]">
                    <img
                      src={fotoBio}
                      alt="Ana Luiza no consultório"
                      className="w-full h-[470px] sm:h-[510px] object-cover object-top"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Citação flutuante da Ana Luiza */}
                  <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-5 rounded-2xl shadow-xl border border-[#EFE9D2] max-w-xs">
                    <p className="font-title font-bold text-gray-900 text-xs sm:text-sm italic">
                      "Alimentação boa é aquela que cabe na sua rotina, no seu bolso e no seu coração."
                    </p>
                    <p className="text-[11px] text-[#5E6B1E] font-bold mt-2">— Ana Luiza • CRN-9 38501</p>
                  </div>
                </div>
              </div>

              {/* Bio Content real da Ana Luiza (col 6 a 12) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9D2] text-[#5E6B1E] text-xs font-semibold tracking-wider uppercase">
                  <span>Nutrição Clínica & Terapia Nutricional</span>
                </div>

                <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950">
                  Oi, eu sou a Ana Luiza!
                </h2>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                  Se você chegou até aqui, provavelmente já ouviu muito <span className="text-[#E8701A] font-semibold">"corta isso"</span>, <span className="text-[#E8701A] font-semibold">"proibido aquilo"</span> e <span className="text-[#E8701A] font-semibold">"só volta a comer quando emagrecer"</span>.
                </p>

                <p className="text-gray-900 text-lg font-title font-bold italic text-[#5E6B1E]">
                  Eu acredito exatamente no contrário.
                </p>

                <p className="text-gray-700 text-base leading-relaxed">
                  Dieta não precisa ser sofrimento, e comida não é sua inimiga. Sou nutricionista, pós-graduada em <strong>Nutrição Clínica: Metabolismo, Prática e Terapia Nutricional</strong>. Meu propósito é mostrar que dá para cuidar da saúde com ciência, sem terrorismo nutricional e sem abrir mão do prazer de comer.
                </p>

                <div className="pt-2">
                  <p className="text-sm font-title font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Meu olhar vai muito além da balança. Quero ajudar você a:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 text-sm text-gray-800 bg-[#FAF8F2] p-3 rounded-xl border border-[#EFE9D2]">
                      <CheckCircle2 size={17} className="text-[#5E6B1E] shrink-0 mt-0.5" />
                      <span>Emagrecer de forma sustentável, sem efeito sanfona</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-gray-800 bg-[#FAF8F2] p-3 rounded-xl border border-[#EFE9D2]">
                      <CheckCircle2 size={17} className="text-[#5E6B1E] shrink-0 mt-0.5" />
                      <span>Controlar exames alterados, como glicemia e pressão</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-gray-800 bg-[#FAF8F2] p-3 rounded-xl border border-[#EFE9D2]">
                      <CheckCircle2 size={17} className="text-[#5E6B1E] shrink-0 mt-0.5" />
                      <span>Melhorar intolerâncias e o conforto intestinal</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-gray-800 bg-[#FAF8F2] p-3 rounded-xl border border-[#EFE9D2]">
                      <CheckCircle2 size={17} className="text-[#5E6B1E] shrink-0 mt-0.5" />
                      <span>Ter uma alimentação possível na rotina real</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => openWhatsApp('Olá, Ana Luiza! Li sua apresentação no site e me identifiquei muito. Gostaria de saber mais sobre a consulta.')}
                    className="inline-flex items-center gap-2 bg-[#5E6B1E] hover:bg-[#4E5919] text-white font-title text-sm font-bold px-6 py-3.5 rounded-full shadow-md transition cursor-pointer"
                  >
                    <MessageCircle size={17} />
                    <span>Conversar com a Nutricionista</span>
                  </button>

                  <a
                    href="https://www.instagram.com/aluizanutri/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#5E6B1E] transition"
                  >
                    <InstagramIcon size={17} />
                    <span>@aluizanutri</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SELOS / PILARES DE CONFIANÇA */}
        <section className="py-6 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-gray-600 font-semibold text-xs sm:text-sm">
              <div className="flex items-center gap-2 hover:text-[#5E6B1E] transition">
                <CheckCircle2 size={18} className="text-[#5E6B1E]" />
                <span>Atendimento 100% Online para todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2 hover:text-[#5E6B1E] transition">
                <CheckCircle2 size={18} className="text-[#5E6B1E]" />
                <span>Consultas por Videoconferência com Máxima Atenção</span>
              </div>
              <div className="flex items-center gap-2 hover:text-[#5E6B1E] transition">
                <CheckCircle2 size={18} className="text-[#5E6B1E]" />
                <span>Nutrição Sem Terrorismo Alimentar</span>
              </div>
              <div className="flex items-center gap-2 hover:text-[#5E6B1E] transition">
                <CheckCircle2 size={18} className="text-[#5E6B1E]" />
                <span>Plano Integrado no Portal do Paciente</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. COMO POSSO TE AJUDAR? (Página 6 do material autoral da Ana Luiza) */}
        <section id="como-ajudar" className="py-24 bg-[#FAF8F2] border-b border-[#EFE9D2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-14 border border-[#EFE9D2] shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9D2] text-[#5E6B1E] text-xs font-semibold tracking-wider uppercase mb-3">
                  <Leaf size={14} className="text-[#5E6B1E]" />
                  <span>Como Posso Te Ajudar?</span>
                </div>
                <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
                  Sua rotina também entra no plano!
                </h2>
                <p className="text-gray-700 text-base sm:text-lg mt-3 font-medium">
                  Meu objetivo é ajudar você a construir uma alimentação que faça sentido para sua vida, com:
                </p>
              </div>

              {/* Grid dos 4 itens práticos da página 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-[#FAF8F2] border border-[#EFE9D2] hover:border-[#5E6B1E]/30 transition">
                  <div className="w-8 h-8 rounded-full bg-[#5E6B1E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-gray-900 text-base mb-1">
                      Plano Alimentar Individualizado
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Construído sob medida e quando indicado, respeitando seu organismo e necessidades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-[#FAF8F2] border border-[#EFE9D2] hover:border-[#5E6B1E]/30 transition">
                  <div className="w-8 h-8 rounded-full bg-[#5E6B1E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-gray-900 text-base mb-1">
                      Estratégias Práticas para sua Rotina
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Soluções viáveis para quem tem dia a dia corrido, trabalha fora ou cozinha pouco.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-[#FAF8F2] border border-[#EFE9D2] hover:border-[#5E6B1E]/30 transition">
                  <div className="w-8 h-8 rounded-full bg-[#5E6B1E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-gray-900 text-base mb-1">
                      Substituições & Orientações Adaptadas
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Adaptadas às suas preferências, sem proibições radicais ou alimentos que você não gosta.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-5 rounded-2xl bg-[#FAF8F2] border border-[#EFE9D2] hover:border-[#5E6B1E]/30 transition">
                  <div className="w-8 h-8 rounded-full bg-[#5E6B1E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-gray-900 text-base mb-1">
                      Acompanhamento & Ajustes Constantes
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Suporte de perto e ajustes conforme o serviço contratado, para você nunca se sentir só.
                    </p>
                  </div>
                </div>
              </div>

              {/* Frase de Fechamento de Alto Impacto da Página 6 */}
              <div className="text-center pt-6 border-t border-[#EFE9D2]">
                <p className="font-title font-bold text-lg sm:text-xl text-[#5E6B1E] mb-6">
                  "Nada de fórmula pronta para uma vida que não é a sua."
                </p>
                <button
                  onClick={() => openWhatsApp('Olá, Ana Luiza! Li a seção de como você pode me ajudar e gostaria de agendar uma consulta.')}
                  className="bg-[#E8701A] hover:bg-[#D46313] text-white font-title text-sm sm:text-base font-bold px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle size={18} />
                  <span>Quero um plano feito para a minha rotina</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 6. MEU OLHAR CLÍNICO (Inspirado no material autoral da Ana Luiza) */}
        <section id="metodo" className="py-24 bg-white border-b border-[#EFE9D2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9D2] text-[#5E6B1E] text-xs font-semibold tracking-wider uppercase mb-3">
                <Sparkles size={14} className="text-[#5E6B1E]" />
                <span>Meu Olhar Clínico</span>
              </div>
              <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950">
                Nutrição é muito mais do que emagrecimento!
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-3 leading-relaxed">
                Meu olhar vai além da balança: considero sua saúde, seu metabolismo, seus exames e as necessidades reais de cada fase da sua vida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pilar 1 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#48679D] group-hover:text-[#5E6B1E] transition">
                    01
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Saúde & Prevenção
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Promover saúde integral e contribuir de forma ativa para a prevenção de complicações, protegendo seu bem-estar no longo prazo.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EFE9D2] text-xs font-semibold text-[#48679D]">
                  Cuidado Preventivo Baseado em Ciência
                </div>
              </div>

              {/* Pilar 2 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#E8701A] group-hover:text-[#5E6B1E] transition">
                    02
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Metabolismo & Condições Clínicas
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cuidado nutricional clínico altamente individualizado para controle de glicemia, pressão, alterações lipídicas e queixas digestivas.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EFE9D2] text-xs font-semibold text-[#E8701A]">
                  Pós-Graduação em Nutrição Clínica
                </div>
              </div>

              {/* Pilar 3 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#5E6B1E] transition">
                    03
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Hábitos & Relação com a Comida
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Conquiste autonomia, equilíbrio duradouro e uma alimentação que seja realmente viável, saborosa e possível na sua vida real.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EFE9D2] text-xs font-semibold text-[#5E6B1E]">
                  Sem Terrorismo Nutricional
                </div>
              </div>
            </div>

            {/* Citação de Fechamento do Bloco */}
            <div className="mt-12 text-center">
              <p className="font-title italic text-base sm:text-lg text-gray-800">
                "Ciência para orientar e individualidade para cuidar."
              </p>
            </div>
          </div>
        </section>

        {/* 7. ÁREAS DE ATUAÇÃO (#especialidades) */}
        <section id="especialidades" className="py-20 bg-[#FAF8F2] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[#5E6B1E] font-semibold uppercase tracking-wider text-xs sm:text-sm">
                Áreas de Atuação
              </span>
              <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950 mt-2">
                Como Posso Ajudar Você Hoje?
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-3">
                Acompanhamento individualizado focado nas suas metas de saúde, bem-estar e composição corporal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
                  <Flame size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Emagrecimento Sustentável</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Perca gordura corporal sem fome excessiva, sem cortar grupos alimentares e restaurando a sua saciedade natural.
                </p>
                <span className="text-xs font-semibold text-[#5E6B1E] tracking-wide uppercase">
                  Foco: Reeducação & Leveza
                </span>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#5E6B1E] flex items-center justify-center mb-5">
                  <Heart size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Reeducação Alimentar</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Aprenda a se alimentar com prazer e autonomia, desenvolvendo escolhas conscientes e duradouras para toda a vida.
                </p>
                <span className="text-xs font-semibold text-[#5E6B1E] tracking-wide uppercase">
                  Foco: Longevidade & Equilíbrio
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#5E6B1E] flex items-center justify-center mb-5">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Saúde Metabólica</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Estratégias para otimizar o funcionamento do seu metabolismo, disposição diária e longevidade de forma equilibrada.
                </p>
                <span className="text-xs font-semibold text-[#5E6B1E] tracking-wide uppercase">
                  Foco: Vitalidade & Equilíbrio Metabólico
                </span>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-5">
                  <Heart size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Saúde da Mulher</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Acompanhamento nutricional focado no equilíbrio hormonal e bem-estar feminino em todas as fases da vida.
                </p>
                <span className="text-xs font-semibold text-rose-700 tracking-wide uppercase">
                  Foco: Equilíbrio Hormonal & Bem-Estar
                </span>
              </div>

              {/* Card 5 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-5">
                  <Leaf size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Vegetarianismo e Plant-Based</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Transição e manutenção com planejamento equilibrado para garantir variedade e aporte nutricional adequado.
                </p>
                <span className="text-xs font-semibold text-[#5E6B1E] tracking-wide uppercase">
                  Foco: Segurança & Equilíbrio
                </span>
              </div>

              {/* Card 6 */}
              <div className="bg-white rounded-3xl p-7 shadow-xs border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-5">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-title text-xl font-bold text-gray-950 mb-2">Relação Consciente com a Mesa</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Comer consciente para superar o ciclo de culpa e ansiedade, reaprendendo a escutar os sinais de fome e saciedade do corpo.
                </p>
                <span className="text-xs font-semibold text-[#5E6B1E] tracking-wide uppercase">
                  Foco: Paz com a Comida
                </span>
              </div>
            </div>
          </div>
        </section>


        

        {/* 10. PERGUNTAS FREQUENTES (#faq) */}
        <section id="faq" className="py-20 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#5E6B1E] font-semibold uppercase tracking-wider text-xs sm:text-sm">
                Tire Suas Dúvidas
              </span>
              <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950 mt-2">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3">
                Respostas diretas sobre como funciona o acompanhamento nutricional.
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#FAF8F2]/70">
                <button
                  onClick={() => toggleFaq(1)}
                  className="w-full text-left p-6 font-title font-bold text-gray-950 text-base sm:text-lg flex justify-between items-center focus:outline-none"
                >
                  <span>Como funciona a consulta online? É fácil de participar?</span>
                  <span className="text-[#5E6B1E] text-xl font-sans">{activeFaq === 1 ? '−' : '+'}</span>
                </button>
                {activeFaq === 1 && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200/60 pt-4">
                    Sim! A consulta online é realizada por videoconferência com duração média de 1h a 1h30. Investigamos detalhadamente seus hábitos, histórico de saúde, rotina e preferências. É um atendimento acolhedor, minucioso e individualizado, no conforto da sua casa.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#FAF8F2]/70">
                <button
                  onClick={() => toggleFaq(2)}
                  className="w-full text-left p-6 font-title font-bold text-gray-950 text-base sm:text-lg flex justify-between items-center focus:outline-none"
                >
                  <span>De onde posso ser atendido(a)? Preciso de algum aplicativo complexo?</span>
                  <span className="text-[#5E6B1E] text-xl font-sans">{activeFaq === 2 ? '−' : '+'}</span>
                </button>
                {activeFaq === 2 && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200/60 pt-4">
                    Você pode ser atendido(a) de qualquer cidade do Brasil ou do exterior! A consulta é realizada de forma prática através de videoconferência, sem necessidade de instalar programas complicados. Você só precisa de um celular ou computador com conexão à internet.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#FAF8F2]/70">
                <button
                  onClick={() => toggleFaq(3)}
                  className="w-full text-left p-6 font-title font-bold text-gray-950 text-base sm:text-lg flex justify-between items-center focus:outline-none"
                >
                  <span>Vou precisar cortar doces, pão ou coisas que gosto de comer?</span>
                  <span className="text-[#5E6B1E] text-xl font-sans">{activeFaq === 3 ? '−' : '+'}</span>
                </button>
                {activeFaq === 3 && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200/60 pt-4">
                    Não! A nutrição defendida pela Ana Luiza é sem neuras e sem terrorismo alimentar. Aprendemos a equilibrar as refeições e encaixar seus pratos favoritos na sua rotina com inteligência e moderação, sem culpa.
                  </div>
                )}
              </div>

              {/* FAQ 4 */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#FAF8F2]/70">
                <button
                  onClick={() => toggleFaq(4)}
                  className="w-full text-left p-6 font-title font-bold text-gray-950 text-base sm:text-lg flex justify-between items-center focus:outline-none"
                >
                  <span>Como recebo e consulto meu plano alimentar?</span>
                  <span className="text-[#5E6B1E] text-xl font-sans">{activeFaq === 4 ? '−' : '+'}</span>
                </button>
                {activeFaq === 4 && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200/60 pt-4">
                    O plano é elaborado de forma 100% individualizada após a consulta e disponibilizado diretamente no portal do paciente no acompanhamento. Você pode acessar a qualquer momento pelo celular ou computador, com todas as orientações organizadas.
                  </div>
                )}
              </div>

              {/* FAQ 5 */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#FAF8F2]/70">
                <button
                  onClick={() => toggleFaq(5)}
                  className="w-full text-left p-6 font-title font-bold text-gray-950 text-base sm:text-lg flex justify-between items-center focus:outline-none"
                >
                  <span>E se eu tiver dúvidas entre uma consulta e outra?</span>
                  <span className="text-[#5E6B1E] text-xl font-sans">{activeFaq === 5 ? '−' : '+'}</span>
                </button>
                {activeFaq === 5 && (
                  <div className="px-6 pb-6 text-gray-700 text-sm leading-relaxed border-t border-gray-200/60 pt-4">
                    Você não fica desamparado(a). Temos o canal direto via WhatsApp para esclarecer dúvidas sobre substituições, compras no supermercado ou situações do dia a dia ao longo do seu período de acompanhamento.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 11. CTA FINAL: BORA FAZER DIFERENTE DESSA VEZ? (Página 8 do Carrossel) */}
        <section className="py-24 bg-[#5E6B1E] text-white relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#EFE9D2] border border-white/20 text-xs font-title font-semibold uppercase tracking-wider mb-4">
              Comece Hoje
            </span>
            <h2 className="font-title text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              Bora fazer diferente dessa vez?
            </h2>
            <p className="text-[#EFE9D2] text-base sm:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              Você não precisa esperar a segunda-feira, o mês que vem ou a motivação perfeita. Que tal começar com um plano que considere você por inteiro?
            </p>

            <div className="flex items-center justify-center">
              <button
                onClick={() => openWhatsApp('Olá, Ana Luiza! Quero fazer diferente dessa vez e agendar uma consulta com você.')}
                className="bg-[#E8701A] hover:bg-[#D46313] text-white text-base sm:text-lg font-bold px-10 py-4.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <MessageCircle size={22} className="text-white" />
                <span>Chamar no WhatsApp & Agendar</span>
              </button>
            </div>

            <p className="text-xs text-[#EFE9D2]/80 mt-6">
              Com carinho, sua nutri • Atendimento 100% online para todo o Brasil e exterior.
            </p>
          </div>
        </section>
      </main>

      {/* 12. FOOTER PROFISSIONAL */}
      <footer className="bg-stone-900 text-gray-400 text-sm py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5E6B1E] flex items-center justify-center text-white font-title font-bold text-sm">AL</div>
                <span className="font-title text-lg font-bold text-white">Ana Luiza</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Nutrição clínica sem terrorismo alimentar, com foco em equilíbrio, leveza e sustentabilidade.
              </p>
              <p className="text-xs text-emerald-400 font-mono font-medium">CRN 38501</p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Atendimento</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Atendimento 100% Online<br />
                Para todo o Brasil e exterior
              </p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">Segunda a Sexta com horários flexíveis</p>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Materiais Digitais</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/ebooks" className="hover:text-white transition">
                    E-books & Guias Práticos
                  </Link>
                </li>
                <li>
                  <a href="#metodo" className="hover:text-white transition">
                    Metodologia de Atendimento
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Redes & Contato</h4>
              <p className="text-xs text-gray-400 mb-2">Acompanhe dicas e conteúdos diários:</p>
              <a
                href="https://www.instagram.com/aluizanutri/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                <InstagramIcon size={16} />
                <span>@aluizanutri</span>
              </a>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Ana Luiza Nutricionista (CRN 38501). Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                Atendimento 100% Online
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 13. BOTÃO FLUTUANTE DO WHATSAPP + TOAST */}
      <aside className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {showToast && (
          <div className="bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200 mb-1 max-w-[220px] flex items-center justify-between gap-2">
            <span>Dúvidas sobre horários? Fale no WhatsApp!</span>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-700 p-0.5"
              aria-label="Fechar aviso"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <button
          onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de conversar com você.')}
          className="w-14 h-14 bg-[#5E6B1E] hover:bg-[#5E6B1E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Conversar no WhatsApp"
        >
          <MessageCircle size={28} />
        </button>
      </aside>

    </div>
  )
}
