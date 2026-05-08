import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Baris ini yang dicari oleh Next.js, pastikan ada kata "export"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)