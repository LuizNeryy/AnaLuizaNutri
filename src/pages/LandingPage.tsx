import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  BookOpen,
  MapPin,
  ArrowRight,
  UtensilsCrossed,
  Compass,
  Shuffle,
  MessagesSquare,
  Sparkles,
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('sobre')

  useEffect(() => {
    const sections = ['sobre', 'como-ajudar', 'metodo', 'planos', 'faq']

    let ticking = false
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 25)

          // Encontrar a seção cujo topo está mais próximo do terço superior da janela
          const midPoint = window.scrollY + window.innerHeight * 0.35
          let currentSection = sections[0]

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId)
            if (el) {
              const top = el.offsetTop
              if (midPoint >= top - 80) {
                currentSection = sectionId
              }
            }
          }
          setActiveSection(currentSection)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



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
{/* 1. HEADER GLASSMORPHISM EDITORIAL PREMIUM */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F2]/90 backdrop-blur-md shadow-xs border-b border-[#EFE9D2] py-3 sm:py-3.5'
            : 'bg-[#FAF8F2]/75 backdrop-blur-sm border-b border-[#EFE9D2]/60 py-4 sm:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo Brand Tipográfica Autoral */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-full bg-[#EFE9D2] border border-[#5E6B1E]/25 flex items-center justify-center text-[#5E6B1E] font-title font-bold text-sm shadow-xs transition group-hover:scale-105 group-hover:border-[#5E6B1E]">
              AL
            </div>
            <div className="text-left leading-tight">
              <span className="block font-title text-base sm:text-lg font-bold text-gray-950 tracking-tight group-hover:text-[#EEA4C2] transition">
                Ana Luiza Ribeiro
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#48679D] font-bold">
                Nutrição Clínica • CRN-9 38501
              </span>
            </div>
          </Link>

          {/* Links de navegação desktop com animação Jelly/Chiclete via Framer Motion */}
          <nav className="hidden lg:flex items-center relative text-sm font-semibold">
            {[
              { id: 'sobre', label: 'Sobre Mim', href: '#sobre' },
              { id: 'como-ajudar', label: 'Como Te Ajudar', href: '#como-ajudar' },
              { id: 'metodo', label: 'O Método', href: '#metodo' },
              { id: 'planos', label: 'Planos', href: '#planos' },
              { id: 'faq', label: 'Dúvidas', href: '#faq' },
            ].map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative px-4 py-1.5 rounded-full transition-colors duration-300 select-none ${
                    isActive ? 'text-white' : 'text-gray-700 hover:text-[#EEA4C2]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navBubbleActive"
                      className="absolute inset-0 rounded-full bg-[#48679D] shadow-md shadow-[#48679D]/30"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 24,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              )
            })}

            <Link
              to="/ebooks"
              className="relative px-4 py-1.5 rounded-full text-gray-700 hover:text-[#EEA4C2] transition-colors duration-200"
            >
              <span className="relative z-10">E-books</span>
            </Link>
          </nav>

          {/* Ação à direita: Botão pílula elegante */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de agendar uma consulta com você.')}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8701A] hover:bg-[#D46313] px-5 py-2.5 text-xs sm:text-sm font-title font-bold text-white shadow-xs transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>Agendar Consulta</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-gray-800 hover:text-[#5E6B1E] transition rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Gaveta Mobile Translúcida */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F2]/95 backdrop-blur-lg border-t border-[#EFE9D2] px-6 py-5 space-y-3.5 shadow-lg text-sm font-semibold text-gray-800">
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#5E6B1E] py-1 border-b border-gray-200/60"
            >
              Sobre Mim
            </a>
            <a
              href="#filosofia"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#5E6B1E] py-1 border-b border-gray-200/60"
            >
              O Método
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#5E6B1E] py-1 border-b border-gray-200/60"
            >
              Planos
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#5E6B1E] py-1 border-b border-gray-200/60"
            >
              Dúvidas
            </a>
            <Link
              to="/ebooks"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-[#5E6B1E] py-1"
            >
              E-books
            </Link>
          </div>
        )}
      </header>

            <main>
        {/* 3. HERO SECTION (Responsivo: Vertical no Mobile na ordem exata solicitada / Lado a lado no Desktop) */}
        <section className="relative bg-[#E6E6E9] border-b border-[#D8D8DC] overflow-hidden">
          
          {/* FOTO NO DESKTOP: posicionada à direita com respiro e fade suave (apenas telas lg pra cima) */}
          <div className="hidden lg:flex absolute right-0 bottom-0 top-8 w-[48%] xl:w-[46%] pointer-events-none select-none z-0 items-end justify-end pr-6">
            <img
              src={fotoBanner}
              alt="Nutricionista Ana Luiza"
              className="max-h-[660px] w-auto object-contain object-bottom"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 relative z-10 w-full">
            <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl flex flex-col space-y-4 lg:space-y-6">



              {/* 2. Título Principal */}
              <h1 className="font-title text-3xl sm:text-5xl lg:text-6xl text-gray-950 font-bold tracking-tight leading-[1.18] text-center lg:text-left">
                Coma com paz e veja seu corpo responder com{' '}
                <span className="italic font-normal text-[#5E6B1E] underline decoration-[#EEA4C2] underline-offset-8">
                  vitalidade real.
                </span>
              </h1>

              {/* 3. Parágrafo Descritivo */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-normal leading-relaxed text-center lg:text-left">
                A alimentação deve se adaptar à sua rotina, à sua realidade e aos seus objetivos, nunca o contrário.
                Conquiste resultados consistentes com acolhimento, leveza e respaldo científico individualizado.
              </p>

              {/* 4. FOTO NO MOBILE (Aproximada do texto, sem espaço vazio) */}
              <div className="lg:hidden w-full flex justify-center pt-1 pb-0 -mb-8 sm:-mb-10 relative z-10">
                <div className="relative max-w-sm sm:max-w-md w-full flex justify-center">
                  <img
                    src={fotoBanner}
                    alt="Nutricionista Ana Luiza"
                    className="max-h-[420px] sm:max-h-[480px] w-auto object-contain block"
                  />
                </div>
              </div>

              {/* 5. Botões de Ação (Sobrepõem propositalmente o final da foto no mobile, tampando o corte seco!) */}
              <div className="pt-0 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 relative z-20 w-full">
                <button
                  onClick={() => openWhatsApp('Olá, Ana Luiza! Acessei o seu site e gostaria de agendar uma consulta com você.')}
                  className="w-full sm:w-auto bg-[#E8701A] hover:bg-[#D46313] text-white font-title text-sm sm:text-base font-bold px-7 py-3.5 rounded-full shadow-md shadow-[#E8701A]/20 transition-all hover:scale-[1.01] active:scale-[0.98] text-center flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle size={18} className="text-white" />
                  <span>Agendar Consulta no WhatsApp</span>
                </button>

                <Link
                  to="/ebooks"
                  className="w-full sm:w-auto bg-white text-gray-800 hover:text-[#5E6B1E] border border-gray-300 font-title text-sm sm:text-base font-bold px-6 py-3.5 rounded-full transition-all text-center hover:bg-gray-50 shadow-2xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <BookOpen size={17} className="text-[#5E6B1E]" />
                  <span>Conhecer E-books</span>
                </Link>
              </div>

              {/* 6. Barra de Pilares de Apoio (Abaixo dos botões) */}
              <div className="pt-6 border-t border-[#D0D0D5] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0 w-full text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-title text-base sm:text-lg lg:text-xl font-bold text-gray-950">
                    100% Online
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5 leading-snug">
                    Todo o Brasil e exterior
                  </p>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-title text-base sm:text-lg lg:text-xl font-bold text-gray-950">
                    100% Individual
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5 leading-snug">
                    Respeito à sua rotina
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
                  <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#48679D]/30 rounded-3xl -z-10" />
                  
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
                  Dieta não precisa ser sofrimento, e comida não é sua inimiga. Sou nutricionista, pós-graduada em <strong className="text-[#48679D] font-bold">Nutrição Clínica: Metabolismo, Prática e Terapia Nutricional</strong>. Meu propósito é mostrar que dá para cuidar da saúde com ciência, sem terrorismo nutricional e sem abrir mão do prazer de comer.
                </p>

                <div className="pt-3">
                  <p className="text-xs font-title font-bold text-[#5E6B1E] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EEA4C2]" />
                    Quero ajudar você a:
                  </p>
                  
                  <div className="space-y-2">
                    {[
                      "Emagrecer de forma sustentável, sem efeito sanfona",
                      "Controlar exames alterados, como glicemia e pressão",
                      "Melhorar intolerâncias e o conforto intestinal",
                      "Ter uma alimentação possível na rotina real",
                    ].map((text, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 py-1.5 border-b border-[#EFE9D2]/70 last:border-0"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#EEA4C2]/30 text-[#48679D] flex items-center justify-center shrink-0">
                          <ArrowRight size={12} strokeWidth={2.5} />
                        </span>
                        <p className="text-sm sm:text-[15px] text-gray-800 font-medium leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
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

{/* 4. COMO POSSO TE AJUDAR? (Layout Editorial Aberto de Página Inteira) */}
        <section id="como-ajudar" className="py-20 sm:py-28 bg-[#FAF8F2] border-b border-[#EFE9D2] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Cabeçalho Aberto e Imersivo */}
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight">
                Sua rotina também entra no plano!
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
                Meu objetivo é ajudar você a construir uma alimentação que faça sentido para sua vida, com:
              </p>
            </div>

            {/* Grid dos 4 Pilares - Layout Aberto de Galeria Editorial (Sem cardzão prendendo tudo!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              
              {/* Pilar 1: Plano Alimentar Individualizado */}
              <div className="bg-white rounded-3xl p-7 border border-[#EFE9D2] shadow-xs hover:shadow-xl hover:border-[#5E6B1E]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#5E6B1E]/10 text-[#5E6B1E] flex items-center justify-center transition-colors group-hover:bg-[#5E6B1E] group-hover:text-white">
                      <UtensilsCrossed size={22} />
                    </div>
                  </div>
                  <h3 className="font-title font-bold text-gray-950 text-lg mb-2 group-hover:text-[#5E6B1E] transition-colors">
                    Plano Alimentar Individualizado
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Construído sob medida e quando indicado, respeitando seu organismo e necessidades.
                  </p>
                </div>
              </div>

              {/* Pilar 2: Estratégias Práticas para sua Rotina */}
              <div className="bg-white rounded-3xl p-7 border border-[#EFE9D2] shadow-xs hover:shadow-xl hover:border-[#48679D]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#48679D]/10 text-[#48679D] flex items-center justify-center transition-colors group-hover:bg-[#48679D] group-hover:text-white">
                      <Compass size={22} />
                    </div>
                  </div>
                  <h3 className="font-title font-bold text-gray-950 text-lg mb-2 group-hover:text-[#48679D] transition-colors">
                    Estratégias Práticas para sua Rotina
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Soluções viáveis para quem tem dia a dia corrido, trabalha fora ou cozinha pouco.
                  </p>
                </div>
              </div>

              {/* Pilar 3: Substituições & Orientações Adaptadas */}
              <div className="bg-white rounded-3xl p-7 border border-[#EFE9D2] shadow-xs hover:shadow-xl hover:border-[#E8701A]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8701A]/10 text-[#E8701A] flex items-center justify-center transition-colors group-hover:bg-[#E8701A] group-hover:text-white">
                      <Shuffle size={22} />
                    </div>
                  </div>
                  <h3 className="font-title font-bold text-gray-950 text-lg mb-2 group-hover:text-[#E8701A] transition-colors">
                    Substituições & Orientações Adaptadas
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Adaptadas às suas preferências, sem proibições radicais ou alimentos que você não gosta.
                  </p>
                </div>
              </div>

              {/* Pilar 4: Acompanhamento & Ajustes Constantes */}
              <div className="bg-white rounded-3xl p-7 border border-[#EFE9D2] shadow-xs hover:shadow-xl hover:border-[#EEA4C2]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEA4C2]/20 text-[#D86B94] flex items-center justify-center transition-colors group-hover:bg-[#EEA4C2] group-hover:text-white">
                      <MessagesSquare size={22} />
                    </div>
                  </div>
                  <h3 className="font-title font-bold text-gray-950 text-lg mb-2 group-hover:text-[#D86B94] transition-colors">
                    Acompanhamento & Ajustes Constantes
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Suporte de perto e ajustes conforme o serviço contratado, para você nunca se sentir só.
                  </p>
                </div>
              </div>

            </div>

            {/* Fechamento com Frase de Impacto da Ana Luiza e Botão de Ação */}
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <p className="font-title font-bold text-xl sm:text-2xl text-[#5E6B1E] italic">
                "Nada de fórmula pronta para uma vida que não é a sua."
              </p>
              

            </div>

          </div>
        </section>

                {/* 6. MEU OLHAR CLÍNICO (Inspirado no material autoral da Ana Luiza) */}
        <section id="metodo" className="py-20 sm:py-24 bg-white border-b border-[#EFE9D2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">

              <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950">
                Nutrição é muito mais do que emagrecimento!
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mt-3 leading-relaxed">
                Meu olhar vai além da balança: considero sua saúde, seu metabolismo, seus exames e as necessidades reais de cada fase da sua vida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pilar 1 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#48679D]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#48679D] group-hover:scale-105 inline-block transition">
                    01
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Saúde & Prevenção
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Promover saúde integral e contribuir de forma ativa para a prevenção de complicações, protegendo seu bem-estar no longo prazo.
                  </p>
                </div>

              </div>

              {/* Pilar 2 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#E8701A]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#E8701A] group-hover:scale-105 inline-block transition">
                    02
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Metabolismo & Condições Clínicas
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cuidado nutricional clínico altamente individualizado para controle de glicemia, pressão, alterações lipídicas e queixas digestivas.
                  </p>
                </div>

              </div>

              {/* Pilar 3 */}
              <div className="bg-[#FAF8F2] p-8 sm:p-9 rounded-3xl border border-[#EFE9D2] hover:border-[#5E6B1E]/40 transition-all hover:shadow-lg flex flex-col justify-between group">
                <div>
                  <span className="text-3xl font-title font-bold text-[#5E6B1E] group-hover:scale-105 inline-block transition">
                    03
                  </span>
                  <h3 className="font-title text-xl font-bold text-gray-950 mt-4 mb-3">
                    Hábitos & Relação com a Comida
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Conquiste autonomia, equilíbrio duradouro e uma alimentação que seja realmente viável, saborosa e possível na sua vida real.
                  </p>
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

        {/* 7. PLANOS DE ACOMPANHAMENTO (#planos) */}
        <section id="planos" className="py-20 sm:py-24 bg-[#FAF8F2] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">

              <h2 className="font-title text-3xl sm:text-4xl font-bold text-gray-950">
                Planos de Acompanhamento
              </h2>
              <p className="text-gray-700 text-base sm:text-lg mt-3 font-normal max-w-2xl mx-auto">
                Opções pensadas para se encaixar com perfeição no seu momento de vida, na sua rotina e nas suas metas de saúde.
              </p>
            </div>

            {/* Grid 2x2 dos 4 Planos com Cores Oficiais e Estilo do Material */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              
              {/* Card 1: Consulta Avulsa (#EEA4C2 - Rose Blush) */}
              <div className="rounded-[32px] p-8 sm:p-9 bg-[#EEA4C2] text-gray-950 flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/80 text-gray-900 text-xs font-title font-bold uppercase tracking-wider mb-4">
                    Individual
                  </div>
                  <h3 className="font-title text-2xl sm:text-3xl font-bold text-gray-950 mb-3">
                    Consulta Avulsa
                  </h3>
                  <p className="text-gray-900/90 text-base sm:text-lg leading-relaxed font-medium">
                    Para quem deseja entender melhor sua alimentação e receber orientações personalizadas para sua rotina.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 flex justify-end">
                  <button
                    onClick={() => openWhatsApp('Olá, Ana Luiza! Tenho interesse na Consulta Avulsa e gostaria de saber mais informações.')}
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-950 font-title font-bold text-sm px-7 py-3 rounded-full shadow-sm transition active:scale-95 cursor-pointer text-center"
                  >
                    Quero esta opção
                  </button>
                </div>
              </div>

              {/* Card 2: Combo - Consulta + Retorno (#E8701A - Terracota) */}
              <div className="rounded-[32px] p-8 sm:p-9 bg-[#E8701A] text-white flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-title font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
                    Combo Especial
                  </div>
                  <h3 className="font-title text-2xl sm:text-3xl font-bold text-white mb-3">
                    Consulta + Retorno
                  </h3>
                  <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium">
                    Para quem deseja começar a cuidar da alimentação e ter uma nova oportunidade para avaliar a adaptação às orientações.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex justify-end">
                  <button
                    onClick={() => openWhatsApp('Olá, Ana Luiza! Tenho interesse no Combo Consulta + Retorno e gostaria de agendar.')}
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#E8701A] font-title font-bold text-sm px-7 py-3 rounded-full shadow-sm transition active:scale-95 cursor-pointer text-center"
                  >
                    Quero esta opção
                  </button>
                </div>
              </div>

              {/* Card 3: Plano Premium (#C4B818 - Dourado Oliva) */}
              <div className="rounded-[32px] p-8 sm:p-9 bg-[#C4B818] text-gray-950 flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/80 text-gray-900 text-xs font-title font-bold uppercase tracking-wider mb-4">
                    Mais Completo
                  </div>
                  <h3 className="font-title text-2xl sm:text-3xl font-bold text-gray-950 mb-3">
                    Plano Premium
                  </h3>
                  <p className="text-gray-950/90 text-base sm:text-lg leading-relaxed font-medium">
                    Para quem busca um período maior de acompanhamento nutricional e suporte durante a aplicação das orientações.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 flex justify-end">
                  <button
                    onClick={() => openWhatsApp('Olá, Ana Luiza! Quero saber detalhes e valores do Plano Premium de acompanhamento.')}
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-950 font-title font-bold text-sm px-7 py-3 rounded-full shadow-sm transition active:scale-95 cursor-pointer text-center"
                  >
                    Quero esta opção
                  </button>
                </div>
              </div>

              {/* Card 4: Projeto Social (#48679D - Azul Ardósia) */}
              <div className="rounded-[32px] p-8 sm:p-9 bg-[#48679D] text-white flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8701A] text-white text-xs font-title font-bold uppercase tracking-wider mb-4 shadow-xs">
                    <Sparkles size={12} />
                    <span>Vagas Limitadas</span>
                  </div>
                  <h3 className="font-title text-2xl sm:text-3xl font-bold text-white mb-3">
                    Projeto Social
                  </h3>
                  <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium">
                    Uma oportunidade para quem deseja cuidar melhor da alimentação com orientação profissional e um valor mais acessível.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex justify-end">
                  <button
                    onClick={() => openWhatsApp('Olá, Ana Luiza! Gostaria de consultar a disponibilidade de vagas para o Projeto Social.')}
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#48679D] font-title font-bold text-sm px-7 py-3 rounded-full shadow-sm transition active:scale-95 cursor-pointer text-center"
                  >
                    Consultar vagas
                  </button>
                </div>
              </div>

            </div>

            {/* Aviso acolhedor de fechamento */}
            <div className="mt-12 text-center">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Dúvidas sobre qual o melhor plano para o seu objetivo?{' '}
                <button
                  onClick={() => openWhatsApp('Olá, Ana Luiza! Estou em dúvida sobre qual plano escolher para o meu momento.')}
                  className="text-[#5E6B1E] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  Fale comigo no WhatsApp
                </button>
              </p>
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






