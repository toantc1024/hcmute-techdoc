'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { brandConfig } from '@/configs/app.config';

export const diagram06Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'LUỒNG C – SỬA MENU VÀ LIÊN KẾT',
  diagramNumber: '06 / 06',
  subtitle: 'Bắt đầu ở góc trái. Thêm / sửa liên kết cần chọn nơi mở đến; đổi thứ tự / xóa đi thẳng đến lưu.',
  footerDesc: 'Chân trang: kiểm tra logo, thông tin liên hệ, địa chỉ, điện thoại và thư điện tử của đơn vị.',
  helpTitle: 'Làm thế nào khi chưa có trang cần chọn?',
};

export function Diagram06MenuFlow() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-06"
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
            id="arr-red-06"
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
        <image href={brandConfig.logoUrl} x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram06Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram06Content.diagramNumber}
        </text>

        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        <text x="25" y="104" fill="#334155" fontSize="12" fontWeight="400">
          {diagram06Content.subtitle}
        </text>

        {/* ================= HÀNG 1: BẮT ĐẦU & CHỌN NƠI SỬA ================= */}
        <rect x="20" y="155" width="98" height="44" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <text x="69" y="182" textAnchor="middle" fill="#004776" fontSize="13" fontWeight="800">
          BẮT ĐẦU
        </text>

        <line x1="118" y1="177" x2="158" y2="177" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="138" y="168" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Mở
        </text>

        {/* Website -> Header & Footer */}
        <rect x="160" y="148" width="206" height="58" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="263" y="172" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Website → Header & Footer
        </text>
        <text x="263" y="190" textAnchor="middle" fill="#475569" fontSize="11">
          (Đầu trang và Chân trang)
        </text>

        <line x1="366" y1="177" x2="418" y2="177" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="392" y="168" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Chọn
        </text>

        {/* Decision: Sửa ở đâu? */}
        <polygon points="490,150 570,177 490,204 410,177" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="490" y="181" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
          Sửa ở đâu?
        </text>

        {/* Nhánh Đầu trang (lên) */}
        <path d="M 490 150 L 490 132 L 620 132 M 570 177 L 600 177 L 600 132 L 640 132" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="590" y="122" fill="#0284C7" fontSize="10" fontWeight="700">Đầu trang</text>

        <rect x="642" y="120" width="130" height="34" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="707" y="142" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Đầu trang
        </text>

        {/* Nhánh Chân trang (xuống) */}
        <path d="M 490 204 L 490 252 L 640 252" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="530" y="244" fill="#0284C7" fontSize="10" fontWeight="700">Chân trang</text>

        <rect x="642" y="235" width="130" height="34" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="707" y="257" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chân trang
        </text>

        {/* Mũi tên từ 2 nhánh vào: Chọn menu / cột cần sửa */}
        <path d="M 772 137 L 890 137 L 890 170 M 772 252 L 795 252 L 795 185 L 808 185" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="785" y="132" fill="#0284C7" fontSize="10">Chọn</text>
        <text x="785" y="244" fill="#0284C7" fontSize="10">Chọn</text>

        {/* Box Chọn menu / cột cần sửa */}
        <rect x="812" y="170" width="160" height="52" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <text x="892" y="193" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chọn menu / cột
        </text>
        <text x="892" y="209" textAnchor="middle" fill="#004776" fontSize="12">
          cần sửa
        </text>

        {/* ================= HÀNG 2: BẠN MUỐN LÀM GÌ? ================= */}
        <line x1="892" y1="222" x2="892" y2="310" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="900" y="280" fill="#0284C7" fontSize="10">Chọn thao tác</text>

        {/* Decision: Bạn muốn làm gì? */}
        <polygon points="892,315 972,342 892,369 812,342" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="892" y="338" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
          Bạn muốn
        </text>
        <text x="892" y="352" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
          làm gì?
        </text>

        {/* 3 Thao tác: Thêm/Sửa, Xóa, Đổi thứ tự */}
        {/* Thao tác 1: Đổi thứ tự */}
        <path d="M 892 369 L 892 485" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="900" y="440" fill="#0284C7" fontSize="10" fontWeight="700">Đổi thứ tự</text>

        <rect x="806" y="488" width="172" height="48" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="892" y="508" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Đổi thứ tự
        </text>
        <text x="892" y="524" textAnchor="middle" fill="#475569" fontSize="10.5">
          Dùng mũi tên lên / xuống
        </text>

        {/* Thao tác 2: Thêm / sửa */}
        <path d="M 812 342 L 738 342" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="760" y="334" fill="#0284C7" fontSize="10" fontWeight="700">Thêm / sửa</text>

        <rect x="580" y="320" width="154" height="46" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="657" y="340" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Thêm / sửa liên kết
        </text>
        <text x="657" y="355" textAnchor="middle" fill="#475569" fontSize="10.5">
          Nhập tên hiển thị
        </text>

        {/* Thao tác 3: Xóa */}
        <path d="M 657 366 L 657 485" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="668" y="440" fill="#0284C7" fontSize="10" fontWeight="700">Xóa</text>

        <rect x="576" y="488" width="162" height="48" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="657" y="508" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Xóa liên kết
        </text>
        <text x="657" y="524" textAnchor="middle" fill="#475569" fontSize="10.5">
          Bấm biểu tượng thùng rác
        </text>

        {/* Decision: Liên kết đến đâu? */}
        <line x1="580" y1="343" x2="522" y2="343" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="548" y="334" textAnchor="middle" fill="#0284C7" fontSize="10">Chọn đích</text>

        <polygon points="440,315 520,343 440,371 360,343" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="440" y="338" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          Liên kết
        </text>
        <text x="440" y="352" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          đến đâu?
        </text>

        {/* Đích 1: Trang đã có */}
        <path d="M 440 315 L 440 300 L 315 300" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="375" y="292" fill="#0284C7" fontSize="10">Trang đã có</text>

        <rect x="150" y="280" width="162" height="44" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="231" y="307" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chọn trang đã có
        </text>

        {/* Đích 2: Nơi khác */}
        <path d="M 440 371 L 440 422 L 315 422" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />
        <text x="375" y="415" fill="#0284C7" fontSize="10">Nơi khác</text>

        <rect x="150" y="400" width="162" height="46" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="231" y="420" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="700">
          Nhập đường dẫn khác
        </text>
        <text x="231" y="435" textAnchor="middle" fill="#475569" fontSize="10">
          Bật Tab mới nếu cần
        </text>

        {/* Gom các luồng về: Lưu thay đổi */}
        <path d="M 150 302 L 120 302 L 120 570 M 231 446 L 231 550 M 657 536 L 657 570 M 892 536 L 892 570 M 120 570 L 150 570" fill="none" stroke="#0284C7" strokeWidth="1.4" />
        <text x="88" y="480" fill="#0284C7" fontSize="10">Lưu</text>
        <text x="238" y="500" fill="#0284C7" fontSize="10">Lưu</text>
        <text x="500" y="562" fill="#0284C7" fontSize="10">Lưu</text>
        <text x="690" y="562" fill="#0284C7" fontSize="10">Lưu</text>

        <rect x="155" y="550" width="158" height="42" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <text x="234" y="576" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="800">
          Lưu thay đổi
        </text>

        {/* ================= HÀNG 3: KIỂM TRA & HOÀN TẤT ================= */}
        <line x1="313" y1="571" x2="368" y2="571" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="340" y="560" textAnchor="middle" fill="#0284C7" fontSize="10">Kiểm tra</text>

        {/* Mở website */}
        <rect x="370" y="548" width="108" height="46" rx="6" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
        <text x="424" y="575" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="700">
          Mở website
        </text>

        <line x1="478" y1="571" x2="500" y2="571" stroke="#16A34A" strokeWidth="1.4" markerEnd="url(#arr-blue-06)" />

        {/* Bấm thử liên kết */}
        <rect x="502" y="548" width="90" height="46" rx="6" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
        <text x="547" y="568" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="700">
          Bấm thử
        </text>
        <text x="547" y="583" textAnchor="middle" fill="#15803D" fontSize="11">
          liên kết
        </text>

        <line x1="592" y1="571" x2="630" y2="571" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />

        {/* Decision: Đã đúng chưa? */}
        <polygon points="675,548 745,571 675,594 605,571" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="675" y="567" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          Đã đúng
        </text>
        <text x="675" y="580" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          chưa?
        </text>

        {/* Nhánh ĐÚNG: HOÀN TẤT */}
        <line x1="745" y1="571" x2="815" y2="571" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="780" y="560" textAnchor="middle" fill="#15803D" fontSize="10.5" fontWeight="700">Đúng</text>

        <rect x="818" y="552" width="154" height="38" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
        <text x="895" y="576" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="800">
          HOÀN TẤT
        </text>

        {/* Nhánh CHƯA: Quay lại sửa */}
        <path d="M 675 594 L 675 620 L 990 620 L 990 196 L 974 196" fill="none" stroke="#DC2626" strokeWidth="1.4" markerEnd="url(#arr-red-06)" />
        <text x="830" y="612" fill="#DC2626" fontSize="10" fontWeight="700">
          Chưa → sửa lại
        </text>

        {/* ================= GHI CHÚ CHÂN TRANG ================= */}
        <text x="25" y="628" fill="#334155" fontSize="11">
          <tspan fontWeight="700">Chân trang:</tspan> kiểm tra logo, thông tin liên hệ, địa chỉ, điện thoại và thư điện tử của đơn vị.
        </text>

        {/* ================= HỘP HỖ TRỢ DƯỚI: CHƯA CÓ TRANG CẦN CHỌN? ================= */}
        <text x="25" y="660" fill="#0072BC" fontSize="12.5" fontWeight="800" fontStyle="italic">
          {diagram06Content.helpTitle}
        </text>

        {/* Khung 3 bước khi chưa có trang */}
        <rect x="25" y="675" width="200" height="42" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="125" y="700" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Chưa có trang cần chọn?
        </text>

        <line x1="225" y1="696" x2="295" y2="696" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="260" y="688" textAnchor="middle" fill="#0284C7" fontSize="10">Chưa có</text>

        <Link href="/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang">
          <rect x="298" y="675" width="210" height="42" rx="6" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.4" />
          <text x="403" y="700" textAnchor="middle" fill="#0072BC" fontSize="12" fontWeight="800">
            Sang Luồng A tạo trang
          </text>
        </Link>

        <line x1="508" y1="696" x2="588" y2="696" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="548" y="688" textAnchor="middle" fill="#0284C7" fontSize="10">Đã có trang</text>

        <rect x="590" y="675" width="230" height="42" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="705" y="700" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Quay lại Chọn trang
        </text>

        {/* Ghi chú footer đỏ */}
        <text x="25" y="745" fill="#DC2626" fontSize="10.5">
          Bấm thử liên kết và Tab mới; kiểm tra trên máy tính / điện thoại. Nếu chưa đúng, quay lại sửa.
        </text>

        <line x1="20" y1="760" x2="999" y2="760" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend */}
        <text x="20" y="782" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>
        <rect x="95" y="772" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="120" y="782" fill="#334155" fontSize="10.5">Nơi cần vào / thành phần</text>
        <rect x="255" y="771" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="283" y="782" fill="#334155" fontSize="10.5">Thao tác</text>
        <polygon points="345,778 352,771 359,778 352,785" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="367" y="782" fill="#334155" fontSize="10.5">Câu hỏi</text>
        <line x1="425" y1="778" x2="443" y2="778" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-06)" />
        <text x="451" y="782" fill="#334155" fontSize="10.5">Bước tiếp</text>
        <text x="795" y="775" fill="#DC2626" fontSize="10" fontWeight="600">Đỏ: công bố / lưu ý</text>
        <text x="795" y="789" fill="#16A34A" fontSize="10" fontWeight="600">Xanh lá: kiểm tra / đúng</text>
      </svg>
    </div>
  );
}
