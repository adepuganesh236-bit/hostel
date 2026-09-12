import { Link } from 'react-router-dom'
import {
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
  BedDouble,
  CheckCircle2,
  ArrowRight,
  Award,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { HOSTEL } from '../config'

const VALUES = [
  { icon: ShieldCheck, title: 'Safe Accommodation', text: 'Biometric entry gates, 24/7 CCTV and wardens on every floor keep students secure at all times.' },
  { icon: Sparkles, title: 'Clean Rooms', text: 'Rooms are cleaned twice a week and linen is replaced regularly so you always stay fresh.' },
  { icon: Utensils, title: 'Quality Food', text: 'Three healthy, home-style meals served every day — hygienically prepared and supervised.' },
  { icon: HeartHandshake, title: 'Friendly Management', text: 'Our wardens and owners are always approachable and quick to resolve any issue.' },
]

const MILESTONES = [
  { value: '40+', label: 'Comfortable Rooms' },
  { value: '100', label: 'Total Beds' },
  { value: '3+', label: 'Years of Service' },
  { value: '4.8★', label: 'Average Rating' },
]

export default function About() {
  return (
    <div>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            About us
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            {HOSTEL.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{HOSTEL.tagline}</p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="Built by Students, for Students"
            />
            <div className="-mt-4 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Staying away from home for education shouldn't mean compromising
                on comfort, safety or good food. {HOSTEL.name} was created with a
                simple mission — give every student a warm, secure and affordable
                place to live while they chase their dreams.
              </p>
              <p>
                Located in the heart of {HOSTEL.city}, we are minutes away from
                colleges, libraries and the metro. With 40 thoughtfully designed
                rooms, 100 beds, a hygienic kitchen and round-the-clock security,
                we make sure you always feel at home.
              </p>
              <p>
                Whether you are preparing for exams, starting your first job, or
                moving to a new city for studies — your safety and comfort are in
                the hands of people who care.
              </p>
            </div>

            {/* Mission / Vision */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Target className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-base font-bold text-slate-900">Our Mission</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Provide safe, clean and affordable student accommodation with
                  nutritious food and genuine care.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Eye className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-base font-bold text-slate-900">Our Vision</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Be the most trusted student residence where parents can be
                  confident their children are in good hands.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/dining.jpg"
                alt="Dining"
                className="h-56 w-full rounded-2xl object-cover shadow-soft"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <img
                src="/images/study.jpg"
                alt="Study area"
                className="mt-8 h-56 w-full rounded-2xl object-cover shadow-soft"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <img
                src="/images/common.jpg"
                alt="Common area"
                className="h-56 w-full rounded-2xl object-cover shadow-soft"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <img
                src="/images/hostel.jpg"
                alt="Hostel building"
                className="mt-8 h-56 w-full rounded-2xl object-cover shadow-soft"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why choose us"
            title="The StayNest Promise"
            subtitle="A student-friendly environment built on safety, cleanliness and care."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="anim-fade-up rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                  <v.icon className="h-7 w-7" />
                </span>
                <p className="mt-4 font-display text-base font-bold text-slate-900">{v.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student environment */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/images/common.jpg"
                alt="student environment"
                className="h-96 w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Student-friendly"
              title="A Community That Helps You Grow"
            />
            <div className="-mt-4 space-y-4">
              {[
                'Weekly study circles and quiet hours in a dedicated study hall.',
                'Common lounges for movies, board games and group hangouts.',
                'Fast Wi-Fi in every room so online classes never buffer.',
                'Wardens who organise festivals, birthdays and fresher nights.',
                'A mess that listens — special menus for exam week and festivals.',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-medium text-slate-700">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/gallery" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
                See the Photos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((m, i) => (
              <div key={m.label} className="anim-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <p className="font-display text-4xl font-extrabold text-amber-400">{m.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-card">
          <Award className="mx-auto h-10 w-10 text-brand-600" />
          <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Experience the StayNest Difference
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500">
            Visit us any day between 10 AM and 7 PM, or book a bed online in just a few minutes.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/rooms" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
              <BedDouble className="h-4 w-4" /> Explore Rooms
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-7 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700">
              <Users className="h-4 w-4" /> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}