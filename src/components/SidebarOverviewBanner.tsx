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
    <div className="px-2 pt-1 pb-2">
      <button
        type="button"
        onClick={handleToggle}
        title={isExpanded ? 'Thu gọn tất cả các chương để nhìn tổng quan' : 'Mở rộng tất cả các chương và bài viết'}
        className="w-full inline-flex min-h-[38px] sm:min-h-[32px] items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0072BC] hover:border-[#0072BC]/40 shadow-xs active:scale-95 transition cursor-pointer"
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
