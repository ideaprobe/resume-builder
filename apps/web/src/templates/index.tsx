import type { ResumeContent } from '../types/resume'
import { DefaultTemplate } from './default'
import { LeftColumnTemplate } from './left-column'

export interface ResumeTemplateProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
}

export const RESUME_TEMPLATES = [
  { id: 'default', label: '经典顶栏' },
  { id: 'left-column', label: '左栏布局' },
] as const

export type ResumeTemplateId = (typeof RESUME_TEMPLATES)[number]['id']

export function ResumeTemplate({ content, onChange }: ResumeTemplateProps) {
  switch (content.template) {
    case 'left-column':
      return <LeftColumnTemplate content={content} onChange={onChange} />
    case 'default':
    default:
      return <DefaultTemplate content={content} onChange={onChange} />
  }
}
