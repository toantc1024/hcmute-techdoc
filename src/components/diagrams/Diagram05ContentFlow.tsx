'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/configs/app.config';

export const diagram05Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'LUỒNG B – SOẠN, DUYỆT VÀ CÔNG BỐ NỘI DUNG',
  diagramNumber: '05 / 06',
  subtitle: 'Lưu ≠ Gửi duyệt ≠ Công bố. Theo đúng nhánh Bài viết hoặc Văn bản.',
  noteBottom: 'Bài viết và văn bản đều phải chọn chuyên mục. Công bố theo quyền; kiểm tra các khối đã chọn và tệp kèm.',
};

export function Diagram05ContentFlow() {
  const [activeTab, setActiveTab] = useState<'all' | 'post' | 'doc'>('all');

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-05"
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
            id="arr-red-05"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC2626" />
          </marker>
          <marker
            id="arr-green-05"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16A34A" />
          </marker>
        </defs>

        {/* Nền bản vẽ */}
        <rect width="1024" height="820" fill="#FFFFFF" rx="12" />

        {/* ================= HEADER BANNER ================= */}
        <image href={brandConfig.logoUrl} x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram05Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram05Content.diagramNumber}
        </text>

        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        <text x="25" y="104" fill="#DC2626" fontSize="12" fontWeight="600">
          {diagram05Content.subtitle}
        </text>

        {/* ================= CỘT KHỞI TẠO BÊN TRÁI ================= */}
        <rect x="25" y="130" width="165" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="107" y="152" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Quản lý nội dung
        </text>
        <text x="107" y="169" textAnchor="middle" fill="#475569" fontSize="11">
          → Văn bản và bài viết
        </text>

        <line x1="190" y1="157" x2="242" y2="157" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="216" y="148" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Chọn
        </text>

        {/* Decision: Bạn muốn đăng gì? */}
        <polygon points="310,132 375,157 310,182 245,157" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="310" y="153" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          Bạn muốn
        </text>
        <text x="310" y="167" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
          đăng gì?
        </text>

        {/* ================= NHÁNH 1: BÀI VIẾT ================= */}
        {/* Đường nối lên nhánh Bài viết */}
        <path d="M 375 157 L 420 157 L 420 155 L 460 155" fill="none" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="430" y="148" fill="#0284C7" fontSize="10.5" fontWeight="700">
          Bài viết
        </text>

        {/* Tạo bài viết */}
        <rect x="464" y="132" width="138" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="533" y="160" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="800">
          Tạo bài viết
        </text>

        <line x1="602" y1="155" x2="644" y2="155" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="623" y="146" textAnchor="middle" fill="#0284C7" fontSize="10">Nhập</text>

        {/* Nhập tiêu đề */}
        <rect x="648" y="132" width="138" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="717" y="160" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Nhập tiêu đề
        </text>

        <line x1="786" y1="155" x2="828" y2="155" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="807" y="146" textAnchor="middle" fill="#0284C7" fontSize="10">Chọn</text>

        {/* Chọn ảnh bìa */}
        <rect x="832" y="132" width="138" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="901" y="160" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chọn ảnh bìa
        </text>

        {/* Mũi tên từ Chọn ảnh bìa đi xuống Hàng dưới */}
        <path d="M 901 178 L 901 240 L 880 240 L 968 240 M 901 178 L 901 250" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="942" y="215" fill="#0284C7" fontSize="10">Phân loại</text>

        {/* Chọn chuyên mục */}
        <rect x="832" y="252" width="138" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="901" y="280" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chọn chuyên mục
        </text>

        <line x1="832" y1="275" x2="790" y2="275" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="811" y="266" textAnchor="middle" fill="#0284C7" fontSize="10">Soạn</text>

        {/* Nhập nội dung */}
        <rect x="648" y="252" width="138" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="717" y="280" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Nhập nội dung
        </text>

        <line x1="648" y1="275" x2="618" y2="275" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="633" y="240" textAnchor="middle" fill="#0284C7" fontSize="10">Xem</text>

        {/* Xem trước */}
        <rect x="530" y="252" width="86" height="46" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.4" />
        <text x="573" y="280" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="700">
          Xem trước
        </text>

        <line x1="530" y1="275" x2="496" y2="275" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />

        {/* Lưu */}
        <rect x="440" y="252" width="54" height="46" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="467" y="280" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Lưu
        </text>

        {/* Mũi tên từ Lưu sang Kiểm tra quyền duyệt */}
        <path d="M 440 275 L 310 275 L 310 260 M 310 182 L 310 260" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="350" y="215" fill="#0284C7" fontSize="10.5" fontWeight="600">Kiểm tra</text>

        {/* Decision: Có cần duyệt theo quyền? */}
        <polygon points="310,265 375,290 310,315 245,290" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="310" y="286" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="700">
          Có cần duyệt
        </text>
        <text x="310" y="299" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="700">
          theo quyền?
        </text>

        {/* Nhánh KHÔNG CẦN DUYỆT */}
        <path d="M 375 290 L 520 290 L 520 345 L 750 345 L 750 410" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="590" y="340" fill="#0284C7" fontSize="10" fontWeight="600">
          Không cần duyệt
        </text>

        {/* Nhánh CÓ CẦN DUYỆT */}
        <line x1="310" y1="315" x2="310" y2="410" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="322" y="360" fill="#0284C7" fontSize="10" fontWeight="700">Có</text>

        {/* Gửi duyệt */}
        <rect x="235" y="415" width="150" height="42" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="310" y="441" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Quy trình → Gửi duyệt
        </text>

        <line x1="385" y1="436" x2="445" y2="436" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="415" y="425" textAnchor="middle" fill="#0284C7" fontSize="9.5">Chờ duyệt</text>

        {/* Decision: Kết quả duyệt? */}
        <polygon points="505,410 565,436 505,462 445,436" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        <text x="505" y="432" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="700">
          Kết quả
        </text>
        <text x="505" y="445" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="700">
          duyệt?
        </text>

        {/* Nhánh ĐƯỢC DUYỆT */}
        <line x1="565" y1="436" x2="675" y2="436" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="618" y="425" textAnchor="middle" fill="#15803D" fontSize="10" fontWeight="700">Được duyệt</text>

        {/* Quy trình -> Xuất bản (Red Border) */}
        <rect x="678" y="415" width="144" height="42" rx="8" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
        <text x="750" y="441" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="800">
          Quy trình → Xuất bản
        </text>

        {/* Nhánh TỪ CHỐI */}
        <line x1="505" y1="462" x2="505" y2="515" stroke="#DC2626" strokeWidth="1.4" markerEnd="url(#arr-red-05)" />
        <text x="540" y="495" fill="#DC2626" fontSize="10" fontWeight="700">Từ chối</text>

        <rect x="445" y="520" width="120" height="38" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="505" y="544" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Sửa bài
        </text>

        <line x1="445" y1="539" x2="400" y2="539" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <rect x="345" y="520" width="52" height="38" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="371" y="544" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Lưu
        </text>

        {/* Gửi duyệt lại */}
        <path d="M 345 539 L 310 539 L 310 460" fill="none" stroke="#DC2626" strokeWidth="1.4" markerEnd="url(#arr-red-05)" />
        <text x="270" y="505" fill="#DC2626" fontSize="9.5" fontWeight="700">Gửi duyệt lại</text>

        {/* Mở website kiểm tra (Green border) */}
        <line x1="822" y1="436" x2="860" y2="436" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="840" y="390" fill="#0284C7" fontSize="9.5">Kiểm tra</text>

        <rect x="862" y="415" width="108" height="54" rx="8" fill="#FFFFFF" stroke="#16A34A" strokeWidth="1.5" />
        <text x="916" y="438" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="800">
          Mở website
        </text>
        <text x="916" y="453" textAnchor="middle" fill="#15803D" fontSize="11">
          kiểm tra
        </text>

        {/* Chia sẻ bài viết */}
        <line x1="916" y1="469" x2="916" y2="525" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-green-05)" />
        <text x="926" y="498" fill="#15803D" fontSize="9.5">Đúng → chia sẻ khi cần</text>

        <rect x="850" y="528" width="132" height="54" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="916" y="550" textAnchor="middle" fill="#004776" fontSize="11" fontWeight="800">
          Chia sẻ bài viết
        </text>
        <text x="916" y="565" textAnchor="middle" fill="#475569" fontSize="10">
          Sao chép link /
        </text>
        <text x="916" y="577" textAnchor="middle" fill="#475569" fontSize="10">
          Tạo mã QR
        </text>

        {/* HOÀN TẤT */}
        <line x1="916" y1="582" x2="916" y2="608" stroke="#16A34A" strokeWidth="1.5" markerEnd="url(#arr-green-05)" />
        <rect x="862" y="612" width="108" height="36" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
        <text x="916" y="635" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="800">
          HOÀN TẤT
        </text>

        {/* ================= NHÁNH 2: VĂN BẢN ================= */}
        <path d="M 310 182 L 310 200 L 107 200 L 107 615" fill="none" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="148" y="560" fill="#0284C7" fontSize="11" fontWeight="700">
          Văn bản
        </text>

        {/* Ban hành văn bản */}
        <rect x="25" y="620" width="165" height="50" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="107" y="650" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="800">
          Ban hành văn bản
        </text>

        <line x1="190" y1="645" x2="238" y2="645" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="214" y="635" textAnchor="middle" fill="#0284C7" fontSize="10">Nhập</text>

        {/* Nhập thông tin */}
        <rect x="242" y="615" width="180" height="60" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="332" y="637" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="800">
          Nhập thông tin
        </text>
        <text x="332" y="652" textAnchor="middle" fill="#475569" fontSize="10">
          Trích yếu, số hiệu
        </text>
        <text x="332" y="666" textAnchor="middle" fill="#475569" fontSize="10">
          Ngày ban hành, người ký
        </text>

        <line x1="422" y1="645" x2="470" y2="645" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="446" y="635" textAnchor="middle" fill="#0284C7" fontSize="10">Thêm</text>

        {/* Thêm tệp toàn văn */}
        <rect x="474" y="620" width="160" height="50" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="554" y="642" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Thêm tệp toàn văn
        </text>
        <text x="554" y="657" textAnchor="middle" fill="#004776" fontSize="10.5">
          và nội dung
        </text>

        {/* Chọn chuyên mục */}
        <line x1="554" y1="670" x2="554" y2="702" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="585" y="692" fill="#0284C7" fontSize="10">Phân loại</text>

        <rect x="474" y="706" width="160" height="42" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.4" />
        <text x="554" y="732" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Chọn chuyên mục
        </text>

        {/* Xem trước, Lưu, Công bố */}
        <path d="M 634 645 L 675 645 L 675 628 L 710 628" fill="none" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <text x="670" y="605" fill="#0284C7" fontSize="10">Kiểm tra</text>

        <rect x="700" y="612" width="150" height="34" rx="8" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.3" />
        <text x="775" y="634" textAnchor="middle" fill="#15803D" fontSize="11.5" fontWeight="700">
          Xem trước
        </text>

        <line x1="775" y1="646" x2="775" y2="665" stroke="#0284C7" strokeWidth="1.4" markerEnd="url(#arr-blue-05)" />
        <rect x="700" y="670" width="150" height="34" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="775" y="692" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Lưu
        </text>

        <line x1="775" y1="704" x2="775" y2="720" stroke="#DC2626" strokeWidth="1.4" markerEnd="url(#arr-red-05)" />
        <rect x="700" y="724" width="150" height="38" rx="8" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
        <text x="775" y="748" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="800">
          Công bố (Hiện)
        </text>

        {/* ================= GHI CHÚ CHÂN BẢN VẼ ================= */}
        <text x="25" y="776" fill="#DC2626" fontSize="11">
          {diagram05Content.noteBottom}
        </text>

        <line x1="20" y1="786" x2="999" y2="786" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend */}
        <text x="20" y="805" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>
        <rect x="95" y="795" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="120" y="805" fill="#334155" fontSize="10.5">Nơi cần vào / thành phần</text>
        <rect x="255" y="794" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="283" y="805" fill="#334155" fontSize="10.5">Thao tác</text>
        <polygon points="345,801 352,794 359,801 352,808" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="367" y="805" fill="#334155" fontSize="10.5">Câu hỏi</text>
        <line x1="425" y1="801" x2="443" y2="801" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-05)" />
        <text x="451" y="805" fill="#334155" fontSize="10.5">Bước tiếp</text>
        <text x="795" y="798" fill="#DC2626" fontSize="10" fontWeight="600">Đỏ: công bố / lưu ý</text>
        <text x="795" y="812" fill="#16A34A" fontSize="10" fontWeight="600">Xanh lá: kiểm tra / đúng</text>
      </svg>
    </div>
  );
}
