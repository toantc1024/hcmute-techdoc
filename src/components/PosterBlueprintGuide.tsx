'use client';

import React, { useState } from 'react';
import { Ruler, Copy, Check } from 'lucide-react';

interface MetricRow {
  name: string;
  size: string;
  sizeColor?: string;
  offset: string;
  rule: string;
}

interface TabData {
  id: 'pc-24-10' | 'pc-16-9' | 'mobile-3-4';
  label: string;
  aspect: string;
  category: string;
  copyLabel: string;
  copyText: string;
  metrics: MetricRow[];
}

const TABS: TabData[] = [
  {
    id: 'pc-24-10',
    label: 'Máy tính 2.4:1',
    aspect: 'TỈ LỆ 2.4:1',
    category: 'Mặc định trang chủ HCMUTE',
    copyLabel: 'Sao chép thông số kỹ thuật 2.4:1',
    copyText: `QUY CHUẨN POSTER BANNER TRANG CHỦ HCMUTE (TỈ LỆ 2.4:1)
- Canvas Poster tổng: 2400 × 1000 px | Tràn viền (0 px) | Ảnh nền hoặc màu phủ kín 100% canvas
- Khung nội dung chính: 2100 × 620 px | Lề trên/dưới 190 px • Lề trái/phải 150 px | Vùng không bao giờ bị cắt xén trên máy tính
- Vùng an toàn Chữ & Logo: 1200 × 460 px | Cách trên/dưới 270 px • Cách trái/phải 600 px | Đặt toàn bộ Tiêu đề, Logo, Nút bấm (CTA) tại vùng này
- Tỉ lệ khung hình: 2.4 : 1 (24:10) | Landscape Widescreen | Chuẩn banner ngang toàn cảnh HCMUTE`,
    metrics: [
      {
        name: 'Canvas Poster tổng',
        size: '2400 × 1000 px',
        offset: 'Tràn viền (0 px)',
        rule: 'Ảnh nền hoặc màu phủ kín 100% canvas',
      },
      {
        name: 'Khung nội dung chính',
        size: '2100 × 620 px',
        sizeColor: 'text-[#0072BC] dark:text-[#38C7F4]',
        offset: 'Lề trên/dưới 190 px • Lề trái/phải 150 px',
        rule: 'Vùng không bao giờ bị cắt xén trên máy tính',
      },
      {
        name: 'Vùng an toàn Chữ & Logo',
        size: '1200 × 460 px',
        sizeColor: 'text-amber-600 dark:text-amber-400',
        offset: 'Cách trên/dưới 270 px • Cách trái/phải 600 px',
        rule: 'Đặt toàn bộ Tiêu đề, Logo, Nút bấm (CTA) tại vùng này',
      },
      {
        name: 'Tỉ lệ khung hình',
        size: '2.4 : 1 (24:10)',
        offset: 'Landscape Widescreen',
        rule: 'Chuẩn banner ngang toàn cảnh HCMUTE',
      },
    ],
  },
  {
    id: 'pc-16-9',
    label: 'Máy tính 16:9',
    aspect: 'TỈ LỆ 16:9',
    category: 'Chuẩn Video & Slide Quốc Tế',
    copyLabel: 'Sao chép thông số kỹ thuật 16:9',
    copyText: `QUY CHUẨN POSTER BANNER VIDEO & SLIDE 16:9
- Canvas Poster tổng: 1920 × 1080 px | Tràn viền (0 px) | Độ phân giải Full HD tiêu chuẩn
- Khung nội dung chính: 1680 × 880 px | Lề trên/dưới 100 px • Lề trái/phải 120 px | Vùng hiển thị trọn vẹn không bị cắt
- Vùng an toàn Chữ & Logo: 1280 × 580 px | Cách trên/dưới 250 px • Cách trái/phải 320 px | Tránh che khuất bởi nút điều hướng 2 bên
- Tỉ lệ khung hình: 16 : 9 | Widescreen Full HD | Tỉ lệ tiêu chuẩn video và màn hình hiện đại`,
    metrics: [
      {
        name: 'Canvas Poster tổng',
        size: '1920 × 1080 px',
        offset: 'Tràn viền (0 px)',
        rule: 'Độ phân giải Full HD tiêu chuẩn',
      },
      {
        name: 'Khung nội dung chính',
        size: '1680 × 880 px',
        sizeColor: 'text-[#0072BC] dark:text-[#38C7F4]',
        offset: 'Lề trên/dưới 100 px • Lề trái/phải 120 px',
        rule: 'Vùng hiển thị trọn vẹn không bị cắt',
      },
      {
        name: 'Vùng an toàn Chữ & Logo',
        size: '1280 × 580 px',
        sizeColor: 'text-amber-600 dark:text-amber-400',
        offset: 'Cách trên/dưới 250 px • Cách trái/phải 320 px',
        rule: 'Tránh che khuất bởi nút điều hướng 2 bên',
      },
      {
        name: 'Tỉ lệ khung hình',
        size: '16 : 9',
        offset: 'Widescreen Full HD',
        rule: 'Tỉ lệ tiêu chuẩn video và màn hình hiện đại',
      },
    ],
  },
  {
    id: 'mobile-3-4',
    label: 'Điện thoại 3:4',
    aspect: 'ĐIỆN THOẠI 3:4',
    category: 'Dọc màn hình smartphone',
    copyLabel: 'Sao chép thông số kỹ thuật Mobile',
    copyText: `QUY CHUẨN POSTER BANNER DI ĐỘNG SMARTPHONE 3:4
- Canvas Mobile tiêu chuẩn: 1080 × 1440 px | Tràn viền (0 px) | Tỉ lệ dọc 3:4 chuẩn màn hình smartphone
- Canvas Mobile vuông vừa: 1000 × 1200 px | Tràn viền (0 px) | Tỉ lệ 5:6 (phù hợp máy màn hình ngắn)
- Vùng an toàn Chữ & Logo: 800 × 640 px | Cách trên 400 px • Cách dưới 400 px • Cách 2 bên 140 px | Chữ to, rõ ràng, không bị che bởi header và dots
- Vùng cảnh báo mép: Vùng tránh Header / Top Bar 400 px phía trên, Vùng tránh nút cuộn & Dots 400 px phía dưới`,
    metrics: [
      {
        name: 'Canvas Mobile tiêu chuẩn',
        size: '1080 × 1440 px',
        offset: 'Tràn viền (0 px)',
        rule: 'Tỉ lệ dọc 3:4 chuẩn màn hình smartphone',
      },
      {
        name: 'Canvas Mobile vuông vừa',
        size: '1000 × 1200 px',
        offset: 'Tràn viền (0 px)',
        rule: 'Tỉ lệ 5:6 (phù hợp máy màn hình ngắn)',
      },
      {
        name: 'Vùng an toàn Chữ & Logo',
        size: '800 × 640 px',
        sizeColor: 'text-amber-600 dark:text-amber-400',
        offset: 'Cách trên 400 px • Cách dưới 400 px • Cách 2 bên 140 px',
        rule: 'Chữ to, rõ ràng, không bị che bởi header và dots',
      },
    ],
  },
];

