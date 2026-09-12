import { createClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// Supabase client - PUBLIC anon key only. Never put the service role key here.
// When env vars are empty the app runs in DEMO MODE (local sample data).
// -----------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export function getSupabaseError(err) {
  if (!err) return 'Something went wrong. Please try again.'
  if (typeof err === 'string') return err
  return err.message || 'Something went wrong. Please try again.'
}