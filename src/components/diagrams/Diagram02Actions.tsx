'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const diagram02Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'LUỒNG HÀNH ĐỘNG CƠ BẢN TẠI WEBSITE',
  diagramNumber: '02 / 06',
  subtitle: 'Trước khi chọn: đăng nhập, kiểm tra đúng đơn vị và ngôn ngữ nội dung.',
  question: {
    line1: 'Thầy/Cô',
    line2: 'muốn làm việc gì?',
  },
  branches: [
    {
      id: 'branch-a',
      step1: 'TẠO HOẶC SỬA TRANG',
      step2: 'Website → Trang',
      target: 'LUỒNG A · SƠ ĐỒ 04',
      targetHref: '/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang',
      examples: 'VD: Giới thiệu · Cơ cấu tổ chức\nChức năng nhiệm vụ',
    },
    {
      id: 'branch-b',
      step1: 'ĐĂNG NỘI DUNG',
      step2: 'Quản lý nội dung\n→ Văn bản và bài viết',
      target: 'LUỒNG B · SƠ ĐỒ 05',
      targetHref: '/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban',
      examples: 'VD: Tin tức · Hoạt động\nThông báo · Văn bản',
    },
    {
      id: 'branch-c',
      step1: 'SỬA MENU / LIÊN KẾT',
      step2: 'Website → Header & Footer\n(Đầu trang và Chân trang)',
      target: 'LUỒNG C · SƠ ĐỒ 06',
      targetHref: '/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong',
      examples: 'VD: Tên menu · Thêm liên kết\nĐổi thứ tự · Liên kết chân trang',
    },
  ],
  bottomNote:
    'Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là ví dụ chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối.',
};

