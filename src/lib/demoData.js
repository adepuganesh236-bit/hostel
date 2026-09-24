// -----------------------------------------------------------------------------
// DEMO DATA
// -----------------------------------------------------------------------------
// Realistic sample data used when Supabase is not yet configured (DEMO MODE).
// Everything here is clearly identifiable demo data so the client knows sample
// values from real ones. All values are generated deterministically (seeded)
// so the data looks identical on every page load.
// -----------------------------------------------------------------------------

import { PRICING } from '../config'

// Small deterministic PRNG (mulberry32) so demo data is stable across refreshes
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NAME_POOL = [
  'Rahul Sharma', 'Priya Patel', 'Aarav Mehta', 'Sneha Reddy', 'Vikram Singh',
  'Ananya Gupta', 'Arjun Nair', 'Kavya Iyer', 'Rohan Deshmukh', 'Ishita Kulkarni',
  'Manish Kumar', 'Divya Venkatesh', 'Aditya Rao', 'Pooja Mishra', 'Karthik Babu',
  'Neha Agarwal', 'Siddharth Jain', 'Anjali Singhania', 'Ravi Teja', 'Meera Nandakumar',
  'Deepak Chauhan', 'Sana Khan', 'Nikhil Bansal', 'Ritika Sharma', 'Varun Kapoor',
  'Tanvi Malhotra', 'Abhishek Roy', 'Shreya Ghosh', 'Harsha Vardhan', 'Nandini Pillai',
  'Gaurav Joshi', 'Aishwarya Menon', 'Farhan Ali', 'Lakshmi Suresh', 'Pranav Bhat',
  'Swati Mirji', 'Yash Chopra', 'Bhuvan Shetty', 'Ritu Das', 'Amol Pawar',
]

const COLLEGES = [
  'Anna University', 'SRM Institute of Science & Technology', 'IIT Madras',
  'VIT Chennai', 'Loyola College', 'Madras Christian College',
  'Hindustan Institute of Technology', 'St. Joseph College',
]

const COURSES = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'MBA', 'B.Sc Computer Science',
  'B.Com', 'M.Sc Physics', 'BCA', 'MCA', 'B.A English',
]

// Room catalogue: 4 floors × 5 rooms each
// 1st floor → 101–105 (6 Sharing), 2nd floor → 201–205 (6 Sharing),
// 3rd floor → 301–305 (10 Sharing), 4th floor → 401–405 (10 Sharing)
const FLOORS = [
  { number: 1, sharing: 6 },
  { number: 2, sharing: 6 },
  { number: 3, sharing: 10 },
  { number: 4, sharing: 10 },
]

const TYPE_LABEL = { 6: '6 Sharing', 10: '10 Sharing' }
const TYPE_KEY = { 6: 'six', 10: 'ten' }

