'use client';

import React from 'react';
import Link from 'next/link';
import { AdminTab } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onOpenSecurity?: () => void;
  onLogout: () => void;
  userEmail?: string;
  userRole?: 'admin' | 'evaluator';
  totalViews?: number;
  avgScore?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSecurity,
  onLogout,
  userEmail,
  userRole = 'admin',
  totalViews = 22080,
  avgScore = 72,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navTabs: {
    key: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      badge: 'Mẫu 1 & 3',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
        </svg>
      ),
    },
    {
      key: 'units',
      label: 'Đơn vị & Website',
      badge: `${avgScore}% Đạt`,
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'analytics',
      label: 'Lượt xem & Thống kê',
      badge: totalViews.toLocaleString(),
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      key: 'progress',
      label: 'Kế hoạch & Tiêu chuẩn',
      badge: '7 Tiêu chuẩn',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      key: 'content',
      label: 'Quản lý tài liệu',
      badge: '8 Chương',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      key: 'issues',
      label: 'Ghi chú lỗi hệ thống',
      badge: 'Paste ảnh',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#132238] border-r border-slate-200/80 dark:border-slate-800 w-72 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 p-1.5 border border-blue-100 dark:border-blue-900 shrink-0 flex items-center justify-center shadow-xs">
            <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-7 object-contain" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold tracking-tight text-[#004776] dark:text-foreground leading-tight">
              HCM-UTE TechDoc
            </h1>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Hệ thống Quản trị
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Phân hệ quản trị
        </div>
        {navTabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                onTabChange(t.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-[13px] font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                isActive
                  ? 'bg-[#0072BC] text-white shadow-[0_2px_8px_rgba(0,114,188,0.25)]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-[#004776]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#0072BC] transition-colors'}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </div>
              {t.badge && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0072BC]'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Actions */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/30">
        {onOpenSecurity && (
          <button
            type="button"
            onClick={onOpenSecurity}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#0072BC] border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg className="size-4 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Báo cáo &amp; RLS
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">Bảo vệ</span>
          </button>
        )}

        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#0072BC] border border-transparent hover:border-slate-200 transition-all"
        >
          <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Về Cổng tài liệu
        </Link>

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
              {userEmail || 'admin@hcmute.edu.vn'}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              {userRole === 'admin' ? 'Quản trị viên' : 'Đánh giá viên'}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
            title="Đăng xuất"
          >
            <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-2xl h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
