export type LayoutTemplateId =
  | 'text-top'
  | 'device-top'
  | 'text-left'
  | 'device-left'
  | 'overlay'
  | 'full-bleed'
  | 'minimal'

export interface LayoutTemplate {
  id: LayoutTemplateId
  name: string
  description: string
  preview: string
}
