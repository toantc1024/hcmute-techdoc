'use client';

import React, { useEffect } from 'react';

export interface StatusConfirmData {
  type: 'unit_server' | 'section_visibility';
  id: number | string;
  name: string;
  subText?: string;
  currentLabel: string;
  nextLabel: string;
  isPositive: boolean;
}

interface AdminStatusConfirmModalProps {
  data: StatusConfirmData | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminStatusConfirmModal: React.FC<AdminStatusConfirmModalProps> = ({
  data,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && data) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, onCancel]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#132238] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with swap icon */}
        <div className="flex items-start gap-3.5">
          <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900 text-[#0072BC] dark:text-sky-300 flex items-center justify-center shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[17px] font-[650] text-[#004776] dark:text-foreground">
              {data.type === 'unit_server' ? 'Xác nhận chuyển trạng thái máy chủ' : 'Xác nhận thay đổi hiển thị'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Kiểm tra thông tin trước khi ghi nhận vào hệ thống
            </p>
          </div>
        </div>

        {/* Entity Card & Status Transition */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {data.type === 'unit_server' ? 'Đơn vị áp dụng' : 'Chuyên mục tài liệu'}
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
              {data.name}
            </div>
            {data.subText && (
              <div className="text-xs font-mono text-[#0072BC] dark:text-sky-400 truncate mt-0.5">
                {data.subText}
              </div>
            )}
          </div>

          {/* Before -> After Comparison */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">Hiện tại</div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {data.currentLabel}
              </span>
            </div>
            <span className="text-slate-400 font-bold">→</span>
            <div className={`flex-1 p-2 rounded-lg border text-center ${
              data.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300 font-semibold'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300 font-semibold'
            }`}>
              <div className="text-[10px] opacity-75 mb-0.5">Chuyển sang</div>
              <span>{data.nextLabel}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {data.type === 'unit_server'
            ? 'Thay đổi sẽ cập nhật bảng ma trận 51 đơn vị, tính lại điểm nghiệm thu và đồng bộ thời gian thực toàn trường.'
            : 'Thay đổi sẽ cập nhật ngay quyền hiển thị của chuyên mục trên Cổng tra cứu TechDoc.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[38px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-h-[38px] px-4 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {isLoading ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
