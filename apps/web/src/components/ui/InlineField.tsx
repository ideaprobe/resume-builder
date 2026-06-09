import { useInlineCommit } from '../../hooks/useInlineCommit'
import { useSaveFlush } from '../../context/SaveFlushContext'

interface InlineFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inline?: boolean
}

export function InlineField({
  value,
  onChange,
  placeholder = '点击输入',
  className = '',
  inline = false,
}: InlineFieldProps) {
  const handleKeyDown = useInlineCommit(false)
  const flushSave = useSaveFlush()

  const commit = () => {
    flushSave?.()
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
      placeholder={placeholder}
      className={`inline-field ${inline ? 'inline-field--inline' : ''} ${className}`}
    />
  )
}
