import { createClient } from '@supabase/supabase-js';

// Strip surrounding quotes and whitespace if any
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/^["']|["']$/g, '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '').trim();

let isValidUrl = false;
let cleanedUrl = 'https://placeholder.supabase.co';

try {
  if (rawUrl) {
    const url = new URL(rawUrl);
    // Ensure it has a valid protocol
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      isValidUrl = true;
      // Strictly use only the origin to strip out any accidental paths like /rest/v1
      cleanedUrl = url.origin;
    }
  }
} catch (e) {
  isValidUrl = false;
  console.error("Invalid Supabase URL provided:", rawUrl);
}

export const isSupabaseConfigured = isValidUrl && rawKey.length > 0;
export const supabase = createClient(cleanedUrl, rawKey || 'placeholder');

