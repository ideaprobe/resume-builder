import type { ReactNode } from 'react'
import { AvatarUpload } from '../../components/resume/AvatarUpload'
import { IconLocation, IconMail, IconPhone } from '../../components/resume/SectionIcons'
import { InlineField } from '../../components/ui/InlineField'
import type { BasicsFields } from '../../types/resume'

export function MetaItem({
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

function BasicsTextFields({
  fields,
  onFieldChange,
  layout,
}: {
  fields: BasicsFields
  onFieldChange: (key: keyof BasicsFields, value: string) => void
  layout: 'hero' | 'sidebar'
}) {
  const displayClass = layout === 'sidebar' ? 'resume-t-display resume-t-display--sidebar' : 'resume-t-display'
  const headlineClass =
    layout === 'sidebar' ? 'resume-t-headline resume-t-headline--sidebar' : 'resume-t-headline'
  const metaClass = layout === 'sidebar' ? 'resume-t-meta resume-t-meta--sidebar' : 'resume-t-meta'

  return (
    <>
      <InlineField
        value={fields.name}
        onChange={(v) => onFieldChange('name', v)}
        placeholder="你的姓名"
        className={displayClass}
      />
      <InlineField
        value={fields.title}
        onChange={(v) => onFieldChange('title', v)}
        placeholder="职位头衔"
        className={headlineClass}
      />
      <div className={metaClass}>
        <MetaItem
          icon={<IconMail className="resume-meta-icon" />}
          value={fields.email}
          onChange={(v) => onFieldChange('email', v)}
          placeholder="邮箱"
        />
        <MetaItem
          icon={<IconPhone className="resume-meta-icon" />}
          value={fields.phone}
          onChange={(v) => onFieldChange('phone', v)}
          placeholder="电话"
        />
        <MetaItem
          icon={<IconLocation className="resume-meta-icon" />}
          value={fields.location}
          onChange={(v) => onFieldChange('location', v)}
          placeholder="城市"
        />
      </div>
    </>
  )
}

interface BasicsEditorProps {
  fields: BasicsFields
  onFieldChange: (key: keyof BasicsFields, value: string) => void
  layout?: 'hero' | 'sidebar'
}

export function BasicsEditor({ fields, onFieldChange, layout = 'hero' }: BasicsEditorProps) {
  if (layout === 'sidebar') {
    return (
      <>
        <AvatarUpload value={fields.avatar} onChange={(v) => onFieldChange('avatar', v)} />
        <BasicsTextFields fields={fields} onFieldChange={onFieldChange} layout="sidebar" />
      </>
    )
  }

  return (
    <>
      <AvatarUpload value={fields.avatar} onChange={(v) => onFieldChange('avatar', v)} />
      <div className="resume-hero-info">
        <BasicsTextFields fields={fields} onFieldChange={onFieldChange} layout="hero" />
      </div>
    </>
  )
}
