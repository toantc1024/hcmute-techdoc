# Danh mục ảnh chụp thực tế hệ thống HCM-UTE TechDoc

Thư mục này dùng để lưu trữ và quản lý các ảnh chụp giao diện thực tế cần bổ sung vào hệ thống tài liệu hướng dẫn (`techdoc.utehub.vn`).

Thầy Cô khi chụp xong có thể thả trực tiếp file ảnh vào thư mục tương ứng bên dưới (hoặc thả ngay vào thư mục gốc `Demo pics/`), hệ thống sẽ tự động tối ưu hóa kích thước và gắn vào đúng bài viết tài liệu.

> [!IMPORTANT]
> ### 🔒 QUY TẮC BẢO VỆ DỮ LIỆU CÁ NHÂN KHI CHỤP ẢNH MINH HỌA
> Căn cứ Nghị định 13/2023/NĐ-CP và quy chế an toàn thông tin của HCM-UTE, khi chụp ảnh giao diện thực tế để bổ sung vào tài liệu hướng dẫn, Thầy Cô vui lòng thực hiện:
> 1. **Che mờ (Blur / Redact / Phủ màu đặc):** Địa chỉ email (cá nhân và trường cấp), tên tài khoản đăng nhập, token xác thực hoặc mật khẩu trên màn hình.
> 2. **Che mờ mã hồ sơ & dữ liệu nhạy cảm:** Số Căn cước công dân (CCCD), mã số hồ sơ nội bộ, số điện thoại cá nhân.
> 3. **Bảo vệ tuyệt đối dữ liệu sinh viên:** Mã số sinh viên (MSSV), họ tên, bảng điểm, thông tin học phí hoặc kết quả rèn luyện.
> 4. **Khuyến nghị kỹ thuật:** Sử dụng công cụ che mờ hộp (Box Blur tối thiểu 25px) hoặc thanh hình chữ nhật màu đơn sắc che kín văn bản, không dùng cọ mờ bán trong suốt.

---

## Nhóm 1: Ưu tiên cao nhất (Thao tác cốt lõi thường ngày)

### 1. Cấu hình thanh điều hướng Menu (Luồng C - Header & Footer)
Thư mục: `01-menu-dieu-huong-header-footer/`
- [ ] **Ảnh 01 - Cây phân cấp Menu Header** (`menu-header-tree.png`):
  * Vị trí bài viết: `content/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong.mdx`
  * Nội dung: Màn hình hiển thị cây phân cấp các nút Menu đầu trang, các nút kéo thả sắp xếp cấp cha - con.
- [ ] **Ảnh 02 - Hộp thoại Thêm/Sửa mục Menu** (`modal-edit-menu-item.png`):
  * Vị trí bài viết: `content/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong.mdx`
  * Nội dung: Modal chọn kiểu liên kết (Mở Trang con, Mở Chuyên mục bài viết hoặc Liên kết URL ngoài).
- [ ] **Ảnh 03 - Cấu hình chân trang Footer** (`menu-footer-config.png`):
  * Vị trí bài viết: `content/docs/04-luong-c-menu-dieu-huong/02-cau-hinh-chan-trang-footer.mdx`
  * Nội dung: Màn hình phân chia các cột thông tin liên hệ đơn vị, mạng xã hội và liên kết chân trang.

---

### 2. Khởi động và Bàn làm việc tổng quan (Dashboard - Chương 1)
Thư mục: `02-dashboard-tong-quan-va-dang-nhap/`
- [ ] **Ảnh 04 - Màn hình đăng nhập SSO** (`login-sso-google.png`):
  * Vị trí bài viết: `content/docs/01-khoi-dong-va-tong-quan/01-dang-nhap-va-khu-vuc-chinh.mdx`
  * Nội dung: Màn hình đăng nhập với nút Google Workspace trường cấp (`@hcmute.edu.vn`).
- [ ] **Ảnh 05 - Dashboard tổng quan** (`dashboard-tong-quan.png`):
  * Vị trí bài viết: `content/docs/01-khoi-dong-va-tong-quan/02-tong-quan-va-thong-ke.mdx`
  * Nội dung: Giao diện bàn làm việc sau khi đăng nhập: Menu bên trái (Sidebar), thanh điều hướng trên cùng, các thẻ thống kê tổng quan (số bài viết, số trang, lượt truy cập...).

---

### 3. Quản lý danh sách Trang và Lịch sử phiên bản (Luồng A)
Thư mục: `03-quan-ly-trang-va-thu-vien-mau/`
- [x] **Ảnh Thông tin trang & Điểm số SEO** (`thong-tin-trang-va-seo-tong-quan.png`):
  * Vị trí bài viết: `content/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang.mdx`
  * Nội dung: Vòng tròn đo điểm SEO (80/100), Tiêu đề, Đường dẫn gốc /vi, chọn Trang cha và nút Chuyển trang chủ.
- [x] **Ảnh Cấu hình SEO Meta & Ảnh bìa** (`cau-hinh-seo-meta-va-anh-bia.png`):
  * Vị trí bài viết: `content/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang.mdx`
  * Nội dung: Khung chọn ảnh bìa 1200x630px, Tiêu đề SEO, Mô tả SEO (nhãn Đang trong khoảng khuyến nghị) và tab Xem trước.
