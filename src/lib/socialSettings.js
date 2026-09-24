import { HOSTEL } from '../config'

// Owner-editable social links, stored in the browser (localStorage) on top of
// the defaults in HOSTEL.social. Swap for a DB/persisted source when the API
// gains a settings table.
const STORAGE_KEY = 'sai_krishna_social_v1'

const FIELDS = ['instagram', 'facebook', 'youtube', 'whatsapp']

export function getSocialLinks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    const saved = stored && typeof stored === 'object' ? stored : {}
    const links = {}
    FIELDS.forEach((key) => {
      links[key] =
        typeof saved[key] === 'string' && saved[key].trim()
          ? saved[key]
          : HOSTEL.social[key] || ''
    })
    return links
  } catch {
    return { ...HOSTEL.social }
  }
}

export function saveSocialLinks(links) {
  const clean = {}
  FIELDS.forEach((key) => {
    clean[key] = typeof links[key] === 'string' ? links[key].trim() : ''
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  return clean
}