import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { exportResumePdf, fetchResume, updateResume } from '../api/resumes'
import { Toolbar } from '../components/editor/Toolbar'
import { DefaultTemplate } from '../templates/default'
import { useAutoSave } from '../hooks/useAutoSave'
import { useEditorStore } from '../store/editorStore'
import { createEmptyCustomSection } from '../types/resume'

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
      setResume(data.id, data.title, data.content)
    }
  }, [data, setResume])

  const savePayload = useMemo(() => {
    if (!content) return null
    return { title, content }
  }, [title, content])

  const saveFn = useCallback(
    async (payload: { title: string; content: NonNullable<typeof content> }) => {
      if (!id) return
      await updateResume(id, payload)
    },
    [id],
  )

  const saveStatus = useAutoSave(savePayload, async (payload) => {
    if (!payload) return
    await saveFn(payload)
  })

  const handleExport = async () => {
    if (!id) return
    try {
      const blob = await exportResumePdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'resume'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('PDF 导出失败，请确认服务端已安装 Chrome/Chromium')
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-stone-500">
        加载中...
      </div>
    )
  }
  if (error || !content) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        加载失败
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--app-bg)]">
      <header className="h-14 bg-[var(--app-surface)] border-b border-stone-200/80 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors shrink-0"
          >
            ← 返回
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="简历名称"
            className="inline-field font-semibold text-base text-stone-800 max-w-xs"
          />
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`text-xs ${
              saveStatus === 'error' ? 'text-red-500' : 'text-stone-400'
            }`}
          >
            {saveStatusLabel[saveStatus]}
          </span>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 bg-stone-900 text-stone-50 text-sm rounded-lg hover:bg-stone-800 transition-colors font-medium"
          >
            导出 PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          backgroundColor={content.theme.backgroundColor}
          onBackgroundChange={updateTheme}
          onAddCustomSection={handleAddCustomSection}
        />
        <main className="flex-1 overflow-auto py-10 px-6 bg-[var(--app-bg)]">
          <DefaultTemplate content={content} onChange={setContent} />
        </main>
      </div>
    </div>
  )
}
