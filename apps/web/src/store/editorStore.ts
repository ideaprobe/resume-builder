import { create } from 'zustand'
import type { ResumeContent, ResumeSection, ResumeTheme } from '../types/resume'

interface EditorState {
  resumeId: string | null
  title: string
  content: ResumeContent | null
  setResume: (id: string, title: string, content: ResumeContent) => void
  setTitle: (title: string) => void
  setContent: (content: ResumeContent) => void
  updateSections: (sections: ResumeSection[]) => void
  updateGradient: (gradient: string) => void
  updateTheme: (theme: ResumeTheme) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  resumeId: null,
  title: '',
  content: null,
  setResume: (id, title, content) => set({ resumeId: id, title, content }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  updateSections: (sections) =>
    set((s) => ({
      content: s.content ? { ...s.content, sections } : null,
    })),
  updateGradient: (gradient) =>
    set((s) => ({
      content: s.content
        ? { ...s.content, theme: { ...s.content.theme, gradient } }
        : null,
    })),
  updateTheme: (theme) =>
    set((s) => ({
      content: s.content ? { ...s.content, theme: { ...s.content.theme, ...theme } } : null,
    })),
}))
