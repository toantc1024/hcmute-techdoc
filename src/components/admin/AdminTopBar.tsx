'use client';

import React, { useState, useEffect } from 'react';
import { brandConfig } from '@/configs/app.config';

interface AdminTopBarProps {
  onOpenMobileMenu: () => void;
  onLogout: () => void;
  userEmail?: string;
  userRole?: 'admin' | 'evaluator';
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onOpenMobileMenu,
  onLogout,
  userEmail,
  userRole = 'admin',
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setTimeStr(`${time} ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full bg-white dark:bg-[#132238] border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Title + Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden size-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            aria-label="Mở menu điều hướng"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-[#004776] dark:text-foreground truncate">
              Quản trị HCM-UTE TechDoc &amp; Tiến độ 51 website
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-semibold bg-blue-50 text-[#0072BC] dark:bg-blue-950/80 dark:text-sky-300 border border-blue-200/60 dark:border-blue-900/60">
                {userRole === 'admin' ? 'Quản trị viên (Admin)' : 'Đánh giá viên'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-xl text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Supabase RLS Protected
              </span>
              {userEmail && (
                <span className="text-xs text-muted-foreground hidden md:inline font-mono">
                  • {userEmail}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Timestamp & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {timeStr && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
              <span className="text-[#0072BC] dark:text-sky-400">🕒</span>
              <span>{timeStr}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center min-h-[40px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Đăng xuất khỏi phiên quản trị"
          >
            <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
