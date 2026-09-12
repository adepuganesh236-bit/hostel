import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useCallback,
} from 'react'
import { buildDemoData } from '../lib/demoData'
import { fetchAllData, persistBooking, persistBed, persistPayment, persistReview, persistComplaint } from '../lib/database'
import { isApiConfigured, api } from '../lib/api'
import { uiActions } from './dataReducer'
import { useToast } from './ToastContext'

const DataContext = createContext(null)

const initialState = {
  data: buildDemoData(),
  source: 'demo',
  loading: false,
  hydrated: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, data: action.data, source: action.source, loading: false, hydrated: true }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    default:
      return uiActions(state, action)
  }
}

export function DataProvider({ children }) {
  const toast = useToast()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [persistQueue, setPersistQueue] = useState([])

  useEffect(() => {
    let active = true
    async function hydrate() {
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        const remote = await fetchAllData()
        if (active && remote) {
          dispatch({ type: 'HYDRATE', data: remote, source: isApiConfigured ? 'mysql' : 'supabase' })
          return
        }
      } catch (err) {
        toast.warning(
          `Could not reach Supabase — showing demo data. (${err.message})`,
          6000,
        )
      }
      if (active) {
        dispatch({ type: 'HYDRATE', data: buildDemoData(), source: 'demo' })
      }
    }
    hydrate()
    return () => {
      active = false
    }
  }, [toast])

  const syncPersist = useCallback(
    async (action) => {
      if (!isApiConfigured) return
      try {
        switch (action.type) {
          case 'ADD_BOOKING':
            await persistBooking(action.booking)
            break
          case 'UPDATE_BED_STATUS':
            await persistBed({ id: action.bedId, status: action.status, studentId: action.studentId })
            break
          case 'ADD_PAYMENT':
            await persistPayment(action.payment)
            break
          case 'ADD_REVIEW':
            await persistReview(action.review)
            break
          case 'REMOVE_REVIEW':
            await api.deleteReview(action.id)
            break
          case 'ADD_COMPLAINT':
            await persistComplaint(action.complaint)
            break
          case 'UPDATE_COMPLAINT_STATUS':
            await api.updateComplaintStatus(action.id, action.status)
            break
          default:
            break
        }
      } catch (err) {
        toast.error(err.message)
      }
    },
    [toast],
  )

  const mutate = useCallback(
    async (action) => {
      dispatch(action)
      syncPersist(action)
      if (action.persist) {
        setPersistQueue((q) => [...q, action.persist])
      }
    },
    [syncPersist],
  )

  const refresh = useCallback(async () => {
    const remote = await fetchAllData()
    if (remote) dispatch({ type: 'HYDRATE', data: remote, source: 'supabase' })
  }, [])

  const api = useMemo(() => {
    const { data, source } = state
    const totalBeds = data.rooms.reduce((s, r) => s + r.beds.length, 0)
    const occupiedBeds = data.rooms.reduce(
      (s, r) => s + r.beds.filter((b) => b.status === 'occupied').length,
      0,
    )
    const availableBeds = data.rooms.reduce(
      (s, r) => s + r.beds.filter((b) => b.status === 'available').length,
      0,
    )
    const reservedBeds = totalBeds - occupiedBeds - availableBeds
    const pendingFees = data.students.filter((s) => s.paymentStatus === 'pending').length
    const revenue =
      data.payments.reduce((s, p) => s + Number(p.amount || 0), 0) +
      data.bookings.reduce(
        (s, b) => s + (b.paymentStatus === 'paid' ? Number(b.amount || 0) : 0),
        0,
      )

    const roomByNumber = (n) => data.rooms.find((r) => r.roomNumber === String(n))

    return {
      ...state,
      rooms: data.rooms,
      students: data.students,
      bookings: data.bookings,
      payments: data.payments,
      reviews: data.reviews,
      complaints: data.complaints,
      stats: {
        totalRooms: data.rooms.length,
        totalBeds,
        occupied: occupiedBeds,
        available: availableBeds,
        reserved: reservedBeds,
        pendingFees,
        revenue,
      },
      roomByNumber,
      pricing: data.pricing,
      refresh,

      // ---- mutations -----------------------------------------------------
      updateBedStatus: (roomNumber, bedId, status, studentId, bedNumber) =>
        mutate({ type: 'UPDATE_BED_STATUS', roomNumber, bedId, status, studentId, bedNumber }),
      updateRoomRent: (roomNumber, rent, advance) =>
        mutate({ type: 'UPDATE_ROOM_RENT', roomNumber, rent, advance }),
      updateRoom: (room) => mutate({ type: 'UPDATE_ROOM', room }),
      addRoom: (room) => mutate({ type: 'ADD_ROOM', room }),
      removeRoom: (roomNumber) => mutate({ type: 'REMOVE_ROOM', roomNumber }),

      addBooking: (booking) => mutate({ type: 'ADD_BOOKING', booking }),
      updateBookingStatus: (bookingId, status) =>
        mutate({ type: 'UPDATE_BOOKING_STATUS', bookingId, status }),

      addPayment: (payment) => mutate({ type: 'ADD_PAYMENT', payment }),
      addReview: (review) => mutate({ type: 'ADD_REVIEW', review }),
      removeReview: (id) => mutate({ type: 'REMOVE_REVIEW', id }),
      addComplaint: (complaint) => mutate({ type: 'ADD_COMPLAINT', complaint }),
      updateComplaintStatus: (id, status) =>
        mutate({ type: 'UPDATE_COMPLAINT_STATUS', id, status }),
      updateStudent: (student) => mutate({ type: 'UPDATE_STUDENT', student }),
    }
  }, [state, refresh, mutate])

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}