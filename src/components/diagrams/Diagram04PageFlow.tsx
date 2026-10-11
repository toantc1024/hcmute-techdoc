'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const diagram04Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'LUỒNG A – TẠO, CHỈNH SỬA VÀ CÔNG BỐ TRANG',
  diagramNumber: '04 / 06',
  subtitle: 'Bắt đầu ở góc trái. Đi theo mũi tên; nhánh "Chưa" quay lại bước sửa.',
  bottomWarning: 'Tạo trang chưa tạo mục trên menu. Chỉ công bố khi đã kiểm tra và tài khoản có quyền.',
};

export function Diagram04PageFlow() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-04"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7" />
          </marker>
          <marker
            id="arr-red-04"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC2626" />
          </marker>
        </defs>

        {/* Nền bản vẽ */}
        <rect width="1024" height="820" fill="#FFFFFF" rx="12" />

        {/* ================= HEADER BANNER ================= */}
        <image href="/logo-hcm-ute.png" x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram04Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram04Content.diagramNumber}
        </text>

        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        <text x="25" y="104" fill="#334155" fontSize="12" fontWeight="400">
          {diagram04Content.subtitle}
        </text>

        {/* ================= HÀNG 1: KHỞI ĐẦU & 4 NHÁNH ================= */}
        {/* BẮT ĐẦU */}
        <rect x="25" y="170" width="108" height="44" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <text x="79" y="197" textAnchor="middle" fill="#004776" fontSize="13" fontWeight="800">
          BẮT ĐẦU
        </text>

        <line x1="133" y1="192" x2="178" y2="192" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="156" y="184" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Mở
        </text>

        {/* Website -> Trang */}
        <rect x="180" y="165" width="138" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="249" y="197" textAnchor="middle" fill="#004776" fontSize="13" fontWeight="700">
          Website → Trang
        </text>

        <line x1="318" y1="192" x2="368" y2="192" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="343" y="184" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Chọn
        </text>

        {/* Câu hỏi: Bạn muốn làm gì? */}
        <polygon points="440,165 520,192 440,219 360,192" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="440" y="188" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
          Bạn muốn
        </text>
        <text x="440" y="202" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
          làm gì?
        </text>

        {/* Đường nối sang 4 nhánh */}
        <path d="M 520 192 L 560 192 M 560 142 L 560 380 M 560 142 L 576 142 M 560 220 L 576 220 M 560 300 L 576 300 M 560 380 L 576 380" fill="none" stroke="#0284C7" strokeWidth="1.4" />

        {/* Nhãn nhánh */}
        <text x="532" y="132" fill="#0284C7" fontSize="10" fontWeight="700">Tạo mới</text>
        <text x="532" y="210" fill="#0284C7" fontSize="10" fontWeight="700">Trang con</text>
        <text x="528" y="290" fill="#0284C7" fontSize="10" fontWeight="700">Dùng mẫu</text>
        <text x="535" y="370" fill="#0284C7" fontSize="10" fontWeight="700">Sửa</text>

        {/* 4 Box nhánh */}
        {/* Nhánh 1: Tạo mới */}
        <rect x="578" y="125" width="170" height="34" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="663" y="146" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Tạo trang → Trang trống
        </text>

        {/* Nhánh 2: Trang con */}
        <rect x="578" y="200" width="170" height="42" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="663" y="218" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Chọn trang cha
        </text>
        <text x="663" y="233" textAnchor="middle" fill="#004776" fontSize="10.5">
          → Thêm trang con
        </text>

        {/* Nhánh 3: Dùng mẫu */}
        <rect x="578" y="278" width="170" height="42" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="663" y="296" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Nhân bản trang mẫu
        </text>
        <text x="663" y="311" textAnchor="middle" fill="#004776" fontSize="10">
          → Chọn mẫu → Nhân bản
        </text>

        {/* Nhánh 4: Sửa */}
        <rect x="578" y="360" width="170" height="34" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="663" y="381" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Chọn trang → Sửa
        </text>
        <text x="578" y="414" fill="#64748B" fontSize="10">
          Trang mẫu: thay nội dung của đơn vị.
        </text>

        {/* Mũi tên từ 4 nhánh gom vào: Nhập/sửa thông tin */}
        <path d="M 748 142 L 780 142 L 780 260 M 748 221 L 780 221 M 748 299 L 780 299 M 748 377 L 780 377 L 780 260 M 780 260 L 808 260" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-04)" />

        {/* Box Nhập / sửa thông tin */}
        <rect x="812" y="230" width="175" height="60" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="900" y="252" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="800">
          Nhập / sửa thông tin
        </text>
        <text x="900" y="268" textAnchor="middle" fill="#475569" fontSize="10">
          Tên, đường dẫn, trang cha
        </text>
        <text x="900" y="281" textAnchor="middle" fill="#475569" fontSize="10">
          và mô tả theo biểu mẫu
        </text>

        <line x1="900" y1="290" x2="900" y2="470" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-04)" />
        <text x="850" y="375" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Tiếp tục /
        </text>
        <text x="850" y="390" fill="#0284C7" fontSize="10.5" fontWeight="600">
          lưu thông tin
        </text>

        {/* ================= HÀNG 2: PAGE BUILDER & XEM TRƯỚC ================= */}
        {/* Nút Chọn Thiết kế */}
        <rect x="812" y="475" width="175" height="44" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <text x="900" y="502" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="800">
          Chọn Thiết kế
        </text>

        <line x1="812" y1="497" x2="748" y2="497" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="780" y="515" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Chỉnh nội dung
        </text>

        {/* Box Thêm / sửa / sắp xếp */}
        <rect x="580" y="475" width="164" height="44" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="662" y="494" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="700">
          Thêm / sửa / sắp xếp
        </text>
        <text x="662" y="509" textAnchor="middle" fill="#004776" fontSize="11">
          các phần hiển thị
        </text>

        <line x1="580" y1="497" x2="520" y2="497" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="548" y="488" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Kiểm tra
        </text>

        {/* Box Xem trước */}
        <rect x="365" y="475" width="150" height="44" rx="4" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.4" />
        <text x="440" y="494" textAnchor="middle" fill="#15803D" fontSize="11.5" fontWeight="800">
          Xem trước
        </text>
        <text x="440" y="509" textAnchor="middle" fill="#15803D" fontSize="10.5">
          Máy tính / Điện thoại
        </text>

        <line x1="365" y1="497" x2="310" y2="497" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="338" y="488" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Đối chiếu
        </text>

        {/* Decision: Nội dung đã đúng chưa? */}
        <polygon points="230,470 305,497 230,524 155,497" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="230" y="493" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          Nội dung
        </text>
        <text x="230" y="507" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          đã đúng chưa?
        </text>

        {/* Nhánh CHƯA: Mũi tên đỏ quay lại bước sửa */}
        <path d="M 230 524 L 230 550 L 662 550 L 662 523" fill="none" stroke="#DC2626" strokeWidth="1.5" markerEnd="url(#arr-red-04)" />
        <text x="440" y="544" textAnchor="middle" fill="#DC2626" fontSize="10.5" fontWeight="700">
          Chưa → sửa lại
        </text>

        {/* Nhánh ĐÚNG: Đi xuống Lưu trang */}
        <path d="M 155 497 L 115 497 L 115 650 L 148 650" fill="none" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="90" y="580" fill="#15803D" fontSize="10.5" fontWeight="700">
          Đúng
        </text>

        {/* ================= HÀNG 3: LƯU, XUẤT BẢN & MENU ================= */}
        {/* Lưu trang */}
        <rect x="150" y="628" width="160" height="44" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="230" y="647" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Lưu trang /
        </text>
        <text x="230" y="662" textAnchor="middle" fill="#004776" fontSize="11">
          Lưu thay đổi
        </text>

        <line x1="310" y1="650" x2="365" y2="650" stroke="#DC2626" strokeWidth="1.5" markerEnd="url(#arr-red-04)" />
        <text x="338" y="640" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="700">
          Công bố
        </text>

        {/* Xuất bản (Red Border) */}
        <rect x="368" y="628" width="160" height="44" rx="8" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
        <text x="448" y="655" textAnchor="middle" fill="#DC2626" fontSize="13" fontWeight="800">
          Xuất bản
        </text>

        <line x1="528" y1="650" x2="583" y2="650" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="556" y="640" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Kiểm tra
        </text>

        {/* Mở website kiểm tra (Green border) */}
        <rect x="586" y="628" width="160" height="44" rx="8" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
        <text x="666" y="655" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="700">
          Mở website kiểm tra
        </text>

        <line x1="746" y1="650" x2="795" y2="650" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="770" y="640" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Chọn
        </text>

        {/* Decision: Cần thêm trang vào menu? */}
        <polygon points="875,622 955,650 875,678 795,650" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="875" y="645" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          Cần thêm trang
        </text>
        <text x="875" y="660" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          vào menu?
        </text>

        {/* Nhánh CÓ: SANG LUỒNG C */}
        <path d="M 875 678 L 875 730 L 890 730" fill="none" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="898" y="705" fill="#0284C7" fontSize="10" fontWeight="700">
          Có
        </text>

        <Link href="/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong">
          <rect x="805" y="725" width="170" height="38" rx="8" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.5" />
          <text x="890" y="749" textAnchor="middle" fill="#0072BC" fontSize="12" fontWeight="800">
            SANG LUỒNG C
          </text>
        </Link>

        {/* Nhánh KHÔNG: HOÀN TẤT */}
        <path d="M 955 650 L 980 650 L 980 705 L 666 705 L 666 720" fill="none" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="955" y="685" fill="#15803D" fontSize="10" fontWeight="700">
          Không
        </text>

        <rect x="586" y="725" width="160" height="38" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
        <text x="666" y="749" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="800">
          HOÀN TẤT
        </text>

        {/* ================= GHI CHÚ CHÂN BẢN VẼ ================= */}
        <text x="25" y="750" fill="#DC2626" fontSize="11">
          {diagram04Content.bottomWarning}
        </text>

        <line x1="20" y1="765" x2="999" y2="765" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend */}
        <text x="20" y="787" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>

        <rect x="95" y="777" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="120" y="787" fill="#334155" fontSize="10.5">
          Nơi cần vào / thành phần
        </text>

        <rect x="255" y="776" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="283" y="787" fill="#334155" fontSize="10.5">
          Thao tác
        </text>

        <polygon points="345,783 352,776 359,783 352,790" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="367" y="787" fill="#334155" fontSize="10.5">
          Câu hỏi
        </text>

        <line x1="425" y1="783" x2="443" y2="783" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-04)" />
        <text x="451" y="787" fill="#334155" fontSize="10.5">
          Bước tiếp / dẫn đến
        </text>

        <line x1="565" y1="783" x2="583" y2="783" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3,3" />
        <text x="591" y="787" fill="#334155" fontSize="10.5">
          Lấy nội dung / cần giải thích
        </text>

        <text x="795" y="780" fill="#DC2626" fontSize="10" fontWeight="600">
          Đỏ: công bố / lưu ý
        </text>
        <text x="795" y="794" fill="#16A34A" fontSize="10" fontWeight="600">
          Xanh lá: kiểm tra / đúng
        </text>
      </svg>
    </div>
  );
}
