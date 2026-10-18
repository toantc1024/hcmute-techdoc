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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      {/* Chart 1: Tiến độ theo nhóm đơn vị (Scaled 1.3x) */}
      <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
          <h3 className="font-extrabold text-base sm:text-lg text-[#004776] dark:text-foreground">
            Tiến độ theo nhóm đơn vị
          </h3>
          <span className="text-xs sm:text-sm text-muted-foreground font-mono font-bold">4 khối chính</span>
        </div>

        <div className="space-y-4 pt-1">
          {stats.groups.map((g) => (
            <div key={g.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-700 dark:text-slate-300">{g.label}</span>
                <span className="font-mono font-black text-[#004776] dark:text-sky-300">
                  {g.completed}/{g.count} ({g.pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 sm:h-5 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${g.color} rounded-full transition-all duration-500`}
                  style={{ width: `${g.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Tỷ lệ hoàn thiện tổng thể (Donut Chart Scaled 1.3x) */}
      <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
          <h3 className="font-extrabold text-base sm:text-lg text-[#004776] dark:text-foreground">
            Tỷ lệ hoàn thiện tổng thể
          </h3>
          <span className="text-xs sm:text-sm text-muted-foreground font-mono font-bold">7 tiêu chuẩn cốt lõi</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-2">
          {/* Donut graphic scaled up */}
          <div className="relative size-44 sm:size-52 shrink-0 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12" className="dark:stroke-slate-800" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 * (1 - stats.avgScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#004776] dark:text-foreground">
                {stats.avgScore}%
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">
                {stats.passUnits}/{stats.total} website
              </span>
            </div>
          </div>

          {/* Legend list scaled up */}
          <div className="space-y-3 text-sm sm:text-base w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Đạt chuẩn (≥80%)</span>
              </div>
              <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{stats.passUnits}</strong>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Cần sửa (50-79%)</span>
              </div>
              <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold">{stats.warningUnits}</strong>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-rose-500" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Chưa đạt (&lt;50%)</span>
              </div>
              <strong className="font-mono text-rose-600 dark:text-rose-400 font-bold">{stats.failUnits}</strong>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Chưa chấm</span>
              </div>
              <strong className="font-mono text-slate-500 font-bold">{stats.unratedUnits}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
