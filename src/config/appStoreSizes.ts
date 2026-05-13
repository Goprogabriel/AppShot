import type { AppStoreSize } from '../types/device'

export const APP_STORE_SIZES: AppStoreSize[] = [
  {
    id: 'iphone-69',
    label: 'iPhone 6.9" - 1320 x 2868',
    width: 1320,
    height: 2868,
    deviceType: 'iphone',
    recommended: true,
  },
  {
    id: 'iphone-65',
    label: 'iPhone 6.5" - 1284 x 2778',
    width: 1284,
    height: 2778,
    deviceType: 'iphone',
  },
  {
    id: 'iphone-55',
    label: 'iPhone 5.5" - 1242 x 2208',
    width: 1242,
    height: 2208,
    deviceType: 'iphone',
  },
  {
    id: 'ipad-13',
    label: 'iPad 13" - 2064 x 2752',
    width: 2064,
    height: 2752,
    deviceType: 'ipad',
    recommended: true,
  },
  {
    id: 'ipad-129',
    label: 'iPad 12.9" - 2048 x 2732',
    width: 2048,
    height: 2732,
    deviceType: 'ipad',
  },
  {
    id: 'ipad-11',
    label: 'iPad 11" - 1668 x 2388',
    width: 1668,
    height: 2388,
    deviceType: 'ipad',
  },
]

export function getDefaultSizeId(deviceType: AppStoreSize['deviceType']) {
  return APP_STORE_SIZES.find((size) => size.deviceType === deviceType && size.recommended)?.id ?? APP_STORE_SIZES[0].id
}

export function getSizeById(id: string) {
  return APP_STORE_SIZES.find((size) => size.id === id) ?? APP_STORE_SIZES[0]
}
