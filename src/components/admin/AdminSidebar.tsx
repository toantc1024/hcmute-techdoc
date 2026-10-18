'use client';

import React from 'react';
import Link from 'next/link';
import { AdminTab } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onOpenSecurity?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSecurity,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: {
    key: AdminTab | 'security' | 'home';
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'units',
      label: 'Đơn vị & Website',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'analytics',
      label: 'Lượt xem & Thống kê',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      key: 'progress',
      label: 'Kế hoạch & Tiêu chuẩn',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      key: 'content',
      label: 'Quản lý tài liệu',
      icon: (
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const handleSelect = (key: AdminTab | 'security' | 'home') => {
    if (key === 'security') {
      if (onOpenSecurity) onOpenSecurity();
    } else if (key !== 'home') {
      onTabChange(key as AdminTab);
    }
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-[#0A192F] text-slate-200 w-64 select-none">
      {/* Brand Logo Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80 bg-[#071324]">
          <div className="size-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img src={brandConfig.logoUrl} alt="HCM-UTE" className="size-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm text-white tracking-wider truncate">HCM-UTE</div>
            <div className="text-[10px] text-sky-400 font-mono font-medium truncate">TECHDOC ADMIN</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1" aria-label="Admin Sidebar">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item.key)}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0072BC] text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Báo cáo & An ninh */}
          {onOpenSecurity && (
            <button
              type="button"
              onClick={() => handleSelect('security')}
              className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <svg className="size-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Báo cáo &amp; RLS</span>
            </button>
          )}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#071324] space-y-2">
        <Link
          href="/"
          className="w-full min-h-[38px] flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-400 bg-sky-950/40 border border-sky-800/60 hover:bg-sky-900/60 transition-colors"
        >
          <span>← Cổng tài liệu</span>
        </Link>
        <div className="text-[10px] text-slate-500 font-mono text-center">
          HCM-UTE TechDoc v2.6 · 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30 shadow-xl">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0A192F] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={onCloseMobile}
                className="size-9 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
