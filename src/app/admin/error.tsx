'use client';

import React, { useEffect } from 'react';
import { brandConfig } from '@/configs/app.config';

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // Log client error safely
    console.error('[Admin Error Boundary]:', error);
  }, [error]);

  const handleClearCacheAndReload = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
        localStorage.removeItem('hcmute_techdoc_dashboard_cache_v3');
        localStorage.removeItem('hcmute_techdoc_dashboard_cache_v2');
        localStorage.removeItem('hcmute_techdoc_dashboard_cache');
      } catch {}
      window.location.reload();
    }
  };

  const handleRelogin = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
        localStorage.removeItem('hcmute_techdoc_admin_auth_session');
      } catch {}
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] flex flex-col items-center justify-center p-4 sm:p-6 text-foreground">
      <div className="w-full max-w-lg bg-white dark:bg-[#132238] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 text-center">
        {/* Header & Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 p-2 border border-blue-100 dark:border-blue-900 flex items-center justify-center">
            <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-10 object-contain" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
              Khôi phục Bảng điều khiển
            </span>
            <h1 className="text-xl sm:text-2xl font-[650] text-[#004776] dark:text-foreground">
              Đã khôi phục an toàn hệ thống
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Hệ thống phát hiện dữ liệu lưu trữ phiên làm việc cũ không đồng bộ hoặc kết nối bị gián đoạn.
          </p>
        </div>

        {/* Error Detail Snippet */}
        {error?.message && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-left text-xs font-mono text-slate-600 dark:text-slate-400 break-all max-h-24 overflow-y-auto">
            {error.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto min-h-[42px] px-5 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Thử tải lại ngay
          </button>
          <button
            type="button"
            onClick={handleClearCacheAndReload}
            className="w-full sm:w-auto min-h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Làm sạch bộ nhớ đệm
          </button>
          <button
            type="button"
            onClick={handleRelogin}
            className="w-full sm:w-auto min-h-[42px] px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
}
