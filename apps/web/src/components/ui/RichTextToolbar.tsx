import type { Editor } from '@tiptap/react'
import { useEffect, useState, type ReactNode } from 'react'
import { FONT_SIZE_OPTIONS } from './fontSizeExtension'
import { IconRedo, IconUndo } from './UndoRedoIcons'

const TEXT_COLORS = ['#1e1e2f', '#4b4b63', '#5b5bd6', '#be123c', '#0369a1', '#0d9488'] as const
const HIGHLIGHT_COLORS = ['#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ffedd5'] as const

function useToolbarState(editor: Editor) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const refresh = () => setTick((t) => t + 1)
    editor.on('selectionUpdate', refresh)
    editor.on('transaction', refresh)
    return () => {
      editor.off('selectionUpdate', refresh)
      editor.off('transaction', refresh)
    }
  }, [editor])
}

function ToolbarDivider() {
  return <span className="inline-rich-text-toolbar-divider" aria-hidden />
}

function ToolbarGroup({ children }: { children: ReactNode }) {
  return <div className="inline-rich-text-toolbar-group">{children}</div>
}

function ToolbarButton({
  children,
  title,
  active,
  disabled,
  onMouseDown,
  className = '',
}: {
  children: ReactNode
  title: string
  active?: boolean
  disabled?: boolean
  onMouseDown: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`inline-rich-text-btn ${className}${active ? ' inline-rich-text-btn--active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault()
        if (!disabled) onMouseDown()
      }}
      disabled={disabled}
      aria-label={title}
      title={title}
    >
      {children}
    </button>
  )
}

function ToolbarSelect({
  title,
  value,
  onChange,
  children,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <select
      className="inline-rich-text-select"
      title={title}
      aria-label={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </select>
  )
}

function ColorSwatch({
  color,
  active,
  title,
  onPick,
}: {
  color: string
  active?: boolean
  title: string
  onPick: () => void
}) {
  return (
    <button
      type="button"
      className={`inline-rich-text-swatch${active ? ' inline-rich-text-swatch--active' : ''}`}
      style={{ backgroundColor: color }}
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onPick()
      }}
    />
  )
}

export function RichTextToolbar({ editor }: { editor: Editor }) {
  useToolbarState(editor)

  const textStyle = editor.getAttributes('textStyle') as { fontSize?: string; color?: string }
  const highlightColor = editor.getAttributes('highlight').color as string | undefined
  const currentFontSize = textStyle.fontSize ?? ''
  const currentColor = textStyle.color ?? '#4b4b63'

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('链接地址', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="inline-rich-text-toolbar" role="toolbar" aria-label="文本格式">
      <ToolbarGroup>
        <ToolbarButton
          title="撤销"
          disabled={!editor.can().undo()}
          onMouseDown={() => editor.chain().focus().undo().run()}
        >
          <IconUndo size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="重做"
          disabled={!editor.can().redo()}
          onMouseDown={() => editor.chain().focus().redo().run()}
        >
          <IconRedo size={15} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarSelect
          title="字号"
          value={currentFontSize}
          onChange={(value) => {
            if (value) editor.chain().focus().setFontSize(value).run()
            else editor.chain().focus().unsetFontSize().run()
          }}
        >
          {FONT_SIZE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </ToolbarSelect>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          title="加粗"
          active={editor.isActive('bold')}
          className="inline-rich-text-btn--bold"
          onMouseDown={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="斜体"
          active={editor.isActive('italic')}
          className="inline-rich-text-btn--italic"
          onMouseDown={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="下划线"
          active={editor.isActive('underline')}
          className="inline-rich-text-btn--underline"
          onMouseDown={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>
        <ToolbarButton
          title="删除线"
          active={editor.isActive('strike')}
          className="inline-rich-text-btn--strike"
          onMouseDown={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <span className="inline-rich-text-color-label">字色</span>
        {TEXT_COLORS.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            active={currentColor.toLowerCase() === color.toLowerCase()}
            title={`文字颜色 ${color}`}
            onPick={() => editor.chain().focus().setColor(color).run()}
          />
        ))}
        <label className="inline-rich-text-color-input" title="自定义文字颜色">
          <input
            type="color"
            value={currentColor.startsWith('#') ? currentColor : '#4b4b63'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </label>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <span className="inline-rich-text-color-label">高亮</span>
        {HIGHLIGHT_COLORS.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            active={highlightColor?.toLowerCase() === color.toLowerCase()}
            title={`背景高亮 ${color}`}
            onPick={() => editor.chain().focus().toggleHighlight({ color }).run()}
          />
        ))}
        <ToolbarButton
          title="清除高亮"
          onMouseDown={() => editor.chain().focus().unsetHighlight().run()}
        >
          ∅
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          title="左对齐"
          active={editor.isActive({ textAlign: 'left' })}
          onMouseDown={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <IconAlignLeft />
        </ToolbarButton>
        <ToolbarButton
          title="居中对齐"
          active={editor.isActive({ textAlign: 'center' })}
          onMouseDown={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <IconAlignCenter />
        </ToolbarButton>
        <ToolbarButton
          title="右对齐"
          active={editor.isActive({ textAlign: 'right' })}
          onMouseDown={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <IconAlignRight />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          title="无序列表"
          active={editor.isActive('bulletList')}
          onMouseDown={() => editor.chain().focus().toggleBulletList().run()}
        >
          <IconBulletList />
        </ToolbarButton>
        <ToolbarButton
          title="有序列表"
          active={editor.isActive('orderedList')}
          onMouseDown={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <IconOrderedList />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton title="插入链接" active={editor.isActive('link')} onMouseDown={setLink}>
          <IconLink />
        </ToolbarButton>
        <ToolbarButton
          title="清除格式"
          onMouseDown={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().unsetColor().unsetHighlight().run()
          }
        >
          <IconClear />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  )
}

function IconAlignLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  )
}

function IconAlignCenter() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function IconAlignRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconBulletList() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconOrderedList() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">
        1
      </text>
      <text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">
        2
      </text>
      <text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">
        3
      </text>
    </svg>
  )
}

function IconLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconClear() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}
