import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { exportResumePdf, fetchResume, updateResume } from '../api/resumes'
import { Toolbar } from '../components/editor/Toolbar'
import { DefaultTemplate } from '../templates/default'
import { useAutoSave } from '../hooks/useAutoSave'
import { useEditorStore } from '../store/editorStore'
import { createEmptyCustomSection, normalizeBasicsFields, resolveGradient } from '../types/resume'

const saveStatusLabel = {
  idle: '',
  saving: '保存中...',
  saved: '已保存',
  error: '保存失败',
} as const

export function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const { title, content, setResume, setTitle, setContent, updateGradient } = useEditorStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => fetchResume(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      const normalized = {
        ...data.content,
        theme: {
          ...data.content.theme,
          gradient: resolveGradient(data.content.theme),
        },
        sections: data.content.sections.map((s) =>
          s.type === 'basics'
            ? { ...s, fields: normalizeBasicsFields(s.fields) }
            : s,
        ),
      }
      setResume(data.id, data.title, normalized)
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
    <div className="h-screen flex flex-col bg-base-200">
      <header className="navbar bg-base-100 border-b border-base-300 px-4 shrink-0 min-h-14">
        <div className="flex-1 gap-3 min-w-0">
          <Link to="/" className="btn btn-ghost btn-sm">
            ← 返回
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="简历名称"
            className="input input-ghost input-sm font-semibold max-w-xs"
          />
        </div>
        <div className="flex-none gap-3 items-center flex">
          {saveStatus !== 'idle' && (
            <span
              className={`badge badge-sm ${
                saveStatus === 'error' ? 'badge-error' : saveStatus === 'saved' ? 'badge-success' : 'badge-ghost'
              }`}
            >
              {saveStatusLabel[saveStatus]}
            </span>
          )}
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExport}>
            导出 PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          theme={content.theme}
          onGradientChange={updateGradient}
          onAddCustomSection={handleAddCustomSection}
        />
        <main className="flex-1 overflow-auto py-8 px-4 lg:px-8">
          <DefaultTemplate content={content} onChange={setContent} />
        </main>
      </div>
    </div>
  )
}
