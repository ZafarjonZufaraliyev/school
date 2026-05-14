import dayjs from 'dayjs'
import 'dayjs/locale/uz'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale('uz')

export const formatDate = (date, fmt = 'DD.MM.YYYY') => (date ? dayjs(date).format(fmt) : '—')

export const formatDateTime = (date) => (date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '—')

export const fromNow = (date) => (date ? dayjs(date).fromNow() : '—')

export const timeLeft = (deadline) => {
  if (!deadline) return null
  const diff = dayjs(deadline).diff(dayjs())
  if (diff <= 0) return { expired: true, label: 'Muddat tugagan' }
  const d = dayjs.duration(diff)
  const days = Math.floor(d.asDays())
  const hours = d.hours()
  const mins = d.minutes()
  if (days > 0) return { expired: false, label: `${days} kun ${hours} soat qoldi` }
  if (hours > 0) return { expired: false, label: `${hours} soat ${mins} daqiqa qoldi` }
  return { expired: false, label: `${mins} daqiqa qoldi` }
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const formatPercent = (val) =>
  val !== null && val !== undefined ? `${Math.round(val)}%` : '—'
