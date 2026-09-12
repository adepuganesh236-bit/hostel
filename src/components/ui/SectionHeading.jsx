import { cx } from '../../lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}) {
  return (
    <div
      className={cx(
        'mb-12',
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base leading-relaxed text-slate-500">{subtitle}</p> : null}
    </div>
  )
}