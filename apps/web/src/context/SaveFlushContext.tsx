import { createContext, useContext, type ReactNode } from 'react'

const SaveFlushContext = createContext<(() => void) | null>(null)

export function SaveFlushProvider({
  flush,
  children,
}: {
  flush: () => void
  children: ReactNode
}) {
  return <SaveFlushContext.Provider value={flush}>{children}</SaveFlushContext.Provider>
}

export function useSaveFlush() {
  return useContext(SaveFlushContext)
}
