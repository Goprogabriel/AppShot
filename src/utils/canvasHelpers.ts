import type { Background } from '../types/screenshot'

export function backgroundToCss(background: Background) {
  if (background.type === 'gradient') {
    return `linear-gradient(145deg, ${background.gradientFrom}, ${background.gradientTo})`
  }

  return background.color
}
