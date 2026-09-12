import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-14 text-center ${className || ''}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-8 w-8" />
      </span>
      <div>
        <p className="font-display text-base font-semibold text-slate-700">{title}</p>
        {description ? <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}