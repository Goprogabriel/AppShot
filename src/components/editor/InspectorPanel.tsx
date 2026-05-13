import { AlignCenter, AlignLeft, AlignRight, Brush, Globe2, ImageIcon, MonitorSmartphone, RotateCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { APP_STORE_SIZES } from '../../config/appStoreSizes'
import { getFramesForDevice } from '../../config/devices'
import { FONT_LABELS, FONT_OPTIONS } from '../../config/fonts'
import { LAYOUT_TEMPLATES } from '../../config/templates'
import type { Background, DeviceStyle, GlobalStyle, ResolvedScreenshotSlide, ScreenshotProject, ScreenshotSlide, TextStyle } from '../../types/screenshot'
import { cloneBackground } from '../../utils/slideStyles'
import { Field, inputClass, textareaClass } from '../controls/Field'
import { UploadDropzone } from './UploadDropzone'

type SettingsTab = 'screenshot' | 'device' | 'style' | 'global'

interface InspectorPanelProps {
  project: ScreenshotProject
  slide: ScreenshotSlide
  resolvedSlide: ResolvedScreenshotSlide
  onUpdateSlide: (patch: Partial<ScreenshotSlide>) => void
  onApplyToAll: (kind: 'background' | 'font' | 'device' | 'layout') => void
  onUpdateGlobalStyle: (patch: Partial<GlobalStyle>) => void
  onUpdateGlobalTextStyle: (patch: Partial<TextStyle>) => void
  onUpdateGlobalDeviceStyle: (patch: Partial<DeviceStyle>) => void
  onApplyGlobalToAll: () => void
  onResetBackgroundToGlobal: () => void
  onResetDeviceToGlobal: () => void
  onSetExportSize: (sizeId: string) => void
}

export function InspectorPanel({
  project,
  slide,
  resolvedSlide,
  onUpdateSlide,
  onApplyToAll,
  onUpdateGlobalStyle,
  onUpdateGlobalTextStyle,
  onUpdateGlobalDeviceStyle,
  onApplyGlobalToAll,
  onResetBackgroundToGlobal,
  onResetDeviceToGlobal,
  onSetExportSize,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('screenshot')
  const frames = getFramesForDevice(project.deviceType)
  const sizes = APP_STORE_SIZES.filter((size) => size.deviceType === project.deviceType)

  function updateTextOverride(patch: Partial<TextStyle>) {
    onUpdateSlide({ textStyleOverride: { ...resolvedSlide.textStyle, ...(slide.textStyleOverride ?? {}), ...patch } })
  }

  function updateBackground(background: Background) {
    onUpdateSlide({ backgroundOverride: cloneBackground(background) })
  }

  function updateDeviceStyle(patch: Partial<DeviceStyle>) {
    onUpdateSlide({ deviceStyle: { ...resolvedSlide.deviceStyle, ...patch } })
  }

  return (
    <aside className="min-h-0 overflow-hidden border-l border-slate-200/80 bg-white">
      <div className="border-b border-slate-200/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Settings</h2>
            <p className="mt-1 text-sm font-semibold text-slate-950">Screenshot controls</p>
          </div>
          <div className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-500">{project.slides.length}/10</div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
          <TabButton icon={<ImageIcon className="h-4 w-4" />} label="Screenshot" active={activeTab === 'screenshot'} onClick={() => setActiveTab('screenshot')} />
          <TabButton icon={<MonitorSmartphone className="h-4 w-4" />} label="Device" active={activeTab === 'device'} onClick={() => setActiveTab('device')} />
          <TabButton icon={<Brush className="h-4 w-4" />} label="Style" active={activeTab === 'style'} onClick={() => setActiveTab('style')} />
          <TabButton icon={<Globe2 className="h-4 w-4" />} label="Global" active={activeTab === 'global'} onClick={() => setActiveTab('global')} />
        </div>
      </div>

      <div className="h-[calc(100vh-153px)] space-y-4 overflow-y-auto p-4">
        {activeTab === 'screenshot' ? (
          <>
            <PanelSection title="Uploaded image" hint="This file stays local in your browser.">
              <UploadDropzone imageName={slide.uploadedImageName} onUpload={(uploadedImage, uploadedImageName) => onUpdateSlide({ uploadedImage, uploadedImageName })} />
            </PanelSection>

            <PanelSection title="Copy" hint="Keep App Store screenshot copy short and benefit-led.">
              <Field label="Title">
                <textarea className={textareaClass} value={slide.title} onChange={(event) => onUpdateSlide({ title: event.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className={textareaClass} value={slide.description} onChange={(event) => onUpdateSlide({ description: event.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Toggle label="Title" checked={slide.showTitle} onChange={(showTitle) => onUpdateSlide({ showTitle })} />
                <Toggle label="Description" checked={slide.showDescription} onChange={(showDescription) => onUpdateSlide({ showDescription })} />
              </div>
            </PanelSection>

            <PanelSection title="Layout" hint="Layout can be per screenshot or inherited from the global default.">
              <Field label="Template">
                <select className={inputClass} value={resolvedSlide.layoutTemplate} onChange={(event) => onUpdateSlide({ layoutTemplate: event.target.value as ScreenshotSlide['layoutTemplate'] })}>
                  {LAYOUT_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Range label="Padding" min={40} max={180} value={resolvedSlide.padding} onChange={(padding) => onUpdateSlide({ padding })} />
                <Range label="Spacing" min={10} max={160} value={resolvedSlide.spacing} onChange={(spacing) => onUpdateSlide({ spacing })} />
              </div>
              <ActionButton onClick={() => onApplyToAll('layout')}>Apply this layout to all screenshots</ActionButton>
            </PanelSection>

            <BackgroundControls
              title="Screenshot background"
              hint={slide.backgroundOverride ? 'This screenshot has its own background override.' : 'Currently using the global background.'}
              background={resolvedSlide.background}
              onChange={updateBackground}
            />
            <div className="grid grid-cols-2 gap-2">
              <ActionButton onClick={() => onApplyToAll('background')}>Apply to all</ActionButton>
              <ActionButton onClick={onResetBackgroundToGlobal}>Use global</ActionButton>
            </div>
          </>
        ) : null}

        {activeTab === 'device' ? (
          <>
            <PanelSection title="Frame" hint="Choose a device frame or export the raw screen without hardware.">
              <Field label="Device frame">
                <select className={inputClass} value={resolvedSlide.deviceFrame} onChange={(event) => onUpdateSlide({ deviceFrame: event.target.value })}>
                  <option value="none">No device frame</option>
                  {frames.map((frame) => (
                    <option key={frame.id} value={frame.id}>
                      {frame.name}
                    </option>
                  ))}
                </select>
              </Field>
            </PanelSection>
            <DeviceControls
              title="Device position"
              deviceStyle={resolvedSlide.deviceStyle}
              onChange={updateDeviceStyle}
              onReset={onResetDeviceToGlobal}
              onApplyAll={() => onApplyToAll('device')}
            />
          </>
        ) : null}

        {activeTab === 'style' ? (
          <>
            <PanelSection title="Typography" hint="These text settings apply to the selected screenshot.">
              <TextStyleControls textStyle={resolvedSlide.textStyle} onChange={updateTextOverride} />
              <ActionButton onClick={() => onApplyToAll('font')}>Apply text style to all screenshots</ActionButton>
            </PanelSection>
          </>
        ) : null}

        {activeTab === 'global' ? (
          <>
            <PanelSection title="Export default">
              <Field label="App Store size">
                <select className={inputClass} value={project.exportSizeId} onChange={(event) => onSetExportSize(event.target.value)}>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </Field>
            </PanelSection>

            <BackgroundControls title="Global background" hint="Used by screenshots without a background override." background={project.globalStyle.background} onChange={(background) => onUpdateGlobalStyle({ background })} />

            <PanelSection title="Global typography">
              <TextStyleControls textStyle={project.globalStyle.textStyle} onChange={onUpdateGlobalTextStyle} />
            </PanelSection>

            <PanelSection title="Global device defaults">
              <Field label="Default frame">
                <select className={inputClass} value={project.globalStyle.deviceFrame} onChange={(event) => onUpdateGlobalStyle({ deviceFrame: event.target.value })}>
                  <option value="none">No device frame</option>
                  {frames.map((frame) => (
                    <option key={frame.id} value={frame.id}>
                      {frame.name}
                    </option>
                  ))}
                </select>
              </Field>
              <DeviceControls
                title="Default device style"
                deviceStyle={project.globalStyle.deviceStyle}
                onChange={onUpdateGlobalDeviceStyle}
                onReset={() => onUpdateGlobalDeviceStyle({ scale: project.deviceType === 'iphone' ? 0.78 : 0.72, x: 0, y: 0, rotation: 0 })}
              />
            </PanelSection>

            <PanelSection title="Global layout defaults">
              <Field label="Default template">
                <select className={inputClass} value={project.globalStyle.layoutTemplate} onChange={(event) => onUpdateGlobalStyle({ layoutTemplate: event.target.value as GlobalStyle['layoutTemplate'] })}>
                  {LAYOUT_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Range label="Padding" min={40} max={180} value={project.globalStyle.padding} onChange={(padding) => onUpdateGlobalStyle({ padding })} />
                <Range label="Spacing" min={10} max={160} value={project.globalStyle.spacing} onChange={(spacing) => onUpdateGlobalStyle({ spacing })} />
              </div>
              <Toggle
                label="Use global defaults for new screenshots"
                checked={project.globalStyle.useGlobalDefaultsForNewScreenshots}
                onChange={(useGlobalDefaultsForNewScreenshots) => onUpdateGlobalStyle({ useGlobalDefaultsForNewScreenshots })}
              />
            </PanelSection>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800" type="button" onClick={onApplyGlobalToAll}>
              <Globe2 className="h-4 w-4" />
              Apply global settings to all screenshots
            </button>
          </>
        ) : null}
      </div>
    </aside>
  )
}

function TabButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`grid h-10 place-items-center rounded-md transition ${active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'}`}
      type="button"
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

function PanelSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
        {hint ? <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p> : null}
      </div>
      {children}
    </section>
  )
}

function BackgroundControls({ title, hint, background, onChange }: { title: string; hint?: string; background: Background; onChange: (background: Background) => void }) {
  return (
    <PanelSection title={title} hint={hint}>
      <Field label="Background type">
        <select
          className={inputClass}
          value={background.type}
          onChange={(event) =>
            onChange(
              event.target.value === 'gradient'
                ? { type: 'gradient', color: background.color, gradientFrom: background.gradientFrom ?? '#101828', gradientTo: background.gradientTo ?? '#2563eb' }
                : { type: 'solid', color: background.color },
            )
          }
        >
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
        </select>
      </Field>
      {background.type === 'solid' ? (
        <ColorField label="Color" value={background.color} onChange={(color) => onChange({ ...background, color })} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="From" value={background.gradientFrom} onChange={(gradientFrom) => onChange({ ...background, gradientFrom })} />
          <ColorField label="To" value={background.gradientTo} onChange={(gradientTo) => onChange({ ...background, gradientTo })} />
        </div>
      )}
    </PanelSection>
  )
}

function TextStyleControls({ textStyle, onChange }: { textStyle: TextStyle; onChange: (patch: Partial<TextStyle>) => void }) {
  return (
    <>
      <Field label="Font">
        <select className={inputClass} value={textStyle.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })}>
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {FONT_LABELS[font]}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Text color" value={textStyle.color} onChange={(color) => onChange({ color })} />
        <Field label="Weight">
          <select className={inputClass} value={textStyle.weight} onChange={(event) => onChange({ weight: event.target.value })}>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="800">Extra bold</option>
            <option value="900">Black</option>
          </select>
        </Field>
      </div>
      <SegmentedAlignment value={textStyle.align} onChange={(align) => onChange({ align })} />
      <div className="grid grid-cols-2 gap-3">
        <Range label="Title size" min={44} max={140} value={textStyle.titleSize} onChange={(titleSize) => onChange({ titleSize })} />
        <Range label="Subtitle size" min={22} max={72} value={textStyle.descriptionSize} onChange={(descriptionSize) => onChange({ descriptionSize })} />
        <Range label="Text X" min={-40} max={40} value={textStyle.x} onChange={(x) => onChange({ x })} />
        <Range label="Text Y" min={-40} max={40} value={textStyle.y} onChange={(y) => onChange({ y })} />
      </div>
    </>
  )
}

function DeviceControls({
  title,
  deviceStyle,
  onChange,
  onReset,
  onApplyAll,
}: {
  title: string
  deviceStyle: DeviceStyle
  onChange: (patch: Partial<DeviceStyle>) => void
  onReset: () => void
  onApplyAll?: () => void
}) {
  return (
    <PanelSection title={title} hint="Fine tune the hardware position without changing the uploaded screen.">
      <div className="grid grid-cols-2 gap-3">
        <Range label="Scale" min={45} max={120} value={Math.round(deviceStyle.scale * 100)} onChange={(scale) => onChange({ scale: scale / 100 })} />
        <Range label="Rotation" min={-18} max={18} value={deviceStyle.rotation} onChange={(rotation) => onChange({ rotation })} />
        <Range label="Position X" min={-50} max={50} value={deviceStyle.x} onChange={(x) => onChange({ x })} />
        <Range label="Position Y" min={-50} max={50} value={deviceStyle.y} onChange={(y) => onChange({ y })} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ['Straight', 0],
          ['Left', -5],
          ['Right', 5],
        ].map(([label, value]) => (
          <button
            key={label}
            className={`h-9 rounded-md text-xs font-black transition ${deviceStyle.rotation === value ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            type="button"
            onClick={() => onChange({ rotation: Number(value) })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ActionButton onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </ActionButton>
        {onApplyAll ? <ActionButton onClick={onApplyAll}>Apply to all</ActionButton> : null}
      </div>
    </PanelSection>
  )
}

function SegmentedAlignment({ value, onChange }: { value: TextStyle['align']; onChange: (value: TextStyle['align']) => void }) {
  const items = [
    { value: 'left' as const, icon: <AlignLeft className="h-4 w-4" /> },
    { value: 'center' as const, icon: <AlignCenter className="h-4 w-4" /> },
    { value: 'right' as const, icon: <AlignRight className="h-4 w-4" /> },
  ]

  return (
    <Field label="Alignment">
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
        {items.map((item) => (
          <button
            key={item.value}
            className={`grid h-9 place-items-center rounded-md transition ${value === item.value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-white/60'}`}
            type="button"
            onClick={() => onChange(item.value)}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </Field>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      className={`min-h-10 rounded-md px-3 text-sm font-bold transition ${checked ? 'bg-slate-950 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      type="button"
      onClick={() => onChange(!checked)}
    >
      {label}
    </button>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
        <input className="h-6 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </Field>
  )
}

function Range({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (value: number) => void }) {
  return (
    <Field label={`${label}: ${value}`}>
      <input className="h-2 cursor-pointer accent-slate-950" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </Field>
  )
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200" type="button" onClick={onClick}>
      {children}
    </button>
  )
}