// -----------------------------------------------------------------------------
// Core demo dataset builder
// -----------------------------------------------------------------------------
export function buildDemoData() {
  const rng = mulberry32(202409)
  const rooms = []
  const students = []

  // 1) Create 20 rooms: 4 floors × 5 rooms (101–105, 201–205, 301–305, 401–405)
  FLOORS.forEach((floorInfo) => {
    for (let i = 1; i <= 5; i++) createRoom(floorInfo, i)
  })

  function createRoom(floorInfo, index) {
    const { number: floor, sharing } = floorInfo
    const roomNumber = `${floor}${String(index).padStart(2, '0')}`
    const key = TYPE_KEY[sharing]
    const v = PRICING.rooms[key]
    const rent = v.rent
    const beds = Array.from({ length: sharing }, (_, i) => {
      const status = 'available'
      return {
        id: `${roomNumber}-b${i + 1}`,
        bedNumber: `Bed ${i + 1}`,
        status,
        studentId: null,
        reservedBy: null,
      }
    })
    const room = {
      id: roomNumber,
      roomNumber,
      floor,
      sharing,
      typeLabel: TYPE_LABEL[sharing],
      rent,
      advance: v.advance,
      image: '',
      beds,
      createdAt: randomDate(rng, '2024-06', '2026-01'),
    }
    rooms.push(room)
    return room
  }

  // ensure deterministic room ordering
  rooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))

  // 3) Sample bookings derived from occupied beds
  const bookings = students.slice(0, 14).map((student, idx) => {
    const room = rooms.find((r) => r.roomNumber === student.roomNumber)
    const statusList = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'pending']
    const bookingStatus = statusList[idx % statusList.length]
    return createBooking(student, room, idx, bookingStatus)
  })

  // 4) Sample payments derived from students
  const payments = students
    .slice(0, 12)
    .map((student, idx) => createPayment(student, rooms, idx))
    .filter(Boolean)

  // 5) Sample complaints for admin panel
  const complaints = [
    {
      id: 1, student: 'Manish Kumar', room: '301', type: 'Electrical',
      message: 'The tubelight in room 301 is flickering.', status: 'resolved', date: '2026-08-20',
    },
    {
      id: 2, student: 'Divya Venkatesh', room: '201', type: 'Cleaning',
      message: 'Need extra cleaning near the washroom area.', status: 'in_progress', date: '2026-09-01',
    },
    {
      id: 3, student: 'Aditya Rao', room: '402', type: 'Wi-Fi',
      message: 'Wi-Fi connectivity is weak in room 402.', status: 'open', date: '2026-09-06',
    },
  ]

  return { rooms, students, bookings, payments, complaints }
}

function createBooking(student, room, idx, status) {
  const amount = room.rent + room.advance + 2000 + 500
  return {
    id: `BK-${String(1001 + idx)}`,
    bookingId: `BK-${String(1001 + idx)}`,
    studentId: student.id,
    studentName: student.name,
    studentMobile: student.mobile,
    studentEmail: student.email,
    college: student.college,
    roomNumber: room.roomNumber,
    sharing: room.sharing,
    bed: student.bed,
    bedId: student.bedId,
    date: student.joiningDate,
    amount,
    rent: room.rent,
    food: 2000,
    electricity: 500,
    advance: room.advance,
    total: amount,
    paymentStatus: student.paymentStatus,
    paymentMethod: ['UPI', 'Credit Card', 'Net Banking', 'Debit Card'][idx % 4],
    status,
    transactionId: `TXN-${String(810000 + idx * 137)}`,
  }
}

function createPayment(student, rooms, idx) {
  const room = rooms.find((r) => r.roomNumber === student.roomNumber)
  if (!room) return null
  const amount = room.rent + 2000 + 500
  const methods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking']
  return {
    id: `PAY-${String(idx + 1).padStart(4, '0')}`,
    paymentId: `PAY-${String(idx + 1).padStart(4, '0')}`,
    studentId: student.id,
    studentName: student.name,
    roomNumber: student.roomNumber,
    bed: student.bed,
    amount,
    method: methods[idx % methods.length],
    transactionId: `TXN-${String(810000 + idx * 137)}`,
    date: student.joiningDate,
    status: student.paymentStatus,
    type: idx % 2 === 0 ? 'Monthly Rent' : 'Advance',
  }
}

