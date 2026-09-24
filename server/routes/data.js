import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const num = (v) => (v === null || v === undefined ? null : Number(v))
const bool = (v) => (v === null || v === undefined ? false : Boolean(v))

function mapBed(row) {
  return {
    id: row.id,
    bedNumber: row.bed_number,
    status: row.status,
    studentId: row.student_id,
    roomId: row.room_id,
    roomNumber: row.room_number || row.room_id,
  }
}

function mapRoom(row) {
  return {
    id: row.room_number,
    roomNumber: row.room_number,
    floor: row.floor,
    sharing: row.sharing,
    typeLabel: row.type_label,
    rent: num(row.rent),
    advance: num(row.advance),
    beds: [],
    createdAt: String(row.created_at || ''),
  }
}

function mapStudent(row) {
  return {
    id: row.id,
    name: row.full_name,
    firstName: (row.full_name || '').split(' ')[0],
    mobile: row.mobile,
    email: row.email,
    college: row.college,
    course: row.course,
    gender: row.gender,
    yearOfStudy: row.year,
    roomNumber: row.room_number,
    bed: row.bed_number,
    bedId: row.bed_id,
    joiningDate: row.joining_date,
    paymentStatus: row.payment_status,
    budget: num(row.budget),
    motherName: row.mother_name,
    fatherName: row.father_name,
    parentPhone: row.parent_phone,
    preferredRoom: row.preferred_room,
    checkoutDate: row.checkout_date,
    verified: bool(row.verified),
  }
}

function mapBooking(row) {
  return {
    id: row.booking_id,
    bookingId: row.booking_id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentMobile: row.student_mobile,
    studentEmail: row.student_email,
    college: row.college,
    roomNumber: row.room_number,
    sharing: row.sharing,
    bed: row.bed_number,
    bedId: row.bed_id,
    date: String(row.date || ''),
    amount: num(row.amount),
    rent: num(row.rent),
    advance: num(row.advance),
    food: num(row.food),
    electricity: num(row.electricity),
    total: num(row.amount),
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    status: row.status,
    transactionId: row.transaction_id,
  }
}

function mapPayment(row) {
  return {
    id: row.payment_id,
    paymentId: row.payment_id,
    studentId: row.student_id,
    studentName: row.student_name,
    roomNumber: row.room_number,
    bed: row.bed,
    amount: num(row.amount),
    method: row.method,
    transactionId: row.transaction_id,
    date: String(row.date || ''),
    status: row.status,
    type: row.type,
  }
}

function mapComplaint(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    student: row.student_name,
    room: row.room,
    type: row.type,
    message: row.message,
    status: row.status,
    date: String(row.date || ''),
  }
}

function compose(hostelRow, roomRows, bedRows, studentRows, bookingRows, paymentRows, complaintRows) {
  const rooms = roomRows.map(mapRoom).map((room) => {
    room.beds = bedRows
      .filter((b) => b.room_id === room.roomNumber)
      .map(mapBed)
      .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
    return room
  })
  return {
    hostel: hostelRow || null,
    rooms,
    students: studentRows.map(mapStudent),
    bookings: bookingRows.map(mapBooking),
    payments: paymentRows.map(mapPayment),
    complaints: complaintRows.map(mapComplaint),
    pricing: null,
  }
}

router.get('/overview', async (_req, res, next) => {
  try {
    const [[hostelRows], [roomRows], [bedRows], [studentRows], [bookingRows], [paymentRows], [complaintRows]] =
      await Promise.all([
        pool.query('SELECT * FROM hostel ORDER BY id LIMIT 1'),
        pool.query('SELECT * FROM rooms ORDER BY room_number'),
        pool.query('SELECT * FROM beds'),
        pool.query(`SELECT * FROM profiles WHERE role = 'student' ORDER BY id`),
        pool.query('SELECT * FROM bookings ORDER BY date'),
        pool.query('SELECT * FROM payments ORDER BY date'),
        pool.query('SELECT * FROM complaints ORDER BY date DESC'),
      ])
    res.json(compose(hostelRows[0], roomRows, bedRows, studentRows, bookingRows, paymentRows, complaintRows))
  } catch (err) {
    next(err)
  }
})

