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
  const dataRef = useRef(data)
  dataRef.current = data

  const flush = useCallback(async () => {
    if (dataRef.current == null) return
    if (timer.current) clearTimeout(timer.current)
    setStatus('saving')
    try {
      await saveFn(dataRef.current)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [saveFn])

  useEffect(() => {
    if (data == null) return

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (timer.current) clearTimeout(timer.current)
    setStatus('idle')

    timer.current = setTimeout(() => {
      void flush()
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data, delay, flush])

  return { status, flush }
}
