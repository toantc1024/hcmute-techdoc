export const mermaidDiagrams: Record<string, string> = {
  '01': `flowchart TD
    subgraph S1["1. SƠ ĐỒ TRANG (Cấu trúc website)"]
        Home["Trang chủ (/)"]
        Intro["Giới thiệu (/gioi-thieu)"]
        DocPage["Văn bản - Biểu mẫu (/van-ban-bieu-mau)"]
        Home --> Intro --> DocPage
    end

    subgraph S2["2. CÂY CHUYÊN MỤC (Phân loại tin bài)"]
        CatPost["Chuyên mục: BÀI VIẾT"]
        CatDoc["Chuyên mục: VĂN BẢN"]
        CatForm["Biểu mẫu"]
        CatDoc --> CatForm
    end

    subgraph S3["3. MENU ĐẦU TRANG (Mega Menu)"]
        MenuMain["Mục menu: GIỚI THIỆU"]
        ColOverview["Cột TỔNG QUAN"]
        ColAdmin["Cột QUẢN TRỊ"]
        ColPublic["Cột CÔNG KHAI"]
        MenuMain --> ColOverview
        MenuMain --> ColAdmin
        MenuMain --> ColPublic
    end

    ColPublic -->|"Gắn liên kết"| DocPage
    DocPage -->|"Nhúng khối nội dung"| BlockView["Khối Tin tức / Văn bản"]
    BlockView -.->|"Lấy nguồn dữ liệu"| CatForm

    click Home href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Quản lý trang"
    click Intro href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Quản lý trang"
    click DocPage href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem hướng dẫn Page Builder"
    click CatPost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem hướng dẫn Đăng tin bài"
    click CatDoc href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem hướng dẫn Ban hành văn bản"
    click CatForm href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem hướng dẫn Biểu mẫu"
    click MenuMain href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem hướng dẫn Sửa menu"
    click ColPublic href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem hướng dẫn Cột liên kết"`,

  '02': `flowchart TD
    Question{"Thầy/Cô muốn làm việc gì?"}

    Question -->|"Tạo / sửa trang web"| BranchA["Trang mới, trang giới thiệu, bố cục"]
    Question -->|"Đăng bài / ban hành văn bản"| BranchB["Tin tức, sự kiện, thông báo, quyết định"]
    Question -->|"Sửa menu / đổi liên kết"| BranchC["Menu đầu trang, chân trang, danh sách link"]

    BranchA --> OpenA["Vào: Website → Trang"]
    BranchB --> OpenB["Vào: Quản lý nội dung → Văn bản & Bài viết"]
    BranchC --> OpenC["Vào: Website → Header & Footer"]

    OpenA --> TargetA["LUỒNG A: QUẢN LÝ TRANG"]
    OpenB --> TargetB["LUỒNG B: SOẠN & DUYỆT NỘI DUNG"]
    OpenC --> TargetC["LUỒNG C: SỬA MENU & LIÊN KẾT"]

    click BranchA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở bài hướng dẫn Luồng A"
    click OpenA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở bài hướng dẫn Luồng A"
    click TargetA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở bài hướng dẫn Luồng A"

    click BranchB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở bài hướng dẫn Luồng B"
    click OpenB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở bài hướng dẫn Luồng B"
    click TargetB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở bài hướng dẫn Luồng B"

    click BranchC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở bài hướng dẫn Luồng C"
    click OpenC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở bài hướng dẫn Luồng C"
    click TargetC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở bài hướng dẫn Luồng C"`,

  '03': `flowchart LR
    Step1["1. Tạo cây trang\n(Khung chứa)"] --> Step2["2. Tạo chuyên mục\n(Nhóm nội dung)"]
    Step2 --> Step3["3. Bố trí khối trang\n(Gắn chuyên mục)"]
    Step3 --> Step4["4. Gắn vào menu\n(Dẫn đường link)"]
    Step4 --> Step5["5. Kiểm tra & Xuất bản\n(Công bố website)"]

    click Step1 href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Tạo cây trang"
    click Step2 href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem hướng dẫn Tạo chuyên mục"
    click Step3 href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem hướng dẫn Bố trí khối"
    click Step4 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem hướng dẫn Gắn menu"
    click Step5 href "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo" "Xem Checklist kiểm tra"`,

  '04': `flowchart TD
    Start["Website → Trang → Sơ đồ trang"] --> Opt{"Thao tác"}

    Opt -->|"Tạo trang mới"| ActionNew["Tạo trang mới"]
    Opt -->|"Thêm trang con"| ActionSub["Thêm trang con"]
    Opt -->|"Nhân bản mẫu"| ActionClone["Nhân bản từ thư viện mẫu"]

    ActionNew --> PageInfo["Nhập thông tin trang: Tên, Trang cha, Mô tả"]
    ActionSub --> PageInfo
    ActionClone --> PageInfo

    PageInfo --> Builder["Mở trình thiết kế Page Builder"]
    Builder --> Blocks["Thêm khối · Bố cục · Chọn chuyên mục nguồn"]
    Blocks --> Preview["Xem trước trang & Kiểm tra Responsive"]

    Preview --> Approved{"Đạt yêu cầu?"}
    Approved -->|"Chưa"| Builder
    Approved -->|"Lưu nháp"| Draft["Lưu nháp (Nội bộ)"]
    Approved -->|"Công bố"| Published["Xuất bản công bố"]

    Published --> MegaMenu["Gắn liên kết vào Menu đầu trang"]

    click ActionNew href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Tạo trang"
    click ActionSub href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Thêm trang con"
    click ActionClone href "/docs/02-luong-a-quan-ly-trang/02-nhan-ban-tu-thu-vien-mau" "Xem hướng dẫn Nhân bản mẫu"
    click Builder href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem hướng dẫn Page Builder"
    click Blocks href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem hướng dẫn Khối nội dung"
    click Draft href "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban" "Xem Lịch sử phiên bản"
    click MegaMenu href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem hướng dẫn Gắn Menu"`,

  '05': `flowchart TD
    Entry["Quản lý nội dung → Văn bản và bài viết"] --> Branch{"Chọn loại"}

    %% Nhánh bài viết
    Branch -->|"Bài viết tin tức"| PostNew["Tạo bài viết"]
    PostNew --> PostFields["Tiêu đề, Chuyên mục, Tác giả, Ảnh bìa 16:9"]
    PostFields --> PostContent["Soạn thảo nội dung"]
    PostContent --> CopilotChoice{"Dùng AI Copilot?"}
    CopilotChoice -->|"Có"| AICopilot["Kích hoạt Copilot: Viết lại · Rút gọn · Dịch song ngữ"]
    CopilotChoice -->|"Không"| CheckIndicators["Kiểm tra 4 chỉ báo hoàn thiện"]
    AICopilot --> CheckIndicators

    CheckIndicators --> PostSave{"Trạng thái lưu"}
    PostSave -->|"Lưu nháp"| SaveDraft["Lưu nháp"]
    PostSave -->|"Gửi duyệt"| SendReview["Gửi duyệt lãnh đạo"]
    PostSave -->|"Công bố"| PublishPost["Xuất bản bài viết"]
    PublishPost --> PromoteHome["Đề xuất quảng bá trang chủ"]

    %% Nhánh văn bản
    Branch -->|"Văn bản & Biểu mẫu"| DocNew["Ban hành văn bản"]
    DocNew --> DocFields["Trích yếu, số hiệu, ngày ký, chọn chuyên mục"]
    DocFields --> PDFUpload["Tải lên tệp PDF toàn văn"]
    PDFUpload --> DocPublish["Lưu & Hiện ngay"]

    click PostNew href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem hướng dẫn Tạo bài viết"
    click AICopilot href "/docs/03-luong-b-chuyen-muc-noi-dung/03-tro-ly-ai-copilot-song-ngu" "Xem hướng dẫn AI Copilot"
    click SendReview href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem quy trình duyệt tin"
    click DocNew href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem hướng dẫn Ban hành văn bản"
    click PDFUpload href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem hướng dẫn Tải PDF"`,

  '06': `flowchart TD
    Entry["Website → Header & Footer"] --> Choice{"Khu vực chỉnh sửa"}

    %% Nhánh Header
    Choice -->|"Đầu trang"| Header["Chọn Đầu trang (Mega Menu)"]
    Header --> SelectNav["Chọn Menu chính → Chọn Cột nội dung"]
    SelectNav --> ColType["Thuộc tính cột: Danh mục liên kết"]
    ColType --> LinkAction{"Thao tác link"}

    LinkAction -->|"Chọn trang có sẵn"| PagePick["Nút Chọn trang (Tự động gán link)"]
    LinkAction -->|"Liên kết ngoài"| ExtLink["Nhập URL, tên hiển thị, Tab mới"]
    LinkAction -->|"Sắp xếp / Gỡ"| Reorder["Mũi tên lên xuống hoặc bấm Xóa"]

    PagePick --> SaveNav["Lưu thay đổi menu"]
    ExtLink --> SaveNav
    Reorder --> SaveNav

    %% Nhánh Footer
    Choice -->|"Chân trang"| Footer["Chọn Chân trang"]
    Footer --> FooterInfo["Cập nhật: Logo, Thông tin liên hệ, Email, Hotline"]
    FooterInfo --> SaveFooter["Lưu thay đổi chân trang"]

    click Header href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem hướng dẫn Mega Menu"
    click PagePick href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Chọn trang"
    click Footer href "/docs/04-luong-c-menu-dieu-huong/02-cau-hinh-chan-trang-footer" "Xem hướng dẫn Chân trang"`,

  '07': `flowchart TD
    Trigger["Bấm Trợ lý UTE (Góc trên bên phải)"] --> Panel["Trung tâm Hỗ trợ & Thiết lập"]
    Panel --> GuideList{"Chọn chủ đề cần hỗ trợ"}

    GuideList --> Context["Cách sử dụng trang này (Tự động theo trang đang mở)"]
    GuideList --> Checklist["Checklist thiết lập"]
    GuideList --> GuidePost["Cách tạo bài viết"]
    GuideList --> GuidePage["Cách tạo trang web"]

    Context --> ViewMethod{"Cách xem"}
    ViewMethod -->|"Đọc nhanh"| Summary["Xem tóm tắt quy trình và mẹo thao tác ở cột phải"]
    ViewMethod -->|"Chỉ dẫn trực tiếp"| OnScreenTour["Bấm: Bắt đầu hướng dẫn trên màn hình"]

    OnScreenTour --> Spotlight["Vùng thao tác được làm nổi bật (Spotlight)"]
    Spotlight --> Box["Hộp thoại chỉ dẫn: Tên bước, Mẹo, Số thứ tự (1/6)"]
    Box --> NavButtons["Tiếp tục → Quay lại → Đóng hướng dẫn (×)"]

    click Checklist href "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo" "Xem Checklist kiểm tra"
    click GuidePost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem bài viết"
    click GuidePage href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang"
    click OnScreenTour href "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" "Xem chi tiết Trợ lý UTE"`,
};
