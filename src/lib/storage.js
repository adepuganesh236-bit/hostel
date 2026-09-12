// -----------------------------------------------------------------------------
// IMAGE STORAGE HELPER
// -----------------------------------------------------------------------------
// Placeholder images are used today. To load real images later from Supabase
// Storage, enable VITE_SUPABASE_STORAGE_BUCKET and the helper below will
// resolve `gallery(id)` to a public URL instead of the local placeholder.
// -----------------------------------------------------------------------------

import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || ''

export function galleryImageUrl(path, fallback) {
  if (isSupabaseConfigured && supabase && BUCKET) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data?.publicUrl || fallback
  }
  return fallback
}

export function roomImageUrl(roomNumber, fallback = '/images/room.jpg') {
  return galleryImageUrl(`rooms/${roomNumber}.jpg`, fallback)
}

export function heroImageUrl(fallback = '/images/hero.jpg') {
  return galleryImageUrl('hostel/hero.jpg', fallback)
}