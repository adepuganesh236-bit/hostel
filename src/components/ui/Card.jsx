import { cx } from '../../lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-slate-200 bg-white shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon: Icon, action, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4', className)}>
      <div className="flex items-center gap-3">
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div>
          {title ? <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3> : null}
          {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cx('px-5 py-5', className)}>{children}</div>
}