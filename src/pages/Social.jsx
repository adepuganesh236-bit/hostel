import {
  AtSign,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { HOSTEL } from '../config'
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from '../components/social/SocialIcons'
import { getSocialLinks } from '../lib/socialSettings'
import { cx } from '../lib/utils'

const SOCIAL_CARDS = [
  {
    key: 'instagram',
    label: 'Instagram',
    tagline: 'Daily stories, photos & resident features',
    Icon: InstagramIcon,
    tile: 'from-fuchsia-500 via-rose-500 to-amber-400',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    tagline: 'Updates, events and announcements',
    Icon: FacebookIcon,
    tile: 'from-blue-500 to-blue-700',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    tagline: 'Video tours and community clips',
    Icon: YoutubeIcon,
    tile: 'from-red-500 to-red-700',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    tagline: 'Chat with the warden directly',
    Icon: MessageCircle,
    tile: 'from-emerald-500 to-green-600',
  },
]

export default function Social() {
  const links = getSocialLinks()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Connect with us
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            Follow {HOSTEL.name} on Social Media
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Get the latest updates, photos and news from the hostel right in
            your feed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIAL_CARDS.map((card, i) => {
            const href = links[card.key]
            const disabled = !href || href === '#'
            return (
              <a
                key={card.key}
                href={disabled ? undefined : href}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={disabled}
                className={cx(
                  'anim-fade-up group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft',
                  disabled ? 'pointer-events-none opacity-70' : '',
                )}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span
                  className={cx(
                    'flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm transition group-hover:scale-105',
                    card.tile,
                  )}
                >
                  <card.Icon className="h-8 w-8" />
                </span>
                <p className="mt-5 font-display text-lg font-bold text-slate-900">
                  {card.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {card.tagline}
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  {disabled ? 'Link coming soon' : 'Follow us'}
                  {!disabled ? <ExternalLink className="h-4 w-4" /> : null}
                </p>
              </a>
            )
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card sm:p-10">
          <SectionHeading
            title="Or reach us the old-fashioned way"
            subtitle="Prefer email or a call? We reply quickly during working hours."
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${HOSTEL.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              <AtSign className="h-4 w-4" /> {HOSTEL.email}
            </a>
            <a
              href={`tel:${HOSTEL.phone}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              Call {HOSTEL.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}