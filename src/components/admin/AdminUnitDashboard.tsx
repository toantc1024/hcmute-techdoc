'use client';

import React, { useState, useMemo } from 'react';
import {
  UnitWebsiteItem,
  EvaluationCriterion,
  CriterionRating,
} from '@/models/admin.model';
import { AdminUnitEvaluationView } from './AdminUnitEvaluationView';

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
  const [inspectingUnit, setInspectingUnit] = useState<UnitWebsiteItem | null>(null);

  const stats = useMemo(() => {
    const total = units.length;
    const newWebCount = units.filter((u) => u.isNewWeb).length;
    const oldWebCount = units.filter((u) => !u.isNewWeb && !u.notes?.includes('404')).length;
    const avgCompleteness = Math.round(
      units.reduce((acc, u) => acc + u.completenessScore, 0) / (total || 1)
    );
    return { total, newWebCount, oldWebCount, avgCompleteness };
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (selectedStaff !== 'all' && u.staff !== selectedStaff) return false;
      if (selectedGroup !== 'all' && u.group !== selectedGroup) return false;
      if (selectedWebType === 'new' && !u.isNewWeb) return false;
      if (selectedWebType === 'old' && u.isNewWeb) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.domain.toLowerCase().includes(term) ||
        u.staff.toLowerCase().includes(term)
      );
    });
  }, [units, selectedStaff, selectedGroup, selectedWebType, searchTerm]);

  const staffList = ['Phi', 'Cal', 'Nhân', 'Ngân'];
  const groupList = [
    { key: 'all', label: 'Tất cả 4 khối' },
    { key: 'khoa-vien', label: 'Khoa/Viện (15)' },
    { key: 'phong-ban', label: 'Phòng ban (16)' },
    { key: 'trung-tam', label: 'Trung tâm (13)' },
    { key: 'doan-the', label: 'Đoàn thể (7)' },
  ];

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
          if (found) {
            setInspectingUnit(found);
          }
        }}
        onUpdateNote={(unitId, critId, note) => {
          if (onUpdateNote) {
            onUpdateNote(unitId, critId, note);
          }
          if (inspectingUnit && inspectingUnit.id === unitId) {
            setInspectingUnit((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                criteriaNotes: { ...(prev.criteriaNotes || {}), [critId]: note }
              };
            });
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Tổng số website</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#004776] dark:text-foreground mt-1">
            {stats.total} đơn vị
          </div>
          <div className="text-xs text-muted-foreground mt-1">100% thuộc HCM-UTE</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs">
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Đã trỏ web mới (.189)</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {stats.newWebCount} <span className="text-xs font-normal">({Math.round((stats.newWebCount / stats.total) * 100)}%)</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Giao diện chuẩn</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-xs">
          <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">Tạm duy trì web cũ (.181)</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400 mt-1">
            {stats.oldWebCount} <span className="text-xs font-normal">({Math.round((stats.oldWebCount / stats.total) * 100)}%)</span>
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">Chuẩn bị chuyển dữ liệu</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Độ hoàn thiện trung bình</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#0072BC] dark:text-sky-400 mt-1">
            {stats.avgCompleteness}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">7 tiêu chuẩn cốt lõi</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Tìm theo tên đơn vị, tên miền hoặc cán bộ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/30"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="min-h-[44px] px-3 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/30"
            >
              <option value="all">Tất cả cán bộ phụ trách</option>
              {staffList.map((s) => (
                <option key={s} value={s}>Cán bộ: {s}</option>
              ))}
            </select>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="min-h-[44px] px-3 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/30"
            >
              {groupList.map((g) => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>

            <select
              value={selectedWebType}
              onChange={(e) => setSelectedWebType(e.target.value)}
              className="min-h-[44px] px-3 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/30"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Web mới (.189)</option>
              <option value="old">Web cũ (.181)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#004776] dark:text-foreground">
            Bảng ma trận đánh giá 51 website ({filteredUnits.length} đơn vị)
          </h2>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Bấm vào hàng để xem và điều chỉnh điểm tiêu chí
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs font-semibold text-muted-foreground">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-4">Tên đơn vị & Tên miền</th>
                <th className="py-3 px-3 w-24">Cán bộ</th>
                <th className="py-3 px-3 w-32">Trạng thái</th>
                <th className="py-3 px-4 w-40">Độ hoàn thiện</th>
                <th className="py-3 px-4 w-28 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {filteredUnits.map((u) => {
                const scoreColor =
                  u.completenessScore >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : u.completenessScore >= 50
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400';

                const barBg =
                  u.completenessScore >= 80
                    ? 'bg-emerald-500'
                    : u.completenessScore >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500';

                return (
                  <tr
                    key={u.id}
                    onClick={() => setInspectingUnit(u)}
                    className="hover:bg-muted/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3 text-center font-mono text-xs text-muted-foreground">
                      {u.stt}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-sm text-[#004776] dark:text-foreground">
                          {u.name}
                        </div>
                        <div className="text-xs font-mono text-[#0072BC] dark:text-sky-400">
                          {u.domain} <span className="text-muted-foreground font-sans">({u.groupLabel})</span>
                        </div>
                        {u.notes && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {u.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-[#004776] dark:text-foreground">
                      {u.staff}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.isNewWeb
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {u.isNewWeb ? 'Web mới (.189)' : 'Web cũ (.181)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold font-mono">
                          <span className={scoreColor}>{u.completenessScore}%</span>
                          <span className="text-[10px] text-muted-foreground font-sans font-normal">
                            {u.completenessScore >= 80 ? 'Tốt' : u.completenessScore >= 50 ? 'Cần sửa' : 'Chưa đạt'}
                          </span>
                        </div>
                        <div className="w-full bg-muted/80 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${barBg}`}
                            style={{ width: `${u.completenessScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingUnit(u);
                        }}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-[#0072BC] hover:bg-muted transition-colors"
                      >
                        Đánh giá
                      </button>
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
