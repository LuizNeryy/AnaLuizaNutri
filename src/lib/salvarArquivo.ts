// Entrega um blob ao navegador como download, sem abrir nova aba (window.open depois de
// um await é barrado por bloqueadores de popup).
export function salvarArquivo(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Revogar na mesma tick pode cancelar o download no Safari
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
