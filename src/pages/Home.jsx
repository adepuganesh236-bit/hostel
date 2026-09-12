import { Link } from 'react-router-dom'
import {
  IndianRupee,
  BedDouble,
  ShieldCheck,
  CookingPot,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  Wifi,
  Camera,
  Utensils,
  Users,
  Building2,
  Quote,
} from 'lucide-react'
import { HOSTEL, PRICING, AVAILABLE_BEDS } from '../config'
import { useData } from '../context/DataContext'
import { inr } from '../lib/utils'
import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import { heroImageUrl } from '../lib/storage'

export default function Home() {
  const { rooms, stats } = useData()
  const featuredRooms = rooms.slice(0, 3)

  const quickInfo = [
    { icon: IndianRupee, label: 'Starting From', value: `${inr(PRICING.rooms.double.rent)}/month`, sub: '2 Sharing Non-AC', accent: 'bg-brand-600' },
    { icon: BedDouble, label: 'Available Beds', value: String(AVAILABLE_BEDS), sub: stats?.available ? `${stats.available} live right now` : 'across 40 rooms', accent: 'bg-emerald-500' },
    { icon: ShieldCheck, label: 'Security', value: '24/7 CCTV', sub: 'Round the clock monitoring', accent: 'bg-slate-800' },
    { icon: CookingPot, label: 'Food', value: '3 Meals Daily', sub: 'Breakfast · Lunch · Dinner', accent: 'bg-amber-500' },
  ]

  const aboutPoints = [
    { title: 'Clean Rooms', text: 'Housekeeping twice a week with fresh linen.' },
    { title: 'Quality Food', text: 'Home-style veg & non-veg meals prepared fresh.' },
    { title: 'Safe Accommodation', text: '24/7 CCTV, biometric entry and wardens on duty.' },
    { title: 'Friendly Management', text: 'A management team that genuinely cares about students.' },
  ]

  const steps = [
    { n: '01', title: 'Choose Your Room', text: 'Browse single to 4 sharing rooms with live bed availability.' },
    { n: '02', title: 'Book Your Bed', text: 'Pick an available bed and complete the booking form.' },
    { n: '03', title: 'Pay Securely', text: 'Pay via UPI, cards or net banking through a secure checkout.' },
    { n: '04', title: 'Move In', text: 'Get a confirmed room and enjoy a home away from home.' },
  ]

  const testimonials = [
    { name: 'Rahul S.', role: 'IIT Madras', text: 'Very clean rooms and good facilities. Truly feels like home.' },
    { name: 'Sneha R.', role: 'Anna University', text: 'Safe, secure and the food is amazing. My parents are relieved!' },
    { name: 'Arjun N.', role: 'VIT Chennai', text: 'Great study area, high-speed Wi-Fi and friendly wardens.' },
  ]

  return (
    <div>
      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl()}
            alt="StayNest Premium Hostel"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.style.background =
                'linear-gradient(135deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-400" />
              {HOSTEL.name}
            </p>
            <h1
              className="anim-fade-up mt-6 text-balance font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Find Your Perfect Room.
              <span className="block bg-gradient-to-r from-brand-300 via-amber-300 to-pink-300 bg-clip-text text-transparent">
                Feel At Home.
              </span>
            </h1>
            <p
              className="anim-fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-200"
              style={{ animationDelay: '160ms' }}
            >
              Comfortable rooms, great facilities, delicious food and a secure
              environment for students.
            </p>
            <div
              className="anim-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-base font-bold text-white shadow-lift transition hover:bg-amber-600"
              >
                Book Your Room <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Rooms
              </Link>
            </div>

            <div className="anim-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-bold text-emerald-200 ring-1 ring-inset ring-emerald-400/40">
                <BedDouble className="h-4 w-4" /> {AVAILABLE_BEDS} Beds Available
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-inset ring-white/20">
                <Users className="h-4 w-4" /> Trusted by {stats.occupied}+ students
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-inset ring-white/20">
                <Star className="h-4 w-4 text-amber-400" /> 4.8/5 rated hostel
              </span>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ======================== QUICK INFORMATION ======================== */}
      <section className="mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickInfo.map((card, i) => (
            <div
              key={card.label}
              className="anim-fade-up flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${card.accent}`}>
                <card.icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                <p className="truncate font-display text-lg font-bold text-slate-900">{card.value}</p>
                <p className="truncate text-xs text-slate-400">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= ABOUT ============================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/images/about.jpg"
                alt="About StayNest"
                className="h-96 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[420px]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:-right-6">
              <p className="font-display text-3xl font-extrabold text-brand-700">3+</p>
              <p className="text-sm font-semibold text-slate-500">Years of trust</p>
            </div>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="About our hostel"
              title="A Home Away From Home for Every Student"
            />
            <p className="-mt-4 text-base leading-relaxed text-slate-600">
              {HOSTEL.name} is a purpose-built student residence designed around
              what students really need — comfort, safety, healthy food and a
              focused study environment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {aboutPoints.map((p, i) => (
                <div
                  key={p.title}
                  className="anim-fade-up flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-display text-sm font-bold text-slate-800">{p.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ROOMS ============================= */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Rooms & Tariff"
            title="Rooms Built for Every Budget"
            subtitle="Choose from Single, 2, 3 or 4 sharing rooms — each with comfortable beds, study desks, storage and modern washrooms."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room, i) => (
              <RoomPreview key={room.roomNumber} room={room} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View All Rooms & Live Availability <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================= FACILITIES ============================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Facilities"
          title="Everything a Student Needs, in One Place"
          subtitle="From high-speed Wi-Fi to 24/7 security, we’ve thought of everything."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wifi, title: 'High-Speed Wi-Fi', text: '100 Mbps fiber across campus' },
            { icon: Camera, title: '24/7 CCTV', text: 'Every corridor monitored' },
            { icon: ShieldCheck, title: 'Security', text: 'Biometric door access & wardens' },
            { icon: Utensils, title: 'Mess & Dining', text: '3 freshly cooked meals daily' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="anim-fade-up group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <f.icon className="h-7 w-7" />
              </span>
              <p className="mt-4 font-display text-base font-bold text-slate-800">{f.title}</p>
              <p className="mt-1 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Badge label={`+ ${8} more facilities`} status="reserved" className="px-4 py-1.5" />
        </div>
      </section>

      {/* ============================= HOW IT WORKS ============================= */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              Simple booking
            </p>
            <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">
              Book Your Bed in Four Easy Steps
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="anim-fade-up relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="font-display text-4xl font-extrabold text-white/20">{s.n}</span>
                <p className="mt-3 font-display text-lg font-bold">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{s.text}</p>
                {i < steps.length - 1 ? (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-amber-400 lg:block" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-lift transition hover:bg-amber-600"
            >
              Start Your Booking <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================= TESTIMONIALS ============================= */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Student love"
          title="What Our Residents Say"
          subtitle="Real reviews from verified students currently staying with us."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="anim-fade-up relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quote className="h-8 w-8 text-brand-100" />
              <div className="mt-2 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">“{t.text}”</p>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {t.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= CTA ============================= */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-brand-900 px-8 py-14 text-center shadow-lift sm:px-16">
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative">
            <Building2 className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-4 text-balance font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to Move In? Beds Are Filling Fast.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-200">
              Only {AVAILABLE_BEDS} beds are available this month. Call us on{' '}
              <a href={`tel:${HOSTEL.phone}`} className="font-bold text-amber-300 underline-offset-2 hover:underline">
                {HOSTEL.phone}
              </a>{' '}
              or book online before they’re gone.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-base font-bold text-white transition hover:bg-amber-600">
                Book Your Room <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
                Visit the Hostel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RoomPreview({ room, index }) {
  const available = room.beds.filter((b) => b.status === 'available').length
  return (
    <div
      className="anim-fade-up group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src="/images/room.jpg"
          alt={room.typeLabel}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="font-display text-lg font-bold text-white">{room.typeLabel}</p>
          <p className="text-xs text-slate-200">Room {room.roomNumber} · {room.ac ? 'AC' : 'Non-AC'}</p>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
          {available} available
        </span>
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-slate-400">Starting at</p>
          <p className="font-display text-2xl font-bold text-slate-900">
            {inr(room.rent)}
            <span className="text-sm font-semibold text-slate-400">/month</span>
          </p>
        </div>
        <Link
          to={`/rooms?room=${room.roomNumber}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          View <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}