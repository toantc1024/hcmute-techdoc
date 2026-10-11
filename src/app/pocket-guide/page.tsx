'use client';

import React from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Compass,
  Keyboard,
  Info,
  Building2,
  ShieldCheck,
  LifeBuoy,
  ArrowRight,
  ExternalLink,
  Sliders,
  Check
} from "lucide-react";

export default function PocketGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B0F19] text-[#11324D] dark:text-[#E2E8F0] py-6 sm:py-8 px-3 sm:px-6">
      
      {/* =========================================================================
          THANH ĐIỀU KHIỂN TRÊN MÀN HÌNH (ẨN HOÀN TOÀN KHI IN / XUẤT PDF)
          ========================================================================= */}
      <div className="no-print max-w-[210mm] mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border/80 shadow-xs">
          
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted/50"
            >
              <ArrowLeft className="size-4" />
              <span>Cổng tài liệu</span>
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0072BC] uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-[#0072BC]" />
                <span>Quy chuẩn ấn phẩm HCM-UTE · 2 Trang A4</span>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0072BC] hover:bg-[#005A96] text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="size-4" />
              <span>In / Lưu file PDF (2 Trang A4)</span>
            </button>
          </div>

        </div>

        {/* Mẹo in chuẩn A4 */}
        <div className="mt-3 px-4 py-2.5 rounded-xl bg-[#F0F7FD] dark:bg-blue-950/30 border border-[#0072BC]/20 text-xs text-[#004776] dark:text-blue-200 flex items-start sm:items-center gap-2">
          <Info className="size-4 text-[#0072BC] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Mẹo in xuất bản:</strong> Khổ giấy <strong>A4</strong>, Tỷ lệ <strong>100%</strong> (hoặc <em>Vừa trang in</em>), Bật tùy chọn <strong>Đồ họa nền (Background graphics)</strong> để giữ trọn vẹn màu sắc nhận diện thương hiệu.
          </span>
        </div>
      </div>

      {/* =========================================================================
          KHUNG 2 TRANG A4 THEO SKILL PORCELAIN INSTITUTIONAL & ORBITAL RINGS
          ========================================================================= */}
      <div className="pocket-guide-wrapper max-w-[210mm] mx-auto space-y-8 print:space-y-0">

        {/* -----------------------------------------------------------------------
            TRANG 1: NỀN TẢNG CỐT LÕI, SƠ ĐỒ ĐIỀU HƯỚNG & PHÍM TẮT
            ----------------------------------------------------------------------- */}
        <div className="pocket-page relative overflow-hidden bg-white text-[#11324D] border border-slate-200/90 shadow-xl rounded-2xl p-7 sm:p-9 print:border-none print:shadow-none print:rounded-none print:p-0">
          
          {/* LƯỚI TỌA ĐỘ KỸ THUẬT BLUEPRINT CHUẨN HCM-UTE (GÓC DƯỚI PHẢI FADE-BR) */}
          <div className="pointer-events-none absolute inset-0 ute-blueprint-grid ute-mask-fade-br opacity-80 -z-0" />



          <div className="relative z-10">

            {/* HEADER TRANG 1 */}
            <header className="border-b-2 border-[#0072BC] pb-3 mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo.png"
                  alt="HCM-UTE Logo"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#536B7D]">
                    Trường Đại học Công nghệ Kỹ thuật TP.HCM · P. Quản trị thương hiệu & Truyền thông · TT. Thông tin - Máy tính
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#004776] uppercase tracking-tight leading-none mt-1">
                    SỔ TAY QUẢN TRỊ WEBSITE BỎ TÚI
                  </h2>
                  <p className="text-[11px] font-medium text-[#536B7D] mt-1">
                    Cẩm nang chuẩn hóa quy trình tác nghiệp, phím tắt &amp; tiêu chuẩn kỹ thuật (Dành cho Thầy/Cô BTV &amp; QTV)
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 text-[10px] text-[#536B7D] border-l border-slate-200 pl-3.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF5FF] text-[#0072BC] font-bold text-[9px] mb-1 border border-[#0072BC]/20">
                  TRANG 1 / 2
                </span>
                <div>Phiên bản: <strong className="text-[#004776]">v2.4 (10/2026)</strong></div>
                <div>Quy chuẩn: <strong className="text-[#004776]">188/QĐ-ĐHCNKT</strong></div>
              </div>
            </header>

            {/* PHẦN I: 3 CẤU TRÚC NỘI DUNG CỐT LÕI */}
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  I. Ba Cấu trúc Nội dung Cốt lõi (Bắt buộc phân biệt)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Trang con */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3 flex flex-col justify-between">
                  <div className="pointer-events-none absolute bottom-0 right-0 w-28 h-28 ute-blueprint-grid ute-mask-fade-br opacity-70" />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#004776]">
                        <Layers className="size-3.5 text-[#0072BC]" />
                        <span>1. Trang con (Page)</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#0072BC]/10 text-[#0072BC] rounded-md">
                        Cố định
                      </span>
                    </div>
                    <p className="text-[11px] text-[#536B7D] leading-snug mb-2">
                      Nội dung thông tin tĩnh, bền vững: Giới thiệu, Cơ cấu tổ chức, Chương trình đào tạo, Phòng thí nghiệm.
                    </p>
                  </div>
                  <div className="text-[10px] text-[#11324D] border-t border-slate-200/80 pt-1.5 leading-snug">
                    <strong className="text-[#0072BC]">Thao tác:</strong> Dựng khối mẫu (Blocks) → Đặt URL thân thiện → Công bố → Gắn vào Menu.
                  </div>
                </div>

                {/* 2. Tin tức / PDF */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3 flex flex-col justify-between">
                  <div className="pointer-events-none absolute bottom-0 right-0 w-28 h-28 ute-blueprint-grid ute-mask-fade-br opacity-70" />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#004776]">
                        <FileText className="size-3.5 text-[#0072BC]" />
                        <span>2. Tin tức / PDF (Post)</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#0072BC]/10 text-[#0072BC] rounded-md">
                        Biến động
                      </span>
                    </div>
                    <p className="text-[11px] text-[#536B7D] leading-snug mb-2">
                      Dòng sự kiện cập nhật liên tục: Hoạt động trường, Thông báo học vụ, Quyết định, Biểu mẫu PDF.
                    </p>
                  </div>
                  <div className="text-[10px] text-[#11324D] border-t border-slate-200/80 pt-1.5 leading-snug">
                    <strong className="text-[#0072BC]">Thao tác:</strong> Soạn thảo WYSIWYG → Chọn Chuyên mục → Ảnh bìa 16:9 → Đính kèm PDF → Duyệt.
                  </div>
                </div>

                {/* 3. Menu điều hướng */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3 flex flex-col justify-between">
                  <div className="pointer-events-none absolute bottom-0 right-0 w-28 h-28 ute-blueprint-grid ute-mask-fade-br opacity-70" />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#004776]">
                        <Compass className="size-3.5 text-[#0072BC]" />
                        <span>3. Menu điều hướng</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#0072BC]/10 text-[#0072BC] rounded-md">
                        Dẫn đường
                      </span>
                    </div>
                    <p className="text-[11px] text-[#536B7D] leading-snug mb-2">
                      Khung xương dẫn lối người dùng: Mega Menu đầu trang (tối đa 3 cấp) và Khối liên kết chân trang (Footer).
                    </p>
                  </div>
                  <div className="text-[10px] text-[#11324D] border-t border-slate-200/80 pt-1.5 leading-snug">
                    <strong className="text-[#0072BC]">Thao tác:</strong> Quản trị Menu → Kéo thả thứ tự → Gán URL đích → Lưu và xóa cache.
                  </div>
                </div>

              </div>
            </section>

            {/* PHẦN II: SƠ ĐỒ 3 LUỒNG TÁC NGHIỆP TRỌNG TÂM */}
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  II. Sơ đồ 3 Luồng Tác vụ Nghiệp vụ Trọng tâm
                </h3>
              </div>

              <div className="space-y-2">
                
                {/* Luồng A */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#004776]">
                      Luồng A: Quản trị &amp; Tạo Trang con mới (Page Builder)
                    </span>
                    <span className="text-[10px] text-[#536B7D]">
                      Quyền hạn: <strong>Unit Admin / BTV ủy quyền</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      1. Chọn mẫu trang
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      2. Nhập khối nội dung
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      3. Đặt URL chuẩn SEO
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0072BC]/10 border border-[#0072BC]/30 font-bold text-[#0072BC]">
                      4. Xuất bản trang
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#004776]/10 border border-[#004776]/30 font-bold text-[#004776]">
                      5. Gắn vào Menu
                    </div>
                  </div>
                </div>

                {/* Luồng B */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#004776]">
                      Luồng B: Đăng Tin tức, Sự kiện &amp; Văn bản Biểu mẫu PDF (Post Publishing)
                    </span>
                    <span className="text-[10px] text-[#536B7D]">
                      Quy trình: <strong>Biên tập viên soạn → Lãnh đạo thẩm định xuất bản</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      1. Soạn tiêu đề &amp; bài
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0072BC]/10 border border-[#0072BC]/30 font-bold text-[#0072BC]">
                      2. Gán Chuyên mục
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      3. Đặt ảnh bìa 16:9
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      4. Đính kèm PDF
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#004776]/10 border border-[#004776]/30 font-bold text-[#004776]">
                      5. Duyệt &amp; Đăng tải
                    </div>
                  </div>
                </div>

                {/* Luồng C */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#004776]">
                      Luồng C: Cấu hình Menu Đầu trang &amp; Chân trang (Mega Menu &amp; Footer)
                    </span>
                    <span className="text-[10px] text-[#536B7D]">
                      Quyền hạn: <strong>Unit Admin đơn vị</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      1. Quản trị Menu
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      2. Chọn Mega/Footer
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#F7FBFF] border border-slate-200 font-medium text-[#11324D]">
                      3. Thêm mục &amp; Gán URL
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#0072BC]/10 border border-[#0072BC]/30 font-bold text-[#0072BC]">
                      4. Lưu cấu hình
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#004776]/10 border border-[#004776]/30 font-bold text-[#004776]">
                      5. Thử tab ẩn danh
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* PHẦN III: BẢNG PHÍM TẮT & THÔNG SỐ VÀNG VẬN HÀNH */}
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  III. Bảng Phím tắt &amp; Thông số Kỹ thuật Chuẩn hóa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                
                {/* Bảng phím tắt */}
                <div className="rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3">
                  <div className="font-bold text-xs text-[#004776] mb-2 flex items-center gap-1.5">
                    <Keyboard className="size-3.5 text-[#0072BC]" />
                    <span>Phím tắt thao tác nhanh (Windows / Mac)</span>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-mono font-bold text-[10.5px] text-[#0072BC] w-36">Ctrl / Cmd + K</td>
                        <td className="py-1 text-[#11324D]">Tìm kiếm nhanh toàn bộ tài liệu &amp; thuật ngữ cổng</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-mono font-bold text-[10.5px] text-[#0072BC]">Shift + Enter</td>
                        <td className="py-1 text-[#11324D]">Xuống dòng đơn (không tạo khoảng cách đoạn xa)</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-mono font-bold text-[10.5px] text-[#0072BC]">Ctrl / Cmd + B, I, U</td>
                        <td className="py-1 text-[#11324D]">Định dạng nhanh: Đậm, Nghiêng, Gạch chân văn bản</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-mono font-bold text-[10.5px] text-[#0072BC]">Ctrl / Cmd + Z, Y</td>
                        <td className="py-1 text-[#11324D]">Hoàn tác (Undo) hoặc Làm lại (Redo) khi soạn bài</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-mono font-bold text-[10.5px] text-[#0072BC]">Ctrl + Shift + R</td>
                        <td className="py-1 text-[#11324D]">Xóa bộ nhớ đệm (Hard Refresh) khi trang chưa cập nhật</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Thông số kỹ thuật chuẩn hóa */}
                <div className="rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3">
                  <div className="font-bold text-xs text-[#004776] mb-2 flex items-center gap-1.5">
                    <Sliders className="size-3.5 text-[#0072BC]" />
                    <span>Thông số vàng vận hành (Kích thước &amp; Chuẩn file)</span>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-semibold text-[#536B7D] w-36">Ảnh bìa bài viết</td>
                        <td className="py-1 text-[#11324D]">Tỷ lệ <strong>16:9</strong> (1200 x 675 px), &lt; 500 KB, WebP/JPG</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-semibold text-[#536B7D]">Ảnh chân dung Giảng viên</td>
                        <td className="py-1 text-[#11324D]">Tỷ lệ <strong>3:4</strong> (600 x 800 px) hoặc <strong>1:1</strong>, &lt; 300 KB</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-semibold text-[#536B7D]">Tệp văn bản đính kèm</td>
                        <td className="py-1 text-[#11324D]">Định dạng <strong>PDF</strong>, tên tệp không dấu, &lt; 50 MB / file</td>
                      </tr>
                      <tr className="border-b border-slate-200/60">
                        <td className="py-1 font-semibold text-[#536B7D]">Đường dẫn trang (URL)</td>
                        <td className="py-1 text-[#11324D]">Chữ thường không dấu, dùng gạch nối <code>/gioi-thieu</code></td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-[#536B7D]">Cơ chế lưu nháp</td>
                        <td className="py-1 text-[#11324D]">Hệ thống Auto-save tự động lưu mỗi <strong>30 giây</strong> một lần</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </section>

            {/* CHÂN TRANG 1 */}
            <footer className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#536B7D]">
              <span>Trường ĐH Công nghệ Kỹ thuật TP.HCM · P. Quản trị thương hiệu & Truyền thông (BMC) · TT. Thông tin - Máy tính (TTMT)</span>
              <span>Trang 1 / 2 · Tra cứu trực tuyến: http://doc.utehub.vn</span>
            </footer>

          </div>

        </div>


        {/* -----------------------------------------------------------------------
            TRANG 2: CHECKLIST XUẤT BẢN, XỬ LÝ SỰ CỐ & LIÊN HỆ KHẨN CẤP
            ----------------------------------------------------------------------- */}
        <div className="pocket-page relative overflow-hidden bg-white text-[#11324D] border border-slate-200/90 shadow-xl rounded-2xl p-7 sm:p-9 print:border-none print:shadow-none print:rounded-none print:p-0">
          
          {/* LƯỚI TỌA ĐỘ KỸ THUẬT BLUEPRINT CHUẨN HCM-UTE */}
          <div className="pointer-events-none absolute inset-0 ute-blueprint-grid ute-mask-fade-br opacity-80 -z-0" />



          <div className="relative z-10">

            {/* HEADER TRANG 2 */}
            <header className="border-b-2 border-[#0072BC] pb-3 mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo.png"
                  alt="HCM-UTE Logo"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#536B7D]">
                    Trường Đại học Công nghệ Kỹ thuật TP.HCM · P. Quản trị thương hiệu & Truyền thông · TT. Thông tin - Máy tính
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#004776] uppercase tracking-tight leading-none mt-1">
                    CHECKLIST XUẤT BẢN &amp; XỬ LÝ SỰ CỐ
                  </h2>
                  <p className="text-[11px] font-medium text-[#536B7D] mt-1">
                    Kiểm soát chất lượng thông tin, bảo vệ dữ liệu cá nhân &amp; tra cứu nhanh 7 tình huống thường gặp
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 text-[10px] text-[#536B7D] border-l border-slate-200 pl-3.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF5FF] text-[#0072BC] font-bold text-[9px] mb-1 border border-[#0072BC]/20">
                  TRANG 2 / 2
                </span>
                <div>An toàn: <strong className="text-[#004776]">Nghị định 13/2023</strong></div>
                <div>Tổng đài: <strong className="text-[#004776]">028.3722.1223</strong></div>
              </div>
            </header>

            {/* PHẦN IV: CHECKLIST 7 ĐIỂM VÀNG KIỂM SOÁT TRƯỚC KHI XUẤT BẢN */}
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  IV. Checklist 7 Điểm Vàng Kiểm Soát Trước Khi Xuất Bản
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                
                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">1. Tiêu đề &amp; Trích yếu súc tích:</strong> Viết hoa đúng chính tả tiếng Việt; trích yếu tóm lược nội dung trong 1-2 câu ngắn, không để trống.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">2. Đã gán đúng Chuyên mục:</strong> Bài viết bắt buộc chọn ít nhất 1 chuyên mục chính để hiển thị đúng khu vực (Tin tức, Học vụ, Nghiên cứu).
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">3. Ảnh bìa đại diện chuẩn 16:9:</strong> Kích thước chuẩn 1200x675px, chủ thể nằm ở trung tâm (Safe Zone), không bị méo tỷ lệ hay vỡ hạt.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">4. Tệp PDF đính kèm &amp; Quyền xem:</strong> Mở xem bình thường, dung lượng &lt; 50MB, quyền truy cập đã mở công khai cho người học tải về.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">5. Kiểm tra liên kết điều hướng:</strong> Không chứa liên kết hỏng (404); các link ra ngoài trường (Bộ GD&amp;ĐT, Báo chí) mở trong tab mới.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-200/90 bg-[#F7FBFF]">
                  <div className="size-4 rounded-md border border-[#0072BC]/40 bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#0072BC]">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="text-[#004776]">6. Tối ưu SEO &amp; Hiển thị Di động:</strong> Đã nhập thẻ Meta Description ngắn gọn (&lt; 160 ký tự); kiểm tra xem thử (Preview) ngay ngắn trên điện thoại.
                  </div>
                </div>

                {/* Điểm 7 nhấn mạnh theo quy chuẩn màu đỏ #ED1C24 của HCM-UTE */}
                <div className="sm:col-span-2 flex items-start gap-2 p-2.5 rounded-lg border border-[#ED1C24]/30 bg-[#FFF5F5]">
                  <div className="size-4 rounded-md border border-[#ED1C24] bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#ED1C24]">
                    <AlertTriangle className="size-3 stroke-[2.5]" />
                  </div>
                  <div className="text-[#11324D]">
                    <strong className="text-[#ED1C24]">7. Bảo vệ dữ liệu cá nhân &amp; Quy chế phát ngôn (Nghị định 13/2023/NĐ-CP):</strong> Tuyệt đối không đăng tải công khai số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm; toàn bộ nội dung tuân thủ nghiêm ngặt quy chế phát ngôn của Nhà trường.
                  </div>
                </div>

              </div>
            </section>

            {/* PHẦN V: BẢNG TRA CỨU XỬ LÝ NHANH 7 SỰ CỐ THƯỜNG GẶP */}
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  V. Bảng Tra cứu Xử lý Nhanh 7 Sự cố Thường gặp (Trong 30 giây)
                </h3>
              </div>

              <div className="border border-slate-200/90 rounded-xl overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F0F7FD] text-[#004776] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-3 w-[28%]">Tình huống sự cố</th>
                      <th className="py-1.5 px-3 w-[24%]">Nguyên nhân cốt lõi</th>
                      <th className="py-1.5 px-3 w-[48%]">Cách xử lý dứt điểm trong 30 giây</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">1. Bài đăng xong không thấy trang chủ</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Chưa gán chuyên mục hoặc dính cache</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Vào bài tick chọn chuyên mục trang chủ; nhấn <strong>Ctrl + Shift + R</strong> để tải lại.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">2. Sinh viên không tải được file PDF</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Quyền truy cập file bị khóa nội bộ</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Mở kho lưu trữ, chuyển quyền chia sẻ sang <strong>"Bất kỳ ai có đường liên kết"</strong>.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">3. Nhỡ tay xóa nhầm trang / khối nội dung</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Thao tác xóa đè ngoài ý muốn</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Vào Cài đặt trang → <strong>Lịch sử phiên bản (Version History)</strong> → bấm <strong>Khôi phục</strong>.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">4. Nhấp vào Menu báo lỗi 404</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Đường dẫn URL đích sai hoặc thừa dấu cách</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Vào Quản trị Menu kiểm tra URL. Chỉ dùng đường dẫn tương đối (VD: <code>/gioi-thieu</code>).</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">5. Ảnh hiển thị bị mờ nhòe, méo tỷ lệ</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Tải ảnh sai tỷ lệ hoặc kích thước nhỏ</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Cắt ảnh về đúng tỷ lệ <strong>16:9</strong> (1200 x 675 px) trước khi tải lên; tránh ảnh chụp dọc.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">6. Báo lỗi "Không đủ thẩm quyền"</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Hết hạn phiên SSO hoặc chưa gán quyền</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Đăng xuất và đăng nhập lại bằng email <code>@hcmute.edu.vn</code>; báo Admin kiểm tra.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-[#004776]">7. Đang soạn thì tắt trình duyệt / mất mạng</td>
                      <td className="py-1.5 px-3 text-[#536B7D]">Sự cố kết nối mạng bất ngờ</td>
                      <td className="py-1.5 px-3 text-[#11324D]">Hệ thống có Auto-save ngầm. Đăng nhập lại, mở bài viết và nhấn <strong>"Khôi phục bản nháp"</strong>.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* PHẦN VI: DANH BẠ HỖ TRỢ KỸ THUẬT & ĐẦU MỐI KHẨN CẤP */}
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-3.5 bg-[#0072BC] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004776]">
                  VI. Danh bạ Hỗ trợ Kỹ thuật &amp; Đầu mối Khẩn cấp
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                
                {/* Phòng Quản trị thương hiệu & Truyền thông (BMC) */}
                <div className="rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3">
                  <div className="font-bold text-xs text-[#004776] mb-1.5 flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-[#0072BC]" />
                    <span>Phòng Quản trị thương hiệu &amp; Truyền thông (BMC)</span>
                  </div>
                  <div className="space-y-0.5 text-[#536B7D] leading-snug">
                    <div><strong>Nhiệm vụ:</strong> Duyệt phát ngôn, chuẩn nhận diện thương hiệu &amp; cây menu</div>
                    <div><strong>Email:</strong> bmc@hcmute.edu.vn</div>
                    <div><strong>Vị trí:</strong> Phòng A1-201, Tòa nhà Trung tâm</div>
                  </div>
                </div>

                {/* Trung tâm Thông tin - Máy tính (TTMT) */}
                <div className="rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3">
                  <div className="font-bold text-xs text-[#004776] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-[#0072BC]" />
                    <span>Trung tâm Thông tin - Máy tính (TTMT)</span>
                  </div>
                  <div className="space-y-0.5 text-[#536B7D] leading-snug">
                    <div><strong>Nhiệm vụ:</strong> Hạ tầng kỹ thuật, tài khoản SSO Trường, quản lý DNS &amp; tên miền</div>
                    <div><strong>Email:</strong> ttmt@hcmute.edu.vn · <strong>Site:</strong> iic.hcmute.edu.vn</div>
                    <div><strong>Vị trí:</strong> Tầng 3, Tòa nhà Trung tâm</div>
                  </div>
                </div>

                {/* Kênh hỗ trợ Tickets */}
                <div className="rounded-xl border border-slate-200/90 bg-[#F7FBFF] p-3">
                  <div className="font-bold text-xs text-[#004776] mb-1.5 flex items-center gap-1.5">
                    <LifeBuoy className="size-3.5 text-[#0072BC]" />
                    <span>Kênh tiếp nhận Ticket 100%</span>
                  </div>
                  <div className="space-y-0.5 text-[#536B7D] leading-snug">
                    <div><strong>Truy cập:</strong> doc.utehub.vn → Hỗ trợ trực tuyến</div>
                    <div><strong>Xử lý:</strong> Trong vòng 2 - 4 giờ làm việc</div>
                    <div><strong>Tổng đài Trường:</strong> 028.3722.1223</div>
                  </div>
                </div>

              </div>
            </section>

            {/* CHÂN TRANG 2 */}
            <footer className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#536B7D]">
              <span>Trường ĐH Công nghệ Kỹ thuật TP.HCM · P. Quản trị thương hiệu & Truyền thông (BMC) · TT. Thông tin - Máy tính (TTMT)</span>
              <span>Trang 2 / 2 · Cổng hướng dẫn quản trị HCM-UTE · Lưu hành nội bộ toàn Trường</span>
            </footer>

          </div>

        </div>

      </div>

    </div>
  );
}
