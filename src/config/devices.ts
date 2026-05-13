import type { DeviceFrame } from '../types/device'

export const DEVICE_FRAMES: DeviceFrame[] = [
  {
    id: 'iphone-titanium',
    name: 'iPhone Titanium',
    deviceType: 'iphone',
    aspectRatio: 390 / 844,
    bezel: 16,
    radius: 46,
    screenRadius: 35,
    accent: '#d7d2c6',
    accentDark: '#8c8578',
    rim: 3,
  },
  {
    id: 'iphone-graphite',
    name: 'iPhone Graphite',
    deviceType: 'iphone',
    aspectRatio: 390 / 844,
    bezel: 16,
    radius: 46,
    screenRadius: 35,
    accent: '#30343b',
    accentDark: '#090b0f',
    rim: 3,
  },
  {
    id: 'ipad-silver',
    name: 'iPad Silver',
    deviceType: 'ipad',
    aspectRatio: 1024 / 1366,
    bezel: 18,
    radius: 36,
    screenRadius: 22,
    accent: '#d9dde2',
    accentDark: '#9aa3ad',
    rim: 4,
  },
  {
    id: 'ipad-space-gray',
    name: 'iPad Space Gray',
    deviceType: 'ipad',
    aspectRatio: 1024 / 1366,
    bezel: 18,
    radius: 36,
    screenRadius: 22,
    accent: '#3b4047',
    accentDark: '#111827',
    rim: 4,
  },
]

export function getFramesForDevice(deviceType: DeviceFrame['deviceType']) {
  return DEVICE_FRAMES.filter((frame) => frame.deviceType === deviceType)
}

export function getFrameById(id: string) {
  return DEVICE_FRAMES.find((frame) => frame.id === id)
}

export function getDefaultFrameId(deviceType: DeviceFrame['deviceType']) {
  return getFramesForDevice(deviceType)[0]?.id ?? 'none'
}
