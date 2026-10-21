'use client';

import React from 'react';

export interface OverviewGroupStat {
  key: string;
  label: string;
  color: string;
  count: number;
  completed: number;
  pct: number;
}

export interface OverviewChartStats {
  total: number;
  passUnits: number;
  warningUnits: number;
  failUnits: number;
  unratedUnits: number;
  avgScore: number;
  groups: OverviewGroupStat[];
}

interface AdminOverviewChartsProps {
  stats: OverviewChartStats;
}

export const AdminOverviewCharts: React.FC<AdminOverviewChartsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-stretch">
      {/* Chart 1: Tiến độ theo nhóm đơn vị - Tinh gọn, thanh lịch */}
      <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
              Tiến độ theo nhóm đơn vị
            </h3>
            <span className="text-xs text-muted-foreground font-mono">4 khối chính</span>
          </div>

          <div className="space-y-3.5 pt-3">
            {stats.groups.map((g) => (
              <div key={g.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{g.label}</span>
                  <span className="font-mono font-bold text-[#004776] dark:text-sky-300 tabular-nums">
                    {g.completed}/{g.count} ({g.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${g.color} rounded-full transition-all duration-500`}
                    style={{ width: `${g.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Tỷ lệ hoàn thiện tổng thể (Donut thanh lịch, màu dịu mắt) */}
      <div className="h-full flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
              Tỷ lệ hoàn thiện tổng thể
            </h3>
            <span className="text-xs text-muted-foreground font-mono">8 tiêu chuẩn cốt lõi</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-3">
            {/* Donut graphic */}
            <div className="relative size-32 sm:size-36 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="10" className="dark:stroke-slate-800" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - stats.avgScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[28px] sm:text-[32px] font-[650] font-mono tabular-nums text-[#004776] dark:text-foreground">
                  {stats.avgScore}%
                </span>
                <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                  {stats.passUnits}/{stats.total} web đạt
                </span>
              </div>
            </div>

            {/* Legend list dịu mắt */}
            <div className="space-y-2.5 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500/80" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Đạt chuẩn (≥80%)</span>
                </div>
                <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">{stats.passUnits}</strong>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500/80" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Cần sửa (50-79%)</span>
                </div>
                <strong className="font-mono text-amber-700 dark:text-amber-400 font-bold tabular-nums">{stats.warningUnits}</strong>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-rose-500/80" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Chưa đạt (&lt;50%)</span>
                </div>
                <strong className="font-mono text-rose-700 dark:text-rose-400 font-bold tabular-nums">{stats.failUnits}</strong>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Chưa chấm</span>
                </div>
                <strong className="font-mono text-slate-500 font-bold tabular-nums">{stats.unratedUnits}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
