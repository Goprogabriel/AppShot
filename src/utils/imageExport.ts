import { toBlob } from 'html-to-image'
import JSZip from 'jszip'
import { getSizeById } from '../config/appStoreSizes'
import type { ScreenshotProject, ScreenshotSlide } from '../types/screenshot'
import { downloadBlob, padNumber } from './fileHelpers'

const EXPORT_NODE_ID = 'appshot-export-stage'

function ensureExportStage() {
  let stage = document.getElementById(EXPORT_NODE_ID)

  if (!stage) {
    stage = document.createElement('div')
    stage.id = EXPORT_NODE_ID
    stage.style.position = 'fixed'
    stage.style.left = '-100000px'
    stage.style.top = '0'
    stage.style.zIndex = '-1'
    document.body.appendChild(stage)
  }

  return stage
}

export async function exportNodeToPng(node: HTMLElement, filename: string) {
  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 1,
    backgroundColor: 'transparent',
  })

  if (!blob) throw new Error('Could not export screenshot.')
  downloadBlob(blob, filename)
}

export async function exportSlidesAsZip(
  project: ScreenshotProject,
  renderSlide: (slide: ScreenshotSlide, index: number, size: { width: number; height: number }) => HTMLElement,
) {
  const size = getSizeById(project.exportSizeId)
  const stage = ensureExportStage()
  const zip = new JSZip()

  for (const [index, slide] of project.slides.entries()) {
    stage.replaceChildren(renderSlide(slide, index, size))
    const target = stage.firstElementChild as HTMLElement | null
    if (!target) continue

    const blob = await toBlob(target, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: 'transparent',
    })

    if (blob) {
      zip.file(`${project.deviceType}-screenshot-${padNumber(index + 1)}.png`, blob)
    }
  }

  stage.replaceChildren()
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(zipBlob, `${project.deviceType}-app-store-screenshots.zip`)
}
