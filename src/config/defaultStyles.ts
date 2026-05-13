import { getDefaultFrameId } from './devices'
import type { DeviceType } from '../types/device'
import type { Background, DeviceStyle, GlobalStyle, TextStyle } from '../types/screenshot'

export const PREMIUM_BACKGROUNDS: Background[] = [
  { type: 'gradient', color: '#eef2ff', gradientFrom: '#101828', gradientTo: '#2563eb' },
  { type: 'gradient', color: '#f8fafc', gradientFrom: '#f8fafc', gradientTo: '#dbeafe' },
  { type: 'solid', color: '#101828' },
  { type: 'gradient', color: '#fff7ed', gradientFrom: '#fff7ed', gradientTo: '#fb7185' },
  { type: 'solid', color: '#ffffff' },
]

export function getDefaultTextStyle(deviceType: DeviceType, background: Background): TextStyle {
  const lightSolid = background.type === 'solid' && background.color.toLowerCase() === '#ffffff'

  return {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    titleSize: deviceType === 'iphone' ? 88 : 92,
    descriptionSize: deviceType === 'iphone' ? 36 : 42,
    color: lightSolid ? '#111827' : '#ffffff',
    align: 'center',
    weight: '800',
    x: 0,
    y: 0,
  }
}

export function getDefaultDeviceStyle(deviceType: DeviceType): DeviceStyle {
  return {
    scale: deviceType === 'iphone' ? 0.78 : 0.72,
    rotation: 0,
    x: 0,
    y: 0,
  }
}

export function getDefaultGlobalStyle(deviceType: DeviceType): GlobalStyle {
  const background = PREMIUM_BACKGROUNDS[0]

  return {
    background,
    textStyle: getDefaultTextStyle(deviceType, background),
    deviceStyle: getDefaultDeviceStyle(deviceType),
    deviceFrame: getDefaultFrameId(deviceType),
    layoutTemplate: 'text-top',
    padding: deviceType === 'iphone' ? 104 : 128,
    spacing: 72,
    borderRadius: 42,
    useGlobalDefaultsForNewScreenshots: true,
  }
}
