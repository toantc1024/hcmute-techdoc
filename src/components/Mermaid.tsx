'use client';

import React, { useEffect, useId, useState, useRef } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
  caption?: string;
}

export function Mermaid({ chart, children, caption }: MermaidProps) {
  const content = (chart || (typeof children === 'string' ? children : '')).trim();
  const uniqueId = `mermaid-${useId().replace(/[:]/g, '')}`;
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!content) return;
      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'base',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#F0F9FF',
            primaryBorderColor: '#0284C7',
            primaryTextColor: '#004776',
            lineColor: '#0284C7',
            secondaryColor: '#FEF3C7',
            tertiaryColor: '#F0FDF4',
            fontSize: '13px',
            fontFamily: 'inherit',
          },
        });

        const { svg } = await mermaid.render(uniqueId, content);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Không thể kết xuất sơ đồ Mermaid');
        }
      }
    }

    renderChart();

    // Lắng nghe thay đổi theme dark/light
    const observer = new MutationObserver(() => {
      renderChart();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [content, uniqueId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0072BC]">
          <Sparkles className="size-4" />
          <span>Sơ đồ khối Mermaid</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
          title="Sao chép mã nguồn Mermaid"
        >
          {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-950 p-2 sm:p-4 flex justify-center [webkit-overflow-scrolling:touch]"
      >
        {error ? (
          <div className="text-xs text-red-500 p-4">
            <p className="font-semibold mb-1">Lỗi cú pháp Mermaid:</p>
            <pre className="bg-red-50 dark:bg-red-950/30 p-2 rounded">{error}</pre>
            <pre className="mt-2 text-slate-500">{content}</pre>
          </div>
        ) : svgContent ? (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="py-8 text-xs text-slate-400 animate-pulse">Đang dựng sơ đồ Mermaid...</div>
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
