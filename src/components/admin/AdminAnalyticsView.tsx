'use client';

import React, { useState, useMemo } from 'react';
import { DocSectionItem } from '@/models/admin.model';

interface AdminAnalyticsViewProps {
  sections: DocSectionItem[];
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ sections }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Multiplier dựa theo mốc thời gian lọc
  const multiplier = timeRange === '7d' ? 0.28 : timeRange === '30d' ? 0.75 : 1;

  const rankedSections = useMemo(() => {
    return [...sections]
      .map((s) => ({
        ...s,
        calculatedViews: Math.round(s.viewCount * multiplier),
      }))
      .sort((a, b) => b.calculatedViews - a.calculatedViews);
  }, [sections, multiplier]);

  const totalCalculatedViews = useMemo(() => {
    return rankedSections.reduce((acc, curr) => acc + curr.calculatedViews, 0);
  }, [rankedSections]);

  // Phân bổ theo luồng
  const distributionByLuong = useMemo(() => {
    const map: Record<string, { label: string; count: number; color: string }> = {
      B: { label: 'Luồng B (Tin tức & PDF)', count: 0, color: 'bg-emerald-500' },
      A: { label: 'Luồng A (Trang con)', count: 0, color: 'bg-blue-600' },
      TONG_QUAN: { label: 'Tổng quan & Khởi động', count: 0, color: 'bg-indigo-500' },
      C: { label: 'Luồng C (Menu & Footer)', count: 0, color: 'bg-amber-500' },
      HE_THONG: { label: 'Hệ thống & Tiện ích', count: 0, color: 'bg-purple-500' },
    };

    rankedSections.forEach((s) => {
      if (map[s.luong]) {
        map[s.luong].count += s.calculatedViews;
      }
    });

    return Object.values(map);
  }, [rankedSections]);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Tổng lượt xem tài liệu</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#004776] dark:text-sky-400 mt-1">
            {totalCalculatedViews.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>↑ 18.4%</span>
            <span className="text-muted-foreground font-normal">so với chu kỳ trước</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Thời gian đọc trung bình</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#004776] dark:text-sky-400 mt-1">
            6.8 phút
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
            <span>Đọc sâu & thực hành</span>
            <span className="text-muted-foreground font-normal">theo quy trình</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Phần được quan tâm nhất</span>
          <div className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground mt-1 truncate">
            {rankedSections[0]?.pageTitle || 'Luồng B: Tin bài'}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {rankedSections[0]?.calculatedViews.toLocaleString()} lượt xem ({Math.round(((rankedSections[0]?.calculatedViews || 0) / (totalCalculatedViews || 1)) * 100)}%)
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Đơn vị truy cập nhiều</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#004776] dark:text-sky-400 mt-1">
            15 Khoa/Viện
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Chiếm 48% tổng lượt truy vấn hướng dẫn
          </div>
        </div>
      </div>

      {/* Filter and Top Viewed Rankings */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground">
              Bảng xếp hạng phần được xem nhiều nhất (Top Viewed)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Thống kê trực quan nhu cầu tra cứu tài liệu của cán bộ, giảng viên và quản trị viên 51 đơn vị
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/60">
            {[
              { key: '7d', label: '7 ngày qua' },
              { key: '30d', label: '30 ngày qua' },
              { key: 'all', label: 'Toàn thời gian' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTimeRange(t.key as '7d' | '30d' | 'all')}
                className={`min-h-[44px] px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === t.key
                    ? 'bg-card text-[#004776] dark:text-sky-300 shadow-xs'
                    : 'text-muted-foreground hover:text-[#004776]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top List with Progress Bars */}
        <div className="space-y-4">
          {rankedSections.map((item, index) => {
            const percentage = totalCalculatedViews > 0
              ? Math.round((item.calculatedViews / totalCalculatedViews) * 100)
              : 0;
            const isTop = index === 0;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border/70 hover:border-[#0072BC]/40 hover:bg-muted/10 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`size-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                          : index === 1
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : index === 2
                          ? 'bg-amber-700/10 text-amber-900 dark:text-amber-200'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#0072BC] dark:text-sky-400">
                          Chương {item.chapterNumber}: {item.chapterTitle}
                        </span>
                        {isTop && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Quan tâm nhất
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-[#004776] dark:text-foreground">
                        {item.pageTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center sm:justify-end gap-3 text-right">
                    <div>
                      <div className="font-bold text-sm font-mono text-[#004776] dark:text-foreground">
                        {item.calculatedViews.toLocaleString()} lượt xem
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.readingTimeMinutes} phút đọc trung bình
                      </div>
                    </div>
                    <span className="min-w-[48px] text-right font-bold text-xs text-[#0072BC] dark:text-sky-400">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-muted/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0
                        ? 'bg-gradient-to-r from-[#0072BC] to-emerald-500'
                        : 'bg-[#0072BC]/80'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution by Stream / Luồng */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#004776] dark:text-foreground">
          Cơ cấu lượt xem theo phân luồng chuyên môn
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {distributionByLuong.map((item) => {
            const pct = totalCalculatedViews > 0
              ? Math.round((item.count / totalCalculatedViews) * 100)
              : 0;
            return (
              <div key={item.label} className="p-3.5 rounded-xl border border-border/70 bg-background space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs font-semibold text-muted-foreground truncate">{item.label}</span>
                </div>
                <div className="text-lg font-bold text-[#004776] dark:text-foreground">
                  {item.count.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-muted-foreground">{pct}% tổng lượng xem</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
