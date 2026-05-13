import { useRef, useState } from 'react'
import { ImageUp } from 'lucide-react'
import { readImageFile } from '../../utils/fileHelpers'

interface UploadDropzoneProps {
  imageName?: string
  onUpload: (dataUrl: string, fileName: string) => void
}

export function UploadDropzone({ imageName, onUpload }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    setError(null)
    try {
      const dataUrl = await readImageFile(file)
      onUpload(dataUrl, file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not use that file.')
    }
  }

  return (
    <div>
      <button
        className={`group flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center transition ${
          isDragging ? 'border-slate-900 bg-slate-100 ring-4 ring-slate-200' : 'border-slate-300 bg-gradient-to-br from-white to-slate-50 hover:border-slate-400 hover:bg-slate-100'
        }`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          void handleFile(event.dataTransfer.files[0])
        }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition group-hover:scale-105">
          <ImageUp className="h-5 w-5" />
        </span>
        <span className="text-sm font-black text-slate-900">{imageName ?? 'Drop or choose an app screenshot'}</span>
        <span className="max-w-[220px] text-xs leading-5 text-slate-500">PNG, JPG, or WebP. Nothing is uploaded to a server.</span>
      </button>
      <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={(event) => void handleFile(event.target.files?.[0])} />
      {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  )
}
