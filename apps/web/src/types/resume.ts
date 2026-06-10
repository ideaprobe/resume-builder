export type HeroTone = 'light' | 'dark'

export interface ResumeTheme {
  /** @deprecated 兼容旧数据，优先使用 gradient */
  backgroundColor?: string
  gradient?: string
  /** 正文区块强调色，与页眉渐变协调 */
  accent?: string
  /** 页眉文字明暗：light=浅色字，dark=深色字（用于浅色渐变） */
  heroTone?: HeroTone
  heroText?: string
  heroTextMuted?: string
}

export interface ThemePreset {
  id: string
  label: string
  gradient: string
  accent: string
  heroTone: HeroTone
  /** 页眉主文字色，深色字模式建议用高对比色 */
  heroText?: string
  /** 页眉次要文字色 */
  heroTextMuted?: string
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

export interface CertificateItem {
  id: string
  name: string
}

export interface CustomItem {
  id: string
  content: string
}

export type SectionType = 'basics' | 'work' | 'education' | 'certificates' | 'custom'

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

export interface CertificatesSection {
  id: string
  type: 'certificates'
  items: CertificateItem[]
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
  | CertificatesSection
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

export const DEFAULT_PRESET_ID = 'indigo-dusk'

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'indigo-dusk',
    label: '靛蓝暮',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)',
    accent: '#5b5bd6',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#e0e7ff',
  },
  {
    id: 'deep-ocean',
    label: '深海蓝',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)',
    accent: '#0284c7',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#bae6fd',
  },
  {
    id: 'forest-teal',
    label: '墨松绿',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)',
    accent: '#0d9488',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#ccfbf1',
  },
  {
    id: 'wine-rose',
    label: '酒红雅',
    gradient: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)',
    accent: '#be123c',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#fecdd3',
  },
  {
    id: 'graphite',
    label: '石墨灰',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 55%, #4b5563 100%)',
    accent: '#64748b',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#e2e8f0',
  },
  {
    id: 'midnight',
    label: '午夜蓝',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
    accent: '#3b82f6',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#dbeafe',
  },
  {
    id: 'morning-gold',
    label: '晨曦金',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 48%, #fde68a 100%)',
    accent: '#b45309',
    heroTone: 'dark',
    heroText: '#422006',
    heroTextMuted: '#78350f',
  },
  {
    id: 'mist-sky',
    label: '雾天蓝',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 48%, #bae6fd 100%)',
    accent: '#0369a1',
    heroTone: 'dark',
    heroText: '#0c4a6e',
    heroTextMuted: '#075985',
  },
  {
    id: 'blush-sand',
    label: '玫瑰砂',
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 48%, #fecdd3 100%)',
    accent: '#be123c',
    heroTone: 'dark',
    heroText: '#4c0519',
    heroTextMuted: '#9f1239',
  },
  {
    id: 'lavender-mist',
    label: '薰衣草',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 48%, #e9d5ff 100%)',
    accent: '#7e22ce',
    heroTone: 'dark',
    heroText: '#3b0764',
    heroTextMuted: '#6b21a8',
  },
]

/** @deprecated 使用 THEME_PRESETS */
export const PRESET_GRADIENTS = THEME_PRESETS.map(({ label, gradient }) => ({ label, gradient }))

export const DEFAULT_GRADIENT = THEME_PRESETS[0].gradient

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return null
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  if ([r, g, b].some((v) => Number.isNaN(v))) return null
  return [r, g, b]
}

function accentAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return `rgba(91, 110, 234, ${alpha})`
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

/** 旧版渐变 → 当前预设，保证已保存简历的文字色正确 */
const LEGACY_GRADIENT_ALIASES: Record<string, string> = {
  'linear-gradient(145deg, #667eea 0%, #764ba2 100%)': 'indigo-dusk',
  'linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #7c3aed 100%)': 'indigo-dusk',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)': 'deep-ocean',
  'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)': 'forest-teal',
  'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)': 'wine-rose',
  'linear-gradient(135deg, #fffbeb 0%, #fde68a 45%, #f59e0b 100%)': 'morning-gold',
  'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #38bdf8 100%)': 'mist-sky',
  'linear-gradient(135deg, #fff1f2 0%, #fecdd3 50%, #fb7185 100%)': 'blush-sand',
  'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #c084fc 100%)': 'lavender-mist',
  'linear-gradient(135deg, #1f2937 0%, #374151 55%, #52525b 100%)': 'graphite',
  'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)': 'midnight',
  'linear-gradient(135deg, #0a0e14 0%, #151d28 48%, #1e2836 100%)': 'graphite',
  'linear-gradient(135deg, #050a12 0%, #0c1929 48%, #152238 100%)': 'midnight',
  'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 48%, #c7d2fe 100%)': 'indigo-dusk',
  'linear-gradient(135deg, #ecfeff 0%, #cffafe 48%, #a5f3fc 100%)': 'deep-ocean',
  'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 48%, #99f6e4 100%)': 'forest-teal',
  'linear-gradient(135deg, #fff5f5 0%, #fecaca 48%, #fca5a5 100%)': 'wine-rose',
  'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 48%, #e2e8f0 100%)': 'graphite',
  'linear-gradient(135deg, #eff6ff 0%, #dbeafe 48%, #bfdbfe 100%)': 'midnight',
}

