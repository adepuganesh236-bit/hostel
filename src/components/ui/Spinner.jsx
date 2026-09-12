import { Loader2 } from 'lucide-react'

export default function Spinner({ label = 'Loading...', full = false }) {
  if (full) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
      {label}
    </span>
  )
}