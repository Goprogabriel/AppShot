import { Check } from 'lucide-react'
import { getSizeById } from '../../config/appStoreSizes'
import type { ScreenshotProject, ScreenshotSlide } from '../../types/screenshot'
import { classNames } from '../../utils/fileHelpers'
import { ScreenshotCanvas } from './ScreenshotCanvas'

interface ScreenshotThumbnailProps {
  project: ScreenshotProject
  slide: ScreenshotSlide
  selected: boolean
  index: number
  onSelect: () => void
}

export function ScreenshotThumbnail({ project, slide, selected, index, onSelect }: ScreenshotThumbnailProps) {
  const size = getSizeById(project.exportSizeId)

  return (
    <button
      className={classNames(
        'group grid w-full grid-cols-[64px_1fr_auto] items-center gap-3 rounded-lg p-2 text-left transition',
        selected ? 'bg-slate-950 text-white shadow-sm' : 'hover:bg-slate-50',
      )}
      type="button"
      onClick={onSelect}
    >
      <div className="overflow-hidden rounded-md bg-slate-200 ring-1 ring-black/5">
        <ScreenshotCanvas project={project} slide={slide} width={size.width} height={size.height} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-black">Screenshot {index + 1}</div>
        <div className={classNames('truncate text-xs', selected ? 'text-slate-300' : 'text-slate-500')}>{slide.title || 'Untitled'}</div>
      </div>
      {selected ? <Check className="h-4 w-4" /> : null}
    </button>
  )
}
