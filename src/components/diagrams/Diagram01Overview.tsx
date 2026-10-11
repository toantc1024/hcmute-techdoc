'use client';

import React, { useState } from 'react';

export const diagram01Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'TỔNG QUAN BA CẤU TRÚC QUẢN TRỊ WEBSITE',
  diagramNumber: '01 / 06',
  subtitle: 'Sơ đồ rút gọn từ giao diện: Trang · Chuyên mục · Menu đầu trang. Tên mục giữ theo phần mềm.',
  col1: {
    title: '1. SƠ ĐỒ TRANG',
    path: 'Website → Trang → Sơ đồ Trang',
    home: 'Trang chủ của Trường · /',
    parent: 'Giới thiệu · /gioi-thieu',
    children: ['Tổng quan', 'Cơ cấu tổ chức', 'Văn bản - Biểu mẫu'],
    note: 'Mỗi trang có đường dẫn và nút Thiết kế.',
  },
  col2: {
    title: '2. CÂY CHUYÊN MỤC',
    path: 'Quản lý nội dung → Chuyên mục',
    posts: 'BÀI VIẾT · /bai-viet',
    postsChildren: ['Thông báo', 'Sự kiện'],
    docs: 'VĂN BẢN · /van-ban',
    docsChildren: ['Biểu mẫu · /bieu-mau'],
    note: 'Bài viết / văn bản chọn được cả hai nhánh.',
  },
  col3: {
    title: '3. MENU ĐẦU TRANG',
    path: 'Website → Header & Footer → Đầu trang',
    headerMenu: 'Mục đầu trang: GIỚI THIỆU',
    subText: 'Bên trong có các khối / cột',
    cols: [
      { name: 'Cột TỔNG QUAN', desc: 'Thông điệp của Hiệu trưởng' },
      { name: 'Cột QUẢN TRỊ', desc: 'Cơ cấu tổ chức · Ban Giám hiệu' },
      { name: 'Cột CÔNG KHAI', desc: 'Văn bản - Biểu mẫu' },
    ],
  },
  example: {
    title: 'VÍ DỤ NỐI BA PHẦN: VĂN BẢN - BIỂU MẪU',
    step1: 'Giới thiệu → Cột CÔNG KHAI\nLiên kết Văn bản - Biểu mẫu',
    step2: 'Trang Văn bản - Biểu mẫu\n/gioi-thieu/van-ban-bieu-mau',
    step3: 'Khối hiển thị trên trang\nChọn chuyên mục cần lấy',
    sourceBox: 'Khối Tin tức hoặc Văn bản\nCó thể chọn Khối mẫu Tin tức đa bố cục, Văn bản...',
    categoryBox: 'Chuyên mục VĂN BẢN → Biểu mẫu',
  },
  notes: [
    'Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là ví dụ chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối.',
    'Cột trong menu là nhóm liên kết, không mặc định là trang hoặc chuyên mục. Ba cây không cần giống nhau.',
  ],
};

