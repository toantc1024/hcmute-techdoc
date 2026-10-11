---
name: responsive_mobile
description: Quy tắc tối ưu hóa thiết kế responsive trên di động theo tiêu chuẩn kiểm thử UI/UX của HCM-UTE.
---

# Quy tắc tối ưu giao diện di động (Mobile responsive guidelines)

## 1. Điểm bẻ và lưới bố cục (Breakpoints & grid layout)
- **Điểm bẻ chuẩn:** Ưu tiên thiết kế theo tư duy Mobile-First. Sử dụng `xs: 320px`, `sm: 480px`, `md: 768px` làm điểm mốc phân tách thiết bị di động.
- **Bố cục lưới:** Mọi danh sách, lưới sản phẩm hoặc thẻ thông tin hiển thị trên màn hình di động có chiều rộng dưới 768px bắt buộc phải chuyển sang dạng dọc 1 cột (`grid-cols-1`) hoặc tối đa là 2 cột (`grid-cols-2`). Tuyệt đối không để xảy ra lỗi tràn màn hình theo chiều ngang (Horizontal scrolling).

## 2. Kích thước phần tử và vùng tương tác (Touch targets & sizes)
- **Kích thước nút bấm:** Mọi nút (Button), liên kết (Link) hoặc phần tử có thể nhấn vào trên giao diện điện thoại phải có chiều cao tối thiểu là `44px` hoặc `48px` (Tương đương `h-11` hoặc `h-12` trong Tailwind CSS) để tránh việc người dùng bấm nhầm.
- **Khoảng cách an toàn:** Giữa các phần tử có thể tương tác phải cách nhau ít nhất `8px` (`space-x-2` hoặc `space-y-2`). Khoảng đệm biên (Padding) hai bên cạnh màn hình điện thoại luôn cố định từ `16px` đến `24px` (`px-4` đến `px-6`).

## 3. Kiểu chữ và khoảng cách văn bản (Typography & spacing)
- **Kích thước phông chữ:** Kích thước chữ nội dung (Body text) trên điện thoại không được nhỏ hơn `14px` (`text-sm`), khuyến khích dùng `16px` (`text-base`). Tiêu đề chính không vượt quá `24px` để tránh bị rớt dòng bừa bãi.
- **Khoảng cách dòng:** Luôn thiết lập `line-height` tối thiểu là `1.5` (`leading-relaxed`) cho các đoạn văn bản dài nhằm tăng trải nghiệm đọc trên màn hình nhỏ.

## 4. Kiểm thử giao diện và xử lý lỗi (UI/UX testing)
- **Xử lý bảng dữ liệu:** Đối với các bảng dữ liệu (Table) phức tạp không thể co giãn trên màn hình nhỏ, bắt buộc phải bọc trong một khối có thuộc tính `overflow-x-auto` để người dùng vuốt ngang riêng phần bảng, tuyệt đối không làm tràn toàn bộ bố cục trang web.
- **Trạng thái vuốt chạm:** Phải loại bỏ hoàn toàn các hiệu ứng hover không hoạt động trên điện thoại. Thay thế bằng hiệu ứng phản hồi khi chạm (Active/Focus state) với độ trễ thấp.
- **Tự động rà soát:** Sau khi tạo hoặc chỉnh sửa bất kỳ file giao diện nào, bạn phải tự động quét lại mã nguồn để đảm bảo không sử dụng các giá trị kích thước cố định lớn (Ví dụ: `w-[1200px]`, `w-[500px]`) mà không có tiền tố tương ứng với màn hình máy tính (`md:` hoặc `lg:`).

## 5. Nguyên tắc viết hoa hệ thống
- Tất cả các văn bản, thông báo lỗi, nhãn (Label) hiển thị trên giao diện người dùng sinh ra bởi AI phải tuân thủ nghiêm ngặt quy tắc viết hoa chữ cái đầu tiên (Sentence case). Không viết hoa bừa bãi chữ cái đầu của từng từ (Title case).
