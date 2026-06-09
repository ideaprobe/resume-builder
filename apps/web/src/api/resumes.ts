import { api, apiBlob } from './client'
import type { Resume, ResumeContent, ResumeListItem } from '../types/resume'

export function fetchResumes() {
  return api<ResumeListItem[]>('/api/resumes')
}

export function createResume(title?: string) {
  return api<Resume>('/api/resumes', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}

export function fetchResume(id: string) {
  return api<Resume>(`/api/resumes/${id}`)
}

export function updateResume(
  id: string,
  data: { title?: string; content?: ResumeContent },
) {
  return api<Resume>(`/api/resumes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteResume(id: string) {
  return api<void>(`/api/resumes/${id}`, { method: 'DELETE' })
}

export function exportResumePdf(id: string) {
  return apiBlob(`/api/resumes/${id}/export`, { method: 'POST' })
}
