'use client';

import React, { useState } from 'react';

export const diagram07Content = {
  school: 'HCM-UTE · TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH',
  title: 'TRỢ LÝ UTE – XEM HƯỚNG DẪN THEO TÁC VỤ',
  diagramNumber: 'SƠ ĐỒ 07',
  subtitle: 'Mở bảng hỗ trợ → chọn mục cần xem → đọc hướng dẫn hoặc xem từng bước ngay trên màn hình.',
  topBar: {
    btn: 'Bấm Trợ lý UTE',
    btnSub: 'Góc trên bên phải',
    center: 'Trung tâm Hỗ trợ & Thiết lập Website HCM-UTE',
    centerSub: 'Bảng điều khiển thông minh',
    target: 'Chọn mục cần hướng dẫn',
  },
  panel1: {
    title: '1. CHỌN MỤC TRONG BẢNG HỖ TRỢ',
    activeTopic: 'Cách sử dụng trang này',
    activeTopicSub: 'Hướng dẫn phù hợp với trang đang mở.',
    topics: [
      'Checklist thiết lập',
      'Cách tạo bài viết',
      'Cách tạo trang web',
      'Chụp ảnh & Chuẩn hình',
    ],
    note: 'Bấm một mục để xem bảng hướng dẫn tương ứng ở bên phải.',
  },
  panel2: {
    title: '2. ĐỌC HƯỚNG DẪN',
    contextTitle: 'Ví dụ: trang Chuyên mục',
    contextDesc: 'Cách sử dụng: Cây Chuyên mục Tin bài',
    actionTitle: 'Đọc Quy trình thao tác chi tiết',
    actionDesc: 'Xem từng bước và mẹo thao tác',
    tourLabel: 'Muốn xem ngay trên giao diện',
    tourBtn: 'Bắt đầu hướng dẫn trên màn hình',
    note: [
      'Nút ở đầu phần Cách sử dụng trang này.',
      'Ảnh minh họa: hướng dẫn cây chuyên mục.',
    ],
  },
  panel3: {
    title: '3. HƯỚNG DẪN TRÊN MÀN HÌNH',
    step1: 'Vùng đang được hướng dẫn',
    step1Sub: 'được làm nổi bật',
    step2: 'Đọc hộp hướng dẫn',
    step2Sub: 'Tên bước · Giải thích · Mẹo',
    step2Count: 'Số bước, ví dụ: 1 / 6',
    step3Next: 'Tiếp tục → xem bước sau',
    step3Prev: 'Quay lại → xem bước trước',
    step3Close: 'Dấu × → đóng hướng dẫn',
    note: [
      'Đi theo từng bước để biết vị trí cần dùng.',
      'Đóng hướng dẫn để trở lại thao tác.',
    ],
  },
  aiNotice: '🤖 Trợ lý AI (Chatbot): Sắp ra mắt. Hiện tại Thầy/Cô sử dụng Bảng hướng dẫn ngữ cảnh và Hướng dẫn tương tác từng bước trên màn hình.',
  summary: [
    '01 Mở đúng trang cần hỗ trợ.',
    '02 Chọn mục để đọc hướng dẫn.',
    '03 Xem từng bước trên màn hình.',
  ],
  footerNote: 'Các nút hướng dẫn giúp xem cách làm, không thay thao tác lưu hoặc công bố.',
};

