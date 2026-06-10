import { useCallback, useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay = 1000,
) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const isFirst = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef = useRef(data)
  dataRef.current = data
  const saveFnRef = useRef(saveFn)
  saveFnRef.current = saveFn
  const pausedRef = useRef(false)

  const clearSavedFade = () => {
    if (savedFadeTimer.current) {
      clearTimeout(savedFadeTimer.current)
      savedFadeTimer.current = null
    }
  }

  const flush = useCallback(async (options?: { silent?: boolean }) => {
    if (dataRef.current == null) return
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    clearSavedFade()
    if (!options?.silent) setStatus('saving')
    try {
      await saveFnRef.current(dataRef.current)
      if (!options?.silent) {
        setStatus('saved')
        savedFadeTimer.current = setTimeout(() => {
          setStatus((s) => (s === 'saved' ? 'idle' : s))
        }, 2000)
      }
    } catch {
      if (!options?.silent) setStatus('error')
      throw new Error('save failed')
    }
  }, [])

  const setPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused
    if (paused && timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => {
    if (data == null) return

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (pausedRef.current) return

    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      if (pausedRef.current) return
      void flush()
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data, delay, flush])

  useEffect(() => () => clearSavedFade(), [])

  return { status, flush, setPaused }
}
