import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function saveCard() {
  const card = document.querySelector<HTMLElement>('#card')
  if (!card) return

  const hideTargets = document.querySelectorAll<HTMLElement>('.hide-at-pdf')
  hideTargets.forEach(el => el.classList.add('pdf-hide'))

  if (document.fonts?.ready) await document.fonts.ready

  const canvas = await html2canvas(card, {
    backgroundColor: '#242424',
    scale: Math.min(2, window.devicePixelRatio || 1),
    useCORS: true,
  })

  hideTargets.forEach(el => el.classList.remove('pdf-hide'))

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [100, 148] })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  const margin = 1
  const maxW = pageW - margin * 2
  const maxH = pageH - margin * 2

  const imgW = canvas.width
  const imgH = canvas.height
  const ratio = Math.min(maxW / (imgW * 0.264583), maxH / (imgH * 0.264583))
  const renderW = imgW * 0.264583 * ratio
  const renderH = imgH * 0.264583 * ratio //96dpi

  const x = (pageW - renderW) / 2
  const y = (pageH - renderH) / 2

  pdf.addImage(imgData, 'PNG', x, y, renderW, renderH)
  pdf.save('selected-greetings-2026.pdf')
}
