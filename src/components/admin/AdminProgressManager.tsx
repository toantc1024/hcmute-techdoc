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
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* Overall Progress Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="size-11 sm:size-12 rounded-xl bg-white dark:bg-blue-950/60 p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0 flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-8 sm:size-9 object-contain" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#0072BC] dark:text-sky-400 uppercase tracking-wider">
                Kế hoạch tổng thể HCM-UTE
              </span>
              <h2 className="text-[20px] sm:text-[22px] font-[650] tracking-tight text-[#004776] dark:text-foreground">
                Tiến độ nâng cấp &amp; chuẩn hóa website 51 đơn vị
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Tiến độ tích lũy:</span>
            <span className="text-[28px] sm:text-[32px] font-[650] font-mono tabular-nums text-[#0072BC] dark:text-sky-300">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0072BC] rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* 3 Roadmap Phases Cards - Hierarchy: Emerald / UTE Blue / Slate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-stretch">
          {phases.map((phase) => (
            <div
              key={phase.phaseId}
              className={`h-full flex flex-col justify-between p-4 rounded-xl border space-y-2.5 transition-all shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${
                phase.status === 'completed'
                  ? 'border-emerald-200/90 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : phase.status === 'in-progress'
                  ? 'border-[#0072BC]/40 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20 ring-1 ring-[#0072BC]/20'
                  : 'border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold font-mono text-muted-foreground">
                    Giai đoạn {phase.phaseId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                      phase.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : phase.status === 'in-progress'
                        ? 'bg-[#0072BC] text-white'
                        : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {phase.status === 'completed'
                      ? 'Hoàn thành 100%'
                      : phase.status === 'in-progress'
                      ? `Đang thực hiện (${phase.completionRate}%)`
                      : 'Kế hoạch sắp tới'}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#004776] dark:text-foreground">
                  {phase.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {phase.target}
                </p>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
                Thời gian: {phase.timeFrame}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Management Section */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
                Hệ thống tiêu chí đánh giá ({criteria.length} tiêu chí)
              </h2>
              {totalWeight !== 100 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 tabular-nums">
                  Tổng tỷ trọng: {totalWeight}% (Khuyến nghị 100%)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bộ tiêu chí chuẩn hóa từ sổ tay TechDoc. Bạn có thể thêm tiêu chí mới theo yêu cầu nghiệp vụ.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white shadow-2xs inline-flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm tiêu chí mới
          </button>
        </div>

        {/* Criteria List - Flattened cards */}
        <div className="grid grid-cols-1 gap-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0072BC]/10 text-[#004776] dark:text-sky-300">
                    {c.code}
                  </span>
                  <h3 className="text-sm font-semibold text-[#004776] dark:text-foreground">
                    {c.name}
                  </h3>
                  {c.isCustom && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      Tự thêm
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-[#004776] dark:bg-blue-950/60 dark:text-sky-300 tabular-nums">
                    Trọng số: {c.weight}%
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="min-h-[34px] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#004776] hover:bg-slate-50 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  {c.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCriterion(c.id)}
                      className="min-h-[34px] px-3 py-1 rounded-lg border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Conditions Cards - Equal height pastels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs items-stretch">
                <div className="h-full flex flex-col justify-start p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    ✓ Điều kiện [ĐẠT]
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.passCondition}</p>
                </div>

                <div className="h-full flex flex-col justify-start p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    ◐ Điều kiện [CẦN SỬA]
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.warningCondition}</p>
                </div>

                <div className="h-full flex flex-col justify-start p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                  <div className="font-semibold text-rose-700 dark:text-rose-400 mb-1">
                    × Điều kiện [CHƯA ĐẠT]
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.failCondition}</p>
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
