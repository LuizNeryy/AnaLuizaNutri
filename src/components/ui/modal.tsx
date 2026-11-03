import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  onClose: () => void
  // id do título: com ele o modal é anunciado como diálogo
  labelledBy?: string
  children: ReactNode
}

export function Modal({ onClose, labelledBy, children }: ModalProps) {
  useEffect(() => {
    function aoPressionarTecla(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [onClose])

  // Precisa ser um portal pra document.body: se o Modal for usado dentro de um
  // <form> (ex.: formulário de edição de paciente), um <form> interno aqui
  // ficaria aninhado no de fora — HTML inválido, o navegador funde os dois e o
  // submit do modal acaba submetendo o formulário errado.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        {...(labelledBy ? { role: 'dialog', 'aria-modal': true, 'aria-labelledby': labelledBy } : {})}
        className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-md"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
