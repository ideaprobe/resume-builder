import { PRESET_GRADIENTS, resolveGradient } from '../../types/resume'
import type { ResumeTheme } from '../../types/resume'

interface ToolbarProps {
  theme: ResumeTheme
  onGradientChange: (gradient: string) => void
  onAddCustomSection: () => void
}

export function Toolbar({ theme, onGradientChange, onAddCustomSection }: ToolbarProps) {
  const current = resolveGradient(theme)

  return (
    <aside className="w-64 shrink-0 bg-base-100 border-r border-base-300 p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          区块渐变
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_GRADIENTS.map((g) => (
            <button
              key={g.label}
              type="button"
              title={g.label}
              onClick={() => onGradientChange(g.gradient)}
              className={`h-10 rounded-lg border-2 transition-transform hover:scale-[1.02] ${
                current === g.gradient ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'
              }`}
              style={{ background: g.gradient }}
            >
              <span className="sr-only">{g.label}</span>
            </button>
          ))}
        </div>
        <p className="text-[0.65rem] text-base-content/45 mt-2">{PRESET_GRADIENTS.find((g) => g.gradient === current)?.label ?? '自定义'}</p>
      </div>

      <div className="divider my-0" />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          内容区块
        </h3>
        <button type="button" className="btn btn-primary btn-sm w-full" onClick={onAddCustomSection}>
          + 自定义区块
        </button>
      </div>

      <div className="mt-auto">
        <div className="alert alert-info alert-soft text-xs">
          <span>单击文字编辑 · 点击头像上传照片</span>
        </div>
      </div>
    </aside>
  )
}
