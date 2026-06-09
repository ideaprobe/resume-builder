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
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`inline-field ${inline ? 'inline-field--inline' : ''} ${className}`}
    />
  )
}
