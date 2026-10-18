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
    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-3">
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
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors select-none cursor-pointer ${
                  active
                    ? 'bg-[#0072BC] text-white'
                    : 'bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle with Sleek Monochrome Icons */}
        {viewMode && onViewModeChange && (
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onViewModeChange('matrix')}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300'
                  : 'text-slate-500 hover:text-[#004776] dark:hover:text-slate-200'
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Ma trận</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-sky-300'
                  : 'text-slate-500 hover:text-[#004776] dark:hover:text-slate-200'
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Danh sách</span>
            </button>
          </div>
        )}
      </div>

      {/* Row 2: Search Input & Dropdowns */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên khoa, viện, tên miền (fit, feee...), cán bộ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-h-[40px] pl-10 pr-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm text-[#004776] dark:text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-[#0072BC] focus:border-[#0072BC] outline-hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
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
            onChange={(e) => onWebTypeChange(e.target.value)}
            className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm font-medium text-slate-700 dark:text-foreground cursor-pointer"
          >
            <option value="all">Tất cả máy chủ</option>
            <option value="new">Web mới (.189)</option>
            <option value="old">Web cũ (.181)</option>
          </select>

          <select
            value={selectedStaff}
            onChange={(e) => onStaffChange(e.target.value)}
            className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm font-medium text-slate-700 dark:text-foreground cursor-pointer"
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
              className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
