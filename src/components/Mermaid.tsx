'use client';

import React, { useEffect, useId, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Check,
  MousePointerClick,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
} from 'lucide-react';
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
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Refs để hỗ trợ kéo rê (drag to pan) khi phóng to
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Xử lý zoom
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(Math.round((prev + 0.25) * 100) / 100, 2.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(Math.round((prev - 0.25) * 100) / 100, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Hỗ trợ cuộn chuột + phím Ctrl / Cmd để thu phóng
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setZoom((prev) => Math.min(Math.round((prev + 0.15) * 100) / 100, 2.5));
        } else {
          setZoom((prev) => Math.max(Math.round((prev - 0.15) * 100) / 100, 0.5));
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Nhấn phím Escape để đóng chế độ toàn màn hình
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Kết xuất biểu đồ Mermaid
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
          // Trích xuất chiều rộng gốc từ 4 thông số của viewBox: minX minY width height
          const vbMatch = svg.match(/viewBox=["']\s*(-?[0-9.]+)\s+(-?[0-9.]+)\s+([0-9.]+)\s+([0-9.]+)["']/i);
          if (vbMatch) {
            const w = parseFloat(vbMatch[3]);
            if (w > 50) {
              setNaturalWidth(w);
            }
          }

          // Xóa max-width ở thẻ svg gốc để việc phóng to bằng CSS diễn ra chuẩn xác
          const cleanedSvg = svg.replace(/<svg([^>]*)style="([^"]*)"/i, (m, prefix, style) => {
            const cleanStyle = style.replace(/max-width:\s*[^;"]+;?/gi, '');
            return `<svg${prefix}style="${cleanStyle}"`;
          });

          setSvgContent(cleanedSvg);
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
    const handleAnchorClick = (e: MouseEvent) => {
      // Nếu vừa thao tác kéo rê chuột (drag to pan) thì không kích hoạt điều hướng
      if (hasDraggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const anchor = (e.target as Element)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || anchor.getAttribute('xlink:href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        if (isFullscreen) {
          setIsFullscreen(false);
        }
        router.push(withBasePath(href));
      }
    };

    const c1 = containerRef.current;
    const c2 = fullscreenContainerRef.current;
    if (c1) c1.addEventListener('click', handleAnchorClick);
    if (c2) c2.addEventListener('click', handleAnchorClick);

    return () => {
      if (c1) c1.removeEventListener('click', handleAnchorClick);
      if (c2) c2.removeEventListener('click', handleAnchorClick);
    };
  }, [svgContent, router, isFullscreen]);

  // Thao tác kéo rê chuột (drag to pan)
  const handleMouseDown = (targetContainer: HTMLDivElement | null) => (e: React.MouseEvent) => {
    if (e.button !== 0 || !targetContainer) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: targetContainer.scrollLeft,
      scrollTop: targetContainer.scrollTop,
    };
  };

  const handleMouseMove = (targetContainer: HTMLDivElement | null) => (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !targetContainer) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDraggedRef.current = true;
    }
    targetContainer.scrollLeft = startPosRef.current.scrollLeft - dx;
    targetContainer.scrollTop = startPosRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Nhấp đúp vào sơ đồ để chuyển đổi nhanh giữa 100% và 150%
  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
    setZoom((prev) => (prev <= 1 ? 1.5 : 1));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasClickableNodes = content.includes('click ');
  const zoomPercent = Math.round(zoom * 100);

  return (
    <>
      <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-5 shadow-sm hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          {/* Tiêu đề sơ đồ khối (đã bỏ icon theo yêu cầu) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC]">
            <span>Sơ đồ khối</span>
            {hasClickableNodes && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#0072BC] dark:text-sky-300 font-medium text-[11px] border border-sky-200 dark:border-sky-800">
                <MousePointerClick className="size-3" />
                <span>Bấm vào khối để mở HDSD tác vụ tương ứng</span>
              </span>
            )}
          </div>

          {/* Thanh công cụ: Thu phóng (Zoom in/out/reset/toàn màn hình) và Sao chép */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
            {/* Bộ nút thu phóng */}
            <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="inline-flex min-h-[30px] min-w-[30px] items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95"
                title="Thu nhỏ sơ đồ (-25%)"
                aria-label="Thu nhỏ sơ đồ"
              >
                <ZoomOut className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="inline-flex min-h-[30px] px-2 items-center justify-center rounded-md text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer active:scale-95 min-w-[46px] text-center"
                title="Nhấp để đặt lại kích thước mặc định (100%)"
              >
                {zoomPercent}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 2.5}
                className="inline-flex min-h-[30px] min-w-[30px] items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95"
                title="Phóng to sơ đồ (+25%)"
                aria-label="Phóng to sơ đồ"
              >
                <ZoomIn className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="inline-flex min-h-[30px] min-w-[30px] items-center justify-center rounded-md text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer active:scale-95 border-l border-slate-200 dark:border-slate-700 ml-0.5"
                title="Đặt lại mặc định (100%)"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>

            {/* Nút xem toàn màn hình */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex min-h-[30px] items-center gap-1 px-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
              title="Xem sơ đồ toàn màn hình (phóng to cực đại)"
            >
              <Maximize2 className="size-3.5" />
              <span className="hidden sm:inline text-[11px]">Toàn màn hình</span>
            </button>

            {/* Nút sao chép mã */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[30px] items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
              title="Sao chép mã nguồn Mermaid"
            >
              {copied ? <Check className="size-3.5 text-[#16A34A]" /> : <Copy className="size-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Khung hiển thị sơ đồ */}
        <div
          ref={containerRef}
          onMouseDown={(e) => handleMouseDown(containerRef.current)(e)}
          onMouseMove={(e) => handleMouseMove(containerRef.current)(e)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className={`overflow-auto max-h-[85vh] rounded-lg bg-slate-50 dark:bg-slate-950 p-2 sm:p-4 flex justify-center [webkit-overflow-scrolling:touch] select-none ${
            zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
          title="Nhấp đúp vào sơ đồ để phóng to/thu nhỏ nhanh, hoặc kéo chuột để di chuyển khi phóng to"
        >
          {error ? (
            <div className="text-xs text-red-500 p-4">
              <p className="font-semibold mb-1">Lỗi cú pháp Mermaid:</p>
              <pre className="bg-red-50 dark:bg-red-950/30 p-2 rounded">{error}</pre>
              <pre className="mt-2 text-slate-500">{content}</pre>
            </div>
          ) : svgContent ? (
            <div
              style={{
                width: `${zoomPercent}%`,
                minWidth: zoom > 1 ? `${zoomPercent}%` : undefined,
                maxWidth: zoom === 1 && naturalWidth ? `${naturalWidth}px` : 'none',
                transition: isDragging ? 'none' : 'width 0.15s ease, min-width 0.15s ease',
              }}
              className="flex justify-center [&>svg]:!w-full [&>svg]:!h-auto [&>svg]:!max-w-none [&_a]:cursor-pointer [&_a:hover_rect]:stroke-[#0072BC] [&_a:hover_rect]:stroke-[2.5px] [&_a:hover_polygon]:stroke-[#0072BC] [&_a:hover_polygon]:stroke-[2.5px] [&_a:hover_circle]:stroke-[#0072BC] [&_a:hover]:filter [&_a:hover]:drop-shadow-md"
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

      {/* Modal phóng to toàn màn hình */}
      {isFullscreen && mounted && typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-150"
          >
            {/* Header modal toàn màn hình */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-sky-400">Sơ đồ khối</span>
                {caption && (
                  <span className="text-xs sm:text-sm text-slate-300 hidden md:inline truncate max-w-lg">
                    — {caption}
                  </span>
                )}
                {hasClickableNodes && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 text-[11px] border border-sky-800">
                    <MousePointerClick className="size-3" />
                    <span>Bấm vào khối để mở HDSD</span>
                  </span>
                )}
              </div>

              {/* Bộ điều khiển thu phóng & đóng trong modal */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Thu nhỏ sơ đồ"
                  >
                    <ZoomOut className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="inline-flex min-h-[32px] px-2.5 items-center justify-center rounded-md text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition cursor-pointer min-w-[50px] text-center"
                    title="Đặt lại kích thước mặc định (100%)"
                  >
                    {zoomPercent}%
                  </button>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Phóng to sơ đồ"
                  >
                    <ZoomIn className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer border-l border-slate-700 ml-0.5"
                    title="Đặt lại 100%"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="inline-flex min-h-[34px] items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer active:scale-95"
                  title="Đóng chế độ toàn màn hình (Phím Esc)"
                >
                  <X className="size-4" />
                  <span className="hidden sm:inline">Đóng (Esc)</span>
                </button>
              </div>
            </div>

            {/* Thân modal toàn màn hình có thể kéo rê */}
            <div
              ref={fullscreenContainerRef}
              onMouseDown={(e) => handleMouseDown(fullscreenContainerRef.current)(e)}
              onMouseMove={(e) => handleMouseMove(fullscreenContainerRef.current)(e)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
              className={`overflow-auto flex-1 flex justify-center items-center p-4 sm:p-8 select-none ${
                zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
              title="Nhấp đúp để phóng to/thu nhỏ nhanh, hoặc kéo chuột để di chuyển sơ đồ"
            >
              <div
                style={{
                  width: `${zoomPercent}%`,
                  minWidth: zoom > 1 ? `${zoomPercent}%` : undefined,
                  maxWidth: zoom === 1 && naturalWidth ? `${naturalWidth}px` : 'none',
                  transition: isDragging ? 'none' : 'width 0.15s ease, min-width 0.15s ease',
                }}
                className="flex justify-center [&>svg]:!max-w-none [&>svg]:!w-full [&>svg]:!h-auto [&_a]:cursor-pointer [&_a:hover_rect]:stroke-sky-400 [&_a:hover_rect]:stroke-[2.5px] [&_a:hover_polygon]:stroke-sky-400 [&_a:hover_polygon]:stroke-[2.5px] [&_a:hover_circle]:stroke-sky-400 [&_a:hover]:filter [&_a:hover]:drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
