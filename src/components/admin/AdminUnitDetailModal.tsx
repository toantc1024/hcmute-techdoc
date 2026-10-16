'use client';

import React from 'react';
import {
  UnitWebsiteItem,
  EvaluationCriterion,
  CriterionRating,
} from '@/models/admin.model';

interface AdminUnitDetailModalProps {
  unit: UnitWebsiteItem | null;
  criteria: EvaluationCriterion[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateRating: (unitId: number, criterionId: string, rating: CriterionRating) => void;
}

export const AdminUnitDetailModal: React.FC<AdminUnitDetailModalProps> = ({
  unit,
  criteria,
  isOpen,
  onClose,
  onUpdateRating,
}) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0072BC] dark:text-sky-400">
                STT #{unit.stt} • {unit.groupLabel}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  unit.isNewWeb
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {unit.isNewWeb ? 'Web mới (.189)' : 'Web cũ (.181)'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#004776] dark:text-foreground">
              {unit.name}
            </h3>
            <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
              <span>Domain: <strong className="font-mono">{unit.domain}</strong></span>
              <span>•</span>
              <span>Cán bộ: <strong>{unit.staff}</strong></span>
              <span>•</span>
              <span>Độ hoàn thiện: <strong className="text-[#0072BC] dark:text-sky-400">{unit.completenessScore}%</strong></span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#004776] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content list of criteria */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="text-xs text-muted-foreground">
            Bấm chọn trực tiếp trạng thái tương ứng để cập nhật điểm đánh giá cho đơn vị:
          </div>

          <div className="space-y-3">
            {criteria.map((c) => {
              const currentRating = unit.criteriaRatings[c.id] || 'warning';

              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-background space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {c.code}
                      </span>
                      <h4 className="text-sm font-bold text-[#004776] dark:text-foreground">
                        {c.name}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        (Trọng số: {c.weight}%)
                      </span>
                    </div>

                    {/* 3 Rating Choices */}
                    <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'pass')}
                        className={`min-h-[44px] px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentRating === 'pass'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        ✓ Đạt
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'warning')}
                        className={`min-h-[44px] px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentRating === 'warning'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-muted-foreground hover:text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        ⚠ Cần sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'fail')}
                        className={`min-h-[44px] px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentRating === 'fail'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-muted-foreground hover:text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        ✕ Không đạt
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {currentRating === 'pass' && `Tiêu chuẩn: ${c.passCondition}`}
                    {currentRating === 'warning' && `Vấn đề: ${c.warningCondition}`}
                    {currentRating === 'fail' && `Lỗi nghiêm trọng: ${c.failCondition}`}
                  </p>
                </div>
              );
            })}
          </div>

          {unit.notes && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <strong className="text-[#004776] dark:text-foreground">Ghi chú vận hành:</strong>{' '}
              <span className="text-muted-foreground">{unit.notes}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/80 bg-muted/20">
          <a
            href={`https://${unit.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center text-xs font-semibold text-[#0072BC] hover:underline"
          >
            Mở website đơn vị ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-xl text-sm font-semibold bg-[#0072BC] text-white hover:bg-[#005a96] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
