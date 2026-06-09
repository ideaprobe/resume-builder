import {
  findThemePreset,
  resolveGradient,
  themeFromPreset,
  THEME_PRESETS,
} from '../../types/resume'
import type { ResumeTheme } from '../../types/resume'

interface ToolbarProps {
  theme: ResumeTheme
  onThemeChange: (theme: ResumeTheme) => void
  onAddCustomSection: () => void
}

export function Toolbar({ theme, onThemeChange, onAddCustomSection }: ToolbarProps) {
  const currentGradient = resolveGradient(theme)
  const activePreset = findThemePreset(theme)

  return (
    <aside className="w-64 shrink-0 bg-base-100 border-r border-base-300 p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          页眉配色
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_PRESETS.map((preset) => {
            const isActive = currentGradient === preset.gradient
            const sampleColor = preset.heroText ?? (preset.heroTone === 'light' ? '#ffffff' : '#0f172a')
            const sampleShadow =
              preset.heroTone === 'light'
                ? '0 1px 2px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.22)'
                : '0 1px 2px rgba(255,255,255,0.9)'
            return (
              <button
                key={preset.id}
                type="button"
                title={preset.label}
                onClick={() => onThemeChange(themeFromPreset(preset))}
                className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md ${
                  isActive
                    ? 'border-primary ring-2 ring-primary/25 shadow-sm'
                    : 'border-base-300 hover:border-base-content/20'
                }`}
              >
                <div
                  className="relative flex h-12 items-center justify-center"
                  style={{ background: preset.gradient }}
                >
                  <span
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: sampleColor, textShadow: sampleShadow }}
                  >
                    Aa
                  </span>
                  {isActive && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-primary shadow-sm">
                      ✓
                    </span>
                  )}
                </div>
                <span className="bg-base-100 px-2 py-1.5 text-center text-[0.68rem] font-medium text-base-content/70 group-hover:text-base-content">
                  {preset.label}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-[0.65rem] text-base-content/45 mt-3 leading-relaxed">
          {activePreset?.label ?? '自定义配色'} · 浓郁渐变 + 自适应文字对比
        </p>
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
          <span>
            单击编辑 · 单行 Enter 保存 · 多行 Ctrl+Enter 保存 · 点击头像上传
          </span>
        </div>
      </div>
    </aside>
  )
}
