'use client';

import React from "react";
import Link from "next/link";
import {
  Printer,
  Download,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Compass,
  Keyboard,
  Info,
  ExternalLink,
  Phone,
  Mail,
  Building,
  HelpCircle,
  FileUp,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export default function PocketGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F19] text-[#1E293B] dark:text-[#E2E8F0] py-6 px-3 sm:px-6">
      
      {/* =========================================================================
          THANH ĐIỀU KHIỂN TRÊN MÀN HÌNH (ẨN KHI IN / XUẤT PDF)
          ========================================================================= */}
      <div className="no-print max-w-5xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-xs">
          
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted/50"
            >
              <ArrowLeft className="size-4" />
              <span>Cổng tài liệu</span>
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="size-3" />
                <span>Bản in chuẩn A4 (2 Trang)</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Sổ tay Quản trị Website Bỏ túi (Pocket Guide)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0072BC] hover:bg-[#005A96] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Printer className="size-4" />
              <span>In / Lưu file PDF (2 Trang A4)</span>
            </button>
          </div>

        </div>

        {/* Hướng dẫn cấu hình in tối ưu */}
        <div className="mt-3 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] sm:text-xs text-blue-900 dark:text-blue-200 flex items-start sm:items-center gap-2">
          <Info className="size-4 text-[#0072BC] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Mẹo xuất PDF đẹp nhất:</strong> Trong hộp thoại in của trình duyệt (Ctrl/Cmd + P), chọn <em>Lưu dưới dạng PDF</em>, Khổ giấy <em>A4</em>, Tỷ lệ <em>100%</em> (hoặc <em>Vừa trang in</em>) và bật tùy chọn <strong>Đồ họa nền (Background graphics)</strong>.
          </span>
        </div>
      </div>

      {/* =========================================================================
          KHUNG TÀI LIỆU 2 TRANG A4 (HIỂN THỊ CHUẨN MỰC & TỐI ƯU KHI IN)
          ========================================================================= */}
      <div className="pocket-guide-wrapper max-w-5xl mx-auto space-y-8 print:space-y-0">

        {/* -----------------------------------------------------------------------
            TRANG 1: NỀN TẢNG CỐT LÕI, SƠ ĐỒ ĐIỀU HƯỚNG & PHÍM TẮT
            ----------------------------------------------------------------------- */}
        <div className="pocket-page bg-white text-[#0F172A] border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 print:border-none print:shadow-none print:rounded-none print:p-0">
          
          {/* HEADER TRANG 1 */}
          <div className="border-b-2 border-[#0072BC] pb-3 mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="HCM-UTE Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh · Cổng thông tin & Website Đơn vị
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#004776] uppercase tracking-tight leading-none mt-0.5">
                  SỔ TAY QUẢN TRỊ WEBSITE BỎ TÚI
                </h2>
                <div className="text-[11px] font-medium text-slate-600 mt-1">
                  Cẩm nang tóm lược quy trình tác nghiệp, phím tắt & tiêu chuẩn kỹ thuật (Dành cho Thầy/Cô BTV & QTV)
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 text-[10px] text-slate-500 border-l border-slate-200 pl-3">
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-[#004776] font-bold text-[9px] mb-1">
                TRANG 1 / 2
              </span>
              <div>Phiên bản: <strong>v2.4 (10/2026)</strong></div>
              <div>Quy chế: <strong>188/QĐ-ĐHCNKT</strong></div>
            </div>
          </div>

          {/* KHỐI 1: 3 CẤU TRÚC NỘI DUNG CỐT LÕI (BẮT BUỘC PHÂN BIỆT) */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>I. Ba Cấu trúc Nội dung Cốt lõi (Bắt buộc phân biệt)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Trang con */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#004776]">
                    <Layers className="size-3.5 text-[#0072BC]" />
                    <span>1. Trang con (Page)</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-200/80 text-blue-900 rounded">
                    Cố định
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug mb-1.5">
                  Nội dung tĩnh, cấu trúc thông tin ít thay đổi: Giới thiệu, Cơ cấu tổ chức, Chương trình đào tạo, Phòng thí nghiệm.
                </p>
                <div className="text-[9.5px] text-slate-500 border-t border-blue-200/60 pt-1">
                  <strong>Thao tác:</strong> Chọn khối mẫu (Blocks) → Đặt URL thân thiện → Công bố → Gắn vào Mega Menu.
                </div>
              </div>

              {/* Tin tức & Văn bản */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                    <FileText className="size-3.5 text-emerald-600" />
                    <span>2. Tin tức / PDF (Post)</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-200/80 text-emerald-900 rounded">
                    Biến động
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug mb-1.5">
                  Dòng thời gian cập nhật liên tục: Tin tức hoạt động, Sự kiện, Thông báo học vụ, Quyết định, Biểu mẫu PDF.
                </p>
                <div className="text-[9.5px] text-slate-500 border-t border-emerald-200/60 pt-1">
                  <strong>Thao tác:</strong> Soạn thảo WYSIWYG → Chọn Chuyên mục → Ảnh bìa 16:9 → Đính kèm PDF → Duyệt.
                </div>
              </div>

              {/* Menu điều hướng */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                    <Compass className="size-3.5 text-purple-600" />
                    <span>3. Menu điều hướng</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-200/80 text-purple-900 rounded">
                    Dẫn đường
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug mb-1.5">
                  Khung xương dẫn lối người dùng: Mega Menu đầu trang (tối đa 3 cấp) và Khối liên kết nhanh chân trang (Footer).
                </p>
                <div className="text-[9.5px] text-slate-500 border-t border-purple-200/60 pt-1">
                  <strong>Thao tác:</strong> Vào Quản trị Menu → Kéo thả danh mục → Gán URL đích → Lưu và xóa bộ nhớ đệm.
                </div>
              </div>

            </div>
          </div>

          {/* KHỐI 2: SƠ ĐỒ 3 LUỒNG TÁC VỤ CHÍNH (QUY TRÌNH TỪNG BƯỚC) */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>II. Sơ đồ 3 Luồng Tác vụ Nghiệp vụ Trọng tâm</span>
            </div>

            <div className="space-y-2">
              
              {/* Luồng A */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[#004776]">
                    Luồng A: Quản trị & Tạo Trang con mới (Page Builder)
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-medium">
                    Quyền hạn: Unit Admin / BTV được ủy quyền
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    1. Chọn mẫu trang
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    2. Nhập khối nội dung
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    3. Đặt URL chuẩn SEO
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-blue-300 bg-blue-50/50 font-bold text-[#0072BC]">
                    4. Xuất bản trang
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-emerald-300 bg-emerald-50/50 font-bold text-emerald-700">
                    5. Gắn vào Mega Menu
                  </div>
                </div>
              </div>

              {/* Luồng B */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[#004776]">
                    Luồng B: Đăng Tin tức, Sự kiện & Văn bản Biểu mẫu PDF (Post Publishing)
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-medium">
                    Quyền hạn: Biên tập viên (Soạn) → Lãnh đạo đơn vị (Duyệt)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    1. Soạn tiêu đề & nội dung
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-amber-300 bg-amber-50/50 font-bold text-amber-800">
                    2. Chọn Chuyên mục
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    3. Đặt ảnh bìa 16:9
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    4. Đính kèm PDF (nếu có)
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-emerald-300 bg-emerald-50/50 font-bold text-emerald-700">
                    5. Duyệt & Công bố
                  </div>
                </div>
              </div>

              {/* Luồng C */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[#004776]">
                    Luồng C: Cấu hình Menu Đầu trang & Chân trang (Mega Menu & Footer)
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-medium">
                    Quyền hạn: Unit Admin đơn vị
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    1. Mở Cấu hình Menu
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    2. Chọn Cột Mega Menu
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    3. Thêm mục & Gán URL
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                    4. Lưu thay đổi
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-purple-300 bg-purple-50/50 font-bold text-purple-700">
                    5. Thử nghiệm Tab ẩn danh
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* KHỐI 3: PHÍM TẮT & THÔNG SỐ VÀNG VẬN HÀNH */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>III. Bảng Phím tắt & Thông số Kỹ thuật Chuẩn hóa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10.5px]">
              
              {/* Bảng phím tắt */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="font-bold text-xs text-[#004776] mb-1.5 flex items-center gap-1.5">
                  <Keyboard className="size-3.5 text-[#0072BC]" />
                  <span>Phím tắt thao tác nhanh (Windows / Mac)</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-mono font-bold text-[10px] text-slate-700">Ctrl / Cmd + K</td>
                      <td className="py-1 text-slate-600">Tìm kiếm nhanh tài liệu & thuật ngữ toàn cổng</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-mono font-bold text-[10px] text-slate-700">Shift + Enter</td>
                      <td className="py-1 text-slate-600">Xuống dòng đơn (không tạo đoạn văn cách xa)</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-mono font-bold text-[10px] text-slate-700">Ctrl / Cmd + B, I, U</td>
                      <td className="py-1 text-slate-600">Định dạng nhanh: Đậm, Nghiêng, Gạch chân văn bản</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-mono font-bold text-[10px] text-slate-700">Ctrl / Cmd + Z, Y</td>
                      <td className="py-1 text-slate-600">Hoàn tác (Undo) hoặc Làm lại (Redo) khi soạn bài</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono font-bold text-[10px] text-slate-700">Ctrl + Shift + R</td>
                      <td className="py-1 text-slate-600">Xóa bộ nhớ đệm (Hard Refresh) khi bài chưa hiện</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Thông số kỹ thuật chuẩn hóa */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="font-bold text-xs text-[#004776] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Thông số vàng vận hành (Kích thước & Dung lượng)</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-semibold text-slate-700">Ảnh bìa bài viết</td>
                      <td className="py-1 text-slate-600">Tỷ lệ <strong>16:9</strong> (1200 x 675 px), &lt; 500 KB, WebP/JPG</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-semibold text-slate-700">Ảnh chân dung Giảng viên</td>
                      <td className="py-1 text-slate-600">Tỷ lệ <strong>3:4</strong> (600 x 800 px) hoặc <strong>1:1</strong>, &lt; 300 KB</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-semibold text-slate-700">Tệp văn bản đính kèm</td>
                      <td className="py-1 text-slate-600">Định dạng <strong>PDF</strong>, tên tệp không dấu, &lt; 50 MB / file</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1 font-semibold text-slate-700">Đường dẫn trang (URL)</td>
                      <td className="py-1 text-slate-600">Chữ thường không dấu, dùng gạch nối <code>/gioi-thieu</code></td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold text-slate-700">Thời gian tự động lưu</td>
                      <td className="py-1 text-slate-600">Hệ thống Auto-save nháp mỗi <strong>30 giây</strong> một lần</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* CHÂN TRANG 1 */}
          <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9.5px] text-slate-400">
            <span>Trường Đại học Công nghệ Kỹ thuật TP.HCM · Cổng tài liệu HDSD</span>
            <span>Trang 1 / 2 · Tra cứu trực tuyến tại: http://doc.utehub.vn</span>
          </div>

        </div>


        {/* -----------------------------------------------------------------------
            TRANG 2: CHECKLIST XUẤT BẢN, XỬ LÝ SỰ CỐ & LIÊN HỆ KHẨN CẤP
            ----------------------------------------------------------------------- */}
        <div className="pocket-page bg-white text-[#0F172A] border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 print:border-none print:shadow-none print:rounded-none print:p-0">
          
          {/* HEADER TRANG 2 */}
          <div className="border-b-2 border-[#0072BC] pb-3 mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="HCM-UTE Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Trường Đại học Công nghệ Kỹ thuật TP. Hồ Chí Minh · Ban Quản trị Cổng Thông tin
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#004776] uppercase tracking-tight leading-none mt-0.5">
                  CHECKLIST XUẤT BẢN & XỬ LÝ SỰ CỐ
                </h2>
                <div className="text-[11px] font-medium text-slate-600 mt-1">
                  Kiểm soát an toàn thông tin, 7 tình huống thường gặp & Danh bạ kỹ thuật khẩn cấp
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 text-[10px] text-slate-500 border-l border-slate-200 pl-3">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] mb-1">
                TRANG 2 / 2
              </span>
              <div>An toàn: <strong>Nghị định 13/2023</strong></div>
              <div>Hotline: <strong>028.3722.1223</strong></div>
            </div>
          </div>

          {/* KHỐI 4: CHECKLIST 7 ĐIỂM VÀNG TRƯỚC KHI BẤM XUẤT BẢN */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>IV. Checklist 7 Điểm Vàng Kiểm Soát Trước Khi Xuất Bản</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
              
              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">1. Tiêu đề & Trích yếu súc tích:</strong> Tiêu đề viết hoa đúng quy tắc chính tả tiếng Việt; trích yếu tóm lược nội dung trong 1-2 câu ngắn, không để trống.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">2. Đã gán đúng Chuyên mục:</strong> Bài viết bắt buộc được tick chọn ít nhất 1 chuyên mục chính để hiển thị đúng khu vực (Tin tức, Học vụ, Nghiên cứu).
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">3. Ảnh bìa đại diện chuẩn 16:9:</strong> Đã chọn ảnh bìa rõ nét (1200x675 px), chủ thể nằm ở trung tâm (Safe Zone), không bị méo tỷ lệ hay vỡ hạt.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">4. Tệp PDF đính kèm & Quyền xem:</strong> Tệp PDF mở xem bình thường, dung lượng &lt; 50MB, quyền truy cập đã được mở công khai cho người học.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">5. Kiểm tra liên kết điều hướng:</strong> Không chứa liên kết hỏng (404); các link ra ngoài trường (Bộ, Báo chí) được bật mở trong tab mới.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                <input type="checkbox" className="mt-0.5 rounded text-[#0072BC] shrink-0" readOnly />
                <div>
                  <strong className="text-slate-800">6. Tối ưu SEO & Hiển thị Di động:</strong> Đã nhập thẻ Meta Description ngắn gọn (&lt; 160 ký tự); kiểm tra xem thử (Preview) bố cục ngay ngắn trên điện thoại.
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2 p-2 rounded-lg border border-rose-200 bg-rose-50/60">
                <input type="checkbox" className="mt-0.5 rounded text-rose-600 shrink-0" readOnly />
                <div>
                  <strong className="text-rose-900">7. Bảo vệ dữ liệu cá nhân & Thẩm định phát ngôn (Nghị định 13/2023):</strong> Tuyệt đối không đăng tải công khai số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm; nội dung tuân thủ chặt chẽ quy chế phát ngôn của Nhà trường.
                </div>
              </div>

            </div>
          </div>

          {/* KHỐI 5: 7 SỰ CỐ THƯỜNG GẶP & CÁCH XỬ LÝ NHANH TRONG 30 GIÂY */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>V. Bảng Tra cứu Xử lý Nhanh 7 Sự cố Thường gặp</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5 w-[28%]">Tình huống sự cố</th>
                    <th className="py-1.5 px-2.5 w-[22%]">Nguyên nhân cốt lõi</th>
                    <th className="py-1.5 px-2.5 w-[50%]">Cách xử lý dứt điểm trong 30 giây</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">1. Bài đăng xong không thấy ở trang chủ</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Chưa gán chuyên mục hoặc dính cache trình duyệt</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Vào bài viết kiểm tra tick chọn chuyên mục; nhấn <strong>Ctrl + Shift + R</strong> để tải lại sạch trang.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">2. Sinh viên không tải được file PDF</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Quyền truy cập file bị giới hạn nội bộ</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Mở kho lưu trữ file, chuyển quyền chia sẻ sang <strong>"Bất kỳ ai có đường liên kết"</strong> đều có thể xem.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">3. Nhỡ tay xóa nhầm trang / khối nội dung</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Thao tác xóa đè ngoài ý muốn</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Vào Cài đặt trang → chọn <strong>Lịch sử phiên bản (Version History)</strong> → chọn mốc giờ trước đó và bấm <strong>Khôi phục</strong>.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">4. Nhấp vào Menu báo lỗi 404</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Đường dẫn URL đích bị sai hoặc thừa khoảng trắng</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Vào Quản trị Menu → kiểm tra URL đích. Chỉ dùng đường dẫn tương đối (VD: <code>/gioi-thieu/khoa-co-khi</code>).</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">5. Ảnh hiển thị bị mờ, vỡ hạt, méo</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Tải ảnh sai tỷ lệ hoặc kích thước quá nhỏ</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Cắt ảnh về đúng tỷ lệ <strong>16:9</strong> (1200 x 675 px) trước khi tải lên; không dùng ảnh chụp dọc màn hình.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">6. Báo lỗi "Không đủ quyền thực hiện"</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Phiên SSO hết hạn hoặc chưa phân quyền đơn vị</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Đăng xuất và đăng nhập lại bằng email <code>@hcmute.edu.vn</code>; báo Quản trị viên đơn vị kiểm tra quyền.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-slate-800">7. Đang soạn thì tắt trình duyệt / mất mạng</td>
                    <td className="py-1.5 px-2.5 text-slate-600">Sự cố mất kết nối mạng bất ngờ</td>
                    <td className="py-1.5 px-2.5 text-slate-700">Hệ thống có bộ nhớ Auto-save tự động. Đăng nhập lại, mở bài viết và nhấn <strong>"Khôi phục bản nháp tự động"</strong>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* KHỐI 6: DANH BẠ HỖ TRỢ KỸ THUẬT & ĐẦU MỐI TRUY CẬP KHẨN CẤP */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0072BC] flex items-center gap-1.5 mb-2">
              <span className="size-2 rounded-full bg-[#0072BC]" />
              <span>VI. Danh bạ Hỗ trợ Kỹ thuật & Đầu mối Khẩn cấp</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10.5px]">
              
              {/* Ban Truyền thông */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="font-bold text-xs text-[#004776] mb-1 flex items-center gap-1.5">
                  <Building className="size-3.5 text-[#0072BC]" />
                  <span>Ban Truyền thông (BMC)</span>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div><strong>Nhiệm vụ:</strong> Duyệt phát ngôn, chuẩn nhận diện & cây menu</div>
                  <div><strong>Email:</strong> truyenthong@hcmute.edu.vn</div>
                  <div><strong>Vị trí:</strong> Phòng A1-201, Tòa nhà Trung tâm</div>
                </div>
              </div>

              {/* Trung tâm Máy tính */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="font-bold text-xs text-[#004776] mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Trung tâm Máy tính (TTMT)</span>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div><strong>Nhiệm vụ:</strong> Hạ tầng kỹ thuật, tài khoản SSO & tên miền</div>
                  <div><strong>Email:</strong> ttmt@hcmute.edu.vn</div>
                  <div><strong>Vị trí:</strong> Tầng 3, Tòa nhà Trung tâm</div>
                </div>
              </div>

              {/* Kênh hỗ trợ Tickets */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="font-bold text-xs text-[#004776] mb-1 flex items-center gap-1.5">
                  <HelpCircle className="size-3.5 text-purple-600" />
                  <span>Kênh hỗ trợ Tickets 100%</span>
                </div>
                <div className="space-y-0.5 text-slate-600">
                  <div><strong>Truy cập:</strong> doc.utehub.vn → Hỗ trợ trực tuyến</div>
                  <div><strong>Thời gian xử lý:</strong> 2 - 4 giờ làm việc</div>
                  <div><strong>Tổng đài Trường:</strong> 028.3722.1223 (Bấm số nội bộ)</div>
                </div>
              </div>

            </div>
          </div>

          {/* CHÂN TRANG 2 */}
          <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9.5px] text-slate-400">
            <span>Trường Đại học Công nghệ Kỹ thuật TP.HCM · Bản quyền thuộc Nhà trường</span>
            <span>Trang 2 / 2 · Cổng hướng dẫn quản trị HCM-UTE · Tài liệu ban hành lưu hành nội bộ</span>
          </div>

        </div>

      </div>

    </div>
  );
}
