'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Printer, ShieldCheck, Mail, AlertCircle, X, Download, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'hcmute_techdoc_pdf_email';

export function ExportPdfButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [downloadTime, setDownloadTime] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const [articleNode, setArticleNode] = useState<HTMLElement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo trạng thái và đọc email đã lưu từ localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEmail(saved);
        setVerifiedEmail(saved);
      }
    } catch (_) {}

    // Tìm phần tử bài viết nd-page để gắn khối chứng thực cuối trang
    const el = document.getElementById('nd-page') || document.querySelector('article') || document.querySelector('main');
    if (el) {
      setArticleNode(el as HTMLElement);
    }
  }, []);

  // Tự động focus ô nhập email khi mở modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpenModal = () => {
    setError(null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setError(null);
  };

  // Hỗ trợ điền nhanh đuôi tên miền
  const handleApplyDomain = (domain: '@hcmute.edu.vn' | '@student.hcmute.edu.vn') => {
    const prefix = email.split('@')[0].trim();
    if (prefix) {
      setEmail(`${prefix}${domain}`);
    } else {
      setEmail(domain);
    }
    setError(null);
    inputRef.current?.focus();
  };

  // Xác thực định dạng email trường cấp
  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim().toLowerCase();
    // Bắt buộc kết thúc bằng @hcmute.edu.vn hoặc @student.hcmute.edu.vn
    const regex = /^[a-zA-Z0-9._%+-]+@(hcmute\.edu\.vn|student\.hcmute\.edu\.vn)$/;
    return regex.test(trimmed);
  };

  // Xác nhận và kích hoạt hộp thoại in xuất PDF
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setError('Vui lòng nhập địa chỉ email trường cấp để tiếp tục.');
      inputRef.current?.focus();
      return;
    }

    if (!validateEmail(trimmed)) {
      setError('Email không hợp lệ. Vui lòng sử dụng đúng email trường cấp: đuôi @hcmute.edu.vn hoặc @student.hcmute.edu.vn.');
      inputRef.current?.focus();
      return;
    }

    // Định dạng thời gian theo chuẩn Việt Nam
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ngày ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    setVerifiedEmail(trimmed);
    setDownloadTime(timeStr);
    setError(null);
    setIsOpen(false);

    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch (_) {}

    // Chờ React cập nhật DOM cho watermark và chữ ký chân trang trước khi mở cửa sổ in
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 180);
  };

  return (
    <>
      {/* Nút bấm Xuất PDF trên thanh công cụ tài liệu */}
      <button
        type="button"
        onClick={handleOpenModal}
        title="In hoặc xuất trang hướng dẫn này ra file PDF có chữ ký xác thực"
        className="inline-flex min-h-[44px] sm:min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/60 px-3.5 py-2 text-xs sm:text-xs font-semibold text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground active:scale-95 transition cursor-pointer"
      >
        <Printer className="size-4 shrink-0 text-[#0072BC]" />
        <span>Xuất PDF</span>
      </button>

      {/* Modal yêu cầu nhập email @hcmute.edu.vn / @student.hcmute.edu.vn */}
      {isOpen && mounted && typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          >
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
              {/* Nút đóng modal */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Đóng (Esc)"
              >
                <X className="size-4" />
              </button>

              {/* Header modal */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#0072BC] dark:text-sky-400 shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 id="pdf-modal-title" className="font-bold text-base text-[#004776] dark:text-sky-300">
                    Xác thực tải tài liệu kỹ thuật
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Tài liệu nội bộ HCM-UTE TECH DOC tích hợp chữ ký điện tử và watermark định danh người tải.
                  </p>
                </div>
              </div>

              {/* Form nhập email */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label htmlFor="user-email-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Địa chỉ email trường cấp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="size-4" />
                    </div>
                    <input
                      ref={inputRef}
                      id="user-email-input"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="vidu@hcmute.edu.vn hoặc sv@student.hcmute.edu.vn"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:border-[#0072BC] transition"
                    />
                  </div>

                  {/* Nút bấm điền nhanh tên miền */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
                    <span className="text-slate-400 font-medium">Gợi ý nhanh:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyDomain('@hcmute.edu.vn')}
                      className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-[#0072BC] dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition cursor-pointer font-mono"
                    >
                      + @hcmute.edu.vn (Thầy Cô)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyDomain('@student.hcmute.edu.vn')}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer font-mono"
                    >
                      + @student.hcmute.edu.vn (Sinh viên)
                    </button>
                  </div>
                </div>

                {/* Thông báo lỗi nếu email không hợp lệ */}
                {error && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Lời giải thích chữ ký & watermark */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Chữ ký số chân trang: Ngày giờ tải — Người tải</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Watermark chéo trang: HCM-UTE Tech Doc (độ mờ 10%)</span>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-[38px] items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Tạo chữ ký & Tải PDF</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* =========================================================================
          CÁC THÀNH PHẦN XUẤT HIỆN TRÊN FILE PDF (CHỈ HIỂN THỊ KHI PRINT/XUẤT PDF)
          ========================================================================= */}
      {mounted && verifiedEmail && typeof document !== 'undefined' &&
        createPortal(
          <>
            {/* 1. Watermark HCM-UTE Tech Doc đặt chéo trang PDF với độ mờ 10% */}
            <div className="pdf-watermark-overlay" aria-hidden="true">
              <div
                style={{
                  transform: 'rotate(-32deg)',
                  opacity: 0.10,
                }}
                className="select-none text-center pointer-events-none"
              >
                <div className="text-[52pt] font-black tracking-[0.22em] uppercase text-[#004776] whitespace-nowrap leading-none font-sans">
                  HCM-UTE Tech Doc
                </div>
                <div className="text-[12pt] font-semibold tracking-wider text-[#0072BC] mt-3 uppercase font-mono">
                  Định danh tải: {verifiedEmail} • {downloadTime}
                </div>
              </div>
            </div>

            {/* 2. Dòng chữ ký cố định dưới chân trang lặp lại ở đáy mỗi trang PDF */}
            <div className="pdf-running-footer" aria-hidden="true">
              <div className="flex items-center gap-1.5 font-semibold text-[#004776]">
                <span>HCM-UTE TECH DOC</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-normal">Cổng hướng dẫn quản trị website</span>
              </div>
              <div className="text-right font-medium text-slate-700">
                <span>Ngày giờ tải: <strong className="text-[#004776] font-semibold">{downloadTime}</strong></span>
                <span className="mx-2 text-slate-400">—</span>
                <span>Người tải: <strong className="text-[#004776] font-semibold">{verifiedEmail}</strong></span>
              </div>
            </div>
          </>,
          document.body
        )}

      {/* 3. Khối chứng thực bản sao điện tử gắn ở cuối bài viết (sau nội dung MDX) */}
      {mounted && verifiedEmail && typeof document !== 'undefined' && articleNode &&
        createPortal(
          <div className="pdf-signature-block" aria-hidden="true">
            <div className="rounded-xl border border-slate-300 p-4 bg-slate-50/80 text-[9pt] text-slate-700">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-[#004776] uppercase tracking-wide">
                  Chứng thực bản sao điện tử — Trường Đại học Sư phạm Kỹ thuật TP.HCM
                </span>
                <span className="font-mono text-slate-500 text-[8pt]">techdoc.utehub.vn</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[9.5pt]">
                <div>
                  <span className="text-slate-500">Người tải tài liệu: </span>
                  <strong className="text-[#004776] font-semibold">{verifiedEmail}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Ngày giờ tải: </span>
                  <strong className="text-slate-800 font-semibold">{downloadTime}</strong>
                </div>
              </div>
              <p className="mt-2 text-[8pt] text-slate-500 italic">
                * Bản sao điện tử này được trích xuất trực tiếp từ cổng hướng dẫn HCM-UTE TECH DOC và có giá trị lưu hành nội bộ theo tài khoản định danh của người tải.
              </p>
            </div>
          </div>,
          articleNode
        )}
    </>
  );
}
