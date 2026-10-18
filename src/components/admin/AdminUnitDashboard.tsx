'use client';

import React, { useState, useMemo } from 'react';
import { UnitWebsiteItem, EvaluationCriterion, CriterionRating } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';
import { AdminUnitEvaluationView } from './AdminUnitEvaluationView';
import { ScoreboardMatrix } from '@/components/scoreboard/ScoreboardMatrix';
import { ScoreboardFilterBar } from '@/components/scoreboard/ScoreboardFilterBar';

interface AdminUnitDashboardProps {
  units: UnitWebsiteItem[];
  criteria: EvaluationCriterion[];
  onUpdateRating: (unitId: number, criterionId: string, rating: CriterionRating) => void;
  onUpdateNote?: (unitId: number, criterionId: string, note: string) => void;
  onToggleServerStatus?: (unitId: number) => void;
}

export const AdminUnitDashboard: React.FC<AdminUnitDashboardProps> = ({
  units,
  criteria,
  onUpdateRating,
  onUpdateNote,
  onToggleServerStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedWebType, setSelectedWebType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [inspectingUnit, setInspectingUnit] = useState<UnitWebsiteItem | null>(null);

  const stats = useMemo(() => {
    const total = units.length;
    const newWebCount = units.filter((u) => u.isNewWeb).length;
    const oldWebCount = units.filter((u) => !u.isNewWeb && !u.notes?.includes('404')).length;
    const avgScore = Math.round(units.reduce((acc, u) => acc + u.completenessScore, 0) / (total || 1));
    return { total, newWebCount, oldWebCount, avgScore };
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (selectedStaff !== 'all' && u.staff !== selectedStaff) return false;
      if (selectedGroup !== 'all' && u.group !== selectedGroup) return false;
      if (selectedWebType === 'new' && !u.isNewWeb) return false;
      if (selectedWebType === 'old' && u.isNewWeb) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.domain.toLowerCase().includes(term) || u.staff.toLowerCase().includes(term);
    });
  }, [units, selectedStaff, selectedGroup, selectedWebType, searchTerm]);

  const hasActiveFilters = Boolean(
    searchTerm || selectedStaff !== 'all' || selectedGroup !== 'all' || selectedWebType !== 'all'
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStaff('all');
    setSelectedGroup('all');
    setSelectedWebType('all');
  };

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
        onUpdateNote={(unitId, critId, note) => {
          if (onUpdateNote) onUpdateNote(unitId, critId, note);
          if (inspectingUnit && inspectingUnit.id === unitId) {
            setInspectingUnit((prev) => (!prev ? null : {
              ...prev,
              criteriaNotes: { ...(prev.criteriaNotes || {}), [critId]: note }
            }));
          }
        }}
        onToggleServerStatus={(id) => {
          if (onToggleServerStatus) onToggleServerStatus(id);
          const found = units.find((x) => x.id === id);
          if (found) setInspectingUnit({ ...found, isNewWeb: !found.isNewWeb });
        }}
      />
    );
  }

  const kpis = [
    { key: 'all', title: 'Tổng số website', value: `${stats.total} đơn vị`, sub: '100% thuộc HCM-UTE', icon: <img src={brandConfig.logoUrl} alt="HCM-UTE" className="size-4 object-contain" />, activeBorder: 'border-[#0072BC]', isSelected: selectedWebType === 'all' },
    { key: 'new', title: 'Đã trỏ web mới (.189)', value: `${stats.newWebCount} (${Math.round((stats.newWebCount / stats.total) * 100)}%)`, sub: 'Giao diện chuẩn mới', icon: <svg className="size-4 text-emerald-700 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>, activeBorder: 'border-emerald-600', isSelected: selectedWebType === 'new' },
    { key: 'old', title: 'Tạm duy trì web cũ (.181)', value: `${stats.oldWebCount} (${Math.round((stats.oldWebCount / stats.total) * 100)}%)`, sub: 'Chờ chuyển dữ liệu', icon: <svg className="size-4 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, activeBorder: 'border-amber-600', isSelected: selectedWebType === 'old' },
    { key: 'score', title: 'Độ hoàn thiện trung bình', value: `${stats.avgScore}%`, sub: '7 tiêu chuẩn cốt lõi', icon: <svg className="size-4 text-[#0072BC] dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, activeBorder: 'border-[#0072BC]', isSelected: false },
  ];

  return (
    <div className="w-full space-y-5">
      {/* 4 KPI Cards - Tinh gọn, icon tối giản */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((k) => (
          <div
            key={k.title}
            onClick={() => k.key !== 'score' && setSelectedWebType(k.key === selectedWebType ? 'all' : k.key)}
            className={`p-4 sm:p-5 rounded-xl border bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors ${
              k.key !== 'score' ? 'cursor-pointer hover:border-slate-300' : ''
            } ${k.isSelected ? `border-2 ${k.activeBorder}` : 'border-slate-200/80 dark:border-slate-800'}`}
          >
            <div className="flex items-center justify-between text-[14px] sm:text-[15px] font-semibold text-slate-700 dark:text-slate-300">
              <span>{k.title}</span>
              <span className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center size-8 shrink-0">{k.icon}</span>
            </div>
            <div className="text-[28px] sm:text-[32px] font-[650] font-mono tabular-nums text-[#004776] dark:text-foreground mt-2">
              {k.value}
            </div>
            <div className="text-[11px] sm:text-[12px] text-muted-foreground font-medium mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar with Matrix Toggle */}
      <ScoreboardFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        selectedWebType={selectedWebType}
        onWebTypeChange={setSelectedWebType}
        selectedStaff={selectedStaff}
        onStaffChange={setSelectedStaff}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Scoreboard: Matrix or Detailed Table */}
      {viewMode === 'matrix' ? (
        <ScoreboardMatrix
          units={filteredUnits}
          criteria={criteria}
          onSelectUnit={(u) => setInspectingUnit(u)}
          onUpdateRating={onUpdateRating}
          onToggleServerStatus={onToggleServerStatus}
          isAdmin={true}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
            <h2 className="text-xs sm:text-sm font-bold text-[#004776] dark:text-foreground flex items-center gap-2">
              <span>Danh sách chi tiết 51 website</span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100/80 text-[#004776] dark:bg-blue-950 dark:text-sky-300">
                {filteredUnits.length} đơn vị
              </span>
            </h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">Bấm hàng để thẩm định 7 tiêu chuẩn</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 text-center w-12">STT</th>
                  <th className="py-2.5 px-4">Đơn vị &amp; Tên miền</th>
                  <th className="py-2.5 px-3 w-28">Cán bộ</th>
                  <th className="py-2.5 px-3 w-36">Trạng thái</th>
                  <th className="py-2.5 px-4 w-40">Độ hoàn thiện</th>
                  <th className="py-2.5 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                {filteredUnits.map((u) => {
                  const scoreColor = u.completenessScore >= 80 ? 'text-emerald-700' : u.completenessScore >= 50 ? 'text-amber-700' : 'text-rose-700';
                  const barBg = u.completenessScore >= 80 ? 'bg-emerald-500/80' : u.completenessScore >= 50 ? 'bg-amber-500/80' : 'bg-rose-500/80';
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setInspectingUnit(u)}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center font-mono text-xs text-muted-foreground">{u.stt}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0072BC] dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                            {u.stt}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#004776] dark:text-foreground">{u.name}</div>
                            <div className="text-xs font-mono text-[#0072BC] dark:text-sky-400">
                              {u.domain} <span className="text-muted-foreground font-sans">({u.groupLabel})</span>
                            </div>
                            {u.notes && <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{u.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {u.staff}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {onToggleServerStatus ? (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onToggleServerStatus(u.id); }}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                              u.isNewWeb ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                            title="Bấm chuyển máy chủ (.189 ⇄ .181)"
                          >
                            <span className={`size-1.5 rounded-full ${u.isNewWeb ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                            <span>{u.isNewWeb ? '.189 Mới' : '.181 Cũ'}</span>
                            <span className="opacity-60 text-[10px]">⇄</span>
                          </button>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
                            u.isNewWeb ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' : 'bg-amber-50 text-amber-800 border-amber-200/80'
                          }`}>
                            <span className={`size-1.5 rounded-full ${u.isNewWeb ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span>{u.isNewWeb ? 'Web mới (.189)' : 'Web cũ (.181)'}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold font-mono">
                            <span className={scoreColor}>{u.completenessScore}%</span>
                            <span className="text-[10px] text-muted-foreground font-sans font-normal">
                              {u.completenessScore >= 80 ? 'Tốt' : u.completenessScore >= 50 ? 'Cần sửa' : 'Chưa đạt'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${barBg}`} style={{ width: `${u.completenessScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setInspectingUnit(u); }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#0072BC] text-[#0072BC] dark:text-sky-300 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          Chấm điểm →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
