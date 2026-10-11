import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "HCM-UTE TECH DOC — Cổng tài liệu hướng dẫn quản trị Website HCM-UTE",
  description: "Cổng tài liệu kỹ thuật & Hướng dẫn sử dụng hệ thống Website HCM-UTE",
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
