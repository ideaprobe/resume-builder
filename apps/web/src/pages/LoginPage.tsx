import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { ApiError, setToken } from '../api/client'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      setToken(res.token)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? '用户名或密码错误' : '服务暂时不可用，请确认后端和数据库已启动')
      } else {
        setError('无法连接服务器，请先运行 docker compose up -d 和 pnpm dev:server')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="badge badge-primary badge-outline mb-4">Resume Builder</div>
          <h1 className="text-3xl font-bold text-base-content">在线简历编辑器</h1>
          <p className="text-base-content/60 mt-2">所见即所得 · 一键导出 PDF</p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <form onSubmit={handleSubmit} className="card-body gap-4">
            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <span>{error}</span>
              </div>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">账号</legend>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
                placeholder="请输入账号"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">密码</legend>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="请输入密码"
                required
              />
            </fieldset>

            <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : '进入编辑器'}
            </button>

            <p className="text-center text-xs text-base-content/50">
              演示账号 <kbd className="kbd kbd-xs">demo</kbd>{' '}
              <kbd className="kbd kbd-xs">demo123</kbd>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