export function PosterBlueprintGuide() {
  const [activeTab, setActiveTab] = useState<'pc-24-10' | 'pc-16-9' | 'mobile-3-4'>('pc-24-10');
  const [copied, setCopied] = useState<boolean>(false);

  const currentData = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentData.copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <section className="my-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden not-prose">
      {/* 1. Tiêu đề khối Hướng dẫn */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-start sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#0072BC] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0072BC]/20">
            <Ruler className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Hướng dẫn Thiết kế Poster &amp; Vùng an toàn (Blueprint)
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0072BC]/10 text-[#0072BC] dark:bg-[#0072BC]/20 dark:text-[#38C7F4] border border-[#0072BC]/20">
                Thông số chuẩn HCMUTE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Quy chuẩn kích thước pixel, khoảng cách lề và vùng an toàn chữ.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Thanh Tabs chuyển đổi */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-semibold">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 sm:px-4 rounded-lg transition-all text-center cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-[#0072BC] dark:text-[#38C7F4] font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Khung Bản vẽ Blueprint (Dark Technical CAD Blueprint) */}
      <div className="p-4 sm:p-6 pt-3">
        <div className="rounded-2xl border border-cyan-900/60 bg-[#050C18] p-3 sm:p-6 text-cyan-400 font-mono shadow-xl relative overflow-hidden">
          {/* Lưới kỹ thuật chìm */}
          <div className="pointer-events-none absolute inset-0 ute-blueprint-grid opacity-25 -z-0" />

          {/* Thanh tiêu đề Bản vẽ */}
          <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-cyan-900/40 relative z-10">
            <div className="font-bold tracking-wider text-cyan-300 text-[11px] sm:text-xs uppercase flex items-center gap-1.5">
              <span>BẢN VẼ ĐO LƯỜNG (METRIC BLUEPRINT) — {currentData.aspect}</span>
            </div>
            <div className="text-slate-400 text-[11px] hidden sm:block">
              {currentData.category}
            </div>
          </div>

          {/* Vùng đồ họa Vector SVG */}
          <div className="relative z-10 flex justify-center items-center py-2">
            {activeTab === 'pc-24-10' && <BlueprintCanvas2410 />}
            {activeTab === 'pc-16-9' && <BlueprintCanvas169 />}
            {activeTab === 'mobile-3-4' && <BlueprintCanvasMobile />}
          </div>
        </div>

        {/* 4. Bảng thông số kỹ thuật chi tiết */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Thành phần đo (Metric)</th>
                  <th className="py-3 px-4">Kích thước</th>
                  <th className="py-3 px-4">Khoảng cách lề (Offset)</th>
                  <th className="py-3 px-4">Quy chuẩn kỹ thuật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                {currentData.metrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {row.name}
                    </td>
                    <td className={`py-3 px-4 font-bold font-mono ${row.sizeColor || 'text-slate-900 dark:text-slate-100'}`}>
                      {row.size}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {row.offset}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {row.rule}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Nút Sao chép thông số kỹ thuật */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.99] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Đã sao chép thông số kỹ thuật vào bộ nhớ tạm!</span>
              </>
            ) : (
              <>
                <Copy className="size-4 text-[#0072BC] dark:text-[#38C7F4]" />
                <span>{currentData.copyLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

{/* ========================================================
    BẢN VẼ 1: MÁY TÍNH 2.4:1 (CANVAS 2400 × 1000 PX)
   ======================================================== */}
function BlueprintCanvas2410() {
  return (
    <div className="w-full max-w-[960px] aspect-[2.4/1.2] relative select-none">
      <svg
        viewBox="0 0 1200 580"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="cyan-arrow-start" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" fill="#00E5FF" />
          </marker>
          <marker id="cyan-arrow-end" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#00E5FF" />
          </marker>
          <marker id="amber-arrow-start" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" fill="#F59E0B" />
          </marker>
          <marker id="amber-arrow-end" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* 1. Mũi tên đo Canvas ngoài cùng (2400 PX ngang) */}
        <line
          x1="70" y1="35" x2="1130" y2="35"
          stroke="#00E5FF" strokeWidth="1.5"
          markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)"
        />
        <rect x="520" y="22" width="160" height="26" rx="6" fill="#031424" stroke="#00E5FF" strokeWidth="1.5" />
        <text x="600" y="39" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          CANVAS: 2400 PX
        </text>

        {/* 2. Mũi tên đo Chiều cao Canvas (1000 PX dọc bên trái) */}
        <line
          x1="40" y1="55" x2="40" y2="535"
          stroke="#00E5FF" strokeWidth="1.5"
          markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)"
        />
        <rect x="10" y="275" width="60" height="24" rx="4" fill="#031424" stroke="#00E5FF" strokeWidth="1" />
        <text x="40" y="291" fill="#00E5FF" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          1000 PX
        </text>

        {/* Khung Canvas gốc: 70 -> 1130 (rộng 1060), 55 -> 535 (cao 480) */}
        <rect
          x="70" y="55" width="1060" height="480" rx="6"
          fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.4"
        />

        {/* 3. Khung nội dung chính: 2100 × 620 PX (Viền đứt cyan) */}
        <rect
          x="136" y="146" width="928" height="298" rx="4"
          fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.8"
        />
        <text x="150" y="172" fill="#00E5FF" fontSize="11" fontWeight="bold" fontFamily="monospace">
          KHUNG NỘI DUNG: 2100 × 620 PX
        </text>

        {/* Chỉ báo lề: LỀ: 190 PX (trên & dưới) */}
        <line x1="230" y1="55" x2="230" y2="146" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)" />
        <rect x="200" y="92" width="60" height="18" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="230" y="105" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 190 PX
        </text>

        <line x1="230" y1="444" x2="230" y2="535" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)" />
        <rect x="200" y="480" width="60" height="18" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="230" y="493" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 190 PX
        </text>

        {/* Chỉ báo lề: LỀ: 150 PX (trái & phải) */}
        <line x1="70" y1="500" x2="136" y2="500" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)" />
        <rect x="75" y="478" width="56" height="16" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="103" y="490" fill="#00E5FF" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 150 PX
        </text>

        <line x1="1064" y1="500" x2="1130" y2="500" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start)" markerEnd="url(#cyan-arrow-end)" />
        <rect x="1069" y="478" width="56" height="16" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="1097" y="490" fill="#00E5FF" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 150 PX
        </text>

        {/* 4. Vùng an toàn Chữ & Logo: 1200 × 460 PX (Viền đứt vàng hổ phách) */}
        <rect
          x="335" y="184" width="530" height="222" rx="6"
          fill="#F59E0B" fillOpacity="0.05"
          stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6"
        />

        {/* Mũi tên Rộng vùng chữ: 1200 PX */}
        <line
          x1="335" y1="168" x2="865" y2="168"
          stroke="#F59E0B" strokeWidth="1.5"
          markerStart="url(#amber-arrow-start)" markerEnd="url(#amber-arrow-end)"
        />
        <rect x="525" y="156" width="150" height="22" rx="4" fill="#1C1204" stroke="#F59E0B" strokeWidth="1.2" />
        <text x="600" y="171" fill="#F59E0B" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          RỘNG VÙNG CHỮ: 1200 PX
        </text>

        {/* Mũi tên Cao vùng chữ: 460 PX (bên phải) */}
        <line
          x1="880" y1="184" x2="880" y2="406"
          stroke="#F59E0B" strokeWidth="1.5"
          markerStart="url(#amber-arrow-start)" markerEnd="url(#amber-arrow-end)"
        />
        <rect x="892" y="285" width="46" height="20" rx="3" fill="#1C1204" stroke="#F59E0B" strokeWidth="1" />
        <text x="915" y="299" fill="#F59E0B" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          460 PX
        </text>

        {/* Khối huy hiệu trung tâm Vùng an toàn */}
        <rect
          x="415" y="265" width="370" height="56" rx="8"
          fill="#140E05" stroke="#F59E0B" strokeWidth="1.5"
        />
        <text x="600" y="289" fill="#FBBF24" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VÙNG AN TOÀN CHỮ &amp; LOGO: 1200 × 460 PX
        </text>
        <text x="600" y="308" fill="#FDE68A" fontSize="9.5" textAnchor="middle" opacity="0.85" fontFamily="sans-serif">
          Đặt Tiêu đề • Thông tin sự kiện • Nút bấm (CTA) tại vùng này
        </text>
      </svg>
    </div>
  );
}

