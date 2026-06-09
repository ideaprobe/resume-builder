import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { clearToken } from '../api/client'
import { createResume, deleteResume, fetchResumes } from '../api/resumes'
import { fetchMe } from '../api/auth'

export function ResumeListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: fetchMe })
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
  })

  const createMutation = useMutation({
    mutationFn: () => createResume('未命名简历'),
    onSuccess: (resume) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      navigate(`/editor/${resume.id}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="resume-name text-2xl font-semibold text-stone-900">我的简历</h1>
            {user && (
              <p className="text-sm text-stone-500 mt-1">你好，{user.username}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              className="px-4 py-2 bg-stone-900 text-stone-50 text-sm rounded-lg hover:bg-stone-800 font-medium transition-colors"
            >
              + 新建
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-stone-600 border border-stone-200 rounded-lg hover:bg-white transition-colors"
            >
              退出
            </button>
          </div>
        </div>

        {isLoading && <p className="text-stone-500 text-sm">加载中...</p>}

        {!isLoading && resumes.length === 0 && (
          <div className="text-center py-20 bg-[var(--app-surface)] rounded-2xl border border-dashed border-stone-300">
            <p className="text-stone-500 mb-4">还没有简历</p>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              className="text-[var(--app-accent)] hover:underline text-sm font-medium"
            >
              创建第一份简历 →
            </button>
          </div>
        )}

        <ul className="space-y-3">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="group flex items-center justify-between bg-[var(--app-surface)] rounded-xl border border-stone-200/80 px-5 py-4 hover:shadow-md hover:shadow-stone-200/50 transition-all"
            >
              <Link to={`/editor/${resume.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 group-hover:text-[var(--app-accent)] transition-colors truncate">
                  {resume.title}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  更新于 {new Date(resume.updatedAt).toLocaleString('zh-CN')}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm('确定删除这份简历？')) {
                    deleteMutation.mutate(resume.id)
                  }
                }}
                className="text-xs text-stone-400 hover:text-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
