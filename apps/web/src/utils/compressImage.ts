import { encode } from '@jsquash/jpeg'
import resize from '@jsquash/resize'

const MAX_SIZE = 512
const MAX_BYTES = 200 * 1024

async function fileToImageData(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('canvas unsupported')
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function arrayBufferToDataUrl(buffer: ArrayBuffer): Promise<string> {
  const blob = new Blob([buffer], { type: 'image/jpeg' })
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/** Resize + JPEG encode via @jsquash (WebAssembly). */
export async function compressImage(file: File): Promise<string> {
  const imageData = await fileToImageData(file)
  const scale = Math.min(1, MAX_SIZE / Math.max(imageData.width, imageData.height))
  const width = Math.round(imageData.width * scale)
  const height = Math.round(imageData.height * scale)

  const resized =
    width === imageData.width && height === imageData.height
      ? imageData
      : await resize(imageData, { width, height, fitMethod: 'contain' })

  let quality = 85
  let jpeg = await encode(resized, { quality })
  while (jpeg.byteLength > MAX_BYTES && quality > 40) {
    quality -= 10
    jpeg = await encode(resized, { quality })
  }

  if (jpeg.byteLength > MAX_BYTES) {
    throw new Error('too large')
  }

  return arrayBufferToDataUrl(jpeg)
}
