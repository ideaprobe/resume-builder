import type { ReactNode } from 'react'
import { SortableSectionStrip, SortableSections } from '../../components/editor/SortableSections'
import type { ResumeContent, ResumeSection } from '../../types/resume'
import { getSortableSections, reorderResumeSections } from '../../types/resume'
import {
  CertificatesBlock,
  CustomBlock,
  EducationBlock,
  WorkBlock,
} from './sectionBlocks'

interface ResumeSectionListProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
  className?: string
}

export function ResumeSectionList({ content, onChange, className }: ResumeSectionListProps) {
  const sortableSections = getSortableSections(content.sections)

  const updateSection = (sectionId: string, updater: (s: ResumeSection) => ResumeSection) => {
    onChange({
      ...content,
      sections: content.sections.map((s) => (s.id === sectionId ? updater(s) : s)),
    })
  }

  const renderSection = (section: ResumeSection, dragHandle: ReactNode) => {
    switch (section.type) {
      case 'work':
        return (
          <WorkBlock
            section={section}
            dragHandle={dragHandle}
            onChange={(s) => updateSection(section.id, () => s)}
          />
        )
      case 'education':
        return (
          <EducationBlock
            section={section}
            dragHandle={dragHandle}
            onChange={(s) => updateSection(section.id, () => s)}
          />
        )
      case 'certificates':
        return (
          <CertificatesBlock
            section={section}
            dragHandle={dragHandle}
            onChange={(s) => updateSection(section.id, () => s)}
          />
        )
      case 'custom':
        return (
          <CustomBlock
            section={section}
            dragHandle={dragHandle}
            onChange={(s) => updateSection(section.id, () => s)}
            onRemove={() =>
              onChange({
                ...content,
                sections: content.sections.filter((s) => s.id !== section.id),
              })
            }
          />
        )
      default:
        return null
    }
  }

  const handleSectionReorder = (activeId: string, overId: string) => {
    onChange({
      ...content,
      sections: reorderResumeSections(content.sections, activeId, overId),
    })
  }

  return (
    <div className={className}>
      <SortableSections
        sectionIds={sortableSections.map((s) => s.id)}
        onReorder={handleSectionReorder}
      >
        {sortableSections.map((section) => (
          <SortableSectionStrip key={section.id} id={section.id}>
            {(dragHandle) => renderSection(section, dragHandle)}
          </SortableSectionStrip>
        ))}
      </SortableSections>
    </div>
  )
}
