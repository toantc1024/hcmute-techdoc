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

  // Sắp xếp theo Hạng (Điểm cao xuống thấp, sau đó theo số tiêu chuẩn đạt, rồi theo tên)
  const rankedUnits = useMemo(() => {
    return [...units].sort((a, b) => {
      if (b.completenessScore !== a.completenessScore) {
        return b.completenessScore - a.completenessScore;
      }
      const aPassCount = Object.values(a.criteriaRatings || {}).filter((r) => r === 'pass').length;
      const bPassCount = Object.values(b.criteriaRatings || {}).filter((r) => r === 'pass').length;
      if (bPassCount !== aPassCount) return bPassCount - aPassCount;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [units]);

  const handleCellClick = (u: UnitWebsiteItem, critCode: string, currentRating: CriterionRating | undefined) => {
    if (isAdmin && onUpdateRating) {
      // Chu kỳ toggle: pass -> warning -> fail -> pass
      const next: CriterionRating =
        currentRating === 'pass' ? 'warning' : currentRating === 'warning' ? 'fail' : 'pass';
      onUpdateRating(u.id, critCode, next);
    } else if (onSelectUnit) {
      onSelectUnit(u);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-sm overflow-hidden">
      {/* Header chú giải theo chuẩn ICPC Scoreboard */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-[#004776] dark:text-sky-300 uppercase tracking-wider">
            Bảng Giám sát Tiến độ 51 Đơn vị · ICPC Scoreboard Mode
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500 text-white font-bold text-[11px] shadow-2xs">
            <span>✓ Đạt (15đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-bold text-[11px] shadow-2xs">
            <span>⏱ Cần sửa (7.5đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500 text-white font-bold text-[11px] shadow-2xs">
            <span>✕ Chưa đạt (0đ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[11px]">
            <span>- Chưa chấm</span>
          </span>
        </div>
      </div>

      {/* Bảng ma trận sát nhau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#004776] text-white text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-2 text-center w-12 font-bold">Hạng</th>
              <th className="py-2.5 px-3 min-w-[240px] font-bold">Đơn vị &amp; Website</th>
              <th className="py-2.5 px-2 text-center w-16 font-bold" title="Số tiêu chuẩn đạt / Tổng số tiêu chuẩn">Số TC</th>
              <th className="py-2.5 px-2 text-center w-20 font-bold" title="Độ hoàn thiện theo trọng số">Điểm %</th>
              <th className="py-2.5 px-2 text-center w-20 font-bold">Máy chủ</th>
              
              {/* Cột các tiêu chí sát nhau A -> G */}
              {criteria.map((c, idx) => (
                <th
                  key={c.id || c.code}
                  className="py-2 px-1 text-center w-14 font-extrabold border-l border-[#00385e] hover:bg-[#003c66] transition-colors cursor-help select-none"
                  title={`${c.code}: ${c.name} (${c.weight}%)`}
                >
                  <div className="text-[12px] leading-tight font-black">{String.fromCharCode(65 + idx)}</div>
                  <div className="text-[9px] font-normal opacity-85 leading-none mt-0.5">{c.code || `TC0${idx + 1}`}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {rankedUnits.map((u, rankIdx) => {
              const rank = rankIdx + 1;
              const passCount = Object.values(u.criteriaRatings || {}).filter((r) => r === 'pass').length;
              const warnCount = Object.values(u.criteriaRatings || {}).filter((r) => r === 'warning').length;
              const hasAlert = u.completenessScore < 50 || !u.isNewWeb;

              // Huy chương top 3
              const rankBadge =
                rank === 1 ? 'bg-amber-100 text-amber-900 border-amber-300 font-black shadow-2xs' :
                rank === 2 ? 'bg-slate-200 text-[#004776] border-slate-300 font-extrabold' :
                rank === 3 ? 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold' :
                'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 font-bold';

              return (
                <tr
                  key={u.id}
                  onClick={() => onSelectUnit && onSelectUnit(u)}
                  className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group ${
                    rank <= 3 ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                  }`}
                >
                  {/* Cột Hạng */}
                  <td className="py-2 px-2 text-center">
                    <span className={`inline-flex items-center justify-center size-6 rounded-md text-xs border ${rankBadge}`}>
                      {rank}
                    </span>
                  </td>

                  {/* Cột Đơn vị */}
                  <td className="py-2 px-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-[13px] text-[#004776] dark:text-foreground truncate flex items-center gap-1.5">
                          <span className="truncate">{u.name}</span>
                          {/* Live pulse indicator cho web mới hoặc top */}
                          {hasAlert ? (
                            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" title="Cần rà soát" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                          <span className="text-[#0072BC] dark:text-sky-400 truncate">{u.domain}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[10px] text-slate-500 font-sans">{u.groupLabel}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                        {u.staff}
                      </span>
                    </div>
                  </td>

                  {/* Cột Số bài (Số TC đạt) */}
                  <td className="py-2 px-2 text-center">
                    <span className="font-extrabold font-mono text-[13px] text-[#004776] dark:text-slate-200">
                      {passCount}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono leading-none">
                      /{criteria.length}
                    </span>
                  </td>

                  {/* Cột Điểm % hoàn thiện */}
                  <td className="py-2 px-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`font-black font-mono text-[13px] leading-tight ${
                        u.completenessScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                        u.completenessScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                        'text-rose-600 dark:text-rose-400'
                      }`}>
                        {u.completenessScore}%
                      </span>
                      <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            u.completenessScore >= 80 ? 'bg-emerald-500' :
                            u.completenessScore >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${u.completenessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cột Trạng thái Web */}
                  <td className="py-2 px-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      u.isNewWeb
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {u.isNewWeb ? '.189 Mới' : '.181 Cũ'}
                    </span>
                  </td>

                  {/* 7 Khối ô màu tiêu chuẩn sát nhau */}
                  {criteria.map((c) => {
                    const critCode = c.id || c.code;
                    const rating = u.criteriaRatings?.[critCode];
                    const note = u.criteriaNotes?.[critCode];
                    const isHovered = hoveredCell?.unitId === u.id && hoveredCell?.critCode === critCode;

                    // Màu sắc chuẩn theo hình ICPC Scoreboard
                    let bgClasses = 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-800';
                    let mainText = '-';
                    let subText = '';

                    if (rating === 'pass') {
                      bgClasses = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-2xs';
                      mainText = `+${c.weight || 15}`;
                      subText = 'Đạt';
                    } else if (rating === 'warning') {
                      bgClasses = 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 shadow-2xs';
                      mainText = `+${Math.round((c.weight || 15) * 0.5)}`;
                      subText = 'Cần sửa';
                    } else if (rating === 'fail') {
                      bgClasses = 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-2xs';
                      mainText = '0';
                      subText = 'Lỗi';
                    }

                    return (
                      <td
                        key={critCode}
                        className="py-1 px-0.5 text-center w-14 border-l border-slate-200 dark:border-slate-800 select-none relative"
                        onMouseEnter={() => setHoveredCell({ unitId: u.id, critCode })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(u, critCode, rating);
                        }}
                      >
                        <div
                          className={`h-11 w-full rounded-md flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer border ${bgClasses}`}
                        >
                          <span className="font-black font-mono text-[12px] leading-tight">
                            {mainText}
                          </span>
                          <span className="text-[9px] font-semibold leading-tight opacity-90">
                            {subText}
                          </span>
                        </div>

                        {/* Tooltip nổi khi rê chuột */}
                        {isHovered && (
                          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl pointer-events-none text-left leading-snug animate-in fade-in zoom-in-95 duration-100">
                            <div className="font-bold text-amber-300 pb-1 border-b border-slate-700 mb-1">
                              {c.code}: {c.name} ({c.weight}%)
                            </div>
                            <div className="text-slate-200 font-medium">
                              Trạng thái: <strong className="uppercase">{rating || 'Chưa đánh giá'}</strong>
                            </div>
                            {note && (
                              <div className="text-emerald-300 mt-1 italic text-[10px]">
                                Ghi chú: {note}
                              </div>
                            )}
                            {isAdmin && (
                              <div className="text-[9px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                                Click để đổi trạng thái nhanh (Đạt / Cần sửa / Chưa đạt)
                              </div>
                            )}
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
