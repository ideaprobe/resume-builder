interface InlineTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
}

export function InlineTextarea({
  value,
  onChange,
  placeholder = '点击输入',
  className = '',
  rows = 3,
}: InlineTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`inline-field inline-field--textarea ${className}`}
    />
  )
}
