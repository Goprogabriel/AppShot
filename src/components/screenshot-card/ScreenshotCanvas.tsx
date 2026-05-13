import { DeviceFrame } from '../device-frames/DeviceFrame'
import type { ResolvedScreenshotSlide, ScreenshotProject, ScreenshotSlide } from '../../types/screenshot'
import { backgroundToCss } from '../../utils/canvasHelpers'
import { classNames } from '../../utils/fileHelpers'
import { resolveSlideStyle } from '../../utils/slideStyles'

interface ScreenshotCanvasProps {
  project: ScreenshotProject
  slide: ScreenshotSlide
  width: number
  height: number
  preview?: boolean
  exportMode?: boolean
}

function cqw(value: number, canvasWidth: number) {
  return `${(value / canvasWidth) * 100}cqw`
}

export function ScreenshotCanvas({ project, slide, width, height, preview = true, exportMode = false }: ScreenshotCanvasProps) {
  const resolvedSlide = resolveSlideStyle(project, slide)
  const canvasStyle = {
    width: preview ? '100%' : width,
    height: preview ? 'auto' : height,
    aspectRatio: `${width} / ${height}`,
    background: backgroundToCss(resolvedSlide.background),
    containerType: 'inline-size' as const,
  }

  if (resolvedSlide.layoutTemplate === 'full-bleed') {
    return (
      <div className="relative overflow-hidden" data-export-canvas style={canvasStyle}>
        {resolvedSlide.uploadedImage ? (
          <img className="absolute inset-0 h-full w-full object-cover" src={resolvedSlide.uploadedImage} alt="" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">Upload an image</div>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden" data-export-canvas style={canvasStyle}>
      <div
        className={classNames(
          'absolute inset-0 flex',
          resolvedSlide.layoutTemplate === 'text-left' && 'flex-row items-center justify-between',
          resolvedSlide.layoutTemplate === 'device-left' && 'flex-row-reverse items-center justify-between',
          resolvedSlide.layoutTemplate === 'device-top' && 'flex-col-reverse items-center justify-between',
          resolvedSlide.layoutTemplate === 'text-top' && 'flex-col items-center justify-between',
          resolvedSlide.layoutTemplate === 'minimal' && 'flex-col items-center justify-center',
          resolvedSlide.layoutTemplate === 'overlay' && 'items-center justify-center',
        )}
        style={{
          padding: cqw(resolvedSlide.padding, width),
          gap: cqw(resolvedSlide.spacing, width),
        }}
      >
        {resolvedSlide.layoutTemplate !== 'overlay' ? <TextBlock slide={resolvedSlide} canvasWidth={width} /> : null}
        <DeviceBlock slide={resolvedSlide} canvasWidth={width} exportMode={exportMode} />
      </div>

      {resolvedSlide.layoutTemplate === 'overlay' ? (
        <div
          className="absolute inset-x-0 top-0 z-10"
          style={{
            padding: cqw(resolvedSlide.padding, width),
            transform: `translate(${resolvedSlide.textStyle.x}%, ${resolvedSlide.textStyle.y}%)`,
          }}
        >
          <TextBlock slide={resolvedSlide} canvasWidth={width} overlay />
        </div>
      ) : null}
    </div>
  )
}

function TextBlock({ slide, canvasWidth, overlay = false }: { slide: ResolvedScreenshotSlide; canvasWidth: number; overlay?: boolean }) {
  const hasText = slide.showTitle || slide.showDescription
  if (!hasText) return <div className="min-h-0 flex-1" />

  return (
    <div
      className={classNames('relative z-10 max-w-[88%] shrink-0', overlay ? 'mx-auto' : 'flex-1')}
      style={{
        color: slide.textStyle.color,
        fontFamily: slide.textStyle.fontFamily,
        textAlign: slide.textStyle.align,
        transform: `translate(${slide.textStyle.x}%, ${slide.textStyle.y}%)`,
      }}
    >
      {slide.showTitle ? (
        <h2
          className="m-0 leading-[1.02]"
          style={{
            fontSize: cqw(slide.textStyle.titleSize, canvasWidth),
            fontWeight: slide.textStyle.weight,
          }}
        >
          {slide.title}
        </h2>
      ) : null}
      {slide.showDescription ? (
        <p
          className="mx-auto mt-7 max-w-[820px] leading-[1.25] opacity-90"
          style={{
            marginTop: cqw(28, canvasWidth),
            maxWidth: cqw(820, canvasWidth),
            fontSize: cqw(slide.textStyle.descriptionSize, canvasWidth),
            fontWeight: 500,
          }}
        >
          {slide.description}
        </p>
      ) : null}
    </div>
  )
}

function DeviceBlock({ slide, canvasWidth, exportMode }: { slide: ResolvedScreenshotSlide; canvasWidth: number; exportMode?: boolean }) {
  const isSideLayout = slide.layoutTemplate === 'text-left' || slide.layoutTemplate === 'device-left'
  const isMinimal = slide.layoutTemplate === 'minimal'
  const deviceWidth = slide.deviceType === 'ipad' ? (isSideLayout ? '48%' : isMinimal ? '68%' : '72%') : isSideLayout ? '42%' : isMinimal ? '58%' : '64%'

  return (
    <div
      className="relative z-0 shrink-0"
      style={{
        width: deviceWidth,
        transform: `translate(${slide.deviceStyle.x}%, ${slide.deviceStyle.y}%) rotate(${slide.deviceStyle.rotation}deg) scale(${slide.deviceStyle.scale})`,
        transformOrigin: 'center',
      }}
    >
      <DeviceFrame slide={slide} canvasWidth={canvasWidth} exportMode={exportMode} />
    </div>
  )
}
