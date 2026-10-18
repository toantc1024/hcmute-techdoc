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
}

export const AdminUnitDashboard: React.FC<AdminUnitDashboardProps> = ({
  units,
  criteria,
  onUpdateRating,
  onUpdateNote,
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
      />
    );
  }

  const kpis = [
    { key: 'all', title: 'Tổng số website', value: `${stats.total} đơn vị`, sub: '100% thuộc HCM-UTE', icon: <img src={brandConfig.logoUrl} alt="HCM-UTE" className="size-4 object-contain" />, activeBorder: 'border-[#0072BC]', isSelected: selectedWebType === 'all' },
    { key: 'new', title: 'Đã trỏ web mới (.189)', value: `${stats.newWebCount} (${Math.round((stats.newWebCount / stats.total) * 100)}%)`, sub: 'Giao diện chuẩn mới', icon: <span className="text-emerald-600 font-bold">✓</span>, activeBorder: 'border-emerald-500', isSelected: selectedWebType === 'new' },
    { key: 'old', title: 'Tạm duy trì web cũ (.181)', value: `${stats.oldWebCount} (${Math.round((stats.oldWebCount / stats.total) * 100)}%)`, sub: 'Chờ chuyển dữ liệu', icon: <span className="text-amber-600 font-bold">⏱</span>, activeBorder: 'border-amber-500', isSelected: selectedWebType === 'old' },
    { key: 'score', title: 'Độ hoàn thiện trung bình', value: `${stats.avgScore}%`, sub: '7 tiêu chuẩn cốt lõi', icon: <span className="text-[#0072BC] font-bold">📈</span>, activeBorder: 'border-[#0072BC]', isSelected: false },
  ];

  return (
    <div className="space-y-4">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((k) => (
          <div
            key={k.title}
            onClick={() => k.key !== 'score' && setSelectedWebType(k.key === selectedWebType ? 'all' : k.key)}
            className={`p-4 rounded-xl border bg-white dark:bg-[#132238] shadow-xs transition-all ${
              k.key !== 'score' ? 'cursor-pointer hover:border-slate-300' : ''
            } ${k.isSelected ? `border-2 ${k.activeBorder} shadow-sm` : 'border-slate-200 dark:border-slate-800'}`}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>{k.title}</span>
              <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-xs font-bold flex items-center justify-center size-6">{k.icon}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#004776] dark:text-foreground mt-2">
              {k.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</div>
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

      {/* Main Scoreboard: ICPC Matrix or Detailed Table */}
      {viewMode === 'matrix' ? (
        <ScoreboardMatrix
          units={filteredUnits}
          criteria={criteria}
          onSelectUnit={(u) => setInspectingUnit(u)}
          onUpdateRating={onUpdateRating}
          isAdmin={true}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
            <h2 className="text-sm font-bold text-[#004776] dark:text-foreground flex items-center gap-2">
              <span>Danh sách chi tiết 51 website</span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-blue-100 text-[#004776] dark:bg-blue-950/80 dark:text-sky-300">
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
                  <th className="py-2.5 px-4">Đơn vị & Tên miền</th>
                  <th className="py-2.5 px-3 w-28">Cán bộ</th>
                  <th className="py-2.5 px-3 w-36">Trạng thái</th>
                  <th className="py-2.5 px-4 w-40">Độ hoàn thiện</th>
                  <th className="py-2.5 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filteredUnits.map((u) => {
                  const scoreColor = u.completenessScore >= 80 ? 'text-emerald-600' : u.completenessScore >= 50 ? 'text-amber-600' : 'text-rose-600';
                  const barBg = u.completenessScore >= 80 ? 'bg-emerald-500' : u.completenessScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setInspectingUnit(u)}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono text-xs text-muted-foreground">{u.stt}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0072BC] dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
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
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {u.staff}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          u.isNewWeb ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <span className={`size-1.5 rounded-full ${u.isNewWeb ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{u.isNewWeb ? 'Web mới (.189)' : 'Web cũ (.181)'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold font-mono">
                            <span className={scoreColor}>{u.completenessScore}%</span>
                            <span className="text-[10px] text-muted-foreground font-sans font-normal">
                              {u.completenessScore >= 80 ? 'Tốt' : u.completenessScore >= 50 ? 'Cần sửa' : 'Chưa đạt'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${barBg}`} style={{ width: `${u.completenessScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setInspectingUnit(u); }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0072BC] text-[#0072BC] dark:text-sky-300 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
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
