import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { setToken } from '../api/client'

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
    } catch {
      setError('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="resume-name text-3xl font-semibold text-stone-900">Resume</h1>
          <p className="text-stone-500 mt-2 text-sm">专业简历，所见即所得</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-(--app-surface) p-8 rounded-2xl shadow-xl shadow-stone-300/30 border border-stone-200/60 space-y-5"
        >
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
              账号
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-orange-100 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-orange-100 bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-stone-50 py-2.5 rounded-lg hover:bg-stone-800 disabled:opacity-50 font-medium transition-colors"
          >
            {loading ? '登录中...' : '进入编辑器'}
          </button>

          <p className="text-xs text-stone-400 text-center">演示账号 demo / demo123</p>
        </form>
      </div>
    </div>
  )
}
