import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  BookOpen,
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
            ? 'bg-[#E6E6E9]/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="w-full px-6 md:px-12 flex items-center justify-between relative">
          {/* Logo Principal Oficial (Variação 7.1) - posicionada na esquerda com respiro */}
          <a href="#home" className="flex items-center gap-3 group z-10">
            <img
              src="/assets/v2/logos/logotipo_7.1.png"
              alt="Ana Luiza Ribeiro - Nutricionista"
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Navegação Desktop Centralizada */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-colors duration-200 relative ${
                    isActive ? 'text-white' : 'text-[#284d2c] hover:text-[#EEA4C2]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#48679D] rounded-full shadow-sm z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              )
            })}

            <Link
              to="/ebooks"
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full text-[#5e6b1e] hover:text-[#EEA4C2] transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              E-books
            </Link>
          </nav>

          {/* Botão Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 text-[#284d2c] hover:text-[#e85900] transition-colors ml-auto"
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
          2. HERO IMERSIVO EDITORIAL AMPLO COM FOTO INTEGRADA
          ==================================================================== */}
      <section
        id="home"
        className="relative pt-24 sm:pt-28 md:pt-32 pb-36 sm:pb-40 md:pb-44 lg:pb-44 bg-[#e6e6e8] overflow-hidden"
      >
        {/* FOTO DESKTOP: presença de banner aberto em pé à direita, com fusão suave ao fundo */}
        <div className="hidden lg:flex absolute right-0 bottom-0 top-16 xl:top-12 w-[46%] xl:w-[48%] pointer-events-none select-none z-0 items-end justify-end pr-4 xl:pr-10">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-end justify-end max-h-[720px] h-full"
          >
            <img
              src="/assets/v2/photos/ana_hero_feathered.png"
              alt="Nutricionista Ana Luiza Ribeiro"
              className="max-h-[660px] xl:max-h-[720px] w-auto object-contain object-bottom drop-shadow-[0_12px_36px_rgba(40,77,44,0.06)]"
            />
          </motion.div>
        </div>

        {/* CONTEÚDO EDITORIAL (LADO ESQUERDO) */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Título Principal Amplo & Editorial */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-[1.08] text-[#284d2c] font-editorial-serif mb-6"
            >
              Coma com paz e veja seu corpo responder com{' '}
              <span className="font-editorial-italic font-normal text-[#5e6b1e] underline decoration-[#eea4c2] underline-offset-8">
                vitalidade real.
              </span>
            </motion.h1>

            {/* Parágrafo Descritivo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#284d2c]/85 font-normal leading-relaxed mb-6 sm:mb-8"
            >
              A alimentação deve se adaptar à sua rotina, à sua realidade e aos seus objetivos, nunca o contrário. Conquiste resultados consistentes com acolhimento, leveza e respaldo científico individualizado.
            </motion.p>

            {/* FOTO NO MOBILE: banner aberto integrado (sem card duro cortado) */}
            <div className="lg:hidden w-full flex justify-center pt-2 pb-0 -mb-6 sm:-mb-8 relative z-10">
              <div className="relative max-w-sm sm:max-w-md w-full flex justify-center">
                <img
                  src="/assets/v2/photos/ana_hero_feathered.png"
                  alt="Nutricionista Ana Luiza Ribeiro"
                  className="max-h-[440px] sm:max-h-[500px] w-auto object-contain block drop-shadow-lg"
                />
              </div>
            </div>

            {/* Botões de Ação Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-2 sm:pt-0 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto relative z-20"
            >
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-primary w-full sm:w-auto text-base group justify-center shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Agendar Consulta no WhatsApp
              </a>
              <Link
                to="/ebooks"
                className="btn-pill-outline w-full sm:w-auto text-base justify-center bg-white/80 hover:bg-white"
              >
                <BookOpen className="w-4 h-4 text-[#5e6b1e]" />
                Conhecer E-books
              </Link>
            </motion.div>

            {/* Micro-credenciais / Badges dos Pilares com Cores Sólidas da Marca */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-[#284d2c]/10 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full"
            >
              {/* Badge 1: Verde Oliva sólido */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5e6b1e] text-white shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4b818]" />
                <span className="text-xs font-semibold tracking-wide">100% Online</span>
                <span className="text-[10px] text-white/80 font-light hidden sm:inline">• Brasil & Exterior</span>
              </div>

              {/* Badge 2: Mexerica Laranja sólido */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e85900] text-white shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-xs font-semibold tracking-wide">100% Individual</span>
                <span className="text-[10px] text-white/80 font-light hidden sm:inline">• Rotina Real</span>
              </div>

              {/* Badge 3: Goiaba Rosa sólido */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eea4c2] text-[#284d2c] shadow-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#284d2c]" />
                <span className="text-xs tracking-wide">Sem Terrorismo</span>
                <span className="text-[10px] text-[#284d2c]/85 font-medium hidden sm:inline">• Alimentação com Paz</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Onda Orgânica de Transição para a próxima seção */}
        <div className="absolute -bottom-[1px] left-0 right-0 w-full leading-none z-30 pointer-events-none">
          <svg
            className="relative block w-full h-16 sm:h-20 md:h-24 lg:h-28 text-[#284d2c]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,45 C320,115 540,-5 860,50 C1140,105 1320,15 1440,55 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>

          {/* Destaque 5 ("sobre mim"): Encaixado dentro do verde, com o topo tangenciando a borda da onda sem invadir o cinza/branco */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-5 left-[42%] sm:left-[43%] md:left-[44%] lg:left-[45%] -translate-x-1/2 pointer-events-none select-none z-30">
            <motion.div
              initial={{ rotate: -4 }}
              animate={{ rotate: [-4, -1, -4] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] filter brightness-105"
            >
              <img
                src="/assets/v2/stickers/destaque_5.png"
                alt="Etiqueta Sobre Mim"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. SEÇÃO APRESENTAÇÃO EDITORIAL (FUNDO VERDE COUVE #284D2C)
          ==================================================================== */}
      <section id="sobre" className="pt-10 md:pt-14 pb-20 md:pb-28 bg-[#284d2c] text-[#efe9d2] relative">
        {/* Adesivo 17: Em pé, gigante na parte inferior esquerda da tela verde, saindo da tela e encostando apenas na quina inferior esquerda da foto */}
        <div className="absolute -left-16 sm:-left-20 md:-left-24 -bottom-24 sm:-bottom-32 md:-bottom-36 w-[420px] sm:w-[520px] md:w-[620px] h-[650px] sm:h-[800px] md:h-[950px] pointer-events-none select-none z-0 opacity-80 rotate-[6deg] overflow-hidden">
          <img
            src="/assets/v2/stickers/adesivo_17.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain object-left-bottom filter brightness-125"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Foto Vertical com cantos arredondados */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative z-10"
            >
              <div className="relative mx-auto max-w-md">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-[#efe9d2]/20 bg-[#284d2c]">
                  <img
                    src="/assets/v2/photos/ana_21.png"
                    alt="Nutricionista Ana Luiza Ribeiro"
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
              className="lg:col-span-7 relative"
            >
              {/* Saudação Inicial Autoral */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#efe9d2] font-editorial-serif mb-4 leading-tight">
                Oi, eu sou a Ana Luiza!
              </h2>

              <p className="text-base sm:text-lg text-[#efe9d2]/90 leading-relaxed mb-4 font-light">
                Se você chegou até aqui, provavelmente já ouviu muito <span className="text-[#eea4c2] font-normal">"corta isso"</span>, <span className="text-[#eea4c2] font-normal">"proibido aquilo"</span> e <span className="text-[#eea4c2] font-normal">"só volta a comer quando emagrecer"</span>.
              </p>

              <p className="text-base sm:text-lg text-[#c4b818] italic font-editorial-italic font-normal mb-4">
                Eu acredito exatamente no contrário.
              </p>

              <p className="text-sm sm:text-base text-[#efe9d2]/85 leading-relaxed mb-6 font-light">
                Dieta não precisa ser sofrimento, e comida não é sua inimiga. Sou nutricionista, pós-graduada em <strong className="font-semibold text-white">Nutrição Clínica: Metabolismo, Prática e Terapia Nutricional</strong>. Meu propósito é mostrar que dá para cuidar da saúde com ciência, sem terrorismo nutricional e sem abrir mão do prazer de comer.
              </p>

              {/* Lista dos 4 Pilares da Ajuda (Com cores equilibradas) */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#c4b818] mb-4">
                  Quero ajudar você a:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#c4b818] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c4b818] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Emagrecer de forma sustentável, sem efeito sanfona
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#48679d] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#48679d] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Controlar exames alterados (glicemia, colesterol, pressão)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#eea4c2] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#eea4c2] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Melhorar intolerâncias e o conforto intestinal
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 hover:border-[#e85900] transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e85900] shrink-0" />
                    <span className="text-sm font-medium text-white">
                      Ter uma alimentação possível na rotina real
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco de Posicionamento Lindo Preservado */}
              <div className="pt-6 border-t border-white/10 mb-8">
                <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#c4b818] mb-2">
                  Nutrição Clínica & Vida Real
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl text-[#efe9d2] font-editorial-serif leading-[1.15]">
                  Nutrição personalizada para quem quer{' '}
                  <span className="font-editorial-italic text-[#eea4c2]">
                    fazer as pazes com a comida
                  </span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary text-sm shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  Conversar com a Ana Luiza
                </a>

                <a
                  href="https://instagram.com/aluizanutri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/20"
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
          4. SEÇÃO "A ABORDAGEM" / PILARES (FUNDO AZUL MIRTILO #48679D)
          ==================================================================== */}
      <section id="abordagem" className="py-24 md:py-32 bg-[#48679d] text-white relative">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial-serif text-white">
              a abordagem{' '}
              <span className="font-editorial-italic text-[#eea4c2]">
                ana luiza ribeiro
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed font-light">
              Três fundamentos que garantem resultados consistentes para sua saúde sem abrir mão da sua identidade.
            </p>
          </motion.div>

          {/* Grid dos 3 Pilares com Cards em Aveia e Tipografia Colorida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 max-w-5xl mx-auto">
            {/* Pilar 1 - Card Aveia com acento Oliva */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#efe9d2] text-[#284d2c] shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-white/40 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#5e6b1e]/15 text-[#5e6b1e] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#5e6b1e] group-hover:text-white transition-all duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#5e6b1e] mb-3">
                Mais Disposição
              </h3>
              <p className="text-sm text-[#284d2c]/80 leading-relaxed font-normal">
                Ajuste fino de micronutrientes e combinação glicêmica para você acordar com vitalidade e render durante todo o dia.
              </p>
            </motion.div>

            {/* Pilar 2 - Card Aveia com acento Mexerica / Laranja */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#efe9d2] text-[#284d2c] shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-white/40 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#e85900]/15 text-[#e85900] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#e85900] group-hover:text-white transition-all duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#e85900] mb-3">
                Zero Restrição Severa
              </h3>
              <p className="text-sm text-[#284d2c]/80 leading-relaxed font-normal">
                Coma o que você gosta através de substituições inteligentes. Sem culpa em jantares de família ou reuniões com amigos.
              </p>
            </motion.div>

            {/* Pilar 3 - Card Aveia com acento Rosa Goiaba */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#efe9d2] text-[#284d2c] shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-white/40 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#eea4c2]/35 text-[#284d2c] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#eea4c2] transition-all duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-editorial-serif text-[#48679d] mb-3">
                Conforto & Saúde
              </h3>
              <p className="text-sm text-[#284d2c]/80 leading-relaxed font-normal">
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
          5. SEÇÃO "COMO FUNCIONA / ROTINA NO PLANO" (FUNDO CREME CLARO BOUTIQUE)
          ==================================================================== */}
      <section id="servicos" className="py-24 md:py-32 bg-[#FAF8F2] relative overflow-hidden">
        {/* Adesivo Decorativo Sutil de Fundo */}
        <div className="absolute -top-12 -right-12 w-48 h-48 opacity-10 pointer-events-none select-none rotate-12">
          <img
            src="/assets/v2/stickers/adesivo_1.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
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
            <p className="text-sm sm:text-base text-[#284d2c]/75 mt-4 leading-relaxed font-normal">
              Cada etapa do acompanhamento é desenhada para tornar o processo leve, aplicável e livre de complicação.
            </p>
          </div>

          {/* Cards de Etapas com cantos arredondados boutique & badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Etapa 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-[#284d2c]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#5e6b1e]/10 text-[#5e6b1e] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#5e6b1e] group-hover:text-[#efe9d2] transition-all duration-300 p-3">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#5e6b1e] bg-[#efe9d2]/80 px-3 py-1 rounded-full">
                    Passo 01
                  </span>
                </div>
                <h4 className="text-xl font-editorial-serif text-[#284d2c] mb-3 group-hover:text-[#5e6b1e] transition-colors">
                  Anamnese Completa
                </h4>
                <p className="text-sm text-[#284d2c]/75 leading-relaxed font-light">
                  Investigação clínica minuciosa: histórico de saúde, sinais e sintomas, exames recentes e sua relação emocional com os alimentos.
                </p>
              </div>
            </motion.div>

            {/* Etapa 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-[#284d2c]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#48679d]/10 text-[#48679d] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#48679d] group-hover:text-white transition-all duration-300 p-3">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#48679d] bg-[#48679d]/10 px-3 py-1 rounded-full">
                    Passo 02
                  </span>
                </div>
                <h4 className="text-xl font-editorial-serif text-[#284d2c] mb-3 group-hover:text-[#48679d] transition-colors">
                  Plano Sob Medida
                </h4>
                <p className="text-sm text-[#284d2c]/75 leading-relaxed font-light">
                  Cardápio construído de acordo com sua rotina, preferências, disponibilidade de cozinhar e orçamento familiar.
                </p>
              </div>
            </motion.div>

            {/* Etapa 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-[#284d2c]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#e85900]/10 text-[#e85900] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#e85900] group-hover:text-white transition-all duration-300 p-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#e85900] bg-[#e85900]/10 px-3 py-1 rounded-full">
                    Passo 03
                  </span>
                </div>
                <h4 className="text-xl font-editorial-serif text-[#284d2c] mb-3 group-hover:text-[#e85900] transition-colors">
                  Guia de Substituições
                </h4>
                <p className="text-sm text-[#284d2c]/75 leading-relaxed font-light">
                  Tabela prática para variar opções em restaurantes, viagens e imprevistos do dia a dia sem sair do foco.
                </p>
              </div>
            </motion.div>

            {/* Etapa 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-[#284d2c]/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-[#eea4c2]/20 text-[#284d2c] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#eea4c2] transition-all duration-300 p-3">
                    <Heart className="w-6 h-6 text-[#284d2c]" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#284d2c] bg-[#eea4c2]/25 px-3 py-1 rounded-full">
                    Passo 04
                  </span>
                </div>
                <h4 className="text-xl font-editorial-serif text-[#284d2c] mb-3 group-hover:text-[#e85900] transition-colors">
                  Suporte Contínuo
                </h4>
                <p className="text-sm text-[#284d2c]/75 leading-relaxed font-light">
                  Canal aberto via WhatsApp para esclarecer dúvidas de rótulos no supermercado e adaptar detalhes semana a semana.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SEÇÃO "PLANOS & MODALIDADES" (CARDS BOUTIQUE COM ADESIVOS OFICIAIS)
          ==================================================================== */}
      <section id="planos" className="py-24 md:py-32 bg-[#efe9d2] relative overflow-hidden">
        {/* Adesivo Decorativo Sutil de Fundo */}
        <div className="absolute -bottom-10 -left-10 w-52 h-52 opacity-15 pointer-events-none select-none -rotate-12">
          <img
            src="/assets/v2/stickers/adesivo_2.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
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
            <p className="text-sm sm:text-base text-[#284d2c]/75 mt-3 font-normal">
              Planos pensados para diferentes momentos e necessidades da sua jornada nutricional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {/* Card 1: Consulta Avulsa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5e6b1e] bg-[#efe9d2] px-3.5 py-1 rounded-full">
                    Pontual
                  </span>
                </div>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mb-2">
                  Consulta Individual
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6 leading-relaxed">
                  Ideal para avaliação inicial, alinhamento de conduta ou ajustes em rotinas pré-existentes.
                </p>
                <div className="space-y-3.5 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Consulta completa de 1h30</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Plano alimentar em até 48h</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>30 dias de suporte via WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Presencial ou Online</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline w-full text-center text-xs block py-3.5"
                >
                  Saber Valores
                </a>
              </div>
            </motion.div>

            {/* Card 2: Combo Acompanhamento (Destaque com Adesivo Oficial) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border-2 border-[#5e6b1e] shadow-2xl relative flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 lg:-translate-y-2"
            >
              {/* Adesivo Oficial 3 como Selo Estilizado no Topo Direito */}
              <div className="absolute -top-6 -right-4 w-20 h-20 md:w-24 md:h-24 pointer-events-none drop-shadow-md z-20 rotate-6">
                <img
                  src="/assets/v2/stickers/adesivo_3.png"
                  alt="Selo Destaque Oficial"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="inline-block bg-[#5e6b1e] text-[#efe9d2] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm mb-4">
                  ★ Mais Escolhido
                </div>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mb-2">
                  Plano Bimestral
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6 leading-relaxed">
                  Para quem deseja construir novos hábitos com acompanhamento próximo, reavaliação e ajustes contínuos.
                </p>
                <div className="space-y-3.5 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span><strong>2 consultas completas</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Ajustes periódicos de conduta</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span><strong>60 dias de suporte contínuo</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
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
                  className="btn-pill-primary w-full text-center text-xs block py-3.5 shadow-md hover:shadow-lg"
                >
                  Garantir Vaga
                </a>
              </div>
            </motion.div>

            {/* Card 3: Programa Premium Semestral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#48679d] bg-[#48679d]/10 px-3.5 py-1 rounded-full">
                    Transformação
                  </span>
                </div>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mb-2">
                  Plano Semestral
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6 leading-relaxed">
                  Acompanhamento aprofundado para patologias, resistência insulínica e emagrecimento definitivo.
                </p>
                <div className="space-y-3.5 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span><strong>6 consultas</strong> (1 por mês)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Análise contínua de exames de sangue</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Acesso WhatsApp com canal prioritário</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Planejamentos atualizados por etapa</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline w-full text-center text-xs block py-3.5"
                >
                  Saber Valores
                </a>
              </div>
            </motion.div>

            {/* Card 4: Projeto Social (Com Adesivo Oficial 4) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 border border-[#284d2c]/10 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#284d2c] bg-[#eea4c2]/30 px-3.5 py-1 rounded-full font-semibold">
                    Acesso & Cuidado
                  </span>
                  <div className="w-8 h-8 opacity-80">
                    <img
                      src="/assets/v2/stickers/adesivo_4.png"
                      alt="Cuidado"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-editorial-serif text-[#284d2c] mb-2">
                  Atendimento Social
                </h3>
                <p className="text-xs text-[#284d2c]/70 mb-6 leading-relaxed">
                  Vagas sociais mensais dedicadas a pessoas que necessitam de suporte clínico especializado.
                </p>
                <div className="space-y-3.5 text-xs text-[#284d2c]/85">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Mesmo rigor técnico e acolhimento</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Valor social acessível</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5e6b1e] shrink-0 mt-0.5" />
                    <span>Presencial ou Online</span>
                  </div>
                  <div className="flex items-start gap-2.5">
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
                  className="btn-pill-outline w-full text-center text-xs block py-3.5"
                >
                  Consultar Vagas
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6.5. SEÇÃO EDITORIAL / FRASE CONCEITUAL & PROVA SOCIAL
          "Alimentação boa é aquela que cabe na sua rotina, no seu bolso e no seu coração"
          ==================================================================== */}
      <section className="py-20 md:py-28 bg-[#284d2c] text-[#efe9d2] relative overflow-hidden">
        {/* Elemento de Fundo Texturizado Suave */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img
            src="/assets/v2/patterns/pattern_1.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Ícone de Aspas Editorial */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c4b818]/15 border border-[#c4b818]/30 text-[#c4b818]">
              <span className="font-editorial-serif text-3xl leading-none">“</span>
            </div>

            <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-editorial-serif leading-[1.25] text-[#efe9d2] max-w-4xl mx-auto">
              Alimentação boa é aquela que cabe na sua{' '}
              <span className="font-editorial-italic text-[#c4b818]">rotina</span>, no seu{' '}
              <span className="font-editorial-italic text-[#eea4c2]">bolso</span> e no seu{' '}
              <span className="font-editorial-italic text-[#e85900]">coração</span>.
            </blockquote>

            <div className="pt-4 flex flex-col items-center">
              <div className="w-12 h-0.5 bg-[#c4b818]/50 mb-4" />
              <p className="text-sm md:text-base font-semibold tracking-wider uppercase text-[#efe9d2]">
                Ana Luiza Ribeiro
              </p>
              <p className="text-xs text-[#efe9d2]/70 font-light mt-1">
                Nutricionista Clínica • CRN-9 38501
              </p>
            </div>
          </motion.div>
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
            <p className="text-sm text-[#284d2c]/75 mt-3 max-w-lg mx-auto font-light">
              Tudo o que você precisa saber sobre o formato das consultas, entrega do planejamento e suporte contínuo.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#5e6b1e]/40 shadow-lg ring-1 ring-[#5e6b1e]/20'
                      : 'border-[#284d2c]/10 shadow-sm hover:border-[#5e6b1e]/30 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 transition-colors"
                  >
                    <span className={`text-base sm:text-lg font-semibold transition-colors ${
                      isOpen ? 'text-[#5e6b1e]' : 'text-[#284d2c]'
                    }`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#5e6b1e] text-[#efe9d2] rotate-180' : 'bg-[#efe9d2]/60 text-[#284d2c]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 sm:px-8 pb-6 text-sm text-[#284d2c]/80 leading-relaxed border-t border-[#efe9d2]/60 pt-4 font-light"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. RODAPÉ DE ALTO PADRÃO BOUTIQUE (COUVE PROFUNDO #284D2C)
          ==================================================================== */}
      <footer className="bg-[#284d2c] text-[#efe9d2] pt-20 pb-12 border-t border-[#284d2c] relative overflow-hidden">
        {/* Marca d'água decorativa sutil */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 opacity-5 pointer-events-none select-none">
          <img
            src="/assets/v2/stickers/adesivo_3.png"
            alt=""
            className="w-full h-full object-contain filter invert"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            {/* Coluna 1: Marca e Registro */}
            <div className="md:col-span-5 space-y-5">
              <img
                src="/assets/v2/logos/logotipo_v1_1.2.svg"
                alt="Ana Luiza Ribeiro"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <p className="text-sm text-[#efe9d2]/75 leading-relaxed max-w-sm font-light">
                Nutrição clínica individualizada e baseada em evidências científicas. Cuidado humanizado para transformar sua relação com a comida.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#c4b818] font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4b818]" />
                Ana Luiza Ribeiro • CRN-9 38501
              </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#efe9d2] mb-4">
                Navegação
              </h4>
              <ul className="space-y-2.5 text-sm text-[#efe9d2]/75 font-light">
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
                  <a href="#servicos" className="hover:text-[#c4b818] transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-[#c4b818] transition-colors">
                    Planos e Valores
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#c4b818] transition-colors">
                    Dúvidas Frequentes
                  </a>
                </li>
                <li>
                  <Link to="/ebooks" className="hover:text-[#c4b818] transition-colors inline-flex items-center gap-1.5">
                    <span>E-books & Receitas</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#c4b818]/20 text-[#c4b818]">Novo</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Atendimento e Redes */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#efe9d2] mb-4">
                Atendimento
              </h4>
              <p className="text-sm text-[#efe9d2]/75 font-light leading-relaxed">
                Presencial em Belo Horizonte/MG e Online para todo o Brasil e Exterior por videochamada.
              </p>
              <div className="pt-4 flex items-center gap-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#c4b818] hover:text-[#284d2c] text-[#efe9d2] text-xs font-semibold transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://instagram.com/aluizanutri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-[#eea4c2] hover:text-[#284d2c] text-[#efe9d2] text-xs font-semibold transition-all duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={16} />
                  <span>@aluizanutri</span>
                </a>
              </div>
            </div>
          </div>

          {/* Linha Inferior Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#efe9d2]/60 gap-4">
            <p>© {new Date().getFullYear()} Ana Luiza Ribeiro. Todos os direitos reservados.</p>
            <p className="font-light tracking-wide text-[#efe9d2]/50">Design Editorial Boutique v2</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
