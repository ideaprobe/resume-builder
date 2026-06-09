interface ItemActionsProps {
  onCopy: () => void
  onDelete: () => void
  variant?: 'app' | 'resume'
}

export function ItemActions({ onCopy, onDelete, variant = 'app' }: ItemActionsProps) {
  if (variant === 'resume') {
    return (
      <div className="resume-editor-bar">
        <button type="button" onClick={onCopy} className="resume-editor-btn">
          复制
        </button>
        <button type="button" onClick={onDelete} className="resume-editor-btn resume-editor-btn--danger">
          删除
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
      <button type="button" onClick={onCopy} className="btn btn-ghost btn-xs">
        复制
      </button>
      <button type="button" onClick={onDelete} className="btn btn-ghost btn-xs text-error">
        删除
      </button>
    </div>
  )
}
