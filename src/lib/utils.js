import { HOSTEL } from '../config'

export const cx = (...classes) => classes.filter(Boolean).join(' ')

export const inr = (n) =>
  `${HOSTEL.currency}${(n ?? 0).toLocaleString('en-IN')}`

export const formatDate = (d, withYear = true) => {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

export const timeAgo = (d) => {
  if (!d) return '—'
  const diff = Date.now() - new Date(d).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  return formatDate(d)
}

export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase()

export const STATUS_STYLES = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  occupied: 'bg-rose-50 text-rose-700 ring-rose-200',
  reserved: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  unpaid: 'bg-rose-50 text-rose-700 ring-rose-200',
  open: 'bg-amber-50 text-amber-700 ring-amber-200',
  in_progress: 'bg-sky-50 text-sky-700 ring-sky-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  refresh: 'bg-sky-50 text-sky-700 ring-sky-200',
}

export function bedStatusLabel(status) {
  const map = { available: 'Available', occupied: 'Occupied', reserved: 'Reserved' }
  return map[status] || status
}

export function getTodayMenu() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = days[new Date().getDay()]
  return today
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const PAGE_TITLES = {
  '/': 'Home',
  '/about': 'About',
  '/rooms': 'Rooms',
  '/facilities': 'Facilities',
  '/food': 'Food',
  '/gallery': 'Gallery',
  '/reviews': 'Reviews',
  '/contact': 'Contact',
  '/booking': 'Book a Room',
  '/login': 'Student Login',
  '/register': 'Create Account',
  '/verify': 'Verify Account',
  '/payment': 'Payment',
  '/payment-success': 'Payment Success',
}