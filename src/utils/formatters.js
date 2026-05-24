import dayjs from 'dayjs'
import 'dayjs/locale/uz'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale('uz')

export const formatDate = (date, fmt = 'DD.MM.YYYY') => (date ? dayjs(date).format(fmt) : '—')

export const formatDateTime = (date) => (date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '—')

export const formatTime = (date) => (date ? dayjs(date).format('HH:mm') : '—')

export const fromNow = (date) => (date ? dayjs(date).fromNow() : '—')

export const minutesToHm = (minutes) => {
  if (!minutes || minutes < 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} daq`
  return m === 0 ? `${h} soat` : `${h} soat ${m} daq`
}

export const formatPercent = (val) =>
  val !== null && val !== undefined ? `${Math.round(val)}%` : '—'
