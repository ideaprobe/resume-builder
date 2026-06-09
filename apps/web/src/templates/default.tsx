import type { ReactNode } from 'react'
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

  return (
    <div
      className="resume-canvas w-[210mm] min-h-[297mm] mx-auto shadow-2xl shadow-stone-400/25 overflow-hidden"
      style={{ backgroundColor: content.theme.backgroundColor }}
    >
      {/* 顶栏 */}
      <header className="px-12 pt-12 pb-8 border-b border-stone-300/60">
        <InlineField
          value={basics.fields.name}
          onChange={(v) =>
            updateSection(basics.id, () => ({
              ...basics,
              fields: { ...basics.fields, name: v },
            }))
          }
          placeholder="你的姓名"
          className="resume-name text-[2.35rem] font-semibold leading-tight text-stone-900 tracking-tight"
        />
        <InlineField
          value={basics.fields.title}
          onChange={(v) =>
            updateSection(basics.id, () => ({
              ...basics,
              fields: { ...basics.fields, title: v },
            }))
          }
          placeholder="职位头衔"
          className="mt-2 text-lg text-stone-600 font-medium"
        />
        <div className="mt-5 h-0.5 w-14 bg-[var(--resume-accent)] rounded-full" />
      </header>

      <div className="grid grid-cols-[11rem_1fr] min-h-[calc(297mm-8rem)]">
        {/* 左侧栏 */}
        <aside className="resume-sidebar px-5 py-10 text-[var(--resume-sidebar-text)]">
          <SidebarLabel>联系</SidebarLabel>
          <ContactItem
            label="邮箱"
            value={basics.fields.email}
            onChange={(v) =>
              updateSection(basics.id, () => ({
                ...basics,
                fields: { ...basics.fields, email: v },
              }))
            }
          />
          <ContactItem
            label="电话"
            value={basics.fields.phone}
            onChange={(v) =>
              updateSection(basics.id, () => ({
                ...basics,
                fields: { ...basics.fields, phone: v },
              }))
            }
          />
          <ContactItem
            label="城市"
            value={basics.fields.location}
            onChange={(v) =>
              updateSection(basics.id, () => ({
                ...basics,
                fields: { ...basics.fields, location: v },
              }))
            }
          />

          <div className="mt-10">
            <SkillsSidebar
              section={skills}
              onChange={(s) => updateSection(skills.id, () => s)}
            />
          </div>
        </aside>

        {/* 主内容 */}
        <main className="px-10 py-10 bg-white/50">
          <WorkBlock
            section={work}
            onChange={(s) => updateSection(work.id, () => s)}
          />
          <EducationBlock
            section={education}
            onChange={(s) => updateSection(education.id, () => s)}
          />
          {customSections.map((section) => (
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
          ))}
        </main>
      </div>
    </div>
  )
}

function SidebarLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-[var(--resume-sidebar-muted)] mb-4">
      {children}
    </p>
  )
}

function ContactItem({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-[0.62rem] text-[var(--resume-sidebar-muted)] mb-1">{label}</p>
      <InlineField
        value={value}
        onChange={onChange}
        placeholder={label}
        className="text-[0.8rem] text-stone-200 placeholder:text-stone-500"
      />
    </div>
  )
}

function SectionTitle({
  title,
  onAdd,
}: {
  title: string
  onAdd?: () => void
}) {
  return (
    <div className="flex items-center justify-between mb-5 mt-2 first:mt-0">
      <h2 className="resume-section-label">{title}</h2>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="text-[0.7rem] font-medium text-[var(--resume-accent)] hover:text-[#7c2d12] px-2 py-1 rounded-md hover:bg-orange-50 transition-colors"
        >
          + 添加
        </button>
      )}
    </div>
  )
}

