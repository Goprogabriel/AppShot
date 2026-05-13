import type { DeviceFrameId, DeviceType } from './device'
import type { LayoutTemplateId } from './template'

export type Background =
  | {
      type: 'solid'
      color: string
      gradientFrom?: string
      gradientTo?: string
    }
  | {
      type: 'gradient'
      color: string
      gradientFrom: string
      gradientTo: string
    }

export interface TextStyle {
  fontFamily: string
  titleSize: number
  descriptionSize: number
  color: string
  align: 'left' | 'center' | 'right'
  weight: string
  x: number
  y: number
}

export interface DeviceStyle {
  scale: number
  rotation: number
  x: number
  y: number
}

export interface GlobalStyle {
  background: Background
  textStyle: TextStyle
  deviceStyle: DeviceStyle
  deviceFrame: DeviceFrameId
  layoutTemplate: LayoutTemplateId
  padding: number
  spacing: number
  borderRadius: number
  useGlobalDefaultsForNewScreenshots: boolean
}

export interface ScreenshotSlide {
  id: string
  title: string
  description: string
  showTitle: boolean
  showDescription: boolean
  uploadedImage: string | null
  uploadedImageName?: string
  deviceType: DeviceType
  deviceFrame?: DeviceFrameId | null
  layoutTemplate?: LayoutTemplateId | null
  backgroundOverride?: Background | null
  textStyleOverride?: Partial<TextStyle> | null
  deviceStyle: DeviceStyle
  padding?: number | null
  spacing?: number | null
  borderRadius?: number | null
  background?: Background
  textStyle?: TextStyle
}

export interface ScreenshotProject {
  id: string
  deviceType: DeviceType
  selectedId: string
  exportSizeId: string
  globalStyle: GlobalStyle
  slides: ScreenshotSlide[]
}

export interface ResolvedScreenshotSlide extends ScreenshotSlide {
  deviceFrame: DeviceFrameId
  layoutTemplate: LayoutTemplateId
  background: Background
  textStyle: TextStyle
  padding: number
  spacing: number
  borderRadius: number
}
