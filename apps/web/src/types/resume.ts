export type HeroTone = 'light' | 'dark'
export type GradientStyle = 'linear' | 'mesh'

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
  /** mesh 多径向渐变，蒙版更轻以保留色块层次 */
  gradientStyle?: GradientStyle
  /** 白底上的区域装饰渐变（mesh 专用） */
  regionalGradient?: string
}

export interface ThemePreset {
  id: string
  label: string
  gradient: string
  accent: string
  heroTone: HeroTone
  gradientStyle?: GradientStyle
  /** 白底上的区域装饰渐变（mesh 专用） */
  regionalGradient?: string
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
  {
    id: 'sunset-amber',
    label: '暮橙',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #c2410c 45%, #ea580c 100%)',
    accent: '#ea580c',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#ffedd5',
  },
  {
    id: 'royal-purple',
    label: '皇家紫',
    gradient: 'linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)',
    accent: '#9333ea',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#f3e8ff',
  },
  {
    id: 'emerald-deep',
    label: '祖母绿',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
    accent: '#059669',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#d1fae5',
  },
  {
    id: 'slate-steel',
    label: '板岩蓝',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
    accent: '#475569',
    heroTone: 'light',
    heroText: '#ffffff',
    heroTextMuted: '#e2e8f0',
  },
  {
    id: 'apricot-cream',
    label: '杏奶',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 48%, #fed7aa 100%)',
    accent: '#c2410c',
    heroTone: 'dark',
    heroText: '#431407',
    heroTextMuted: '#9a3412',
  },
  {
    id: 'sage-light',
    label: '鼠尾草',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 48%, #bbf7d0 100%)',
    accent: '#15803d',
    heroTone: 'dark',
    heroText: '#14532d',
    heroTextMuted: '#166534',
  },
  {
    id: 'pearl-gray',
    label: '珍珠灰',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 48%, #e2e8f0 100%)',
    accent: '#64748b',
    heroTone: 'dark',
    heroText: '#0f172a',
    heroTextMuted: '#475569',
  },
  {
    id: 'mesh-nebula',
    label: '星云紫',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 620px 440px at 3% 5%, rgba(129, 140, 248, 0.16) 0%, rgba(129, 140, 248, 0.05) 38%, transparent 76%), radial-gradient(ellipse 500px 380px at 97% 11%, rgba(196, 181, 253, 0.13) 0%, rgba(196, 181, 253, 0.04) 36%, transparent 74%), radial-gradient(ellipse 540px 420px at 91% 94%, rgba(99, 102, 241, 0.11) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 78%), radial-gradient(ellipse 460px 340px at 8% 88%, rgba(167, 139, 250, 0.09) 0%, transparent 72%), radial-gradient(ellipse 380px 300px at 62% 72%, rgba(165, 180, 252, 0.06) 0%, transparent 68%)',
    regionalGradient:
      'radial-gradient(ellipse 620px 440px at 3% 5%, rgba(129, 140, 248, 0.16) 0%, rgba(129, 140, 248, 0.05) 38%, transparent 76%), radial-gradient(ellipse 500px 380px at 97% 11%, rgba(196, 181, 253, 0.13) 0%, rgba(196, 181, 253, 0.04) 36%, transparent 74%), radial-gradient(ellipse 540px 420px at 91% 94%, rgba(99, 102, 241, 0.11) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 78%), radial-gradient(ellipse 460px 340px at 8% 88%, rgba(167, 139, 250, 0.09) 0%, transparent 72%), radial-gradient(ellipse 380px 300px at 62% 72%, rgba(165, 180, 252, 0.06) 0%, transparent 68%)',
    accent: '#7c3aed',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-coral',
    label: '珊瑚暮',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 600px 420px at 5% 7%, rgba(251, 113, 133, 0.14) 0%, rgba(251, 113, 133, 0.04) 40%, transparent 77%), radial-gradient(ellipse 480px 360px at 95% 16%, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.03) 35%, transparent 73%), radial-gradient(ellipse 520px 400px at 84% 91%, rgba(253, 164, 175, 0.10) 0%, transparent 75%), radial-gradient(ellipse 420px 320px at 14% 82%, rgba(225, 29, 72, 0.08) 0%, transparent 70%), radial-gradient(ellipse 340px 280px at 55% 68%, rgba(255, 228, 230, 0.12) 0%, transparent 65%)',
    regionalGradient:
      'radial-gradient(ellipse 600px 420px at 5% 7%, rgba(251, 113, 133, 0.14) 0%, rgba(251, 113, 133, 0.04) 40%, transparent 77%), radial-gradient(ellipse 480px 360px at 95% 16%, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.03) 35%, transparent 73%), radial-gradient(ellipse 520px 400px at 84% 91%, rgba(253, 164, 175, 0.10) 0%, transparent 75%), radial-gradient(ellipse 420px 320px at 14% 82%, rgba(225, 29, 72, 0.08) 0%, transparent 70%), radial-gradient(ellipse 340px 280px at 55% 68%, rgba(255, 228, 230, 0.12) 0%, transparent 65%)',
    accent: '#e11d48',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-azure',
    label: '碧波光',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 610px 430px at 4% 9%, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 13%, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0.03) 36%, transparent 74%), radial-gradient(ellipse 530px 410px at 89% 93%, rgba(103, 232, 249, 0.10) 0%, transparent 76%), radial-gradient(ellipse 450px 330px at 10% 86%, rgba(3, 105, 161, 0.08) 0%, transparent 72%), radial-gradient(ellipse 360px 290px at 58% 74%, rgba(186, 230, 253, 0.08) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 610px 430px at 4% 9%, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 13%, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0.03) 36%, transparent 74%), radial-gradient(ellipse 530px 410px at 89% 93%, rgba(103, 232, 249, 0.10) 0%, transparent 76%), radial-gradient(ellipse 450px 330px at 10% 86%, rgba(3, 105, 161, 0.08) 0%, transparent 72%), radial-gradient(ellipse 360px 290px at 58% 74%, rgba(186, 230, 253, 0.08) 0%, transparent 66%)',
    accent: '#0284c7',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-aurora',
    label: '极光翠',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 600px 420px at 6% 6%, rgba(45, 212, 191, 0.14) 0%, rgba(45, 212, 191, 0.04) 38%, transparent 76%), radial-gradient(ellipse 480px 360px at 94% 18%, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0.03) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 86% 90%, rgba(94, 234, 212, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 12% 84%, rgba(13, 148, 136, 0.08) 0%, transparent 71%), radial-gradient(ellipse 350px 280px at 52% 70%, rgba(204, 251, 241, 0.10) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 600px 420px at 6% 6%, rgba(45, 212, 191, 0.14) 0%, rgba(45, 212, 191, 0.04) 38%, transparent 76%), radial-gradient(ellipse 480px 360px at 94% 18%, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0.03) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 86% 90%, rgba(94, 234, 212, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 12% 84%, rgba(13, 148, 136, 0.08) 0%, transparent 71%), radial-gradient(ellipse 350px 280px at 52% 70%, rgba(204, 251, 241, 0.10) 0%, transparent 66%)',
    accent: '#0d9488',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-dawn',
    label: '薄雾晨曦',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 580px 400px at 4% 8%, rgba(253, 224, 71, 0.22) 0%, rgba(253, 224, 71, 0.07) 42%, transparent 76%), radial-gradient(ellipse 470px 350px at 93% 12%, rgba(254, 215, 170, 0.18) 0%, rgba(254, 215, 170, 0.05) 38%, transparent 74%), radial-gradient(ellipse 500px 380px at 88% 88%, rgba(251, 191, 36, 0.12) 0%, transparent 75%), radial-gradient(ellipse 400px 300px at 11% 80%, rgba(255, 237, 213, 0.20) 0%, transparent 72%), radial-gradient(ellipse 320px 260px at 60% 65%, rgba(254, 243, 199, 0.14) 0%, transparent 68%)',
    regionalGradient:
      'radial-gradient(ellipse 580px 400px at 4% 8%, rgba(253, 224, 71, 0.22) 0%, rgba(253, 224, 71, 0.07) 42%, transparent 76%), radial-gradient(ellipse 470px 350px at 93% 12%, rgba(254, 215, 170, 0.18) 0%, rgba(254, 215, 170, 0.05) 38%, transparent 74%), radial-gradient(ellipse 500px 380px at 88% 88%, rgba(251, 191, 36, 0.12) 0%, transparent 75%), radial-gradient(ellipse 400px 300px at 11% 80%, rgba(255, 237, 213, 0.20) 0%, transparent 72%), radial-gradient(ellipse 320px 260px at 60% 65%, rgba(254, 243, 199, 0.14) 0%, transparent 68%)',
    accent: '#b45309',
    heroTone: 'dark',
    heroText: '#422006',
    heroTextMuted: '#78350f',
  },
  {
    id: 'mesh-lilac',
    label: '淡丁香',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 600px 420px at 4% 7%, rgba(216, 180, 254, 0.15) 0%, rgba(216, 180, 254, 0.05) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 14%, rgba(233, 213, 255, 0.13) 0%, rgba(233, 213, 255, 0.04) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 87% 92%, rgba(192, 132, 252, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 11% 83%, rgba(168, 85, 247, 0.08) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 56% 68%, rgba(243, 232, 255, 0.12) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 600px 420px at 4% 7%, rgba(216, 180, 254, 0.15) 0%, rgba(216, 180, 254, 0.05) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 14%, rgba(233, 213, 255, 0.13) 0%, rgba(233, 213, 255, 0.04) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 87% 92%, rgba(192, 132, 252, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 11% 83%, rgba(168, 85, 247, 0.08) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 56% 68%, rgba(243, 232, 255, 0.12) 0%, transparent 66%)',
    accent: '#9333ea',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-sunset',
    label: '夕照橙',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 590px 410px at 5% 8%, rgba(251, 146, 60, 0.16) 0%, rgba(251, 146, 60, 0.05) 40%, transparent 76%), radial-gradient(ellipse 480px 360px at 94% 15%, rgba(253, 186, 116, 0.14) 0%, rgba(253, 186, 116, 0.04) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 85% 90%, rgba(254, 215, 170, 0.12) 0%, transparent 75%), radial-gradient(ellipse 420px 310px at 13% 81%, rgba(234, 88, 12, 0.08) 0%, transparent 71%), radial-gradient(ellipse 340px 270px at 58% 66%, rgba(255, 237, 213, 0.14) 0%, transparent 67%)',
    regionalGradient:
      'radial-gradient(ellipse 590px 410px at 5% 8%, rgba(251, 146, 60, 0.16) 0%, rgba(251, 146, 60, 0.05) 40%, transparent 76%), radial-gradient(ellipse 480px 360px at 94% 15%, rgba(253, 186, 116, 0.14) 0%, rgba(253, 186, 116, 0.04) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 85% 90%, rgba(254, 215, 170, 0.12) 0%, transparent 75%), radial-gradient(ellipse 420px 310px at 13% 81%, rgba(234, 88, 12, 0.08) 0%, transparent 71%), radial-gradient(ellipse 340px 270px at 58% 66%, rgba(255, 237, 213, 0.14) 0%, transparent 67%)',
    accent: '#ea580c',
    heroTone: 'dark',
    heroText: '#431407',
    heroTextMuted: '#9a3412',
  },
  {
    id: 'mesh-mint',
    label: '薄荷清',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 600px 420px at 5% 6%, rgba(110, 231, 183, 0.15) 0%, rgba(110, 231, 183, 0.05) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 95% 12%, rgba(167, 243, 208, 0.13) 0%, rgba(167, 243, 208, 0.04) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 88% 91%, rgba(52, 211, 153, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 10% 84%, rgba(16, 185, 129, 0.08) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 54% 71%, rgba(209, 250, 229, 0.12) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 600px 420px at 5% 6%, rgba(110, 231, 183, 0.15) 0%, rgba(110, 231, 183, 0.05) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 95% 12%, rgba(167, 243, 208, 0.13) 0%, rgba(167, 243, 208, 0.04) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 88% 91%, rgba(52, 211, 153, 0.10) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 10% 84%, rgba(16, 185, 129, 0.08) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 54% 71%, rgba(209, 250, 229, 0.12) 0%, transparent 66%)',
    accent: '#059669',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-slate',
    label: '雾灰',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 610px 430px at 4% 8%, rgba(148, 163, 184, 0.14) 0%, rgba(148, 163, 184, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 13%, rgba(203, 213, 225, 0.12) 0%, rgba(203, 213, 225, 0.03) 36%, transparent 74%), radial-gradient(ellipse 530px 410px at 90% 93%, rgba(100, 116, 139, 0.09) 0%, transparent 75%), radial-gradient(ellipse 450px 330px at 9% 86%, rgba(226, 232, 240, 0.14) 0%, transparent 72%), radial-gradient(ellipse 360px 290px at 60% 73%, rgba(241, 245, 249, 0.10) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 610px 430px at 4% 8%, rgba(148, 163, 184, 0.14) 0%, rgba(148, 163, 184, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 13%, rgba(203, 213, 225, 0.12) 0%, rgba(203, 213, 225, 0.03) 36%, transparent 74%), radial-gradient(ellipse 530px 410px at 90% 93%, rgba(100, 116, 139, 0.09) 0%, transparent 75%), radial-gradient(ellipse 450px 330px at 9% 86%, rgba(226, 232, 240, 0.14) 0%, transparent 72%), radial-gradient(ellipse 360px 290px at 60% 73%, rgba(241, 245, 249, 0.10) 0%, transparent 66%)',
    accent: '#64748b',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-rose',
    label: '浅樱',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 590px 410px at 5% 7%, rgba(251, 207, 232, 0.18) 0%, rgba(251, 207, 232, 0.06) 40%, transparent 76%), radial-gradient(ellipse 480px 360px at 95% 14%, rgba(244, 114, 182, 0.12) 0%, rgba(244, 114, 182, 0.03) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 86% 89%, rgba(249, 168, 212, 0.11) 0%, transparent 75%), radial-gradient(ellipse 420px 310px at 12% 82%, rgba(236, 72, 153, 0.07) 0%, transparent 71%), radial-gradient(ellipse 340px 270px at 57% 67%, rgba(253, 242, 248, 0.14) 0%, transparent 67%)',
    regionalGradient:
      'radial-gradient(ellipse 590px 410px at 5% 7%, rgba(251, 207, 232, 0.18) 0%, rgba(251, 207, 232, 0.06) 40%, transparent 76%), radial-gradient(ellipse 480px 360px at 95% 14%, rgba(244, 114, 182, 0.12) 0%, rgba(244, 114, 182, 0.03) 36%, transparent 74%), radial-gradient(ellipse 510px 390px at 86% 89%, rgba(249, 168, 212, 0.11) 0%, transparent 75%), radial-gradient(ellipse 420px 310px at 12% 82%, rgba(236, 72, 153, 0.07) 0%, transparent 71%), radial-gradient(ellipse 340px 270px at 57% 67%, rgba(253, 242, 248, 0.14) 0%, transparent 67%)',
    accent: '#db2777',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
  {
    id: 'mesh-indigo',
    label: '浅靛',
    gradientStyle: 'mesh',
    gradient:
      'radial-gradient(ellipse 600px 420px at 4% 6%, rgba(129, 140, 248, 0.14) 0%, rgba(129, 140, 248, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 12%, rgba(165, 180, 252, 0.12) 0%, rgba(165, 180, 252, 0.03) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 89% 92%, rgba(99, 102, 241, 0.09) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 10% 85%, rgba(199, 210, 254, 0.12) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 55% 70%, rgba(238, 242, 255, 0.10) 0%, transparent 66%)',
    regionalGradient:
      'radial-gradient(ellipse 600px 420px at 4% 6%, rgba(129, 140, 248, 0.14) 0%, rgba(129, 140, 248, 0.04) 38%, transparent 76%), radial-gradient(ellipse 490px 370px at 96% 12%, rgba(165, 180, 252, 0.12) 0%, rgba(165, 180, 252, 0.03) 36%, transparent 74%), radial-gradient(ellipse 520px 400px at 89% 92%, rgba(99, 102, 241, 0.09) 0%, transparent 75%), radial-gradient(ellipse 430px 320px at 10% 85%, rgba(199, 210, 254, 0.12) 0%, transparent 72%), radial-gradient(ellipse 350px 280px at 55% 70%, rgba(238, 242, 255, 0.10) 0%, transparent 66%)',
    accent: '#4f46e5',
    heroTone: 'dark',
    heroText: '#1e1e2f',
    heroTextMuted: '#4b4b63',
  },
]

