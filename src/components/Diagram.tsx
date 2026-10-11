'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon, MoveHorizontal, Sparkles } from 'lucide-react';
import { Diagram01Overview } from './diagrams/Diagram01Overview';
import { Diagram02Actions } from './diagrams/Diagram02Actions';
import { Diagram03Relations } from './diagrams/Diagram03Relations';
import { Diagram04PageFlow } from './diagrams/Diagram04PageFlow';
import { Diagram05ContentFlow } from './diagrams/Diagram05ContentFlow';
import { Diagram06MenuFlow } from './diagrams/Diagram06MenuFlow';
import { Diagram07UteAssistant } from './diagrams/Diagram07UteAssistant';
import { Mermaid } from './Mermaid';
import { mermaidDiagrams } from './diagrams/mermaidData';
import { withBasePath } from '@/configs/app.config';

interface DiagramProps {
  src?: string;
  caption?: string;
  alt?: string;
  id?: string;
  initialMode?: 'vector' | 'mermaid' | 'image';
}

export function Diagram({ src = '', caption, alt, id, initialMode }: DiagramProps) {
  // Nhận diện sơ đồ theo id hoặc tên tệp src
  const diagramKey = (() => {
    if (id === '01' || src.includes('01-tong-quan-to-chuc')) return '01';
    if (id === '02' || src.includes('02-chon-viec-can-lam')) return '02';
    if (id === '03' || src.includes('03-moi-quan-he')) return '03';
    if (id === '04' || src.includes('04-luong-a-trang')) return '04';
    if (id === '05' || src.includes('05-luong-b-noi-dung')) return '05';
    if (id === '06' || src.includes('06-luong-c-menu')) return '06';
    if (id === '07' || src.includes('07-tro-ly-ute')) return '07';
    return null;
  })();

  const hasVectorComponent = Boolean(diagramKey);
  const hasMermaidComponent = Boolean(diagramKey && mermaidDiagrams[diagramKey]);

  // Chế độ xem: ưu tiên 'vector' mặc định, hoặc 'mermaid' nếu có yêu cầu
  const [viewMode, setViewMode] = useState<'vector' | 'mermaid' | 'image'>(
    initialMode || (hasVectorComponent ? 'vector' : 'image')
  );

  const renderVectorDiagram = () => {
    switch (diagramKey) {
      case '01':
        return <Diagram01Overview />;
      case '02':
        return <Diagram02Actions />;
      case '03':
        return <Diagram03Relations />;
      case '04':
        return <Diagram04PageFlow />;
      case '05':
        return <Diagram05ContentFlow />;
      case '06':
        return <Diagram06MenuFlow />;
      case '07':
        return <Diagram07UteAssistant />;
      default:
        return null;
    }
  };

  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-4 shadow-sm hover:shadow-md transition">
      {(hasVectorComponent || hasMermaidComponent) && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          {/* Hướng dẫn trên di động */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MoveHorizontal className="size-3.5 text-[#0072BC] shrink-0" />
            <span className="hidden sm:inline">Chọn chế độ xem phù hợp hoặc bấm vào khối trong sơ đồ Mermaid để mở bài học</span>
            <span className="sm:hidden">Vuốt ngang để xem toàn bộ sơ đồ</span>
          </div>

          {/* Nút chuyển đổi chế độ xem */}
          <div className="flex flex-wrap items-center gap-1.5 self-end lg:self-auto ml-auto">
            {hasVectorComponent && (
              <button
                type="button"
                onClick={() => setViewMode('vector')}
                className={`inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 px-3 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
                  viewMode === 'vector'
                    ? 'bg-[#0072BC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Layers className="size-3.5" />
                <span>Sơ đồ khối vector</span>
              </button>
            )}

            {hasMermaidComponent && (
              <button
                type="button"
                onClick={() => setViewMode('mermaid')}
                className={`inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 px-3 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
                  viewMode === 'mermaid'
                    ? 'bg-[#0072BC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles className="size-3.5" />
                <span>Sơ đồ Mermaid (Điều hướng)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode('image')}
              className={`inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 px-3 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
                viewMode === 'image'
                  ? 'bg-[#0072BC] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <ImageIcon className="size-3.5" />
              <span>Ảnh gốc</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-950 flex justify-center [webkit-overflow-scrolling:touch]">
        {viewMode === 'mermaid' && hasMermaidComponent ? (
          <div className="w-full">
            <Mermaid chart={mermaidDiagrams[diagramKey!]} />
          </div>
        ) : viewMode === 'vector' && hasVectorComponent ? (
          <div className="w-full min-w-[720px] md:min-w-0">
            {renderVectorDiagram()}
          </div>
        ) : (
          <img
            src={withBasePath(src)}
            alt={alt || caption || 'Sơ đồ hướng dẫn'}
            className="w-full h-auto max-h-[85vh] object-contain"
            loading="lazy"
          />
        )}
      </div>

      {caption && (
        <figcaption className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
