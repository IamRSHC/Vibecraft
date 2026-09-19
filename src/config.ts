// ---- Event configuration ----
// These drive the *fallback* countdown shown before Supabase is wired up (or if it
// is unreachable). Once the live admin timer is running, it takes over the display.
export const EVENT_START = '2026-09-28T09:00:00+05:30' // 9:00 AM IST
export const EVENT_END = '2026-09-28T18:00:00+05:30' // 6:00 PM IST

// Default duration the admin panel pre-fills when starting the timer (editable live).
export const DEFAULT_DURATION_MS = 9 * 60 * 60 * 1000 // 9 hours

// ---- External links ----
export const REGISTER_URL =
  'https://campusquest.incuman.com/events/detail/ddc130a5-ef6e-4b00-9e32-41fb7d7ee4af'
export const SUBMIT_FORM_URL = 'https://forms.gle/pQiVXgAWmLuuzJx59'
