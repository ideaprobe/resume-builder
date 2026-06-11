import type { ReactNode } from 'react'
import {
  IconCustom,
  IconEducation,
  IconCertificate,
  IconWork,
} from '../../components/resume/SectionIcons'
import { ItemActions } from '../../components/editor/ItemActions'
import { InlineField } from '../../components/ui/InlineField'
import { InlineRichText } from '../../components/ui/InlineRichText'
import type {
  CertificatesSection,
  CustomSection,
  EducationSection,
  WorkSection,
} from '../../types/resume'
import {
  createEmptyCertificateItem,
  createEmptyCustomItem,
  createEmptyEducationItem,
  createEmptyWorkItem,
  createId,
} from '../../types/resume'

export function SectionHead({
  icon,
  title,
  onAdd,
  extra,
  dragHandle,
}: {
  icon: ReactNode
  title: ReactNode
  onAdd?: () => void
  extra?: ReactNode
  dragHandle?: ReactNode
}) {
  return (
    <div className="resume-section-head">
      {dragHandle}
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

export function CertificatesBlock({
  section,
  onChange,
  dragHandle,
}: {
  section: CertificatesSection
  onChange: (s: CertificatesSection) => void
  dragHandle?: ReactNode
}) {
  return (
    <section className="resume-section">
      <SectionHead
        dragHandle={dragHandle}
        icon={<IconCertificate />}
        title="证书"
        onAdd={() =>
          onChange({ ...section, items: [...section.items, createEmptyCertificateItem()] })
        }
      />
      {section.items.length === 0 && <p className="resume-empty-hint">添加证书</p>}
      <div className="resume-certificates">
        {section.items.map((item) => (
          <span key={item.id} className="group resume-certificate-tag">
            <InlineField
              value={item.name}
              onChange={(v) =>
                onChange({
                  ...section,
                  items: section.items.map((i) => (i.id === item.id ? { ...i, name: v } : i)),
                })
              }
              placeholder="证书名称"
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

export function WorkBlock({
  section,
  onChange,
  dragHandle,
}: {
  section: WorkSection
  onChange: (s: WorkSection) => void
  dragHandle?: ReactNode
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
        dragHandle={dragHandle}
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
          <InlineRichText
            value={item.description}
            onChange={(v) => updateItem(item.id, { description: v })}
            placeholder="工作描述..."
            className="resume-t-item-body"
          />
        </div>
      ))}
    </section>
  )
}

export function EducationBlock({
  section,
  onChange,
  dragHandle,
}: {
  section: EducationSection
  onChange: (s: EducationSection) => void
  dragHandle?: ReactNode
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
        dragHandle={dragHandle}
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

export function CustomBlock({
  section,
  onChange,
  onRemove,
  dragHandle,
}: {
  section: CustomSection
  onChange: (s: CustomSection) => void
  onRemove: () => void
  dragHandle?: ReactNode
}) {
  return (
    <section className="resume-section">
      <SectionHead
        dragHandle={dragHandle}
        icon={<IconCustom />}
        title={
          <InlineField
            value={section.title}
            onChange={(v) => onChange({ ...section, title: v })}
            placeholder="区块标题"
            inline
            className="resume-section-title-input"
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
            <InlineRichText
              value={item.content}
              onChange={(v) =>
                onChange({
                  ...section,
                  items: section.items.map((i) => (i.id === item.id ? { ...i, content: v } : i)),
                })
              }
              placeholder="内容..."
              className="resume-t-item-body flex-1"
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