export function Diagram02Actions() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          {/* Marker Arrows */}
          <marker
            id="arr-blue-02"
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
        {/* Logo HCM-UTE */}
        <image href="/logo-hcm-ute.png" x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram02Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE ·{' '}
          <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        {/* Số hiệu sơ đồ */}
        <text x="940" y="44" fill="#0284C7" fontSize="11" fontWeight="600">
          SƠ ĐỒ
        </text>
        <text x="940" y="66" fill="#0284C7" fontSize="23" fontWeight="800">
          {diagram02Content.diagramNumber}
        </text>

        {/* Đường kẻ ngang header */}
        <line x1="25" y1="82" x2="999" y2="82" stroke="#0072BC" strokeWidth="1.5" />

        {/* Subtitle */}
        <text x="25" y="104" fill="#334155" fontSize="12" fontWeight="400">
          {diagram02Content.subtitle}
        </text>

        {/* ================= CÂU HỎI TRUNG TÂM ================= */}
        <g className="cursor-pointer">
          <rect
            x="425"
            y="155"
            width="174"
            height="64"
            rx="6"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          <text
            x="512"
            y="182"
            textAnchor="middle"
            fill="#92400E"
            fontSize="12.5"
            fontWeight="700"
          >
            {diagram02Content.question.line1}
          </text>
          <text
            x="512"
            y="201"
            textAnchor="middle"
            fill="#92400E"
            fontSize="12.5"
            fontWeight="500"
          >
            {diagram02Content.question.line2}
          </text>
        </g>

        {/* Đường nối từ câu hỏi rẽ sang 3 nhánh */}
        <path
          d="M 512 219 L 512 260 M 171 260 L 854 260 M 171 260 L 171 310 M 512 260 L 512 310 M 854 260 L 854 310"
          stroke="#0284C7"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arr-blue-02)"
        />

        {/* Nhãn "Chọn" trên 3 nhánh */}
        <text x="180" y="278" fill="#0284C7" fontSize="11" fontWeight="600">
          Chọn
        </text>
        <text x="522" y="278" fill="#0284C7" fontSize="11" fontWeight="600">
          Chọn
        </text>
        <text x="864" y="278" fill="#0284C7" fontSize="11" fontWeight="600">
          Chọn
        </text>

        {/* ================= 3 NHÁNH THAO TÁC ================= */}
        {diagram02Content.branches.map((b, idx) => {
          const colX = 34 + idx * 341;
          const centerX = colX + 137;
          const isHovered = activeBranch === b.id;

          return (
            <g
              key={b.id}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActiveBranch(b.id)}
              onMouseLeave={() => setActiveBranch(null)}
            >
              {/* Box Hàng 1: Thao tác chính */}
              <rect
                x={colX}
                y="315"
                width="274"
                height="48"
                rx="8"
                fill={isHovered ? '#F0F9FF' : '#FFFFFF'}
                stroke="#0284C7"
                strokeWidth={isHovered ? '2.5' : '1.5'}
              />
              <text
                x={centerX}
                y="345"
                textAnchor="middle"
                fill="#004776"
                fontSize="13"
                fontWeight="700"
              >
                {b.step1}
              </text>

              {/* Mũi tên từ Hàng 1 xuống Hàng 2 */}
              <line
                x1={centerX}
                y1="363"
                x2={centerX}
                y2="422"
                stroke="#0284C7"
                strokeWidth="1.5"
                markerEnd="url(#arr-blue-02)"
              />
              <text x={centerX + 8} y="394" fill="#0284C7" fontSize="11" fontWeight="600">
                Mở
              </text>

              {/* Box Hàng 2: Vị trí giao diện */}
              <rect
                x={colX}
                y="426"
                width="274"
                height="56"
                rx="4"
                fill={isHovered ? '#F0F9FF' : '#FFFFFF'}
                stroke="#0284C7"
                strokeWidth={isHovered ? '2.5' : '1.5'}
              />
              {b.step2.split('\n').map((line, lIdx) => (
                <text
                  key={lIdx}
                  x={centerX}
                  y={b.step2.includes('\n') ? 450 + lIdx * 18 : 459}
                  textAnchor="middle"
                  fill="#004776"
                  fontSize="12.5"
                  fontWeight={lIdx === 0 ? '700' : '500'}
                >
                  {line}
                </text>
              ))}

              {/* Mũi tên từ Hàng 2 xuống Hàng 3 */}
              <line
                x1={centerX}
                y1="482"
                x2={centerX}
                y2="588"
                stroke="#0284C7"
                strokeWidth="1.5"
                markerEnd="url(#arr-blue-02)"
              />
              <text x={centerX + 8} y="536" fill="#0284C7" fontSize="11" fontWeight="600">
                Làm theo
              </text>

              {/* Box Hàng 3: Capsule Đích đến */}
              <Link href={b.targetHref}>
                <rect
                  x={colX}
                  y="592"
                  width="274"
                  height="44"
                  rx="10"
                  fill={isHovered ? '#DCFCE7' : '#F0FDF4'}
                  stroke="#16A34A"
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />
                <text
                  x={centerX}
                  y="619"
                  textAnchor="middle"
                  fill="#15803D"
                  fontSize="13"
                  fontWeight="800"
                  letterSpacing="0.2"
                >
                  {b.target}
                </text>
              </Link>

              {/* Ví dụ dưới capsule */}
              {b.examples.split('\n').map((ex, exIdx) => (
                <text
                  key={exIdx}
                  x={colX + 5}
                  y={660 + exIdx * 16}
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="400"
                >
                  {ex}
                </text>
              ))}
            </g>
          );
        })}

        {/* ================= GHI CHÚ CHÂN BẢN VẼ ================= */}
        <text x="25" y="736" fill="#475569" fontSize="11.5">
          Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là{' '}
          <tspan fill="#DC2626" fontWeight="700">
            ví dụ
          </tspan>{' '}
          chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối.
        </text>

        {/* Đường kẻ chân */}
        <line x1="25" y1="755" x2="999" y2="755" stroke="#E2E8F0" strokeWidth="1" />

        {/* Legend / Chú thích */}
        <text x="25" y="780" fill="#004776" fontSize="11" fontWeight="800">
          CHÚ THÍCH
        </text>

        {/* Legend item: Nơi cần vào */}
        <rect x="100" y="770" width="18" height="12" rx="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="125" y="780" fill="#334155" fontSize="10.5">
          Nơi cần vào / thành phần
        </text>

        {/* Legend item: Thao tác */}
        <rect x="260" y="769" width="22" height="14" rx="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="288" y="780" fill="#334155" fontSize="10.5">
          Thao tác
        </text>

        {/* Legend item: Câu hỏi */}
        <polygon points="350,776 357,769 364,776 357,783" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        <text x="372" y="780" fill="#334155" fontSize="10.5">
          Câu hỏi
        </text>

        {/* Legend item: Bước tiếp */}
        <line x1="430" y1="776" x2="448" y2="776" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-02)" />
        <text x="456" y="780" fill="#334155" fontSize="10.5">
          Bước tiếp / dẫn đến
        </text>

        {/* Legend item: Lấy nội dung */}
        <line x1="570" y1="776" x2="588" y2="776" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3,3" />
        <text x="596" y="780" fill="#334155" fontSize="10.5">
          Lấy nội dung / cần giải thích
        </text>

        {/* Legend item: Ghi chú màu */}
        <text x="800" y="773" fill="#DC2626" fontSize="10" fontWeight="600">
          Đỏ: công bố / lưu ý
        </text>
        <text x="800" y="787" fill="#16A34A" fontSize="10" fontWeight="600">
          Xanh lá: kiểm tra / đúng
        </text>
      </svg>
    </div>
  );
}
