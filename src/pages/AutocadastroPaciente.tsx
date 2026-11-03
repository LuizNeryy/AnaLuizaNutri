import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { AnamneseForm } from '../components/AnamneseForm'
import { Alert } from '../components/ui/alert'
import { Logo } from '../components/Logo'
import { construirCorpoAnamnese } from '../lib/anamnese'
import { api } from '../lib/api'

type Sexo = 'FEMININO' | 'MASCULINO' | 'OUTRO'

type Objetivo = {
  id: string
  nome: string
}

function formatarCpf(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return numeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

const TOTAL_PASSOS = 9

export function AutocadastroPaciente() {
  const navigate = useNavigate()

  // Passo atual (1 a 9)
  const [passo, setPasso] = useState(1)

  // Dados do formulário
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [codigoEmail, setCodigoEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo] = useState<Sexo | ''>('')
  const [pesoKg, setPesoKg] = useState('')
  const [alturaCm, setAlturaCm] = useState('')
  const [objetivosDisponiveis, setObjetivosDisponiveis] = useState<Objetivo[]>([])
  const [objetivosSelecionados, setObjetivosSelecionados] = useState<string[]>([])
  const [outroObjetivo, setOutroObjetivo] = useState(false)
  const [observacoesObjetivo, setObservacoesObjetivo] = useState('')
  const [aceiteLgpd, setAceiteLgpd] = useState(false)
  const [anamnese, setAnamnese] = useState<Record<string, string>>({})

  // Status e Erros
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [reenviadoTimer, setReenviadoTimer] = useState(0)

  useEffect(() => {
    api
      .get<Objetivo[]>('/objetivos')
      .then(setObjetivosDisponiveis)
      .catch(() => {
        setObjetivosDisponiveis([
          { id: 'perda-peso', nome: 'Perda de peso' },
          { id: 'ganho-massa', nome: 'Ganho de massa muscular' },
          { id: 'reeducacao', nome: 'Reeducação alimentar' },
          { id: 'saude-geral', nome: 'Saúde e disposição' },
          { id: 'manutencao', nome: 'Manutenção de peso' },
        ])
      })
  }, [])

  useEffect(() => {
    if (reenviadoTimer > 0) {
      const interval = setInterval(() => {
        setReenviadoTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [reenviadoTimer])

  function alternarObjetivo(id: string) {
    setObjetivosSelecionados((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    )
  }

  function handleReenviarCodigo() {
    setReenviadoTimer(60)
    setErro(null)
  }

  function validarPassoAtual(): boolean {
    setErro(null)

    if (passo === 1) {
      if (!nome.trim() || nome.trim().length < 3) {
        setErro('Por favor, informe seu nome completo.')
        return false
      }
    } else if (passo === 2) {
      const apenasNumeros = cpf.replace(/\D/g, '')
      if (apenasNumeros.length !== 11) {
        setErro('Por favor, digite um CPF válido com 11 dígitos.')
        return false
      }
    } else if (passo === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setErro('Por favor, informe um e-mail válido.')
        return false
      }
      const telNumeros = telefone.replace(/\D/g, '')
      if (telNumeros.length < 10) {
        setErro('Por favor, informe seu número de telefone/WhatsApp com DDD.')
        return false
      }
    } else if (passo === 4) {
      if (!codigoEmail.trim() || codigoEmail.trim().length < 4) {
        setErro('Por favor, digite o código de confirmação recebido.')
        return false
      }
    } else if (passo === 5) {
      if (senha.length < 6) {
        setErro('A senha deve conter no mínimo 6 caracteres.')
        return false
      }
      if (senha !== confirmarSenha) {
        setErro('A confirmação de senha não coincide com a senha.')
        return false
      }
    } else if (passo === 6) {
      if (!dataNascimento) {
        setErro('Por favor, informe sua data de nascimento.')
        return false
      }
    } else if (passo === 7) {
      // Medidas são opcionais, mas se preencher devem ser coerentes
      if (pesoKg && (Number(pesoKg) < 20 || Number(pesoKg) > 400)) {
        setErro('Por favor, informe um peso válido em kg.')
        return false
      }
      if (alturaCm && (Number(alturaCm) < 50 || Number(alturaCm) > 250)) {
        setErro('Por favor, informe uma altura válida em centímetros.')
        return false
      }
    } else if (passo === 8) {
      if (!aceiteLgpd) {
        setErro('É necessário aceitar os termos da LGPD para concluir seu cadastro.')
        return false
      }
    }

    return true
  }

  function proximoPasso() {
    if (validarPassoAtual()) {
      if (passo < TOTAL_PASSOS) {
        setPasso((atual) => atual + 1)
      } else {
        finalizarCadastro()
      }
    }
  }

  function passoAnterior() {
    setErro(null)
    if (passo > 1) {
      setPasso((atual) => atual - 1)
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    proximoPasso()
  }

  async function finalizarCadastro() {
    setEnviando(true)
    setErro(null)

    const cpfNumeros = cpf.replace(/\D/g, '')

    const nomesDosObjetivos = objetivosDisponiveis
      .filter((item) => objetivosSelecionados.includes(item.id))
      .map((item) => item.nome)

    const textoOutroObjetivo = outroObjetivo && observacoesObjetivo.trim() ? observacoesObjetivo.trim() : undefined

    try {
      await api.post('/portal-paciente/autocadastro', {
        nome: nome.trim(),
        cpf: cpfNumeros,
        email: email.trim(),
        contato: telefone.trim(),
        dataNascimento,
        sexo: sexo || undefined,
        pesoKg: pesoKg ? Number(pesoKg) : undefined,
        alturaCm: alturaCm ? Number(alturaCm) : undefined,
        objetivoIds: objetivosSelecionados,
        objetivosNomes: nomesDosObjetivos,
        outroObjetivo: textoOutroObjetivo,
        observacoesObjetivo: textoOutroObjetivo,
        senha,
        aceiteLgpd: true,
        ...construirCorpoAnamnese(anamnese),
      })

      setSucesso(true)
    } catch {
      setErro('Não foi possível concluir seu cadastro no momento. Verifique os dados e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  // TELA DE SUCESSO
  if (sucesso) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex justify-center">
            <Logo className="h-11" />
          </div>
          <div className="rounded-2xl border border-gray-200/90 bg-white p-8 sm:p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-primary">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Cadastro realizado com sucesso!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Seu perfil foi criado. Você já pode acessar o portal com seu CPF e a senha cadastrada.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-hover active:scale-[0.99]"
              >
                Ir para o Login
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const progressoPorcentagem = Math.round((passo / TOTAL_PASSOS) * 100)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Header com Logo */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Logo className="h-11 w-auto" />
          <p className="text-sm font-medium text-ink-secondary">
            Acompanhamento nutricional personalizado
          </p>
        </div>

        {/* Card do Formulário Multi-Step */}
        <div className="relative rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xl sm:p-10">
          {/* Barra de Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>Etapa {passo} de {TOTAL_PASSOS}</span>
              <span className="text-primary font-bold">{progressoPorcentagem}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progressoPorcentagem}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            {/* PASSO 1: NOME COMPLETO */}
            {passo === 1 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Qual é o seu nome completo?
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Vamos começar conhecendo você.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Silva Oliveira"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoFocus
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            {/* PASSO 2: CPF */}
            {passo === 2 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Qual é o seu CPF?
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Ele será utilizado como sua identificação de login no portal.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-sm font-semibold text-gray-800">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                    autoFocus
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            {/* PASSO 3: E-MAIL E TELEFONE */}
            {passo === 3 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Seus canais de contato
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Para avisos sobre sua dieta e envio de código de segurança.
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Seu melhor e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Telefone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 4: CÓDIGO DO E-MAIL */}
            {passo === 4 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary mb-1">
                  <Mail size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Confirme seu e-mail
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Digite o código de verificação enviado para{' '}
                    <strong className="text-gray-900">{email}</strong>.
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Código de verificação <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Ex: 123456"
                    value={codigoEmail}
                    onChange={(e) => setCodigoEmail(e.target.value)}
                    autoFocus
                    required
                    className="w-full tracking-widest text-center text-xl font-bold rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center justify-between text-xs mt-1 text-gray-500">
                    <span>Não recebeu o código?</span>
                    {reenviadoTimer > 0 ? (
                      <span className="text-gray-400 font-medium">Reenviar em {reenviadoTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReenviarCodigo}
                        className="font-semibold text-primary hover:underline"
                      >
                        Reenviar código
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 5: SENHA */}
            {passo === 5 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Crie sua senha de acesso
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Você usará seu CPF e esta senha para entrar no portal.
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Senha (mínimo 6 dígitos) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={mostrarSenha ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Crie uma senha segura"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoFocus
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setMostrarSenha((p) => !p)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700"
                      >
                        {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Confirme sua senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={mostrarConfirmar ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repita sua senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setMostrarConfirmar((p) => !p)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700"
                      >
                        {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 6: DATA DE NASCIMENTO E SEXO */}
            {passo === 6 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Dados biológicos
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Informações essenciais para o cálculo nutricional adequado.
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Data de nascimento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      autoFocus
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Sexo biológico
                    </label>
                    <select
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value as Sexo)}
                    >
                      <option value="">Selecione...</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="OUTRO">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 7: MEDIDAS INICIAIS */}
            {passo === 7 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Suas medidas atuais
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Preencha o que souber para estimarmos suas necessidades calóricas.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Peso atual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="400"
                      placeholder="Ex: 68.5"
                      value={pesoKg}
                      onChange={(e) => setPesoKg(e.target.value)}
                      autoFocus
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-800">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="50"
                      max="250"
                      placeholder="Ex: 170"
                      value={alturaCm}
                      onChange={(e) => setAlturaCm(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 8: OBJETIVOS E TERMOS LGPD */}
            {passo === 8 && (
              <div className="flex flex-col gap-5 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Quais são seus objetivos?
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Selecione suas principais metas e finalize seu cadastro.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {objetivosDisponiveis.map((item) => {
                    const ativo = objetivosSelecionados.includes(item.id)
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => alternarObjetivo(item.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                          ativo
                            ? 'border-primary bg-emerald-50/50 text-gray-900 shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                            ativo
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {ativo && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span>{item.nome}</span>
                      </button>
                    )
                  })}

                  {/* Opção Outro */}
                  <button
                    type="button"
                    onClick={() => setOutroObjetivo((prev) => !prev)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                      outroObjetivo
                        ? 'border-primary bg-emerald-50/50 text-gray-900 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        outroObjetivo
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {outroObjetivo && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span>Outro</span>
                  </button>
                </div>

                {outroObjetivo && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Descreva seu objetivo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Melhorar disposição, condicionamento, refluxo..."
                      value={observacoesObjetivo}
                      onChange={(e) => setObservacoesObjetivo(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                )}

                {/* Termo LGPD */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 transition-all hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={aceiteLgpd}
                      onChange={(e) => setAceiteLgpd(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary accent-primary focus:ring-primary"
                    />
                    <span className="text-xs leading-relaxed text-gray-700">
                      Li e concordo com a coleta e tratamento dos meus dados de saúde para fins de acompanhamento
                      nutricional conforme a <strong>LGPD</strong>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* PASSO 9: ANAMNESE (OPCIONAL) */}
            {passo === 9 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Mais sobre você
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Essas perguntas são opcionais e ajudam no seu acompanhamento.
                  </p>
                </div>
                <AnamneseForm value={anamnese} onChange={setAnamnese} variant="light" />
              </div>
            )}

            {/* Mensagem de Erro do Passo */}
            {erro && <Alert variant="error">{erro}</Alert>}

            {/* BOTÕES DE NAVEGAÇÃO */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              {passo > 1 && (
                <button
                  type="button"
                  onClick={passoAnterior}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.99]"
                >
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </button>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-md shadow-emerald-700/10 transition-all hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {enviando
                    ? 'Finalizando...'
                    : passo === TOTAL_PASSOS
                      ? 'Finalizar Cadastro'
                      : 'Continuar'}
                </span>
                {passo < TOTAL_PASSOS && <ArrowRight size={18} />}
              </button>
            </div>

            {/* Link de Login */}
            <p className="text-center text-sm text-gray-500">
              Já possui conta?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
