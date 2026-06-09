import type { ReactNode } from 'react'
import { AvatarUpload } from '../components/resume/AvatarUpload'
import {
  IconCustom,
  IconEducation,
  IconLocation,
  IconMail,
  IconPhone,
  IconSkills,
  IconWork,
} from '../components/resume/SectionIcons'
import { InlineField } from '../components/ui/InlineField'
import { InlineTextarea } from '../components/ui/InlineTextarea'
import { ItemActions } from '../components/editor/ItemActions'
import type {
  CustomSection,
  EducationSection,
  ResumeContent,
  ResumeSection,
  SkillsSection,
  WorkSection,
} from '../types/resume'
import {
  createEmptyCustomItem,
  createEmptyEducationItem,
  createEmptySkillItem,
  createEmptyWorkItem,
  createId,
  normalizeBasicsFields,
  resolveGradient,
} from '../types/resume'

interface DefaultTemplateProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
}

function findSection<T extends ResumeSection['type']>(
  sections: ResumeSection[],
  type: T,
) {
  return sections.find((s) => s.type === type) as
    | Extract<ResumeSection, { type: T }>
    | undefined
}

function SectionStrip({ index, children }: { index: number; children: ReactNode }) {
  const isGradient = index % 2 === 0
  return (
    <div className={`resume-section-strip${isGradient ? ' resume-section-strip--gradient' : ''}`}>
      {children}
    </div>
  )
}

export function DefaultTemplate({ content, onChange }: DefaultTemplateProps) {
  const basics = findSection(content.sections, 'basics')
  const work = findSection(content.sections, 'work')
  const education = findSection(content.sections, 'education')
  const skills = findSection(content.sections, 'skills')
  const customSections = content.sections.filter((s) => s.type === 'custom')

  const updateSection = (sectionId: string, updater: (s: ResumeSection) => ResumeSection) => {
    onChange({
      ...content,
      sections: content.sections.map((s) => (s.id === sectionId ? updater(s) : s)),
    })
  }

  if (!basics || !work || !education || !skills) return null

  const fields = normalizeBasicsFields(basics.fields)
  const gradient = resolveGradient(content.theme)

  const setBasic = (key: keyof typeof fields, value: string) => {
    updateSection(basics.id, () => ({
      ...basics,
      fields: { ...fields, [key]: value },
    }))
  }

  const sectionBlocks: ReactNode[] = [
    <SkillsBlock key="skills" section={skills} onChange={(s) => updateSection(skills.id, () => s)} />,
    <WorkBlock key="work" section={work} onChange={(s) => updateSection(work.id, () => s)} />,
    <EducationBlock
      key="education"
      section={education}
      onChange={(s) => updateSection(education.id, () => s)}
    />,
    ...customSections.map((section) => (
      <CustomBlock
        key={section.id}
        section={section}
        onChange={(s) => updateSection(section.id, () => s)}
        onRemove={() =>
          onChange({
            ...content,
            sections: content.sections.filter((s) => s.id !== section.id),
          })
        }
      />
    )),
  ]

  return (
    <div
      className="resume-canvas resume-sheet w-[210mm] mx-auto"
      style={{ ['--resume-gradient' as string]: gradient }}
    >
      <header className="resume-hero">
        <AvatarUpload value={fields.avatar} onChange={(v) => setBasic('avatar', v)} />
        <InlineField
          value={fields.name}
          onChange={(v) => setBasic('name', v)}
          placeholder="你的姓名"
          className="resume-t-display"
        />
        <InlineField
          value={fields.title}
          onChange={(v) => setBasic('title', v)}
          placeholder="职位头衔"
          className="resume-t-headline"
        />
        <div className="resume-t-meta">
          <MetaItem
            icon={<IconMail className="resume-meta-icon" />}
            value={fields.email}
            onChange={(v) => setBasic('email', v)}
            placeholder="邮箱"
          />
          <MetaItem
            icon={<IconPhone className="resume-meta-icon" />}
            value={fields.phone}
            onChange={(v) => setBasic('phone', v)}
            placeholder="电话"
          />
          <MetaItem
            icon={<IconLocation className="resume-meta-icon" />}
            value={fields.location}
            onChange={(v) => setBasic('location', v)}
            placeholder="城市"
          />
        </div>
      </header>

      <div className="resume-sections">
        {sectionBlocks.map((block, i) => (
          <SectionStrip key={i} index={i}>
            {block}
          </SectionStrip>
        ))}
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  value,
  onChange,
  placeholder,
}: {
  icon: ReactNode
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <span className="resume-meta-item">
      {icon}
      <InlineField value={value} onChange={onChange} placeholder={placeholder} inline />
    </span>
  )
}

