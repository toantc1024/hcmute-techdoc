'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTab } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';

interface AdminTopBarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onOpenSecurity?: () => void;
  onLogout: () => void;
  userEmail?: string;
  userRole?: 'admin' | 'evaluator';
  totalViews?: number;
  avgScore?: number;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenSecurity,
  onLogout,
  userEmail,
  userRole = 'admin',
  totalViews = 22080,
  avgScore = 72,
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

  const navTabs: { key: AdminTab; label: string; icon: string; badge?: string }[] = [
    { key: 'overview', label: 'Tổng quan', icon: '🏠', badge: 'Mẫu 1 & 3' },
    { key: 'units', label: 'Đơn vị & Website', icon: '🏢', badge: `${avgScore}% Đạt` },
    { key: 'analytics', label: 'Lượt xem & Thống kê', icon: '📊', badge: totalViews.toLocaleString() },
    { key: 'progress', label: 'Kế hoạch & Tiêu chuẩn', icon: '📋', badge: '7 Tiêu chuẩn' },
    { key: 'content', label: 'Quản lý tài liệu', icon: '📖', badge: '8 Chương' },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#132238] border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 space-y-4">
        {/* ROW 1: Header Brand, Badges, Clock & Actions (Scaled 1.3x) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-13 sm:size-14 rounded-xl bg-blue-50 dark:bg-blue-950/80 p-2 border border-blue-100 dark:border-blue-900 shadow-2xs shrink-0 flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-10 sm:size-11 object-contain" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-blue-100/80 text-[#004776] dark:bg-blue-950 dark:text-sky-300 border border-blue-200/80 dark:border-blue-900">
                  {userRole === 'admin' ? 'Quản trị viên (Admin)' : 'Đánh giá viên'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  <span className="size-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Supabase RLS Protected
                </span>
                {userEmail && (
                  <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline font-mono">
                    • {userEmail}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#004776] dark:text-foreground">
                Quản trị HCM-UTE TechDoc &amp; Tiến độ 51 website
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {timeStr && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                <span className="text-[#0072BC] dark:text-sky-400">🕒</span>
                <span>{timeStr}</span>
              </div>
            )}

            {onOpenSecurity && (
              <button
                type="button"
                onClick={onOpenSecurity}
                className="inline-flex items-center justify-center min-h-[46px] px-4 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-[#004776] dark:text-sky-300 hover:bg-blue-100 transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                title="Xem trung tâm giám sát an ninh & nhật ký kiểm toán"
              >
                <span>🛡️ Báo cáo &amp; RLS</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[46px] px-4 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-100 text-[#004776] dark:text-sky-300 transition-all shadow-2xs active:scale-[0.98]"
              title="Về cổng tài liệu người dùng"
            >
              <span>← Cổng tài liệu</span>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center min-h-[46px] px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#0072BC] hover:bg-[#005a96] text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <span>Đăng xuất ➔</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Navigation Tabs (Scaled 1.3x, Edge-to-Edge) */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800/80" aria-label="Admin Navigation Tabs">
          {navTabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onTabChange(t.key)}
                className={`min-h-[48px] px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all inline-flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#0072BC] text-white shadow-md shadow-blue-500/15'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#004776]'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
