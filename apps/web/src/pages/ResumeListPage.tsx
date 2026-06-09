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
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
        <div className="flex-1">
          <span className="text-lg font-bold text-primary">Resume</span>
          {user && (
            <span className="ml-3 text-sm text-base-content/60 hidden sm:inline">
              你好，{user.username}
            </span>
          )}
        </div>
        <div className="flex-none gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => createMutation.mutate()}
          >
            + 新建简历
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            退出
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-1">我的简历</h1>
        <p className="text-base-content/60 text-sm mb-8">管理并编辑你的所有简历版本</p>

        {isLoading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {!isLoading && resumes.length === 0 && (
          <div className="card bg-base-100 border border-dashed border-base-300">
            <div className="card-body items-center text-center py-16">
              <p className="text-base-content/60">还没有简历，创建第一份吧</p>
              <button
                type="button"
                className="btn btn-primary btn-sm mt-2"
                onClick={() => createMutation.mutate()}
              >
                创建简历
              </button>
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {resumes.map((resume) => (
            <li key={resume.id}>
              <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body py-4 px-5 flex-row items-center gap-4">
                  <Link to={`/editor/${resume.id}`} className="flex-1 min-w-0 group">
                    <p className="font-semibold truncate group-hover:text-primary transition-colors">
                      {resume.title}
                    </p>
                    <p className="text-xs text-base-content/50 mt-0.5">
                      更新于 {new Date(resume.updatedAt).toLocaleString('zh-CN')}
                    </p>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      if (confirm('确定删除这份简历？')) {
                        deleteMutation.mutate(resume.id)
                      }
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
