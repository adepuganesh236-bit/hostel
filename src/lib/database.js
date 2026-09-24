// -----------------------------------------------------------------------------
// DATABASE LAYER
// -----------------------------------------------------------------------------
// This single-hostel app reads from Supabase when configured and falls back to
// demo data. Every function below returns data in the shared app model so the
// UI never cares whether the source is Supabase or the demo dataset.
// -----------------------------------------------------------------------------

import { supabase, isSupabaseConfigured } from './supabase'
import { api, isApiConfigured } from './api'
import { HOSTEL, PRICING } from '../config'

// -----------------------------------------------------------------------------
// Expected Supabase schema (run /supabase/schema.sql in the SQL editor)
// -----------------------------------------------------------------------------
export const TABLES = [
  'profiles',
  'hostel',
  'rooms',
  'beds',
  'bookings',
  'payments',
  'food_menu',
  'complaints',
  'contacts',
]

// -----------------------------------------------------------------------------
// Helpers to map network rows into the shared app model
// -----------------------------------------------------------------------------
function mapRoom(row) {
  return {
    id: row.room_number,
    roomNumber: row.room_number,
    floor: row.floor,
    sharing: row.sharing,
    typeLabel: row.type_label,
    rent: row.rent,
    advance: row.advance,
    image: row.image || '',
    beds: [],
    createdAt: row.created_at,
  }
}

function mapBed(bed, room) {
  return {
    id: bed.id,
    bedNumber: bed.bed_number,
    status: bed.status,
    studentId: bed.student_id,
    roomId: bed.room_id,
    roomNumber: room?.room_number,
  }
}

function mapStudent(row, booking) {
  return {
    id: row.id || row.student_id,
    name: row.full_name || row.name,
    firstName: (row.full_name || row.name || '').split(' ')[0],
    mobile: row.mobile,
    email: row.email,
    college: row.college,
    course: row.course,
    gender: row.gender,
    yearOfStudy: row.year,
    motherName: row.mother_name,
    fatherName: row.father_name,
    parentPhone: row.parent_phone,
    roomNumber: booking?.room_number || row.room_number,
    bed: booking?.bed_number || row.bed_number,
    bedId: booking?.bed_id,
    joiningDate: booking?.date || row.joining_date,
    paymentStatus: row.payment_status || booking?.payment_status || 'pending',
    preferredRoom: row.preferred_room,
    checkoutDate: row.checkout_date,
  }
}

function mapBooking(row, student) {
  return {
    id: row.booking_id,
    bookingId: row.booking_id,
    studentId: row.student_id,
    studentName: student?.full_name || row.student_name,
    studentMobile: student?.mobile || row.student_mobile,
    studentEmail: student?.email || row.student_email,
    college: student?.college || row.college,
    roomNumber: row.room_number,
    sharing: row.sharing,
    bed: row.bed_number,
    bedId: row.bed_id,
    date: row.date,
    amount: row.amount,
    rent: row.rent,
    advance: row.advance,
    food: row.food,
    electricity: row.electricity,
    total: row.amount,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    status: row.status,
    transactionId: row.transaction_id,
  }
}

// -----------------------------------------------------------------------------
// fetchAll - pulls every table and composes the app model
// -----------------------------------------------------------------------------
export async function fetchAllData() {
  if (isApiConfigured) {
    const data = await api.getOverview()
    if (!data) return null
    if (!data.pricing) data.pricing = PRICING
    return data
  }

  if (!isSupabaseConfigured || !supabase) return null

  const [hostelRes, roomsRes, bedsRes, profilesRes, bookingsRes, paymentsRes, complaintsRes] =
    await Promise.all([
      supabase.from('hostel').select('*').limit(1).maybeSingle(),
      supabase.from('rooms').select('*'),
      supabase.from('beds').select('*'),
      supabase.from('profiles').select('*').eq('role', 'student'),
      supabase.from('bookings').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('complaints').select('*'),
    ])

  // If tables don't exist yet, surface a helpful message
  const anyError = [hostelRes, roomsRes, bedsRes, profilesRes, bookingsRes, paymentsRes, complaintsRes]
    .map((r) => r?.error)
    .filter(Boolean)
  if (anyError.length) {
    throw new Error('Supabase schema not found. Run the schema.sql script first.')
  }

  const rooms = (roomsRes.data || []).map((r) => {
    const room = mapRoom(r)
    room.beds = (bedsRes.data || [])
      .filter((b) => b.room_id === r.id)
      .map((b) => mapBed(b, room))
      .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
    return room
  })

  const bookings = (bookingsRes.data || []).map((b) => mapBooking(b))
  const profiles = (profilesRes.data || []).map((p) =>
    mapStudent(p, bookings.find((b) => b.studentId === p.id)),
  )

  const payments = (paymentsRes.data || []).map((p) => ({ ...p, paymentId: p.payment_id }))
  const complaints = complaintsRes.data || []

  let hostel = hostelRes.data
  if (!hostel) {
    hostel = { name: HOSTEL.name, tagline: HOSTEL.tagline }
  }

  return {
    hostel,
    rooms,
    students: profiles,
    bookings,
    payments,
    complaints,
    pricing: PRICING,
  }
}

// -----------------------------------------------------------------------------
// Write-through mutations (used when Supabase is configured)
// -----------------------------------------------------------------------------
export async function persistRoom(room) {
  if (isApiConfigured) {
    return api.addRoom({ roomNumber: room.roomNumber, floor: room.floor, sharing: room.sharing, typeLabel: room.typeLabel, rent: room.rent, advance: room.advance, image: room.image })
  }
  const { error } = await supabase.from('rooms').upsert({
    id: room.id,
    room_number: room.roomNumber,
    floor: room.floor,
    sharing: room.sharing,
    type_label: room.typeLabel,
    rent: room.rent,
    advance: room.advance,
    image: room.image,
  })
  if (error) throw error
}

export async function persistBed(bed) {
  if (isApiConfigured) {
    return api.updateBed({ id: bed.id, status: bed.status, studentId: bed.studentId })
  }
  const { error } = await supabase.from('beds').upsert({
    bed_number: bed.bedNumber,
    room_id: bed.roomId,
    status: bed.status,
    student_id: bed.studentId,
  })
  if (error) throw error
}

export async function persistBooking(booking) {
  if (isApiConfigured) {
    return api.createBooking(booking)
  }
  const { error } = await supabase.from('bookings').upsert(booking)
  if (error) throw error
}

export async function persistPayment(payment) {
  if (isApiConfigured) {
    return api.createPayment(payment)
  }
  const { error } = await supabase.from('payments').upsert(payment)
  if (error) throw error
}

export async function persistComplaint(complaint) {
  if (isApiConfigured) {
    return api.createComplaint(complaint)
  }
  const { error } = await supabase.from('complaints').upsert(complaint)
  if (error) throw error
}

export async function persistCheckout(id, date) {
  if (isApiConfigured) {
    return api.checkoutStudent(id, date)
  }
  const { error: bedError } = await supabase
    .from('beds')
    .update({ status: 'available', student_id: null })
    .eq('student_id', id)
  if (bedError) throw bedError
  const { error } = await supabase
    .from('profiles')
    .update({ checkout_date: date, bed_id: null })
    .eq('id', id)
  if (error) throw error
}