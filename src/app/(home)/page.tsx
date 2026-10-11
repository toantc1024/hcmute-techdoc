import Link from 'next/link';
import { HomeSearchButton } from '@/components/HomeSearchButton';
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
  RotateCcw,
  ShieldCheck,
  LifeBuoy,
  Keyboard,
  ExternalLink,
  Users
} from 'lucide-react';

// 6 Thẻ tác vụ thường dùng với tên gần gũi thực tế
const QUICK_ACTIONS = [
  {
    title: "Đăng tin mới",
    desc: "Soạn thảo tin tức sự kiện, thông báo học vụ, đặt ảnh bìa 16:9 và gửi duyệt xuất bản.",
    icon: Newspaper,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    href: "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban",
    actionLabel: "Xem hướng dẫn",
  },
  {
    title: "Đăng văn bản / PDF",
    desc: "Nhập trích yếu, số hiệu, đính kèm tệp PDF toàn văn và công khai cho người học tải về.",
    icon: FileUp,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    href: "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau",
    actionLabel: "Xem hướng dẫn",
  },
  {
    title: "Tạo trang giới thiệu",
    desc: "Nhân bản từ mẫu trang con có sẵn, chỉnh sửa các khối nội dung và công bố lên cây website.",
    icon: LayoutTemplate,
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
    href: "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang",
    actionLabel: "Xem hướng dẫn",
  },
  {
    title: "Sửa menu",
    desc: "Cập nhật thanh Mega Menu đầu trang, phân chia cột nhóm và gắn liên kết mở trang đích.",
    icon: Compass,
    iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
    href: "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong",
    actionLabel: "Xem hướng dẫn",
  },
  {
    title: "Bài chưa hiển thị",
    desc: "Đối soát chuyên mục gán vào bài viết, kiểm tra ngày xuất bản và xóa bộ nhớ đệm trình duyệt.",
    icon: SearchCheck,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    href: "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co#tình-huống-21-bài-viết-đã-xuất-bản-thành-công-nhưng-ra-trang-chủ-đơn-vị-không-thấy-hiển-thị",
    actionLabel: "Khắc phục ngay",
  },
  {
    title: "Khôi phục sửa nhầm",
    desc: "Tra cứu lịch sử phiên bản của trang, xem trực quan bản dựng trước đó và khôi phục an toàn.",
    icon: RotateCcw,
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    href: "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban",
    actionLabel: "Xem khôi phục",
  },
];

// 3 Lộ trình theo vai trò
const ROLE_PATHS = [
  {
    role: "Biên tập viên (Unit Editor)",
    badge: "Viết bài & Đăng tin",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    desc: "Cán bộ phụ trách đưa tin hoạt động, thông báo học vụ, xử lý ảnh sự kiện và gửi duyệt bài viết.",
    count: "4 bài trọng tâm",
    steps: "Đăng nhập → Soạn bài → Chuẩn hóa ảnh 16:9 → Checklist",
    href: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro#1-lộ-trình-dành-cho-biên-tập-viên-unit-editor--collaborator",
    icon: FileText,
  },
  {
    role: "Người duyệt bài (Unit Leader)",
    badge: "Thẩm định & Công bố",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    desc: "Lãnh đạo đơn vị chịu trách nhiệm kiểm duyệt nội dung, quản lý phát ngôn và phê duyệt xuất bản.",
    count: "4 bài trọng tâm",
    steps: "Thống kê → Duyệt bài viết → Checklist an toàn → Bản dựng",
    href: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro#2-lộ-trình-dành-cho-người-duyệt-bài-unit-leader",
    icon: ShieldCheck,
  },
  {
    role: "Quản trị viên đơn vị (Unit Admin)",
    badge: "Cây trang & Phân quyền",
    badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    desc: "Quản trị viên kỹ thuật phụ trách sơ đồ trang, Mega Menu, tài khoản thành viên và cổng dịch vụ.",
    count: "5 bài trọng tâm",
    steps: "Cấu trúc cốt lõi → Dựng trang → Sửa Menu → Phân quyền → Xử lý lỗi",
    href: "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro#3-lộ-trình-dành-cho-quản-trị-viên-đơn-vị-unit-admin",
    icon: Layers,
  },
];

