import { Star, BadgeCheck, GraduationCap } from 'lucide-react'
import { formatDate, getInitials } from '../../lib/utils'
import { Card } from '../ui/Card'

export function Stars({ rating = 5, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default function ReviewCard({ review, index = 0 }) {
  return (
    <Card className="anim-fade-up flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div style={{ animationDelay: `${index * 60}ms` }}>
        <div className="flex items-center justify-between">
          <Stars rating={review.rating} />
          {review.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified Student
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-700">“{review.text}”</p>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
            {getInitials(review.name || review.firstName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">
              {review.name || review.firstName}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <GraduationCap className="h-3 w-3" />
              <span className="truncate">{review.college || 'Student'}</span>
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {formatDate(review.date)}
          </span>
        </div>
      </div>
    </Card>
  )
}