import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2, RotateCcw, Save, ExternalLink } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from '../../components/social/SocialIcons'
import { HOSTEL } from '../../config'
import {
  getSocialLinks,
  saveSocialLinks,
} from '../../lib/socialSettings'

const FIELDS = [
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/your-handle', Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/your-page', Icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@your-channel', Icon: YoutubeIcon },
  { key: 'whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/91876543210', Icon: null },
]

export default function OwnerSocial() {
  const toast = useToast()
  const [links, setLinks] = useState({})

  useEffect(() => {
    setLinks(getSocialLinks())
  }, [])

  const setUrl = (key, value) => setLinks((prev) => ({ ...prev, [key]: value }))

  const handleSave = (e) => {
    e.preventDefault()
    const cleaned = saveSocialLinks(links)
    setLinks(cleaned)
    toast.success('Social media links updated.')
  }

  const handleReset = () => {
    localStorage.removeItem('sai_krishna_social_v1')
    setLinks({ ...HOSTEL.social })
    toast.success('Reset to default links.')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Social Media Links</h1>
          <p className="mt-1 text-sm text-slate-500">
            Set the URLs shown on the public social media page and in the footer.
          </p>
        </div>
        <Link
          to="/social"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
        >
          <ExternalLink className="h-4 w-4" /> View Page
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        {FIELDS.map((field) => (
          <Field key={field.key} label={field.label} hint="Leave empty to hide this link.">
            <div className="relative">
              {field.Icon ? (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <field.Icon className="h-4 w-4" />
                </span>
              ) : (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Link2 className="h-4 w-4" />
                </span>
              )}
              <Input
                type="url"
                className="pl-10"
                value={links[field.key] || ''}
                onChange={(e) => setUrl(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          </Field>
        ))}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="button" variant="ghost" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
            Reset to Defaults
          </Button>
          <Button type="submit" icon={<Save className="h-4 w-4" />}>
            Save Links
          </Button>
        </div>
        <div className="round rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          Links are saved in this browser. Only {HOSTEL.ownerMobile} (owner) can edit them.
        </div>
      </form>
    </div>
  )
}