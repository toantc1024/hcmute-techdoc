'use client';

import React, { useState, useEffect } from 'react';
import { DocSectionItem, LuongType } from '@/models/admin.model';

interface AdminEditSectionModalProps {
  section: DocSectionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: DocSectionItem) => void;
}

export const AdminEditSectionModal: React.FC<AdminEditSectionModalProps> = ({
  section,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<DocSectionItem | null>(null);

  useEffect(() => {
    if (section) {
      setFormData({ ...section });
    }
  }, [section]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div>
            <span className="text-xs font-semibold text-[#0072BC] dark:text-sky-400 uppercase tracking-wider">
              Chương {formData.chapterNumber}
            </span>
            <h3 className="text-lg font-bold text-[#004776] dark:text-foreground">
              Chỉnh sửa thông tin tài liệu
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#004776] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
              Tiêu đề chương / phần
            </label>
            <input
              type="text"
              required
              value={formData.chapterTitle}
              onChange={(e) => setFormData({ ...formData, chapterTitle: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
              Tiêu đề trang bài viết
            </label>
            <input
              type="text"
              required
              value={formData.pageTitle}
              onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
                Luồng áp dụng
              </label>
              <select
                value={formData.luong}
                onChange={(e) => setFormData({ ...formData, luong: e.target.value as LuongType })}
                className="w-full h-11 px-3 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC]"
              >
                <option value="TONG_QUAN">Tổng quan</option>
                <option value="A">Luồng A (Trang)</option>
                <option value="B">Luồng B (Nội dung & PDF)</option>
                <option value="C">Luồng C (Menu & Footer)</option>
                <option value="HE_THONG">Hệ thống & Tiện ích</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
                Trạng thái hiển thị
              </label>
              <div className="flex items-center h-11 px-3 border border-border rounded-xl bg-background">
                <input
                  type="checkbox"
                  id="modal-visible-toggle"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="size-5 accent-[#0072BC] rounded cursor-pointer"
                />
                <label htmlFor="modal-visible-toggle" className="ml-2.5 text-xs font-medium cursor-pointer text-[#004776] dark:text-foreground">
                  {formData.isVisible ? 'Cho phép người dùng đọc' : 'Ẩn khỏi người dùng (Bảo trì)'}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
              Mô tả tóm tắt nội dung
            </label>
            <textarea
              rows={3}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-3 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
              Thẻ từ khóa (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-xl text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white transition-colors shadow-xs"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
