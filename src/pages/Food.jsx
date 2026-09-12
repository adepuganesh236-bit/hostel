import { useState } from 'react'
import {
  Sun,
  CloudSun,
  Moon,
  Clock,
  Utensils,
  MessageSquareText,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { WEEKLY_MENU, DAILY_TIMINGS, FOOD_RULES, getTodayDay } from '../lib/foodData'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

const MEALS = [
  { key: 'Breakfast', icon: Sun, time: DAILY_TIMINGS.Breakfast, color: 'bg-amber-500' },
  { key: 'Lunch', icon: CloudSun, time: DAILY_TIMINGS.Lunch, color: 'bg-brand-600' },
  { key: 'Dinner', icon: Moon, time: DAILY_TIMINGS.Dinner, color: 'bg-slate-800' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Food() {
  const toast = useToast()
  const today = getTodayDay()
  const [feedback, setFeedback] = useState({ rating: 5, message: '' })

  const todayMenu = (meal) => WEEKLY_MENU[meal][today] || []

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 py-16 text-white sm:py-20">
        <Utensils className="absolute -right-16 -top-10 h-72 w-72 text-white/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Food & Mess
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            Three Healthy Meals. Every Single Day.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Home-style, hygienically prepared food for all residents — with a
            rotating weekly menu that never gets boring.
          </p>
        </div>
      </section>

      {/* Today's menu */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`Today · ${today}`}
          title="Today's Menu"
          subtitle="The mess serves three meals a day, fresh and on time."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {MEALS.map((meal, i) => (
            <div
              key={meal.key}
              className="anim-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className={`flex items-center justify-between px-5 py-4 text-white ${meal.color}`}>
                <span className="flex items-center gap-2.5 font-display text-lg font-bold">
                  <meal.icon className="h-5 w-5" /> {meal.key}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  <Clock className="h-3.5 w-3.5" /> {meal.time}
                </span>
              </div>
              <ul className="space-y-2.5 px-5 py-5">
                {todayMenu(meal.key).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly menu */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Weekly Menu" subtitle="A complete 7-day cycle. Everyone gets variety and balance." />
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      Day
                    </th>
                    {MEALS.map((m) => (
                      <th key={m.key} className="px-5 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                        {m.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, _i) => (
                    <tr
                      key={day}
                      className={`border-b border-slate-100 transition hover:bg-brand-50/40 ${day === today ? 'bg-brand-50/60' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800">
                          {day}
                          {day === today ? (
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              TODAY
                            </span>
                          ) : null}
                        </span>
                      </td>
                      {MEALS.map((m) => (
                        <td key={m.key} className="px-5 py-4 text-slate-600">
                          {(WEEKLY_MENU[m.key][day] || []).slice(0, 3).join(' · ')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Rules + Feedback */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Food rules */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
            <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
              <Info className="h-5 w-5 text-brand-600" /> Food Timings & Rules
            </h3>
            <ul className="mt-5 space-y-3">
              {FOOD_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
              {MEALS.map((m) => (
                <div key={m.key} className="text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-700">
                    <m.icon className="h-4 w-4 text-brand-600" /> {m.key}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{m.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
            <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
              <MessageSquareText className="h-5 w-5 text-brand-600" /> Give Food Feedback
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Tell us what you loved or what we should improve about the mess.
              Your feedback goes straight to the mess committee.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">How was today's food?</p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setFeedback((f) => ({ ...f, rating: n }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition ${
                        n <= feedback.rating ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                      }`}
                      aria-label={`${n} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={feedback.message}
                onChange={(e) => setFeedback((f) => ({ ...f, message: e.target.value }))}
                placeholder="Share your feedback about the menu, taste, or hygiene…"
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                onClick={() => {
                  toast.success('Thanks for your feedback! The mess committee will review it.')
                  setFeedback({ rating: 5, message: '' })
                }}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}