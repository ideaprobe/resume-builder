import { useRef, useState } from 'react'
import { useSaveFlush } from '../../context/SaveFlushContext'
import { compressImage } from '../../utils/compressImage'

interface AvatarUploadProps {
  value: string
  onChange: (dataUrl: string) => void
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const flushSave = useSaveFlush()
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件（JPG、PNG 等）')
      return
    }
    setUploading(true)
    try {
      const dataUrl = await compressImage(file)
      onChange(dataUrl)
      flushSave?.()
    } catch {
      alert('图片处理失败，请换一张 JPG/PNG 图片试试（HEIC 格式请先转换）')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="resume-avatar-wrap">
      <button
        type="button"
        className="resume-avatar"
        disabled={uploading}
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
            <span>{uploading ? '处理中…' : '上传头像'}</span>
          </span>
        )}
      </button>
      {value && (
        <button
          type="button"
          className="resume-avatar-remove"
          onClick={(e) => {
            e.stopPropagation()
            onChange('')
            flushSave?.()
          }}
        >
          移除
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void handleFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
