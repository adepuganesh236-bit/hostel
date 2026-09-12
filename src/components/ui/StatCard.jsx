import { cx } from '../../lib/utils'

const ACCENTS = {
  brand: 'bg-brand-600',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  slate: 'bg-slate-700',
  violet: 'bg-violet-600',
}

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = 'brand',
  className,
  index = 0,
}) {
  return (
    <div
      className={cx(
        'anim-fade-up relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft',
        className,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>
          {sub ? <p className="mt-1 truncate text-xs font-medium text-slate-400">{sub}</p> : null}
        </div>
        {Icon ? (
          <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm', ACCENTS[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}