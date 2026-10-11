'use client';

import React from 'react';
import { ChevronsUpDown, ChevronsDownUp } from 'lucide-react';

export function SidebarOverviewBanner() {
  const handleExpandAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof document === 'undefined') return;
    
    // Find all closed collapsible triggers inside sidebar
    const closedTriggers = document.querySelectorAll(
      'aside button[aria-expanded="false"], [data-sidebar] button[aria-expanded="false"]'
    );
    closedTriggers.forEach((btn) => {
      (btn as HTMLElement).click();
    });
  };

  const handleCollapseAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof document === 'undefined') return;

    // Find all opened collapsible triggers inside sidebar
    const openedTriggers = document.querySelectorAll(
      'aside button[aria-expanded="true"], [data-sidebar] button[aria-expanded="true"]'
    );
    openedTriggers.forEach((btn) => {
      (btn as HTMLElement).click();
    });
  };

  return (
    <div className="mx-2 mb-3 mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#004776] dark:text-sky-400">
          Tổng quan mục lục
        </span>
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          6 chương · 18 bài
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={handleExpandAll}
          title="Xổ ra tất cả các chương và bài viết"
          className="inline-flex min-h-[36px] items-center justify-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0072BC] hover:border-[#0072BC]/40 active:scale-95 transition cursor-pointer"
        >
          <ChevronsUpDown className="size-3.5 text-[#0072BC]" />
          <span>Xổ ra tất cả</span>
        </button>

        <button
          type="button"
          onClick={handleCollapseAll}
          title="Thu gọn các chương để nhìn tổng quan"
          className="inline-flex min-h-[36px] items-center justify-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0072BC] hover:border-[#0072BC]/40 active:scale-95 transition cursor-pointer"
        >
          <ChevronsDownUp className="size-3.5 text-slate-500" />
          <span>Thu gọn</span>
        </button>
      </div>
    </div>
  );
}
