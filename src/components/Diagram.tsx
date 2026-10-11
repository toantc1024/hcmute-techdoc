'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon, MoveHorizontal } from 'lucide-react';
import { Diagram02Actions } from './diagrams/Diagram02Actions';

interface DiagramProps {
  src?: string;
  caption?: string;
  alt?: string;
  id?: string;
}

export function Diagram({ src = '', caption, alt, id }: DiagramProps) {
  const isDiagram02 = id === '02' || src.includes('02-chon-viec-can-lam');
  const hasVectorComponent = isDiagram02;

  const [viewMode, setViewMode] = useState<'vector' | 'image'>(hasVectorComponent ? 'vector' : 'image');

  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-4 shadow-sm hover:shadow-md transition">
      {hasVectorComponent && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          {/* Mobile hint */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:hidden">
            <MoveHorizontal className="size-3.5 text-[#0072BC]" />
            <span>Vuốt ngang để xem toàn bộ sơ đồ</span>
          </div>

          {/* Toggle buttons */}
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
            {isDiagram02 && <Diagram02Actions />}
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
