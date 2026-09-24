import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import RequireAuth, { RequireRole } from './components/guard/RouteGuards'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import About from './pages/About'
import Facilities from './pages/Facilities'
import Food from './pages/Food'
import Social from './pages/Social'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Verify from './pages/auth/Verify'
import ForgotPassword from './pages/auth/ForgotPassword'
import OwnerLogin from './pages/owner/OwnerLogin'

import Booking from './pages/booking/Booking'
import Payment from './pages/booking/Payment'
import PaymentSuccess from './pages/booking/PaymentSuccess'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentBookings from './pages/student/StudentBookings'
import StudentPayments from './pages/student/StudentPayments'

import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerRooms from './pages/owner/OwnerRooms'
import OwnerRoomDetails from './pages/owner/OwnerRoomDetails'
import OwnerStudents from './pages/owner/OwnerStudents'
import OwnerBookings from './pages/owner/OwnerBookings'
import OwnerPayments from './pages/owner/OwnerPayments'
import OwnerSocial from './pages/owner/OwnerSocial'
import OwnerComplaints from './pages/owner/OwnerComplaints'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public website */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/food" element={<Food />} />
                <Route path="/social" element={<Social />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/owner/login" element={<OwnerLogin />} />

              {/* Booking flow (auth required) */}
              <Route
                path="/booking"
                element={
                  <RequireAuth>
                    <Booking />
                  </RequireAuth>
                }
              />
              <Route
                path="/payment"
                element={
                  <RequireAuth>
                    <Payment />
                  </RequireAuth>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <RequireAuth>
                    <PaymentSuccess />
                  </RequireAuth>
                }
              />

              {/* Student panel */}
              <Route
                path="/student"
                element={
                  <RequireRole role="student">
                    <DashboardLayout scope="student" />
                  </RequireRole>
                }
              >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="bookings" element={<StudentBookings />} />
                <Route path="payments" element={<StudentPayments />} />
              </Route>

              {/* Owner panel */}
              <Route
                path="/owner"
                element={
                  <RequireRole role="owner">
                    <DashboardLayout scope="owner" />
                  </RequireRole>
                }
              >
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="rooms" element={<OwnerRooms />} />
                <Route path="rooms/:roomNumber" element={<OwnerRoomDetails />} />
                <Route path="students" element={<OwnerStudents />} />
                <Route path="bookings" element={<OwnerBookings />} />
                <Route path="payments" element={<OwnerPayments />} />
                <Route path="complaints" element={<OwnerComplaints />} />
                <Route path="social" element={<OwnerSocial />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}