export function Diagram01Overview() {
  const [activeCol, setActiveCol] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-01"
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
        <image href="/logo-hcm-ute.png" x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram01Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram01Content.diagramNumber}
        </text>

        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        <text x="25" y="104" fill="#334155" fontSize="12" fontWeight="400">
          {diagram01Content.subtitle}
        </text>

        {/* ================= 3 CỘT CẤU TRÚC ================= */}
        {/* CỘT 1: SƠ ĐỒ TRANG */}
        <g
          className="cursor-pointer transition-all"
          onMouseEnter={() => setActiveCol(1)}
          onMouseLeave={() => setActiveCol(null)}
        >
          <rect
            x="20"
            y="130"
            width="310"
            height="390"
            rx="4"
            fill={activeCol === 1 ? '#F0F9FF' : '#FFFFFF'}
            stroke="#0284C7"
            strokeWidth={activeCol === 1 ? '2' : '1.2'}
          />
          <text x="32" y="155" fill="#DC2626" fontSize="13.5" fontWeight="800">
            {diagram01Content.col1.title}
          </text>
          <text x="32" y="174" fill="#475569" fontSize="11">
            {diagram01Content.col1.path}
          </text>

          {/* Trang chủ */}
          <rect x="32" y="190" width="286" height="36" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
          <text x="175" y="213" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram01Content.col1.home}
          </text>

          {/* Trang con: Giới thiệu */}
          <path d="M 44 226 L 44 260 L 58 260" fill="none" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="58" y="244" width="260" height="36" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
          <text x="188" y="267" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
            {diagram01Content.col1.parent}
          </text>

          {/* 3 trang cháu */}
          {diagram01Content.col1.children.map((c, i) => {
            const y = 300 + i * 50;
            return (
              <g key={i}>
                <path d={`M 70 280 L 70 ${y + 18} L 82 ${y + 18}`} fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="82" y={y} width="236" height="36" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
                <text x="200" y={y + 23} textAnchor="middle" fill="#004776" fontSize="12" fontWeight="600">
                  {c}
                </text>
              </g>
            );
          })}

          <text x="32" y="475" fill="#64748B" fontSize="11">
            {diagram01Content.col1.note}
          </text>
        </g>

        {/* CỘT 2: CÂY CHUYÊN MỤC */}
        <g
          className="cursor-pointer transition-all"
          onMouseEnter={() => setActiveCol(2)}
          onMouseLeave={() => setActiveCol(null)}
        >
          <rect
            x="357"
            y="130"
            width="310"
            height="390"
            rx="4"
            fill={activeCol === 2 ? '#F0F9FF' : '#FFFFFF'}
            stroke="#0284C7"
            strokeWidth={activeCol === 2 ? '2' : '1.2'}
          />
          <text x="369" y="155" fill="#DC2626" fontSize="13.5" fontWeight="800">
            {diagram01Content.col2.title}
          </text>
          <text x="369" y="174" fill="#475569" fontSize="11">
            {diagram01Content.col2.path}
          </text>

          {/* BÀI VIẾT */}
          <rect x="369" y="190" width="286" height="36" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
          <text x="512" y="213" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram01Content.col2.posts}
          </text>

          {/* Con của bài viết */}
          {diagram01Content.col2.postsChildren.map((c, i) => {
            const y = 246 + i * 46;
            return (
              <g key={i}>
                <path d={`M 385 226 L 385 ${y + 18} L 403 ${y + 18}`} fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="403" y={y} width="252" height="34" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
                <text x="529" y={y + 22} textAnchor="middle" fill="#004776" fontSize="12" fontWeight="600">
                  {c}
                </text>
              </g>
            );
          })}

          {/* VĂN BẢN */}
          <rect x="369" y="350" width="286" height="36" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
          <text x="512" y="373" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram01Content.col2.docs}
          </text>

          {/* Con của văn bản */}
          {diagram01Content.col2.docsChildren.map((c, i) => {
            const y = 404 + i * 46;
            return (
              <g key={i}>
                <path d={`M 385 386 L 385 ${y + 18} L 403 ${y + 18}`} fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="403" y={y} width="252" height="34" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
                <text x="529" y={y + 22} textAnchor="middle" fill="#004776" fontSize="12" fontWeight="600">
                  {c}
                </text>
              </g>
            );
          })}

          <text x="369" y="475" fill="#64748B" fontSize="11">
            {diagram01Content.col2.note}
          </text>
        </g>

        {/* CỘT 3: MENU ĐẦU TRANG */}
        <g
          className="cursor-pointer transition-all"
          onMouseEnter={() => setActiveCol(3)}
          onMouseLeave={() => setActiveCol(null)}
        >
          <rect
            x="694"
            y="130"
            width="310"
            height="390"
            rx="4"
            fill={activeCol === 3 ? '#F0F9FF' : '#FFFFFF'}
            stroke="#0284C7"
            strokeWidth={activeCol === 3 ? '2' : '1.2'}
          />
          <text x="706" y="155" fill="#DC2626" fontSize="13.5" fontWeight="800">
            {diagram01Content.col3.title}
          </text>
          <text x="706" y="174" fill="#475569" fontSize="11">
            {diagram01Content.col3.path}
          </text>

          {/* Mục đầu trang */}
          <rect x="706" y="190" width="286" height="38" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
          <text x="849" y="214" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram01Content.col3.headerMenu}
          </text>

          <text x="706" y="248" fill="#334155" fontSize="11" fontWeight="600">
            {diagram01Content.col3.subText}
          </text>

          {/* 3 cột bên trong menu */}
          {diagram01Content.col3.cols.map((col, i) => {
            const y = 265 + i * 65;
            return (
              <g key={i}>
                <path d={`M 720 228 L 720 ${y + 26} L 734 ${y + 26}`} fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="734" y={y} width="258" height="52" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
                <text x="863" y={y + 22} textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
                  {col.name}
                </text>
                <text x="863" y={y + 40} textAnchor="middle" fill="#64748B" fontSize="11">
                  {col.desc}
                </text>
              </g>
            );
          })}
        </g>

        {/* ================= VÍ DỤ NỐI BA PHẦN ================= */}
        <text x="20" y="545" fill="#004776" fontSize="13.5" fontWeight="800">
          {diagram01Content.example.title}
        </text>

        {/* Box 1: Cột Công khai */}
        <rect x="20" y="560" width="256" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="148" y="583" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Giới thiệu → Cột CÔNG KHAI
        </text>
        <text x="148" y="601" textAnchor="middle" fill="#64748B" fontSize="11">
          Liên kết Văn bản - Biểu mẫu
        </text>

        {/* Mũi tên 1: Bấm để mở */}
        <line x1="276" y1="587" x2="370" y2="587" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-01)" />
        <text x="323" y="578" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Bấm để mở
        </text>

        {/* Box 2: Trang Văn bản - Biểu mẫu */}
        <rect x="372" y="560" width="284" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="514" y="583" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Trang Văn bản - Biểu mẫu
        </text>
        <text x="514" y="601" textAnchor="middle" fill="#64748B" fontSize="10.5">
          /gioi-thieu/van-ban-bieu-mau
        </text>

        {/* Mũi tên 2: Chứa */}
        <line x1="656" y1="587" x2="758" y2="587" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-01)" />
        <text x="707" y="578" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Chứa
        </text>

        {/* Box 3: Khối hiển thị trên trang */}
        <rect x="760" y="560" width="244" height="54" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="882" y="583" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          Khối hiển thị trên trang
        </text>
        <text x="882" y="601" textAnchor="middle" fill="#64748B" fontSize="11">
          Chọn chuyên mục cần lấy
        </text>

        {/* Box 4: Khối tin tức hoặc văn bản */}
        <rect x="20" y="640" width="256" height="46" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="148" y="660" textAnchor="middle" fill="#004776" fontSize="11.5" fontWeight="700">
          Khối Tin tức hoặc Văn bản
        </text>
        <text x="148" y="675" textAnchor="middle" fill="#64748B" fontSize="9.5">
          Có thể chọn Khối mẫu Tin tức đa bố cục, Văn bản...
        </text>

        {/* Mũi tên 3: Chọn nhóm */}
        <line x1="276" y1="663" x2="370" y2="663" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-01)" />
        <text x="323" y="655" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Chọn nhóm
        </text>

        {/* Box 5: Chuyên mục Văn bản -> Biểu mẫu */}
        <rect x="372" y="640" width="284" height="46" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="514" y="668" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
          Chuyên mục VĂN BẢN → Biểu mẫu
        </text>

        {/* Đường nối nét đứt: Lấy nội dung theo nhóm */}
        <path
          d="M 656 663 L 882 663 L 882 616"
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#arr-blue-01)"
        />
        <text x="760" y="655" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Lấy nội dung theo nhóm
        </text>

        {/* ================= GHI CHÚ CHÂN BẢN VẼ ================= */}
        <text x="20" y="718" fill="#475569" fontSize="11.5">
          Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là{' '}
          <tspan fill="#DC2626" fontWeight="700">
            ví dụ
          </tspan>{' '}
          chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối.
        </text>
        <text x="20" y="738" fill="#DC2626" fontSize="11">
          Cột trong menu là nhóm liên kết, không mặc định là trang hoặc chuyên mục. Ba cây không cần giống nhau.
        </text>

        <line x1="20" y1="755" x2="999" y2="755" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend / Chú thích */}
        <text x="20" y="780" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>

        <rect x="95" y="770" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="120" y="780" fill="#334155" fontSize="10.5">
          Nơi cần vào / thành phần
        </text>

        <rect x="255" y="769" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="283" y="780" fill="#334155" fontSize="10.5">
          Thao tác
        </text>

        <polygon points="345,776 352,769 359,776 352,783" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="367" y="780" fill="#334155" fontSize="10.5">
          Câu hỏi
        </text>

        <line x1="425" y1="776" x2="443" y2="776" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-01)" />
        <text x="451" y="780" fill="#334155" fontSize="10.5">
          Bước tiếp / dẫn đến
        </text>

        <line x1="565" y1="776" x2="583" y2="776" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3,3" />
        <text x="591" y="780" fill="#334155" fontSize="10.5">
          Lấy nội dung / cần giải thích
        </text>

        <text x="795" y="773" fill="#DC2626" fontSize="10" fontWeight="600">
          Đỏ: công bố / lưu ý
        </text>
        <text x="795" y="787" fill="#16A34A" fontSize="10" fontWeight="600">
          Xanh lá: kiểm tra / đúng
        </text>
      </svg>
    </div>
  );
}
