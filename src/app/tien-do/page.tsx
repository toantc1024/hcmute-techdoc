'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { UnitWebsiteItem, EvaluationCriterion } from '@/models/admin.model';
import { techdocsDbService } from '@/services/techdocs-db.service';
import { brandConfig } from '@/configs/app.config';
import { ScoreboardMatrix } from '@/components/scoreboard/ScoreboardMatrix';
import { ScoreboardFilterBar } from '@/components/scoreboard/ScoreboardFilterBar';

export default function TienDoPage() {
  const initial = techdocsDbService.getInstantData();
  const [units, setUnits] = useState<UnitWebsiteItem[]>(initial.units);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(initial.criteria);
  const [isLoading, setIsLoading] = useState(!initial.fromDatabase && initial.units.length === 0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedWebType, setSelectedWebType] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<UnitWebsiteItem | null>(null);

  useEffect(() => {
    async function load() {
      const data = await techdocsDbService.fetchDashboardData();
      setUnits(data.units);
      setCriteria(data.criteria);
      setIsLoading(false);
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const total = units.length;
    const newWebCount = units.filter((u) => u.isNewWeb).length;
    const avgScore = Math.round(units.reduce((acc, u) => acc + u.completenessScore, 0) / (total || 1));
    const passTotal = units.reduce(
      (sum, u) => sum + Object.values(u.criteriaRatings || {}).filter((r) => r === 'pass').length,
      0
    );
    return { total, newWebCount, avgScore, passTotal };
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

  const hasActiveFilters = Boolean(
    searchTerm || selectedStaff !== 'all' || selectedGroup !== 'all' || selectedWebType !== 'all'
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Banner tiêu đề phong cách ICPC Competition Board */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#0072BC] dark:text-sky-300 text-xs font-bold">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0072BC] opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-[#0072BC]"></span>
                </span>
                <span>GIÁM SÁT TIẾN ĐỘ THỜI GIAN THỰC · HCM-UTE TECH DOC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#004776] dark:text-foreground tracking-tight">
                Bảng Tiến Độ Cập Nhật 51 Website Khoa / Viện / Đơn Vị
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Theo dõi trực quan độ hoàn thiện 7 tiêu chuẩn kỹ thuật cốt lõi. Dữ liệu được cập nhật liên tục từ hệ thống đánh giá Nhà trường.
              </p>
            </div>

            {/* Quick KPI Badge */}
            <div className="flex sm:flex-row flex-col gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-center min-w-[120px]">
                <div className="text-2xl font-black text-[#0072BC] dark:text-sky-300 font-mono">
                  {stats.avgScore}%
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  Độ hoàn thiện TB
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center min-w-[120px]">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {stats.newWebCount}/51
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  Đã trỏ IP mới .189
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc & Tìm kiếm */}
        <ScoreboardFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          selectedWebType={selectedWebType}
          onWebTypeChange={setSelectedWebType}
          selectedStaff={selectedStaff}
          onStaffChange={setSelectedStaff}
          onReset={() => {
            setSearchTerm('');
            setSelectedStaff('all');
            setSelectedGroup('all');
            setSelectedWebType('all');
          }}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Nội dung bảng Scoreboard */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <div className="animate-spin size-8 border-3 border-[#0072BC] border-t-transparent rounded-full" />
            <p className="text-xs font-semibold text-muted-foreground">Đang tải bảng tiến độ thời gian thực...</p>
          </div>
        ) : (
          <ScoreboardMatrix
            units={filteredUnits}
            criteria={criteria}
            onSelectUnit={(u) => setSelectedUnit(u)}
            isAdmin={false}
          />
        )}

        {/* Modal chi tiết đơn vị khi bấm xem */}
        {selectedUnit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSelectedUnit(null)}
          >
            <div
              className="w-full max-w-lg bg-white dark:bg-[#132238] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-border/80 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-[#004776] dark:text-foreground">
                    {selectedUnit.name}
                  </h3>
                  <a
                    href={`https://${selectedUnit.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#0072BC] dark:text-sky-400 hover:underline font-mono"
                  >
                    https://{selectedUnit.domain} ↗
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUnit(null)}
                  className="size-8 rounded-xl border border-border flex items-center justify-center text-xs font-bold hover:bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border">
                  <div className="text-muted-foreground">Khối đơn vị</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedUnit.groupLabel}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border">
                  <div className="text-muted-foreground">Cán bộ phụ trách</div>
                  <div className="font-bold text-foreground mt-0.5">{selectedUnit.staff}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border">
                  <div className="text-muted-foreground">Trạng thái máy chủ</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {selectedUnit.isNewWeb ? 'IP Mới .189' : 'IP Cũ .181'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border">
                  <div className="text-muted-foreground">Độ hoàn thiện</div>
                  <div className="font-black text-[#0072BC] dark:text-sky-400 font-mono mt-0.5 text-sm">
                    {selectedUnit.completenessScore}%
                  </div>
                </div>
              </div>

              {/* Danh sách 7 tiêu chuẩn */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Trạng thái 7 tiêu chuẩn:
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {criteria.map((c) => {
                    const rating = selectedUnit.criteriaRatings[c.id || c.code];
                    const note = selectedUnit.criteriaNotes?.[c.id || c.code];
                    return (
                      <div
                        key={c.code}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-border text-xs"
                      >
                        <span className="font-medium truncate max-w-[240px]">
                          {c.code}: {c.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {note && <span className="text-[10px] text-muted-foreground italic truncate max-w-[100px]" title={note}>{note}</span>}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rating === 'pass'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : rating === 'warning'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {rating === 'pass' ? 'ĐẠT' : rating === 'warning' ? 'CẦN SỬA' : 'CHƯA ĐẠT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedUnit.notes && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Ghi chú đơn vị:</strong> {selectedUnit.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
