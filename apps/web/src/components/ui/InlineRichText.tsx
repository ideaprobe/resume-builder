import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSaveFlush } from '../../context/SaveFlushContext'
import { plainTextToHtml, sanitizeHtml } from '../../utils/sanitizeHtml'
import { RichTextToolbar } from './RichTextToolbar'
import { resumeRichTextExtensions } from './resumeRichTextExtensions'

interface InlineRichTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function normalizeHtml(html: string): string {
  const sanitized = sanitizeHtml(html)
  if (!sanitized || sanitized === '<p></p>' || sanitized === '<p><br></p>') return ''
  return sanitized
}

function isEmpty(value: string): boolean {
  return !normalizeHtml(value)
}

function RichTextFrame({
  value,
  onChange,
  placeholder,
  className,
  onExit,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className: string
  onExit: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const flushSave = useSaveFlush()
  const extensions = useMemo(() => resumeRichTextExtensions(placeholder), [placeholder])

  const editor = useEditor({
    extensions,
    content: plainTextToHtml(value),
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'inline-rich-text-body',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const next = normalizeHtml(ed.getHTML())
      if (next !== value) onChange(next)
    },
    onBlur: () => {
      window.setTimeout(() => {
        if (frameRef.current?.contains(document.activeElement)) return
        onExit()
        flushSave?.()
      }, 0)
    },
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const html = plainTextToHtml(value)
    if (!editor.isFocused && html !== editor.getHTML()) {
      editor.commands.setContent(html, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div ref={frameRef} className={`inline-rich-text inline-rich-text--editing ${className}`}>
      <div className="inline-rich-text-frame">
        <RichTextToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export function InlineRichText({
  value,
  onChange,
  placeholder = '点击输入',
  className = '',
}: InlineRichTextProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <RichTextFrame
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        onExit={() => setEditing(false)}
      />
    )
  }

  const empty = isEmpty(value)

  return (
    <div
      role="button"
      tabIndex={0}
      className={`inline-rich-text inline-rich-text-preview inline-field ${className}${empty ? ' inline-rich-text-preview--empty' : ''}`}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
    >
      {empty ? (
        <span className="inline-rich-text-preview-placeholder">{placeholder}</span>
      ) : (
        <div
          className="inline-rich-text-preview-content"
          dangerouslySetInnerHTML={{ __html: plainTextToHtml(value) }}
        />
      )}
    </div>
  )
}
