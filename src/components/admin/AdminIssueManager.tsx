'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SystemIssueItem, IssueStatus, IssuePriority } from '@/models/admin.model';
import { systemIssuesService } from '@/services/system-issues.service';
import { AdminIssueModal } from './AdminIssueModal';
import { AdminIssueImageViewer } from './AdminIssueImageViewer';

const STATUS_CONFIG: Record<IssueStatus, { label: string; badgeClass: string; dotClass: string }> = {
  dang_xu_ly: { label: 'Đang xử lý', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800', dotClass: 'bg-amber-500' },
  da_xu_ly: { label: 'Đã xử lý', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800', dotClass: 'bg-emerald-500' },
  khong_xu_ly: { label: 'Không xử lý', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', dotClass: 'bg-slate-400' },
};

const PRIORITY_CONFIG: Record<IssuePriority, { label: string; badgeClass: string }> = {
  1: { label: 'Cấp độ 1 (Khẩn)', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  2: { label: 'Cấp độ 2 (Vừa)', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  3: { label: 'Cấp độ 3 (Thấp)', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' },
};

export const AdminIssueManager: React.FC = () => {
  const [issues, setIssues] = useState<SystemIssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<SystemIssueItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const reloadIssues = useCallback(async () => {
    try {
      const data = await systemIssuesService.fetchIssues();
      setIssues(data);
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIssues(systemIssuesService.getInstantIssues());
    reloadIssues();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) setIssues(e.detail);
    };
    window.addEventListener('hcmute_techdoc_issues_updated', handleUpdate);
    return () => window.removeEventListener('hcmute_techdoc_issues_updated', handleUpdate);
  }, [reloadIssues]);

  const handleSaveIssue = async (issueData: Partial<SystemIssueItem> & { content: string }) => {
    const saved = await systemIssuesService.saveIssue(issueData);
    setIssues((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved];
    });
  };

  const handleStatusChange = async (id: string, newStatus: IssueStatus) => {
    await systemIssuesService.updateStatus(id, newStatus);
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  };

  const handleDelete = async (id: string, stt: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ghi chú lỗi STT #${stt}?`)) return;
    await systemIssuesService.deleteIssue(id);
    setIssues((prev) => prev.filter((i) => i.id !== id).map((item, idx) => ({ ...item, stt: idx + 1 })));
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterPriority !== 'all' && String(item.priority) !== filterPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchContent = item.content.toLowerCase().includes(q);
        const matchPlan = item.solutionPlan?.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        const matchReporter = item.reporterName?.toLowerCase().includes(q);
        if (!matchContent && !matchPlan && !matchNotes && !matchReporter) return false;
      }
      return true;
    });
  }, [issues, filterStatus, filterPriority, searchQuery]);

  const counts = useMemo(() => {
    const inProgress = issues.filter((i) => i.status === 'dang_xu_ly').length;
    const resolved = issues.filter((i) => i.status === 'da_xu_ly').length;
    const ignored = issues.filter((i) => i.status === 'khong_xu_ly').length;
    const p1 = issues.filter((i) => i.priority === 1).length;
    return { inProgress, resolved, ignored, p1, total: issues.length };
  }, [issues]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Stat Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Sổ theo dõi &amp; Ghi chú lỗi hệ thống</span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#0072BC] dark:bg-blue-900/60 dark:text-blue-300">
              {counts.total} mục
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận lỗi, phương án xử lý, hỗ trợ chụp màn hình dán ảnh (Ctrl+V) nhanh chóng
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingIssue(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0072BC] hover:bg-[#005a96] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          + Note lỗi mới (Paste ảnh)
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs">
          <p className="text-xs font-medium text-slate-500">Đang xử lý</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{counts.inProgress}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs">
          <p className="text-xs font-medium text-slate-500">Đã xử lý xong</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{counts.resolved}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-xs">
          <p className="text-xs font-medium text-slate-500">Không xử lý</p>
          <p className="text-xl font-bold text-slate-500 mt-1">{counts.ignored}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
          <p className="text-xs font-medium text-rose-600">Ưu tiên cấp 1 (Khẩn)</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{counts.p1}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo nội dung lỗi, PA chỉnh sửa, note..."
            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-1 focus:ring-[#0072BC] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
            <option value="all">Tất cả trạng thái</option>
            <option value="dang_xu_ly">Đang xử lý</option>
            <option value="da_xu_ly">Đã xử lý</option>
            <option value="khong_xu_ly">Không xử lý</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
            <option value="all">Tất cả mức ưu tiên</option>
            <option value="1">Cấp độ 1</option>
            <option value="2">Cấp độ 2</option>
            <option value="3">Cấp độ 3</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-14 text-center">STT</th>
                <th className="py-3 px-3.5 w-36">Trạng thái xử lý</th>
                <th className="py-3 px-4 min-w-[280px]">Nội dung (Kèm ảnh chụp)</th>
                <th className="py-3 px-4 min-w-[220px]">PA Chỉnh sửa</th>
                <th className="py-3 px-3.5 w-32">Ưu tiên</th>
                <th className="py-3 px-3.5 min-w-[160px]">Note</th>
                <th className="py-3 px-3 w-20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Chưa có ghi chú lỗi nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((item) => {
                  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.dang_xu_ly;
                  const priorityCfg = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG[2];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3.5 text-center font-bold text-slate-500">#{item.stt}</td>
                      <td className="py-3.5 px-3.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as IssueStatus)}
                          className={`w-full py-1 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${statusCfg.badgeClass}`}
                        >
                          <option value="dang_xu_ly">🟡 Đang xử lý</option>
                          <option value="da_xu_ly">🟢 Đã xử lý</option>
                          <option value="khong_xu_ly">⚪ Không xử lý</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 space-y-2">
                        <p className="text-slate-800 dark:text-slate-200 text-xs font-medium leading-relaxed">{item.content}</p>
                        {item.images && item.images.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.images.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedImage(img)}
                                className="relative group size-11 rounded border border-slate-200 dark:border-slate-700 overflow-hidden cursor-zoom-in"
                                title="Bấm để xem ảnh phóng to"
                              >
                                <img src={img} alt="Ảnh lỗi" className="size-full object-cover group-hover:scale-105 transition-transform" />
                              </button>
                            ))}
                            <span className="text-[10px] text-slate-400 font-mono">({item.images.length} ảnh)</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{item.solutionPlan || '—'}</p>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${priorityCfg.badgeClass}`}>
                          {priorityCfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 space-y-1">
                        <p className="text-slate-600 dark:text-slate-400 text-xs">{item.notes || '—'}</p>
                        {item.reporterName && (
                          <p className="text-[10px] text-slate-400 italic">Bởi: {item.reporterName}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => { setEditingIssue(item); setIsModalOpen(true); }}
                            className="p-1 rounded text-slate-500 hover:text-[#0072BC] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Chỉnh sửa"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.stt)}
                            className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Xóa"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminIssueModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIssue(null); }}
        onSave={handleSaveIssue}
        editingIssue={editingIssue}
        onViewImage={(url) => setSelectedImage(url)}
        nextStt={issues.length > 0 ? Math.max(...issues.map((i) => i.stt || 0)) + 1 : 1}
      />

      <AdminIssueImageViewer imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};
