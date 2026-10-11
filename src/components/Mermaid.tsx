'use client';

import React, { useEffect, useId, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Sparkles, MousePointerClick } from 'lucide-react';
import { withBasePath } from '@/configs/app.config';

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
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!content) return;
      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            fontFamily: 'inherit',
            fontSize: '13px',
            darkMode: isDark,
            // Bảng màu chuẩn thương hiệu HCM-UTE
            // Xanh dương chủ đạo: #0072BC, Xanh đậm Navy: #003D66, Đỏ điểm nhấn: #ED1C24
            background: isDark ? '#020617' : '#FFFFFF',
            mainBkg: isDark ? '#0F172A' : '#FFFFFF',
            nodeBorder: isDark ? '#0284C7' : '#0072BC',
            primaryColor: isDark ? '#0F2942' : '#F0F9FF',
            primaryBorderColor: isDark ? '#0284C7' : '#0072BC',
            primaryTextColor: isDark ? '#E0F2FE' : '#003D66',
            lineColor: isDark ? '#38BDF8' : '#0072BC',
            secondaryColor: isDark ? '#451A03' : '#FEF3C7',
            secondaryBorderColor: isDark ? '#D97706' : '#D97706',
            secondaryTextColor: isDark ? '#FEF08A' : '#92400E',
            tertiaryColor: isDark ? '#052E16' : '#F0FDF4',
            tertiaryBorderColor: isDark ? '#16A34A' : '#16A34A',
            tertiaryTextColor: isDark ? '#BBF7D0' : '#15803D',
            clusterBkg: isDark ? '#0B1726' : '#F8FAFC',
            clusterBorder: isDark ? '#0284C7' : '#0072BC',
            edgeLabelBackground: isDark ? '#1E293B' : '#FFFFFF',
            titleColor: isDark ? '#38BDF8' : '#0072BC',
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

  // Xử lý điều hướng khi bấm vào các khối liên kết (interactive nodes)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || anchor.getAttribute('xlink:href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        router.push(withBasePath(href));
      }
    };

    container.addEventListener('click', handleAnchorClick);
    return () => {
      container.removeEventListener('click', handleAnchorClick);
    };
  }, [svgContent, router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasClickableNodes = content.includes('click ');

  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC]">
          <Sparkles className="size-4 shrink-0" />
          <span>Sơ đồ khối Mermaid (Chuẩn nhận diện HCM-UTE)</span>
          {hasClickableNodes && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#0072BC] dark:text-sky-300 font-medium text-[11px] border border-sky-200 dark:border-sky-800">
              <MousePointerClick className="size-3" />
              <span>Bấm vào khối để mở bài học</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[36px] items-center gap-1.5 self-end sm:self-auto px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
          title="Sao chép mã nguồn Mermaid"
        >
          {copied ? <Check className="size-3.5 text-[#16A34A]" /> : <Copy className="size-3.5" />}
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
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto [&_a]:cursor-pointer [&_a:hover_rect]:stroke-[#0072BC] [&_a:hover_rect]:stroke-[2.5px] [&_a:hover_polygon]:stroke-[#0072BC] [&_a:hover_polygon]:stroke-[2.5px] [&_a:hover_circle]:stroke-[#0072BC] [&_a:hover]:filter [&_a:hover]:drop-shadow-md transition"
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
