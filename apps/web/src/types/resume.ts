export interface ResumeTheme {
  /** @deprecated 兼容旧数据，优先使用 gradient */
  backgroundColor?: string
  gradient?: string
}

export interface BasicsFields {
  name: string
  title: string
  email: string
  phone: string
  location: string
  avatar: string
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

export const DEFAULT_GRADIENT =
  'linear-gradient(145deg, #667eea 0%, #764ba2 100%)'

export const PRESET_GRADIENTS = [
  { label: '暮光紫', gradient: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)' },
  { label: '海洋蓝', gradient: 'linear-gradient(145deg, #0093E9 0%, #80D0C7 100%)' },
  { label: '珊瑚粉', gradient: 'linear-gradient(145deg, #ff9a9e 0%, #fecfef 100%)' },
  { label: '薄雾蓝', gradient: 'linear-gradient(145deg, #a8edea 0%, #fed6e3 100%)' },
  { label: '暖金', gradient: 'linear-gradient(145deg, #f7971e 0%, #ffd200 100%)' },
  { label: '深空', gradient: 'linear-gradient(145deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
] as const

export function resolveGradient(theme: Partial<ResumeTheme> | undefined): string {
  if (theme?.gradient) return theme.gradient
  if (theme?.backgroundColor) return theme.backgroundColor
  return DEFAULT_GRADIENT
}

export function normalizeBasicsFields(fields: Partial<BasicsFields>): BasicsFields {
  return {
    name: fields.name ?? '',
    title: fields.title ?? '',
    email: fields.email ?? '',
    phone: fields.phone ?? '',
    location: fields.location ?? '',
    avatar: fields.avatar ?? '',
  }
}

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
