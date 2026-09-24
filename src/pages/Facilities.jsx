import { useState } from 'react'
import {
  Wifi,
  Camera,
  ShieldCheck,
  WashingMachine,
  Car,
  Zap,
  Droplets,
  Sparkles,
  GlassWater,
  BookOpen,
  Armchair,
  Brush,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { HOSTEL } from '../config'
import { useData } from '../context/DataContext'
import { inr } from '../lib/utils'
import { Link } from 'react-router-dom'

const FACILITIES = [
  { icon: Wifi, title: 'High-Speed Wi-Fi', text: '100 Mbps secure fiber connection available in every room and common area. Perfect for online classes.', color: 'bg-sky-500' },
  { icon: Camera, title: '24/7 CCTV', text: 'Every corridor, entrance and common area is under continuous video surveillance for your safety.', color: 'bg-slate-700' },
  { icon: ShieldCheck, title: '24/7 Security', text: 'Trained security guards, biometric entry and wardens on every floor, day and night.', color: 'bg-emerald-600' },
  { icon: WashingMachine, title: 'Laundry', text: 'In-house washing machines and affordable laundry service with ironing, on request.', color: 'bg-violet-600' },
  { icon: Car, title: 'Parking', text: 'Secure covered parking for bikes and cycles with 24/7 access for residents.', color: 'bg-brand-600' },
  { icon: Zap, title: 'Power Backup', text: 'Full inverter backup so lights, fans and internet stay on even during power cuts.', color: 'bg-amber-500' },
  { icon: Droplets, title: 'Hot Water', text: 'Geyser-powered hot water available in every bathroom during winter mornings.', color: 'bg-orange-500' },
  { icon: Sparkles, title: 'Cleaning', text: 'Rooms and washrooms cleaned regularly by a professional housekeeping team.', color: 'bg-pink-500' },
  { icon: GlassWater, title: 'Drinking Water', text: 'RO purified drinking water dispensers on every floor, serviced and monitored.', color: 'bg-sky-600' },
  { icon: BookOpen, title: 'Study Area', text: 'Quiet, well-lit study halls that stay open late during exam season.', color: 'bg-teal-600' },
  { icon: Armchair, title: 'Common Area', text: 'TV lounge with seating for movies, sports and relaxed conversations with friends.', color: 'bg-rose-500' },
  { icon: Brush, title: 'Housekeeping', text: 'Dedicated housekeeping staff keep the hostel tidy — from linen to dusting.', color: 'bg-indigo-500' },
]

export default function Facilities() {
  const { rooms } = useData()
  const [activeFloor, setActiveFloor] = useState(1)
  const [activeSharing, setActiveSharing] = useState(0)

  const floors = [1, 2, 3, 4]
  const sharings = [4, 6, 10]
  const floorRooms = rooms
    .filter((r) => Number(r.floor) === activeFloor)
    .filter((r) => (activeSharing ? Number(r.sharing) === activeSharing : true))
    .slice(0, 5)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Facilities
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            Premium Facilities at {HOSTEL.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Everything a student needs to study, rest and grow — available and
            maintained across the entire hostel.
          </p>
        </div>
      </section>

      <section className="bg-slate-100 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="Every Facility is Part of Your Stay"
            subtitle="There are no hidden charges. All listed facilities are included in your monthly rent."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f, i) => (
            <div
              key={f.title}
              className="anim-fade-up group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </span>
                <p className="font-display text-base font-bold text-slate-900">{f.title}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= ROOMS BY FLOOR ========================= */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Rooms by floor"
          title="Explore Rooms Floor by Floor"
          subtitle="Pick a floor to see the five rooms on it — each with live bed availability."
        />

        {/* Sharing selector */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {sharings.map((share) => (
            <button
              key={share}
              onClick={() => setActiveSharing((prev) => (prev === share ? 0 : share))}
              className={
                activeSharing === share
                  ? 'inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm'
                  : 'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700'
              }
            >
              <Users className="h-4 w-4" /> {share} Sharing
            </button>
          ))}
        </div>

        {/* Floor selector */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={
                activeFloor === floor
                  ? 'inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm'
                  : 'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700'
              }
            >
              <Building2 className="h-4 w-4" /> Floor {floor}
            </button>
          ))}
        </div>

        {/* Rooms on selected floor */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {floorRooms.length ? (
            floorRooms.map((room, i) => (
              <div
                key={room.roomNumber}
                className="anim-fade-up flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-brand-600 to-brand-800">
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={`Room ${room.roomNumber}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-display text-2xl font-bold text-white">
                      Room {room.roomNumber}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-200">
                      <Building2 className="h-3 w-3" /> Floor {room.floor}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Starting at</p>
                      <p className="font-display text-xl font-bold text-slate-900">
                        {inr(room.rent)}
                        <span className="text-sm font-semibold text-slate-400">/month</span>
                      </p>
                    </div>
                    <Link
                      to={`/booking?room=${room.roomNumber}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
                    >
                      Book Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-16 text-center text-slate-500">
              No rooms found on this floor.
            </p>
          )}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Reserve Your Bed Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}