export function findThemePreset(theme: Partial<ResumeTheme> | undefined): ThemePreset | undefined {
  const gradient = resolveGradient(theme)
  const direct = THEME_PRESETS.find((p) => p.gradient === gradient)
  if (direct) return direct
  const legacyId = LEGACY_GRADIENT_ALIASES[gradient]
  if (legacyId) return THEME_PRESETS.find((p) => p.id === legacyId)
  return undefined
}

export function resolveGradient(theme: Partial<ResumeTheme> | undefined): string {
  if (theme?.gradient) return theme.gradient
  if (theme?.backgroundColor) return theme.backgroundColor
  return DEFAULT_GRADIENT
}

export function resolveAccent(theme: Partial<ResumeTheme> | undefined): string {
  if (theme?.accent) return theme.accent
  return findThemePreset(theme)?.accent ?? '#5b5bd6'
}

export function resolveHeroTone(theme: Partial<ResumeTheme> | undefined): HeroTone {
  const preset = findThemePreset(theme)
  return preset?.heroTone ?? theme?.heroTone ?? 'light'
}

export function resolveThemeVars(theme: Partial<ResumeTheme> | undefined): Record<string, string> {
  const preset = findThemePreset(theme)
  const gradient = resolveGradient(theme)
  const accent = resolveAccent(theme)
  const heroTone = resolveHeroTone(theme)
  const heroText =
    preset?.heroText ?? theme?.heroText ?? (heroTone === 'light' ? '#ffffff' : '#0f172a')
  const heroTextMuted =
    preset?.heroTextMuted ?? theme?.heroTextMuted ?? (heroTone === 'light' ? '#f1f5f9' : '#334155')

  const onGradient =
    heroTone === 'light'
      ? {
          '--r-on-gradient': heroText,
          '--r-on-gradient-muted': heroTextMuted,
          '--r-on-gradient-soft': 'rgba(255, 255, 255, 0.16)',
          '--r-on-gradient-pill': 'rgba(255, 255, 255, 0.22)',
          '--r-on-gradient-pill-border': 'rgba(255, 255, 255, 0.38)',
          '--r-on-gradient-shadow': '0 1px 2px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.22)',
          '--r-hero-overlay':
            'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%, rgba(0,0,0,0.14) 100%)',
          '--r-edit-hover': 'rgba(255, 255, 255, 0.18)',
          '--r-edit-focus': 'rgba(255, 255, 255, 0.3)',
          '--r-edit-focus-ring': 'rgba(255, 255, 255, 0.5)',
          '--r-meta-icon-color': heroText,
          '--r-pill-shadow': '0 1px 3px rgba(0, 0, 0, 0.2)',
        }
      : {
          '--r-on-gradient': heroText,
          '--r-on-gradient-muted': heroTextMuted,
          '--r-on-gradient-soft': 'rgba(255, 255, 255, 0.45)',
          '--r-on-gradient-pill': 'rgba(255, 255, 255, 0.62)',
          '--r-on-gradient-pill-border': 'rgba(255, 255, 255, 0.75)',
          '--r-on-gradient-shadow': '0 1px 2px rgba(255, 255, 255, 0.85)',
          '--r-hero-overlay':
            'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 55%, rgba(255,255,255,0.08) 100%)',
          '--r-edit-hover': 'rgba(255, 255, 255, 0.55)',
          '--r-edit-focus': 'rgba(255, 255, 255, 0.82)',
          '--r-edit-focus-ring': 'rgba(15, 23, 42, 0.12)',
          '--r-meta-icon-color': heroTextMuted,
          '--r-pill-shadow': '0 1px 2px rgba(15, 23, 42, 0.06)',
        }

  return {
    '--resume-gradient': gradient,
    '--r-accent': accent,
    '--r-accent-soft': accentAlpha(accent, 0.1),
    '--r-accent-border': accentAlpha(accent, 0.24),
    '--r-hover': accentAlpha(accent, 0.06),
    '--r-focus': accentAlpha(accent, 0.12),
    ...onGradient,
  }
}

export function themeFromPreset(preset: ThemePreset): ResumeTheme {
  return {
    gradient: preset.gradient,
    accent: preset.accent,
    heroTone: preset.heroTone,
    heroText: preset.heroText,
    heroTextMuted: preset.heroTextMuted,
  }
}

export function normalizeTheme(theme: Partial<ResumeTheme> | undefined): ResumeTheme {
  const preset = findThemePreset(theme)
  return {
    gradient: resolveGradient(theme),
    accent: theme?.accent ?? preset?.accent ?? '#5b5bd6',
    heroTone: preset?.heroTone ?? theme?.heroTone ?? 'light',
    heroText: preset?.heroText ?? theme?.heroText,
    heroTextMuted: preset?.heroTextMuted ?? theme?.heroTextMuted,
  }
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

/** 可排序区块（不含页眉 basics） */
export function getSortableSections(sections: ResumeSection[]): ResumeSection[] {
  return sections.filter((s) => s.type !== 'basics')
}

export function reorderResumeSections(
  sections: ResumeSection[],
  activeId: string,
  overId: string,
): ResumeSection[] {
  const basics = sections.filter((s) => s.type === 'basics')
  const sortable = getSortableSections(sections)
  const oldIndex = sortable.findIndex((s) => s.id === activeId)
  const newIndex = sortable.findIndex((s) => s.id === overId)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return sections

  const next = [...sortable]
  const [moved] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  return [...basics, ...next]
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

export function createEmptyCertificateItem(): CertificateItem {
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