function SkillsSidebar({
  section,
  onChange,
}: {
  section: SkillsSection
  onChange: (s: SkillsSection) => void
}) {
  return (
    <div>
      <SidebarLabel>技能</SidebarLabel>
      <button
        type="button"
        onClick={() =>
          onChange({ ...section, items: [...section.items, createEmptySkillItem()] })
        }
        className="text-[0.65rem] text-[var(--resume-sidebar-muted)] hover:text-stone-200 mb-3 block"
      >
        + 添加技能
      </button>
      <ul className="space-y-2">
        {section.items.map((item) => (
          <li key={item.id} className="group flex items-start gap-1">
            <span className="text-[var(--resume-accent)] mt-1.5 text-[0.5rem]">●</span>
            <div className="flex-1 min-w-0">
              <InlineField
                value={item.name}
                onChange={(v) =>
                  onChange({
                    ...section,
                    items: section.items.map((i) =>
                      i.id === item.id ? { ...i, name: v } : i,
                    ),
                  })
                }
                placeholder="技能名称"
                className="text-[0.8rem] text-stone-200 placeholder:text-stone-500"
              />
            </div>
            <ItemActions
              variant="dark"
              onCopy={() =>
                onChange({
                  ...section,
                  items: [...section.items, { ...item, id: createId() }],
                })
              }
              onDelete={() =>
                onChange({
                  ...section,
                  items: section.items.filter((i) => i.id !== item.id),
                })
              }
            />
          </li>
        ))}
      </ul>
    </div>
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
      items: section.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    })
  }

  return (
    <section className="mb-10">
      <SectionTitle
        title="工作经历"
        onAdd={() =>
          onChange({ ...section, items: [...section.items, createEmptyWorkItem()] })
        }
      />
      {section.items.length === 0 && (
        <p className="text-sm text-stone-400 italic">点击「+ 添加」填写工作经历</p>
      )}
      <div className="resume-timeline relative pl-6 space-y-7">
        {section.items.map((item) => (
          <div key={item.id} className="group relative">
            <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--resume-accent)] bg-white" />
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <InlineField
                    value={item.company}
                    onChange={(v) => updateItem(item.id, { company: v })}
                    placeholder="公司名称"
                    inline
                    className="font-semibold text-stone-900 text-[0.95rem]"
                  />
                  <span className="text-stone-300">/</span>
                  <InlineField
                    value={item.position}
                    onChange={(v) => updateItem(item.id, { position: v })}
                    placeholder="职位"
                    inline
                    className="text-stone-600 text-[0.9rem]"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                  <InlineField
                    value={item.startDate}
                    onChange={(v) => updateItem(item.id, { startDate: v })}
                    placeholder="开始"
                    inline
                    className="text-xs"
                  />
                  <span>—</span>
                  <InlineField
                    value={item.endDate}
                    onChange={(v) => updateItem(item.id, { endDate: v })}
                    placeholder="至今"
                    inline
                    className="text-xs"
                  />
                </div>
              </div>
              <ItemActions
                onCopy={() =>
                  onChange({
                    ...section,
                    items: [...section.items, { ...item, id: createId() }],
                  })
                }
                onDelete={() =>
                  onChange({
                    ...section,
                    items: section.items.filter((i) => i.id !== item.id),
                  })
                }
              />
            </div>
            <InlineTextarea
              value={item.description}
              onChange={(v) => updateItem(item.id, { description: v })}
              placeholder="描述你的职责与成果..."
              className="mt-2.5 text-[0.85rem] text-stone-600 leading-relaxed"
              rows={3}
            />
          </div>
        ))}
      </div>
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
      items: section.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    })
  }

  return (
    <section className="mb-8">
      <SectionTitle
        title="教育背景"
        onAdd={() =>
          onChange({ ...section, items: [...section.items, createEmptyEducationItem()] })
        }
      />
      <div className="space-y-4">
        {section.items.map((item) => (
          <div key={item.id} className="group flex justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <InlineField
                  value={item.school}
                  onChange={(v) => updateItem(item.id, { school: v })}
                  placeholder="学校"
                  inline
                  className="font-semibold text-stone-900"
                />
                <span className="text-stone-300">·</span>
                <InlineField
                  value={item.degree}
                  onChange={(v) => updateItem(item.id, { degree: v })}
                  placeholder="学历"
                  inline
                  className="text-stone-600"
                />
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                <InlineField
                  value={item.startDate}
                  onChange={(v) => updateItem(item.id, { startDate: v })}
                  placeholder="开始"
                  inline
                  className="text-xs"
                />
                <span>—</span>
                <InlineField
                  value={item.endDate}
                  onChange={(v) => updateItem(item.id, { endDate: v })}
                  placeholder="结束"
                  inline
                  className="text-xs"
                />
              </div>
            </div>
            <ItemActions
              onCopy={() =>
                onChange({
                  ...section,
                  items: [...section.items, { ...item, id: createId() }],
                })
              }
              onDelete={() =>
                onChange({
                  ...section,
                  items: section.items.filter((i) => i.id !== item.id),
                })
              }
            />
          </div>
        ))}
      </div>
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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <InlineField
          value={section.title}
          onChange={(v) => onChange({ ...section, title: v })}
          placeholder="区块标题"
          inline
          className="resume-section-label"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onChange({ ...section, items: [...section.items, createEmptyCustomItem()] })
            }
            className="text-[0.7rem] font-medium text-[var(--resume-accent)] hover:text-[#7c2d12] px-2 py-1 rounded-md hover:bg-orange-50"
          >
            + 添加
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-[0.7rem] text-red-500 hover:bg-red-50 px-2 py-1 rounded-md"
          >
            删除区块
          </button>
        </div>
      </div>
      {section.items.map((item) => (
        <div key={item.id} className="group flex gap-3 mb-3">
          <InlineTextarea
            value={item.content}
            onChange={(v) =>
              onChange({
                ...section,
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, content: v } : i,
                ),
              })
            }
            placeholder="填写内容..."
            className="flex-1 text-[0.85rem] text-stone-600"
            rows={2}
          />
          <ItemActions
            onCopy={() =>
              onChange({
                ...section,
                items: [...section.items, { ...item, id: createId() }],
              })
            }
            onDelete={() =>
              onChange({
                ...section,
                items: section.items.filter((i) => i.id !== item.id),
              })
            }
          />
        </div>
      ))}
    </section>
  )
}
