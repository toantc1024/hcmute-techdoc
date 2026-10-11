import React from 'react';

interface DiagramProps {
  src: string;
  caption?: string;
  alt?: string;
}

export function Diagram({ src, caption, alt }: DiagramProps) {
  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-sm hover:shadow-md transition">
      <div className="overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-950 flex justify-center">
        <img
          src={src}
          alt={alt || caption || 'Sơ đồ hướng dẫn'}
          className="w-full h-auto max-h-[85vh] object-contain"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
