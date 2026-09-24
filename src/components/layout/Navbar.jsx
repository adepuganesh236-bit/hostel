import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  Info,
  CookingPot,
  Phone,
  Share2,
  LogIn,
  UserPlus,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronRight,
} from 'lucide-react'
import { HOSTEL } from '../../config'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../lib/utils'

const MENU = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/about', label: 'About', icon: Info },
  { to: '/facilities', label: 'Facilities', icon: Building2 },
  { to: '/food', label: 'Food', icon: CookingPot },
  { to: '/social', label: 'Social', icon: Share2 },
  { to: '/contact', label: 'Contact', icon: Phone },
]

export default function Navbar() {
  const { role, profile, logout, isDemo } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isLoggedIn = Boolean(role)

  const dashboardPath =
    role === 'student'
      ? '/student/dashboard'
      : role === 'owner' || role === 'admin'
        ? '/owner/dashboard'
        : null

  const handleLogout = async () => {
    await logout()
    toast.success('You have been logged out.')
    navigate('/')
  }

  const desktopLink = ({ isActive }) =>
    cx(
      'rounded-lg px-3 py-2 text-sm font-semibold transition-colors relative',
      isActive
        ? 'text-brand-700 bg-brand-50'
        : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50',
    )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-lift">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="font-display text-lg font-bold leading-tight text-slate-900">
              {HOSTEL.name}
            </span>
          </span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            dashboardPath ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                    {(profile?.full_name || profile?.name || 'SN').slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden xl:block max-w-28 truncate">
                    {profile?.full_name || profile?.name || 'Student'}
                  </span>
                  <ChevronRight className={cx('h-4 w-4 transition-transform', userMenuOpen && 'rotate-90')} />
                </button>
                {userMenuOpen ? (
                  <div className="anim-fade-up absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {profile?.full_name || profile?.name}
                      </p>
                      <p className="text-xs capitalize text-slate-500">
                        {role} {isDemo ? '· Demo' : ''}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to={dashboardPath}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      {role === 'student' ? (
                        <Link
                          to="/student/bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <CalendarCheck className="h-4 w-4" /> My Booking
                        </Link>
                      ) : null}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand-700"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </>
          )}
          <Link
            to="/booking"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="lg:hidden">
          <div className="anim-drawer max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-6 pt-3">
            <nav className="grid gap-1">
              {MENU.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4">
              {isLoggedIn && dashboardPath ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  {role === 'student' ? (
                    <Link
                      to="/student/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      <CalendarCheck className="h-4 w-4" /> My Booking
                    </Link>
                  ) : null}
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <UserPlus className="h-4 w-4" /> Register
                  </Link>
                </>
              )}
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white"
              >
                <CalendarCheck className="h-4 w-4" /> Book Now
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              {HOSTEL.name} · {HOSTEL.phone}
            </p>
          </div>
        </div>
      ) : null}
    </header>
  )
}