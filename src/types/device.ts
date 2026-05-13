export type DeviceType = 'iphone' | 'ipad'

export type DeviceFrameId = 'none' | string

export interface DeviceFrame {
  id: DeviceFrameId
  name: string
  deviceType: DeviceType
  aspectRatio: number
  bezel: number
  radius: number
  screenRadius: number
  accent?: string
  accentDark?: string
  rim?: number
}

export interface AppStoreSize {
  id: string
  label: string
  width: number
  height: number
  deviceType: DeviceType
  recommended?: boolean
}
