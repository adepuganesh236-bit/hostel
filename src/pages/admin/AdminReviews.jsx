import { useState } from 'react'
import { Star, BadgeCheck, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../lib/utils'
import { Stars } from '../../components/review/ReviewCard'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminReviews() {
  const { reviews, removeReview } = useData()
  const toast = useToast()
  const [deleting, setDeleting] = useState(null)

  const handleDelete = () => {
    removeReview(deleting.id)
    toast.success('Review removed.')
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="mt-0.5 text-sm text-slate-500">Moderate student reviews shown on the website.</p>
      </div>

      <Card>
        <CardHeader title="Student Reviews" subtitle="Only verified students with confirmed bookings can post." icon={Star} />
        <CardBody className="p-0">
          {reviews.length ? (
            <ul className="divide-y divide-slate-100">
              {reviews.map((r) => (
                <li key={r.id} className="flex flex-col gap-3 px-5 py-4 hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-800">{r.name}</p>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <BadgeCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{r.college} · {formatDate(r.date)}</span>
                    </div>
                    <div className="mt-1"><Stars rating={r.rating} /></div>
                    <p className="mt-1.5 text-sm text-slate-600">“{r.text}”</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setDeleting(r)} icon={<Trash2 className="h-4 w-4" />}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5"><EmptyState title="No reviews yet" /></div>
          )}
        </CardBody>
      </Card>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Remove review?" subtitle="This review will be hidden from the public website.">
        <p className="text-sm text-slate-500">
          Delete the review by <b>{deleting?.name}</b> {deleting ? `(${deleting.rating}★)` : ''}?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Keep</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Review</Button>
        </div>
      </Modal>
    </div>
  )
}