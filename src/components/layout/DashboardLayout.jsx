import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Wallet,
  MessageSquareWarning,
  LogOut,
  Building2,
  Menu,
  X,
  ChevronRight,
  LifeBuoy,
  Share2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { HOSTEL } from '../../config'
import { cx } from '../../lib/utils'

const NAV_CONFIG = {
  student: [
    { to: '/student/dashboard', label: 'My Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/student/payments', label: 'My Payments', icon: Wallet },
  ],
  owner: [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/owner/rooms', label: 'Rooms & Beds', icon: BedDouble },
    { to: '/owner/students', label: 'Students', icon: Users },
    { to: '/owner/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/owner/payments', label: 'Payments & Revenue', icon: Wallet },
    { to: '/owner/complaints', label: 'Complaints', icon: MessageSquareWarning },
    { to: '/owner/social', label: 'Social Media', icon: Share2 },
  ],
}

const ROLE_LABEL = { student: 'Student Panel', owner: 'Owner Panel' }
const ROLE_TINT = {
  student: 'from-brand-600 to-brand-800',
  owner: 'from-amber-500 to-orange-600',
}

export default function DashboardLayout({ scope }) {
  const { role, profile, logout, isDemo } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productMenu, setProductMenu] = useState(false)

  const items = NAV_CONFIG[scope] || []

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully.')
    navigate('/')
  }

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${ROLE_TINT[scope]}`}>
          <Building2 className="h-5 w-5" />
        </span>
        <div className="flex flex-col">
          <span className="font-display text-base font-bold text-white">{HOSTEL.name}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {ROLE_LABEL[scope]}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-3 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-slate-400">
        <p className="font-semibold text-slate-300">Need help?</p>
        <p className="mt-1">{scope === 'student' ? 'Reach the warden at any time via the contact page.' : 'Manage your hostel operations here.'}</p>
      </div>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <LifeBuoy className="h-5 w-5" /> View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-slate-900 lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="anim-fade-in absolute inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <aside className="anim-drawer absolute inset-y-0 left-0 w-64 bg-slate-900">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      ) : null}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-sm font-bold text-slate-900 sm:text-base">
                  {HOSTEL.name}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  {ROLE_LABEL[scope]} {isDemo ? '· Demo Mode' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isDemo ? (
                <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 sm:inline">
                  Demo Data
                </span>
              ) : null}
              <button
                onClick={() => setProductMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-br ${ROLE_TINT[scope]}`}>
                  {(profile?.full_name || profile?.name || 'U').slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate md:block">
                  {profile?.full_name || profile?.name || 'User'}
                </span>
                <ChevronRight className={cx('h-4 w-4 transition-transform', productMenu && 'rotate-90')} />
              </button>
            </div>
          </div>

          {productMenu ? (
            <div className="anim-fade-up absolute right-4 top-16 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {profile?.full_name || profile?.name}
                </p>
                <p className="mt-0.5 text-xs capitalize text-slate-500">{role} account</p>
              </div>
              <div className="p-1.5">
                <Link to="/" onClick={() => setProductMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  <Building2 className="h-4 w-4" /> View Website
                </Link>
                <button
                  onClick={() => { setProductMenu(false); handleLogout() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          ) : null}
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}