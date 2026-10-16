'use client';

import React, { useState, useEffect } from 'react';
import { EvaluationCriterion } from '@/models/admin.model';

interface AdminCriterionModalProps {
  criterion: EvaluationCriterion | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<EvaluationCriterion, 'id'>, isEdit: boolean) => void;
}

export const AdminCriterionModal: React.FC<AdminCriterionModalProps> = ({
  criterion,
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState(10);
  const [passCondition, setPassCondition] = useState('');
  const [warningCondition, setWarningCondition] = useState('');
  const [failCondition, setFailCondition] = useState('');

  useEffect(() => {
    if (criterion) {
      setCode(criterion.code);
      setName(criterion.name);
      setDescription(criterion.description);
      setWeight(criterion.weight);
      setPassCondition(criterion.passCondition);
      setWarningCondition(criterion.warningCondition);
      setFailCondition(criterion.failCondition);
    } else {
      setCode(`TC-${String(Date.now()).slice(-2)}`);
      setName('');
      setDescription('');
      setWeight(10);
      setPassCondition('');
      setWarningCondition('');
      setFailCondition('');
    }
  }, [criterion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        code,
        name,
        description,
        weight: Number(weight) || 10,
        passCondition,
        warningCondition,
        failCondition,
        isCustom: criterion?.isCustom ?? true,
      },
      !!criterion
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <h3 className="text-lg font-bold text-[#004776] dark:text-foreground">
            {criterion ? 'Chỉnh sửa tiêu chí đánh giá' : 'Thêm tiêu chí đánh giá mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#004776] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
                Mã tiêu chí
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
                Tên tiêu chí đánh giá
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tối ưu di động & Tốc độ tải"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
                Trọng số (%)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
                Mô tả ngắn tiêu chí
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:ring-2 focus:ring-[#0072BC]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              Điều kiện tích [ĐẠT]
            </label>
            <textarea
              rows={2}
              required
              placeholder="Tiêu chuẩn cần đáp ứng đầy đủ để tính 100% điểm tiêu chí..."
              value={passCondition}
              onChange={(e) => setPassCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-[#004776] dark:text-foreground focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
              Điều kiện tích [CẦN CHỈNH SỬA]
            </label>
            <textarea
              rows={2}
              required
              placeholder="Tồn tại lỗi nhỏ, thiếu sót thông tin phụ cần khắc phục (tính 50% điểm)..."
              value={warningCondition}
              onChange={(e) => setWarningCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-[#004776] dark:text-foreground focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
              Điều kiện tích [KHÔNG ĐẠT] (Fail)
            </label>
            <textarea
              rows={2}
              required
              placeholder="Lỗi nghiêm trọng, trắng trang, bảo mật sai phạm hoặc không hoạt động (0 điểm)..."
              value={failCondition}
              onChange={(e) => setFailCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-sm text-[#004776] dark:text-foreground focus:ring-2 focus:ring-rose-500/30"
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
              {criterion ? 'Cập nhật tiêu chí' : 'Thêm tiêu chí'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
