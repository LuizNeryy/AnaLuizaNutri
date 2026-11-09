import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Heart,
  Scale,
  Activity,
  CalendarCheck,
} from 'lucide-react'

const WHATSAPP_PHONE = '553184759120'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  'Olá, Ana Luiza! Gostaria de saber mais sobre as consultas nutricionais.'
)}`

function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)

      const sections = ['home', 'sobre', 'abordagem', 'servicos', 'planos', 'faq']
      const scrollPosition = window.scrollY + 180

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#sobre', label: 'Sobre Mim', id: 'sobre' },
    { href: '#abordagem', label: 'A Abordagem', id: 'abordagem' },
    { href: '#servicos', label: 'Como Funciona', id: 'servicos' },
    { href: '#planos', label: 'Planos', id: 'planos' },
    { href: '#faq', label: 'Dúvidas', id: 'faq' },
  ]

  const faqs = [
    {
      q: 'Como funciona a primeira consulta?',
      a: 'Nossa primeira consulta dura cerca de 1 hora a 1h30. É uma conversa profunda sobre sua rotina, histórico de saúde, preferências alimentares, relação com a comida e exames laboratoriais. Saímos com metas claras e possíveis de executar na sua realidade.',
    },
    {
      q: 'O plano alimentar é entregue na hora?',
      a: 'Para garantir um plano 100% individualizado, detalhado e com receitas adaptadas à sua rotina real, o planejamento alimentar completo é enviado em até 48 horas úteis via aplicativo exclusivo e PDF.',
    },
    {
      q: 'Você atende online ou presencial?',
      a: 'Atendo de ambas as formas! Online para todo o Brasil e exterior por videochamada com a mesma profundidade, ou presencial em consultório acolhedor em Belo Horizonte/MG.',
    },
    {
      q: 'Vou precisar cortar tudo o que eu gosto?',
      a: 'Absolutamente não. Meu trabalho é pautado no fim do terrorismo nutricional. A melhor dieta é a que cabe na sua vida social, no seu bolso e no seu coração.',
    },
    {
      q: 'Como funciona o suporte entre as consultas?',
      a: 'Você terá acesso direto ao meu WhatsApp profissional para tirar dúvidas de mercado, cardápios em restaurantes e ajustes de receitas, sem ficar desamparado(a).',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#284D2C] selection:bg-[#eea4c2]/30 selection:text-[#284d2c] font-sans">
      {/* ====================================================================
          1. HEADER INTEGRADO & EDITORIAL
          ==================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#efe9d2]/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Principal Oficial */}
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/assets/v2/logos/logotipo_v1_1.1.svg"
              alt="Ana Luiza Ribeiro - Nutricionista"
              className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-sm tracking-wide transition-all font-medium relative ${
                    isActive
                      ? 'text-[#e85900] font-semibold'
                      : isScrolled
                      ? 'text-[#284d2c] hover:text-[#e85900]'
                      : 'text-[#284d2c] hover:text-[#e85900]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#e85900] rounded-full"
                    />
                  )}
                </a>
              )
            })}

            <Link
              to="/ebooks"
              className="text-sm font-medium text-[#5e6b1e] hover:text-[#e85900] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              E-books
            </Link>
          </nav>

          {/* CTA Pílula Topo */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-sm shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Agendar Consulta
            </a>
          </div>

          {/* Botão Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 text-[#284d2c] hover:text-[#e85900] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-[#efe9d2] border-t border-[#284d2c]/10 px-6 py-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#284d2c] hover:text-[#e85900] py-1"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/ebooks"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#5e6b1e] hover:text-[#e85900] py-1 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                E-books & Materiais
              </Link>
              <div className="pt-4 border-t border-[#284d2c]/10">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary w-full text-center text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Agendar Consulta
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      {/* ====================================================================
          2. HERO IMERSIVO (ESTILO THE GREEN GODDESS)
          ==================================================================== */}
      <section
        id="home"
        className="relative pt-28 md:pt-36 pb-24 md:pb-36 bg-gradient-to-b from-[#efe9d2]/40 via-[#FAF8F2] to-[#FAF8F2] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Coluna Texto / Editorial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Eyebrow com Selo */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#efe9d2] text-[#5e6b1e] text-xs font-semibold tracking-widest uppercase mb-6 border border-[#5e6b1e]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#e85900]" />
                Nutrição Clínica • CRN-9 38501
              </div>

              {/* Título Misto Editorial ("eat well. feel alive.") */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-[1.08] text-[#284d2c] font-editorial-serif mb-6">
                coma bem.{' '}
                <span className="font-editorial-italic font-normal text-[#5e6b1e]">
                  sinta-se viva.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#284d2c]/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8">
                Cuidar da saúde não precisa ser sinônimo de sacrifício ou corte radical. Uma
                nutrição individualizada, científica e acolhedora para transformar sua rotina com leveza.
              </p>

              {/* Ações Hero */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary w-full sm:w-auto text-base group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Agendar Primeira Consulta
                </a>
                <a
                  href="#sobre"
                  className="btn-pill-outline w-full sm:w-auto text-base"
                >
                  Conhecer Minha Abordagem
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Micro-credenciais / Badges */}
              <div className="mt-10 pt-8 border-t border-[#284d2c]/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#284d2c]/75 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5e6b1e]" />
                  <span>Atendimento Online & Presencial (BH)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5e6b1e]" />
                  <span>Pós-graduada em Nutrição Clínica</span>
                </div>
              </div>
            </motion.div>

            {/* Coluna Imagem Hero com Selos Flutuantes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Moldura de Fundo Orgânica */}
                <div className="absolute inset-0 bg-[#efe9d2] rounded-[2.5rem] transform rotate-2 scale-98 transition-transform" />
                
                {/* Imagem Principal da Nutricionista */}
                <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-xl border border-[#efe9d2]">
                  <img
                    src="/assets/v2/photos/ana_14.png"
                    alt="Nutricionista Ana Luiza Ribeiro"
                    className="w-full h-auto object-cover object-top aspect-[4/5] hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#284d2c]/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Selo/Adesivo Oficial Flutuante 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 z-20 w-24 h-24 md:w-28 md:h-28 drop-shadow-lg"
                >
                  <img
                    src="/assets/v2/stickers/adesivo_1.png"
                    alt="Selo oficial"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Cartão de Depoimento Rápido Flutuante */}
                <div className="absolute -bottom-6 -right-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#efe9d2] max-w-xs text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#5e6b1e]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5e6b1e]">
                      Abordagem Realista
                    </span>
                  </div>
                  <p className="text-xs text-[#284d2c] italic">
                    "Alimentação boa é aquela que cabe na sua rotina, no seu bolso e no seu coração."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Onda Orgânica de Transição para a próxima seção */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-12 md:h-20 text-[#efe9d2]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.31,201.21,110.1,241.67,103.66,281.87,85.25,321.39,56.44Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ====================================================================
          3. SEÇÃO APRESENTAÇÃO EDITORIAL (FUNDO AVEIA #EFE9D2)
          ==================================================================== */}
      <section id="sobre" className="py-20 md:py-32 bg-[#efe9d2] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Foto Vertical com cantos arredondados */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl border-4 border-white/60">
                  <img
                    src="/assets/v2/photos/ana_2.png"
                    alt="Ana Luiza Ribeiro em consulta"
                    className="w-full h-auto object-cover aspect-[3/4]"
                  />
                </div>

                {/* Selo circular oficial da designer */}
                <div className="absolute -bottom-8 -right-6 w-28 h-28 z-20">
                  <img
                    src="/assets/v2/stickers/adesivo_2.png"
                    alt="Selo aprovado"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </motion.div>

            {/* Conteúdo Editorial */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#5e6b1e] mb-3">
                Nutrição Clínica & Vida Real
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#284d2c] font-editorial-serif mb-6 leading-[1.15]">
                Nutrição personalizada para quem quer{' '}
                <span className="font-editorial-italic text-[#e85900]">
                  fazer as pazes com a comida
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#284d2c]/85 leading-relaxed mb-5 font-normal">
                Se você já se sentiu perdida com prescrições genéricas de gaveta, terrorismo com carboidratos
                e dietas impossíveis de sustentar por mais de duas semanas, saiba que o problema nunca foi sua força de vontade.
              </p>

              <p className="text-base sm:text-lg text-[#284d2c]/85 leading-relaxed mb-8 font-normal">
                Sou <strong>Ana Luiza Ribeiro</strong>, nutricionista pós-graduada em <strong>Nutrição Clínica: Metabolismo, Prática e Terapia Nutricional</strong>. Minha missão é traduzir a ciência médica em refeições práticas e saborosas que respeitam o seu trabalho, sua família e seus momentos de prazer.
              </p>

              {/* Lista dos 4 Pilares da Ajuda (Com cores equilibradas) */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#284d2c] mb-4">
                  Quero ajudar você a:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-[#284d2c]/10 hover:border-[#5e6b1e] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5e6b1e] shrink-0" />
                    <span className="text-sm font-medium text-[#284d2c]">
                      Emagrecer de forma sustentável, sem efeito sanfona
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-[#284d2c]/10 hover:border-[#48679d] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#48679d] shrink-0" />
                    <span className="text-sm font-medium text-[#284d2c]">
                      Controlar exames alterados (glicemia, colesterol, pressão)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-[#284d2c]/10 hover:border-[#eea4c2] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#eea4c2] shrink-0" />
                    <span className="text-sm font-medium text-[#284d2c]">
                      Melhorar intolerâncias e o conforto intestinal
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-[#284d2c]/10 hover:border-[#e85900] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e85900] shrink-0" />
                    <span className="text-sm font-medium text-[#284d2c]">
                      Ter uma alimentação possível na rotina real
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Conversar com a Ana Luiza
                </a>

                <a
                  href="https://instagram.com/aluizanutri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/60 hover:bg-white text-[#284d2c] text-sm font-semibold transition-all border border-[#284d2c]/10"
                >
                  <InstagramIcon size={18} className="text-[#eea4c2]" />
                  @aluizanutri
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SEÇÃO "A ABORDAGEM" / PILARES (FUNDO ESCURO COUVE #284D2C)
             Inspirada em "the green goddess approach"
          ==================================================================== */}
      <section id="abordagem" className="py-24 md:py-32 bg-[#284d2c] text-[#efe9d2] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          {/* Título de Alto Contraste Editorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20 max-w-2xl mx-auto"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-[#c4b818] mb-3">
              O Método na Prática
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif text-[#efe9d2]">
              a abordagem{' '}
              <span className="font-editorial-italic text-[#c4b818]">
                ana luiza ribeiro
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#efe9d2]/80 leading-relaxed font-light">
              Três fundamentos que garantem resultados consistentes para sua saúde sem abrir mão da sua identidade.
            </p>
          </motion.div>

          {/* Grid dos 3 Pilares com Ícones Oficiais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto">
            {/* Pilar 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#c4b818]/40 transition-all group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center p-3 rounded-2xl bg-[#efe9d2]/10 group-hover:bg-[#efe9d2]/20 transition-colors">
                <img
                  src="/assets/v2/icons/icone_3.svg"
                  alt="Mais Energia"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#efe9d2] mb-3">
                Mais Disposição
              </h3>
              <p className="text-sm text-[#efe9d2]/75 leading-relaxed font-light">
                Ajuste fino de micronutrientes e combinação glicêmica para você acordar com vitalidade e render durante todo o dia.
              </p>
            </motion.div>

            {/* Pilar 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#eea4c2]/40 transition-all group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center p-3 rounded-2xl bg-[#efe9d2]/10 group-hover:bg-[#efe9d2]/20 transition-colors">
                <img
                  src="/assets/v2/icons/icone_5.svg"
                  alt="Menos Fadiga"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#efe9d2] mb-3">
                Zero Restrição Severa
              </h3>
              <p className="text-sm text-[#efe9d2]/75 leading-relaxed font-light">
                Coma o que você gosta através de substituições inteligentes. Sem culpa em jantares de família ou reuniões com amigos.
              </p>
            </motion.div>

            {/* Pilar 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#e85900]/40 transition-all group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center p-3 rounded-2xl bg-[#efe9d2]/10 group-hover:bg-[#efe9d2]/20 transition-colors">
                <img
                  src="/assets/v2/icons/icone_6.svg"
                  alt="Equilíbrio Clínico"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#efe9d2] mb-3">
                Conforto & Saúde
              </h3>
              <p className="text-sm text-[#efe9d2]/75 leading-relaxed font-light">
                Cuidado dedicado à saúde intestinal, digestão silenciosa e melhora direta dos marcadores laboratoriais em cada retorno.
              </p>
            </motion.div>
          </div>

          <div className="mt-14">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#c4b818] text-[#284d2c] font-bold text-sm hover:bg-[#d8cc1c] transition-all shadow-lg hover:scale-105"
            >
              <CalendarCheck className="w-4 h-4" />
              Agendar Avaliação Inicial
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SEÇÃO "COMO FUNCIONA / ROTINA NO PLANO" (FUNDO CREME CLARO)
          ==================================================================== */}
      <section id="servicos" className="py-24 md:py-32 bg-[#FAF8F2] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5e6b1e] mb-2 block">
              Passo a Passo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif text-[#284d2c]">
              Sua rotina também{' '}
              <span className="font-editorial-italic text-[#5e6b1e]">
                entra no plano
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#284d2c]/75 mt-4">
              Cada etapa do acompanhamento é desenhada para tornar o processo leve, aplicável e livre de complicação.
            </p>
          </div>

          {/* Cards de Etapas com cantos arredondados boutique */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Etapa 1 */}
            <div className="bg-white p-7 rounded-3xl border border-[#efe9d2] shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#5e6b1e]/10 text-[#5e6b1e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#284d2c] mb-2">
                1. Anamnese Completa
              </h4>
              <p className="text-sm text-[#284d2c]/75 leading-relaxed">
                Investigação clínica minuciosa: histórico de saúde, sinais e sintomas, exames recentes e sua relação emocional com os alimentos.
              </p>
            </div>

            {/* Etapa 2 */}
            <div className="bg-white p-7 rounded-3xl border border-[#efe9d2] shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#48679d]/10 text-[#48679d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#284d2c] mb-2">
                2. Plano Sob Medida
              </h4>
              <p className="text-sm text-[#284d2c]/75 leading-relaxed">
                Cardápio construído de acordo com sua rotina, preferências, disponibilidade de cozinhar e orçamento familiar.
              </p>
            </div>

            {/* Etapa 3 */}
            <div className="bg-white p-7 rounded-3xl border border-[#efe9d2] shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#e85900]/10 text-[#e85900] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#284d2c] mb-2">
                3. Guia de Substituições
              </h4>
              <p className="text-sm text-[#284d2c]/75 leading-relaxed">
                Tabela prática para variar opções em restaurantes, viagens e imprevistos do dia a dia sem sair do foco.
              </p>
            </div>

            {/* Etapa 4 */}
            <div className="bg-white p-7 rounded-3xl border border-[#efe9d2] shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#eea4c2]/20 text-[#284d2c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-[#284d2c]" />
              </div>
              <h4 className="text-lg font-bold text-[#284d2c] mb-2">
                4. Suporte Contínuo
              </h4>
              <p className="text-sm text-[#284d2c]/75 leading-relaxed">
                Canal aberto via WhatsApp para esclarecer dúvidas de rótulos no supermercado e adaptar detalhes semana a semana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SEÇÃO "PLANOS & MODALIDADES" (CARDS BOUTIQUE)
          ==================================================================== */}
      <section id="planos" className="py-24 md:py-32 bg-[#efe9d2] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5e6b1e] mb-2 block">
              Investimento no seu Bem-Estar
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif text-[#284d2c]">
              Escolha a modalidade{' '}
              <span className="font-editorial-italic text-[#e85900]">
                ideal para você
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#284d2c]/75 mt-3">
              Planos pensados para diferentes momentos e necessidades da sua jornada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Consulta Avulsa */}
            <div className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5e6b1e] bg-[#efe9d2] px-3 py-1 rounded-full">
                  Pontual
                </span>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mt-4 mb-2">
                  Consulta Individual
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6">
                  Ideal para avaliação inicial, alinhamento de conduta ou ajustes em rotinas pré-existentes.
                </p>
                <div className="space-y-3 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Consulta completa de 1h30</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Plano alimentar em até 48h</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>30 dias de suporte WhatsApp</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline w-full text-center text-xs"
                >
                  Saber Valores
                </a>
              </div>
            </div>

            {/* Card 2: Combo Acompanhamento (Destaque) */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#5e6b1e] shadow-xl relative flex flex-col justify-between hover:scale-102 transition-transform">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5e6b1e] text-[#efe9d2] text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Mais Escolhido
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#e85900] bg-[#efe9d2] px-3 py-1 rounded-full">
                  Resultados Sólidos
                </span>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mt-4 mb-2">
                  Plano Bimestral
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6">
                  Para quem deseja construir novos hábitos com acompanhamento próximo e reavaliação.
                </p>
                <div className="space-y-3 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>2 consultas completas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Ajustes periódicos de conduta</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>60 dias de suporte direto</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>E-book exclusivo de receitas</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary w-full text-center text-xs"
                >
                  Garantir Vaga
                </a>
              </div>
            </div>

            {/* Card 3: Programa Premium Semestral */}
            <div className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#48679d] bg-[#efe9d2] px-3 py-1 rounded-full">
                  Transformação Completa
                </span>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mt-4 mb-2">
                  Plano Semestral
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6">
                  Acompanhamento aprofundado para patologias, resistência insulínica e emagrecimento definitivo.
                </p>
                <div className="space-y-3 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>6 consultas (1 por mês)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Análise contínua de exames</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Acesso total WhatsApp prioritário</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline w-full text-center text-xs"
                >
                  Saber Valores
                </a>
              </div>
            </div>

            {/* Card 4: Projeto Social */}
            <div className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#eea4c2] bg-[#eea4c2]/15 px-3 py-1 rounded-full">
                  Acesso & Cuidado
                </span>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mt-4 mb-2">
                  Atendimento Social
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6">
                  Vagas sociais mensais dedicadas a pessoas que necessitam de suporte clínico especializado.
                </p>
                <div className="space-y-3 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Mesmo rigor técnico integral</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Valor social acessível</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Vagas limitadas por mês</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline w-full text-center text-xs"
                >
                  Consultar Vagas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. FAQ ACCORDION BOUTIQUE
          ==================================================================== */}
      <section id="faq" className="py-24 md:py-32 bg-[#FAF8F2] relative">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5e6b1e] mb-2 block">
              Tire suas Dúvidas
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif text-[#284d2c]">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#efe9d2] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-semibold text-[#284d2c] hover:text-[#5e6b1e] transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#5e6b1e] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-sm text-[#284d2c]/80 leading-relaxed border-t border-[#efe9d2]/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. RODAPÉ DE ALTO PADRÃO BOUTIQUE (COUVE PROFUNDO #284D2C)
          ==================================================================== */}
      <footer className="bg-[#284d2c] text-[#efe9d2] pt-20 pb-12 border-t border-[#284d2c]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            {/* Coluna 1: Marca e Registro */}
            <div className="md:col-span-5 space-y-4">
              <img
                src="/assets/v2/logos/logotipo_v1_1.2.svg"
                alt="Ana Luiza Ribeiro"
                className="h-10 w-auto object-contain"
              />
              <p className="text-sm text-[#efe9d2]/75 leading-relaxed max-w-sm font-light">
                Nutrição clínica individualizada e baseada em evidências científicas. Cuidado humanizado para transformar sua relação com a comida.
              </p>
              <div className="pt-2 text-xs text-[#c4b818] font-semibold tracking-wider uppercase">
                Ana Luiza Ribeiro • CRN-9 38501
              </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#efe9d2] mb-4">
                Navegação
              </h4>
              <ul className="space-y-2 text-sm text-[#efe9d2]/75">
                <li>
                  <a href="#sobre" className="hover:text-[#c4b818] transition-colors">
                    Sobre a Nutricionista
                  </a>
                </li>
                <li>
                  <a href="#abordagem" className="hover:text-[#c4b818] transition-colors">
                    A Abordagem Clínica
                  </a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-[#c4b818] transition-colors">
                    Planos e Valores
                  </a>
                </li>
                <li>
                  <Link to="/ebooks" className="hover:text-[#c4b818] transition-colors">
                    E-books & Receitas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Atendimento e Redes */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#efe9d2] mb-4">
                Atendimento
              </h4>
              <p className="text-sm text-[#efe9d2]/75 font-light">
                Presencial em Belo Horizonte/MG e Online para todo o Brasil e Exterior.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-[#c4b818] hover:text-[#284d2c] text-[#efe9d2] transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/aluizanutri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-[#eea4c2] hover:text-[#284d2c] text-[#efe9d2] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Linha Inferior Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#efe9d2]/60 gap-4">
            <p>© {new Date().getFullYear()} Ana Luiza Ribeiro. Todos os direitos reservados.</p>
            <p className="font-light">Design Editorial Boutique v2</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
