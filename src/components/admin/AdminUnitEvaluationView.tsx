'use client';

import React, { useState } from 'react';
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
  onUpdateNote: (unitId: number, criterionId: string, note: string) => void;
}

export const AdminUnitEvaluationView: React.FC<AdminUnitEvaluationViewProps> = ({
  unit,
  allUnits,
  criteria,
  onBack,
  onSelectUnit,
  onUpdateRating,
  onUpdateNote,
}) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const currentIndex = allUnits.findIndex((u) => u.id === unit.id);
  const prevUnit = currentIndex > 0 ? allUnits[currentIndex - 1] : null;
  const nextUnit = currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : null;

  const toggleDetail = (critId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [critId]: !prev[critId] }));
  };

  const scoreColor =
    unit.completenessScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
    unit.completenessScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';

  const barColor =
    unit.completenessScore >= 80 ? 'bg-emerald-500' :
    unit.completenessScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-white dark:bg-[#132238] shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 hover:bg-muted text-xs sm:text-sm font-semibold text-[#004776] dark:text-sky-300 transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>Quay lại danh sách 51 đơn vị</span>
        </button>

        <div className="flex items-center gap-2">
          {prevUnit && (
            <button
              type="button"
              onClick={() => onSelectUnit(prevUnit)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-[#004776]"
            >
              ← #{prevUnit.stt} {prevUnit.name.slice(0, 14)}...
            </button>
          )}

          {nextUnit && (
            <button
              type="button"
              onClick={() => onSelectUnit(nextUnit)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-[#004776]"
            >
              #{nextUnit.stt} {nextUnit.name.slice(0, 14)}... →
            </button>
          )}

          <a
            href={`https://${unit.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Mở website ↗</span>
          </a>
        </div>
      </div>

      {/* Hero Unit Card */}
      <div className="p-6 rounded-3xl border border-border bg-white dark:bg-[#132238] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
              ĐƠN VỊ #{unit.stt}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-muted-foreground">
              {unit.groupLabel}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
              unit.isNewWeb ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
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
        </div>

        <div className="p-5 rounded-2xl border border-border bg-slate-50/70 dark:bg-slate-900/60 min-w-[220px] space-y-2 text-center lg:text-right">
          <div className="text-xs text-muted-foreground font-medium">Độ hoàn thiện tổng quan</div>
          <div className={`text-4xl font-extrabold font-mono ${scoreColor}`}>{unit.completenessScore}%</div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${unit.completenessScore}%` }} />
          </div>
        </div>
      </div>

      {/* SQUARE TABLE (NGUYÊN DẠNG BẢNG VUÔNG) */}
      <div className="rounded-2xl border border-border bg-white dark:bg-[#132238] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border bg-slate-50/50 dark:bg-slate-900/40">
          <h2 className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground">
            Bảng đánh giá vuông chi tiết ({criteria.length} tiêu chuẩn)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cơ cấu 4 cột: Nội dung tiêu chuẩn • Chấm điểm • Đánh giá tổng quan • Ghi chú Admin
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/90 border-b border-border text-xs font-bold text-[#004776] dark:text-sky-300 uppercase tracking-wider">
                <th className="p-3.5 w-[26%] border-r border-border">1. Nội dung tiêu chuẩn</th>
                <th className="p-3.5 w-[24%] border-r border-border text-center">2. Chấm điểm</th>
                <th className="p-3.5 w-[28%] border-r border-border">3. Đánh giá tổng quan</th>
                <th className="p-3.5 w-[22%]">4. Ghi chú Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {criteria.map((c) => {
                const currentRating = unit.criteriaRatings[c.id] || 'warning';
                const currentNote = unit.criteriaNotes?.[c.id] || '';
                const isExpanded = expandedDetails[c.id];

                return (
                  <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors align-top">
                    {/* Cột 1: Nội dung */}
                    <td className="p-3.5 border-r border-border space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                          {c.code}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-semibold">Tỷ trọng: {c.weight}%</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#004776] dark:text-foreground">{c.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                    </td>

                    {/* Cột 2: Chấm điểm */}
                    <td className="p-3.5 border-r border-border space-y-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'pass')}
                        className={`w-full min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          currentRating === 'pass'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <span>✓</span><span>Đạt (100% điểm)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'warning')}
                        className={`w-full min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          currentRating === 'warning'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        <span>⚠</span><span>Cần sửa (50% điểm)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateRating(unit.id, c.id, 'fail')}
                        className={`w-full min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          currentRating === 'fail'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        <span>✕</span><span>Không đạt (0 điểm)</span>
                      </button>
                    </td>

                    {/* Cột 3: Đánh giá tổng quan */}
                    <td className="p-3.5 border-r border-border space-y-2 text-xs">
                      <div className={`p-3 rounded-xl border leading-relaxed ${
                        currentRating === 'pass' ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' :
                        currentRating === 'warning' ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200' :
                        'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
                      }`}>
                        <div className="font-bold mb-1">
                          {currentRating === 'pass' && '✓ Tiêu chuẩn ĐẠT:'}
                          {currentRating === 'warning' && '⚠ Điểm CẦN CHỈNH SỬA:'}
                          {currentRating === 'fail' && '✕ Lỗi KHÔNG ĐẠT:'}
                        </div>
                        <div>
                          {currentRating === 'pass' && c.passCondition}
                          {currentRating === 'warning' && c.warningCondition}
                          {currentRating === 'fail' && c.failCondition}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDetail(c.id)}
                        className="text-[11px] text-[#0072BC] dark:text-sky-400 hover:underline font-medium"
                      >
                        {isExpanded ? '▲ Ẩn đối chiếu đầy đủ' : '▼ Xem cả 3 điều kiện đối chiếu'}
                      </button>

                      {isExpanded && (
                        <div className="space-y-1 pt-1 border-t border-border/60 text-[11px]">
                          <div className="text-emerald-700 dark:text-emerald-400"><strong>Đạt:</strong> {c.passCondition}</div>
                          <div className="text-amber-700 dark:text-amber-400"><strong>Cần sửa:</strong> {c.warningCondition}</div>
                          <div className="text-rose-700 dark:text-rose-400"><strong>Không đạt:</strong> {c.failCondition}</div>
                        </div>
                      )}
                    </td>

                    {/* Cột 4: Ghi chú Admin */}
                    <td className="p-3.5 space-y-1">
                      <textarea
                        rows={3}
                        value={currentNote}
                        onChange={(e) => onUpdateNote(unit.id, c.id, e.target.value)}
                        placeholder="Admin note lại nội dung cần lưu ý..."
                        className="w-full p-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 text-xs text-[#004776] dark:text-foreground leading-[1.8] focus:ring-2 focus:ring-[#0072BC]/30 focus:bg-background outline-hidden resize-y min-h-[90px]"
                      />
                      {currentNote.trim() && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Đã lưu ghi chú</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
