'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase/client';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { AdminForbidden } from '@/components/admin/AdminForbidden';

/**
 * Admin Route - Static Export Compatible & Supabase RLS Guarded.
 *
 * Security & Isolation Principles:
 * - Unauthenticated -> Redirects immediately to /login.
 * - Authenticated without TechDocs role (e.g. feedback form users) -> Renders 403 AdminForbidden.
 * - Authenticated with role ('admin' | 'evaluator') -> Renders AdminDashboardClient with exact permissions.
 * - Database RLS policies remain the uncompromised final security boundary.
 * - Compatible with next.config.mjs `output: 'export'`.
 *
 * Rule 15: Strictly under 300 lines (< 300).
 */
export default function AdminPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    user: { id: string; email: string } | null;
    role: 'admin' | 'evaluator' | null;
    isForbidden: boolean;
  }>({
    isLoading: true,
    user: null,
    role: null,
    isForbidden: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const supabase = getBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        // Query user_roles from Supabase under RLS
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!isMounted) return;

        if (error || !roles || roles.length === 0) {
          // Authenticated but no TechDocs role -> 403 Forbidden (Cross-app isolation)
          setAuthState({
            isLoading: false,
            user: { id: user.id, email: user.email || '' },
            role: null,
            isForbidden: true,
          });
          return;
        }

        const roleList = roles.map((r: { role: string }) => r.role);
        const role = roleList.includes('admin') ? 'admin' : 'evaluator';

        setAuthState({
          isLoading: false,
          user: { id: user.id, email: user.email || '' },
          role,
          isForbidden: false,
        });
      } catch {
        if (isMounted) router.replace('/login');
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="animate-spin size-8 border-3 border-[#0072BC] border-t-transparent rounded-full" />
        <p className="text-sm font-medium text-muted-foreground">Đang xác thực bảo mật tài khoản...</p>
      </div>
    );
  }

  if (authState.isForbidden || !authState.role || !authState.user) {
    return <AdminForbidden email={authState.user?.email || ''} />;
  }

  return (
    <AdminDashboardClient
      user={authState.user}
      role={authState.role}
    />
  );
}
