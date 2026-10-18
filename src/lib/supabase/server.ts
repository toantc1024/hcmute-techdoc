import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Standard Supabase Server Client for Next.js App Router.
 * Compatible with React Server Components, Server Actions, and Route Handlers.
 *
 * Security & Architecture Principles:
 * - Guarded with 'server-only' to ensure it can NEVER be imported into Client Components.
 * - Reads and synchronizes session cookies from the incoming request.
 * - Operates strictly as the authenticated user under Supabase Row Level Security (RLS).
 * - NEVER uses service_role. Authenticated user identity + RLS is the default data access path.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '[Supabase Server] Missing public configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in environment variables.'
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // In Next.js, Server Components cannot set cookies directly.
          // Cookie mutation is handled in Server Actions, Route Handlers, or Middleware.
        }
      },
    },
  });
}
