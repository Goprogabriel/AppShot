import { Download, FileArchive, Images } from 'lucide-react'
import { Button } from '../controls/Button'

interface ExportPanelProps {
  isExporting: boolean
  error: string | null
  onDownloadCurrent: () => void
  onDownloadAll: () => void
  onDownloadZip: () => void
}

export function ExportPanel({ isExporting, error, onDownloadCurrent, onDownloadAll, onDownloadZip }: ExportPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" disabled={isExporting} onClick={onDownloadCurrent}>
        <Download className="h-4 w-4" />
        Current PNG
      </Button>
      <Button size="sm" variant="secondary" disabled={isExporting} onClick={onDownloadAll}>
        <Images className="h-4 w-4" />
        All PNGs
      </Button>
      <Button size="sm" variant="primary" disabled={isExporting} onClick={onDownloadZip}>
        <FileArchive className="h-4 w-4" />
        ZIP
      </Button>
      {isExporting ? <span className="text-xs font-semibold text-slate-500">Exporting...</span> : null}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </div>
  )
}
