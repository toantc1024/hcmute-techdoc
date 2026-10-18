'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '@/lib/supabase/client';
import { brandConfig } from '@/configs/app.config';

interface AdminForbiddenProps {
  email: string;
}

export const AdminForbidden: React.FC<AdminForbiddenProps> = ({ email }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#132238] rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xl p-6 sm:p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400">
          <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            HTTP 403 • Truy cập bị từ chối
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Chưa được phân quyền TechDocs
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tài khoản <strong className="text-foreground">{email}</strong> đã xác thực hợp lệ trên hệ sinh thái UTEHub, nhưng chưa được gán quyền <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">admin</code> hoặc <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">evaluator</code> trong dự án HCMUTE TechDoc.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/80 text-xs text-muted-foreground text-left space-y-1">
          <p className="font-semibold text-foreground">Biện pháp bảo vệ cách ly (Cross-App Isolation):</p>
          <p>Dữ liệu quản trị và thẩm định TechDocs được bảo vệ bởi Row Level Security (RLS) mặc định từ chối. Vui lòng liên hệ Quản trị viên để được cấp quyền.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất tài khoản'}
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm font-medium bg-[#0072BC] hover:bg-[#005a96] text-white transition-colors"
          >
            Về trang chủ tài liệu
          </Link>
        </div>
      </div>
    </div>
  );
};
