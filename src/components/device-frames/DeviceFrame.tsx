import { ImageIcon } from 'lucide-react'
import { getFrameById } from '../../config/devices'
import type { ResolvedScreenshotSlide } from '../../types/screenshot'
import { classNames } from '../../utils/fileHelpers'

interface DeviceFrameProps {
  slide: ResolvedScreenshotSlide
  canvasWidth: number
  exportMode?: boolean
}

function cqw(value: number, canvasWidth: number) {
  return `${(value / canvasWidth) * 100}cqw`
}

export function DeviceFrame({ slide, canvasWidth, exportMode = false }: DeviceFrameProps) {
  if (slide.deviceFrame === 'none') {
    return <BareScreenshot slide={slide} canvasWidth={canvasWidth} exportMode={exportMode} />
  }

  const frame = getFrameById(slide.deviceFrame)

  if (!frame) {
    return <BareScreenshot slide={slide} canvasWidth={canvasWidth} exportMode={exportMode} />
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: `${frame.aspectRatio}`,
        borderRadius: cqw(frame.radius, canvasWidth),
        padding: cqw(frame.bezel, canvasWidth),
        background: `linear-gradient(145deg, ${frame.accent ?? '#1f2937'} 0%, ${frame.accentDark ?? '#0f172a'} 52%, #05070b 100%)`,
        border: `${cqw(frame.rim ?? 4, canvasWidth)} solid rgba(255,255,255,0.24)`,
        boxShadow: exportMode
          ? '0 55px 120px rgba(15, 23, 42, 0.30), inset 0 1px 0 rgba(255,255,255,0.35)'
          : '0 34px 78px rgba(15, 23, 42, 0.26), inset 0 1px 0 rgba(255,255,255,0.35)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/35 via-transparent to-black/35" />
      <div
        className="relative h-full w-full overflow-hidden bg-slate-100 ring-1 ring-black/20"
        style={{
          borderRadius: cqw(frame.screenRadius, canvasWidth),
        }}
      >
        <ScreenshotImage slide={slide} />
      </div>
      {slide.deviceType === 'iphone' ? (
        <>
          <div className="absolute left-1/2 top-[2.8%] h-[3.8%] w-[31%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.18)]" />
          <div className="absolute right-[28%] top-[4.1%] h-[1.1%] w-[1.1%] rounded-full bg-slate-700" />
          <div className="absolute -left-[1.8%] top-[18%] h-[8%] w-[1.3%] rounded-l bg-slate-950/70" />
          <div className="absolute -right-[1.8%] top-[24%] h-[12%] w-[1.3%] rounded-r bg-slate-950/70" />
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-[2%] h-[1.2%] w-[1.2%] -translate-x-1/2 rounded-full bg-slate-950/70 ring-2 ring-white/15" />
          <div className="absolute left-1/2 bottom-[2.1%] h-[1.2%] w-[7%] -translate-x-1/2 rounded-full bg-black/25" />
        </>
      )}
    </div>
  )
}

function BareScreenshot({ slide, canvasWidth, exportMode }: DeviceFrameProps) {
  return (
    <div
      className={classNames('overflow-hidden bg-slate-100 shadow-2xl', slide.layoutTemplate === 'full-bleed' && 'shadow-none')}
      style={{
        aspectRatio: slide.deviceType === 'ipad' ? '1024 / 1366' : '390 / 844',
        borderRadius: slide.layoutTemplate === 'full-bleed' ? 0 : cqw(slide.borderRadius, canvasWidth),
        boxShadow: exportMode || slide.layoutTemplate === 'full-bleed' ? undefined : '0 35px 90px rgba(15, 23, 42, 0.22)',
      }}
    >
      <ScreenshotImage slide={slide} />
    </div>
  )
}

function ScreenshotImage({ slide }: { slide: ResolvedScreenshotSlide }) {
  if (!slide.uploadedImage) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center text-slate-500">
        <ImageIcon className="h-14 w-14" strokeWidth={1.5} />
        <div>
          <div className="text-xl font-bold text-slate-700">Upload app screen</div>
          <div className="mt-2 text-sm">Your image stays in this browser.</div>
        </div>
      </div>
    )
  }

  return <img className="h-full w-full object-cover" src={slide.uploadedImage} alt={slide.uploadedImageName ?? 'Uploaded app screenshot'} />
}
