/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_AGROMONITORING_API_KEY?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_GOOGLE_EARTH_ENGINE_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}