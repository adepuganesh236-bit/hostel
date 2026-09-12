import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  BedDouble,
  Users,
  Snowflake,
  MapPin,
  ArrowRight,
  Eye,
  IndianRupee,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import RoomCard from '../components/room/RoomCard'
import BedGrid, { Legend } from '../components/room/BedGrid'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { cx, inr } from '../lib/utils'

const SHARING_FILTERS = [
  { label: 'All Rooms', value: 'all' },
  { label: '1 Sharing', value: 1 },
  { label: '2 Sharing', value: 2 },
  { label: '3 Sharing', value: 3 },
  { label: '4 Sharing', value: 4 },
]

export default function Rooms() {
  const { rooms } = useData()
const [searchParams] = useSearchParams()
  const paramRoom = searchParams.get('room')

  const [sharing, setSharing] = useState('all')
  const [acOnly, setAcOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [pickedRoom, setPickedRoom] = useState(null)
  const selectedRoom = pickedRoom || paramRoom || rooms[0]?.roomNumber

  const activeRoom = useMemo(
    () => rooms.find((r) => r.roomNumber === String(selectedRoom)) || rooms[0],
    [rooms, selectedRoom],
  )

  const filteredRooms = useMemo(() => {
    let list = rooms
    if (sharing !== 'all') list = list.filter((r) => r.sharing === sharing)
    if (acOnly) list = list.filter((r) => r.ac)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.typeLabel.toLowerCase().includes(q),
      )
    }
    return list
  }, [rooms, sharing, acOnly, query])

  const totalAvailable = rooms.reduce(
    (s, r) => s + r.beds.filter((b) => b.status === 'available').length,
    0,
  )

  return (
    <div>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Rooms & Tariff
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            Pick the Room That Fits You
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Live availability for every bed. Only <b className="text-emerald-300">{totalAvailable}</b> beds
            are free across our 40 rooms.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {SHARING_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setSharing(f.value)}
                className={cx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  sharing === f.value
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setAcOnly((v) => !v)}
              className={cx(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                acOnly
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700',
              )}
            >
              <Snowflake className="h-4 w-4" /> AC Only
            </button>
          </div>
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search room number…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Room cards */}
        {filteredRooms.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room, i) => (
              <RoomCard key={room.roomNumber} room={room} index={i} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-slate-500">
            No rooms match your filters. Try clearing the search.
          </p>
        )}
      </section>

      {/* ========================= ROOM AVAILABILITY ========================= */}
      <section id="availability" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live availability"
          title="Check Available Beds in Real Time"
          subtitle="Choose a room below to see every bed and its current status. Green beds can be booked instantly."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Room list */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="font-display text-sm font-bold text-slate-800">All Rooms</p>
                <Legend />
              </div>
              <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
                {rooms.map((room) => {
                  const avail = room.beds.filter((b) => b.status === 'available').length
                  const active = activeRoom?.roomNumber === room.roomNumber
                  return (
                    <button
                      key={room.roomNumber}
                      onClick={() => {
                        setPickedRoom(room.roomNumber)
                        document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={cx(
                        'flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all',
                        active
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cx(
                            'flex h-10 w-10 items-center justify-center rounded-lg font-display text-xs font-bold',
                            avail > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {room.roomNumber}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{room.typeLabel}</p>
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Users className="h-3 w-3" /> {room.sharing} sharing · {room.ac ? 'AC' : 'Non-AC'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        status={avail > 0 ? 'available' : 'occupied'}
                        label={avail > 0 ? `${avail} free` : 'Full'}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Selected room beds */}
          <div className="lg:col-span-3">
            {activeRoom ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 font-display text-sm font-bold text-white">
                      {activeRoom.roomNumber}
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold text-slate-900">{activeRoom.typeLabel}</p>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" /> Floor {activeRoom.floor} · {activeRoom.ac ? 'AC Room' : 'Non-AC Room'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-slate-900">{inr(activeRoom.rent)}</p>
                    <p className="text-xs text-slate-400">per month · advance {inr(activeRoom.advance)}</p>
                  </div>
                </div>

                <BedGrid room={activeRoom} onSelect={() => {}} />

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                  <Link to={`/booking?room=${activeRoom.roomNumber}`}>
                    <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                      Book This Room
                    </Button>
                  </Link>
                  <p className="text-sm text-slate-400">
                    All-inclusive: food ₹2,000 + electricity ₹500 per month
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Tariff quick reference */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Quick tariff" title="Rates at a Glance" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((share) => {
              const sample = rooms.find((r) => r.sharing === share)
              if (!sample) return null
              return (
                <div key={share} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <BedDouble className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-display text-base font-bold text-slate-900">
                    {share === 1 ? 'Single' : `${share} Sharing`}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-slate-900">
                    {inr(sample.rent)}
                    <span className="text-xs font-semibold text-slate-400">/mo</span>
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
                    <IndianRupee className="h-3 w-3" /> Advance {inr(sample.advance)}
                  </p>
                  <Link
                    to={`/booking?room=${sample.roomNumber}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
                  >
                    <Eye className="h-4 w-4" /> Book now
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}