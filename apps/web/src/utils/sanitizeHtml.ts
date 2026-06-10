import DOMPurify from 'dompurify'

const COLOR_PATTERN = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\))$/

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'del',
    'ul',
    'ol',
    'li',
    'br',
    'span',
    'a',
    'mark',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
  ALLOWED_STYLES: {
    '*': {
      'text-align': [/^left$/, /^center$/, /^right$/],
      'font-size': [/^\d+(\.\d+)?px$/],
      color: [COLOR_PATTERN],
      'background-color': [COLOR_PATTERN],
    },
  },
}

/** Sanitize stored HTML via DOMPurify. */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return String(DOMPurify.sanitize(html, PURIFY_CONFIG)).trim()
}

/** Plain text → minimal HTML (preserve line breaks) for legacy resume data. */
export function plainTextToHtml(text: string): string {
  if (!text) return ''
  if (/<[a-z][\s\S]*>/i.test(text)) return sanitizeHtml(text)
  return text
    .split('\n')
    .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : '<p></p>'))
    .join('')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
