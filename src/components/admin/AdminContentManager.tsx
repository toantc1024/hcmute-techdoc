'use client';

import React, { useState, useMemo } from 'react';
import { DocSectionItem, LuongType } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';
import { AdminEditSectionModal } from './AdminEditSectionModal';

interface AdminContentManagerProps {
  sections: DocSectionItem[];
  onToggleVisibility: (id: string) => void;
  onUpdateSection: (updated: DocSectionItem) => void;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({
  sections,
  onToggleVisibility,
  onUpdateSection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLuong, setSelectedLuong] = useState<string>('all');
  const [editingSection, setEditingSection] = useState<DocSectionItem | null>(null);

  const filteredSections = useMemo(() => {
    return sections.filter((item) => {
      const matchLuong = selectedLuong === 'all' || item.luong === selectedLuong;
      if (!matchLuong) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.chapterTitle.toLowerCase().includes(term) ||
        item.pageTitle.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [sections, selectedLuong, searchTerm]);

  const luongOptions = [
    { key: 'all', label: 'Tất cả phần' },
    { key: 'A', label: 'Luồng A: Trang tĩnh' },
    { key: 'B', label: 'Luồng B: Tin & PDF' },
    { key: 'C', label: 'Luồng C: Menu & Chân trang' },
    { key: 'TONG_QUAN', label: 'Tổng quan & Khởi động' },
    { key: 'HE_THONG', label: 'Hệ thống & Tiện ích' },
  ];

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm chương, tiêu đề hoặc từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[40px] pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs sm:text-sm text-[#004776] dark:text-foreground focus:ring-1 focus:ring-[#0072BC] focus:border-[#0072BC] outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {luongOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedLuong(opt.key)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  selectedLuong === opt.key
                    ? 'border-[#0072BC] bg-[#0072BC] text-white shadow-2xs font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Table */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 p-1 border border-slate-200/90 dark:border-slate-800 shrink-0 flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-6 object-contain" />
            </div>
            <h2 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
              Danh mục cấu trúc tài liệu ({filteredSections.length} mục)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Ẩn / Hiện mục trên giao diện người dùng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3.5 w-12 text-center">STT</th>
                <th className="py-2.5 px-3.5">Chương &amp; Tiêu đề</th>
                <th className="py-2.5 px-3.5 w-32">Phân luồng</th>
                <th className="py-2.5 px-3.5 w-24 text-center">Lượt xem</th>
                <th className="py-2.5 px-3.5 w-28 text-center">Hiển thị</th>
                <th className="py-2.5 px-3.5 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
              {filteredSections.map((sec, idx) => (
                <tr
                  key={sec.id}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    !sec.isVisible ? 'bg-amber-50/20 opacity-85' : ''
                  }`}
                >
                  <td className="py-2.5 sm:py-3 px-3.5 text-center font-mono text-xs text-slate-500 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 sm:py-3 px-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#0072BC] dark:text-sky-400 uppercase tracking-wide">
                          Chương {sec.chapterNumber}: {sec.chapterTitle}
                        </span>
                        {!sec.isVisible && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-sm text-[#004776] dark:text-foreground">
                        {sec.pageTitle}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {sec.summary}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {sec.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                      {sec.luong === 'TONG_QUAN'
                        ? 'Tổng quan'
                        : sec.luong === 'HE_THONG'
                        ? 'Hệ thống'
                        : `Luồng ${sec.luong}`}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3.5 text-center font-mono font-bold text-xs sm:text-sm tabular-nums text-[#004776] dark:text-foreground">
                    {sec.viewCount.toLocaleString()}
                  </td>
                  <td className="py-2.5 sm:py-3 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(sec.id)}
                      className={`min-h-[30px] inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                        sec.isVisible
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      <span className={`size-1.5 rounded-full mr-1.5 ${sec.isVisible ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                      {sec.isVisible ? 'Hiển thị' : 'Tạm ẩn'}
                    </button>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingSection(sec)}
                      className="min-h-[30px] px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-background hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-medium text-[#004776] dark:text-sky-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Sửa</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Section Modal */}
      <AdminEditSectionModal
        section={editingSection}
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        onSave={onUpdateSection}
      />
    </div>
  );
};