router.get('/rooms', async (_req, res, next) => {
  try {
    const [[roomRows], [bedRows]] = await Promise.all([
      pool.query('SELECT * FROM rooms ORDER BY room_number'),
      pool.query('SELECT * FROM beds'),
    ])
    const rooms = roomRows.map(mapRoom).map((room) => {
      room.beds = bedRows.filter((b) => b.room_id === room.roomNumber).map(mapBed)
      return room
    })
    res.json(rooms)
  } catch (err) {
    next(err)
  }
})

router.post('/rooms', async (req, res, next) => {
  const { roomNumber, floor, sharing, typeLabel, rent, advance } = req.body || {}
  if (!roomNumber) return res.status(400).json({ error: 'roomNumber is required.' })
  try {
    await pool.query(
      `INSERT INTO rooms (id, room_number, floor, sharing, type_label, rent, advance)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [roomNumber, roomNumber, floor, sharing, typeLabel, rent, advance],
    )
    res.status(201).json({ ok: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Room already exists.' })
    next(err)
  }
})

router.patch('/rooms/:roomNumber', async (req, res, next) => {
  const { rent, advance } = req.body || {}
  try {
    const result = await pool.query(
      'UPDATE rooms SET rent = ?, advance = ? WHERE room_number = ?',
      [num(rent), num(advance), req.params.roomNumber],
    )
    if (!result[0].affectedRows) return res.status(404).json({ error: 'Room not found.' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.delete('/rooms/:roomNumber', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM rooms WHERE room_number = ?', [req.params.roomNumber])
    if (!result[0].affectedRows) return res.status(404).json({ error: 'Room not found.' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.patch('/beds/:id', async (req, res, next) => {
  const { status, studentId } = req.body || {}
  try {
    const [bedRows] = await pool.query('SELECT * FROM beds WHERE id = ?', [req.params.id])
    if (!bedRows.length) return res.status(404).json({ error: 'Bed not found.' })
    const current = bedRows[0]
    const nextStatus = status || current.status
    // A bed released back to "available" can never hold a student.
    const nextStudentId = nextStatus === 'available' ? null : studentId ?? current.student_id
    await pool.query(
      `UPDATE beds SET status = ?, student_id = ? WHERE id = ?`,
      [nextStatus, nextStudentId, req.params.id],
    )
    if (studentId && nextStatus === 'occupied') {
      await pool.query(
        `UPDATE profiles SET room_number = ?, bed_number = ?, bed_id = ? WHERE id = ?`,
        [current.room_id, current.bed_number, current.id, studentId],
      )
    }
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.post('/bookings', async (req, res, next) => {
  const b = req.body || {}
  const conn = await pool.getConnection()
  try {
    const nextId = await nextNumericId(conn, 'bookings', 'booking_id', 'BK-', 1001)
    const bookingId = `BK-${nextId}`
    await conn.query(
      `INSERT INTO bookings
         (booking_id, student_id, student_name, student_mobile, student_email, college,
          room_number, sharing, bed_number, bed_id, date,
          rent, advance, food, electricity, amount, transaction_id, payment_method, payment_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId, b.studentId, b.studentName, b.studentMobile, b.studentEmail, b.college,
        b.roomNumber, b.sharing, b.bed, b.bedId, b.date,
        num(b.rent), num(b.advance), num(b.food), num(b.electricity), num(b.amount),
        b.transactionId, b.paymentMethod, b.paymentStatus || 'pending', b.status || 'pending',
      ],
    )
    if (b.bedId) {
      await conn.query(`UPDATE beds SET status = 'occupied', student_id = ? WHERE id = ?`, [b.studentId, b.bedId])
    }
    if (b.studentId) {
      await conn.query(
        `UPDATE profiles SET room_number = ?, bed_number = ?, bed_id = ? WHERE id = ?`,
        [b.roomNumber, b.bed, b.bedId, b.studentId],
      )
    }
    res.status(201).json({ ok: true, bookingId })
  } catch (err) {
    next(err)
  } finally {
    conn.release()
  }
})

