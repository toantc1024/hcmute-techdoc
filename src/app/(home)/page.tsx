import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, FileText, Compass, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-5xl flex flex-col items-center text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-6 transition hover:bg-primary/15">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Trường Đại học Công nghệ Kỹ thuật TP.HCM</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight max-w-4xl mb-6">
          Cổng hướng dẫn quản trị website <span className="text-primary">HCM-UTE</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal">
          Chuẩn hóa quy trình vận hành website các đơn vị: Xây dựng sơ đồ cây trang, quản lý chuyên mục tin tức, phân phối bài viết đa luồng và cấu hình thanh điều hướng.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/docs"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Khám phá tài liệu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs/01-khoi-dong-va-tong-quan/04-luong-hanh-dong-co-ban"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm sm:text-base font-medium text-foreground shadow-sm transition hover:bg-muted/40 hover:shadow active:scale-95"
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>Xem luồng hành động</span>
          </Link>
        </div>

        {/* 3 Core Flows - Styled as V2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          {/* Card A */}
          <Link
            href="/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg mb-4 group-hover:scale-105 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition">
                Luồng A: Quản trị trang (Sitemap)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tạo cây trang con, nhân bản từ mẫu có sẵn và kéo thả bố trí các khối hiển thị Tin tức / Văn bản.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition">
              <span>Xem quy trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card B */}
          <Link
            href="/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent-foreground font-bold text-lg mb-4 group-hover:scale-105 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition">
                Luồng B: Tin tức và văn bản
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Soạn thảo nội dung và gán hiển thị đồng thời lên nhiều chuyên mục song song mà không cần làm lại trang.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition">
              <span>Xem quy trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card C */}
          <Link
            href="/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong"
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center text-secondary-foreground font-bold text-lg mb-4 group-hover:scale-105 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-card-foreground mb-2 group-hover:text-primary transition">
                Luồng C: Menu header và footer
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cấu hình menu đầu trang và chân trang, phân chia cột nhóm và gán liên kết mở trang hoặc chuyên mục.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition">
              <span>Xem quy trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>

        {/* Feature Checkpoints */}
        <div className="mt-16 w-full border-t border-border pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Tích hợp 7 sơ đồ thao tác chuẩn HCM-UTE</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Hỗ trợ Trợ lý UTE theo ngữ cảnh</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Tìm kiếm tức thì với phím tắt ⌘K</span>
          </div>
        </div>

      </div>
    </main>
  );
}
