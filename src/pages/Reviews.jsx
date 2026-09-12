import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star, PenLine, ShieldCheck } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ReviewCard, { Stars } from '../components/review/ReviewCard'
import Button from '../components/ui/Button'
import { Field, Textarea } from '../components/ui/Field'
import { Card, CardBody } from '../components/ui/Card'

export default function Reviews() {
  const { reviews, addReview, bookings } = useData()
  const { role, profile, isDemo } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState({ rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  // A student may review only if they have at least one confirmed booking.
  const hasConfirmedBooking = useMemo(() => {
    if ((role !== 'student' || !profile) && !isDemo) return false
    const name = profile?.full_name || profile?.name
    if (isDemo) return true // demo student has confirmed bookings
    return bookings.some(
      (b) =>
        b.studentName === name &&
        (String(b.studentId) === String(profile?.id) || b.studentName === name) &&
        b.status === 'confirmed',
    )
  }, [role, profile, bookings, isDemo])

  const canReview = role === 'student' && hasConfirmedBooking

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canReview) return
    if (!form.text.trim()) {
      toast.warning('Please write a short review before submitting.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      addReview({
        id: Date.now(),
        name: profile?.full_name || profile?.name || 'Student',
        firstName: (profile?.full_name || profile?.name || 'Student').split(' ')[0],
        college: profile?.college || 'Student',
        rating: form.rating,
        date: new Date().toISOString().slice(0, 10),
        text: form.text.trim(),
        verified: true,
      })
      setSubmitting(false)
      setForm({ rating: 5, text: '' })
      toast.success('Your review has been published. Thank you!')
    }, 600)
  }

  return (
    <div>
      {/* Hero with rating summary */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Reviews
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Rated {avg.toFixed(1)} / 5 by Our Students
          </h1>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="flex">
                  <Star
                    className={`h-6 w-6 ${
                      n <= Math.round(avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-white/20 text-white/20'
                    }`}
                  />
                </span>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {reviews.length} verified reviews from current residents
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Submit review */}
        <div className="mx-auto mb-14 max-w-2xl">
          {canReview ? (
            <Card>
              <CardBody>
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <PenLine className="h-5 w-5 text-brand-600" /> Write a Review
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  As a resident with a confirmed booking, your review is auto-verified.
                </p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <p className="mb-1.5 text-sm font-semibold text-slate-700">Your rating</p>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, rating: n }))}
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                            n <= form.rating
                              ? 'border-amber-300 bg-amber-50 text-amber-500'
                              : 'border-slate-200 bg-white text-slate-300 hover:border-amber-200'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${n <= form.rating ? 'fill-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Your review" required>
                    <Textarea
                      value={form.text}
                      onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                      placeholder="How was your stay? Rooms, food, security, management…"
                      rows={4}
                    />
                  </Field>
                  <Button type="submit" loading={submitting}>
                    Publish Review
                  </Button>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <div className="flex flex-col items-center gap-3 text-center">
                  <ShieldCheck className="h-10 w-10 text-brand-500" />
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {role === 'student'
                      ? 'Reviews open only for residents with confirmed bookings'
                      : 'Only verified students can submit reviews'}
                  </h3>
                  <p className="max-w-md text-sm text-slate-500">
                    {role === 'student'
                      ? 'Your review is only enabled once your booking is confirmed by the hostel.'
                      : 'Log in with your student account. If you have a confirmed booking, you can share your experience.'}
                  </p>
                  {!role ? (
                    <Link to="/login">
                      <Button variant="primary">Login to review</Button>
                    </Link>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Rating summary strip */}
        <div className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:grid-cols-4">
          <div className="text-center">
            <p className="font-display text-4xl font-extrabold text-slate-900">{avg.toFixed(1)}</p>
            <Stars rating={Math.round(avg)} className="mt-1 justify-center" />
            <p className="mt-1 text-xs text-slate-400">Overall rating</p>
          </div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-8 text-sm font-bold text-slate-600">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-slate-400">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Reviews grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}