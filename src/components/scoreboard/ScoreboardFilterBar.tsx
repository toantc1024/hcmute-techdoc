'use client';

import React from 'react';

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

  const staffList = ['Phi', 'Cal', 'Nhân', 'Chị Ngân'];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-3">
      {/* Row 1: Fast Filter Pills by Department Group + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {groups.map((g) => {
            const active = selectedGroup === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => onGroupChange(g.key)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
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

        {/* View Mode Toggle */}
        {viewMode && onViewModeChange && (
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onViewModeChange('matrix')}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 hover:text-[#004776] dark:hover:text-slate-200'
              }`}
            >
              <span>▦</span>
              <span>Ma trận ICPC</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 hover:text-[#004776] dark:hover:text-slate-200'
              }`}
            >
              <span>☰</span>
              <span>Danh sách</span>
            </button>
          </div>
        )}
      </div>

      {/* Row 2: Search Input & Dropdowns (min-h-[44px] touch target) */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground text-xs">
            <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên khoa, viện, tên miền (fit, feee...), cán bộ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-sm text-[#004776] dark:text-foreground placeholder:text-muted-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] outline-hidden transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWebType}
            onChange={(e) => onWebTypeChange(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm font-semibold text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-hidden transition-all cursor-pointer"
          >
            <option value="all">Tất cả máy chủ</option>
            <option value="new">Web mới (.189)</option>
            <option value="old">Web cũ (.181)</option>
          </select>

          <select
            value={selectedStaff}
            onChange={(e) => onStaffChange(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm font-semibold text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-hidden transition-all cursor-pointer"
          >
            <option value="all">Tất cả cán bộ</option>
            {staffList.map((s) => (
              <option key={s} value={s}>
                Cán bộ: {s}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-[#004776] dark:text-sky-300 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>↻</span>
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
