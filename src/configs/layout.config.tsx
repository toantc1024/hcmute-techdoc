import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { ShieldCheck } from 'lucide-react';
import { brandConfig } from './app.config';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-bold tracking-tight whitespace-nowrap shrink-0 select-none">
          <img
            src={brandConfig.logoUrl}
            alt="HCM-UTE Logo"
            className="size-7 object-contain shrink-0"
          />
          <span className="inline-flex items-center gap-1.5 text-sm sm:text-[15px] font-bold tracking-tight whitespace-nowrap shrink-0">
            <span className="text-[#0072BC] dark:text-sky-400 whitespace-nowrap">HCM-UTE</span>
            <span className="text-foreground font-extrabold whitespace-nowrap">TECH DOC</span>
          </span>
        </span>
      ),
    },
    links: [
      { text: "Cổng tài liệu", url: "/docs", active: "nested-url" },
      { text: "Sổ tay bỏ túi (PDF)", url: "/pocket-guide" },
      { text: "Theo vai trò", url: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro" },
      { text: "Xử lý sự cố", url: "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co" },
      { text: "Phím tắt", url: "/docs/06-kiem-tra-va-tro-ly/04-tra-cuu-thuat-ngu-va-phim-tat" },
      {
        type: 'icon',
        url: '/login',
        text: 'Quản trị hệ thống',
        label: 'Đăng nhập Quản trị',
        icon: (
          <span title="Đăng nhập Quản trị" className="inline-flex items-center justify-center">
            <ShieldCheck className="size-4.5" />
          </span>
        ),
        secondary: true,
      },
    ],
  };
}