{/* ========================================================
    BẢN VẼ 2: MÁY TÍNH 16:9 (CANVAS 1920 × 1080 PX)
   ======================================================== */}
function BlueprintCanvas169() {
  return (
    <div className="w-full max-w-[960px] aspect-[16/10] relative select-none">
      <svg
        viewBox="0 0 1100 660"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="cyan-arrow-start-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" fill="#00E5FF" />
          </marker>
          <marker id="cyan-arrow-end-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#00E5FF" />
          </marker>
          <marker id="amber-arrow-start-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" fill="#F59E0B" />
          </marker>
          <marker id="amber-arrow-end-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* 1. Mũi tên đo Canvas ngang (1920 PX) */}
        <line
          x1="70" y1="35" x2="1030" y2="35"
          stroke="#00E5FF" strokeWidth="1.5"
          markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)"
        />
        <rect x="470" y="22" width="160" height="26" rx="6" fill="#031424" stroke="#00E5FF" strokeWidth="1.5" />
        <text x="550" y="39" fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          CANVAS: 1920 PX
        </text>

        {/* 2. Mũi tên đo Chiều cao (1080 PX dọc) */}
        <line
          x1="40" y1="55" x2="40" y2="615"
          stroke="#00E5FF" strokeWidth="1.5"
          markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)"
        />
        <rect x="10" y="325" width="60" height="24" rx="4" fill="#031424" stroke="#00E5FF" strokeWidth="1" />
        <text x="40" y="341" fill="#00E5FF" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          1080 PX
        </text>

        {/* Khung Canvas gốc: 70 -> 1030 (rộng 960), 55 -> 615 (cao 560) */}
        <rect
          x="70" y="55" width="960" height="560" rx="6"
          fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.4"
        />

        {/* 3. Khung nội dung chính: 1680 × 880 PX */}
        <rect
          x="130" y="107" width="840" height="456" rx="4"
          fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.8"
        />
        <text x="144" y="132" fill="#00E5FF" fontSize="11" fontWeight="bold" fontFamily="monospace">
          KHUNG NỘI DUNG: 1680 × 880 PX
        </text>

        {/* Chỉ báo lề: LỀ: 100 PX (trên & dưới) */}
        <line x1="210" y1="55" x2="210" y2="107" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)" />
        <rect x="180" y="73" width="60" height="18" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="210" y="86" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 100 PX
        </text>

        <line x1="210" y1="563" x2="210" y2="615" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)" />
        <rect x="180" y="580" width="60" height="18" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="210" y="593" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 100 PX
        </text>

        {/* Chỉ báo lề: LỀ: 120 PX (trái & phải) */}
        <line x1="70" y1="580" x2="130" y2="580" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)" />
        <rect x="75" y="560" width="50" height="16" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="100" y="572" fill="#00E5FF" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 120 PX
        </text>

        <line x1="970" y1="580" x2="1030" y2="580" stroke="#00E5FF" strokeWidth="1" markerStart="url(#cyan-arrow-start-2)" markerEnd="url(#cyan-arrow-end-2)" />
        <rect x="975" y="560" width="50" height="16" rx="3" fill="#031424" stroke="#00E5FF" strokeWidth="0.8" />
        <text x="1000" y="572" fill="#00E5FF" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          LỀ: 120 PX
        </text>

        {/* 4. Vùng an toàn Chữ & Logo: 1280 × 580 PX */}
        <rect
          x="230" y="185" width="640" height="300" rx="6"
          fill="#F59E0B" fillOpacity="0.05"
          stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6"
        />

        {/* Trục tâm chữ thập mờ nhẹ */}
        <line x1="550" y1="185" x2="550" y2="485" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />
        <line x1="230" y1="335" x2="870" y2="335" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.35" />

        {/* Mũi tên Rộng vùng chữ: 1280 PX */}
        <line
          x1="230" y1="168" x2="870" y2="168"
          stroke="#F59E0B" strokeWidth="1.5"
          markerStart="url(#amber-arrow-start-2)" markerEnd="url(#amber-arrow-end-2)"
        />
        <rect x="475" y="156" width="150" height="22" rx="4" fill="#1C1204" stroke="#F59E0B" strokeWidth="1.2" />
        <text x="550" y="171" fill="#F59E0B" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          RỘNG VÙNG CHỮ: 1280 PX
        </text>

        {/* Khối huy hiệu trung tâm */}
        <rect
          x="355" y="307" width="390" height="44" rx="6"
          fill="#140E05" stroke="#F59E0B" strokeWidth="1.5"
        />
        <text x="550" y="334" fill="#FBBF24" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VÙNG AN TOÀN CHỮ &amp; LOGO: 1280 × 580 PX
        </text>
      </svg>
    </div>
  );
}

