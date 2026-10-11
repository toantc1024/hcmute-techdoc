'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FlaskConical,
  GitCommit,
  History,
  ShieldCheck,
  Tag,
  X,
  XCircle,
} from 'lucide-react';

export interface ChangelogItem {
  version: string;
  date: string;
  description: string;
  highlights?: string[];
}

export interface DocumentMetaBarProps {
  status?: string;
  version?: string;
  updatedAt?: string;
  changelog?: ChangelogItem[];
}

const DEFAULT_CHANGELOG: ChangelogItem[] = [
  {
    version: 'v2.4',
    date: '11/10/2026',
    description: 'Chuẩn hoá bảo mật thông tin, tăng cường an toàn dữ liệu và bổ sung các quy trình vận hành',
    highlights: [
      'Thiết lập toàn diện Security Headers: CSP, HSTS, X-Content-Type-Options: nosniff, Permissions-Policy, Referrer-Policy.',
      'Loại bỏ wildcard CORS trên các phản hồi trang HTML nhằm bảo vệ nội dung tài liệu nội bộ.',
      'Quy tắc bảo vệ dữ liệu cá nhân: Che mờ email, tên tài khoản, mã hồ sơ và dữ liệu sinh viên trong toàn bộ ảnh minh hoạ.',
      'Quy trình báo cáo sự cố an ninh thông tin & cảnh báo tuyệt đối không gửi mật khẩu, token qua ticket hỗ trợ.',
      'Quy trình thu hồi quyền quản trị khi Thầy Cô chuyển đơn vị công tác hoặc nghỉ việc.',
      'Bảng cam kết thời gian phản hồi hỗ trợ kỹ thuật (SLA) và Bảng cấu hình thiết bị tối thiểu.',
    ],
  },
  {
    version: 'v2.3',
    date: '09/10/2026',
    description: 'Bổ sung cơ chế tạo chữ ký số định danh người tải và watermark bảo vệ bản quyền',
    highlights: [
      'Xác thực bắt buộc email định danh @hcmute.edu.vn (Thầy Cô) hoặc @student.hcmute.edu.vn (Sinh viên) khi xuất tài liệu PDF.',
      'Đóng dấu chữ ký số điện tử dưới chân trang: Ngày giờ tải — Người tải.',
      'Thêm watermark chéo trang HCM-UTE Tech Doc với độ mờ tinh tế 10%.',
    ],
  },
  {
    version: 'v2.2',
    date: '05/10/2026',
    description: 'Tối ưu hoá trải nghiệm người dùng đa thiết bị (Responsive Design)',
    highlights: [
      'Tương thích hoàn hảo trên điện thoại di động, máy tính bảng và màn hình Ultra-wide.',
      'Hỗ trợ biểu đồ Mermaid động và thanh công cụ tra cứu cấu trúc nhanh.',
    ],
  },
  {
    version: 'v2.0',
    date: '01/10/2026',
    description: 'Ban hành bộ tài liệu hướng dẫn kỹ thuật quản trị website đơn vị HCM-UTE',
    highlights: [
      'Chuẩn hoá 6 luồng vận hành quản trị từ khởi tạo, đăng tin, điều hướng đến phân quyền.',
      'Hướng dẫn tích hợp Trợ lý AI Copilot song ngữ và xuất bản tin bài khoa học.',
    ],
  },
  {
    version: 'v1.0',
    date: '15/09/2026',
    description: 'Phiên bản dự thảo ban đầu phục vụ nghiệm thu giai đoạn thử nghiệm hệ sinh thái.',
  },
];

export function DocumentMetaBar({
  status = 'đã ban hành',
  version = 'v2.4',
  updatedAt = '11/10/2026',
  changelog,
}: DocumentMetaBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeChangelog = changelog && changelog.length > 0 ? changelog : DEFAULT_CHANGELOG;

  // Lắng nghe phím ESC để đóng Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Chuẩn hoá nhãn trạng thái
  const normalizedStatus = (status || 'đã ban hành').toLowerCase().trim();

  const renderStatusBadge = () => {
    if (normalizedStatus === 'thử nghiệm') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
          <FlaskConical className="size-3 text-amber-600 dark:text-amber-400" />
          <span>Thử nghiệm</span>
        </span>
      );
    }
    if (normalizedStatus === 'hết hiệu lực') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
          <span className="size-1.5 rounded-full bg-rose-500" />
          <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
          <span>Hết hiệu lực</span>
        </span>
      );
    }
    // Mặc định: Đã ban hành
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
        <span>Đã ban hành</span>
      </span>
    );
  };

  return (
    <>
      {/* Thanh siêu dữ liệu bài viết (Metadata Bar) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2.5 my-3 text-xs border-y border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300">
        {/* Nhãn trạng thái */}
        {renderStatusBadge()}

        {/* Phiên bản tài liệu */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono font-medium border border-slate-200/80 dark:border-slate-700">
          <Tag className="size-3 text-[#0072BC] dark:text-sky-400" />
          <span>{version}</span>
        </span>

        {/* Ngày cập nhật */}
        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Calendar className="size-3.5 text-slate-400" />
          <span>Ngày cập nhật:</span>
          <strong className="font-medium text-slate-700 dark:text-slate-200">{updatedAt}</strong>
        </span>

        {/* Nút xem lịch sử thay đổi */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0072BC] hover:text-[#005a96] dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer ml-auto transition-colors hover:underline"
          title="Xem nhật ký và lịch sử thay đổi tài liệu"
        >
          <History className="size-3.5" />
          <span>Lịch sử thay đổi</span>
        </button>
      </div>

      {/* Modal Lịch sử thay đổi (Changelog Popover/Modal) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#0072BC]/10 flex items-center justify-center text-[#0072BC] dark:text-sky-400">
                  <History className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Lịch sử thay đổi & Nhật ký phiên bản
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cổng hướng dẫn kỹ thuật HCM-UTE TechDoc
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body - Timeline */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeChangelog.map((item, idx) => {
                const isCurrent = idx === 0;
                return (
                  <div key={item.version} className="relative pl-6 pb-2 border-l-2 border-slate-200 dark:border-slate-700 last:border-l-transparent">
                    {/* Chấm timeline */}
                    <div
                      className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                        isCurrent
                          ? 'border-[#0072BC] text-[#0072BC] dark:border-sky-400'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <div className={`size-1.5 rounded-full ${isCurrent ? 'bg-[#0072BC] dark:bg-sky-400' : 'bg-slate-400'}`} />
                    </div>

                    {/* Tiêu đề phiên bản & ngày */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-[#0072BC]/10 text-[#0072BC] dark:bg-sky-950/60 dark:text-sky-300 border border-[#0072BC]/20">
                        {item.version}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                          Hiện hành
                        </span>
                      )}
                      <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.date}
                      </span>
                    </div>

                    {/* Mô tả tóm tắt */}
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {item.description}
                    </p>

                    {/* Danh sách các điểm cập nhật nổi bật */}
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="space-y-1.5 pl-2 text-[11px] text-slate-600 dark:text-slate-400">
                        {item.highlights.map((hl, hlIdx) => (
                          <li key={hlIdx} className="flex items-start gap-1.5">
                            <span className="text-[#0072BC] dark:text-sky-400 mt-1 font-bold">•</span>
                            <span className="leading-relaxed">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Hệ thống chuẩn hoá tài liệu số HCM-UTE
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
