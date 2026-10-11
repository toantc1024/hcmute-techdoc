'use client';

import React from 'react';
import { Mermaid } from './Mermaid';
import { mermaidDiagrams } from './diagrams/mermaidData';
import { withBasePath } from '@/configs/app.config';

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

  const mermaidChart = diagramKey ? mermaidDiagrams[diagramKey] : null;

  // Nếu là 1 trong 7 sơ đồ cốt lõi, hiển thị duy nhất sơ đồ khối Mermaid đầy đủ thông tin & điều hướng tương tác
  if (mermaidChart) {
    return <Mermaid chart={mermaidChart} caption={caption} />;
  }

  // Fallback dành cho hình ảnh minh họa thông thường (nếu có)
  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-4 shadow-sm hover:shadow-md transition">
      <div className="overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-950 flex justify-center [webkit-overflow-scrolling:touch]">
        <img
          src={withBasePath(src)}
          alt={alt || caption || 'Sơ đồ hướng dẫn'}
          className="w-full h-auto max-h-[85vh] object-contain"
          loading="lazy"
        />
      </div>

      {caption && (
        <figcaption className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
