// Light-weight module: shared column definitions, row builders, and a lazy
// wrapper around the Excel file writer. ExcelJS is NOT imported here, so the
// heavy dependency is code-split out of the main bundle and only fetched when
// the export helper is actually used.

export const HEADERS = [
  'S.No',
  'Student ID',
  'Full Name',
  'Mobile',
  'Email',
  'College',
  'Course',
  'Year',
  'Gender',
  'Room',
  'Bed',
  'Joining Date',
  'Payment Status',
  'Monthly Budget (₹)',
  'Father Name',
  'Mother Name',
  'Parent Phone',
]

export const COL_WIDTHS = [
  5, 12, 22, 13, 28, 22, 14, 8, 10, 8, 6, 12, 15, 17, 18, 18, 14,
]

export function normalizeDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

function paymentLabel(value) {
  if (value === 'paid') return 'Paid'
  if (value === 'pending') return 'Pending'
  return value ? String(value) : ''
}

function toStringValue(value) {
  return value === null || value === undefined ? '' : String(value)
}

export function buildStudentRows(students) {
  return (students || []).map((s, i) => [
    i + 1,
    toStringValue(s.id),
    toStringValue(s.name || s.fullName),
    s.mobile == null ? '' : String(s.mobile),
    toStringValue(s.email),
    toStringValue(s.college),
    toStringValue(s.course),
    s.yearOfStudy == null && s.year == null ? '' : toStringValue(s.yearOfStudy ?? s.year),
    toStringValue(s.gender),
    toStringValue(s.roomNumber),
    toStringValue(s.bed),
    normalizeDate(s.joiningDate),
    paymentLabel(s.paymentStatus),
    s.budget == null ? '' : Number(s.budget),
    toStringValue(s.fatherName),
    toStringValue(s.motherName),
    toStringValue(s.parentPhone),
  ])
}

export function columnLetter(index) {
  let letter = ''
  let n = index
  while (n > 0) {
    const rem = (n - 1) % 26
    letter = String.fromCharCode(65 + rem) + letter
    n = Math.floor((n - 1) / 26)
  }
  return letter
}

export async function exportStudentsExcel(students, { fileName } = {}) {
  const { exportStudentsExcel: writeExcel } = await import('./exportStudentsExcel.js')
  return writeExcel(students, { fileName })
}