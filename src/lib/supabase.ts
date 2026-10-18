/**
 * @deprecated LEGACY CLIENT ONLY.
 * For client components use: import { getBrowserClient } from '@/lib/supabase/client';
 * For server components/actions use: import { createClient } from '@/lib/supabase/server';
 *
 * Credentials MUST come exclusively from environment variables, NEVER localStorage.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return { url: url.trim(), anonKey: anonKey.trim() };
}

/**
 * @deprecated Saving credentials to localStorage is disabled for security.
 */
export function saveSupabaseCredentials(_url: string, _anonKey: string): void {
  // Disabled: Credentials must be configured via environment variables (.env.local / Vercel)
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
