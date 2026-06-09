export interface ResumeTheme {
  backgroundColor: string
}

export interface BasicsFields {
  name: string
  title: string
  email: string
  phone: string
  location: string
}

export interface WorkItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
}

export interface SkillItem {
  id: string
  name: string
}

export interface CustomItem {
  id: string
  content: string
}

export type SectionType = 'basics' | 'work' | 'education' | 'skills' | 'custom'

export interface BasicsSection {
  id: string
  type: 'basics'
  fields: BasicsFields
}

export interface WorkSection {
  id: string
  type: 'work'
  items: WorkItem[]
}

export interface EducationSection {
  id: string
  type: 'education'
  items: EducationItem[]
}

export interface SkillsSection {
  id: string
  type: 'skills'
  items: SkillItem[]
}

export interface CustomSection {
  id: string
  type: 'custom'
  title: string
  items: CustomItem[]
}

export type ResumeSection =
  | BasicsSection
  | WorkSection
  | EducationSection
  | SkillsSection
  | CustomSection

export interface ResumeContent {
  template: string
  theme: ResumeTheme
  sections: ResumeSection[]
}

export interface Resume {
  id: string
  userId: string
  title: string
  content: ResumeContent
  createdAt: string
  updatedAt: string
}

export interface ResumeListItem {
  id: string
  title: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  createdAt: string
}

export const PRESET_COLORS = [
  { label: '白', value: '#ffffff' },
  { label: '浅灰', value: '#f5f5f5' },
  { label: '浅蓝', value: '#f0f4f8' },
  { label: '米色', value: '#faf8f5' },
  { label: '浅紫', value: '#f8f5ff' },
] as const

export function createId() {
  return crypto.randomUUID()
}

export function createEmptyWorkItem(): WorkItem {
  return {
    id: createId(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  }
}

export function createEmptyEducationItem(): EducationItem {
  return {
    id: createId(),
    school: '',
    degree: '',
    startDate: '',
    endDate: '',
  }
}

export function createEmptySkillItem(): SkillItem {
  return { id: createId(), name: '' }
}

export function createEmptyCustomItem(): CustomItem {
  return { id: createId(), content: '' }
}

export function createEmptyCustomSection(title: string): CustomSection {
  return {
    id: createId(),
    type: 'custom',
    title,
    items: [createEmptyCustomItem()],
  }
}
