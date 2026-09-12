import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'

// Resolves the logged-in student's full dataset entry (room, bed, payments...).
// In demo mode the demo student is the first generated student.
export function useStudent() {
  const { students, bookings, payments, roomByNumber } = useData()
  const { profile } = useAuth()

  return useMemo(() => {
    const byId = students.find((s) => String(s.id) === String(profile?.id))
    const student = byId || students[0]

    if (!student) return { student: null, room: null, bookings: [], payments: [] }

    const room = roomByNumber(student.roomNumber)
    const myBookings = bookings.filter(
      (b) =>
        String(b.studentId) === String(student.id) ||
        String(b.bedId) === String(student.bedId) ||
        (b.studentName || '').toLowerCase() === (student.name || '').toLowerCase(),
    )
    const myPayments = payments.filter(
      (p) =>
        String(p.studentId) === String(student.id) ||
        (p.studentName || '').toLowerCase() === (student.name || '').toLowerCase(),
    )

    return { student, room, bookings: myBookings, payments: myPayments }
  }, [students, bookings, payments, roomByNumber, profile])
}