'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DocSectionItem } from '@/models/admin.model';
import { adminService } from '@/services/admin.service';

interface AdminAnalyticsViewProps {
  sections: DocSectionItem[];
  onUpdateSections?: (sections: DocSectionItem[]) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  sections: initialSections,
  onUpdateSections,
}) => {
  const [sections, setSections] = useState<DocSectionItem[]>(initialSections);
  const [startDate, setStartDate] = useState<string>('16/10/2026');

  useEffect(() => {
    setSections(initialSections);
    setStartDate(adminService.getViewsStartDate());
  }, [initialSections]);

  const totalViews = useMemo(() => {
    return sections.reduce((sum, s) => sum + s.viewCount, 0);
  }, [sections]);

  const maxViews = useMemo(() => {
    return Math.max(...sections.map((s) => s.viewCount), 1);
  }, [sections]);

  // Sắp xếp các mục theo lượt xem giảm dần
  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => b.viewCount - a.viewCount);
  }, [sections]);

  // Phân bổ lượt xem theo Luồng
  const streamStats = useMemo(() => {
    const map: Record<string, { label: string; count: number; color: string; barColor: string }> = {
      B: { label: 'Luồng B (Tin tức & PDF)', count: 0, color: 'text-emerald-600', barColor: 'bg-emerald-500' },
      A: { label: 'Luồng A (Trang con)', count: 0, color: 'text-blue-600', barColor: 'bg-[#0072BC]' },
      TONG_QUAN: { label: 'Tổng quan & Khởi động', count: 0, color: 'text-indigo-600', barColor: 'bg-indigo-500' },
      C: { label: 'Luồng C (Menu & Footer)', count: 0, color: 'text-amber-600', barColor: 'bg-amber-500' },
      HE_THONG: { label: 'Hệ thống & Tiện ích', count: 0, color: 'text-purple-600', barColor: 'bg-purple-500' },
    };

    sections.forEach((s) => {
      if (map[s.luong]) {
        map[s.luong].count += s.viewCount;
      }
    });

    return Object.values(map);
  }, [sections]);

  const handleResetViews = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ lượt xem về 0 và bắt đầu tính từ thời điểm này?')) {
      const { items, startDate: newDate } = adminService.resetViews();
      setSections(items);
      setStartDate(newDate);
      if (onUpdateSections) {
        onUpdateSections(items);
      }
    }
  };

  const handleSimulateView = (id: string) => {
    const updated = adminService.incrementView(id);
    setSections(updated);
    if (onUpdateSections) {
      onUpdateSections(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Reset & Status */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border bg-white dark:bg-[#132238] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Đang ghi nhận số liệu trực tiếp
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#004776] dark:text-foreground">
            Thống kê lượt xem chuyên mục tài liệu
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
            <span>Bắt đầu đo lường từ:</span>
            <strong className="font-mono text-[#0072BC] dark:text-sky-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
              {startDate}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border text-center sm:text-right min-w-[140px]">
            <div className="text-[11px] text-muted-foreground font-medium">Tổng lượt truy cập</div>
            <div className="text-2xl font-extrabold font-mono text-[#004776] dark:text-sky-300">
              {totalViews.toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetViews}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2"
            title="Đưa toàn bộ số lượt xem về 0 và lưu lại mốc thời gian hiện tại"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt lại về 0 (Bắt đầu từ bây giờ)</span>
          </button>
        </div>
      </div>

      {/* Biểu đồ thanh tỷ trọng phân khúc (Segmented Stream Bar) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border bg-white dark:bg-[#132238] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#004776] dark:text-foreground">
            Phân bổ cơ cấu theo luồng chuyên môn
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            100% tài liệu TechDoc
          </span>
        </div>

        {/* Thanh bar phân bổ trực quan */}
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex shadow-inner">
          {streamStats.map((item) => {
            const pct = totalViews > 0 ? (item.count / totalViews) * 100 : 20;
            return (
              <div
                key={item.label}
                className={`${item.barColor} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${pct}%` }}
                title={`${item.label}: ${item.count} lượt (${Math.round(pct)}%)`}
              />
            );
          })}
        </div>

        {/* Chú giải phân bổ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {streamStats.map((item) => {
            const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
            return (
              <div key={item.label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`size-2 rounded-full ${item.barColor}`} />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                <div className="text-base font-extrabold font-mono text-[#004776] dark:text-foreground">
                  {item.count.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BIỂU ĐỒ CỘT TRỰC QUAN GỌN NHẸ (Visual Horizontal Bar Chart) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border bg-white dark:bg-[#132238] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-[#004776] dark:text-foreground">
              Biểu đồ trực quan: Top chuyên mục được quan tâm nhiều nhất
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chiều dài thanh biểu đồ phản ánh trực tiếp số lượt tra cứu của 51 đơn vị
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">8 chuyên đề chính</span>
        </div>

        {/* Danh sách thanh biểu đồ */}
        <div className="space-y-3.5">
          {sortedSections.map((item, index) => {
            const percentage = totalViews > 0 ? Math.round((item.viewCount / totalViews) * 100) : 0;
            const barWidth = maxViews > 0 ? Math.max(2, Math.round((item.viewCount / maxViews) * 100)) : 2;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-border/70 hover:border-[#0072BC]/40 bg-slate-50/40 dark:bg-slate-900/30 transition-all space-y-2 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-6 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      index === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-slate-100 text-muted-foreground'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-bold text-[#004776] dark:text-foreground">
                      Chương {item.chapterNumber}: {item.chapterTitle}
                    </span>
                    <span className="text-muted-foreground hidden md:inline">({item.pageTitle})</span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSimulateView(item.id)}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-border bg-background hover:bg-muted text-muted-foreground hover:text-[#004776] transition-colors"
                      title="Mô phỏng 1 lượt truy cập thực tế"
                    >
                      +1 Test
                    </button>
                    <span className="font-mono font-extrabold text-sm text-[#004776] dark:text-sky-300 min-w-[70px] text-right">
                      {item.viewCount.toLocaleString()} lượt
                    </span>
                    <span className="font-mono text-xs text-muted-foreground min-w-[40px] text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Thanh Bar Gradient */}
                <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      index === 0
                        ? 'bg-gradient-to-r from-[#0072BC] to-emerald-400'
                        : index === 1
                        ? 'bg-gradient-to-r from-[#0072BC] to-sky-400'
                        : 'bg-[#0072BC]/70'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
