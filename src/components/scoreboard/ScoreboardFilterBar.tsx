'use client';

import React from 'react';
import { UnitGroupType } from '@/models/admin.model';

interface ScoreboardFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedGroup: string;
  onGroupChange: (val: string) => void;
  selectedWebType: string;
  onWebTypeChange: (val: string) => void;
  selectedStaff: string;
  onStaffChange: (val: string) => void;
  viewMode?: 'matrix' | 'cards';
  onViewModeChange?: (mode: 'matrix' | 'cards') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const ScoreboardFilterBar: React.FC<ScoreboardFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  selectedWebType,
  onWebTypeChange,
  selectedStaff,
  onStaffChange,
  viewMode,
  onViewModeChange,
  onReset,
  hasActiveFilters,
}) => {
  const groups: { key: string; label: string }[] = [
    { key: 'all', label: 'Tất cả (51)' },
    { key: 'khoa-vien', label: 'Khoa & Viện (15)' },
    { key: 'phong-ban', label: 'Phòng ban (16)' },
    { key: 'trung-tam', label: 'Trung tâm (13)' },
    { key: 'doan-the', label: 'Đoàn thể (7)' },
  ];

  return (
    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-3">
      {/* Hàng 1: Tabs lọc nhanh theo Khối đơn vị */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {groups.map((g) => {
            const active = selectedGroup === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => onGroupChange(g.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#0072BC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Chuyển chế độ xem nếu có */}
        {viewMode && onViewModeChange && (
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onViewModeChange('matrix')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ▦ Ma trận ICPC
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ☰ Danh sách
            </button>
          </div>
        )}
      </div>

      {/* Hàng 2: Tìm kiếm & Lọc bổ sung */}
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên khoa, viện, tên miền (fit, feee...), người phụ trách..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWebType}
            onChange={(e) => onWebTypeChange(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-xs font-semibold text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-none"
          >
            <option value="all">Tất cả trạng thái IP</option>
            <option value="new">Web mới (.189)</option>
            <option value="old">Web cũ (.181)</option>
          </select>

          <select
            value={selectedStaff}
            onChange={(e) => onStaffChange(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-xs font-semibold text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-none"
          >
            <option value="all">Tất cả cán bộ</option>
            {['Phi', 'Cal', 'Nhân', 'Ngân'].map((s) => (
              <option key={s} value={s}>
                Cán bộ: {s}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-50 text-xs font-bold text-muted-foreground hover:text-[#0072BC] transition-colors"
            >
              ↻ Đặt lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
