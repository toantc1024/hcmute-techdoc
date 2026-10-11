'use client';

import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, ChevronsDownUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function SidebarOverviewBanner() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const pathname = usePathname();

  // Helper lấy danh sách các nút đóng/mở chương trong sidebar (loại trừ nút drawer của khung)
  const getFolderTriggers = () => {
    if (typeof document === 'undefined') return [];
    return Array.from(
      document.querySelectorAll<HTMLButtonElement>('aside button[aria-expanded], [data-sidebar] button[aria-expanded], [data-sidebar-panel] button[aria-expanded], [role="dialog"] button[aria-expanded]')
    ).filter((btn) => {
      const text = btn.textContent?.trim() || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      return text.length > 0 && !ariaLabel.includes('Sidebar');
    });
  };

  // Đồng bộ trạng thái thực tế sau khi tải trang hoặc chuyển trang
  useEffect(() => {
    const timer = setTimeout(() => {
      const triggers = getFolderTriggers();
      const opened = triggers.filter((btn) => btn.getAttribute('aria-expanded') === 'true');
      // Nếu có từ 3 chương trở lên đang mở thì nút là "Thu gọn tất cả"
      if (opened.length >= 3) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const triggers = getFolderTriggers();
    if (triggers.length === 0) return;

    if (isExpanded) {
      // Đang mở nhiều -> Thu gọn tất cả các chương
      triggers.forEach((btn) => {
        if (btn.getAttribute('aria-expanded') === 'true') {
          btn.click();
        }
      });
      setIsExpanded(false);
    } else {
      // Đang thu gọn -> Mở rộng tất cả các chương
      triggers.forEach((btn) => {
        if (btn.getAttribute('aria-expanded') === 'false') {
          btn.click();
        }
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
