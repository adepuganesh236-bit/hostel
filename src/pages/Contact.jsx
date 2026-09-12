import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Navigation,
} from 'lucide-react'
import { HOSTEL } from '../config'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { Field, Input, Textarea } from '../components/ui/Field'
import { useToast } from '../context/ToastContext'

const INFO = [
  { icon: MapPin, title: 'Address', lines: [HOSTEL.address, `${HOSTEL.city}, ${HOSTEL.state}`] },
  { icon: Phone, title: 'Phone', lines: [HOSTEL.phone, 'Available 24/7 for parents'] },
  { icon: Mail, title: 'Email', lines: [HOSTEL.email, 'Replies within 24 hours'] },
  { icon: Clock, title: 'Office Hours', lines: ['Mon – Sun: 10 AM to 7 PM', 'Warden available all day'] },
]

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.mobile.trim()) next.mobile = 'Please enter your mobile number.'
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (!form.message.trim()) next.message = 'Please write a message.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    // In production this message would be stored in the `contacts` table via Supabase.
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', mobile: '', message: '' })
      toast.success('Message sent! The hostel team will reach out shortly.')
    }, 700)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-16 text-white sm:py-20">
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            Contact us
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-5xl">
            We'd Love to Hear From You
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Questions about rooms, admission, or visiting? Call, WhatsApp or send
            us a message — a human will respond fast.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info */}
          <div className="space-y-4 lg:col-span-2">
            {INFO.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">{item.title}</p>
                  {item.lines.map((line) => (
                    <p key={line} className="text-sm text-slate-500">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
              <iframe
                title="StayNest Hostel Location"
                src={HOSTEL.mapsEmbed}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Navigation className="h-4 w-4 text-brand-600" /> {HOSTEL.city}
                </p>
                <a
                  href={HOSTEL.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-brand-700 hover:text-brand-800"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
              <SectionHeading
                align="left"
                eyebrow="Send a message"
                title="Fill the form and we'll get back to you"
                className="mb-8"
              />
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <Field label="Your Name" required error={errors.name}>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Amit Kumar"
                    error={errors.name}
                  />
                </Field>
                <Field label="Mobile Number" required error={errors.mobile}>
                  <Input
                    id="contact-mobile"
                    value={form.mobile}
                    onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    inputMode="numeric"
                    error={errors.mobile}
                  />
                </Field>
                <Field label="Email" required error={errors.email} className="sm:col-span-2">
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                </Field>
                <Field label="Message" required error={errors.message} className="sm:col-span-2">
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your room preference, visit date, or any question…"
                    rows={5}
                    error={errors.message}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Button type="submit" loading={sending} size="lg" icon={<Send className="h-4 w-4" />}>
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-emerald-600 px-8 py-6 text-white shadow-card sm:flex-row">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            <div>
              <p className="font-display text-lg font-bold">Prefer WhatsApp?</p>
              <p className="text-sm text-emerald-50">Chat with our admission desk for instant answers.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/91${HOSTEL.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}