// 8 Nhóm tài liệu hệ thống
const DOC_GROUPS = [
  { num: "01", title: "Khởi động & Tổng quan", desc: "Đăng nhập email trường, phạm vi đơn vị và 3 cấu trúc cốt lõi.", href: "/docs/01-khoi-dong-va-tong-quan/01-dang-nhap-va-khu-vuc-chinh" },
  { num: "02", title: "Luồng A: Quản trị trang", desc: "Tạo cây trang con, thư viện mẫu và quản lý lịch sử bản dựng.", href: "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" },
  { num: "03", title: "Luồng B: Quản lý nội dung", desc: "Đăng tin tức, văn bản biểu mẫu PDF, mẫu nội dung chuẩn hóa.", href: "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" },
  { num: "04", title: "Luồng C: Menu & Điều hướng", desc: "Thiết kế Mega Menu Header đa tầng và chân trang Footer.", href: "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" },
  { num: "05", title: "Quản trị hệ thống & Tiện ích", desc: "Phân cấp 4 nhóm quyền tài khoản và cổng tiện ích mở rộng.", href: "/docs/05-quan-tri-he-thong-va-tien-ich/01-nguoi-dung-va-nhom-quyen" },
  { num: "06", title: "Trợ lý UTE & Hỗ trợ", desc: "Trợ lý ảo theo tác vụ, checklist công bố và xử lý sự cố.", href: "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" },
  { num: "07", title: "Sơ đồ khối Mermaid", desc: "Tổng hợp toàn bộ 8 sơ đồ khối thao tác có tương tác điều hướng.", href: "/docs/07-so-do-mermaid-he-thong/01-tong-hop-so-do-mermaid" },
  { num: "08", title: "Hệ thống website đơn vị", desc: "Danh bạ tra cứu và truy cập nhanh 49 website chính thức Nhà trường.", href: "/docs/08-truy-cap-nhanh-he-thong-website/01-danh-sach-website-chinh-thuc" },
];

