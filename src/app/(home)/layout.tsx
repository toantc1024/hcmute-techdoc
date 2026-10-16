import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { AdminHashContainer } from '@/components/admin/AdminHashContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: "HCM-UTE TECH DOC",
  },
  description: "Cổng tài liệu kỹ thuật & Hướng dẫn sử dụng hệ thống Website HCM-UTE",
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      <AdminHashContainer />
      {children}
    </HomeLayout>
  );
}
