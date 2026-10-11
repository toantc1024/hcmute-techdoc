'use client';

import React from 'react';
import { useSidebar } from 'fumadocs-ui/components/sidebar/base';
import { LayoutList } from 'lucide-react';

export function MobileOverviewTrigger() {
  const sidebar = useSidebar();

  const handleOpen = () => {
    sidebar.setOpen(true);
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      title="Xem tổng quan toàn bộ 6 chương mục lục"
      className="inline-flex md:hidden min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-[#0072BC]/30 bg-[#0072BC]/10 px-3 py-2 text-xs font-semibold text-[#0072BC] hover:bg-[#0072BC]/15 active:scale-95 transition cursor-pointer"
    >
      <LayoutList className="size-4 shrink-0" />
      <span>Tổng quan mục lục</span>
    </button>
  );
}
