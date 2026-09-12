import { Link } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Share2,
  AtSign,
  MessageCircle,
  ShieldCheck,
  CookingPot,
  Heart,
} from 'lucide-react'
import { HOSTEL } from '../../config'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/rooms', label: 'Rooms & Tariff' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/food', label: 'Food & Menu' },
]

const STUDENT_LINKS = [
  { to: '/register', label: 'Create Account' },
  { to: '/login', label: 'Student Login' },
  { to: '/booking', label: 'Book a Room' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">StayNest</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400">
                  Premium Hostel
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{HOSTEL.tagline}</p>
            <div className="mt-5 flex gap-2">
              {[
                  { Icon: Globe, label: 'Website' },
                  { Icon: MessageCircle, label: 'WhatsApp' },
                  { Icon: AtSign, label: 'Email' },
                  { Icon: Share2, label: 'Share' },
                ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-brand-600 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 transition hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For students */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              For Students
            </h4>
            <ul className="mt-4 space-y-2.5">
              {STUDENT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 transition hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3 rounded-xl bg-white/5 p-3 text-xs">
              <CookingPot className="h-4 w-4 shrink-0 text-brand-400" />
              <p className="text-slate-400">
                Breakfast • Lunch • Dinner served fresh every day.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-slate-400">{HOSTEL.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${HOSTEL.phone}`} className="text-slate-400 transition hover:text-brand-300">
                  {HOSTEL.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${HOSTEL.email}`} className="text-slate-400 transition hover:text-brand-300">
                  {HOSTEL.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-slate-400">Visit: 10 AM – 7 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {HOSTEL.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/" className="transition hover:text-brand-300">Privacy Policy</Link>
            <Link to="/" className="transition hover:text-brand-300">Terms</Link>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Secure & Safe Campus
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-slate-900 py-3 text-center text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          Made with <Heart className="h-3 w-3 text-rose-500" /> for a safe student stay
        </span>
        <span className="mx-2 opacity-30">|</span>
        {HOSTEL.city}, {HOSTEL.state}
      </div>
    </footer>
  )
}