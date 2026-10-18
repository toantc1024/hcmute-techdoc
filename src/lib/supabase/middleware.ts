import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Session Refresh Helper for Next.js Middleware.
 *
 * Security & Architecture Principles:
 * - Refreshes Auth tokens seamlessly across requests without storing secrets.
 * - Always uses `supabase.auth.getUser()` rather than `getSession()` to validate token integrity.
 * - Must NOT run on public SSG doc routes (/docs/**) to preserve static generation and performance.
 * - Middleware is NOT the final authorization boundary: Server Actions & Route Handlers must still verify permissions.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Revalidate auth token directly with Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}

/**
 * Sanitizes redirect URLs to prevent open-redirect attacks.
 * Only allows relative paths within the application domain (e.g., "/admin").
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback: string = '/admin'): string {
  if (!target) return fallback;
  const trimmed = target.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\') && !trimmed.includes('://')) {
    return trimmed;
  }
  return fallback;
}

