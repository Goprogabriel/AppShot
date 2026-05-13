import { Maximize2 } from 'lucide-react'
import { getSizeById } from '../../config/appStoreSizes'
import type { ResolvedScreenshotSlide, ScreenshotProject, ScreenshotSlide } from '../../types/screenshot'
import { ScreenshotCanvas } from '../screenshot-card/ScreenshotCanvas'

interface ScreenshotPreviewProps {
  project: ScreenshotProject
  slide: ScreenshotSlide
  resolvedSlide: ResolvedScreenshotSlide
  index: number
}

export function ScreenshotPreview({ project, slide, resolvedSlide, index }: ScreenshotPreviewProps) {
  const size = getSizeById(project.exportSizeId)
  const fitWidth = `min(560px, calc((100vh - 190px) * ${size.width / size.height}))`

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl items-center justify-center px-4 py-8">
      <div className="w-full" style={{ maxWidth: fitWidth }}>
        <div className="mb-4 rounded-lg border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Editing screenshot {index + 1}</div>
            <div className="mt-1 truncate text-sm font-bold text-slate-950">{resolvedSlide.title || 'Untitled screenshot'}</div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
            <Maximize2 className="h-3.5 w-3.5" />
            {size.width} x {size.height}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <ScreenshotCanvas project={project} slide={slide} width={size.width} height={size.height} />
        </div>
      </div>
    </div>
  )
}
