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
      className="inline-flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-secondary/50 px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition cursor-pointer"
    >
      <Printer className="size-3.5" />
      <span>Xuất PDF</span>
    </button>
  );
}
