import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="h-7 w-7" />
      </span>
      <p className="mt-6 font-display text-5xl font-black text-slate-900">404</p>
      <p className="mt-2 text-lg font-bold text-slate-700">Page not found</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back home.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  )
}