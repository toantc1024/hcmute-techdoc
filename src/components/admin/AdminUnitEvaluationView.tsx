'use client';

import React from 'react';
import {
  UnitWebsiteItem,
  EvaluationCriterion,
  CriterionRating,
} from '@/models/admin.model';

interface AdminUnitEvaluationViewProps {
  unit: UnitWebsiteItem;
  allUnits: UnitWebsiteItem[];
  criteria: EvaluationCriterion[];
  onBack: () => void;
  onSelectUnit: (unit: UnitWebsiteItem) => void;
  onUpdateRating: (unitId: number, criterionId: string, rating: CriterionRating) => void;
}

export const AdminUnitEvaluationView: React.FC<AdminUnitEvaluationViewProps> = ({
  unit,
  allUnits,
  criteria,
  onBack,
  onSelectUnit,
  onUpdateRating,
}) => {
  const currentIndex = allUnits.findIndex((u) => u.id === unit.id);
  const prevUnit = currentIndex > 0 ? allUnits[currentIndex - 1] : null;
  const nextUnit = currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : null;

  const passCount = Object.values(unit.criteriaRatings).filter((r) => r === 'pass').length;
  const warningCount = Object.values(unit.criteriaRatings).filter((r) => r === 'warning').length;
  const failCount = Object.values(unit.criteriaRatings).filter((r) => r === 'fail').length;

  const scoreColor =
    unit.completenessScore >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : unit.completenessScore >= 50
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-rose-600 dark:text-rose-400';

  const barColor =
    unit.completenessScore >= 80
      ? 'bg-emerald-500'
      : unit.completenessScore >= 50
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-white dark:bg-[#132238] shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 hover:bg-muted text-xs sm:text-sm font-semibold text-[#004776] dark:text-sky-300 transition-colors inline-flex items-center gap-2"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách 51 đơn vị
        </button>

        <div className="flex items-center gap-2">
          {prevUnit && (
            <button
              type="button"
              onClick={() => onSelectUnit(prevUnit)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-[#004776] transition-colors"
            >
              ← #{prevUnit.stt} {prevUnit.name.slice(0, 16)}...
            </button>
          )}

          {nextUnit && (
            <button
              type="button"
              onClick={() => onSelectUnit(nextUnit)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-[#004776] transition-colors"
            >
              #{nextUnit.stt} {nextUnit.name.slice(0, 16)}... →
            </button>
          )}

          <a
            href={`https://${unit.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Mở website</span>
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hero Unit Card - Broad & Clear */}
      <div className="p-6 rounded-3xl border border-border bg-white dark:bg-[#132238] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                ĐƠN VỊ #{unit.stt}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                {unit.groupLabel}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  unit.isNewWeb
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {unit.isNewWeb ? 'Đã trỏ web mới (.189)' : 'Đang duy trì web cũ (.181)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#004776] dark:text-foreground">
              {unit.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>Tên miền: <strong className="font-mono text-[#0072BC] dark:text-sky-400">{unit.domain}</strong></span>
              <span>•</span>
              <span>Cán bộ phụ trách: <strong className="text-[#004776] dark:text-foreground">{unit.staff}</strong></span>
            </div>

            {unit.notes && (
              <div className="pt-2 text-xs text-muted-foreground bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-3 rounded-xl">
                <strong className="text-amber-900 dark:text-amber-200">Ghi chú:</strong> {unit.notes}
              </div>
            )}
          </div>

          {/* Completeness Score Banner */}
          <div className="p-5 rounded-2xl border border-border bg-slate-50/70 dark:bg-slate-900/60 min-w-[260px] space-y-2 text-center lg:text-right">
            <div className="text-xs text-muted-foreground font-medium">Độ hoàn thiện tổng quan</div>
            <div className={`text-4xl font-extrabold font-mono ${scoreColor}`}>
              {unit.completenessScore}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${unit.completenessScore}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground pt-1 flex justify-between font-mono">
              <span className="text-emerald-600 font-semibold">{passCount} Đạt</span>
              <span className="text-amber-600 font-semibold">{warningCount} Cần sửa</span>
              <span className="text-rose-600 font-semibold">{failCount} Không đạt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Criteria Evaluation Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-[#004776] dark:text-foreground">
            Bảng chấm điểm các tiêu chí chuẩn hóa ({criteria.length} tiêu chuẩn)
          </h2>
          <span className="text-xs text-muted-foreground">
            Bấm chọn để đánh giá trực tiếp từng tiêu chuẩn kỹ thuật
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {criteria.map((c) => {
            const currentRating = unit.criteriaRatings[c.id] || 'warning';

            return (
              <div
                key={c.id}
                className="p-5 sm:p-6 rounded-2xl border border-border bg-white dark:bg-[#132238] shadow-xs space-y-3.5 hover:border-[#0072BC]/40 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                        {c.code}
                      </span>
                      <h3 className="text-base font-bold text-[#004776] dark:text-foreground">
                        {c.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        (Tỷ trọng: {c.weight}%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  </div>

                  {/* 3 Rating Buttons */}
                  <div className="flex items-center gap-2 shrink-0 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => onUpdateRating(unit.id, c.id, 'pass')}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        currentRating === 'pass'
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30'
                          : 'text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      ✓ Đạt (100%)
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateRating(unit.id, c.id, 'warning')}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        currentRating === 'warning'
                          ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-500/30'
                          : 'text-muted-foreground hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      }`}
                    >
                      ⚠ Cần sửa (50%)
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateRating(unit.id, c.id, 'fail')}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        currentRating === 'fail'
                          ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30'
                          : 'text-muted-foreground hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      }`}
                    >
                      ✕ Không đạt (0%)
                    </button>
                  </div>
                </div>

                {/* Condition Context Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      currentRating === 'pass'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-border bg-slate-50/50 dark:bg-slate-900/30 text-muted-foreground'
                    }`}
                  >
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">✓ Tiêu chuẩn ĐẠT:</div>
                    <p className="leading-relaxed">{c.passCondition}</p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      currentRating === 'warning'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium'
                        : 'border-border bg-slate-50/50 dark:bg-slate-900/30 text-muted-foreground'
                    }`}
                  >
                    <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">⚠ Điểm CẦN CHỈNH SỬA:</div>
                    <p className="leading-relaxed">{c.warningCondition}</p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      currentRating === 'fail'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                        : 'border-border bg-slate-50/50 dark:bg-slate-900/30 text-muted-foreground'
                    }`}
                  >
                    <div className="font-bold text-rose-700 dark:text-rose-400 mb-1">✕ Lỗi KHÔNG ĐẠT:</div>
                    <p className="leading-relaxed">{c.failCondition}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
