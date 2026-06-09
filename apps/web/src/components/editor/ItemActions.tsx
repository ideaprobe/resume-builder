interface ItemActionsProps {
  onCopy: () => void
  onDelete: () => void
  variant?: 'light' | 'dark'
}

export function ItemActions({ onCopy, onDelete, variant = 'light' }: ItemActionsProps) {
  const base =
    variant === 'dark'
      ? 'text-stone-500 hover:text-stone-200 hover:bg-white/10'
      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'

  return (
    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={onCopy}
        title="复制"
        className={`text-[0.65rem] px-1.5 py-0.5 rounded ${base}`}
      >
        复制
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="删除"
        className={`text-[0.65rem] px-1.5 py-0.5 rounded ${
          variant === 'dark'
            ? 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
            : 'text-red-400 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        删除
      </button>
    </div>
  )
}
