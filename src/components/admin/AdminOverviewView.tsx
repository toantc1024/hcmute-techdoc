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
  onSwitchToUnitsTab?: () => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  units,
  criteria,
  totalViews,
  totalChapters,
  onUpdateRating,
  onUpdateNote,
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
      { key: 'khoa-vien', label: 'Khoa & Viện', color: 'bg-emerald-500' },
      { key: 'phong-ban', label: 'Phòng ban', color: 'bg-[#0072BC]' },
      { key: 'trung-tam', label: 'Trung tâm', color: 'bg-purple-500' },
      { key: 'doan-the', label: 'Đoàn thể', color: 'bg-amber-500' },
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
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* ROW 1: 4 STATS CARDS (Scaled 1.3x) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1 */}
        <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#004776] dark:text-foreground font-mono">
              {stats.total} <span className="text-base font-sans font-bold text-muted-foreground">đơn vị</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">Tổng số website</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">100% thuộc HCM-UTE</div>
          </div>
          <div className="size-14 sm:size-16 rounded-xl bg-blue-50 dark:bg-blue-950/60 p-2.5 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
            <img src={brandConfig.logoUrl} alt="HCM-UTE" className="size-10 sm:size-11 object-contain" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.avgScore}%
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">Đã hoàn thiện</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{stats.passUnits}/{stats.total} website đạt</div>
          </div>
          <div className="size-14 sm:size-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 shrink-0 text-2xl font-black">
            ✓
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0072BC] dark:text-sky-300 font-mono">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">Tổng lượt xem</div>
            <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ 12% so với tuần trước</div>
          </div>
          <div className="size-14 sm:size-16 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#0072BC] dark:text-sky-300 flex items-center justify-center border border-sky-100 dark:border-sky-900 shrink-0 text-2xl">
            👁
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {totalChapters} <span className="text-base font-sans font-bold text-muted-foreground">chương</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">Quản lý tài liệu</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">1,256 mục tài liệu</div>
          </div>
          <div className="size-14 sm:size-16 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900 shrink-0 text-2xl">
            📄
          </div>
        </div>
      </div>

      {/* ROW 2: 2 CHARTS SIDE BY SIDE (Scaled 1.3x) */}
      <AdminOverviewCharts stats={stats} />

      {/* ROW 3: FAST FILTER TABS & SEARCH (Scaled 1.3x) */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800/80">
          {groupFilterTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelectedGroup(t.key)}
              className={`min-h-[46px] px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedGroup === t.key
                  ? 'bg-[#0072BC] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo đơn vị, website, cán bộ phụ trách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[50px] pl-12 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-base text-[#004776] dark:text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground text-base"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedWebType}
              onChange={(e) => setSelectedWebType(e.target.value)}
              className="min-h-[50px] px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-sm sm:text-base font-semibold text-[#004776] dark:text-foreground cursor-pointer"
            >
              <option value="all">Tất cả máy chủ</option>
              <option value="new">Web mới (.189)</option>
              <option value="old">Web cũ (.181)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="min-h-[50px] px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-sm sm:text-base font-semibold text-[#004776] dark:text-foreground cursor-pointer"
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
                className="min-h-[50px] px-5 rounded-xl border border-[#0072BC]/30 bg-blue-50 dark:bg-blue-950/40 text-[#0072BC] dark:text-sky-300 text-sm sm:text-base font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Xem ma trận đầy đủ →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROW 4: ICPC MATRIX TABLE (Full Width) */}
      <ScoreboardMatrix
        units={filteredUnits}
        criteria={criteria}
        onSelectUnit={(u) => setInspectingUnit(u)}
        onUpdateRating={onUpdateRating}
        isAdmin={true}
      />
    </div>
  );
};
