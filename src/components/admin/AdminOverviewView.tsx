'use client';

import React, { useState, useMemo } from 'react';
import { UnitWebsiteItem, EvaluationCriterion, CriterionRating } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';
import { ScoreboardMatrix } from '@/components/scoreboard/ScoreboardMatrix';
import { AdminUnitEvaluationView } from './AdminUnitEvaluationView';
import { AdminOverviewCharts, OverviewChartStats } from './AdminOverviewCharts';

interface AdminOverviewViewProps {
  units: UnitWebsiteItem[];
  criteria: EvaluationCriterion[];
  totalViews: number;
  totalChapters: number;
  onUpdateRating: (unitId: number, criterionId: string, rating: CriterionRating) => void;
  onUpdateNote?: (unitId: number, criterionId: string, note: string) => void;
  onToggleServerStatus?: (unitId: number) => void;
  onSwitchToUnitsTab?: () => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  units,
  criteria,
  totalViews,
  totalChapters,
  onUpdateRating,
  onUpdateNote,
  onToggleServerStatus,
  onSwitchToUnitsTab,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWebType, setSelectedWebType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [inspectingUnit, setInspectingUnit] = useState<UnitWebsiteItem | null>(null);

  const stats: OverviewChartStats = useMemo(() => {
    const total = units.length || 51;
    const passUnits = units.filter((u) => u.completenessScore >= 80).length;
    const warningUnits = units.filter((u) => u.completenessScore >= 50 && u.completenessScore < 80).length;
    const failUnits = units.filter((u) => u.completenessScore > 0 && u.completenessScore < 50).length;
    const unratedUnits = units.filter((u) => u.completenessScore === 0).length;
    const avgScore = Math.round(units.reduce((acc, u) => acc + u.completenessScore, 0) / (total || 1));

    const groups = [
      { key: 'khoa-vien', label: 'Khoa & Viện', color: 'bg-emerald-500/80' },
      { key: 'phong-ban', label: 'Phòng ban', color: 'bg-[#0072BC]/85' },
      { key: 'trung-tam', label: 'Trung tâm', color: 'bg-indigo-500/80' },
      { key: 'doan-the', label: 'Đoàn thể', color: 'bg-amber-500/80' },
    ].map((g) => {
      const gUnits = units.filter((u) => u.group === g.key);
      const count = gUnits.length;
      const completed = gUnits.filter((u) => u.completenessScore >= 70).length;
      const pct = count > 0 ? Math.round((completed / count) * 100) : 100;
      return { ...g, count, completed, pct };
    });

    return { total, passUnits, warningUnits, failUnits, unratedUnits, avgScore, groups };
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (selectedGroup !== 'all' && u.group !== selectedGroup) return false;
      if (selectedWebType === 'new' && !u.isNewWeb) return false;
      if (selectedWebType === 'old' && u.isNewWeb) return false;
      if (selectedStatus === 'pass' && u.completenessScore < 80) return false;
      if (selectedStatus === 'warning' && (u.completenessScore < 50 || u.completenessScore >= 80)) return false;
      if (selectedStatus === 'fail' && u.completenessScore >= 50) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.domain.toLowerCase().includes(term) || u.staff.toLowerCase().includes(term);
    });
  }, [units, selectedGroup, selectedWebType, selectedStatus, searchTerm]);

  if (inspectingUnit) {
    return (
      <AdminUnitEvaluationView
        unit={inspectingUnit}
        allUnits={units}
        criteria={criteria}
        onBack={() => setInspectingUnit(null)}
        onSelectUnit={(next) => setInspectingUnit(next)}
        onUpdateRating={(unitId, critId, rating) => {
          onUpdateRating(unitId, critId, rating);
          const found = units.find((x) => x.id === unitId);
          if (found) setInspectingUnit(found);
        }}
        onUpdateNote={onUpdateNote || (() => {})}
        onToggleServerStatus={(id) => {
          if (onToggleServerStatus) onToggleServerStatus(id);
          const found = units.find((x) => x.id === id);
          if (found) setInspectingUnit({ ...found, isNewWeb: !found.isNewWeb });
        }}
      />
    );
  }

  const groupFilterTabs = [
    { key: 'all', label: 'Tất cả (51)' },
    { key: 'khoa-vien', label: 'Khoa & Viện (15)' },
    { key: 'phong-ban', label: 'Phòng ban (16)' },
    { key: 'trung-tam', label: 'Trung tâm (13)' },
    { key: 'doan-the', label: 'Đoàn thể (7)' },
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* ROW 1: 4 STATS CARDS - Enterprise KPI Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center justify-between gap-3">
          <div>
            <div className="text-[28px] sm:text-[32px] font-[650] text-[#004776] dark:text-foreground font-mono tabular-nums leading-tight">
              {stats.total} <span className="text-xs font-sans font-medium text-muted-foreground">đơn vị</span>
            </div>
            <div className="text-[14px] sm:text-[15px] font-semibold text-slate-700 dark:text-slate-300 mt-1">Tổng số website</div>
            <div className="text-[11px] sm:text-[12px] text-slate-500 font-medium mt-0.5">100% thuộc HCM-UTE</div>
          </div>
          <div className="size-11 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 p-1.5 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
            <img src={brandConfig.logoUrl} alt="HCM-UTE" className="size-7 sm:size-8 object-contain" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center justify-between gap-3">
          <div>
            <div className="text-[28px] sm:text-[32px] font-[650] text-emerald-700 dark:text-emerald-400 font-mono tabular-nums leading-tight">
              {stats.avgScore}%
            </div>
            <div className="text-[14px] sm:text-[15px] font-semibold text-slate-700 dark:text-slate-300 mt-1">Đã hoàn thiện</div>
            <div className="text-[11px] sm:text-[12px] text-slate-500 font-medium mt-0.5">{stats.passUnits}/{stats.total} website đạt</div>
          </div>
          <div className="size-11 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800 shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center justify-between gap-3">
          <div>
            <div className="text-[28px] sm:text-[32px] font-[650] text-[#0072BC] dark:text-sky-300 font-mono tabular-nums leading-tight">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[14px] sm:text-[15px] font-semibold text-slate-700 dark:text-slate-300 mt-1">Tổng lượt xem</div>
            <div className="text-[11px] sm:text-[12px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
              {totalViews === 0 ? 'Đã đặt lại về 0 (Sẵn sàng đếm)' : 'Thời gian thực từ hệ thống'}
            </div>
          </div>
          <div className="size-11 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 text-[#0072BC] dark:text-sky-300 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex items-center justify-between gap-3">
          <div>
            <div className="text-[28px] sm:text-[32px] font-[650] text-[#004776] dark:text-foreground font-mono tabular-nums leading-tight">
              {totalChapters} <span className="text-xs font-sans font-medium text-muted-foreground">chương</span>
            </div>
            <div className="text-[14px] sm:text-[15px] font-semibold text-slate-700 dark:text-slate-300 mt-1">Quản lý tài liệu</div>
            <div className="text-[11px] sm:text-[12px] text-slate-500 font-medium mt-0.5">29 chuyên đề / bài hướng dẫn</div>
          </div>
          <div className="size-11 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200/80 dark:border-slate-700 shrink-0">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ROW 2: 2 CHARTS SIDE BY SIDE */}
      <AdminOverviewCharts stats={stats} />

      {/* ROW 3: FAST FILTER TABS & SEARCH */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-3.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800/80">
          {groupFilterTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelectedGroup(t.key)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                selectedGroup === t.key
                  ? 'bg-[#0072BC] text-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
                  : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm theo đơn vị, website, cán bộ phụ trách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[40px] pl-10 pr-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[13px] sm:text-[14px] text-[#004776] dark:text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-[#0072BC] focus:border-[#0072BC] outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedWebType}
              onChange={(e) => setSelectedWebType(e.target.value)}
              className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[13px] sm:text-[14px] font-medium text-slate-700 dark:text-foreground cursor-pointer"
            >
              <option value="all">Tất cả máy chủ</option>
              <option value="new">Web mới (.189)</option>
              <option value="old">Web cũ (.181)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-[13px] sm:text-[14px] font-medium text-slate-700 dark:text-foreground cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pass">Đạt chuẩn (≥80%)</option>
              <option value="warning">Cần chỉnh sửa</option>
              <option value="fail">Chưa đạt</option>
            </select>

            {onSwitchToUnitsTab && (
              <button
                type="button"
                onClick={onSwitchToUnitsTab}
                className="min-h-[40px] px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-[#0072BC] dark:text-sky-300 text-[13px] sm:text-[14px] font-semibold hover:bg-slate-100 transition-colors duration-150 inline-flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <span>Xem ma trận đầy đủ →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROW 4: MATRIX TABLE */}
      <ScoreboardMatrix
        units={filteredUnits}
        criteria={criteria}
        onSelectUnit={(u) => setInspectingUnit(u)}
        onUpdateRating={onUpdateRating}
        onToggleServerStatus={onToggleServerStatus}
        isAdmin={true}
      />
    </div>
  );
};
