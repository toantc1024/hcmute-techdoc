'use client';

import React, { useState, useMemo } from 'react';
import { DocSectionItem, LuongType } from '@/models/admin.model';
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
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
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
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {luongOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedLuong(opt.key)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap border transition-all ${
                  selectedLuong === opt.key
                    ? 'border-[#0072BC] bg-[#0072BC] text-white shadow-xs'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-[#004776]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Table / Cards */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#004776] dark:text-foreground">
              Danh mục cấu trúc tài liệu ({filteredSections.length} mục)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Bấm nút công tắc để Ẩn / Hiện mục trên giao diện người dùng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs font-semibold text-muted-foreground">
                <th className="py-3 px-4 w-14 text-center">STT</th>
                <th className="py-3 px-4">Chương & Tiêu đề</th>
                <th className="py-3 px-4 w-32">Phân luồng</th>
                <th className="py-3 px-4 w-28 text-center">Lượt xem</th>
                <th className="py-3 px-4 w-36 text-center">Hiển thị</th>
                <th className="py-3 px-4 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {filteredSections.map((sec, idx) => (
                <tr
                  key={sec.id}
                  className={`hover:bg-muted/20 transition-colors ${
                    !sec.isVisible ? 'bg-amber-500/5 opacity-80' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-center font-mono text-xs text-muted-foreground">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0072BC] dark:text-sky-400">
                          Chương {sec.chapterNumber}: {sec.chapterTitle}
                        </span>
                        {!sec.isVisible && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Đã tạm ẩn
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-[#004776] dark:text-foreground">
                        {sec.pageTitle}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {sec.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sec.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                      {sec.luong === 'TONG_QUAN'
                        ? 'Tổng quan'
                        : sec.luong === 'HE_THONG'
                        ? 'Hệ thống'
                        : `Luồng ${sec.luong}`}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#004776] dark:text-foreground">
                    {sec.viewCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(sec.id)}
                      className={`min-h-[44px] inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        sec.isVisible
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      <span className={`size-2 rounded-full mr-2 ${sec.isVisible ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {sec.isVisible ? 'Hiển thị' : 'Tạm ẩn'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingSection(sec)}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-[#004776] dark:text-sky-300 transition-colors"
                    >
                      Chỉnh sửa
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
