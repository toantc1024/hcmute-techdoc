import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
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
      { text: "Bảng tiến độ", url: "/tien-do" },
      { text: "Quản trị", url: "/admin" },
      { text: "Sổ tay bỏ túi (PDF)", url: "/pocket-guide" },
      { text: "Theo vai trò", url: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro" },
      { text: "Xử lý sự cố", url: "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co" },
      { text: "Phím tắt", url: "/docs/06-kiem-tra-va-tro-ly/04-tra-cuu-thuat-ngu-va-phim-tat" },
    ],
  };
}
