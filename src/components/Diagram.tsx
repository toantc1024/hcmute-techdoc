'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon, MoveHorizontal } from 'lucide-react';
import { Diagram01Overview } from './diagrams/Diagram01Overview';
import { Diagram02Actions } from './diagrams/Diagram02Actions';
import { Diagram03Relations } from './diagrams/Diagram03Relations';
import { Diagram04PageFlow } from './diagrams/Diagram04PageFlow';
import { Diagram05ContentFlow } from './diagrams/Diagram05ContentFlow';
import { Diagram06MenuFlow } from './diagrams/Diagram06MenuFlow';
import { Diagram07UteAssistant } from './diagrams/Diagram07UteAssistant';

interface DiagramProps {
  src?: string;
  caption?: string;
  alt?: string;
  id?: string;
}

export function Diagram({ src = '', caption, alt, id }: DiagramProps) {
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

  // Mặc định luôn ưu tiên hiển thị sơ đồ khối vector
  const [viewMode, setViewMode] = useState<'vector' | 'image'>(
    hasVectorComponent ? 'vector' : 'image'
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
      {hasVectorComponent && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          {/* Hướng dẫn trên di động */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:hidden">
            <MoveHorizontal className="size-3.5 text-[#0072BC]" />
            <span>Vuốt ngang để xem toàn bộ sơ đồ</span>
          </div>

          {/* Nút chuyển đổi chế độ xem */}
          <div className="flex items-center gap-2 self-end sm:self-auto ml-auto">
            <button
              type="button"
              onClick={() => setViewMode('vector')}
              className={`inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 px-3.5 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
                viewMode === 'vector'
                  ? 'bg-[#0072BC] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Layers className="size-3.5" />
              <span>Sơ đồ khối vector</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('image')}
              className={`inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 px-3.5 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
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
        {hasVectorComponent && viewMode === 'vector' ? (
          <div className="w-full min-w-[720px] md:min-w-0">
            {renderVectorDiagram()}
          </div>
        ) : (
          <img
            src={src}
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