function SectionHead({
  icon,
  title,
  onAdd,
  extra,
}: {
  icon: ReactNode
  title: ReactNode
  onAdd?: () => void
  extra?: ReactNode
}) {
  return (
    <div className="resume-section-head">
      <span className="resume-section-icon">{icon}</span>
      <div className="resume-section-title">{title}</div>
      <div className="resume-section-actions">
        {onAdd && (
          <button type="button" onClick={onAdd} className="resume-add-btn">
            + 添加
          </button>
        )}
        {extra}
      </div>
    </div>
  )
}

function DateRange({
  start,
  end,
  onStart,
  onEnd,
  endPlaceholder = '至今',
}: {
  start: string
  end: string
  onStart: (v: string) => void
  onEnd: (v: string) => void
  endPlaceholder?: string
}) {
  return (
    <span className="resume-t-caption">
      <InlineField value={start} onChange={onStart} placeholder="开始" inline />
      <span className="resume-t-caption-sep">—</span>
      <InlineField value={end} onChange={onEnd} placeholder={endPlaceholder} inline />
    </span>
  )
}

function SkillsBlock({
  section,
  onChange,
}: {
  section: SkillsSection
  onChange: (s: SkillsSection) => void
}) {
  return (
    <section className="resume-section">
      <SectionHead
        icon={<IconSkills />}
        title="技能"
        onAdd={() => onChange({ ...section, items: [...section.items, createEmptySkillItem()] })}
      />
      {section.items.length === 0 && <p className="resume-empty-hint">添加技能</p>}
      <div className="resume-skills">
        {section.items.map((item) => (
          <span key={item.id} className="group resume-skill-tag">
            <InlineField
              value={item.name}
              onChange={(v) =>
                onChange({
                  ...section,
                  items: section.items.map((i) => (i.id === item.id ? { ...i, name: v } : i)),
                })
              }
              placeholder="技能"
              inline
            />
            <ItemActions
              variant="resume"
              onCopy={() =>
                onChange({ ...section, items: [...section.items, { ...item, id: createId() }] })
              }
              onDelete={() =>
                onChange({ ...section, items: section.items.filter((i) => i.id !== item.id) })
              }
            />
          </span>
        ))}
      </div>
    </section>
  )
}

function WorkBlock({
  section,
  onChange,
}: {
  section: WorkSection
  onChange: (s: WorkSection) => void
}) {
  const updateItem = (itemId: string, patch: Partial<WorkSection['items'][0]>) => {
    onChange({
      ...section,
      items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    })
  }

  return (
    <section className="resume-section">
      <SectionHead
        icon={<IconWork />}
        title="工作经历"
        onAdd={() => onChange({ ...section, items: [...section.items, createEmptyWorkItem()] })}
      />
      {section.items.length === 0 && <p className="resume-empty-hint">点击「+ 添加」</p>}
      {section.items.map((item) => (
        <div key={item.id} className="group resume-item">
          <div className="resume-item-top">
            <InlineField
              value={item.company}
              onChange={(v) => updateItem(item.id, { company: v })}
              placeholder="公司"
              className="resume-t-item-primary flex-1"
            />
            <div className="flex items-center gap-1">
              <DateRange
                start={item.startDate}
                end={item.endDate}
                onStart={(v) => updateItem(item.id, { startDate: v })}
                onEnd={(v) => updateItem(item.id, { endDate: v })}
              />
              <ItemActions
                variant="resume"
                onCopy={() =>
                  onChange({ ...section, items: [...section.items, { ...item, id: createId() }] })
                }
                onDelete={() =>
                  onChange({ ...section, items: section.items.filter((i) => i.id !== item.id) })
                }
              />
            </div>
          </div>
          <InlineField
            value={item.position}
            onChange={(v) => updateItem(item.id, { position: v })}
            placeholder="职位"
            className="resume-t-item-secondary"
          />
          <InlineTextarea
            value={item.description}
            onChange={(v) => updateItem(item.id, { description: v })}
            placeholder="工作描述..."
            className="resume-t-item-body"
            rows={3}
          />
        </div>
      ))}
    </section>
  )
}

