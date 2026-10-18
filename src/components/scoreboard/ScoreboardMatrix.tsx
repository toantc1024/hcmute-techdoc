'use client';

import React, { useState, useMemo } from 'react';
import { UnitWebsiteItem, EvaluationCriterion, CriterionRating } from '@/models/admin.model';

interface ScoreboardMatrixProps {
  units: UnitWebsiteItem[];
  criteria: EvaluationCriterion[];
  onSelectUnit?: (unit: UnitWebsiteItem) => void;
  onUpdateRating?: (unitId: number, criterionId: string, rating: CriterionRating) => void;
  isAdmin?: boolean;
}

export const ScoreboardMatrix: React.FC<ScoreboardMatrixProps> = ({
  units,
  criteria,
  onSelectUnit,
  onUpdateRating,
  isAdmin = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ unitId: number; critCode: string } | null>(null);

  const rankedUnits = useMemo(() => {
    return [...units].sort((a, b) => {
      if (b.completenessScore !== a.completenessScore) {
        return b.completenessScore - a.completenessScore;
      }
      const aPass = Object.values(a.criteriaRatings || {}).filter((r) => r === 'pass').length;
      const bPass = Object.values(b.criteriaRatings || {}).filter((r) => r === 'pass').length;
      if (bPass !== aPass) return bPass - aPass;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [units]);

  const handleCellClick = (u: UnitWebsiteItem, critCode: string, currentRating: CriterionRating | undefined) => {
    if (isAdmin && onUpdateRating) {
      const next: CriterionRating =
        currentRating === 'pass' ? 'warning' : currentRating === 'warning' ? 'fail' : 'pass';
      onUpdateRating(u.id, critCode, next);
    } else if (onSelectUnit) {
      onSelectUnit(u);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] overflow-hidden">
      {/* Header chú giải thanh lịch, màu dịu mắt */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="font-bold text-[#004776] dark:text-sky-300 text-sm tracking-tight">
            Bảng Giám sát Tiến độ 51 Đơn vị
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-medium text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span>✓ Đạt (+15đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <span>⏱ Cần sửa (+7.5đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
            <span>✕ Chưa đạt (0đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            <span>- Chưa chấm</span>
          </span>
        </div>
      </div>

      {/* Bảng ma trận trực quan & dịu mắt */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#004776] text-white text-xs uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-2.5 text-center w-12">Hạng</th>
              <th className="py-2.5 px-3 min-w-[240px]">Đơn vị &amp; Website</th>
              <th className="py-2.5 px-2.5 text-center w-16" title="Số tiêu chuẩn đạt">Số TC</th>
              <th className="py-2.5 px-2.5 text-center w-20" title="Độ hoàn thiện">Điểm %</th>
              <th className="py-2.5 px-2.5 text-center w-20">Máy chủ</th>
              {criteria.map((c, idx) => (
                <th
                  key={c.id || c.code}
                  className="py-2 px-1 text-center w-16 border-l border-[#00385e] hover:bg-[#003c66] transition-colors cursor-help select-none"
                  title={`${c.code}: ${c.name} (${c.weight}%)`}
                >
                  <div className="text-sm font-bold leading-tight">{String.fromCharCode(65 + idx)}</div>
                  <div className="text-[10px] font-normal opacity-85 leading-none mt-0.5">{c.code || `TC0${idx + 1}`}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
            {rankedUnits.map((u, rankIdx) => {
              const rank = rankIdx + 1;
              const passCount = Object.values(u.criteriaRatings || {}).filter((r) => r === 'pass').length;
              const hasAlert = u.completenessScore < 50 || !u.isNewWeb;

              const rankBadge =
                rank === 1 ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold' :
                rank === 2 ? 'bg-slate-100 text-[#004776] border-slate-200 font-bold' :
                rank === 3 ? 'bg-orange-50 text-orange-900 border-orange-200 font-bold' :
                'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200/60 font-semibold';

              return (
                <tr
                  key={u.id}
                  onClick={() => onSelectUnit && onSelectUnit(u)}
                  className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group ${
                    rank <= 3 ? 'bg-amber-50/15 dark:bg-amber-950/10' : ''
                  }`}
                >
                  {/* Hạng */}
                  <td className="py-2 px-2 text-center">
                    <span className={`inline-flex items-center justify-center size-6 rounded text-xs border ${rankBadge}`}>
                      {rank}
                    </span>
                  </td>

                  {/* Đơn vị & Website */}
                  <td className="py-2 px-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-[#004776] dark:text-foreground truncate flex items-center gap-1.5">
                          <span className="truncate">{u.name}</span>
                          {hasAlert ? (
                            <span className="size-1.5 rounded-full bg-amber-500 shrink-0" title="Cần rà soát" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono mt-0.5">
                          <span className="text-[#0072BC] dark:text-sky-400 font-medium truncate">{u.domain}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 font-sans">{u.groupLabel}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700">
                        {u.staff}
                      </span>
                    </div>
                  </td>

                  {/* Số TC */}
                  <td className="py-2 px-2 text-center">
                    <span className="font-bold font-mono text-sm text-[#004776] dark:text-slate-200">
                      {passCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground inline font-mono">
                      /{criteria.length}
                    </span>
                  </td>

                  {/* Điểm % */}
                  <td className="py-2 px-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`font-bold font-mono text-xs leading-tight ${
                        u.completenessScore >= 80 ? 'text-emerald-700 dark:text-emerald-400' :
                        u.completenessScore >= 50 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'
                      }`}>
                        {u.completenessScore}%
                      </span>
                      <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            u.completenessScore >= 80 ? 'bg-emerald-500/80' :
                            u.completenessScore >= 50 ? 'bg-amber-500/80' : 'bg-rose-500/80'
                          }`}
                          style={{ width: `${u.completenessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Máy chủ */}
                  <td className="py-2 px-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                      u.isNewWeb
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {u.isNewWeb ? '.189' : '.181'}
                    </span>
                  </td>

                  {/* 7 Khối màu tiêu chuẩn - Màu full ô vuông, bỏ nút bên trong */}
                  {criteria.map((c) => {
                    const critCode = c.id || c.code;
                    const rating = u.criteriaRatings?.[critCode];
                    const isHovered = hoveredCell?.unitId === u.id && hoveredCell?.critCode === critCode;

                    let bgClasses = 'bg-slate-50/70 text-slate-400 hover:bg-slate-100/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/60';
                    let mainText = '-';
                    let subText = '';

                    if (rating === 'pass') {
                      bgClasses = 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 dark:text-emerald-300';
                      mainText = `+${c.weight || 15}`;
                      subText = 'Đạt';
                    } else if (rating === 'warning') {
                      bgClasses = 'bg-amber-50 hover:bg-amber-100/90 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 dark:text-amber-300';
                      mainText = `+${Math.round((c.weight || 15) * 0.5)}`;
                      subText = 'Sửa';
                    } else if (rating === 'fail') {
                      bgClasses = 'bg-rose-50 hover:bg-rose-100/90 text-rose-800 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 dark:text-rose-300';
                      mainText = '0';
                      subText = 'Lỗi';
                    }

                    return (
                      <td
                        key={critCode}
                        className={`text-center w-16 border-l border-slate-200 dark:border-slate-800 select-none relative cursor-pointer transition-colors p-0 align-middle ${bgClasses}`}
                        onMouseEnter={() => setHoveredCell({ unitId: u.id, critCode })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(u, critCode, rating);
                        }}
                      >
                        <div className="w-full py-2.5 px-1 flex flex-col items-center justify-center">
                          <span className="font-bold font-mono text-xs leading-none">{mainText}</span>
                          {subText && (
                            <span className="text-[10px] font-medium leading-none mt-1 opacity-90">{subText}</span>
                          )}
                        </div>

                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-60 p-2.5 rounded-lg bg-slate-900 text-white text-xs pointer-events-none text-left leading-relaxed shadow-lg">
                            <div className="font-bold text-amber-300 pb-1 border-b border-slate-700 mb-1">
                              {c.code}: {c.name} ({c.weight}%)
                            </div>
                            <div>Trạng thái: <strong className="uppercase">{rating || 'Chưa đánh giá'}</strong></div>
                            {isAdmin && <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">Bấm để chuyển trạng thái</div>}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