router.patch('/bookings/:id/status', async (req, res, next) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'status is required.' })
  try {
    const result = await pool.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, req.params.id])
    if (!result[0].affectedRows) return res.status(404).json({ error: 'Booking not found.' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.post('/payments', async (req, res, next) => {
  const p = req.body || {}
  const conn = await pool.getConnection()
  try {
    const nextId = await nextNumericId(conn, 'payments', 'payment_id', 'PAY-', 1)
    const paymentId = `PAY-${String(nextId).padStart(4, '0')}`
    await conn.query(
      `INSERT INTO payments (payment_id, student_id, student_name, room_number, bed, amount, method, transaction_id, date, status, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, p.studentId, p.studentName, p.roomNumber, p.bed, num(p.amount), p.method, p.transactionId, p.date, p.status || 'paid', p.type || 'Monthly Rent'],
    )
    if (p.studentId) {
      await conn.query(`UPDATE profiles SET payment_status = 'paid' WHERE id = ?`, [p.studentId])
    }
    if (p.studentName) {
      await conn.query(`UPDATE bookings SET payment_status = 'paid' WHERE student_name = ?`, [p.studentName])
    }
    res.status(201).json({ ok: true, paymentId })
  } catch (err) {
    next(err)
  } finally {
    conn.release()
  }
})

router.post('/complaints', async (req, res, next) => {
  const c = req.body || {}
  try {
    const result = await pool.query(
      `INSERT INTO complaints (student_id, student_name, room, type, message, status, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [c.studentId || null, c.studentName || c.student, c.room, c.type, c.message, c.status || 'open', c.date || new Date().toISOString().slice(0, 10)],
    )
    res.status(201).json({ ok: true, id: result[0].insertId })
  } catch (err) {
    next(err)
  }
})

router.patch('/complaints/:id/status', async (req, res, next) => {
  const { status } = req.body || {}
  if (!status) return res.status(400).json({ error: 'status is required.' })
  try {
    const result = await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [status, req.params.id])
    if (!result[0].affectedRows) return res.status(404).json({ error: 'Complaint not found.' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.post('/students/:id/checkout', async (req, res, next) => {
  const body = req.body || {}
  const date = String(body.date || new Date().toISOString().slice(0, 10))
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query('SELECT * FROM profiles WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Student not found.' })
    const profile = rows[0]
    if (profile.role !== 'student') return res.status(400).json({ error: 'Only student profiles can check out.' })

    // Release the student's bed (mark available, clear owner) WITHOUT deleting the bed row.
    const [bedRows] = await conn.query(
      'SELECT id FROM beds WHERE (id = ? OR student_id = ?) ORDER BY id LIMIT 1',
      [profile.bed_id, profile.id],
    )
    const releasedBedId = bedRows[0]?.id || null
    if (releasedBedId) {
      await conn.query(`UPDATE beds SET status = 'available', student_id = NULL WHERE id = ?`, [releasedBedId])
    }

    // Record the checkout date. The live bed link is cleared so the next
    // student can take over the bed cleanly; room/bed numbers stay for history.
    await conn.query(`UPDATE profiles SET checkout_date = ?, bed_id = NULL WHERE id = ?`, [date, profile.id])
    res.json({ ok: true, checkoutDate: date, bedId: releasedBedId })
  } catch (err) {
    next(err)
  } finally {
    conn.release()
  }
})

router.patch('/students/:id', async (req, res, next) => {
  const s = req.body || {}
  const allowed = ['full_name', 'mobile', 'email', 'college', 'course', 'gender']
  try {
    const sets = []
    const params = []
    for (const key of allowed) {
      if (s[key] !== undefined) {
        sets.push(`${key} = ?`)
        params.push(s[key])
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'Nothing to update.' })
    params.push(req.params.id)
    await pool.query(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`, params)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.post('/contacts', async (req, res, next) => {
  const c = req.body || {}
  try {
    await pool.query('INSERT INTO contacts (name, email, mobile, message) VALUES (?, ?, ?, ?)', [
      c.name, c.email, c.mobile, c.message,
    ])
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})

async function nextNumericId(conn, table, column, prefix, minimum) {
  const [rows] = await conn.query(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(${column}, ${prefix.length + 1}) AS UNSIGNED)), 0) AS max_id FROM ${table}`,
  )
  return Math.max((rows[0]?.max_id || 0) + 1, minimum)
}

export default router