export function Diagram07UteAssistant() {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [activeTopic, setActiveTopic] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto select-none font-sans">
      <svg
        viewBox="0 0 1024 820"
        className="w-full min-w-[760px] h-auto drop-shadow-sm transition-all"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <marker
            id="arr-blue-07"
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
            id="arr-green-07"
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
        <image href="/logo-hcm-ute.png" x="25" y="22" width="48" height="48" />

        <text x="85" y="44" fill="#004776" fontSize="21" fontWeight="700" letterSpacing="-0.3">
          {diagram07Content.title}
        </text>
        <text x="85" y="62" fill="#DC2626" fontSize="10.5" fontWeight="600" letterSpacing="0.4">
          HCM-UTE · <tspan fill="#004776">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT TP. HỒ CHÍ MINH</tspan>
        </text>

        <rect x="900" y="32" width="99" height="28" rx="6" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1" />
        <text x="949" y="50" textAnchor="middle" fill="#0072BC" fontSize="12" fontWeight="700">
          {diagram07Content.diagramNumber}
        </text>

        <text x="25" y="94" fill="#475569" fontSize="12" fontWeight="400">
          {diagram07Content.subtitle}
        </text>

        {/* Đường kẻ ngang ngăn cách header */}
        <line x1="25" y1="108" x2="999" y2="108" stroke="#E2E8F0" strokeWidth="1" />

        {/* ================= THANH ĐIỀU HƯỚNG ĐẦU (TOP BAR) ================= */}
        {/* Nút 1: Bấm Trợ lý UTE */}
        <g className="cursor-pointer transition-all">
          <rect
            x="25"
            y="120"
            width="200"
            height="52"
            rx="8"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="125" y="143" textAnchor="middle" fill="#0072BC" fontSize="13" fontWeight="700">
            {diagram07Content.topBar.btn}
          </text>
          <text x="125" y="160" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.topBar.btnSub}
          </text>
        </g>

        {/* Mũi tên: Mở */}
        <line x1="225" y1="146" x2="320" y2="146" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />
        <rect x="254" y="133" width="36" height="20" rx="3" fill="#F8FAFC" />
        <text x="272" y="147" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="700">
          Mở
        </text>

        {/* Khối 2: Trung tâm Hỗ trợ & Thiết lập */}
        <rect
          x="320"
          y="120"
          width="420"
          height="52"
          rx="8"
          fill="#F0F9FF"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        <text x="530" y="143" textAnchor="middle" fill="#004776" fontSize="13" fontWeight="700">
          {diagram07Content.topBar.center}
        </text>
        <text x="530" y="160" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="400">
          {diagram07Content.topBar.centerSub}
        </text>

        {/* Mũi tên: Chọn */}
        <line x1="740" y1="146" x2="810" y2="146" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />
        <rect x="759" y="133" width="40" height="20" rx="3" fill="#F8FAFC" />
        <text x="779" y="147" textAnchor="middle" fill="#0284C7" fontSize="10.5" fontWeight="700">
          Chọn
        </text>

        {/* Khối 3: Chọn mục cần hướng dẫn */}
        <rect
          x="810"
          y="120"
          width="189"
          height="52"
          rx="26"
          fill="#FFFFFF"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        <text x="904" y="151" textAnchor="middle" fill="#0072BC" fontSize="12.5" fontWeight="700">
          {diagram07Content.topBar.target}
        </text>

        {/* Tuyến kết nối từ Khối 3 vòng xuống Panel 1 */}
        <path
          d="M 904 172 L 904 186 L 14 186 L 14 285 L 38 285"
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.5"
          markerEnd="url(#arr-blue-07)"
        />

        {/* ================= 3 CỘT NỘI DUNG CHÍNH ================= */}

        {/* ========== CỘT 1: CHỌN MỤC TRONG BẢNG HỖ TRỢ ========== */}
        <g
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setActivePanel(1)}
          onMouseLeave={() => setActivePanel(null)}
        >
          {/* Hộp bao ngoài cột 1 */}
          <rect
            x="25"
            y="205"
            width="308"
            height="450"
            rx="8"
            fill="#FFFFFF"
            stroke={activePanel === 1 ? '#0284C7' : '#CBD5E1'}
            strokeWidth={activePanel === 1 ? '2' : '1'}
          />
          {/* Header Cột 1 */}
          <rect x="25" y="205" width="308" height="40" rx="8" fill="#0072BC" />
          <rect x="25" y="235" width="308" height="10" fill="#0072BC" />
          <text x="179" y="230" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel1.title}
          </text>

          {/* Mục chủ đạo: Cách sử dụng trang này */}
          <rect
            x="40"
            y="258"
            width="278"
            height="52"
            rx="6"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="179" y="282" textAnchor="middle" fill="#0072BC" fontSize="13" fontWeight="700">
            {diagram07Content.panel1.activeTopic}
          </text>
          <text x="179" y="299" textAnchor="middle" fill="#64748B" fontSize="10.5">
            {diagram07Content.panel1.activeTopicSub}
          </text>

          {/* 4 Nút chủ đề bên dưới */}
          {diagram07Content.panel1.topics.map((topic, idx) => {
            const btnY = 322 + idx * 48;
            const isHoveredTopic = activeTopic === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActiveTopic(idx)}
                onMouseLeave={() => setActiveTopic(null)}
              >
                <rect
                  x="40"
                  y={btnY}
                  width="278"
                  height="40"
                  rx="6"
                  fill={isHoveredTopic ? '#F0F9FF' : '#FFFFFF'}
                  stroke="#0284C7"
                  strokeWidth={isHoveredTopic ? '2' : '1.2'}
                />
                <text
                  x="179"
                  y={btnY + 25}
                  textAnchor="middle"
                  fill="#004776"
                  fontSize="12"
                  fontWeight="600"
                >
                  {topic}
                </text>
              </g>
            );
          })}

          {/* Ghi chú chân cột 1 */}
          <text x="42" y="536" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.panel1.note}
          </text>
        </g>

        {/* Mũi tên từ Cột 1 sang Cột 2 (Hiển thị) */}
        <line x1="318" y1="284" x2="370" y2="284" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />
        <rect x="326" y="271" width="46" height="20" rx="3" fill="#F8FAFC" />
        <text x="349" y="285" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="700">
          Hiển thị
        </text>

        {/* ========== CỘT 2: ĐỌC HƯỚNG DẪN ========== */}
        <g
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setActivePanel(2)}
          onMouseLeave={() => setActivePanel(null)}
        >
          {/* Hộp bao ngoài cột 2 */}
          <rect
            x="357"
            y="205"
            width="308"
            height="450"
            rx="8"
            fill="#FFFFFF"
            stroke={activePanel === 2 ? '#0284C7' : '#CBD5E1'}
            strokeWidth={activePanel === 2 ? '2' : '1'}
          />
          {/* Header Cột 2 */}
          <rect x="357" y="205" width="308" height="40" rx="8" fill="#0072BC" />
          <rect x="357" y="235" width="308" height="10" fill="#0072BC" />
          <text x="511" y="230" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel2.title}
          </text>

          {/* Hộp 1: Ví dụ ngữ cảnh trang */}
          <rect
            x="372"
            y="258"
            width="278"
            height="60"
            rx="6"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="511" y="281" textAnchor="middle" fill="#0072BC" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel2.contextTitle}
          </text>
          <text x="511" y="301" textAnchor="middle" fill="#475569" fontSize="11.5">
            {diagram07Content.panel2.contextDesc}
          </text>

          {/* Mũi tên từ Hộp 1 xuống Hộp 2 */}
          <line x1="511" y1="318" x2="511" y2="346" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />

          {/* Hộp 2: Đọc quy trình chi tiết */}
          <rect
            x="372"
            y="346"
            width="278"
            height="62"
            rx="8"
            fill="#FFFFFF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="511" y="371" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel2.actionTitle}
          </text>
          <text x="511" y="391" textAnchor="middle" fill="#64748B" fontSize="11.5">
            {diagram07Content.panel2.actionDesc}
          </text>

          {/* Mũi tên từ Hộp 2 xuống Hộp 3 kèm nhãn */}
          <line x1="511" y1="408" x2="511" y2="455" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />
          <rect x="433" y="422" width="156" height="20" rx="3" fill="#F8FAFC" />
          <text x="511" y="436" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="700">
            {diagram07Content.panel2.tourLabel}
          </text>

          {/* Hộp 3: Bắt đầu hướng dẫn trên màn hình (CTA nổi bật) */}
          <rect
            x="372"
            y="457"
            width="278"
            height="52"
            rx="10"
            fill="#F0FDF4"
            stroke="#16A34A"
            strokeWidth="2"
          />
          <text x="511" y="488" textAnchor="middle" fill="#15803D" fontSize="13" fontWeight="800">
            {diagram07Content.panel2.tourBtn}
          </text>

          {/* Ghi chú chân cột 2 */}
          <text x="376" y="536" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.panel2.note[0]}
          </text>
          <text x="376" y="554" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.panel2.note[1]}
          </text>
        </g>

        {/* Tuyến nối từ Cột 2 (Nút Bắt đầu) sang Cột 3 (Vùng hướng dẫn) */}
        <path
          d="M 650 483 L 674 483 L 674 285 L 702 285"
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.5"
          markerEnd="url(#arr-blue-07)"
        />
        <rect x="652" y="374" width="46" height="20" rx="3" fill="#F8FAFC" />
        <text x="675" y="388" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="700">
          Bắt đầu
        </text>

        {/* ========== CỘT 3: HƯỚNG DẪN TRÊN MÀN HÌNH ========== */}
        <g
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setActivePanel(3)}
          onMouseLeave={() => setActivePanel(null)}
        >
          {/* Hộp bao ngoài cột 3 */}
          <rect
            x="689"
            y="205"
            width="310"
            height="450"
            rx="8"
            fill="#FFFFFF"
            stroke={activePanel === 3 ? '#0284C7' : '#CBD5E1'}
            strokeWidth={activePanel === 3 ? '2' : '1'}
          />
          {/* Header Cột 3 */}
          <rect x="689" y="205" width="310" height="40" rx="8" fill="#0072BC" />
          <rect x="689" y="235" width="310" height="10" fill="#0072BC" />
          <text x="844" y="230" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel3.title}
          </text>

          {/* Hộp 1: Vùng đang được hướng dẫn */}
          <rect
            x="704"
            y="258"
            width="280"
            height="56"
            rx="6"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="844" y="281" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel3.step1}
          </text>
          <text x="844" y="300" textAnchor="middle" fill="#0284C7" fontSize="11.5" fontWeight="600">
            {diagram07Content.panel3.step1Sub}
          </text>

          {/* Mũi tên từ Hộp 1 xuống Hộp 2 */}
          <line x1="844" y1="314" x2="844" y2="340" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />

          {/* Hộp 2: Đọc hộp hướng dẫn */}
          <rect
            x="704"
            y="340"
            width="280"
            height="70"
            rx="6"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="844" y="362" textAnchor="middle" fill="#004776" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel3.step2}
          </text>
          <text x="844" y="381" textAnchor="middle" fill="#475569" fontSize="11">
            {diagram07Content.panel3.step2Sub}
          </text>
          <text x="844" y="398" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="600">
            {diagram07Content.panel3.step2Count}
          </text>

          {/* Mũi tên từ Hộp 2 xuống Hộp 3 */}
          <line x1="844" y1="410" x2="844" y2="436" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />

          {/* Hộp 3: Điều hướng bước hướng dẫn */}
          <rect
            x="704"
            y="436"
            width="280"
            height="78"
            rx="10"
            fill="#FFFFFF"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <text x="844" y="458" textAnchor="middle" fill="#0072BC" fontSize="12.5" fontWeight="700">
            {diagram07Content.panel3.step3Next}
          </text>
          <text x="844" y="478" textAnchor="middle" fill="#475569" fontSize="11">
            {diagram07Content.panel3.step3Prev}
          </text>
          <text x="844" y="498" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="600">
            {diagram07Content.panel3.step3Close}
          </text>

          {/* Ghi chú chân cột 3 */}
          <text x="708" y="536" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.panel3.note[0]}
          </text>
          <text x="708" y="554" fill="#64748B" fontSize="11" fontWeight="400">
            {diagram07Content.panel3.note[1]}
          </text>
        </g>

        {/* ================= THÔNG BÁO TRỢ LÝ AI (CHATBOT) ================= */}
        <rect
          x="25"
          y="670"
          width="974"
          height="38"
          rx="6"
          fill="#F0F9FF"
          stroke="#BAE6FD"
          strokeWidth="1"
        />
        <text x="40" y="694" fill="#0284C7" fontSize="11.5" fontWeight="600">
          {diagram07Content.aiNotice}
        </text>

        {/* ================= THANH TỔNG KẾT 3 BƯỚC ================= */}
        <rect
          x="25"
          y="720"
          width="974"
          height="46"
          rx="8"
          fill="#FFFFFF"
          stroke="#0284C7"
          strokeWidth="1.2"
        />
        <text x="165" y="748" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          {diagram07Content.summary[0]}
        </text>
        <line x1="300" y1="743" x2="340" y2="743" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />

        <text x="512" y="748" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          {diagram07Content.summary[1]}
        </text>
        <line x1="670" y1="743" x2="710" y2="743" stroke="#0284C7" strokeWidth="1.5" markerEnd="url(#arr-blue-07)" />

        <text x="845" y="748" textAnchor="middle" fill="#004776" fontSize="12" fontWeight="700">
          {diagram07Content.summary[2]}
        </text>

        {/* ================= GHI CHÚ CHÂN BẢN VẼ ================= */}
        <line x1="25" y1="778" x2="999" y2="778" stroke="#E2E8F0" strokeWidth="1" />
        <text x="25" y="798" fill="#64748B" fontSize="11" fontWeight="400">
          {diagram07Content.footerNote}
        </text>

        <text x="999" y="798" textAnchor="end" fill="#0284C7" fontSize="10.5" fontWeight="600">
          Xanh lá: Bắt đầu trải nghiệm · Xanh dương: Khối thao tác và chỉ dẫn
        </text>
      </svg>
    </div>
  );
}
