'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminTab } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';

interface AdminTopBarProps {
  activeTab: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  onOpenSecurity?: () => void;
  onLogout?: () => void;
  userEmail?: string;
  userRole?: 'admin' | 'evaluator';
  totalViews?: number;
  avgScore?: number;
  onToggleMobileSidebar?: () => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Tổng quan hệ thống',
    subtitle: 'Theo dõi tiến độ, lưu lượng và các tiêu chuẩn đánh giá website',
  },
  units: {
    title: 'Đơn vị & Website',
    subtitle: 'Đánh giá chi tiết 51 website phòng ban, khoa viện, trung tâm',
  },
  analytics: {
    title: 'Lượt xem & Thống kê',
    subtitle: 'Báo cáo lưu lượng truy cập từng chương và trang tài liệu',
  },
  progress: {
    title: 'Kế hoạch & Tiêu chuẩn',
    subtitle: '7 tiêu chuẩn đánh giá và lộ trình triển khai các giai đoạn',
  },
  content: {
    title: 'Quản lý tài liệu',
    subtitle: 'Điều chỉnh cấu trúc 8 chương tài liệu kỹ thuật',
  },
  issues: {
    title: 'Ghi chú lỗi hệ thống',
    subtitle: 'Theo dõi lỗi phát sinh, phương án xử lý và dán ảnh chụp màn hình nhanh',
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activeTab,
  onOpenSecurity,
  onLogout,
  onToggleMobileSidebar,
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

  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  return (
    <header className="w-full bg-white dark:bg-[#132238] border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Active Tab Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
              title="Mở menu quản trị"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2.5 lg:hidden">
            <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-6 object-contain" />
            <span className="text-sm font-bold text-[#004776] dark:text-foreground">TechDoc Admin</span>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {currentTabInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Clock & Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {timeStr && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Xem trung tâm giám sát an ninh & nhật ký kiểm toán"
            >
              <svg className="size-3.5 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="hidden sm:inline">Báo cáo &amp; RLS</span>
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-background hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors"
            title="Về cổng tài liệu người dùng"
          >
            <svg className="size-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Cổng tài liệu</span>
          </Link>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100"
              title="Đăng xuất"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
