import { useCallback, useEffect, useRef, useState } from 'react'
import type { ResumeContent } from '../types/resume'

export type EditorSnapshot = {
  title: string
  content: ResumeContent
}

const MAX_HISTORY = 50
const DEBOUNCE_MS = 500

function cloneSnapshot(snapshot: EditorSnapshot): EditorSnapshot {
  return { title: snapshot.title, content: structuredClone(snapshot.content) }
}

function snapshotsEqual(a: EditorSnapshot | null, b: EditorSnapshot | null): boolean {
  if (!a || !b) return a === b
  return a.title === b.title && JSON.stringify(a.content) === JSON.stringify(b.content)
}

export function useEditorHistory(
  title: string,
  content: ResumeContent | null,
  setTitle: (title: string) => void,
  setContent: (content: ResumeContent) => void,
) {
  const past = useRef<EditorSnapshot[]>([])
  const future = useRef<EditorSnapshot[]>([])
  const committed = useRef<EditorSnapshot | null>(null)
  const applying = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const syncFlags = useCallback(() => {
    setCanUndo(past.current.length > 0)
    setCanRedo(future.current.length > 0)
  }, [])

  const resetHistory = useCallback(
    (snapshot: EditorSnapshot) => {
      past.current = []
      future.current = []
      committed.current = cloneSnapshot(snapshot)
      syncFlags()
    },
    [syncFlags],
  )

  const applySnapshot = useCallback(
    (snapshot: EditorSnapshot) => {
      applying.current = true
      setTitle(snapshot.title)
      setContent(snapshot.content)
      committed.current = cloneSnapshot(snapshot)
      applying.current = false
      syncFlags()
    },
    [setTitle, setContent, syncFlags],
  )

  useEffect(() => {
    if (!content || applying.current) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      const current = { title, content }
      if (!committed.current) {
        committed.current = cloneSnapshot(current)
        return
      }
      if (snapshotsEqual(committed.current, current)) return

      past.current.push(cloneSnapshot(committed.current))
      if (past.current.length > MAX_HISTORY) past.current.shift()
      future.current = []
      committed.current = cloneSnapshot(current)
      syncFlags()
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [title, content, syncFlags])

  const undo = useCallback(() => {
    if (!content || past.current.length === 0) return
    const current = cloneSnapshot({ title, content })
    const previous = past.current.pop()!
    future.current.push(current)
    applySnapshot(previous)
  }, [title, content, applySnapshot])

  const redo = useCallback(() => {
    if (!content || future.current.length === 0) return
    const current = cloneSnapshot({ title, content })
    const next = future.current.pop()!
    past.current.push(current)
    applySnapshot(next)
  }, [title, content, applySnapshot])

  const clearHistory = useCallback(() => {
    if (!content) return
    resetHistory({ title, content })
  }, [title, content, resetHistory])

  return { canUndo, canRedo, undo, redo, resetHistory, clearHistory }
}
