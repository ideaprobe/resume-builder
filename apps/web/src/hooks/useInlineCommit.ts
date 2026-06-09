import { useCallback } from 'react'
import type { KeyboardEvent } from 'react'

type CommitElement = HTMLInputElement | HTMLTextAreaElement

/** 单行 Enter / 多行 Ctrl+Enter 提交并失焦 */
export function useInlineCommit(multiline = false) {
  return useCallback(
    (e: KeyboardEvent<CommitElement>) => {
      if (e.key !== 'Enter') return

      if (multiline) {
        if (!(e.ctrlKey || e.metaKey)) return
      }

      e.preventDefault()
      e.currentTarget.blur()
    },
    [multiline],
  )
}
