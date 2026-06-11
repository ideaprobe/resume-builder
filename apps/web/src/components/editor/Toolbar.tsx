import {
  findThemePreset,
  themeFromPreset,
  THEME_LINEAR_PRESETS,
  THEME_MESH_PRESETS,
} from '../../types/resume'
import type { ResumeTheme, ThemePreset } from '../../types/resume'
import { RESUME_TEMPLATES, type ResumeTemplateId } from '../../templates'

interface ToolbarProps {
  theme: ResumeTheme
  templateId: string
  onThemeChange: (theme: ResumeTheme) => void
  onTemplateChange: (templateId: ResumeTemplateId) => void
  onAddCustomSection: () => void
  onLoadSample?: () => void
  disabled?: boolean
}

function ThemePresetGrid({
  presets,
  activePresetId,
  disabled,
  onSelect,
}: {
  presets: ThemePreset[]
  activePresetId?: string
  disabled: boolean
  onSelect: (preset: ThemePreset) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {presets.map((preset) => {
        const isActive = activePresetId === preset.id
        const isMesh = preset.gradientStyle === 'mesh'
        const sampleColor = preset.heroText ?? (preset.heroTone === 'light' ? '#ffffff' : '#1e1e2f')
        const sampleShadow = isMesh || preset.heroTone === 'dark' ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.22)'
        const swatchStyle = isMesh
          ? {
              backgroundColor: '#ffffff',
              backgroundImage: preset.regionalGradient ?? preset.gradient,
            }
          : { background: preset.gradient }
        return (
          <button
            key={preset.id}
            type="button"
            title={preset.label}
            disabled={disabled}
            onClick={() => onSelect(preset)}
            className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md ${
              isActive
                ? 'border-primary ring-2 ring-primary/25 shadow-sm'
                : 'border-base-300 hover:border-base-content/20'
            }`}
          >
            <div
              className="relative flex h-12 items-center justify-center"
              style={swatchStyle}
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
  )
}

export function Toolbar({
  theme,
  templateId,
  onThemeChange,
  onTemplateChange,
  onAddCustomSection,
  onLoadSample,
  disabled = false,
}: ToolbarProps) {
  const activePreset = findThemePreset(theme)

  return (
    <aside className="w-64 shrink-0 h-full min-h-0 overflow-y-auto bg-base-100 border-r border-base-300 p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          简历模板
        </h3>
        <div className="flex flex-col gap-2">
          {RESUME_TEMPLATES.map((tpl) => {
            const active = templateId === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                disabled={disabled}
                onClick={() => onTemplateChange(tpl.id)}
                className={`btn btn-sm justify-start ${active ? 'btn-primary' : 'btn-ghost'}`}
              >
                {tpl.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="divider my-0" />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          简历主题
        </h3>
        <p className="text-[0.65rem] font-medium text-base-content/55 mb-2">经典线性</p>
        <ThemePresetGrid
          presets={THEME_LINEAR_PRESETS}
          activePresetId={activePreset?.id}
          disabled={disabled}
          onSelect={(preset) => onThemeChange(themeFromPreset(preset))}
        />
        <p className="text-[0.65rem] font-medium text-base-content/55 mt-4 mb-2">流动 Mesh</p>
        <ThemePresetGrid
          presets={THEME_MESH_PRESETS}
          activePresetId={activePreset?.id}
          disabled={disabled}
          onSelect={(preset) => onThemeChange(themeFromPreset(preset))}
        />
        <p className="text-[0.65rem] text-base-content/45 mt-3 leading-relaxed">
          {activePreset?.label ?? '自定义主题'}
          {activePreset?.gradientStyle === 'mesh' ? ' · 白底区域色块' : ''} · 强调色与文字对比自动适配
        </p>
      </div>

      <div className="divider my-0" />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
          内容区块
        </h3>
        <button
          type="button"
          className="btn btn-primary btn-sm w-full"
          disabled={disabled}
          onClick={onAddCustomSection}
        >
          + 自定义区块
        </button>
        {onLoadSample && (
          <button
            type="button"
            className="btn btn-outline btn-sm w-full mt-2"
            disabled={disabled}
            onClick={onLoadSample}
          >
            加载马超示例
          </button>
        )}
      </div>

      <div className="mt-auto">
        <div className="alert alert-info alert-soft text-xs">
          <span>
            单击编辑 · 拖拽排序 · Ctrl+Z 撤销
          </span>
        </div>
      </div>
    </aside>
  )
}
