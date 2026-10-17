import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'hcmute_techdoc_supabase_url',
  ANON_KEY: 'hcmute_techdoc_supabase_anon_key',
};

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.URL);
    const savedKey = localStorage.getItem(STORAGE_KEYS.ANON_KEY);
    if (savedUrl) url = savedUrl;
    if (savedKey) anonKey = savedKey;
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.URL);
    }
    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
    }
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}
