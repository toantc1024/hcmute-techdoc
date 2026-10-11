'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon } from 'lucide-react';
import { Diagram02Actions } from './diagrams/Diagram02Actions';

interface DiagramProps {
  src?: string;
  caption?: string;
  alt?: string;
  id?: string;
}

export function Diagram({ src = '', caption, alt, id }: DiagramProps) {
  // Determine if there is a vector component available
  const isDiagram02 = id === '02' || src.includes('02-chon-viec-can-lam');
  const hasVectorComponent = isDiagram02;

  const [viewMode, setViewMode] = useState<'vector' | 'image'>(hasVectorComponent ? 'vector' : 'image');

  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-sm hover:shadow-md transition">
      {hasVectorComponent && (
        <div className="flex justify-end gap-1.5 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('vector')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              viewMode === 'vector'
                ? 'bg-[#0072BC] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="size-3.5" />
            <span>Sơ đồ khối vector</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              viewMode === 'image'
                ? 'bg-[#0072BC] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="size-3.5" />
            <span>Ảnh gốc</span>
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-950 flex justify-center">
        {hasVectorComponent && viewMode === 'vector' ? (
          <div className="w-full">
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
        <figcaption className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
