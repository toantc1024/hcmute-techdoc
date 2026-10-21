import React, { useState, useEffect } from 'react';
import { CriterionRating } from '@/models/admin.model';

export interface StatusConfirmData {
  type: 'unit_server' | 'section_visibility' | 'unit_rating';
  id: number | string;
  criterionId?: string;
  ratingValue?: CriterionRating;
  currentNote?: string;
  name: string;
  subText?: string;
  currentLabel: string;
  nextLabel: string;
  isPositive: boolean;
}

interface AdminStatusConfirmModalProps {
  data: StatusConfirmData | null;
  onConfirm: (selectedRating?: CriterionRating, note?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RATING_CHOICES: {
  key: CriterionRating;
  label: string;
  scoreLabel: string;
  activeColor: string;
  badgeColor: string;
}[] = [
  {
    key: 'pass',
    label: '✓ Đạt',
    scoreLabel: '100% điểm',
    activeColor: 'border-emerald-500 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-500',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    key: 'warning',
    label: '◐ Cần sửa',
    scoreLabel: '50% điểm',
    activeColor: 'border-amber-500 bg-amber-50/90 text-amber-900 ring-2 ring-amber-500/20 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-500',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    key: 'fail',
    label: '✕ Chưa đạt',
    scoreLabel: '0% (0đ)',
    activeColor: 'border-rose-500 bg-rose-50/90 text-rose-900 ring-2 ring-rose-500/20 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-500',
    badgeColor: 'bg-rose-500 text-white',
  },
  {
    key: 'none',
    label: '— Chưa chấm',
    scoreLabel: 'Bỏ điểm / Mặc định',
    activeColor: 'border-slate-500 bg-slate-100 text-slate-900 ring-2 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-500',
    badgeColor: 'bg-slate-500 text-white',
  },
];

export const AdminStatusConfirmModal: React.FC<AdminStatusConfirmModalProps> = ({
  data,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [selectedRating, setSelectedRating] = useState<CriterionRating>(data?.ratingValue || 'pass');
  const [note, setNote] = useState<string>(data?.currentNote || '');

  useEffect(() => {
    if (data) {
      setSelectedRating(data.ratingValue || 'pass');
      setNote(data.currentNote || '');
    }
  }, [data]);

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
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900 text-[#0072BC] dark:text-sky-300 flex items-center justify-center shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[17px] font-[650] text-[#004776] dark:text-foreground">
              {data.type === 'unit_server'
                ? 'Xác nhận chuyển trạng thái máy chủ'
                : data.type === 'unit_rating'
                ? 'Đánh giá điểm tiêu chí đơn vị'
                : 'Xác nhận thay đổi hiển thị'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {data.type === 'unit_rating'
                ? 'Chọn 1 trong 4 mức đánh giá & cập nhật ghi chú bên dưới'
                : 'Kiểm tra thông tin trước khi ghi nhận vào hệ thống'}
            </p>
          </div>
        </div>

        {/* Entity Card & Status Transition */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {data.type === 'unit_server'
                ? 'Đơn vị áp dụng'
                : data.type === 'unit_rating'
                ? 'Đơn vị & Tiêu chí nghiệm thu'
                : 'Chuyên mục tài liệu'}
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

          {/* If unit_rating: show 4 selectable rating options + Ghi chú nhanh */}
          {data.type === 'unit_rating' ? (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Chọn 1 trong 4 mức tiêu chí:
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Hiện tại: <strong className="text-slate-800 dark:text-slate-200">{data.currentLabel}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {RATING_CHOICES.map((choice) => {
                  const isSelected = selectedRating === choice.key;
                  return (
                    <button
                      key={choice.key}
                      type="button"
                      onClick={() => setSelectedRating(choice.key)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? choice.activeColor
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{choice.label}</span>
                        {isSelected && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${choice.badgeColor}`}>
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] opacity-80 mt-1 font-mono">{choice.scoreLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Ghi chú nhanh liên kết trực tiếp với mục 4. Ghi chú Admin */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="quick-admin-note" className="font-semibold text-[#004776] dark:text-sky-300 flex items-center gap-1.5">
                    <svg className="size-3.5 text-[#0072BC] dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Ghi chú nhanh</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(đồng bộ Cột 4. Ghi chú Admin)</span>
                  </label>
                  {note.trim() && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      ✓ Đã có ghi chú
                    </span>
                  )}
                </div>
                <textarea
                  id="quick-admin-note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú nghiệm thu cho tiêu chí này (tự động đồng bộ với Cột 4. Ghi chú Admin)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-[#0072BC] outline-none resize-y min-h-[56px] transition-all"
                />
              </div>
            </div>
          ) : (
            /* Before -> After Comparison for server status and visibility */
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">Hiện tại</div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {data.currentLabel}
                </span>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="flex-1 p-2 rounded-lg border text-center bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-[#0072BC] dark:text-sky-300 font-semibold">
                <div className="text-[10px] opacity-75 mb-0.5">Chuyển sang</div>
                <span>{data.nextLabel}</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {data.type === 'unit_server'
            ? 'Thay đổi sẽ cập nhật bảng ma trận 51 đơn vị, tính lại điểm nghiệm thu và đồng bộ thời gian thực toàn trường.'
            : data.type === 'unit_rating'
            ? 'Thay đổi sẽ cập nhật điểm đánh giá, ghi chú nghiệm thu, tính lại phần trăm hoàn thiện (%) và đồng bộ thời gian thực.'
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
            onClick={() => onConfirm(data.type === 'unit_rating' ? selectedRating : undefined, data.type === 'unit_rating' ? note : undefined)}
            disabled={isLoading}
            className="min-h-[38px] px-5 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {isLoading ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};
