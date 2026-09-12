import { cx } from '../../lib/utils'

const baseControl =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2'

const toneMap = {
  default: 'border-slate-300 focus:border-brand-400 focus:ring-brand-500/20',
  error: 'border-rose-400 focus:border-rose-400 focus:ring-rose-500/20',
}

export function Field({ label, error, hint, required, children, className, id }) {
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  )
}

export function Input({ error, className, ...props }) {
  return (
    <input
      className={cx(baseControl, toneMap[error ? 'error' : 'default'], className)}
      {...props}
    />
  )
}

export function Select({ error, className, children, ...props }) {
  return (
    <select
      className={cx(baseControl, toneMap[error ? 'error' : 'default'], 'appearance-none pr-8', className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ error, className, ...props }) {
  return (
    <textarea
      className={cx(baseControl, toneMap[error ? 'error' : 'default'], 'min-h-28 resize-y', className)}
      {...props}
    />
  )
}

export function FormSection({ title, subtitle, children, className }) {
  return (
    <div className={className}>
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-brand-700">
        {title}
      </h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  )
}