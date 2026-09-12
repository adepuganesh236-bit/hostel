import { useMemo, useState } from 'react'
import { Home as HomeIcon, X } from 'lucide-react'
import { IMAGES } from '../lib/demoData'
import { galleryImageUrl } from '../lib/storage'
import SectionHeading from '../components/ui/SectionHeading'
import { cx } from '../lib/utils'
import EmptyState from '../components/ui/EmptyState'

const CATEGORIES = ['All', 'Rooms', 'Hostel', 'Dining', 'Facilities', 'Common Area', 'Study Area', 'Parking']

export default function Gallery() {
  const [category, setCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const images = useMemo(
    () =>
      IMAGES.gallery.map((img) => ({
        ...img,
        src: galleryImageUrl(`gallery/${img.id}.jpg`, img.src),
      })),
    [],
  )

  const filtered = category === 'All' ? images : images.filter((i) => i.category === category)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 py-16 text-white sm:py-20">
        <HomeIcon className="absolute -right-16 -top-10 h-72 w-72 text-white/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Gallery
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            Take a Look Around StayNest
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Real photos of our rooms, dining hall, study areas and more — or
            better yet, come visit us in person.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Category filter */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cx(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightbox(img)}
                className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-slate-200 shadow-card transition-all duration-300 hover:shadow-soft"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className={cx(
                    'w-full object-cover transition-transform duration-500 group-hover:scale-105',
                    i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]',
                  )}
                  onError={(e) => {
                    // Placeholder gradient fallback so layout never breaks
                    e.currentTarget.onerror = null
                    e.currentTarget.style.background =
                      `linear-gradient(135deg, #6366f1, #8b5cf6)`
                  }}
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-4">
                    <p className="text-sm font-bold text-white">{img.title}</p>
                    <p className="text-xs font-medium text-slate-300">{img.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="No photos in this category yet" description="New photos are added regularly." />
        )}
      </section>

      {/* Lightbox */}
      {lightbox ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button
            className="absolute right-5 top-5 rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="anim-fade-up max-h-[86vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} className="max-h-[78vh] w-full rounded-2xl object-contain shadow-2xl" />
            <figcaption className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="font-display text-lg font-bold">{lightbox.title}</p>
                <p className="text-sm text-slate-400">{lightbox.category}</p>
              </div>
            </figcaption>
          </figure>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHeading title="Prefer to See It In Person?" subtitle="Visitors are welcome every day between 10 AM and 7 PM. Just contact us to schedule a walkthrough." />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">
            Schedule a Visit
          </a>
        </div>
      </div>
    </div>
  )
}