- [ ] **Ảnh 06 - Danh sách toàn bộ các trang** (`danh-sach-trang.png`):
  * Vị trí bài viết: `content/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang.mdx`
  * Nội dung: Bảng danh sách trang (`/admin/pages`), cột Tiêu đề, Đường dẫn slug, Trạng thái (Đã xuất bản / Bản nháp).
- [ ] **Ảnh 07 - Thư viện mẫu trang** (`thu-vien-mau-trang.png`):
  * Vị trí bài viết: `content/docs/02-luong-a-quan-ly-trang/02-nhan-ban-tu-thu-vien-mau.mdx`
  * Nội dung: Giao diện chọn nhân bản trang từ Thư viện mẫu có sẵn (Templates).
- [ ] **Ảnh 08 - Lịch sử phiên bản trang** (`lich-su-phien-ban.png`):
  * Vị trí bài viết: `content/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban.mdx`
  * Nội dung: Ngăn kéo / danh sách các mốc thời gian lưu bản nháp/xuất bản và nút "Khôi phục phiên bản này".

---

## Nhóm 2: Nghiệp vụ chuyên sâu và Tiện ích hệ thống

### 4. Ban hành Văn bản & Biểu mẫu hành chính (Luồng B)
Thư mục: `04-van-ban-va-bieu-mau/`
- [ ] **Ảnh 09 - Form nhập văn bản & đính kèm** (`form-van-ban-bieu-mau.png`):
  * Vị trí bài viết: `content/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau.mdx`
  * Nội dung: Các ô Số hiệu, Ngày ban hành, Cơ quan ban hành, Trích yếu và khu vực tải tệp đính kèm.

---

### 5. Quản lý Người dùng & Phân quyền (Chương 5)
Thư mục: `05-nguoi-dung-va-phan-quyen/`
- [ ] **Ảnh 10 - Danh sách tài khoản Thầy Cô** (`danh-sach-nguoi-dung.png`):
  * Vị trí bài viết: `content/docs/05-quan-tri-he-thong-va-tien-ich/01-nguoi-dung-va-nhom-quyen.mdx`
  * Nội dung: Bảng danh sách tài khoản, đơn vị và vai trò (Quản trị viên, Biên tập viên...).
- [ ] **Ảnh 11 - Modal gán quyền vai trò** (`modal-phan-quyen.png`):
  * Vị trí bài viết: `content/docs/05-quan-tri-he-thong-va-tien-ich/01-nguoi-dung-va-nhom-quyen.mdx`
  * Nội dung: Hộp thoại gán vai trò hoặc phân quyền chuyên mục/trang cho Thầy Cô.

---

### 6. Tiện ích mở rộng & Chuông thông báo (Chương 5)
Thư mục: `06-tien-ich-va-chuong-thong-bao/`
- [ ] **Ảnh 12 - Quản lý tiện ích mở rộng** (`quan-ly-tien-ich.png`):
  * Vị trí bài viết: `content/docs/05-quan-tri-he-thong-va-tien-ich/02-tien-ich-mo-rong.mdx`
  * Nội dung: Màn hình quản lý nhóm tiện ích (Dịch vụ sinh viên, Cổng Thầy Cô...).
- [ ] **Ảnh 13 - Popup chuông thông báo** (`popup-chuong-thong-bao.png`):
  * Vị trí bài viết: `content/docs/05-quan-tri-he-thong-va-tien-ich/03-thong-bao-he-thong.mdx`
  * Nội dung: Cửa sổ thả xuống khi bấm vào biểu tượng Chuông thông báo ở góc trên bên phải.

---

### 7. Trợ lý UTE & Checklist nghiệm thu (Chương 6)
Thư mục: `07-tro-ly-ute-va-checklist/`
- [ ] **Ảnh 14 - Trợ lý UTE hướng dẫn trên màn hình** (`tro-ly-ute-huong-dan.png`):
  * Vị trí bài viết: `content/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu.mdx`
  * Nội dung: Giao diện khi Trợ lý UTE hiển thị bong bóng chỉ dẫn từng bước trên màn hình.
- [ ] **Ảnh 15 - Bảng Checklist kiểm tra nghiệm thu** (`checklist-nghiem-thu.png`):
  * Vị trí bài viết: `content/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo.mdx`
  * Nội dung: Bảng checklist các hạng mục cần đạt trước khi công bố website.

---

## Gợi ý kích thước & Định dạng ảnh
- **Định dạng khuyến nghị:** `.png` (khuyên dùng để ảnh chụp giao diện nét chữ sắc nét) hoặc `.jpg`.
- **Độ phân giải:** Chiều rộng từ `1200px` đến `1920px` (có thể chụp nguyên cửa sổ trình duyệt).
- **Lưu ý:** Thầy Cô có thể thả ảnh vào bất kỳ lúc nào, sau đó nhắn cho trợ lý để tự động xử lý và cập nhật vào tài liệu.
