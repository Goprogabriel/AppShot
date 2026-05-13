import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../controls/Button'
import { ScreenshotThumbnail } from '../screenshot-card/ScreenshotThumbnail'
import type { ScreenshotProject } from '../../types/screenshot'

interface ScreenshotListProps {
  project: ScreenshotProject
  canAddMore: boolean
  onSelect: (id: string) => void
  onAdd: () => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: -1 | 1) => void
}

export function ScreenshotList({ project, canAddMore, onSelect, onAdd, onDuplicate, onRemove, onMove }: ScreenshotListProps) {
  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="border-b border-slate-200/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Screenshots</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">{project.slides.length} of 10 App Store slots</p>
          </div>
          <Button size="sm" variant="primary" disabled={!canAddMore} onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {project.slides.map((slide, index) => (
          <div key={slide.id} className="rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm">
            <ScreenshotThumbnail project={project} slide={slide} selected={project.selectedId === slide.id} index={index} onSelect={() => onSelect(slide.id)} />
            <div className="mt-2 flex items-center justify-end gap-1 border-t border-slate-100 pt-2">
              <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(slide.id, -1)}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Move down" disabled={index === project.slides.length - 1} onClick={() => onMove(slide.id, 1)}>
                <ArrowDown className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Duplicate" disabled={!canAddMore} onClick={() => onDuplicate(slide.id)}>
                <Copy className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Delete" disabled={project.slides.length === 1} onClick={() => onRemove(slide.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function IconButton({ label, children, disabled, onClick }: { label: string; children: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
