'use client';

import React, { useState } from 'react';
import { ChevronsUpDown, ChevronsDownUp } from 'lucide-react';

export function SidebarOverviewBanner() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof document === 'undefined') return;

    if (isExpanded) {
      // Đang mở -> Thu gọn tất cả
      const openedTriggers = document.querySelectorAll(
        'aside button[aria-expanded="true"], [data-sidebar] button[aria-expanded="true"]'
      );
      openedTriggers.forEach((btn) => {
        (btn as HTMLElement).click();
      });
      setIsExpanded(false);
    } else {
      // Đang thu gọn -> Mở rộng tất cả
      const closedTriggers = document.querySelectorAll(
        'aside button[aria-expanded="false"], [data-sidebar] button[aria-expanded="false"]'
      );
      closedTriggers.forEach((btn) => {
        (btn as HTMLElement).click();
      });
      setIsExpanded(true);
    }
  };

  return (
    <div className="mx-2 mb-3 mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#004776] dark:text-sky-400">
          Tổng quan mục lục
        </span>
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          7 chương · 20 bài
        </span>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        title={isExpanded ? 'Thu gọn tất cả các chương để nhìn tổng quan' : 'Mở rộng tất cả các chương và bài viết'}
        className="w-full inline-flex min-h-[38px] sm:min-h-[34px] items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0072BC] hover:border-[#0072BC]/40 shadow-xs active:scale-95 transition cursor-pointer"
      >
        {isExpanded ? (
          <>
            <ChevronsDownUp className="size-3.5 text-slate-500 shrink-0" />
            <span>Thu gọn tất cả</span>
          </>
        ) : (
          <>
            <ChevronsUpDown className="size-3.5 text-[#0072BC] shrink-0" />
            <span>Mở rộng tất cả</span>
          </>
        )}
      </button>
    </div>
  );
}
