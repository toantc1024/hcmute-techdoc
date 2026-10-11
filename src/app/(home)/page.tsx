import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  FileText, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Newspaper, 
  FileUp, 
  LayoutTemplate, 
  SearchCheck, 
  RotateCcw 
} from 'lucide-react';

interface QuickAction {
  title: string;
  badge: string;
  badgeClass: string;
  icon: typeof Newspaper;
  iconBg: string;
  iconColor: string;
  steps: string[];
  href: string;
  actionLabel: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Đăng tin / thông báo",
    badge: "Luồng B • Tin tức",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    icon: Newspaper,
    iconBg: "bg-blue-500/10 border border-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    steps: ["Soạn bài", "Chọn chuyên mục", "Gửi duyệt"],
    href: "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban",
    actionLabel: "Xem hướng dẫn đăng tin",
  },
  {
    title: "Đăng văn bản / biểu mẫu PDF",
    badge: "Luồng B • Biểu mẫu",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    icon: FileUp,
    iconBg: "bg-emerald-500/10 border border-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    steps: ["Nhập thông tin", "Đính kèm PDF", "Kiểm tra quyền xem"],
    href: "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau",
    actionLabel: "Xem hướng dẫn biểu mẫu",
  },
  {
    title: "Tạo trang giới thiệu",
    badge: "Luồng A • Quản trị trang",
    badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    icon: LayoutTemplate,
    iconBg: "bg-indigo-500/10 border border-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    steps: ["Chọn mẫu", "Sửa nội dung", "Công bố", "Gắn menu"],
    href: "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang",
    actionLabel: "Xem quy trình tạo trang",
  },
  {
    title: "Sửa menu / thông tin chân trang",
    badge: "Luồng C • Điều hướng",
    badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
    icon: Compass,
    iconBg: "bg-violet-500/10 border border-violet-500/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    steps: ["Chọn khu vực", "Sửa liên kết", "Kiểm tra hiển thị"],
    href: "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong",
    actionLabel: "Xem cấu hình menu",
  },
  {
    title: "Bài đã đăng nhưng chưa thấy",
    badge: "Xử lý sự cố",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    icon: SearchCheck,
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    steps: ["Kiểm tra trạng thái", "Chuyên mục", "Khối hiển thị"],
    href: "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo#tình-huống-1-đã-xuất-bản-bài-viết-thành-công-nhưng-ra-trang-chủ-khoa-không-thấy-xuất-hiện",
    actionLabel: "Xem checklist xử lý sự cố",
  },
  {
    title: "Khôi phục nội dung sửa nhầm",
    badge: "Phục hồi phiên bản",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    icon: RotateCcw,
    iconBg: "bg-rose-500/10 border border-rose-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    steps: ["Mở lịch sử", "So sánh bản dựng", "Khôi phục"],
    href: "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban",
    actionLabel: "Xem các bước khôi phục",
  },
];

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

        {/* Khối nổi bật: Thầy/Cô muốn làm gì? */}
        <section className="w-full mb-20 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/70 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tác vụ thường dùng</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Thầy/Cô muốn làm gì?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Chọn nhanh tác vụ cần thực hiện để xem ngay quy trình hướng dẫn từng bước tương ứng.
              </p>
            </div>
            <Link 
              href="/docs/01-khoi-dong-va-tong-quan/04-luong-hanh-dong-co-ban"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0 group"
            >
              <span>Xem toàn bộ sơ đồ hành động</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {QUICK_ACTIONS.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${action.iconBg}`}>
                      <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${action.badgeClass}`}>
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                    {action.title}
                  </h3>

                  {/* Flow Steps Breadcrumb */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2.5 border border-border/50">
                    {action.steps.map((step, sIdx) => (
                      <span key={sIdx} className="inline-flex items-center gap-1.5">
                        <span className="font-medium text-foreground/80">{step}</span>
                        {sIdx < action.steps.length - 1 && (
                          <span className="text-primary/60 font-bold">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{action.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3 Core Flows Header */}
        <div className="w-full text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Khám phá theo 3 luồng kiến trúc chính
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hệ thống tài liệu được chuẩn hóa theo 3 trục nghiệp vụ vận hành: Quản trị trang con (Luồng A), Quản lý tin bài (Luồng B) và Cấu hình menu điều hướng (Luồng C).
          </p>
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
            <span>Tích hợp 8 sơ đồ khối thao tác chuẩn HCM-UTE</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Hỗ trợ Trợ lý UTE theo ngữ cảnh</span>
          </div>
          <Link 
            href="/docs/06-kiem-tra-va-tro-ly/04-tra-cuu-thuat-ngu-va-phim-tat"
            className="flex items-center justify-center gap-2 hover:text-primary transition-colors group cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
            <span>Phím tắt & Thuật ngữ tra cứu (<kbd className="font-mono bg-muted/80 px-1.5 py-0.5 rounded border border-border text-[11px] font-semibold">⌘K</kbd>)</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
