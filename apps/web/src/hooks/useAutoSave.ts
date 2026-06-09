import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay = 1000,
) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const isFirst = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (data == null) return

    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (timer.current) clearTimeout(timer.current)
    setStatus('idle')

    timer.current = setTimeout(async () => {
      setStatus('saving')
      try {
        await saveFn(data)
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data, saveFn, delay])

  return status
}
