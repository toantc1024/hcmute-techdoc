'use client';

import { useEffect } from 'react';

export default function AdminRedirectPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/#/admin');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-[#004776] dark:text-sky-300 space-y-3">
      <div className="animate-spin size-8 border-3 border-[#0072BC] border-t-transparent rounded-full" />
      <p className="text-sm font-medium">Đang chuyển hướng an toàn đến cổng quản trị /#/admin...</p>
    </div>
  );
}
