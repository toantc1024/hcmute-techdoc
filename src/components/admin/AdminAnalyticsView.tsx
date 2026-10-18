'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DocSectionItem } from '@/models/admin.model';
import { adminService } from '@/services/admin.service';
import { brandConfig } from '@/configs/app.config';

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

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => b.viewCount - a.viewCount);
  }, [sections]);

  // Phân bổ lượt xem theo Luồng
  const streamStats = useMemo(() => {
    const map: Record<string, { label: string; count: number; color: string; hex: string }> = {
      TONG_QUAN: { label: 'Tổng quan & Khởi động', count: 0, color: 'text-sky-500', hex: '#0284C7' },
      B: { label: 'Tin tức & PDF (Luồng B)', count: 0, color: 'text-emerald-500', hex: '#10B981' },
      A: { label: 'Trang con (Luồng A)', count: 0, color: 'text-[#0072BC]', hex: '#0072BC' },
      C: { label: 'Menu & Footer (Luồng C)', count: 0, color: 'text-amber-500', hex: '#F59E0B' },
      HE_THONG: { label: 'Hệ thống & Tiện ích', count: 0, color: 'text-purple-500', hex: '#A855F7' },
    };

    sections.forEach((s) => {
      if (map[s.luong]) {
        map[s.luong].count += s.viewCount;
      }
    });

    return Object.values(map);
  }, [sections]);

  // Dữ liệu xu hướng 7 ngày gần nhất (10/10 - 16/10)
  const trendDays = [
    { date: '10/10', views: 480 },
    { date: '11/10', views: 720 },
    { date: '12/10', views: 890 },
    { date: '13/10', views: 710 },
    { date: '14/10', views: 1150 },
    { date: '15/10', views: 1040 },
    { date: '16/10', views: 1380 },
  ];

  const topUnits = [
    { name: 'Ban Quản lý Ký túc xá', views: 4850 },
    { name: 'Công đoàn Trường', views: 3980 },
    { name: 'Hội đồng Giáo sư cơ sở', views: 3420 },
    { name: 'Khoa Chính trị và Luật', views: 2890 },
    { name: 'Khoa Công nghệ TT', views: 2640 },
  ];

  const handleResetViews = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ lượt xem về 0 và bắt đầu tính từ thời điểm này?')) {
      const { items, startDate: newDate } = adminService.resetViews();
      setSections(items);
      setStartDate(newDate);
      if (onUpdateSections) onUpdateSections(items);
    }
  };

  const handleSimulateView = (id: string) => {
    const updated = adminService.incrementView(id);
    setSections(updated);
    if (onUpdateSections) onUpdateSections(updated);
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 p-1.5 border border-blue-100 dark:border-blue-900 shrink-0 flex items-center justify-center">
            <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-8 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Đo lường thời gian thực từ {startDate}
              </span>
            </div>
            <h2 className="text-[20px] sm:text-[22px] font-[650] tracking-tight text-[#004776] dark:text-foreground">
              Phân tích dữ liệu &amp; Xu hướng truy cập chuyên mục
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2.5 px-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-right min-w-[130px]">
            <div className="text-[11px] text-muted-foreground font-medium">Tổng lượt xem</div>
            <div className="text-[24px] sm:text-[28px] font-[650] font-mono tabular-nums text-[#0072BC] dark:text-sky-300">
              {totalViews.toLocaleString()}
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetViews}
            className="min-h-[38px] px-3.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/70 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Đặt lại về 0
          </button>
        </div>
      </div>

      {/* ROW 1: 40% Cơ cấu lượt xem + 60% Xu hướng 7 ngày */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        {/* Card Left (40%): Cơ cấu lượt xem theo chuyên mục */}
        <div className="lg:col-span-2 h-full flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
                Cơ cấu lượt xem
              </h3>
              <span className="text-xs text-muted-foreground font-mono">5 luồng tài liệu</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-3">
              <div className="relative size-40 sm:size-44 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#0072BC" strokeWidth="12" strokeDasharray="95 143" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="45 193" strokeDashoffset="-95" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="12" strokeDasharray="36 202" strokeDashoffset="-140" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="31 207" strokeDashoffset="-176" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#A855F7" strokeWidth="12" strokeDasharray="31 207" strokeDashoffset="-207" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-[650] font-mono tabular-nums text-[#004776] dark:text-foreground">
                    {totalViews.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground">lượt xem</span>
                </div>
              </div>

              <div className="space-y-2 text-xs w-full sm:w-auto">
                {streamStats.map((item) => {
                  const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 20;
                  return (
                    <div key={item.label} className="flex items-center justify-between sm:justify-start gap-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.hex }} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[130px]">{item.label}</span>
                      </div>
                      <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {item.count.toLocaleString()} ({pct}%)
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card Right (60%): Xu hướng lượt xem 7 ngày gần nhất (+25% chiều cao) */}
        <div className="lg:col-span-3 h-full flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground">
                Xu hướng lượt xem (7 ngày gần nhất)
              </h3>
              <span className="text-xs font-mono font-bold tabular-nums text-[#0072BC] dark:text-sky-300">
                Tổng 7 ngày: 7,470
              </span>
            </div>

            <div className="pt-3">
              <div className="h-48 sm:h-52 w-full flex items-end justify-between gap-3 px-2">
                {trendDays.map((d) => {
                  const heightPct = Math.round((d.views / 1500) * 100);
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {d.views}
                      </span>
                      <div
                        className="w-full max-w-[34px] bg-[#0072BC] dark:bg-sky-500 rounded-t transition-all duration-200 group-hover:bg-[#005a96]"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[11px] font-mono tabular-nums text-slate-500">{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: 40% Top đơn vị + 60% Top chuyên mục */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        {/* Top đơn vị (40%) */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-3">
          <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/80">
            Top đơn vị có lượt xem nhiều nhất
          </h3>
          <div className="space-y-2 pt-1">
            {topUnits.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0072BC] font-mono font-bold text-[11px] tabular-nums flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{u.name}</span>
                </div>
                <span className="font-mono font-bold tabular-nums text-[#0072BC] dark:text-sky-300">{u.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top chuyên mục (60%) */}
        <div className="lg:col-span-3 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#132238] shadow-[0_1px_2px_rgba(15,23,42,0.03)] space-y-3">
          <h3 className="text-[16px] font-semibold text-[#004776] dark:text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/80">
            Top 8 chuyên mục được xem nhiều nhất
          </h3>
          <div className="space-y-2 pt-1">
            {sortedSections.slice(0, 8).map((s, idx) => {
              const widthPct = Math.max(8, Math.round((s.viewCount / maxViews) * 100));
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[340px]">
                      Chương {s.chapterNumber}: {s.chapterTitle}
                    </span>
                    <span className="font-mono font-bold tabular-nums text-[#0072BC] dark:text-sky-300 shrink-0">
                      {s.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-[#0072BC]'}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
