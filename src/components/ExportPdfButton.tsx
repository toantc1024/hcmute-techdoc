'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function ExportPdfButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      title="In hoặc xuất trang hướng dẫn này ra file PDF"
      className="inline-flex min-h-[44px] sm:min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/60 px-3.5 py-2 text-xs sm:text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground active:scale-95 transition cursor-pointer"
    >
      <Printer className="size-4 shrink-0 text-[#0072BC]" />
      <span>Xuất PDF</span>
    </button>
  );
}
