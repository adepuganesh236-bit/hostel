import { cx, bedStatusLabel } from '../../lib/utils'
import { BedDouble, User } from 'lucide-react'

const STYLES = {
  available: {
    wrap: 'cursor-pointer border-emerald-300 bg-emerald-50 hover:border-emerald-500 hover:shadow-md',
    dot: 'bg-emerald-500',
    label: 'text-emerald-700',
    ring: 'ring-emerald-300',
  },
  occupied: {
    wrap: 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70',
    dot: 'bg-rose-500',
    label: 'text-rose-600',
    ring: 'ring-rose-300',
  },
  reserved: {
    wrap: 'cursor-not-allowed border-amber-300 bg-amber-50 opacity-80',
    dot: 'bg-amber-500',
    label: 'text-amber-700',
    ring: 'ring-amber-300',
  },
}

export default function BedGrid({ room, selectedBedId, onSelect, disabled = false }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">
          Beds in Room {room.roomNumber} <span className="text-slate-400">({room.typeLabel})</span>
        </p>
        <Legend />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {room.beds.map((bed) => {
          const style = STYLES[bed.status] || STYLES.available
          const selected = selectedBedId === bed.id
          return (
            <button
              key={bed.id}
              type="button"
              disabled={disabled || bed.status !== 'available'}
              onClick={() => onSelect?.(bed)}
              className={cx(
                'relative flex flex-col items-start gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200',
                style.wrap,
                selected && 'ring-2 ring-brand-500 border-brand-500 bg-brand-50',
                selected && bed.status === 'available' && '!bg-brand-50 !border-brand-500',
              )}
            >
              {selected ? (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : null}
              <div className="flex items-center gap-2">
                <span className={cx('h-2.5 w-2.5 rounded-full', style.dot)} />
                <span className={cx('text-sm font-bold', style.label)}>
                  {bedStatusLabel(bed.status)}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {bed.bedNumber}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                {bed.status === 'occupied' ? (
                  <>
                    <User className="h-3 w-3" />
                    {bed.studentName || 'Student'}
                  </>
                ) : bed.status === 'reserved' ? (
                  'Held for a student'
                ) : (
                  <>
                    <BedDouble className="h-3 w-3 text-emerald-500" />
                    Ready to book
                  </>
                )}
              </p>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Only <span className="font-semibold text-emerald-600">Available</span> beds can be selected.
        Occupied and Reserved beds are not selectable.
      </p>
    </div>
  )
}

export function Legend() {
  const items = [
    { s: 'available', label: 'Available' },
    { s: 'occupied', label: 'Occupied' },
    { s: 'reserved', label: 'Reserved' },
  ]
  return (
    <div className="flex items-center gap-3 text-xs">
      {items.map((i) => (
        <span key={i.s} className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className={cx('h-2 w-2 rounded-full', i.s === 'available' ? 'bg-emerald-500' : i.s === 'occupied' ? 'bg-rose-500' : 'bg-amber-500')} />
          {i.label}
        </span>
      ))}
    </div>
  )
}