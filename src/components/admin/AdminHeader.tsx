'use client';

import React from 'react';
import { AdminTab } from '@/models/admin.model';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onReset: () => void;
  onLogout: () => void;
  onOpenSecurity?: () => void;
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
  totalViews,
  totalUnits,
  avgScore
}) => {
  const tabs: { key: AdminTab; label: string; badge?: string | number }[] = [
    { key: 'content', label: 'Quản lý nội dung', badge: '8 chương' },
    { key: 'analytics', label: 'Lượt xem & Thống kê', badge: totalViews.toLocaleString() },
    { key: 'progress', label: 'Tiến độ & Tiêu chuẩn', badge: 'Chuẩn báo cáo' },
    { key: 'units', label: 'Độ hoàn thiện 51 website', badge: `${avgScore}% Đạt` },
  ];

  return (
    <header className="w-full bg-card border-b border-border/80 shadow-xs mb-6">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-[#004776] dark:bg-blue-950/80 dark:text-sky-300">
                Cổng quản trị hệ thống
              </span>
              <span className="text-xs text-muted-foreground">Cập nhật: Tháng 10/2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#004776] dark:text-foreground">
              Quản trị HCM-UTE TechDoc & Tiến độ 51 website
            </h1>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-muted/60 dark:bg-muted/30 px-3.5 py-2 rounded-xl border border-border/60">
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground">Độ hoàn thiện TB</div>
                <div className="text-base font-bold text-[#004776] dark:text-sky-400">{avgScore}%</div>
              </div>
              <div className="h-7 w-px bg-border" />
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground">Tổng website</div>
                <div className="text-base font-bold text-[#004776] dark:text-foreground">{totalUnits}</div>
              </div>
            </div>

            {onOpenSecurity && (
              <button
                type="button"
                onClick={onOpenSecurity}
                className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-[#004776] dark:text-sky-300 hover:bg-blue-100/60 transition-colors"
                title="Xem các biện pháp bảo mật và nhật ký an ninh"
              >
                <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                An ninh & Nhật ký
              </button>
            )}

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

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-medium border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors"
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

      {/* Navigation Tabs - Mobile scrollable */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-border/50 pt-2 pb-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`group min-h-[44px] inline-flex items-center px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#0072BC] text-[#004776] dark:text-sky-300 bg-[#0072BC]/8 dark:bg-[#0072BC]/20'
                    : 'border-transparent text-muted-foreground hover:text-[#004776] dark:hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      isActive
                        ? 'bg-[#0072BC] text-white'
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
