// Stitches the offscreen 1366x768 slide pages (PrintView) into one PDF and downloads it.
// Libraries load on demand so they never weigh down the deck.
export async function exportPdf(onProgress: (n: number) => void) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  await document.fonts.ready
  await new Promise(r => setTimeout(r, 400)) // let the offscreen pages lay out
  const pages = Array.from(document.querySelectorAll<HTMLElement>('.print-page'))
  const W = 1366, H = 768
  const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H], hotfixes: ['px_scaling'], compress: true })
  for (let i = 0; i < pages.length; i++) {
    onProgress(i + 1)
    const img = await toJpeg(pages[i], { width: W, height: H, pixelRatio: 2, quality: 0.9, backgroundColor: '#ffffff' })
    if (i > 0) doc.addPage([W, H], 'landscape')
    doc.addImage(img, 'JPEG', 0, 0, W, H)
  }
  doc.save('Prism - Ritik Raj.pdf')
}
