import { ArrowLeft, Eye, LayoutDashboard, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../components/controls/Button'
import { InspectorPanel } from '../components/editor/InspectorPanel'
import { PreviewGallery } from '../components/editor/PreviewGallery'
import { ScreenshotList } from '../components/editor/ScreenshotList'
import { ScreenshotPreview } from '../components/editor/ScreenshotPreview'
import { ExportPanel } from '../components/export/ExportPanel'
import { getSizeById } from '../config/appStoreSizes'
import { useImageExport } from '../hooks/useImageExport'
import type { DeviceStyle, GlobalStyle, ResolvedScreenshotSlide, ScreenshotProject, ScreenshotSlide } from '../types/screenshot'

interface EditorPageProps {
  project: ScreenshotProject
  selectedSlide: ScreenshotSlide
  selectedResolvedSlide: ResolvedScreenshotSlide
  canAddMore: boolean
  onBackToLanding: () => void
  onReset: () => void
  onUpdateProject: (updater: (project: ScreenshotProject) => ScreenshotProject) => void
  onUpdateSelectedSlide: (patch: Partial<ScreenshotSlide>) => void
  onAddSlide: (copyFromId?: string) => void
  onRemoveSlide: (id: string) => void
  onMoveSlide: (id: string, direction: -1 | 1) => void
  onApplyToAll: (sourceId: string, kind: 'background' | 'font' | 'device' | 'layout') => void
  onUpdateGlobalStyle: (patch: Partial<GlobalStyle>) => void
  onUpdateGlobalTextStyle: (patch: Partial<GlobalStyle['textStyle']>) => void
  onUpdateGlobalDeviceStyle: (patch: Partial<DeviceStyle>) => void
  onApplyGlobalToAll: () => void
  onResetSelectedBackgroundToGlobal: () => void
  onResetSelectedDeviceToGlobal: () => void
  onSetExportSize: (sizeId: string) => void
}

export function EditorPage({
  project,
  selectedSlide,
  selectedResolvedSlide,
  canAddMore,
  onBackToLanding,
  onReset,
  onUpdateProject,
  onUpdateSelectedSlide,
  onAddSlide,
  onRemoveSlide,
  onMoveSlide,
  onApplyToAll,
  onUpdateGlobalStyle,
  onUpdateGlobalTextStyle,
  onUpdateGlobalDeviceStyle,
  onApplyGlobalToAll,
  onResetSelectedBackgroundToGlobal,
  onResetSelectedDeviceToGlobal,
  onSetExportSize,
}: EditorPageProps) {
  const [showGrid, setShowGrid] = useState(false)
  const { isExporting, exportError, downloadSingle, downloadAllSeparate, downloadZip } = useImageExport(project)
  const size = getSizeById(project.exportSizeId)
  const selectedIndex = useMemo(() => project.slides.findIndex((slide) => slide.id === selectedSlide.id), [project.slides, selectedSlide.id])
  const handleReset = () => {
    if (window.confirm('Reset this project and remove the saved browser draft?')) {
      onReset()
    }
  }

  return (
    <main className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-[#f4f6fb] text-slate-950">
      <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={onBackToLanding}>
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2 text-sm font-black capitalize">
              <LayoutDashboard className="h-4 w-4 text-slate-500" />
              {project.deviceType} App Store screenshots
            </div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">
              {size.width} x {size.height}px
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowGrid(!showGrid)}>
            <Eye className="h-4 w-4" />
            {showGrid ? 'Back to editor' : 'Preview all'}
          </Button>
          <ExportPanel
            isExporting={isExporting}
            error={exportError}
            onDownloadCurrent={() => void downloadSingle(selectedSlide, Math.max(selectedIndex, 0))}
            onDownloadAll={() => void downloadAllSeparate()}
            onDownloadZip={() => void downloadZip()}
          />
          <Button size="sm" variant="danger" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      <div className={showGrid ? 'grid min-h-0 grid-cols-[300px_minmax(0,1fr)] max-xl:grid-cols-[260px_minmax(0,1fr)]' : 'grid min-h-0 grid-cols-[300px_minmax(0,1fr)_400px] max-xl:grid-cols-[260px_minmax(0,1fr)] max-xl:[&>aside:last-child]:hidden'}>
        <ScreenshotList
          project={project}
          canAddMore={canAddMore}
          onSelect={(selectedId) => onUpdateProject((current) => ({ ...current, selectedId }))}
          onAdd={() => onAddSlide()}
          onDuplicate={(id) => onAddSlide(id)}
          onRemove={onRemoveSlide}
          onMove={onMoveSlide}
        />

        <section className="min-h-0 overflow-y-auto bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,transparent_34%),linear-gradient(135deg,#f8fafc,#eef2f7)]">
          {showGrid ? (
            <PreviewGallery
              project={project}
              onSelect={(selectedId) => onUpdateProject((current) => ({ ...current, selectedId }))}
              onEditSelected={() => setShowGrid(false)}
            />
          ) : (
            <ScreenshotPreview project={project} slide={selectedSlide} resolvedSlide={selectedResolvedSlide} index={selectedIndex} />
          )}
        </section>

        {!showGrid ? (
          <InspectorPanel
            project={project}
            slide={selectedSlide}
            resolvedSlide={selectedResolvedSlide}
            onUpdateSlide={onUpdateSelectedSlide}
            onApplyToAll={(kind) => onApplyToAll(selectedSlide.id, kind)}
            onUpdateGlobalStyle={onUpdateGlobalStyle}
            onUpdateGlobalTextStyle={onUpdateGlobalTextStyle}
            onUpdateGlobalDeviceStyle={onUpdateGlobalDeviceStyle}
            onApplyGlobalToAll={onApplyGlobalToAll}
            onResetBackgroundToGlobal={onResetSelectedBackgroundToGlobal}
            onResetDeviceToGlobal={onResetSelectedDeviceToGlobal}
            onSetExportSize={onSetExportSize}
          />
        ) : null}
      </div>
    </main>
  )
}
