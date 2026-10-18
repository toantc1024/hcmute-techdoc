'use client';

import React, { useState } from 'react';
import { EvaluationCriterion, ProjectPhase } from '@/models/admin.model';
import { brandConfig } from '@/configs/app.config';
import { AdminCriterionModal } from './AdminCriterionModal';

interface AdminProgressManagerProps {
  phases: ProjectPhase[];
  criteria: EvaluationCriterion[];
  onAddCriterion: (data: Omit<EvaluationCriterion, 'id' | 'isCustom'>) => void;
  onUpdateCriterion: (criterion: EvaluationCriterion) => void;
  onDeleteCriterion: (id: string) => void;
}

export const AdminProgressManager: React.FC<AdminProgressManagerProps> = ({
  phases,
  criteria,
  onAddCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<EvaluationCriterion | null>(null);

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + p.completionRate, 0) / (phases.length || 1)
  );

  const handleOpenAdd = () => {
    setEditingCriterion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (criterion: EvaluationCriterion) => {
    setEditingCriterion(criterion);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<EvaluationCriterion, 'id'>, isEdit: boolean) => {
    if (isEdit && editingCriterion) {
      onUpdateCriterion({ ...data, id: editingCriterion.id });
    } else {
      onAddCriterion(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="size-11 sm:size-12 rounded-xl bg-white dark:bg-blue-950/60 p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-8 sm:size-9 object-contain" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#0072BC] dark:text-sky-400 uppercase tracking-wider">
                Kế hoạch tổng thể HCM-UTE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#004776] dark:text-foreground">
                Tiến độ nâng cấp & chuẩn hóa website 51 đơn vị
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tiến độ tích lũy:</span>
            <span className="text-xl font-bold font-mono text-[#004776] dark:text-sky-300">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-muted/80 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0072BC] to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* 3 Roadmap Phases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {phases.map((phase) => (
            <div
              key={phase.phaseId}
              className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                phase.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : phase.status === 'in-progress'
                  ? 'border-[#0072BC]/40 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20 ring-1 ring-[#0072BC]/20'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-muted-foreground">
                  Giai đoạn {phase.phaseId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                    phase.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : phase.status === 'in-progress'
                      ? 'bg-blue-100 text-[#004776] dark:bg-blue-900 dark:text-sky-200 animate-pulse'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {phase.status === 'completed'
                    ? 'Hoàn thành 100%'
                    : phase.status === 'in-progress'
                    ? `Đang thực hiện (${phase.completionRate}%)`
                    : 'Kế hoạch sắp tới'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#004776] dark:text-foreground">
                {phase.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {phase.target}
              </p>
              <div className="text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/60">
                Thời gian: {phase.timeFrame}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Management Section */}
      <div className="p-5 sm:p-6 rounded-xl border border-border bg-card shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground">
                Hệ thống tiêu chí đánh giá ({criteria.length} tiêu chí)
              </h2>
              {totalWeight !== 100 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Tổng tỷ trọng: {totalWeight}% (Khuyến nghị 100%)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bộ tiêu chí chuẩn hóa từ báo cáo rà soát và sổ tay TechDoc. Bạn có thể thêm tiêu chí mới theo yêu cầu nghiệp vụ.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white shadow-xs inline-flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm tiêu chí mới
          </button>
        </div>

        {/* Criteria List */}
        <div className="grid grid-cols-1 gap-3.5">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-border/70 hover:border-[#0072BC]/40 bg-background transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 rounded-md text-xs font-mono font-bold bg-muted text-[#004776] dark:text-sky-300">
                    {c.code}
                  </span>
                  <h3 className="text-sm font-bold text-[#004776] dark:text-foreground">
                    {c.name}
                  </h3>
                  {c.isCustom && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      Tự thêm
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#004776] dark:bg-blue-950/60 dark:text-sky-300">
                    Trọng số: {c.weight}%
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="min-h-[44px] px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-[#004776] hover:bg-muted transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  {c.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCriterion(c.id)}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Conditions Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    ✓ Điều kiện [ĐẠT]
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{c.passCondition}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    ⚠ Điều kiện [CẦN CHỈNH SỬA]
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{c.warningCondition}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                  <div className="font-semibold text-rose-700 dark:text-rose-400 mb-1">
                    ✕ Điều kiện [KHÔNG ĐẠT]
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{c.failCondition}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criterion Modal */}
      <AdminCriterionModal
        criterion={editingCriterion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
      />
    </div>
  );
};
