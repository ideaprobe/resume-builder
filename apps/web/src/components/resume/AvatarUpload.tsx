import { useRef } from 'react'

interface AvatarUploadProps {
  value: string
  onChange: (dataUrl: string) => void
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 800 * 1024) {
      alert('图片请小于 800KB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="resume-avatar-wrap">
      <button
        type="button"
        className="resume-avatar"
        onClick={() => inputRef.current?.click()}
        title="点击上传头像"
      >
        {value ? (
          <img src={value} alt="头像" className="resume-avatar-img" />
        ) : (
          <span className="resume-avatar-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>上传头像</span>
          </span>
        )}
      </button>
      {value && (
        <button type="button" className="resume-avatar-remove" onClick={() => onChange('')}>
          移除
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
