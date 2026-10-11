import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import type { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
});

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
            },
          }}
          search={{
            links: [
              ["Đăng tin / thông báo (Luồng B)", "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban"],
              ["Đăng văn bản / biểu mẫu PDF (Luồng B)", "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau"],
              ["Tạo trang giới thiệu (Luồng A)", "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang"],
              ["Sửa menu / thông tin chân trang (Luồng C)", "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong"],
              ["Bài đã đăng nhưng chưa thấy (Xử lý sự cố)", "/docs/06-kiem-tra-va-tro-ly/05-trung-tam-xu-ly-su-co"],
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
