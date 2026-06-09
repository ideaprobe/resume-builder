import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthGuard } from './components/AuthGuard'
import { LoginPage } from './pages/LoginPage'
import { ResumeListPage } from './pages/ResumeListPage'
import { getToken } from './api/client'

const EditorPage = lazy(() =>
  import('./pages/EditorPage').then((m) => ({ default: m.EditorPage })),
)

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={getToken() ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/"
            element={
              <AuthGuard>
                <ResumeListPage />
              </AuthGuard>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <AuthGuard>
                <Suspense
                  fallback={
                    <div className="h-screen flex items-center justify-center bg-base-200">
                      <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                  }
                >
                  <EditorPage />
                </Suspense>
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
