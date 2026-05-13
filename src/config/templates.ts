import type { LayoutTemplate } from '../types/template'

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'text-top',
    name: 'Text top',
    description: 'Headline first with the device centered below.',
    preview: 'Aa / phone',
  },
  {
    id: 'device-top',
    name: 'Device top',
    description: 'Device first with supporting copy below.',
    preview: 'phone / Aa',
  },
  {
    id: 'text-left',
    name: 'Text left',
    description: 'Editorial split layout for wider screenshots.',
    preview: 'Aa | phone',
  },
  {
    id: 'device-left',
    name: 'Device left',
    description: 'Device-led split layout.',
    preview: 'phone | Aa',
  },
  {
    id: 'overlay',
    name: 'Overlay',
    description: 'Centered device with copy layered over the scene.',
    preview: 'phone + Aa',
  },
  {
    id: 'full-bleed',
    name: 'Full screenshot',
    description: 'The uploaded screenshot fills the canvas.',
    preview: 'full',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Balanced composition with compact copy.',
    preview: 'clean',
  },
]
