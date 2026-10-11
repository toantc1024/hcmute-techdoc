export const mermaidDiagrams: Record<string, string> = {
  '01': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    subgraph TopPillars ["BA CẤU TRÚC QUẢN TRỊ CỐT LÕI (BỐ TRÍ SONG SONG)"]
        direction LR

        subgraph Tree1 ["1. SƠ ĐỒ TRANG (Website → Trang)"]
            direction TB
            Home["Trang chủ of Trường (/) ↗"]
            Intro["Giới thiệu (/gioi-thieu) ↗"]
            Sub1["Tổng quan"]
            Sub2["Cơ cấu tổ chức"]
            DocPage["Văn bản - Biểu mẫu ↗"]:::uteBlue
            Home --> Intro
            Intro --> Sub1 & Sub2 & DocPage
            Note1[/"Mỗi trang có URL riêng & nút Thiết kế (Page Builder)"/]:::uteNote
        end

        subgraph Tree2 ["2. CÂY CHUYÊN MỤC (Nội dung → Chuyên mục)"]
            direction TB
            CatPostRoot["BÀI VIẾT (/bai-viet) ↗"]
            CatNotice["Thông báo"]
            CatEvent["Sự kiện"]
            CatDocRoot["VĂN BẢN (/van-ban) ↗"]
            CatForm["Biểu mẫu (/bieu-mau) ↗"]:::uteBlue
            CatPostRoot --> CatNotice & CatEvent
            CatDocRoot --> CatForm
            Note2[/"Nội dung có thể phân loại theo cả hai nhánh"/]:::uteNote
        end

        subgraph Tree3 ["3. MENU ĐẦU TRANG (Header & Footer)"]
            direction TB
            MenuRoot["Menu chính: GIỚI THIỆU ↗"]
            Col1["Cột 1: TỔNG QUAN<br/>(Thông điệp Hiệu trưởng)"]
            Col2["Cột 2: QUẢN TRỊ<br/>(Ban Giám hiệu)"]
            Col3["Cột 3: CÔNG KHAI ↗<br/>(Văn bản - Biểu mẫu)"]:::uteBlue
            MenuRoot --> Col1 & Col2 & Col3
            Note3[/"Cột menu là nhóm link điều hướng, 3 cây độc lập"/]:::uteNote
        end
    end

    subgraph BridgeSection ["VÍ DỤ NỐI BA PHẦN: VĂN BẢN - BIỂU MẪU (LUỒNG LIÊN KẾT DỮ LIỆU)"]
        direction LR
        B1["1. Menu Giới thiệu<br/>(Cột CÔNG KHAI)"]:::uteBlue -->|"Bấm mở link"| B2["2. Trang Văn bản - Biểu mẫu<br/>(/gioi-thieu/van-ban-bieu-mau)"]:::uteBlue
        B2 -->|"Chứa khối"| B3["3. Khối hiển thị dữ liệu<br/>(Khối tin / Văn bản)"]:::uteBlue
        B3 -.->|"Truy vấn nguồn"| B4["4. Chuyên mục VĂN BẢN → Biểu mẫu"]:::uteBlue
    end

    Col3 -.->|"Trỏ link đến"| DocPage
    DocPage -.->|"Nhúng khối"| B3
    B4 -.->|"Lấy nguồn từ"| CatForm

    subgraph FooterRule1 ["QUY TẮC CỐT LÕI"]
        R1["Quy tắc: Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn là ví dụ chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối."]:::uteNote
    end

    click Home href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem sơ đồ cây trang"
    click Intro href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem quản lý trang Giới thiệu"
    click DocPage href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem thiết kế Page Builder"
    click CatPostRoot href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem quản lý chuyên mục bài viết"
    click CatDocRoot href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem quản lý chuyên mục văn bản"
    click CatForm href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem chuyên mục biểu mẫu"
    click MenuRoot href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem cấu hình Mega Menu"
    click Col3 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem sửa cột liên kết công khai"`,

  '02': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;

    PreCheck["Điều kiện bắt đầu: Đăng nhập email @hcmute.edu.vn · Kiểm tra đúng đơn vị và ngôn ngữ nội dung"]:::uteBlue
    Question{"Thầy/Cô muốn làm việc gì?"}:::uteYellow

    PreCheck --> Question

    subgraph ActionsGrid [" "]
        direction LR

        subgraph BranchC [" "]
            direction TB
            BranchCHeader["LUỒNG C<br/>SỬA MENU & LIÊN KẾT"]:::uteNavy
            C1["Mục tiêu: Sửa menu và liên kết ↗<br/>(Đổi tên menu · Thêm link<br/>Sắp xếp thứ tự · Footer)"]
            C2["Nơi vào: Website →<br/>Header & Footer ↗"]
            C3["SƠ ĐỒ 06: LUỒNG C ↗<br/>(Sửa cột menu · Gán link trang<br/>Kiểm tra Footer)"]:::uteBlue
            BranchCHeader --> C1 --> C2 --> C3
        end

        subgraph BranchB [" "]
            direction TB
            BranchBHeader["LUỒNG B<br/>ĐĂNG NỘI DUNG"]:::uteNavy
            B1["Mục tiêu: Đăng tin tức / văn bản ↗<br/>(Tin tức · Hoạt động<br/>Thông báo · Quyết định)"]
            B2["Nơi vào: Quản lý nội dung →<br/>Văn bản và bài viết ↗"]
            B3["SƠ ĐỒ 05: LUỒNG B ↗<br/>(Soạn bài · AI Copilot<br/>Gửi duyệt · Ban hành PDF)"]:::uteBlue
            BranchBHeader --> B1 --> B2 --> B3
        end

        subgraph BranchA [" "]
            direction TB
            BranchAHeader["LUỒNG A<br/>TẠO HOẶC SỬA TRANG"]:::uteNavy
            A1["Mục tiêu: Tạo hoặc sửa trang web ↗<br/>(Giới thiệu · Cơ cấu tổ chức<br/>Chức năng đơn vị)"]
            A2["Nơi vào: Website → Trang<br/>(Sơ đồ cây trang) ↗"]
            A3["SƠ ĐỒ 04: LUỒNG A ↗<br/>(Tạo mới · Nhân bản<br/>Page Builder · Xuất bản)"]:::uteBlue
            BranchAHeader --> A1 --> A2 --> A3
        end
    end

    Question -->|"1. Nhu cầu về trang web"| BranchAHeader
    Question -->|"2. Nhu cầu về tin bài / văn bản"| BranchBHeader
    Question -->|"3. Nhu cầu về menu điều hướng"| BranchCHeader

    click A1 href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A" _self
    click A2 href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A" _self
    click A3 href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A" _self

    click B1 href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B" _self
    click B2 href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B" _self
    click B3 href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B" _self

    click C1 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C" _self
    click C2 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C" _self
    click C3 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C" _self`,

  '03': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    subgraph MainCols ["MỐI QUAN HỆ TƯƠNG TÁC 3 CỘT (TỔNG QUAN HỆ THỐNG)"]
        direction LR

        subgraph Col1 ["CỘT 1: CÂY TRANG & MENU"]
            direction TB
            P_Intro["Trang: Giới thiệu (/gioi-thieu) ↗"] -->|"Có trang con"| P_Org["Trang con: Cơ cấu tổ chức (/gioi-thieu/so-do-to-chuc)"]
            M_Intro["Menu: GIỚI THIỆU"] -->|"Chứa cột"| M_ColOrg["Cột: QUẢN TRỊ"] -->|"Chứa liên kết"| M_LinkOrg["Liên kết: Cơ cấu tổ chức<br/>(Người đọc bấm để mở trang)"]:::uteBlue
        end

        subgraph Col2 ["CỘT 2: TRANG NGƯỜI ĐỌC MỞ"]
            direction TB
            PageMain["TRANG CƠ CẤU TỔ CHỨC (/gioi-thieu/so-do-to-chuc)"]:::uteBlue
            BlockImg["Khối Ảnh / Giới thiệu"]
            BlockNews["KHỐI TIN TỨC ĐA BỐ CỤC ↗"]
            BlockDocs["KHỐI VĂN BẢN ↗"]
            PageMain --> BlockImg & BlockNews & BlockDocs
        end

        subgraph Col3 ["CỘT 3: NỘI DUNG & CHUYÊN MỤC"]
            direction TB
            ItemPost["BÀI VIẾT"] -->|"Chọn nhóm"| TreeCat["CÂY CHUYÊN MỤC CHUNG<br/>(Nhánh Bài viết · Nhánh Văn bản)"]:::uteBlue
            ItemDoc["VĂN BẢN (PDF)"] -->|"Chọn nhóm"| TreeCat
        end
    end

    P_Org -.->|"Tạo / sửa trang"| PageMain
    M_LinkOrg -.->|"Gắn link mở trang"| PageMain
    TreeCat -.->|"Lấy bài theo nhóm"| BlockNews
    TreeCat -.->|"Lấy tệp theo nhóm"| BlockDocs

    subgraph StepsSeq ["QUY TRÌNH 5 BƯỚC THIẾT LẬP THỰC TẾ (ĐỌC THEO MŨI TÊN)"]
        direction LR
        S1["1. Tạo cây trang<br/>(Khung chứa trang)"] --> S2["2. Tạo chuyên mục<br/>(Phân nhóm tin bài)"] --> S3["3. Bố trí nội dung<br/>(Chọn khối & nguồn)"] --> S4["4. Gắn vào menu ↗<br/>(Gán liên kết)"] --> S5["5. Kiểm tra & Công bố ↗<br/>(Đa thiết bị)"]:::uteGreen
    end

    subgraph Rules3 ["QUY TẮC CỐT LÕI"]
        R1["Quy tắc 1: Tạo trang không tự tạo mục menu. Chuyên mục phân nhóm nội dung, không thay thế trang."]:::uteNote
        R2["Quy tắc 2: Cùng một bài viết hoặc văn bản có thể hiện đồng thời ở cả hai khối khi chọn chuyên mục phù hợp."]:::uteNote
    end

    click P_Intro href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang"
    click P_Org href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang con"
    click M_LinkOrg href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem liên kết menu"
    click BlockNews href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem cấu hình khối tin tức"
    click BlockDocs href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem cấu hình khối văn bản"
    click TreeCat href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem cây chuyên mục"
    click S1 href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Bước 1: Tạo cây trang"
    click S2 href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Bước 2: Tạo chuyên mục"
    click S3 href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Bước 3: Bố trí nội dung"
    click S4 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Bước 4: Gắn vào menu"
    click S5 href "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo" "Bước 5: Checklist công bố"`,

  '04': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    subgraph Phase1 [" "]
        direction LR
        Phase1Header["GIAI ĐOẠN 1: KHỞI TẠO & NHẬP THÔNG TIN TRANG"]:::uteNavy
        Phase1Header --> StartA(["BẮT ĐẦU"]) --> OpenPages["Website → Trang"] --> DecisionCreate{"Bạn muốn làm gì?"}:::uteYellow
        DecisionCreate -->|"Tạo mới"| BranchNew["Tạo trang trống ↗"]
        DecisionCreate -->|"Trang con"| BranchChild["Thêm trang con ↗"]
        DecisionCreate -->|"Dùng mẫu"| BranchClone["Nhân bản mẫu ↗"]
        DecisionCreate -->|"Sửa trang"| BranchEdit["Chọn trang → Sửa"]
        BranchNew & BranchChild & BranchClone & BranchEdit --> FormPage["Nhập thông tin trang:<br/>• Tên trang (VI/EN) · Slug URL<br/>• Trang cha · Mô tả ngắn"]
    end

    subgraph Phase2 [" "]
        direction LR
        Phase2Header["GIAI ĐOẠN 2: THIẾT KẾ BỐ CỤC & XEM TRƯỚC (PAGE BUILDER)"]:::uteNavy
        Phase2Header --> OpenBuilderBtn["Mở Page Builder ↗<br/>(Nút Thiết kế)"]:::uteBlue --> EditBlocks["Dựng khối nội dung:<br/>• Thêm khối từ thư viện<br/>• Gán nguồn chuyên mục<br/>• Tùy chỉnh màu sắc, kiểu"] --> PreviewResponsive["Xem trước đa thiết bị:<br/>Máy tính · Tablet · Mobile (75%-100%)"]:::uteGreen --> CheckContent{"Nội dung đã đúng chưa?"}:::uteYellow
        CheckContent -->|"Chưa → sửa lại"| EditBlocks
    end

    subgraph Phase3 [" "]
        direction LR
        Phase3Header["GIAI ĐOẠN 3: LƯU, XUẤT BẢN CÔNG KHAI & ĐIỀU HƯỚNG MENU"]:::uteNavy
        Phase3Header --> SaveDraftPage["Lưu nháp nội bộ ↗"] --> PublishPage["Xuất bản (Công bố)<br/>(Chỉ khi có quyền & kiểm tra)"]:::uteRed --> LiveVerifyPage["Mở web kiểm tra thực tế"]:::uteGreen --> NeedMenuDecision{"Cần thêm vào menu?"}:::uteYellow
        NeedMenuDecision -->|"Có"| GotoFlowC["SANG LUỒNG C (GẮN MENU) ↗"]:::uteBlue
        NeedMenuDecision -->|"Không"| PageSuccess(["HOÀN TẤT"]):::uteGreen
    end

    FormPage -->|"Tiếp tục"| Phase2Header
    CheckContent -->|"Đúng"| Phase3Header

    subgraph FooterRule4 ["CẢNH BÁO CÔNG BỐ"]
        Warn4["Lưu ý: Tạo trang chưa tạo mục trên menu. Chỉ công bố khi đã kiểm tra và tài khoản có quyền."]:::uteRed
    end

    click BranchNew href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang mới"
    click BranchChild href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang con"
    click BranchClone href "/docs/02-luong-a-quan-ly-trang/02-nhan-ban-tu-thu-vien-mau" "Xem nhân bản mẫu"
    click OpenBuilderBtn href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem Page Builder"
    click EditBlocks href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem cách dựng khối"
    click SaveDraftPage href "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban" "Xem lịch sử phiên bản"
    click GotoFlowC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Sang Luồng C gắn Menu"`,

  '05': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    StartB["Quản lý nội dung → Văn bản và bài viết"] --> DecisionType{"Bạn muốn đăng gì?"}:::uteYellow

    subgraph TrackPost [" "]
        direction LR
        TrackPostHeader["NHÁNH 1: QUY TRÌNH BÀI VIẾT / TIN TỨC"]:::uteNavy
        TrackPostHeader --> CreatePost["1. Tạo bài viết ↗"] --> PostInfo["2. Tiêu đề & Ảnh bìa 16:9<br/>• Chọn chuyên mục & tag"] --> PostBody["3. Soạn thảo nội dung<br/>• Trợ lý AI Copilot song ngữ"] --> PostPreview["4. Xem trước & Lưu"]:::uteGreen --> CheckApproval{"5. Có cần duyệt?"}:::uteYellow
        CheckApproval -->|"Tự duyệt"| PostPublishDirect["6. Xuất bản"]:::uteRed
        CheckApproval -->|"Cần duyệt"| SubmitReview["6. Gửi duyệt ↗"]:::uteBlue --> ReviewResult{"Kết quả?"}:::uteYellow
        ReviewResult -->|"Duyệt"| PostPublishApproved["Xuất bản"]:::uteRed
        ReviewResult -->|"Từ chối"| PostEditAgain["Sửa bài & Duyệt lại"]:::uteRed --> ReviewResult
        PostPublishDirect & PostPublishApproved --> VerifyPost["7. Mở web kiểm tra & Chia sẻ (QR/Link)"]:::uteGreen --> PostComplete(["HOÀN TẤT"]):::uteGreen
    end

    subgraph TrackDoc [" "]
        direction LR
        TrackDocHeader["NHÁNH 2: QUY TRÌNH BAN HÀNH VĂN BẢN / BIỂU MẪU"]:::uteNavy
        TrackDocHeader --> IssueDoc["1. Ban hành văn bản ↗"] --> DocInfo["2. Trích yếu, số hiệu, ngày ký"] --> DocFile["3. Tải lên tệp PDF toàn văn ↗"] --> DocCat["4. Chọn: VĂN BẢN / BIỂU MẪU"] --> DocSavePublish["5. Xem trước → Lưu → Công bố (Hiện)"]:::uteRed --> DocComplete(["HOÀN TẤT"]):::uteGreen
    end

    DecisionType -->|"Bài viết / Tin tức"| TrackPostHeader
    DecisionType -->|"Văn bản / Biểu mẫu"| TrackDocHeader

    subgraph FooterRule5 ["QUY TẮC CỐT LÕI"]
        Rule5["Lưu ý: Lưu ≠ Gửi duyệt ≠ Công bố. Cả bài viết và văn bản đều phải chọn chuyên mục. Công bố theo quyền; kiểm tra các khối đã chọn và tệp kèm."]:::uteNote
    end

    click CreatePost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem hướng dẫn tạo bài viết"
    click PostBody href "/docs/03-luong-b-chuyen-muc-noi-dung/03-tro-ly-ai-copilot-song-ngu" "Xem trợ lý AI Copilot song ngữ"
    click SubmitReview href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem quy trình duyệt"
    click IssueDoc href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem ban hành văn bản"
    click DocFile href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem chuẩn tệp PDF"`,

  '06': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    subgraph NavStage1 [" "]
        direction LR
        NavStage1Header["BƯỚC 1: CHỌN KHU VỰC CẦN SỬA"]:::uteNavy
        NavStage1Header --> StartC(["BẮT ĐẦU"]) --> OpenNav["Website → Header & Footer"] --> DecisionNavArea{"Sửa ở đâu?"}:::uteYellow
        DecisionNavArea -->|"Đầu trang (Mega Menu)"| PickHeader["Chọn Đầu trang → Chọn Menu / Cột cần sửa ↗"]:::uteBlue
        DecisionNavArea -->|"Chân trang (Footer)"| PickFooter["Chọn Chân trang → Cập nhật logo, địa chỉ, hotline, email"]:::uteBlue
    end

    subgraph NavStage2 [" "]
        direction LR
        NavStage2Header["BƯỚC 2: THỰC HIỆN THAO TÁC LIÊN KẾT"]:::uteNavy
        NavStage2Header --> ActionMenu{"Bạn muốn làm gì?"}:::uteYellow
        ActionMenu -->|"Đổi thứ tự"| ReorderAction["Đổi thứ tự (Mũi tên Lên/Xuống)"]
        ActionMenu -->|"Xóa"| DeleteAction["Xóa liên kết (Thùng rác)"]:::uteRed
        ActionMenu -->|"Thêm / sửa"| EditLinkAction["Thêm / sửa liên kết"]
        EditLinkAction --> LinkTarget{"Liên kết đến đâu?"}:::uteYellow
        LinkTarget -->|"Trang đã có"| PickInternalPage["Chọn trang đích từ cây trang ↗"]:::uteBlue
        LinkTarget -->|"Nơi khác"| PickExternalLink["Nhập URL đích (Tab mới _blank)"]
    end

    subgraph NavStage3 [" "]
        direction LR
        NavStage3Header["BƯỚC 3: LƯU & KIỂM TRA THỰC TẾ TRÊN MÁY TÍNH / ĐIỆN THOẠI"]:::uteNavy
        NavStage3Header --> SaveNavChanges["1. Bấm Lưu thay đổi"] --> TestLiveSite["2. Mở website thực tế"]:::uteGreen --> ClickTestLink["3. Bấm thử liên kết"]:::uteGreen --> CheckLinkOk{"Đã đúng chưa?"}:::uteYellow
        CheckLinkOk -->|"Đúng"| NavComplete(["HOÀN TẤT"]):::uteGreen
        CheckLinkOk -->|"Chưa → sửa lại"| FixLink["Quay lại bước 2"]:::uteRed
    end

    PickHeader --> NavStage2Header
    PickFooter --> NavStage3Header
    ReorderAction & DeleteAction & PickInternalPage & PickExternalLink --> NavStage3Header
    FixLink -.-> ActionMenu

    subgraph MissingPageHelp ["HỖ TRỢ: LÀM THẾ NÀO KHI CHƯA CÓ TRANG CẦN CHỌN?"]
        direction LR
        HelpStart["Chưa có trang cần chọn?"] -->|"Chưa có"| JumpFlowA["Sang Luồng A tạo trang web trước ↗"]:::uteBlue -->|"Đã có trang"| ReturnPick["Quay lại Chọn trang đã có để gắn liên kết"]:::uteBlue
    end

    subgraph FooterRule6 ["GHI CHÚ KIỂM TRA"]
        Rule6["Chân trang: kiểm tra logo, thông tin liên hệ, địa chỉ, điện thoại và thư điện tử của đơn vị. Bấm thử liên kết và Tab mới; kiểm tra trên máy tính / điện thoại. Nếu chưa đúng, quay lại sửa."]:::uteNote
    end

    click PickHeader href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem cấu hình Mega Menu"
    click PickInternalPage href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Chọn trang"
    click PickFooter href "/docs/04-luong-c-menu-dieu-huong/02-cau-hinh-chan-trang-footer" "Xem cấu hình Chân trang Footer"
    click JumpFlowA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở Luồng A tạo trang"`,

  '07': `flowchart TB
    classDef uteBlue fill:#F0F9FF,stroke:#0072BC,stroke-width:1.5px,color:#003D66;
    classDef uteNavy fill:#003D66,stroke:#002B47,stroke-width:1.5px,color:#FFFFFF;
    classDef uteRed fill:#FEF2F2,stroke:#ED1C24,stroke-width:1.5px,color:#B91C1C;
    classDef uteGreen fill:#F0FDF4,stroke:#16A34A,stroke-width:1.5px,color:#15803D;
    classDef uteYellow fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#92400E;
    classDef uteNote fill:#F8FAFC,stroke:#94A3B8,stroke-width:1px,color:#475569;
    subgraph TopBarNav ["THANH ĐIỀU HƯỚNG ĐẦU (TOP BAR TRỢ LÝ)"]
        direction LR
        BtnAssistant["1. Bấm Trợ lý UTE<br/>(Góc trên bên phải màn hình)"]:::uteBlue --> CenterPanel["2. Trung tâm Hỗ trợ & Thiết lập Website HCM-UTE<br/>(Bảng điều khiển thông minh)"]:::uteBlue --> TargetSelect["3. Chọn mục cần hướng dẫn nghiệp vụ"]:::uteYellow
    end

    subgraph ThreePanels ["3 PHÂN HỆ HƯỚNG DẪN TRỰC QUAN (BỐ TRÍ SONG SONG DỄ DÙNG)"]
        direction LR

        subgraph Panel1 ["1. CHỌN MỤC BẢNG HỖ TRỢ"]
            direction TB
            TopicActive["★ Cách sử dụng trang này<br/>(Tự nhận diện ngữ cảnh trang mở)"]:::uteBlue
            TopicChecklist["Checklist thiết lập trước công bố ↗"]
            TopicPost["Cách tạo bài viết ↗"]
            TopicPage["Cách tạo trang web ↗"]
            TopicMedia["Chụp ảnh & Chuẩn hình 16:9"]
            TopicActive --- TopicChecklist --- TopicPost --- TopicPage --- TopicMedia
            NoteP1[/"Bấm mục để xem hướng dẫn bên phải"/]:::uteNote
        end

        subgraph Panel2 ["2. ĐỌC HƯỚNG DẪN NGỮ CẢNH"]
            direction TB
            CtxDesc["Ví dụ ngữ cảnh: Cây Chuyên mục Tin bài"]
            ActionDesc["Đọc quy trình thao tác chi tiết & mẹo làm nhanh"]
            TourBtn["▶ BẮT ĐẦU HƯỚNG DẪN TRÊN MÀN HÌNH<br/>(Kích hoạt Interactive Tour trực quan)"]:::uteGreen
            CtxDesc --> ActionDesc --> TourBtn
            NoteP2[/"Nút ở đầu phần Cách sử dụng trang này"/]:::uteNote
        end

        subgraph Panel3 ["3. INTERACTIVE TOUR TRÊN MÀN HÌNH"]
            direction TB
            TourStep1["Vùng thao tác được làm nổi bật (Spotlight)"]:::uteBlue
            TourStep2["Hộp thoại chỉ dẫn: Tên bước · Diễn giải · Mẹo (1/6)"]
            TourStep3["Điều hướng: Tiếp tục · Quay lại · Đóng (×)"]
            TourStep1 --> TourStep2 --> TourStep3
            NoteP3[/"Đi theo từng bước để biết vị trí thao tác"/]:::uteNote
        end
    end

    TargetSelect --> TopicActive
    TopicActive -->|"Hiển thị"| CtxDesc
    TourBtn -->|"Bắt đầu tour"| TourStep1

    subgraph SummaryAndAI ["TỔNG KẾT & LƯU Ý"]
        direction LR
        Quick1["01 Mở đúng trang cần hỗ trợ"]:::uteBlue --> Quick2["02 Chọn mục để đọc hướng dẫn"]:::uteBlue --> Quick3["03 Xem từng bước trên màn hình"]:::uteBlue
        AINotice["🤖 Trợ lý AI (Chatbot): Sắp ra mắt. Hiện tại Thầy/Cô sử dụng Bảng hướng dẫn ngữ cảnh và Hướng dẫn tương tác từng bước trên màn hình."]:::uteNote
    end

    click TopicActive href "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" "Xem Trợ lý UTE"
    click TopicChecklist href "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo" "Xem Checklist kiểm tra công bố"
    click TopicPost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem cách tạo bài viết"
    click TopicPage href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem cách tạo trang web"
    click TourBtn href "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" "Xem trải nghiệm tour trên màn hình"`,

};
