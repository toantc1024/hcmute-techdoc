'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/configs/app.config';

export const diagram03Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'MỐI QUAN HỆ GIỮA CÂY TRANG, MENU VÀ CHUYÊN MỤC',
  diagramNumber: '03 / 06',
  subtitle: 'Đọc theo mũi tên: tạo trang → gắn liên kết vào menu; chọn chuyên mục cho phần hiển thị.',
  steps: [
    '1. Tạo cây trang',
    '2. Tạo chuyên mục',
    '3. Bố trí nội dung trang',
    '4. Gắn trang vào menu',
    '5. Kiểm tra',
  ],
  notes: [
    'Tạo trang không tự tạo mục menu. Chuyên mục phân nhóm nội dung, không thay thế trang.',
    'Cùng một bài viết hoặc văn bản có thể hiện đồng thời ở cả hai khối khi chọn chuyên mục phù hợp.',
    'Nét đứt: khối hiển thị lấy nội dung theo chuyên mục đã chọn. Tên nhánh không giới hạn loại nội dung.',
  ],
};

export function Diagram03Relations() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-03"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7" />
          </marker>
        </defs>

        {/* Nền bản vẽ */}
        <rect width="1024" height="820" fill="#FFFFFF" rx="12" />

        {/* ================= HEADER BANNER ================= */}
        <image href={brandConfig.logoUrl} x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram03Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram03Content.diagramNumber}
        </text>

        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        <text x="25" y="104" fill="#334155" fontSize="12" fontWeight="400">
          {diagram03Content.subtitle}
        </text>

        {/* ================= CỘT 1: CÂY TRANG VÀ MENU ĐẦU TRANG ================= */}
        <text x="25" y="130" fill="#DC2626" fontSize="13" fontWeight="800">
          CÂY TRANG VÀ MENU ĐẦU TRANG
        </text>

        {/* Khung Cây Trang */}
        <rect x="20" y="145" width="248" height="175" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="32" y="166" fill="#004776" fontSize="11.5" fontWeight="700">
          CÂY TRANG · Website → Trang
        </text>

        <rect x="32" y="180" width="224" height="42" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="144" y="198" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Trang: Giới thiệu
        </text>
        <text x="144" y="213" textAnchor="middle" fill="#64748B" fontSize="10.5">
          /gioi-thieu
        </text>

        <path d="M 48 222 L 48 258 L 56 258" fill="none" stroke="#0284C7" strokeWidth="1.5" />
        <text x="54" y="242" fill="#0284C7" fontSize="10" fontWeight="600">
          Có trang con
        </text>
        <rect x="56" y="240" width="200" height="60" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="156" y="260" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="700">
          Trang: Cơ cấu tổ chức
        </text>
        <text x="156" y="276" textAnchor="middle" fill="#64748B" fontSize="9.5">
          /gioi-thieu/so-do-to-chuc
        </text>

        {/* Khung Menu Đầu Trang */}
        <rect x="20" y="335" width="248" height="190" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="32" y="356" fill="#004776" fontSize="11.5" fontWeight="700">
          MENU ĐẦU TRANG
        </text>

        <rect x="32" y="368" width="224" height="30" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="144" y="388" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Mục: GIỚI THIỆU
        </text>

        <line x1="144" y1="398" x2="144" y2="415" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="160" y="410" fill="#0284C7" fontSize="9.5" fontWeight="600">
          Chứa cột
        </text>

        <rect x="46" y="418" width="210" height="30" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="151" y="438" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Cột: QUẢN TRỊ
        </text>

        <line x1="151" y1="448" x2="151" y2="465" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="165" y="460" fill="#0284C7" fontSize="9.5" fontWeight="600">
          Chứa liên kết
        </text>

        <rect x="46" y="468" width="210" height="30" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="151" y="488" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Liên kết: Cơ cấu tổ chức
        </text>
        <text x="32" y="515" fill="#64748B" fontSize="10">
          Người đọc bấm để mở trang.
        </text>

        {/* ================= CỘT 2: TRANG NGƯỜI ĐỌC MỞ ================= */}
        <text x="390" y="130" fill="#DC2626" fontSize="13" fontWeight="800">
          TRANG NGƯỜI ĐỌC MỞ
        </text>

        {/* Box Trang Cơ cấu tổ chức */}
        <rect x="392" y="165" width="270" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="527" y="188" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          TRANG CƠ CẤU TỔ CHỨC
        </text>
        <text x="527" y="206" textAnchor="middle" fill="#64748B" fontSize="10.5">
          /gioi-thieu/so-do-to-chuc
        </text>

        {/* Mũi tên từ Trang con sang Trang Người đọc mở */}
        <path d="M 256 270 L 320 270 L 320 192 L 388 192" fill="none" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="272" y="260" fill="#0284C7" fontSize="10" fontWeight="600">
          Tạo / sửa trang
        </text>

        {/* Mũi tên từ Menu sang Trang Người đọc mở */}
        <path d="M 256 483 L 335 483 L 335 224 L 527 224" fill="none" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="272" y="473" fill="#0284C7" fontSize="10" fontWeight="600">
          Chọn trang để liên kết
        </text>

        {/* Khung Các Phần Trên Trang */}
        <line x1="597" y1="219" x2="597" y2="295" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="605" y="248" fill="#0284C7" fontSize="10" fontWeight="600">
          Chứa
        </text>

        <rect x="392" y="295" width="270" height="230" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="404" y="318" fill="#004776" fontSize="11" fontWeight="800">
          CÁC PHẦN TRÊN TRANG
        </text>

        {/* Khối Ảnh / Giới thiệu */}
        <rect x="406" y="330" width="242" height="42" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="527" y="348" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          ẢNH / GIỚI THIỆU
        </text>
        <text x="527" y="363" textAnchor="middle" fill="#64748B" fontSize="10">
          Thông tin cơ cấu tổ chức
        </text>

        {/* Khối Tin tức đa bố cục */}
        <rect x="406" y="390" width="242" height="46" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="527" y="417" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          KHỐI TIN TỨC ĐA BỐ CỤC
        </text>

        {/* Khối Văn bản */}
        <rect x="406" y="456" width="242" height="46" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="527" y="483" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          KHỐI VĂN BẢN
        </text>

        {/* ================= CỘT 3: NỘI DUNG VÀ CHUYÊN MỤC ================= */}
        <text x="790" y="130" fill="#DC2626" fontSize="13" fontWeight="800">
          NỘI DUNG VÀ CHUYÊN MỤC
        </text>

        {/* Bài viết */}
        <rect x="788" y="165" width="210" height="40" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="893" y="190" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          BÀI VIẾT
        </text>

        <line x1="893" y1="205" x2="893" y2="260" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="942" y="235" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Chọn nhóm
        </text>

        {/* Văn bản */}
        <rect x="788" y="260" width="210" height="48" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="893" y="280" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          VĂN BẢN
        </text>
        <text x="893" y="296" textAnchor="middle" fill="#64748B" fontSize="10">
          Thông tin và tệp toàn văn
        </text>

        <line x1="893" y1="308" x2="893" y2="400" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="942" y="355" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Chọn nhóm
        </text>

        {/* Cây Chuyên mục chung */}
        <rect x="780" y="402" width="224" height="123" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="892" y="426" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="800">
          CÂY CHUYÊN MỤC CHUNG
        </text>
        <text x="892" y="445" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="600">
          Nhánh BÀI VIẾT
        </text>
        <text x="892" y="462" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="600">
          Nhánh VĂN BẢN
        </text>
        <text x="892" y="482" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="700">
          Chọn được cả hai nhánh
        </text>

        {/* Đường nối nét đứt sang các khối hiển thị */}
        <path d="M 780 435 L 650 435" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-blue-03)" />
        <text x="705" y="426" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Lấy theo nhóm đã chọn
        </text>

        <path d="M 892 525 L 892 560 L 650 560 L 650 495" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-blue-03)" />
        <text x="705" y="572" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="600">
          Lấy theo nhóm đã chọn
        </text>

        {/* ================= GHI CHÚ QUY TẮC ================= */}
        <text x="25" y="605" fill="#DC2626" fontSize="11">
          Tạo trang không tự tạo mục menu. Chuyên mục phân nhóm nội dung, không thay thế trang.
        </text>
        <text x="25" y="622" fill="#334155" fontSize="11">
          Cùng một bài viết hoặc văn bản có thể hiện đồng thời ở cả hai khối khi chọn chuyên mục phù hợp.
        </text>

        {/* ================= THỨ TỰ THIẾT LẬP 5 BƯỚC ================= */}
        <text x="25" y="650" fill="#004776" fontSize="13" fontWeight="800">
          THỨ TỰ THIẾT LẬP
        </text>

        <g>
          {diagram03Content.steps.map((st, i) => {
            const bx = 25 + i * 196;
            const isLast = i === 4;
            const isHov = hoveredStep === i;
            return (
              <g
                key={i}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <rect
                  x={bx}
                  y="665"
                  width="155"
                  height="44"
                  rx="10"
                  fill={isLast ? (isHov ? '#DCFCE7' : '#F0FDF4') : isHov ? '#F0F9FF' : '#FFFFFF'}
                  stroke={isLast ? '#16A34A' : '#0284C7'}
                  strokeWidth={isHov ? '2' : '1.3'}
                />
                <text
                  x={bx + 77}
                  y="692"
                  textAnchor="middle"
                  fill={isLast ? '#15803D' : '#004776'}
                  fontSize="12"
                  fontWeight={isLast ? '800' : '700'}
                >
                  {st}
                </text>

                {i < 4 && (
                  <line
                    x1={bx + 155}
                    y1="687"
                    x2={bx + 194}
                    y2="687"
                    stroke="#0284C7"
                    strokeWidth="1.5"
                    markerEnd="url(#arr-blue-03)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Ghi chú chân trang */}
        <text x="25" y="730" fill="#64748B" fontSize="11">
          Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là <tspan fill="#DC2626" fontWeight="700">ví dụ</tspan> chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối.
        </text>
        <text x="25" y="746" fill="#DC2626" fontSize="11">
          Nét đứt: khối hiển thị lấy nội dung theo chuyên mục đã chọn. Tên nhánh không giới hạn loại nội dung.
        </text>

        <line x1="20" y1="760" x2="999" y2="760" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend / Chú thích */}
        <text x="20" y="782" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>

        <rect x="95" y="772" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="120" y="782" fill="#334155" fontSize="10.5">
          Nơi cần vào / thành phần
        </text>

        <rect x="255" y="771" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="283" y="782" fill="#334155" fontSize="10.5">
          Thao tác
        </text>

        <polygon points="345,778 352,771 359,778 352,785" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="367" y="782" fill="#334155" fontSize="10.5">
          Câu hỏi
        </text>

        <line x1="425" y1="778" x2="443" y2="778" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-03)" />
        <text x="451" y="782" fill="#334155" fontSize="10.5">
          Bước tiếp / dẫn đến
        </text>

        <line x1="565" y1="778" x2="583" y2="778" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3,3" />
        <text x="591" y="782" fill="#334155" fontSize="10.5">
          Lấy nội dung / cần giải thích
        </text>

        <text x="795" y="775" fill="#DC2626" fontSize="10" fontWeight="600">
          Đỏ: công bố / lưu ý
        </text>
        <text x="795" y="789" fill="#16A34A" fontSize="10" fontWeight="600">
          Xanh lá: kiểm tra / đúng
        </text>
      </svg>
    </div>
  );
}
