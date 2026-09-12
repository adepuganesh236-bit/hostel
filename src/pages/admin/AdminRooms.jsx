import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Search, Snowflake, Eye } from 'lucide-react'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminRooms() {
  const { rooms } = useData()
  const [query, setQuery] = useState('')

  const filtered = rooms.filter((r) => r.roomNumber.includes(query.trim()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Rooms & Beds</h1>
        <p className="mt-0.5 text-sm text-slate-500">Overview of all rooms, beds and live occupancy.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search room number…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <Card>
        <CardHeader title="Room Registry" subtitle="Click any room for owner-level management." icon={BedDouble} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((room) => {
                const occ = room.beds.filter((b) => b.status === 'occupied').length
                const avail = room.beds.filter((b) => b.status === 'available').length
                return (
                  <Link
                    key={room.roomNumber}
                    to={`/owner/rooms/${room.roomNumber}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-base font-bold text-slate-900">Room {room.roomNumber}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {room.typeLabel} · {room.ac ? <Snowflake className="inline h-3 w-3 text-sky-500" /> : ''}{' '}
                          {room.ac ? 'AC' : 'Non-AC'}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition group-hover:bg-brand-600 group-hover:text-white">
                        <Eye className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Badge status="occupied" label={`+${occ} occupied`} />
                      <Badge status="available" label={`${avail} available`} />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="px-5"><EmptyState title="No rooms match your search" /></div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}