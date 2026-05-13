import { Check, MousePointer2 } from 'lucide-react'
import { getSizeById } from '../../config/appStoreSizes'
import type { ScreenshotProject } from '../../types/screenshot'
import { classNames } from '../../utils/fileHelpers'
import { resolveSlideStyle } from '../../utils/slideStyles'
import { ScreenshotCanvas } from '../screenshot-card/ScreenshotCanvas'

interface PreviewGalleryProps {
  project: ScreenshotProject
  onSelect: (id: string) => void
  onEditSelected: () => void
}

export function PreviewGallery({ project, onSelect, onEditSelected }: PreviewGalleryProps) {
  const size = getSizeById(project.exportSizeId)

  return (
    <div className="mx-auto flex min-h-full max-w-[1500px] flex-col gap-5 px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-950">Final screenshot gallery</h2>
          <p className="mt-1 text-sm text-slate-500">Click any preview to select it, then jump back into the detailed editor.</p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          type="button"
          onClick={onEditSelected}
        >
          <MousePointer2 className="h-4 w-4" />
          Edit selected screenshot
        </button>
      </div>

      <div className="grid flex-1 auto-rows-max grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-5 xl:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {project.slides.map((slide, index) => {
          const selected = project.selectedId === slide.id
          const resolved = resolveSlideStyle(project, slide)

          return (
            <button key={slide.id} className="group text-left" type="button" onClick={() => onSelect(slide.id)}>
              <div
                className={classNames(
                  'relative rounded-2xl border bg-white p-2 shadow-sm transition duration-200',
                  selected
                    ? 'border-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-4 ring-slate-950/10'
                    : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
                )}
              >
                <ScreenshotCanvas project={project} slide={slide} width={size.width} height={size.height} />
                {selected ? (
                  <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-slate-950 text-white shadow-lg">
                    <Check className="h-4 w-4" />
                  </div>
                ) : null}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3 px-1">
                <div className="min-w-0">
                  <div className="text-sm font-black text-slate-950">Screenshot {index + 1}</div>
                  <div className="mt-0.5 truncate text-xs font-medium text-slate-500">{resolved.title || 'Untitled'}</div>
                </div>
                <div className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">{size.width} x {size.height}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
