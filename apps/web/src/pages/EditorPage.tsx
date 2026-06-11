import '../styles/fonts-resume.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { exportResumePdf, fetchResume, updateResume } from '../api/resumes'
import { Toolbar } from '../components/editor/Toolbar'
import { IconRedo, IconUndo } from '../components/ui/UndoRedoIcons'
import { SaveFlushProvider } from '../context/SaveFlushContext'
import { ResumeTemplate, type ResumeTemplateId } from '../templates'
import { useAutoSave } from '../hooks/useAutoSave'
import { useEditorHistory } from '../hooks/useEditorHistory'
import { useEditorStore } from '../store/editorStore'
import { createMachaoSampleContent, MACHAO_SAMPLE_TITLE } from '../data/sampleMachao'
import { createEmptyCustomSection, normalizeBasicsFields, normalizeTheme } from '../types/resume'

const saveStatusLabel = {
  idle: '',
  saving: '保存中...',
  saved: '已保存',
  error: '保存失败',
} as const

export function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const { title, content, setResume, setTitle, setContent, updateTheme } = useEditorStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => fetchResume(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      const normalized = {
        ...data.content,
        theme: normalizeTheme(data.content.theme),
        sections: data.content.sections.map((s) =>
          s.type === 'basics'
            ? { ...s, fields: normalizeBasicsFields(s.fields) }
            : s,
        ),
      }
      setResume(data.id, data.title, normalized)
    }
  }, [data, setResume])

  const [exporting, setExporting] = useState(false)

  const { canUndo, canRedo, undo, redo, resetHistory } = useEditorHistory(
    title,
    content,
    setTitle,
    setContent,
  )

  useEffect(() => {
    if (!id || !content) return
    resetHistory({ title, content })
    // 仅在切换简历时重置历史
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (exporting) return
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [exporting, undo, redo])

  const savePayload = useMemo(() => {
    if (!content) return null
    return { title, content }
  }, [title, content])

  const saveFn = useCallback(
    async (payload: { title: string; content: NonNullable<typeof content> } | null) => {
      if (!id || !payload) return
      await updateResume(id, payload)
    },
    [id],
  )

  const { status: saveStatus, flush, setPaused } = useAutoSave(savePayload, saveFn)

  const handleExport = async () => {
    if (!id || exporting) return
    setExporting(true)
    setPaused(true)
    try {
      await flush({ silent: true })
      const blob = await exportResumePdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'resume'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('PDF 导出失败，请确认服务端已安装 Chrome/Chromium')
    } finally {
      setExporting(false)
      setPaused(false)
    }
  }

  const handleAddCustomSection = () => {
    if (!content) return
    const sectionTitle = prompt('请输入区块标题', '证书')
    if (!sectionTitle) return
    setContent({
      ...content,
      sections: [...content.sections, createEmptyCustomSection(sectionTitle)],
    })
  }

  const handleLoadSample = () => {
    if (!content) return
    if (!confirm('将用「马超」示例数据覆盖当前简历内容，是否继续？')) return
    const next = createMachaoSampleContent()
    setTitle(MACHAO_SAMPLE_TITLE)
    setContent(next)
    resetHistory({ title: MACHAO_SAMPLE_TITLE, content: next })
  }

  const handleTemplateChange = (templateId: ResumeTemplateId) => {
    if (!content) return
    setContent({ ...content, template: templateId })
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }
  if (error || !content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="alert alert-error">加载失败</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-base-200 relative">
      <header className="navbar bg-base-100 border-b border-base-300 px-4 shrink-0 min-h-14 z-10">
        <div className="flex-1 gap-3 min-w-0">
          <Link
            to="/"
            className="btn btn-ghost btn-sm"
            tabIndex={exporting ? -1 : undefined}
            aria-disabled={exporting}
            onClick={(e) => exporting && e.preventDefault()}
          >
            ← 返回
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="简历名称"
            disabled={exporting}
            className="input input-ghost input-sm font-semibold max-w-xs"
          />
        </div>
        <div className="flex-none items-center flex gap-2 sm:gap-3">
          <div
            className="inline-flex h-8 items-stretch overflow-hidden rounded-lg border border-base-300 bg-base-100 divide-x divide-base-300"
            role="group"
            aria-label="编辑历史"
          >
            <button
              type="button"
              className="inline-flex w-8 shrink-0 items-center justify-center text-base-content/65 hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:text-base-content/25 disabled:hover:bg-transparent transition-colors"
              disabled={exporting || !canUndo}
              onClick={undo}
              title="撤销 (Ctrl+Z)"
              aria-label="撤销"
            >
              <IconUndo />
            </button>
            <button
              type="button"
              className="inline-flex w-8 shrink-0 items-center justify-center text-base-content/65 hover:bg-base-200 hover:text-base-content disabled:cursor-not-allowed disabled:text-base-content/25 disabled:hover:bg-transparent transition-colors"
              disabled={exporting || !canRedo}
              onClick={redo}
              title="重做 (Ctrl+Shift+Z)"
              aria-label="重做"
            >
              <IconRedo />
            </button>
          </div>
          {!exporting &&
            (saveStatus === 'saving' || saveStatus === 'saved' || saveStatus === 'error') && (
              <span
                className={`badge badge-sm h-8 min-h-8 gap-1.5 px-3 py-0 font-normal border ${
                  saveStatus === 'error'
                    ? 'badge-error badge-outline'
                    : saveStatus === 'saved'
                      ? 'badge-success badge-outline'
                      : 'badge-ghost border-base-300 bg-base-100/80'
                }`}
              >
                {saveStatus === 'saving' && (
                  <span className="loading loading-spinner loading-xs shrink-0" />
                )}
                {saveStatusLabel[saveStatus]}
              </span>
            )}
          <button
            type="button"
            className="btn btn-primary btn-sm min-w-[6.5rem]"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                导出中
              </>
            ) : (
              '导出 PDF'
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative" inert={exporting ? true : undefined}>
        <Toolbar
          theme={content.theme}
          templateId={content.template}
          onThemeChange={updateTheme}
          onTemplateChange={handleTemplateChange}
          onAddCustomSection={handleAddCustomSection}
          onLoadSample={handleLoadSample}
          disabled={exporting}
        />
        <main
          className="flex-1 overflow-auto py-10 px-4 lg:px-10 bg-[oklch(94%_0.01_250)]"
          aria-busy={exporting}
        >
          <SaveFlushProvider flush={flush}>
            <ResumeTemplate content={content} onChange={setContent} />
          </SaveFlushProvider>
        </main>

        {exporting && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-base-200/70 backdrop-blur-[2px]"
            aria-live="polite"
            aria-label="正在导出 PDF"
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-base-100 px-10 py-8 shadow-xl border border-base-300">
              <span className="loading loading-spinner loading-lg text-primary" />
              <div className="text-center">
                <p className="font-medium text-base-content">正在生成 PDF</p>
                <p className="mt-1 text-sm text-base-content/60">正在保存并生成文件，完成后将自动下载</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