export default function HomePage() {
  return (
    <main className="relative w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* 3. Hiệu ứng thị giác nhẹ nhàng: Orbital Rings & Subtle Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[520px] overflow-hidden opacity-35 dark:opacity-20 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] rounded-full bg-gradient-to-tr from-[#0072BC]/20 via-sky-400/10 to-transparent blur-3xl" />
        <svg className="absolute inset-0 w-full h-full stroke-[#0072BC]/20 dark:stroke-sky-400/15 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50%" cy="38%" rx="420" ry="170" fill="none" strokeWidth="1" strokeDasharray="5 7" />
          <ellipse cx="50%" cy="38%" rx="540" ry="220" fill="none" strokeWidth="1" />
          <ellipse cx="50%" cy="38%" rx="660" ry="280" fill="none" strokeWidth="0.75" strokeDasharray="4 6" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-5xl flex flex-col items-center text-center">
        
        {/* 1. Tên cổng tài liệu (nhỏ phía trên) */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 backdrop-blur-xs px-3.5 py-1 text-xs font-medium text-foreground/90 mb-5 shadow-2xs">
          <span className="size-2 rounded-full bg-[#0072BC] animate-pulse" />
          <span>Trường Đại học Công nghệ Kỹ thuật TP.HCM · Cổng hướng dẫn quản trị HCM-UTE</span>
        </div>

        {/* 1. Tiêu đề lớn ở giữa */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight max-w-3xl mb-4">
          Thầy/Cô cần hướng dẫn gì?
        </h1>

        {/* Mô tả ngắn gọn */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed font-normal">
          Tra cứu nhanh quy trình thao tác, cẩm nang quản trị website và xử lý sự cố chuẩn hóa Nhà trường.
        </p>

        {/* 1. Ô tìm kiếm lớn + Gợi ý tìm kiếm */}
        <div className="w-full flex justify-center mb-16">
          <HomeSearchButton />
        </div>

        {/* 2. Khối 6 thẻ: Tác vụ thường dùng */}
        <section className="w-full mb-20 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 pb-3.5 border-b border-border/60 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                <Sparkles className="size-3.5" />
                <span>Thao tác nhanh</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Tác vụ thường dùng
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn công việc Thầy/Cô cần thực hiện để xem ngay quy trình hướng dẫn từng bước.
              </p>
            </div>
            <Link 
              href="/docs/01-khoi-dong-va-tong-quan/04-luong-hanh-dong-co-ban"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0 group"
            >
              <span>Xem toàn bộ sơ đồ hành động</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {QUICK_ACTIONS.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 sm:p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${action.iconBg}`}>
                      <action.icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                    {action.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{action.actionLabel}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Khối: Bắt đầu theo vai trò */}
        <section className="w-full mb-20 text-left">
          <div className="mb-7 pb-3.5 border-b border-border/60">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
              <Users className="size-3.5" />
              <span>Phân luồng công việc</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Bắt đầu theo vai trò
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Định hướng 4–5 bài đọc trọng tâm theo đúng trách nhiệm và thẩm quyền quản trị của Thầy/Cô.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROLE_PATHS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <item.icon className="size-5" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-card-foreground group-hover:text-primary transition-colors mb-2">
                    {item.role}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="rounded-lg bg-muted/40 p-2.5 border border-border/50 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground/90 block mb-0.5">Lộ trình: {item.count}</span>
                    <span className="line-clamp-2">{item.steps}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Xem chi tiết lộ trình</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Khối: Các nhóm tài liệu */}
        <section className="w-full mb-20 text-left">
          <div className="mb-7 pb-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                <BookOpen className="size-3.5" />
                <span>Cẩm nang toàn diện</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Các nhóm tài liệu hướng dẫn
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Chuẩn hóa toàn bộ 8 nhóm nội dung từ kiến trúc cơ bản, quản trị trang đến sơ đồ điều hướng.
              </p>
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0 group"
            >
              <span>Xem toàn bộ mục lục</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOC_GROUPS.map((doc, idx) => (
              <Link
                key={idx}
                href={doc.href}
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-primary/70 mb-1 block">
                    Nhóm {doc.num}
                  </span>
                  <h4 className="font-semibold text-sm sm:text-base text-card-foreground group-hover:text-primary transition-colors mb-1.5">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {doc.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-primary gap-1">
                  <span>Mở tài liệu</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Khối: Nội dung mới cập nhật & Hỗ trợ */}
        <section className="w-full rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs text-left mb-10 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
            
            {/* Cột 1: Thông tin phiên bản */}
            <div className="pt-4 md:pt-0 md:pr-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-3">
                <CheckCircle2 className="size-3.5" />
                <span>Phiên bản v2.4 (Tháng 10/2026)</span>
              </div>
              <h4 className="font-bold text-base text-foreground mb-1.5">
                Vận hành thử nghiệm toàn Trường
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tài liệu chuẩn hóa bám sát quy chế truyền thông Nhà trường, tích hợp bộ chấm điểm SEO và bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.
              </p>
            </div>

            {/* Cột 2: Xử lý sự cố nhanh */}
            <div className="pt-6 md:pt-0 md:px-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-3">
                <SearchCheck className="size-3.5" />
                <span>Hỗ trợ sự cố</span>
              </div>
              <h4 className="font-bold text-base text-foreground mb-1.5">
                Trung tâm xử lý sự cố (Gặp lỗi gì?)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Tổng hợp 7 tình huống thường gặp: bài chưa hiển thị, sinh viên không tải được file PDF, menu dẫn sai liên kết.
              </p>
              <Link
                href="/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Mở trung tâm xử lý</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {/* Cột 3: Kênh hỗ trợ Tickets */}
            <div className="pt-6 md:pt-0 md:pl-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 mb-3">
                <LifeBuoy className="size-3.5" />
                <span>Kênh trực tuyến</span>
              </div>
              <h4 className="font-bold text-base text-foreground mb-1.5">
                Góp ý & Tiếp nhận hỗ trợ
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Gửi yêu cầu hỗ trợ (Tickets) trực tiếp đến Ban Quản trị Trường để được chuyên viên hỗ trợ giải đáp trực tuyến 100%.
              </p>
              <Link
                href="/docs/06-kiem-tra-va-tro-ly/03-kenh-gop-y-va-ho-tro-truc-tuyen"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Gửi phiếu hỗ trợ</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
