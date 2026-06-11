import type { CSSProperties } from 'react'
import type { ResumeContent, ResumeSection } from '../types/resume'
import { normalizeBasicsFields, resolveThemeVars, hasRegionalAccent } from '../types/resume'
import { BasicsEditor } from './shared/BasicsFields'
import { ResumeSectionList } from './shared/SectionList'

interface LeftColumnTemplateProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
}

function findSection<T extends ResumeSection['type']>(sections: ResumeSection[], type: T) {
  return sections.find((s) => s.type === type) as Extract<ResumeSection, { type: T }> | undefined
}

export function LeftColumnTemplate({ content, onChange }: LeftColumnTemplateProps) {
  const basics = findSection(content.sections, 'basics')
  const work = findSection(content.sections, 'work')
  const education = findSection(content.sections, 'education')
  const certificates = findSection(content.sections, 'certificates')

  if (!basics || !work || !education || !certificates) return null

  const fields = normalizeBasicsFields(basics.fields)
  const themeVars = resolveThemeVars(content.theme)
  const meshAccent = hasRegionalAccent(content.theme)

  const setBasic = (key: keyof typeof fields, value: string) => {
    onChange({
      ...content,
      sections: content.sections.map((s) =>
        s.id === basics.id
          ? { ...basics, fields: { ...fields, [key]: value } }
          : s,
      ),
    })
  }

  return (
    <div
      className={`resume-canvas resume-sheet resume-layout-left w-[210mm] mx-auto${meshAccent ? ' resume-sheet--mesh-accent' : ''}`}
      style={themeVars as CSSProperties}
    >
      <div className="resume-sheet-bg" aria-hidden />
      <aside className="resume-sidebar">
        <div className="resume-sidebar-bg" aria-hidden />
        <div className="resume-sidebar-inner">
          <BasicsEditor fields={fields} onFieldChange={setBasic} layout="sidebar" />
        </div>
      </aside>

      <ResumeSectionList
        content={content}
        onChange={onChange}
        className="resume-main resume-sections resume-sections--main"
      />
    </div>
  )
}
