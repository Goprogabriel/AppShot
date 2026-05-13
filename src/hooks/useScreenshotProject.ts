import { useEffect, useMemo, useState } from 'react'
import { getDefaultSizeId } from '../config/appStoreSizes'
import { getDefaultDeviceStyle, getDefaultGlobalStyle, PREMIUM_BACKGROUNDS } from '../config/defaultStyles'
import type { DeviceType } from '../types/device'
import type { DeviceStyle, GlobalStyle, ScreenshotProject, ScreenshotSlide } from '../types/screenshot'
import { cloneBackground, resolveSlideStyle } from '../utils/slideStyles'

export const PROJECT_STORAGE_KEY = 'appshot-project-v1'
const MAX_SCREENSHOTS = 10

function uid() {
  return crypto.randomUUID?.() ?? `slide-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createSlide(deviceType: DeviceType, index: number, globalStyle = getDefaultGlobalStyle(deviceType)): ScreenshotSlide {
  const variedBackground = PREMIUM_BACKGROUNDS[index % PREMIUM_BACKGROUNDS.length]
  const useGlobalDefaults = globalStyle.useGlobalDefaultsForNewScreenshots

  return {
    id: uid(),
    title: index === 0 ? 'Show your app at its best' : `Feature highlight ${index + 1}`,
    description: index === 0 ? 'Turn raw app screenshots into polished App Store visuals.' : 'Add a concise benefit-driven line for this screen.',
    showTitle: true,
    showDescription: true,
    uploadedImage: null,
    deviceType,
    deviceFrame: useGlobalDefaults ? null : globalStyle.deviceFrame,
    layoutTemplate: useGlobalDefaults ? null : index % 2 === 0 ? globalStyle.layoutTemplate : 'minimal',
    backgroundOverride: useGlobalDefaults ? null : cloneBackground(variedBackground),
    textStyleOverride: null,
    deviceStyle: {
      ...globalStyle.deviceStyle,
      rotation: index % 3 === 1 ? -4 : index % 3 === 2 ? 4 : 0,
    },
    padding: null,
    spacing: null,
    borderRadius: null,
  }
}

export function createProject(deviceType: DeviceType, count = 5): ScreenshotProject {
  const safeCount = Math.min(Math.max(count, 1), MAX_SCREENSHOTS)
  const globalStyle = getDefaultGlobalStyle(deviceType)

  const slides = Array.from({ length: safeCount }, (_, index) => createSlide(deviceType, index, globalStyle))

  return {
    id: uid(),
    deviceType,
    exportSizeId: getDefaultSizeId(deviceType),
    globalStyle,
    selectedId: slides[0].id,
    slides,
  }
}

function migrateProject(project: ScreenshotProject): ScreenshotProject {
  const globalStyle = project.globalStyle ?? getDefaultGlobalStyle(project.deviceType)

  return {
    ...project,
    id: project.id ?? uid(),
    globalStyle,
    slides: project.slides.map((slide) => ({
      ...slide,
      backgroundOverride: slide.backgroundOverride ?? slide.background ?? null,
      textStyleOverride: slide.textStyleOverride ?? slide.textStyle ?? null,
      deviceFrame: slide.deviceFrame ?? null,
      layoutTemplate: slide.layoutTemplate ?? null,
      padding: slide.padding ?? null,
      spacing: slide.spacing ?? null,
      borderRadius: slide.borderRadius ?? null,
      deviceStyle: slide.deviceStyle ?? getDefaultDeviceStyle(project.deviceType),
      background: undefined,
      textStyle: undefined,
    })),
  }
}

function loadStoredProject() {
  try {
    const value = localStorage.getItem(PROJECT_STORAGE_KEY)
    return value ? migrateProject(JSON.parse(value) as ScreenshotProject) : null
  } catch {
    return null
  }
}

export function useScreenshotProject() {
  const [project, setProject] = useState<ScreenshotProject | null>(() => loadStoredProject())

  useEffect(() => {
    if (project) localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project))
  }, [project])

  const selectedSlide = useMemo(
    () => project?.slides.find((slide) => slide.id === project.selectedId) ?? project?.slides[0] ?? null,
    [project],
  )
  const selectedResolvedSlide = useMemo(
    () => (project && selectedSlide ? resolveSlideStyle(project, selectedSlide) : null),
    [project, selectedSlide],
  )

  function startProject(deviceType: DeviceType, count: number) {
    setProject(createProject(deviceType, count))
  }

  function resetProject() {
    localStorage.removeItem(PROJECT_STORAGE_KEY)
    setProject(null)
  }

  function updateProject(updater: (project: ScreenshotProject) => ScreenshotProject) {
    setProject((current) => (current ? updater(current) : current))
  }

  function updateSlide(slideId: string, patch: Partial<ScreenshotSlide>) {
    updateProject((current) => ({
      ...current,
      slides: current.slides.map((slide) => (slide.id === slideId ? { ...slide, ...patch } : slide)),
    }))
  }

  function updateSelectedSlide(patch: Partial<ScreenshotSlide>) {
    if (!selectedSlide) return
    updateSlide(selectedSlide.id, patch)
  }

  function addSlide(copyFromId?: string) {
    updateProject((current) => {
      if (current.slides.length >= MAX_SCREENSHOTS) return current
      const source = copyFromId ? current.slides.find((slide) => slide.id === copyFromId) : null
      const nextSlide = source
        ? { ...source, id: uid(), title: `${source.title} copy` }
        : createSlide(current.deviceType, current.slides.length, current.globalStyle)

      return {
        ...current,
        selectedId: nextSlide.id,
        slides: [...current.slides, nextSlide],
      }
    })
  }

  function removeSlide(slideId: string) {
    updateProject((current) => {
      if (current.slides.length === 1) return current
      const slides = current.slides.filter((slide) => slide.id !== slideId)
      return {
        ...current,
        slides,
        selectedId: current.selectedId === slideId ? slides[0].id : current.selectedId,
      }
    })
  }

  function moveSlide(slideId: string, direction: -1 | 1) {
    updateProject((current) => {
      const index = current.slides.findIndex((slide) => slide.id === slideId)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= current.slides.length) return current

      const slides = [...current.slides]
      const [slide] = slides.splice(index, 1)
      slides.splice(nextIndex, 0, slide)
      return { ...current, slides }
    })
  }

  function applyToAll(sourceId: string, kind: 'background' | 'font' | 'device' | 'layout') {
    updateProject((current) => {
      const rawSource = current.slides.find((slide) => slide.id === sourceId)
      const source = rawSource ? resolveSlideStyle(current, rawSource) : null
      if (!source) return current

      return {
        ...current,
        slides: current.slides.map((slide) => ({
          ...slide,
          ...(kind === 'background' ? { backgroundOverride: cloneBackground(source.background) } : {}),
          ...(kind === 'font' ? { textStyleOverride: { ...source.textStyle } } : {}),
          ...(kind === 'device' ? { deviceFrame: source.deviceFrame, deviceStyle: source.deviceStyle } : {}),
          ...(kind === 'layout' ? { layoutTemplate: source.layoutTemplate, padding: source.padding, spacing: source.spacing } : {}),
        })),
      }
    })
  }

  function updateGlobalStyle(patch: Partial<GlobalStyle>) {
    updateProject((current) => ({
      ...current,
      globalStyle: { ...current.globalStyle, ...patch },
    }))
  }

  function updateGlobalTextStyle(patch: Partial<GlobalStyle['textStyle']>) {
    updateProject((current) => ({
      ...current,
      globalStyle: {
        ...current.globalStyle,
        textStyle: { ...current.globalStyle.textStyle, ...patch },
      },
    }))
  }

  function updateGlobalDeviceStyle(patch: Partial<DeviceStyle>) {
    updateProject((current) => ({
      ...current,
      globalStyle: {
        ...current.globalStyle,
        deviceStyle: { ...current.globalStyle.deviceStyle, ...patch },
      },
    }))
  }

  function applyGlobalToAll() {
    updateProject((current) => ({
      ...current,
      slides: current.slides.map((slide) => ({
        ...slide,
        backgroundOverride: null,
        textStyleOverride: null,
        deviceFrame: null,
        layoutTemplate: null,
        padding: null,
        spacing: null,
        borderRadius: null,
        deviceStyle: { ...current.globalStyle.deviceStyle },
      })),
    }))
  }

  function resetSelectedBackgroundToGlobal() {
    if (!selectedSlide) return
    updateSlide(selectedSlide.id, { backgroundOverride: null, background: undefined })
  }

  function resetSelectedDeviceToGlobal() {
    if (!selectedSlide || !project) return
    updateSlide(selectedSlide.id, {
      deviceFrame: null,
      deviceStyle: { ...project.globalStyle.deviceStyle },
    })
  }

  function setExportSize(exportSizeId: string) {
    updateProject((current) => ({ ...current, exportSizeId }))
  }

  return {
    project,
    selectedSlide,
    selectedResolvedSlide,
    startProject,
    resetProject,
    updateProject,
    updateSlide,
    updateSelectedSlide,
    addSlide,
    removeSlide,
    moveSlide,
    applyToAll,
    updateGlobalStyle,
    updateGlobalTextStyle,
    updateGlobalDeviceStyle,
    applyGlobalToAll,
    resetSelectedBackgroundToGlobal,
    resetSelectedDeviceToGlobal,
    setExportSize,
    canAddMore: (project?.slides.length ?? 0) < MAX_SCREENSHOTS,
  }
}
