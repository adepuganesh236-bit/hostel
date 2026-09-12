// Pure state helpers for the DataContext - they apply mutations to the demo
// dataset (when Supabase is not configured) using an immutable-ish approach.

function assignRoomList(rooms, updater) {
  return rooms.map(updater)
}

export function uiActions(state, action) {
  const data = state.data
  switch (action.type) {
    case 'UPDATE_BED_STATUS': {
      const rooms = assignRoomList(data.rooms, (room) => {
        if (room.roomNumber !== String(action.roomNumber)) return room
        return {
          ...room,
          beds: room.beds.map((bed) =>
            bed.id === action.bedId
              ? { ...bed, status: action.status, studentId: action.studentId ?? bed.studentId }
              : bed,
          ),
        }
      })
      let students = data.students
      if (action.studentId) {
        students = data.students.map((s) =>
          s.id === action.studentId
            ? { ...s, roomNumber: String(action.roomNumber), bed: action.bedNumber, bedId: action.bedId, paymentStatus: s.paymentStatus || 'pending' }
            : s,
        )
      }
      return { ...state, data: { ...data, rooms, students } }
    }

    case 'UPDATE_ROOM_RENT': {
      const rooms = assignRoomList(data.rooms, (room) =>
        room.roomNumber === String(action.roomNumber)
          ? {
              ...room,
              rent: Number(action.rent),
              advance: Number(action.advance),
            }
          : room,
      )
      return { ...state, data: { ...data, rooms } }
    }

    case 'UPDATE_ROOM': {
      const rooms = assignRoomList(data.rooms, (room) =>
        room.roomNumber === String(action.room.roomNumber) ? action.room : room,
      )
      return { ...state, data: { ...data, rooms } }
    }

    case 'ADD_ROOM': {
      const rooms = [...data.rooms, action.room].sort((a, b) =>
        a.roomNumber.localeCompare(b.roomNumber),
      )
      return { ...state, data: { ...data, rooms } }
    }

    case 'REMOVE_ROOM': {
      const rooms = data.rooms.filter(
        (r) => r.roomNumber !== String(action.roomNumber),
      )
      return { ...state, data: { ...data, rooms } }
    }

    case 'ADD_BOOKING': {
      // Occupy the selected bed when a booking is created
      const rooms = assignRoomList(data.rooms, (room) => {
        const bed = room.beds.find((b) => b.id === action.booking.bedId)
        if (!bed || bed.status !== 'available') return room
        return {
          ...room,
          beds: room.beds.map((b) =>
            b.id === action.booking.bedId
              ? { ...b, status: 'occupied', studentId: action.booking.studentId }
              : b,
          ),
        }
      })
      const students = data.students.some(
        (s) => s.id === action.booking.studentId,
      )
        ? data.students.map((s) =>
            s.id === action.booking.studentId
              ? {
                  ...s,
                  roomNumber: action.booking.roomNumber,
                  bed: action.booking.bed,
                  joiningDate: action.booking.date,
                }
              : s,
          )
        : [
            ...data.students,
            {
              id: action.booking.studentId,
              name: action.booking.studentName,
              firstName: (action.booking.studentName || '').split(' ')[0],
              mobile: action.booking.studentMobile,
              email: action.booking.studentEmail,
              college: action.booking.college,
              course: action.booking.course || '',
              roomNumber: action.booking.roomNumber,
              bed: action.booking.bed,
              joiningDate: action.booking.date,
              paymentStatus: 'pending',
            },
          ]
      const bookings = [
        ...data.bookings,
        {
          ...action.booking,
          bookingId: action.booking.bookingId || action.booking.id,
        },
      ]
      return { ...state, data: { ...data, rooms, students, bookings } }
    }

    case 'UPDATE_BOOKING_STATUS': {
      const bookings = data.bookings.map((b) =>
        String(b.id) === String(action.bookingId) ||
        String(b.bookingId) === String(action.bookingId)
          ? { ...b, status: action.status }
          : b,
      )
      return { ...state, data: { ...data, bookings } }
    }

    case 'ADD_PAYMENT': {
      const payments = [
        ...data.payments,
        { ...action.payment, paymentId: action.payment.paymentId || action.payment.id },
      ]
      // mark the related student's fee as paid
      const students = data.students.map((s) =>
        s.name === action.payment.studentName
          ? { ...s, paymentStatus: 'paid' }
          : s,
      )
      const bookings = data.bookings.map((b) =>
        b.studentName === action.payment.studentName
          ? { ...b, paymentStatus: 'paid' }
          : b,
      )
      return { ...state, data: { ...data, payments, students, bookings } }
    }

    case 'ADD_REVIEW': {
      const reviews = [...data.reviews, action.review]
      return { ...state, data: { ...data, reviews } }
    }

    case 'REMOVE_REVIEW': {
      const reviews = data.reviews.filter((r) => r.id !== action.id)
      return { ...state, data: { ...data, reviews } }
    }

    case 'ADD_COMPLAINT': {
      const complaints = [...data.complaints, action.complaint]
      return { ...state, data: { ...data, complaints } }
    }

    case 'UPDATE_COMPLAINT_STATUS': {
      const complaints = data.complaints.map((c) =>
        c.id === action.id ? { ...c, status: action.status } : c,
      )
      return { ...state, data: { ...data, complaints } }
    }

    case 'UPDATE_STUDENT': {
      const students = data.students.map((s) =>
        s.id === action.student.id ? { ...s, ...action.student } : s,
      )
      return { ...state, data: { ...data, students } }
    }

    default:
      return state
  }
}