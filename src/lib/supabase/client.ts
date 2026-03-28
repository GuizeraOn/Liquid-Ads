import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://ofbzgpieyudskopcbhkg.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYnpncGlleXVkc2tvcGNiaGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDIzNDEsImV4cCI6MjA5MDI3ODM0MX0.Wbb1zeuLgCiEAlq-8wDzUw5AWFPy93pIMTDhorgDOCQ'
  )
}
