'use client';

import React from 'react';
import { AdminTab } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onReset: () => void;
  onLogout: () => void;
  onOpenSecurity?: () => void;
  userEmail?: string;
  userRole?: 'admin' | 'evaluator';
  totalViews: number;
  totalUnits: number;
  avgScore: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  onReset,
  onLogout,
  onOpenSecurity,
  userEmail,
  userRole = 'admin',
  totalViews,
  totalUnits,
  avgScore,
}) => {
  const tabs: {
    key: AdminTab;
    label: string;
    badge?: string | number;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'units',
      label: 'Độ hoàn thiện 51 website',
      badge: `${avgScore}% Đạt`,
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      key: 'progress',
      label: 'Kế hoạch & Tiêu chuẩn',
      badge: 'Chuẩn báo cáo',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'analytics',
      label: 'Lượt xem & Thống kê',
      badge: totalViews.toLocaleString(),
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      key: 'content',
      label: 'Quản lý tài liệu',
      badge: '8 chương',
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <header className="w-full bg-card border-b border-border/80 shadow-xs mb-6">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-11 sm:size-12 rounded-xl bg-white dark:bg-blue-950/60 p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex items-center justify-center">
              <img
                src={brandConfig.logoUrl}
                alt="HCM-UTE Logo"
                className="size-8 sm:size-9 object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  userRole === 'admin'
                    ? 'bg-blue-100 text-[#004776] dark:bg-blue-950/80 dark:text-sky-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {userRole === 'admin' ? 'Quản trị viên (Admin)' : 'Đánh giá viên (Evaluator)'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Supabase RLS Protected
                </span>
                {userEmail && (
                  <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
                    • {userEmail}
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#004776] dark:text-foreground">
                Quản trị HCM-UTE TechDoc &amp; Tiến độ 51 website
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-3 bg-muted/60 dark:bg-muted/30 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-border/60">
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground font-medium">Độ hoàn thiện TB</div>
                <div className="text-base font-bold font-mono text-[#004776] dark:text-sky-400">{avgScore}%</div>
              </div>
              <div className="h-7 w-px bg-border" />
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground font-medium">Tổng website</div>
                <div className="text-base font-bold font-mono text-[#004776] dark:text-foreground">{totalUnits}</div>
              </div>
            </div>

            {onOpenSecurity && (
              <button
                type="button"
                onClick={onOpenSecurity}
                className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-[#004776] dark:text-sky-300 hover:bg-blue-100/60 transition-colors shadow-2xs"
                title="Xem các biện pháp bảo mật và nhật ký an ninh"
              >
                <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                An ninh &amp; Nhật ký
              </button>
            )}

            {userRole === 'admin' && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-border bg-background hover:bg-muted text-muted-foreground hover:text-[#004776] transition-colors focus:ring-2 focus:ring-[#0072BC]/20 outline-hidden"
                title="Khôi phục dữ liệu ban đầu theo biên bản rà soát"
              >
                <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Khôi phục mặc định
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors shadow-2xs"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile scrollable with icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-border/50 pt-2 pb-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`group min-h-[44px] inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#0072BC] text-[#004776] dark:text-sky-300 bg-[#0072BC]/8 dark:bg-[#0072BC]/20'
                    : 'border-transparent text-muted-foreground hover:text-[#004776] dark:hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <span className={isActive ? 'text-[#0072BC] dark:text-sky-400' : 'text-muted-foreground group-hover:text-[#004776]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      isActive
                        ? 'bg-[#0072BC] text-white shadow-2xs'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                    }`}
                  >
                    {tab.badge}
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
