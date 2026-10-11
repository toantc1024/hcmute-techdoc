import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { withBasePath } from "@/configs/app.config";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | HCM-UTE TECH DOC",
    default: "HCM-UTE TECH DOC",
  },
  description: "Cổng tài liệu kỹ thuật & Hướng dẫn sử dụng hệ thống Website HCM-UTE",
  applicationName: "HCM-UTE TECH DOC",
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico") },
      { url: withBasePath("/favicon.svg"), type: "image/svg+xml" },
    ],
    apple: withBasePath("/logo-hcm-ute.png"),
  },
  openGraph: {
    title: "HCM-UTE TECH DOC",
    description: "Cổng tài liệu kỹ thuật & Hướng dẫn sử dụng hệ thống Website HCM-UTE",
    siteName: "HCM-UTE TECH DOC",
    locale: "vi_VN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={{
            locale: "vi",
            translations: {
              "Search(search trigger)": "Tìm kiếm",
              "Search(search dialog)": "Tìm kiếm tài liệu, quy trình, tác vụ...",
              "No results found(search dialog)": "Không tìm thấy nội dung phù hợp",
              "Open Search(search trigger)(aria-label)": "Mở ô tìm kiếm",
              "Close Search(search dialog)(aria-label)": "Đóng tìm kiếm",
              "On this page(table of contents)": "Mục lục bài viết",
              "Table of Contents(inline table of contents)": "Mục lục bài viết",
              "Copy Markdown(page actions)": "Sao chép Markdown",
              "Copied Markdown(page actions)": "Đã sao chép Markdown",
              "Copy Text(code block)(aria-label)": "Sao chép mã",
              "Copied Text(code block)(aria-label)": "Đã sao chép",
              "Open(page actions)": "Xem chi tiết",
              "Open in GitHub(page actions)": "Xem trên GitHub",
              "Last updated on(page footer)": "Cập nhật ngày",
              "Next Page(pagination)": "Bài tiếp theo",
              "Previous Page(pagination)": "Bài trước đó",
              "Choose a language(language switcher)": "Chọn ngôn ngữ",
              "Collapse Sidebar(sidebar)(aria-label)": "Thu gọn thanh bên",
              "Open Sidebar(sidebar)(aria-label)": "Mở thanh bên",
              "Close Sidebar(sidebar)(aria-label)": "Đóng thanh bên",
              "Hide Sidebar(sidebar)": "Ẩn thanh bên",
              "Show Sidebar(sidebar)": "Hiện thanh bên",
              "Copied Link(accordion)(aria-label)": "Đã sao chép liên kết",
            },
          }}
          search={{
            links: [
              ["Đăng tin mới (Luồng B)", "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban"],
              ["Đăng văn bản / biểu mẫu PDF (Luồng B)", "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau"],
              ["Tạo trang giới thiệu (Luồng A)", "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang"],
              ["Sửa menu & chân trang (Luồng C)", "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong"],
              ["Bài đã đăng nhưng chưa thấy (Xử lý sự cố)", "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co#tình-huống-21-bài-viết-đã-xuất-bản-thành-công-nhưng-ra-trang-chủ-đơn-vị-không-thấy-hiển-thị"],
              ["Khôi phục nội dung sửa nhầm (Bản dựng)", "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban"],
              ["Bắt đầu lần đầu theo vai trò quản trị", "/docs/01-khoi-dong-va-tong-quan/06-huong-dan-theo-vai-tro"],
              ["Mẫu nội dung thông báo & tin tức sao chép", "/docs/03-luong-b-chuyen-muc-noi-dung/06-mau-noi-dung-chuan"],
              ["Bảng tra cứu phím tắt thao tác & thuật ngữ", "/docs/06-kiem-tra-va-tro-ly/04-tra-cuu-thuat-ngu-va-phim-tat"],
            ],
            options: {
              type: "static",
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
