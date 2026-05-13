import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { toBlob } from 'html-to-image'
import JSZip from 'jszip'
import { ScreenshotCanvas } from '../components/screenshot-card/ScreenshotCanvas'
import { getSizeById } from '../config/appStoreSizes'
import type { ScreenshotProject, ScreenshotSlide } from '../types/screenshot'
import { downloadBlob, padNumber } from '../utils/fileHelpers'

function waitForRender() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

async function renderSlideToBlob(project: ScreenshotProject, slide: ScreenshotSlide) {
  const size = getSizeById(project.exportSizeId)
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-100000px'
  host.style.top = '0'
  host.style.width = `${size.width}px`
  host.style.height = `${size.height}px`
  document.body.appendChild(host)

  const root = createRoot(host)
  root.render(<ScreenshotCanvas project={project} slide={slide} width={size.width} height={size.height} preview={false} exportMode />)
  await waitForRender()

  const node = host.querySelector('[data-export-canvas]') as HTMLElement | null
  if (!node) throw new Error('Could not prepare export canvas.')

  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 1,
    backgroundColor: 'transparent',
  })

  root.unmount()
  host.remove()

  if (!blob) throw new Error('Could not export screenshot.')
  return blob
}

export function useImageExport(project: ScreenshotProject | null) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function withExport(task: () => Promise<void>) {
    if (!project) return
    setIsExporting(true)
    setError(null)
    try {
      await task()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.')
    } finally {
      setIsExporting(false)
    }
  }

  function filename(index: number) {
    return `${project?.deviceType ?? 'app'}-screenshot-${padNumber(index + 1)}.png`
  }

  function downloadSingle(slide: ScreenshotSlide, index: number) {
    return withExport(async () => {
      if (!project) return
      const blob = await renderSlideToBlob(project, slide)
      downloadBlob(blob, filename(index))
    })
  }

  function downloadAllSeparate() {
    return withExport(async () => {
      if (!project) return
      for (const [index, slide] of project.slides.entries()) {
        const blob = await renderSlideToBlob(project, slide)
        downloadBlob(blob, filename(index))
      }
    })
  }

  function downloadZip() {
    return withExport(async () => {
      if (!project) return
      const zip = new JSZip()
      for (const [index, slide] of project.slides.entries()) {
        const blob = await renderSlideToBlob(project, slide)
        zip.file(filename(index), blob)
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      downloadBlob(zipBlob, `${project.deviceType}-app-store-screenshots.zip`)
    })
  }

  return {
    isExporting,
    exportError: error,
    downloadSingle,
    downloadAllSeparate,
    downloadZip,
  }
}
