'use client';

import React, { useEffect } from 'react';

interface AdminIssueImageViewerProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const AdminIssueImageViewer: React.FC<AdminIssueImageViewerProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
        <a
          href={imageUrl}
          download="hcmute-issue-screenshot.png"
          className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Tải ảnh
        </a>
        <button
          type="button"
          onClick={onClose}
          className="size-9 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Đóng (Esc)"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        className="max-w-[95vw] max-h-[88vh] flex items-center justify-center overflow-auto rounded-xl shadow-2xl p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Ảnh chụp lỗi hệ thống"
          className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10"
        />
      </div>

      <p className="text-white/60 text-xs mt-3 select-none">Nhấn Esc hoặc bấm ngoài để đóng</p>
    </div>
  );
};