// -----------------------------------------------------------------------------
// Weekly food menu
// -----------------------------------------------------------------------------
export const WEEKLY_MENU = {
  Breakfast: {
    Monday: ['Idli Sambar', 'Vada + Chutney', 'Masala Chai'],
    Tuesday: ['Poori Bhaji', 'Banana', 'Coffee'],
    Wednesday: ['Dosa + Chutney', 'Milk', 'Coconut Chutney'],
    Thursday: ['Pongal', 'Sambar', 'Chai'],
    Friday: ['Uttapam', 'Mint Chutney', 'Coffee'],
    Saturday: ['Rava Idli', 'Chutney', 'Milk'],
    Sunday: ['Special Masala Dosa', 'Vada', 'Chai'],
  },
  Lunch: {
    Monday: ['Rice + Sambar', 'Curd Rice', 'Chicken Curry', 'Rasam'],
    Tuesday: ['Rice + Dal', 'Ghee Roast', 'Veg Curry', 'Buttermilk'],
    Wednesday: ['Veg Fried Rice', 'Noodles', 'Manchurian', 'Salad'],
    Thursday: ['Rice + Rasam', 'Paneer Butter Masala', 'Roti', 'Curd'],
    Friday: ['Biryani (Veg/Chicken)', 'Raita', 'Salad', 'Sweet'],
    Saturday: ['Curd Rice', 'Tomato Rice', 'Fry (Veg/Egg)', 'Chutney'],
    Sunday: ['Special Chicken Biryani', 'Raita', 'Curd', 'Ice Cream'],
  },
  Dinner: {
    Monday: ['Chapati + Paneer Masala', 'Rice + Dal', 'Salad'],
    Tuesday: ['Chapati + Chole', 'Rice + Sambar', 'Curd'],
    Wednesday: ['Pulao', 'Raita', 'Papad', 'Sweet'],
    Thursday: ['Chapati + Mix Veg', 'Rice + Rasam', 'Curd'],
    Friday: ['Idli Sambar', 'Lemon Rice', 'Cucumber Salad'],
    Saturday: ['Chapati + Egg Masala', 'Jeera Rice', 'Curd'],
    Sunday: ['Dosa / Pongal', 'Chutney', 'Milk', 'Fried Rice'],
  },
}

export const DAILY_TIMINGS = {
  Breakfast: '7:30 AM - 9:30 AM',
  Lunch: '12:30 PM - 2:00 PM',
  Dinner: '7:30 PM - 9:00 PM',
}

export const FOOD_RULES = [
  'Meals are served only during the scheduled timings.',
  'Carry your resident ID card to the dining hall.',
  'Outside food is not allowed inside the dining hall.',
  'Please do not waste food - take what you can finish.',
  'Special food / diet requirements can be discussed with the warden.',
  'Guests are allowed only with the warden’s prior permission.',
  'Kitchen closes after last serving - latecomers may miss dinner.',
]

// -----------------------------------------------------------------------------
// Placeholder image helper (Supabase Storage ready)
// -----------------------------------------------------------------------------
// To later load real images from Supabase Storage, replace the bucket path
// returned here, e.g. `const { data } = supabase.storage.from('gallery').getPublicUrl(path)`
export const IMAGES = {
  hero: '/images/hero.jpg',
  about: '/images/about.jpg',
  dining: '/images/dining.jpg',
  study: '/images/study.jpg',
  common: '/images/common.jpg',
  room: '/images/room.jpg',
  facility: '/images/facilities.jpg',
  gallery: [
    { id: 1, category: 'Rooms', src: '/images/room.jpg', title: 'Deluxe Room' },
    { id: 2, category: 'Rooms', src: '/images/room6.jpg', title: '6 Sharing Dorm' },
    { id: 3, category: 'Hostel', src: '/images/hostel.jpg', title: 'Hostel Building' },
    { id: 4, category: 'Hostel', src: '/images/hostel2.jpg', title: 'Front Entrance' },
    { id: 5, category: 'Dining', src: '/images/dining.jpg', title: 'Dining Hall' },
    { id: 6, category: 'Dining', src: '/images/dining2.jpg', title: 'Meal Counter' },
    { id: 7, category: 'Facilities', src: '/images/facilities.jpg', title: 'Gym Corner' },
    { id: 8, category: 'Facilities', src: '/images/laundry.jpg', title: 'Laundry Area' },
    { id: 9, category: 'Common Area', src: '/images/common.jpg', title: 'TV Lounge' },
    { id: 10, category: 'Common Area', src: '/images/garden.jpg', title: 'Garden' },
    { id: 11, category: 'Study Area', src: '/images/study.jpg', title: 'Study Hall' },
    { id: 12, category: 'Parking', src: '/images/parking.jpg', title: 'Bike Parking' },
  ],
}

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------
function slug(name) {
  return name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')
}

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function randomDate(rng, start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return new Date(s + rng() * (e - s)).toISOString().slice(0, 10)
}

// Default export also provided for convenience
export default buildDemoData