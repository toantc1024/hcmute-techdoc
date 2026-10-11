'use client';

import { Search, Sparkles } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Dialog } from '@base-ui/react/dialog';
import Link from 'next/link';

const SUGGESTIONS = [
  { label: "Đăng thông báo", href: "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" },
  { label: "Thêm menu", href: "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" },
  { label: "Bài chưa hiển thị", href: "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co#tình-huống-21-bài-viết-đã-xuất-bản-thành-công-nhưng-ra-trang-chủ-đơn-vị-không-thấy-hiển-thị" },
  { label: "Tải PDF", href: "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" },
];

export function HomeSearchButton() {
  const { enabled, dialogHandle, setOpenSearch } = useSearchContext();

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {/* Ô tìm kiếm lớn ở giữa */}
      <Dialog.Trigger
        handle={dialogHandle}
        type="button"
        onClick={() => setOpenSearch?.(true)}
        aria-label="Mở ô tìm kiếm tài liệu"
        className="group relative flex w-full min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 px-5 py-3.5 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
            <Search className="size-4.5" />
          </div>
          <span className="text-sm sm:text-base text-muted-foreground font-normal truncate text-left">
            Tìm kiếm bài viết, quy trình, tác vụ quản trị...
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="hidden sm:inline-flex text-xs text-muted-foreground/80 font-medium mr-1">Phím tắt</span>
          <div className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-muted-foreground bg-muted/80 px-2 py-1 rounded-md border border-border/70 shadow-2xs">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        </div>
      </Dialog.Trigger>

      {/* Dòng gợi ý tìm kiếm ngay dưới */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-muted-foreground/90 font-medium inline-flex items-center gap-1">
          <Sparkles className="size-3 text-primary shrink-0" />
          <span>Gợi ý:</span>
        </span>
        {SUGGESTIONS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-muted-foreground transition-all duration-150 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
