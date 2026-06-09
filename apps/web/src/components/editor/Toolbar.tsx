import { PRESET_COLORS } from '../../types/resume'

interface ToolbarProps {
  backgroundColor: string
  onBackgroundChange: (color: string) => void
  onAddCustomSection: () => void
}

export function Toolbar({
  backgroundColor,
  onBackgroundChange,
  onAddCustomSection,
}: ToolbarProps) {
  return (
    <aside className="w-60 shrink-0 bg-[var(--app-surface)] border-r border-stone-200/80 p-5 space-y-8">
      <div>
        <h3 className="text-xs font-semibold tracking-wider uppercase text-stone-500 mb-4">
          页面背景
        </h3>
        <div className="grid grid-cols-5 gap-2.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => onBackgroundChange(c.value)}
              className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                backgroundColor === c.value
                  ? 'border-[var(--app-accent)] ring-2 ring-orange-200 scale-105'
                  : 'border-stone-200'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider uppercase text-stone-500 mb-4">
          内容区块
        </h3>
        <button
          type="button"
          onClick={onAddCustomSection}
          className="w-full text-sm px-4 py-2.5 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors font-medium"
        >
          + 自定义区块
        </button>
        <p className="text-[0.7rem] text-stone-400 mt-3 leading-relaxed">
          单击文字即可直接编辑，无需双击
        </p>
      </div>
    </aside>
  )
}
