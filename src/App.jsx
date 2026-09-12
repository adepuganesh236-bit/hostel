import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import RequireAuth, { RequireRole } from './components/guard/RouteGuards'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AuthShell from './components/layout/AuthShell'

import Home from './pages/Home'
import About from './pages/About'
import Rooms from './pages/Rooms'
import Facilities from './pages/Facilities'
import Food from './pages/Food'
import Gallery from './pages/Gallery'
import Reviews from './pages/Reviews'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Verify from './pages/auth/Verify'
import OwnerLogin from './pages/owner/OwnerLogin'
import AdminLogin from './pages/admin/AdminLogin'

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

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminRooms from './pages/admin/AdminRooms'
import AdminBookings from './pages/admin/AdminBookings'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReviews from './pages/admin/AdminReviews'
import AdminComplaints from './pages/admin/AdminComplaints'

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
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/food" element={<Food />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth */}
              <Route element={<AuthShell />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/owner/login" element={<OwnerLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

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
              </Route>

              {/* Admin panel */}
              <Route
                path="/admin"
                element={
                  <RequireRole role="admin">
                    <DashboardLayout scope="admin" />
                  </RequireRole>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="complaints" element={<AdminComplaints />} />
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