function EducationBlock({
  section,
  onChange,
}: {
  section: EducationSection
  onChange: (s: EducationSection) => void
}) {
  const updateItem = (itemId: string, patch: Partial<EducationSection['items'][0]>) => {
    onChange({
      ...section,
      items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    })
  }

  return (
    <section className="resume-section">
      <SectionHead
        icon={<IconEducation />}
        title="教育背景"
        onAdd={() => onChange({ ...section, items: [...section.items, createEmptyEducationItem()] })}
      />
      {section.items.map((item) => (
        <div key={item.id} className="group resume-item">
          <div className="resume-item-top">
            <InlineField
              value={item.school}
              onChange={(v) => updateItem(item.id, { school: v })}
              placeholder="学校"
              className="resume-t-item-primary flex-1"
            />
            <div className="flex items-center gap-1">
              <DateRange
                start={item.startDate}
                end={item.endDate}
                onStart={(v) => updateItem(item.id, { startDate: v })}
                onEnd={(v) => updateItem(item.id, { endDate: v })}
                endPlaceholder="结束"
              />
              <ItemActions
                variant="resume"
                onCopy={() =>
                  onChange({ ...section, items: [...section.items, { ...item, id: createId() }] })
                }
                onDelete={() =>
                  onChange({ ...section, items: section.items.filter((i) => i.id !== item.id) })
                }
              />
            </div>
          </div>
          <InlineField
            value={item.degree}
            onChange={(v) => updateItem(item.id, { degree: v })}
            placeholder="学历 / 专业"
            className="resume-t-item-secondary"
          />
        </div>
      ))}
    </section>
  )
}

function CustomBlock({
  section,
  onChange,
  onRemove,
}: {
  section: CustomSection
  onChange: (s: CustomSection) => void
  onRemove: () => void
}) {
  return (
    <section className="resume-section">
      <SectionHead
        icon={<IconCustom />}
        title={
          <InlineField
            value={section.title}
            onChange={(v) => onChange({ ...section, title: v })}
            placeholder="区块标题"
            inline
            className="text-[0.875rem] font-semibold uppercase tracking-wider"
          />
        }
        onAdd={() => onChange({ ...section, items: [...section.items, createEmptyCustomItem()] })}
        extra={
          <button type="button" onClick={onRemove} className="resume-add-btn">
            删除
          </button>
        }
      />
      {section.items.map((item) => (
        <div key={item.id} className="group resume-item">
          <div className="flex gap-2">
            <InlineTextarea
              value={item.content}
              onChange={(v) =>
                onChange({
                  ...section,
                  items: section.items.map((i) => (i.id === item.id ? { ...i, content: v } : i)),
                })
              }
              placeholder="内容..."
              className="resume-t-item-body flex-1"
              rows={2}
            />
            <ItemActions
              variant="resume"
              onCopy={() =>
                onChange({ ...section, items: [...section.items, { ...item, id: createId() }] })
              }
              onDelete={() =>
                onChange({ ...section, items: section.items.filter((i) => i.id !== item.id) })
              }
            />
          </div>
        </div>
      ))}
    </section>
  )
}
