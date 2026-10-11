'use client';

import React, { useState, useMemo } from 'react';

export interface UnitItem {
  id: number;
  group: 'khoa-vien' | 'phong-ban' | 'trung-tam' | 'doan-the';
  groupName: string;
  name: string;
  domain: string;
  url: string;
}

export const OFFICIAL_UNITS: UnitItem[] = [
  // A. Khoa / Viện đào tạo
  { id: 1, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Viện Sư phạm Kỹ thuật', domain: 'ite.hcmute.edu.vn', url: 'https://ite.hcmute.edu.vn' },
  { id: 2, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Phân hiệu HCMUTE tại Bình Phước', domain: 'binhphuoc.hcmute.edu.vn', url: 'https://binhphuoc.hcmute.edu.vn' },
  { id: 3, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Điện - Điện tử', domain: 'feee.hcmute.edu.vn', url: 'https://feee.hcmute.edu.vn' },
  { id: 4, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Kinh tế', domain: 'fe.hcmute.edu.vn', url: 'https://fe.hcmute.edu.vn' },
  { id: 5, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Cơ khí', domain: 'fme.hcmute.edu.vn', url: 'https://fme.hcmute.edu.vn' },
  { id: 6, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Giao thông và Năng lượng', domain: 'feet.hcmute.edu.vn', url: 'https://feet.hcmute.edu.vn' },
  { id: 7, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Hóa học và Khoa học sự sống', domain: 'fcft.hcmute.edu.vn', url: 'https://fcft.hcmute.edu.vn' },
  { id: 8, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Công nghệ Thông tin', domain: 'fit.hcmute.edu.vn', url: 'https://fit.hcmute.edu.vn' },
  { id: 9, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Xây dựng', domain: 'fce.hcmute.edu.vn', url: 'https://fce.hcmute.edu.vn' },
  { id: 10, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Đào tạo Tiên tiến', domain: 'fae.hcmute.edu.vn', url: 'https://fae.hcmute.edu.vn' },
  { id: 11, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Chính trị và Luật', domain: 'fpi.hcmute.edu.vn', url: 'https://fpi.hcmute.edu.vn' },
  { id: 12, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Mỹ thuật và Truyền thông', domain: 'fam.hcmute.edu.vn', url: 'https://fam.hcmute.edu.vn' },
  { id: 13, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Khoa học Ứng dụng', domain: 'fas.hcmute.edu.vn', url: 'https://fas.hcmute.edu.vn' },
  { id: 14, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Khoa Ngoại ngữ', domain: 'ffl.hcmute.edu.vn', url: 'https://ffl.hcmute.edu.vn' },
  { id: 15, group: 'khoa-vien', groupName: 'Khoa & Viện đào tạo', name: 'Viện Đào tạo Quốc tế', domain: 'iie.hcmute.edu.vn', url: 'https://iie.hcmute.edu.vn' },

  // B. Phòng ban chức năng
  { id: 16, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Công tác sinh viên', domain: 'sao.hcmute.edu.vn', url: 'https://sao.hcmute.edu.vn' },
  { id: 17, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Đào tạo', domain: 'aao.hcmute.edu.vn', url: 'https://aao.hcmute.edu.vn' },
  { id: 18, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Đào tạo - Bộ phận Vừa làm Vừa học', domain: 'nmo.hcmute.edu.vn', url: 'https://nmo.hcmute.edu.vn' },
  { id: 19, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Khảo thí & Đảm bảo Chất lượng', domain: 'qao.hcmute.edu.vn', url: 'https://qao.hcmute.edu.vn' },
  { id: 20, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Quan hệ Doanh nghiệp', domain: 'pr.hcmute.edu.vn', url: 'https://pr.hcmute.edu.vn' },
  { id: 21, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Quan hệ Quốc tế', domain: 'oia.hcmute.edu.vn', url: 'https://oia.hcmute.edu.vn' },
  { id: 22, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Quản lý Đầu tư Xây dựng và Đấu thầu', domain: 'cpm.hcmute.edu.vn', url: 'https://cpm.hcmute.edu.vn' },
  { id: 23, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Quản trị Cơ sở Vật chất', domain: 'emo.hcmute.edu.vn', url: 'https://emo.hcmute.edu.vn' },
  { id: 24, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Quản trị thương hiệu và Truyền thông', domain: 'bmc.hcmute.edu.vn', url: 'https://bmc.hcmute.edu.vn' },
  { id: 25, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Tổ chức – Nhân sự', domain: 'opo.hcmute.edu.vn', url: 'https://opo.hcmute.edu.vn' },
  { id: 26, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Khoa học Công nghệ', domain: 'stiao.hcmute.edu.vn', url: 'https://stiao.hcmute.edu.vn' },
  { id: 27, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Phòng Kế hoạch tài chính', domain: 'fpo.hcmute.edu.vn', url: 'https://fpo.hcmute.edu.vn' },
  { id: 28, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Văn phòng Đảng uỷ', domain: 'vanphongdanguy.hcmute.edu.vn', url: 'https://vanphongdanguy.hcmute.edu.vn' },
  { id: 29, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Ban Quản lý Ký túc xá', domain: 'ktx.hcmute.edu.vn', url: 'https://ktx.hcmute.edu.vn' },
  { id: 30, group: 'phong-ban', groupName: 'Phòng & Ban chức năng', name: 'Trạm Y tế', domain: 'hd.hcmute.edu.vn', url: 'https://hd.hcmute.edu.vn' },

  // C. Viện & Trung tâm nghiên cứu / đào tạo
  { id: 31, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Viện Sau đại học', domain: 'sdh.hcmute.edu.vn', url: 'https://sdh.hcmute.edu.vn' },
  { id: 32, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Thư viện Trường', domain: 'lib.hcmute.edu.vn', url: 'https://lib.hcmute.edu.vn' },
  { id: 33, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Thông tin – Máy tính', domain: 'iic.hcmute.edu.vn', url: 'https://iic.hcmute.edu.vn' },
  { id: 34, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Tin học', domain: 'trungtamtinhoc.hcmute.edu.vn', url: 'https://trungtamtinhoc.hcmute.edu.vn' },
  { id: 35, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Ngoại ngữ', domain: 'ttnn.hcmute.edu.vn', url: 'https://ttnn.hcmute.edu.vn' },
  { id: 36, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Tạp chí Khoa học Giáo dục Kỹ thuật', domain: 'jte.edu.vn', url: 'https://jte.edu.vn' },
  { id: 37, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Học liệu và Dạy học số', domain: 'hldhs.hcmute.edu.vn', url: 'https://hldhs.hcmute.edu.vn' },
  { id: 38, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Sáng tạo Khởi nghiệp & Chuyển giao Công nghệ', domain: 'cisat.hcmute.edu.vn', url: 'https://cisat.hcmute.edu.vn' },
  { id: 39, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Robot Thông minh', domain: 'smroce.hcmute.edu.vn', url: 'https://smroce.hcmute.edu.vn' },
  { id: 40, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Nghiên cứu Năng lượng tái tạo', domain: 'rerc.hcmute.edu.vn', url: 'https://rerc.hcmute.edu.vn' },
  { id: 41, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Giáo dục Thể chất', domain: 'cped.hcmute.edu.vn', url: 'https://cped.hcmute.edu.vn' },
  { id: 42, group: 'trung-tam', groupName: 'Trung tâm & Viện nghiên cứu', name: 'Trung tâm Giáo dục Quốc phòng và An ninh', domain: 'ttgdqpan.hcmute.edu.vn', url: 'https://ttgdqpan.hcmute.edu.vn' },

  // D. Đoàn thể & Cổng đào tạo khác
  { id: 43, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Công đoàn Trường', domain: 'congdoan.hcmute.edu.vn', url: 'https://congdoan.hcmute.edu.vn' },
  { id: 44, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Đoàn Thanh niên - Hội Sinh viên', domain: 'tuoitre.hcmute.edu.vn', url: 'https://tuoitre.hcmute.edu.vn' },
  { id: 45, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Hội Cựu sinh viên', domain: 'alumni.hcmute.edu.vn', url: 'https://alumni.hcmute.edu.vn' },
  { id: 46, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Đào tạo ngắn hạn trực tuyến', domain: 'daotaonganhantructuyen.hcmute.edu.vn', url: 'https://daotaonganhantructuyen.hcmute.edu.vn' },
  { id: 47, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Đào tạo từ xa', domain: 'daotaotuxa.hcmute.edu.vn', url: 'https://daotaotuxa.hcmute.edu.vn' },
  { id: 48, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Rèn luyện và công tác xã hội', domain: 'drlctxh.hcmute.edu.vn', url: 'https://drlctxh.hcmute.edu.vn' },
  { id: 49, group: 'doan-the', groupName: 'Đoàn thể & Khác', name: 'Hội đồng giáo sư cơ sở ĐHCNKT', domain: 'hdgscs.hcmute.edu.vn', url: 'https://hdgscs.hcmute.edu.vn' },
];

function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function QuickAccessDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const groups = [
    { key: 'all', label: 'Tất cả', count: OFFICIAL_UNITS.length },
    { key: 'khoa-vien', label: 'Khoa & Viện đào tạo', count: OFFICIAL_UNITS.filter(u => u.group === 'khoa-vien').length },
    { key: 'phong-ban', label: 'Phòng ban chức năng', count: OFFICIAL_UNITS.filter(u => u.group === 'phong-ban').length },
    { key: 'trung-tam', label: 'Trung tâm & Viện NC', count: OFFICIAL_UNITS.filter(u => u.group === 'trung-tam').length },
    { key: 'doan-the', label: 'Đoàn thể & Khác', count: OFFICIAL_UNITS.filter(u => u.group === 'doan-the').length },
  ];

  const filteredUnits = useMemo(() => {
    return OFFICIAL_UNITS.filter((item) => {
      const matchGroup = activeGroup === 'all' || item.group === activeGroup;
      if (!matchGroup) return false;

      if (!searchTerm.trim()) return true;

      const normalizedSearch = removeVietnameseAccents(searchTerm.trim());
      const normalizedName = removeVietnameseAccents(item.name);
      const normalizedDomain = item.domain.toLowerCase();

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedDomain.includes(normalizedSearch) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    });
  }, [searchTerm, activeGroup]);

  const handleCopy = (item: UnitItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getGroupBadgeClass = (group: UnitItem['group']) => {
    switch (group) {
      case 'khoa-vien':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'phong-ban':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'trung-tam':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'doan-the':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="w-full my-6 rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Chính thức 2026
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Theo Đề xuất 09/ĐX-QTTHTT
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1 text-foreground">
            Danh bạ website chính thức hệ thống HCM-UTE
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng hợp 49 địa chỉ tên miền chính thức của các đơn vị trực thuộc trường
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted p-1 rounded-lg border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lưới thẻ
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bảng danh sách
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="mt-5 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên đơn vị hoặc tên miền (ví dụ: CNTT, Cơ khí, fit, aao, bmc...)"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Group tabs */}
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => {
            const isActive = activeGroup === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setActiveGroup(g.key)}
                className={`px-3 py-1.5 sm:py-1.5 min-h-[34px] sm:min-h-0 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {g.label} ({g.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Result stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Hiển thị <strong className="text-foreground">{filteredUnits.length}</strong> / 49 website đơn vị
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-primary hover:underline"
          >
            Xoá bộ lọc tìm kiếm
          </button>
        )}
      </div>

      {/* Content: Grid or Table */}
      {filteredUnits.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-base font-semibold">Không tìm thấy website phù hợp</p>
          <p className="text-sm mt-1">Thầy/Cô hãy thử tìm bằng từ khoá viết hoa hoặc tên viết tắt (vd: fit, bmc, aao)</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUnits.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 hover:border-primary/40 hover:shadow-sm transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getGroupBadgeClass(
                      item.group
                    )}`}
                  >
                    {item.groupName}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Chính thức
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
                  {item.name}
                </h4>
                <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/60 font-mono text-xs text-primary font-medium flex items-center justify-between">
                  <span className="truncate">{item.domain}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-1">https</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex min-h-[36px] items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                >
                  <span>Truy cập</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  title="Sao chép liên kết"
                  className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-medium border border-input bg-background hover:bg-muted text-foreground transition"
                >
                  {copiedId === item.id ? (
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Đã chép</span>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border [webkit-overflow-scrolling:touch]">
          <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="px-3 py-2.5 w-12 text-center">STT</th>
                <th className="px-4 py-2.5">Đơn vị</th>
                <th className="px-3 py-2.5">Phân nhóm</th>
                <th className="px-4 py-2.5 font-mono">Tên miền chính thức</th>
                <th className="px-3 py-2.5 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUnits.map((item, idx) => (
                <tr key={item.id} className="hover:bg-muted/40 transition">
                  <td className="px-3 py-2.5 text-center text-muted-foreground font-medium">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getGroupBadgeClass(item.group)}`}>
                      {item.groupName}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-primary">
                    {item.domain}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
                      >
                        Mở
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="p-1 rounded border border-input bg-background hover:bg-muted text-muted-foreground transition"
                        title="Sao chép URL"
                      >
                        {copiedId === item.id ? (
                          <span className="text-[10px] text-emerald-600 font-bold px-1">✓</span>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