export const THEME_LINEAR_PRESETS = THEME_PRESETS.filter((p) => p.gradientStyle !== 'mesh')
export const THEME_MESH_PRESETS = THEME_PRESETS.filter((p) => p.gradientStyle === 'mesh')

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

export function resolveGradientStyle(theme: Partial<ResumeTheme> | undefined): GradientStyle {
  if (theme?.gradientStyle) return theme.gradientStyle
  const preset = findThemePreset(theme)
  if (preset?.gradientStyle) return preset.gradientStyle
  const gradient = resolveGradient(theme)
  if (gradient.includes('radial-gradient')) return 'mesh'
  return 'linear'
}

/** Mesh 主题：白底 + 区域装饰色块 */
export function hasRegionalAccent(theme: Partial<ResumeTheme> | undefined): boolean {
  return resolveGradientStyle(theme) === 'mesh'
}

export function resolveRegionalGradient(theme: Partial<ResumeTheme> | undefined): string {
  const preset = findThemePreset(theme)
  if (preset?.regionalGradient) return preset.regionalGradient
  if (theme?.gradient && theme.gradient.includes('radial-gradient')) return theme.gradient
  return preset?.gradient ?? DEFAULT_GRADIENT
}


export function resolveThemeVars(theme: Partial<ResumeTheme> | undefined): Record<string, string> {
  const preset = findThemePreset(theme)
  const gradient = resolveGradient(theme)
  const accent = resolveAccent(theme)
  const heroTone = resolveHeroTone(theme)
  const gradientStyle = resolveGradientStyle(theme)
  const isMesh = gradientStyle === 'mesh'
  const heroText =
    preset?.heroText ?? theme?.heroText ?? (heroTone === 'light' ? '#ffffff' : '#0f172a')
  const heroTextMuted =
    preset?.heroTextMuted ?? theme?.heroTextMuted ?? (heroTone === 'light' ? '#f1f5f9' : '#334155')

  const onGradient =
    heroTone === 'light' && !isMesh
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
            'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 55%, rgba(255, 255, 255, 0.08) 100%)',
          '--r-edit-hover': 'rgba(255, 255, 255, 0.55)',
          '--r-edit-focus': 'rgba(255, 255, 255, 0.82)',
          '--r-edit-focus-ring': 'rgba(15, 23, 42, 0.12)',
          '--r-meta-icon-color': heroTextMuted,
          '--r-pill-shadow': '0 1px 2px rgba(15, 23, 42, 0.06)',
        }

  return {
    '--resume-gradient': gradient,
    ...(isMesh ? { '--resume-regional-gradient': resolveRegionalGradient(theme) } : {}),
    '--r-accent': accent,
    '--r-accent-soft': accentAlpha(accent, 0.1),
    '--r-accent-border': accentAlpha(accent, 0.24),
    '--r-hover': accentAlpha(accent, 0.06),
    '--r-focus': accentAlpha(accent, 0.12),
    ...onGradient,
  } as Record<string, string>
}

export function themeFromPreset(preset: ThemePreset): ResumeTheme {
  return {
    gradient: preset.gradient,
    accent: preset.accent,
    heroTone: preset.heroTone,
    heroText: preset.heroText,
    heroTextMuted: preset.heroTextMuted,
    gradientStyle: preset.gradientStyle,
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
    gradientStyle: resolveGradientStyle(theme),
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
