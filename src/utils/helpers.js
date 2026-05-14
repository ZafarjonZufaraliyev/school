export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

export const avatarColor = (name = '') => {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
    '#14b8a6',
  ]
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const fileExtension = (filename = '') => filename.split('.').pop().toLowerCase()

export const isImageFile = (filename = '') =>
  ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension(filename))
