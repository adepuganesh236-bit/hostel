import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { HOSTEL } from '../../config'

export default function AuthShell({ title, subtitle, children, footer, demoHint }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left visual panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950" />
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold">{HOSTEL.name}</span>
          </Link>
          <div>
            <h2 className="max-w-md font-display text-3xl font-bold leading-snug">
              {HOSTEL.tagline}
            </h2>
            <p className="mt-4 max-w-md text-slate-300">
              Secure, comfortable and student friendly. Book your bed online in
              minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['24/7 Security', 'Real-time availability', 'Home-style food'].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} {HOSTEL.name}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-8 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-slate-900">{HOSTEL.name}</span>
          </Link>
        </div>

        {demoHint ? <div className="mb-5 w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium leading-relaxed text-amber-800">{demoHint}</div> : null}

        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-slate-500">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}