{/* ========================================================
    BẢN VẼ 3: ĐIỆN THOẠI 3:4 (CANVAS 1080 × 1440 PX)
   ======================================================== */}
function BlueprintCanvasMobile() {
  return (
    <div className="w-full max-w-[540px] aspect-[3/4.2] relative select-none mx-auto">
      <svg
        viewBox="0 0 680 880"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="cyan-arrow-start-3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6 Z" fill="#00E5FF" />
          </marker>
          <marker id="cyan-arrow-end-3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#00E5FF" />
          </marker>
        </defs>

        {/* Mũi tên Rộng: 1080 PX */}
        <line
          x1="90" y1="35" x2="590" y2="35"
          stroke="#00E5FF" strokeWidth="1.5"
          markerStart="url(#cyan-arrow-start-3)" markerEnd="url(#cyan-arrow-end-3)"
        />
        <rect x="280" y="22" width="120" height="24" rx="4" fill="#031424" stroke="#00E5FF" strokeWidth="1.2" />
        <text x="340" y="38" fill="#00E5FF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          RỘNG: 1080 PX
        </text>

        {/* Canvas ngoài cùng: 90 -> 590 (rộng 500), 55 -> 835 (cao 780) */}
        <rect
          x="90" y="55" width="500" height="780" rx="8"
          fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.4"
        />

        {/* 1. Vùng tránh Header / Top Bar: 400 PX (trên cùng) */}
        <rect
          x="110" y="75" width="460" height="180" rx="4"
          fill="#EF4444" fillOpacity="0.07"
          stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 4" strokeOpacity="0.6"
        />
        <text x="340" y="170" fill="#FCA5A5" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VÙNG TRÁNH HEADER / TOP BAR: 400 PX
        </text>

        {/* 2. Vùng an toàn Chữ & Logo: 800 × 640 PX (ở giữa) */}
        <rect
          x="155" y="295" width="370" height="296" rx="6"
          fill="#F59E0B" fillOpacity="0.06"
          stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6"
        />

        {/* Chỉ báo lề 2 bên 140 PX */}
        <text x="132" y="445" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          140 PX
        </text>
        <text x="548" y="445" fill="#00E5FF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          140 PX
        </text>

        {/* Khối huy hiệu trung tâm Vùng an toàn */}
        <rect
          x="195" y="410" width="290" height="52" rx="6"
          fill="#140E05" stroke="#F59E0B" strokeWidth="1.5"
        />
        <text x="340" y="432" fill="#FBBF24" fontSize="11.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VÙNG AN TOÀN CHỮ &amp; LOGO
        </text>
        <text x="340" y="449" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          800 × 640 PX
        </text>

        {/* 3. Vùng tránh Nút cuộn & Dots: 400 PX (dưới cùng) */}
        <rect
          x="110" y="630" width="460" height="180" rx="4"
          fill="#EF4444" fillOpacity="0.07"
          stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 4" strokeOpacity="0.6"
        />
        <text x="340" y="725" fill="#FCA5A5" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VÙNG TRÁNH NÚT CUỘN &amp; DOTS: 400 PX
        </text>
      </svg>
    </div>
  );
}
