const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const isApiConfigured = Boolean(API_URL)

const TOKEN_KEY = 'staynest_api_token'

export function getApiToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setApiToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body } = {}) {
  const token = getApiToken()
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  getOverview: () => request('/api/overview'),

  createBooking: (booking) => request('/api/bookings', { method: 'POST', body: booking }),
  updateBookingStatus: (bookingId, status) =>
    request(`/api/bookings/${encodeURIComponent(bookingId)}/status`, { method: 'PATCH', body: { status } }),

  createPayment: (payment) => request('/api/payments', { method: 'POST', body: payment }),

  createReview: (review) => request('/api/reviews', { method: 'POST', body: review }),
  deleteReview: (id) => request(`/api/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  createComplaint: (complaint) => request('/api/complaints', { method: 'POST', body: complaint }),
  updateComplaintStatus: (id, status) =>
    request(`/api/complaints/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status } }),

  addRoom: (room) => request('/api/rooms', { method: 'POST', body: room }),
  updateRoom: (roomNumber, room) => request(`/api/rooms/${encodeURIComponent(roomNumber)}`, { method: 'PATCH', body: room }),
  removeRoom: (roomNumber) => request(`/api/rooms/${encodeURIComponent(roomNumber)}`, { method: 'DELETE' }),

  updateBed: (bed) => request(`/api/beds/${encodeURIComponent(bed.id)}`, { method: 'PATCH', body: bed }),
  updateStudent: (student) => request(`/api/students/${encodeURIComponent(student.id)}`, { method: 'PATCH', body: student }),

  createContact: (contact) => request('/api/contacts', { method: 'POST', body: contact }),

  register: (fields) => request('/api/auth/register', { method: 'POST', body: fields }),
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: credentials }),
  me: () => request('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
}