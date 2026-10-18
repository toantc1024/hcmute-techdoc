import { createBrowserClient } from '@supabase/ssr';

/**
 * Standard Supabase Browser Client for Next.js App Router (Client Components).
 *
 * Security & Architecture Principles:
 * - Reads ONLY public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
 * - Compatibility fallback to NEXT_PUBLIC_SUPABASE_ANON_KEY for legacy environment configs.
 * - NEVER reads credentials from localStorage or browser state.
 * - NEVER allows runtime endpoint tampering from UI.
 * - Always restricted by Supabase Row Level Security (RLS).
 * - Server modules and service_role must NEVER be imported here.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '[Supabase Client] Missing public configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in environment variables.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const getBrowserClient = createClient;
