import { useState } from 'react'
import {
  Utensils,
  MessageSquareText,
  Info,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { WEEKLY_MENU, DAILY_TIMINGS, FOOD_RULES, getTodayDay } from '../lib/foodData'
import { HOSTEL } from '../config'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const dayItems = (day) => [
  ...(WEEKLY_MENU.Breakfast[day] || []),
  ...(WEEKLY_MENU.Lunch[day] || []),
  ...(WEEKLY_MENU.Dinner[day] || []),
]

export default function Food() {
  const toast = useToast()
  const today = getTodayDay()
  const [feedback, setFeedback] = useState({ rating: 5, message: '' })

  const todayMenu = dayItems(today)

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
            Home-style, hygienically prepared food for all residents at {HOSTEL.name}
            — with a rotating weekly menu that never gets boring.
          </p>
        </div>
      </section>

      {/* Today's menu */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`Today · ${today}`}
          title="Today's Menu"
          subtitle="Everything being served today, all in one place."
        />
        <div className="anim-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
              <Utensils className="h-5 w-5 text-brand-600" /> Today's Menu
            </h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {today}
            </span>
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {todayMenu.map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Food timings */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Serving Hours"
            title="Food Timings"
            subtitle="Meals are served fresh and on time, every day."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(DAILY_TIMINGS).map(([meal, time], i) => (
              <div
                key={meal}
                className="anim-fade-up rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10">
                  <Clock className="h-6 w-6 text-brand-600" />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-slate-900">{meal}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{time}</p>
              </div>
            ))}
          </div>
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
                    <th className="w-40 px-5 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      Day
                    </th>
                    <th className="px-5 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      Menu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day) => (
                    <tr
                      key={day}
                      className={`border-b border-slate-100 transition hover:bg-brand-50/40 ${day === today ? 'bg-brand-50/60' : ''}`}
                    >
                      <td className="px-5 py-4 align-top">
                        <span className="font-bold text-slate-800">
                          {day}
                          {day === today ? (
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              TODAY
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {dayItems(day).join(' · ')}
                      </td>
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