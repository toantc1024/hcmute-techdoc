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
  totalViews = 22080,
  avgScore = 72,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setTimeStr(`${time} · ${date}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const navTabs: {
    key: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
        </svg>
      ),
      badge: 'Mẫu 1 & 3',
    },
    {
      key: 'units',
      label: 'Đơn vị & Website',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      badge: `${avgScore}% Đạt`,
    },
    {
      key: 'analytics',
      label: 'Lượt xem & Thống kê',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: totalViews.toLocaleString(),
    },
    {
      key: 'progress',
      label: 'Kế hoạch & Tiêu chuẩn',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      badge: '7 Tiêu chuẩn',
    },
    {
      key: 'content',
      label: 'Quản lý tài liệu',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      badge: '8 Chương',
    },
    {
      key: 'issues',
      label: 'Ghi chú lỗi hệ thống',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      badge: 'Paste ảnh',
    },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#132238] border-b border-slate-200/80 dark:border-slate-800">
      <div className="w-full max-w-[1440px] mx-auto px-5 lg:px-6 py-3.5 space-y-3">
        {/* ROW 1: Brand Title & Elegant Minimalist Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 sm:size-11 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 p-1.5 border border-blue-100 dark:border-blue-900 shrink-0 flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-7 sm:size-8 object-contain" />
            </div>
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-[650] tracking-tight text-[#004776] dark:text-foreground leading-tight">
                Quản trị HCM-UTE TechDoc
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {timeStr && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                <svg className="size-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{timeStr}</span>
              </div>
            )}

            {onOpenSecurity && (
              <button
                type="button"
                onClick={onOpenSecurity}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors duration-150 cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                title="Xem trung tâm giám sát an ninh & nhật ký kiểm toán"
              >
                <svg className="size-3.5 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Báo cáo &amp; RLS</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-background hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors duration-150 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              title="Về cổng tài liệu người dùng"
            >
              <svg className="size-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Cổng tài liệu</span>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-lg text-xs font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white transition-colors duration-150 cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <span>Đăng xuất</span>
              <svg className="size-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* ROW 2: Compact Minimalist Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800" aria-label="Admin Navigation Tabs">
          {navTabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onTabChange(t.key)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#0072BC] text-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
                    : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 hover:text-[#004776]'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
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
