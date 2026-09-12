import { Link } from 'react-router-dom'
import {
  Users,
  Snowflake,
  Gauge,
  Banknote,
  BedDouble,
  ArrowRight,
} from 'lucide-react'
import { inr } from '../../lib/utils'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function RoomCard({ room, index = 0, compact: _compact = false }) {
  const available = room.beds.filter((b) => b.status === 'available').length
  const occupied = room.beds.filter((b) => b.status === 'occupied').length

  return (
    <div
      className="anim-fade-up group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src="/images/room.jpg"
          alt={`${room.roomNumber} ${room.typeLabel}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge
            label={room.ac ? 'AC Room' : 'Non-AC'}
            status={room.ac ? 'confirmed' : 'pending'}
            className="backdrop-blur"
          />
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="font-display text-lg font-bold text-white">{room.typeLabel}</p>
          <p className="text-xs font-medium text-slate-200">
            Room {room.roomNumber} · Floor {room.floor}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Meta icon={Users} label="Capacity" value={`${room.sharing} Student${room.sharing > 1 ? 's' : ''}`} />
          <Meta icon={Snowflake} label="Cooling" value={room.ac ? 'AC / Cooler' : 'Non-AC'} />
          <Meta icon={BedDouble} label="Available" value={`${available} of ${room.beds.length}`} />
          <Meta icon={Gauge} label="Occupied" value={String(occupied)} />
        </div>

        <div className="flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Monthly Rent</p>
            <p className="font-display text-xl font-bold text-slate-900">{inr(room.rent)}</p>
            <p className="text-xs text-slate-400">Advance {inr(room.advance)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/rooms?room=${room.roomNumber}#availability`}>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </Link>
            <Link to={`/booking?room=${room.roomNumber}`}>
              <Button variant="primary" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <p className="text-emerald-600">{available} bed{available !== 1 ? 's' : ''} available now</p>
          <p className="flex items-center gap-1 text-slate-400"><Banknote className="h-3.5 w-3.5" /> All-inclusive</p>
        </div>
      </div>
    </div>
  )
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-brand-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  )
}