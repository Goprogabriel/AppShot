import type { Background, DeviceStyle, GlobalStyle, ResolvedScreenshotSlide, ScreenshotProject, ScreenshotSlide, TextStyle } from '../types/screenshot'

export function resolveSlideStyle(project: ScreenshotProject, slide: ScreenshotSlide): ResolvedScreenshotSlide {
  const legacyBackground = slide.background
  const legacyTextStyle = slide.textStyle

  return {
    ...slide,
    background: slide.backgroundOverride ?? legacyBackground ?? project.globalStyle.background,
    textStyle: {
      ...project.globalStyle.textStyle,
      ...(legacyTextStyle ?? {}),
      ...(slide.textStyleOverride ?? {}),
    },
    deviceFrame: slide.deviceFrame ?? project.globalStyle.deviceFrame,
    layoutTemplate: slide.layoutTemplate ?? project.globalStyle.layoutTemplate,
    padding: slide.padding ?? project.globalStyle.padding,
    spacing: slide.spacing ?? project.globalStyle.spacing,
    borderRadius: slide.borderRadius ?? project.globalStyle.borderRadius,
    deviceStyle: {
      ...project.globalStyle.deviceStyle,
      ...slide.deviceStyle,
    },
  }
}

export function createGlobalStylePatch(globalStyle: GlobalStyle, patch: Partial<GlobalStyle>): GlobalStyle {
  return { ...globalStyle, ...patch }
}

export function mergeTextStyle(base: TextStyle, patch: Partial<TextStyle>): TextStyle {
  return { ...base, ...patch }
}

export function mergeDeviceStyle(base: DeviceStyle, patch: Partial<DeviceStyle>): DeviceStyle {
  return { ...base, ...patch }
}

export function isUsingGlobalBackground(slide: ScreenshotSlide) {
  return !slide.backgroundOverride && !slide.background
}

export function cloneBackground(background: Background): Background {
  return { ...background }
}
