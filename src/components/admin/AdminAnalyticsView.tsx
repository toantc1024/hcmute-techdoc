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
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 p-1.5 border border-blue-100 dark:border-blue-900 shrink-0 flex items-center justify-center">
            <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-8 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Đo lường thời gian thực từ {startDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#004776] dark:text-foreground">
              Phân tích dữ liệu &amp; Xu hướng truy cập chuyên mục
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2.5 px-4 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-right min-w-[130px]">
            <div className="text-[11px] text-muted-foreground font-medium">Tổng lượt xem</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#0072BC] dark:text-sky-300">
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

      {/* ROW 1: 2 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card Left: Cơ cấu lượt xem theo chuyên mục */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-[#004776] dark:text-foreground">
              Cơ cấu lượt xem theo chuyên mục
            </h3>
            <span className="text-xs text-muted-foreground font-mono">5 luồng tài liệu</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-1">
            <div className="relative size-36 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0072BC" strokeWidth="12" strokeDasharray="95 143" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="45 193" strokeDashoffset="-95" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="12" strokeDasharray="36 202" strokeDashoffset="-140" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="31 207" strokeDashoffset="-176" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#A855F7" strokeWidth="12" strokeDasharray="31 207" strokeDashoffset="-207" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black font-mono text-[#004776] dark:text-foreground">
                  {totalViews.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">lượt xem</span>
              </div>
            </div>

            <div className="space-y-2 text-xs w-full sm:w-auto">
              {streamStats.map((item) => {
                const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 20;
                return (
                  <div key={item.label} className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: item.hex }} />
                      <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px]">{item.label}</span>
                    </div>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">
                      {item.count.toLocaleString()} ({pct}%)
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Right: Xu hướng lượt xem 7 ngày gần nhất */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-[#004776] dark:text-foreground">
              Xu hướng lượt xem (7 ngày gần nhất)
            </h3>
            <span className="text-xs font-mono font-bold text-[#0072BC] dark:text-sky-300">
              Tổng 7 ngày: 7,470
            </span>
          </div>

          <div className="pt-2">
            <div className="h-36 w-full flex items-end justify-between gap-2 px-2">
              {trendDays.map((d) => {
                const heightPct = Math.round((d.views / 1500) * 100);
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.views}
                    </span>
                    <div
                      className="w-full max-w-[28px] bg-gradient-to-t from-[#0072BC] to-sky-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[11px] font-mono text-slate-500">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Top đơn vị + Top 8 chuyên mục */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top đơn vị */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] space-y-3">
          <h3 className="font-bold text-sm sm:text-base text-[#004776] dark:text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/80">
            Top đơn vị có lượt xem nhiều nhất
          </h3>
          <div className="space-y-2">
            {topUnits.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0072BC] font-mono font-bold text-[11px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{u.name}</span>
                </div>
                <span className="font-mono font-bold text-[#0072BC] dark:text-sky-300">{u.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 8 chuyên mục */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#132238] space-y-3">
          <h3 className="font-bold text-sm sm:text-base text-[#004776] dark:text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/80">
            Top 8 chuyên mục được xem nhiều nhất
          </h3>
          <div className="space-y-2">
            {sortedSections.slice(0, 8).map((s, idx) => {
              const widthPct = Math.max(8, Math.round((s.viewCount / maxViews) * 100));
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
                      Chương {s.chapterNumber}: {s.chapterTitle}
                    </span>
                    <span className="font-mono font-bold text-[#0072BC] dark:text-sky-300 shrink-0">
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
