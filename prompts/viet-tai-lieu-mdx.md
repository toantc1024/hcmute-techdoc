# Prompt Chuẩn Hóa Viết Tài Liệu MDX Fumadocs

## Mục tiêu
Tạo bài viết tài liệu quản trị website định dạng .mdx với đầy đủ frontmatter và các component tương tác.

## Cấu trúc bài viết
1. **Frontmatter:** title, description, order, luong.
2. **Sơ đồ minh họa:** Sử dụng component `<Diagram src="/diagrams/..." caption="..." />`.
3. **Các bước thao tác:** Sử dụng component `<Steps>` và `<Step>`.
4. **Lưu ý nghiệp vụ:** Sử dụng component `<Callout type="warn">` hoặc `<Callout type="info">`.

## 5. Quy tắc viết hoa tiếng Việt (Sentence case)
- Bắt buộc tuân thủ quy tắc viết hoa thông thường (Sentence case): Chỉ viết hoa chữ cái đầu tiên của câu hoặc cụm từ.
- Tuyệt đối không viết hoa chữ cái đầu của tất cả các từ trong cụm (Title case) trừ khi là Tên riêng hoặc Danh từ riêng được định nghĩa cụ thể.
- Ví dụ sai: "Cấu Trúc Thư Mục", "Bộ Tài Liệu", "Quy Trình Làm Việc".
- Ví dụ đúng: "Cấu trúc thư mục", "Bộ tài liệu", "Quy trình làm việc".
