import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True only when both env vars are present. The whole site degrades gracefully when false. */
export const isSupabaseConfigured = Boolean(url && anon)

/** Null when not configured — callers must guard on `isSupabaseConfigured` / a null check. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anon as string)
  : null
