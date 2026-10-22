'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SystemIssueItem, IssueStatus, IssuePriority } from '@/models/admin.model';

interface AdminIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Partial<SystemIssueItem> & { content: string }) => Promise<void>;
  editingIssue?: SystemIssueItem | null;
  onViewImage: (url: string) => void;
  nextStt: number;
}

export const AdminIssueModal: React.FC<AdminIssueModalProps> = ({
  isOpen, onClose, onSave, editingIssue, onViewImage, nextStt,
}) => {
  const [stt, setStt] = useState<number>(nextStt);
  const [status, setStatus] = useState<IssueStatus>('dang_xu_ly');
  const [priority, setPriority] = useState<IssuePriority>(2);
  const [content, setContent] = useState('');
  const [solutionPlan, setSolutionPlan] = useState('');
  const [notes, setNotes] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteTip, setPasteTip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIssue) {
      setStt(editingIssue.stt);
      setStatus(editingIssue.status);
      setPriority(editingIssue.priority);
      setContent(editingIssue.content);
      setSolutionPlan(editingIssue.solutionPlan || '');
      setNotes(editingIssue.notes || '');
      setReporterName(editingIssue.reporterName || '');
      setImages(editingIssue.images || []);
    } else {
      setStt(nextStt);
      setStatus('dang_xu_ly');
      setPriority(2);
      setContent('');
      setSolutionPlan('');
      setNotes('');
      setReporterName('');
      setImages([]);
    }
  }, [editingIssue, nextStt, isOpen]);

  const handleProcessImageFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          setPasteTip(true);
          setTimeout(() => setPasteTip(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent | ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      handleProcessImageFiles(imageFiles);
    }
  }, [handleProcessImageFiles]);

  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalPaste = (e: ClipboardEvent) => handlePaste(e);
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isOpen, handlePaste]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        id: editingIssue?.id,
        stt: Number(stt) || nextStt,
        status,
        priority,
        content: content.trim(),
        solutionPlan: solutionPlan.trim(),
        notes: notes.trim(),
        reporterName: reporterName.trim(),
        images,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#132238] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#0072BC]" />
              {editingIssue ? `Chỉnh sửa lỗi hệ thống (STT #${editingIssue.stt})` : 'Ghi chú lỗi hệ thống mới'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Hỗ trợ dán ảnh nhanh bằng phím Ctrl + V / Cmd + V</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">STT</label>
              <input type="number" min={1} value={stt} onChange={(e) => setStt(Number(e.target.value))} className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trạng thái xử lý</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)} className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium">
                <option value="dang_xu_ly">🟡 Đang xử lý</option>
                <option value="da_xu_ly">🟢 Đã xử lý</option>
                <option value="khong_xu_ly">⚪ Không xử lý</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mức độ ưu tiên</label>
              <select value={priority} onChange={(e) => setPriority(Number(e.target.value) as IssuePriority)} className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium">
                <option value={1}>🔴 Cấp độ 1 (Khẩn cấp / Cao)</option>
                <option value={2}>🟡 Cấp độ 2 (Trung bình)</option>
                <option value={3}>🔵 Cấp độ 3 (Thấp)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nội dung lỗi <span className="text-red-500">*</span></label>
              {pasteTip && <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">✓ Đã dán 1 ảnh chụp màn hình!</span>}
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả cụ thể vị trí, hiện tượng lỗi gặp phải..."
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
              required
            />
          </div>

          {/* Quick Paste & Image Attach Area */}
          <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <svg className="size-4 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Ảnh minh họa (Chụp &amp; nhấn <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded font-mono font-bold">Ctrl+V</kbd> để dán ảnh nhanh)
              </span>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-[#0072BC] hover:underline font-medium cursor-pointer">
                + Chọn từ máy
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleProcessImageFiles(e.target.files)} />
            </div>

            {images.length === 0 ? (
              <div onClick={() => fileInputRef.current?.click()} className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors">
                <p className="text-xs text-slate-500">Chụp màn hình rồi nhấn <b>Ctrl + V</b> hoặc bấm vào đây để tải ảnh</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group size-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100">
                    <img src={img} alt={`Lỗi ${idx + 1}`} className="size-full object-cover cursor-pointer" onClick={() => onViewImage(img)} />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 size-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phương án chỉnh sửa (PA Chỉnh sửa)</label>
            <textarea
              rows={2}
              value={solutionPlan}
              onChange={(e) => setSolutionPlan(e.target.value)}
              placeholder="Hướng khắc phục, phân bổ cán bộ, thay đổi cấu hình hoặc code..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Note (Ghi chú thêm)</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tiến độ, deadline, ghi chú nội bộ..." className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Người ghi chú / Phụ trách</label>
              <input type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Tên hoặc bộ phận phụ trách" className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0072BC] hover:bg-[#005a96] text-white flex items-center gap-1.5 shadow-xs cursor-pointer">
              {isSubmitting && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {editingIssue ? 'Cập nhật ghi chú' : 'Lưu ghi chú lỗi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
