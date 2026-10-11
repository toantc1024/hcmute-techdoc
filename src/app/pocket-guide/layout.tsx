import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sổ tay quản trị website bỏ túi (Pocket Guide PDF) | HCM-UTE TechDoc",
  description: "Cẩm nang tóm lược 2 trang A4 chuẩn hóa Nhà trường: sơ đồ 3 luồng tác vụ, bảng phím tắt, checklist 7 điểm kiểm soát xuất bản và danh bạ xử lý sự cố.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
