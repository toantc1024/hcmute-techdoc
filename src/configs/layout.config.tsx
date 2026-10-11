import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { brandConfig } from './app.config';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-bold text-base tracking-tight">
          <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="w-7 h-7 object-contain" />
          <span className="text-[#0072BC] dark:text-sky-400">HCM-UTE</span>
          <span className="text-foreground font-extrabold tracking-wide">TECH DOC</span>
        </span>
      ),
    },
    links: [
      { text: "Cổng tài liệu", url: "/docs", active: "nested-url" },
      { text: "Sổ tay bỏ túi (PDF)", url: "/pocket-guide" },
      { text: "Theo vai trò", url: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro" },
      { text: "Xử lý sự cố", url: "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co" },
      { text: "Phím tắt", url: "/docs/06-kiem-tra-va-tro-ly/04-tra-cuu-thuat-ngu-va-phim-tat" },
    ],
  };
}
