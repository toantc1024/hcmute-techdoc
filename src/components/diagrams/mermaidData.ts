export const mermaidDiagrams: Record<string, string> = {
  '01': `flowchart TD
    subgraph Tree1 ["1. SƠ ĐỒ TRANG (Website → Trang → Sơ đồ trang)"]
        Home["Trang chủ của Trường (/)"]
        Intro["Giới thiệu (/gioi-thieu)"]
        Sub1["Tổng quan"]
        Sub2["Cơ cấu tổ chức (/gioi-thieu/so-do-to-chuc)"]
        DocPage["Văn bản - Biểu mẫu (/gioi-thieu/van-ban-bieu-mau)"]
        Home --> Intro
        Intro --> Sub1
        Intro --> Sub2
        Intro --> DocPage
        Note1[/"Mỗi trang có đường dẫn riêng và nút Thiết kế để dựng bố cục Page Builder"/]
    end

    subgraph Tree2 ["2. CÂY CHUYÊN MỤC (Quản lý nội dung → Chuyên mục)"]
        CatPostRoot["BÀI VIẾT (/bai-viet)"]
        CatNotice["Thông báo"]
        CatEvent["Sự kiện"]
        CatDocRoot["VĂN BẢN (/van-ban)"]
        CatForm["Biểu mẫu (/bieu-mau)"]

        CatPostRoot --> CatNotice
        CatPostRoot --> CatEvent
        CatDocRoot --> CatForm
        Note2[/"Bài viết hoặc văn bản đều có thể chọn phân loại theo cả hai nhánh chuyên mục"/]
    end

    subgraph Tree3 ["3. MENU ĐẦU TRANG (Website → Header & Footer → Đầu trang)"]
        MenuRoot["Mục đầu trang: GIỚI THIỆU"]
        Col1["Cột 1: TỔNG QUAN<br/>(Thông điệp của Hiệu trưởng)"]
        Col2["Cột 2: QUẢN TRỊ<br/>(Cơ cấu tổ chức · Ban Giám hiệu)"]
        Col3["Cột 3: CÔNG KHAI<br/>(Văn bản - Biểu mẫu)"]

        MenuRoot --> Col1
        MenuRoot --> Col2
        MenuRoot --> Col3
        Note3[/"Cột trong menu là nhóm liên kết điều hướng, không mặc định là trang hoặc chuyên mục. Ba cây không cần giống nhau"/]
    end

    subgraph Bridge ["VÍ DỤ NỐI BA PHẦN: VĂN BẢN - BIỂU MẪU"]
        B1["1. Menu Giới thiệu → Cột CÔNG KHAI<br/>(Gắn liên kết Văn bản - Biểu mẫu)"]
        B2["2. Trang Văn bản - Biểu mẫu<br/>(/gioi-thieu/van-ban-bieu-mau)"]
        B3["3. Khối hiển thị trên trang<br/>(Chọn chuyên mục cần lấy)"]
        B4["Khối Tin tức hoặc Văn bản<br/>(Chọn khối mẫu Tin tức đa bố cục, Văn bản...)"]
        B5["Chuyên mục VĂN BẢN → Biểu mẫu"]

        B1 -->|"Bấm để mở"| B2
        B2 -->|"Chứa"| B3
        B3 -.->|"Chọn nhóm"| B4
        B4 -.->|"Lấy nội dung theo nhóm"| B5
    end

    Col3 -.->|"Trỏ liên kết đến"| DocPage
    DocPage -.->|"Nhúng khối nội dung"| B3
    B5 -.->|"Cung cấp dữ liệu nguồn"| CatForm

    subgraph Rules1 ["QUY TẮC CỐT LÕI"]
        R1["Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là ví dụ chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối."]
    end

    click Home href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem sơ đồ cây trang"
    click Intro href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem quản lý trang Giới thiệu"
    click DocPage href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem thiết kế Page Builder"
    click CatPostRoot href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem quản lý chuyên mục bài viết"
    click CatDocRoot href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem quản lý chuyên mục văn bản"
    click CatForm href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem chuyên mục biểu mẫu"
    click MenuRoot href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem cấu hình Mega Menu"
    click Col3 href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem sửa cột liên kết công khai"`,

  '02': `flowchart TD
    PreCheck["Điều kiện bắt đầu: Đăng nhập email @hcmute.edu.vn · Kiểm tra đúng đơn vị và ngôn ngữ nội dung"] --> Question{"Thầy/Cô muốn làm việc gì?"}

    %% NHÁNH A
    Question -->|"Tạo hoặc sửa trang web"| ActionA["TẠO HOẶC SỬA TRANG<br/>(VD: Giới thiệu · Cơ cấu tổ chức · Chức năng nhiệm vụ)"]
    ActionA -->|"Vào mục"| OpenA["Website → Trang (Sơ đồ trang)"]
    OpenA -->|"Làm theo"| TargetA["LUỒNG A · SƠ ĐỒ 04<br/>(Tạo mới · Nhân bản mẫu · Dựng khối Page Builder · Xuất bản)"]

    %% NHÁNH B
    Question -->|"Đăng nội dung tin bài / văn bản"| ActionB["ĐĂNG NỘI DUNG<br/>(VD: Tin tức · Hoạt động · Thông báo · Quyết định ban hành)"]
    ActionB -->|"Vào mục"| OpenB["Quản lý nội dung → Văn bản và bài viết"]
    OpenB -->|"Làm theo"| TargetB["LUỒNG B · SƠ ĐỒ 05<br/>(Soạn bài · AI Copilot song ngữ · Gửi duyệt · Ban hành PDF)"]

    %% NHÁNH C
    Question -->|"Sửa menu / đổi liên kết"| ActionC["SỬA MENU & LIÊN KẾT<br/>(VD: Tên menu đầu trang · Thêm liên kết cột · Đổi thứ tự · Chân trang)"]
    ActionC -->|"Vào mục"| OpenC["Website → Header & Footer (Đầu trang & Chân trang)"]
    OpenC -->|"Làm theo"| TargetC["LUỒNG C · SƠ ĐỒ 06<br/>(Sửa cột menu · Gán liên kết trang có sẵn · Kiểm tra Footer)"]

    subgraph Notes2 ["GHI CHÚ QUẢN TRỊ"]
        Rule2["Nhóm Trang - Biểu mẫu - Chuyên mục - Đường dẫn,... là ví dụ chọn nguồn; nhóm thực tế do người quản trị chọn khi thiết kế khối."]
    end

    click ActionA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A"
    click OpenA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A"
    click TargetA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở hướng dẫn Luồng A"

    click ActionB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B"
    click OpenB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B"
    click TargetB href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Mở hướng dẫn Luồng B"

    click ActionC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C"
    click OpenC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C"
    click TargetC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Mở hướng dẫn Luồng C"`,

  '03': `flowchart TD
    subgraph Col1Tree ["CÂY TRANG VÀ MENU ĐẦU TRANG"]
        P_Intro["Trang: Giới thiệu (/gioi-thieu)"]
        P_Org["Trang con: Cơ cấu tổ chức (/gioi-thieu/so-do-to-chuc)"]
        P_Intro -->|"Có trang con"| P_Org

        M_Intro["Menu đầu trang: GIỚI THIỆU"]
        M_ColOrg["Cột: QUẢN TRỊ"]
        M_LinkOrg["Liên kết: Cơ cấu tổ chức<br/>(Người đọc bấm để mở trang)"]
        M_Intro -->|"Chứa cột"| M_ColOrg -->|"Chứa liên kết"| M_LinkOrg
    end

    subgraph Col2Page ["TRANG NGƯỜI ĐỌC MỞ"]
        PageMain["TRANG CƠ CẤU TỔ CHỨC (/gioi-thieu/so-do-to-chuc)"]
        BlockImg["Khối Ảnh / Giới thiệu<br/>(Thông tin cơ cấu tổ chức)"]
        BlockNews["KHỐI TIN TỨC ĐA BỐ CỤC"]
        BlockDocs["KHỐI VĂN BẢN"]

        PageMain -->|"Chứa"| BlockImg
        PageMain -->|"Chứa"| BlockNews
        PageMain -->|"Chứa"| BlockDocs
    end

    subgraph Col3Cat ["NỘI DUNG VÀ CHUYÊN MỤC"]
        ItemPost["BÀI VIẾT"]
        ItemDoc["VĂN BẢN<br/>(Thông tin và tệp toàn văn)"]
        TreeCat["CÂY CHUYÊN MỤC CHUNG<br/>• Nhánh BÀI VIẾT<br/>• Nhánh VĂN BẢN<br/>(Chọn được cả hai nhánh)"]

        ItemPost -->|"Chọn nhóm"| TreeCat
        ItemDoc -->|"Chọn nhóm"| TreeCat
    end

    %% Mối liên kết chéo
    P_Org -.->|"Tạo / sửa trang"| PageMain
    M_LinkOrg -.->|"Chọn trang để liên kết"| PageMain
    TreeCat -.->|"Lấy theo nhóm đã chọn"| BlockNews
    TreeCat -.->|"Lấy theo nhóm đã chọn"| BlockDocs

    subgraph StepsSeq ["THỨ TỰ THIẾT LẬP 5 BƯỚC CỐT LÕI"]
        S1["Bước 1: Tạo cây trang<br/>(Khung chứa trang chủ, giới thiệu, văn bản)"]
        S2["Bước 2: Tạo chuyên mục<br/>(Phân nhóm tin bài, sự kiện, văn bản, biểu mẫu)"]
        S3["Bước 3: Bố trí nội dung trang<br/>(Page Builder: chọn khối hiển thị lấy tin theo chuyên mục)"]
        S4["Bước 4: Gắn trang vào menu<br/>(Vào Header & Footer: gán link dẫn người xem đến trang)"]
        S5["Bước 5: Kiểm tra & Công bố<br/>(Checklist: đúng vị trí, đúng thiết bị và công khai)"]

        S1 --> S2 --> S3 --> S4 --> S5
    end

    subgraph Rules3 ["QUY TẮC CỐT LÕI"]
        R1["Quy tắc 1: Tạo trang không tự tạo mục menu. Chuyên mục phân nhóm nội dung, không thay thế trang."]
        R2["Quy tắc 2: Cùng một bài viết hoặc văn bản có thể hiện đồng thời ở cả hai khối khi chọn chuyên mục phù hợp."]
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

  '04': `flowchart TD
    StartA(["BẮT ĐẦU"]) --> OpenPages["Website → Trang (Sơ đồ trang)"]
    OpenPages --> DecisionCreate{"Bạn muốn làm gì?"}

    %% 4 NHÁNH KHỞI TẠO
    DecisionCreate -->|"Tạo mới"| BranchNew["1. Tạo trang → Trang trống"]
    DecisionCreate -->|"Trang con"| BranchChild["1. Chọn trang cha → Thêm trang con"]
    DecisionCreate -->|"Dùng mẫu"| BranchClone["1. Nhân bản trang mẫu → Chọn mẫu → Nhân bản<br/>(Trang mẫu: thay nội dung của đơn vị)"]
    DecisionCreate -->|"Sửa"| BranchEdit["1. Chọn trang → Sửa"]

    %% FORM THÔNG TIN
    BranchNew --> FormPage["2. Nhập / sửa thông tin trang:<br/>• Tên trang (Tiếng Việt / English)<br/>• Đường dẫn tĩnh (Slug URL)<br/>• Trang cha trực thuộc<br/>• Đoạn giới thiệu ngắn theo biểu mẫu"]
    BranchChild --> FormPage
    BranchClone --> FormPage
    BranchEdit --> FormPage

    %% PAGE BUILDER
    FormPage -->|"Tiếp tục / lưu thông tin"| OpenBuilderBtn["3. Chọn Thiết kế (Mở Page Builder)"]
    OpenBuilderBtn --> EditBlocks["4. Thêm / sửa / sắp xếp các phần hiển thị:<br/>• Thêm khối mới từ thư viện mẫu<br/>• Cấu hình nguồn dữ liệu & gắn chuyên mục<br/>• Tùy chỉnh màu sắc, kiểu dáng"]

    %% XEM TRƯỚC
    EditBlocks --> PreviewResponsive["5. Xem trước đa thiết bị:<br/>Máy tính · Máy tính bảng · Điện thoại (Thu phóng 75% - 100%)"]
    PreviewResponsive --> CheckContent{"Nội dung đã đúng chưa?"}

    %% VÒNG LẶP SỬA
    CheckContent -->|"Chưa → sửa lại"| EditBlocks

    %% XUẤT BẢN
    CheckContent -->|"Đúng"| SaveDraftPage["6. Lưu trang / Lưu thay đổi<br/>(Lưu nháp nội bộ, chưa công khai)"]
    SaveDraftPage -->|"Công bố"| PublishPage["7. Xuất bản trang (Công bố)<br/>(Chỉ công bố khi đã kiểm tra và tài khoản có quyền)"]
    PublishPage -->|"Kiểm tra"| LiveVerifyPage["8. Mở website kiểm tra hiển thị thực tế"]

    %% GẮN MENU
    LiveVerifyPage --> NeedMenuDecision{"Cần thêm trang vào menu?"}
    NeedMenuDecision -->|"Có"| GotoFlowC["SANG LUỒNG C<br/>(Website → Header & Footer → Đầu trang)"]
    NeedMenuDecision -->|"Không"| PageSuccess(["HOÀN TẤT"])

    subgraph Rules4 ["CẢNH BÁO QUAN TRỌNG"]
        Warn4["Tạo trang chưa tạo mục trên menu. Chỉ công bố khi đã kiểm tra và tài khoản có quyền."]
    end

    click BranchNew href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang mới"
    click BranchChild href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem tạo trang con"
    click BranchClone href "/docs/02-luong-a-quan-ly-trang/02-nhan-ban-tu-thu-vien-mau" "Xem nhân bản mẫu"
    click OpenBuilderBtn href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem Page Builder"
    click EditBlocks href "/docs/02-luong-a-quan-ly-trang/03-trinh-thiet-ke-page-builder" "Xem cách dựng khối"
    click SaveDraftPage href "/docs/02-luong-a-quan-ly-trang/04-lich-su-va-khoi-phuc-phien-ban" "Xem lịch sử phiên bản"
    click GotoFlowC href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Sang Luồng C gắn Menu"`,

  '05': `flowchart TD
    StartB["Quản lý nội dung → Văn bản và bài viết"] --> DecisionType{"Bạn muốn đăng gì?"}

    %% NHÁNH BÀI VIẾT
    DecisionType -->|"Bài viết / Tin tức"| CreatePost["1. Bấm Tạo bài viết"]
    CreatePost --> PostTitle["2. Nhập tiêu đề bài viết"]
    PostTitle --> PostCover["3. Chọn ảnh bìa (chuẩn tỷ lệ 16:9)"]
    PostCover --> PostCat["4. Chọn chuyên mục & Thẻ tag phân loại"]
    PostCat --> PostBody["5. Soạn thảo nội dung:<br/>• Sử dụng thanh công cụ định dạng, chèn ảnh, bảng<br/>• AI Copilot: Viết lại văn phong · Tóm tắt ý · Dịch song ngữ"]

    PostBody --> PostPreview["6. Xem trước (Desktop / Mobile)"]
    PostPreview --> PostSave["7. Lưu bài viết (Bản thảo nội bộ)"]

    PostSave --> CheckApproval{"Có cần duyệt theo quyền?"}
    CheckApproval -->|"Không cần duyệt (Có quyền tự duyệt)"| PostPublishDirect["8. Quy trình → Xuất bản công bố"]
    CheckApproval -->|"Có cần duyệt"| SubmitReview["8. Quy trình → Gửi duyệt (Chờ lãnh đạo xem xét)"]

    SubmitReview --> ReviewResult{"Kết quả duyệt?"}
    ReviewResult -->|"Được duyệt"| PostPublishApproved["9. Quy trình → Xuất bản (Hiện trên web)"]
    ReviewResult -->|"Từ chối"| PostEditAgain["Sửa bài theo ý kiến phản hồi"]
    PostEditAgain --> PostSaveAgain["Lưu bài sửa"] --> ReSubmit["Gửi duyệt lại"] --> ReviewResult

    PostPublishDirect --> VerifyPost["Mở website kiểm tra hiển thị thực tế"]
    PostPublishApproved --> VerifyPost

    VerifyPost --> SharePost["Chia sẻ bài viết khi cần:<br/>Sao chép liên kết · Tạo mã QR · Đề xuất đưa lên trang chủ"]
    SharePost --> PostComplete(["HOÀN TẤT"])

    %% NHÁNH VĂN BẢN
    DecisionType -->|"Văn bản / Biểu mẫu"| IssueDoc["1. Bấm Ban hành văn bản"]
    IssueDoc --> DocInfo["2. Nhập thông tin văn bản:<br/>• Trích yếu nội dung văn bản<br/>• Số hiệu văn bản & Ngày ban hành<br/>• Cơ quan / Người ký ban hành"]
    DocInfo --> DocFile["3. Thêm tệp toàn văn PDF (hoặc chọn từ Media)"]
    DocFile --> DocCat["4. Chọn chuyên mục: VĂN BẢN hoặc BIỂU MẪU"]
    DocCat --> DocPreview["5. Xem trước thông tin"]
    DocPreview --> DocSave["6. Lưu văn bản"]
    DocSave --> DocPublish["7. Công bố (Hiện)<br/>(Độc giả tải tệp PDF trực tiếp)"]
    DocPublish --> DocComplete(["HOÀN TẤT"])

    subgraph Rules5 ["QUY TẮC CỐT LÕI"]
        Rule5["Lưu ≠ Gửi duyệt ≠ Công bố. Cả bài viết và văn bản đều phải chọn chuyên mục. Công bố theo quyền; kiểm tra các khối đã chọn và tệp kèm."]
    end

    click CreatePost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem hướng dẫn tạo bài viết"
    click PostBody href "/docs/03-luong-b-chuyen-muc-noi-dung/03-tro-ly-ai-copilot-song-ngu" "Xem trợ lý AI Copilot song ngữ"
    click SubmitReview href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem quy trình duyệt"
    click IssueDoc href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem ban hành văn bản"
    click DocFile href "/docs/03-luong-b-chuyen-muc-noi-dung/02-ban-hanh-van-ban-bieu-mau" "Xem chuẩn tệp PDF"`,

  '06': `flowchart TD
    StartC(["BẮT ĐẦU"]) --> OpenNav["Website → Header & Footer (Đầu trang & Chân trang)"]
    OpenNav --> DecisionNavArea{"Sửa ở đâu?"}

    %% NHÁNH ĐẦU TRANG
    DecisionNavArea -->|"Đầu trang (Mega Menu)"| PickHeader["Chọn Đầu trang"]
    PickHeader --> SelectMenuCol["Chọn mục menu chính / cột cần sửa<br/>(VD: Menu Giới thiệu, Đào tạo; Cột Tổng quan, Quản trị, Công khai)"]

    %% NHÁNH CHÂN TRANG
    DecisionNavArea -->|"Chân trang (Footer)"| PickFooter["Chọn Chân trang"]
    PickFooter --> FooterInfo["Cập nhật thông tin nhận diện đơn vị:<br/>• Logo HCM-UTE & Tên đơn vị chính thức<br/>• Địa chỉ, điện thoại, email liên hệ, mạng xã hội"]

    %% CÁC THAO TÁC LIÊN KẾT
    SelectMenuCol --> ActionMenu{"Bạn muốn làm gì?"}

    ActionMenu -->|"Đổi thứ tự"| ReorderAction["Đổi thứ tự liên kết<br/>(Dùng mũi tên Lên / Xuống)"]
    ActionMenu -->|"Xóa"| DeleteAction["Xóa liên kết<br/>(Bấm biểu tượng thùng rác)"]
    ActionMenu -->|"Thêm / sửa"| EditLinkAction["Thêm / sửa liên kết<br/>(Nhập tên hiển thị liên kết)"]

    EditLinkAction --> LinkTarget{"Liên kết đến đâu?"}
    LinkTarget -->|"Trang đã có"| PickInternalPage["Chọn trang đã có<br/>(Chọn trực tiếp từ cây trang web đã tạo)"]
    LinkTarget -->|"Nơi khác"| PickExternalLink["Nhập đường dẫn URL khác<br/>(Bật mở trong Tab mới _blank nếu cần)"]

    %% LƯU THAY ĐỔI
    ReorderAction --> SaveNavChanges["Lưu thay đổi"]
    DeleteAction --> SaveNavChanges
    PickInternalPage --> SaveNavChanges
    PickExternalLink --> SaveNavChanges
    FooterInfo --> SaveNavChanges

    %% KIỂM TRA THỰC TẾ
    SaveNavChanges --> TestLiveSite["Mở website kiểm tra thực tế"]
    TestLiveSite --> ClickTestLink["Bấm thử liên kết trên Máy tính / Điện thoại"]
    ClickTestLink --> CheckLinkOk{"Đã đúng chưa?"}

    CheckLinkOk -->|"Đúng"| NavComplete(["HOÀN TẤT"])
    CheckLinkOk -->|"Chưa → sửa lại"| SelectMenuCol

    %% HỖ TRỢ KHI CHƯA CÓ TRANG
    subgraph MissingPageHelp ["HỖ TRỢ: LÀM THẾ NÀO KHI CHƯA CÓ TRANG CẦN CHỌN?"]
        HelpStart["Chưa có trang cần chọn?"] -->|"Chưa có"| JumpFlowA["Sang Luồng A tạo trang web trước"]
        JumpFlowA -->|"Đã có trang"| ReturnPick["Quay lại Chọn trang đã có để gắn liên kết"]
    end

    subgraph Rules6 ["GHI CHÚ KIỂM TRA"]
        Rule6["Chân trang: kiểm tra logo, thông tin liên hệ, địa chỉ, điện thoại và thư điện tử của đơn vị. Bấm thử liên kết và Tab mới; kiểm tra trên máy tính / điện thoại. Nếu chưa đúng, quay lại sửa."]
    end

    click PickHeader href "/docs/04-luong-c-menu-dieu-huong/01-cau-hinh-thanh-dieu-huong" "Xem cấu hình Mega Menu"
    click PickInternalPage href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem hướng dẫn Chọn trang"
    click PickFooter href "/docs/04-luong-c-menu-dieu-huong/02-cau-hinh-chan-trang-footer" "Xem cấu hình Chân trang Footer"
    click JumpFlowA href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Mở Luồng A tạo trang"`,

  '07': `flowchart TD
    subgraph TopBarNav ["THANH ĐIỀU HƯỚNG ĐẦU (TOP BAR)"]
        BtnAssistant["1. Bấm Trợ lý UTE<br/>(Góc trên bên phải màn hình)"]
        CenterPanel["2. Trung tâm Hỗ trợ & Thiết lập Website HCM-UTE<br/>(Bảng điều khiển thông minh)"]
        TargetSelect["3. Chọn mục cần hướng dẫn nghiệp vụ"]

        BtnAssistant -->|"Mở"| CenterPanel -->|"Chọn"| TargetSelect
    end

    subgraph Panel1 ["1. CHỌN MỤC TRONG BẢNG HỖ TRỢ"]
        TopicActive["★ Cách sử dụng trang này<br/>(Tự động nhận diện phù hợp với màn hình đang mở)"]
        TopicChecklist["Checklist thiết lập trước khi công bố"]
        TopicPost["Cách tạo bài viết"]
        TopicPage["Cách tạo trang web"]
        TopicMedia["Chụp ảnh & Chuẩn hình 16:9"]
        NoteP1[/"Bấm một mục để xem bảng hướng dẫn tương ứng ở bên phải"/]
    end

    subgraph Panel2 ["2. ĐỌC HƯỚNG DẪN NGỮ CẢNH"]
        CtxDesc["Ví dụ ngữ cảnh: Cây Chuyên mục Tin bài"]
        ActionDesc["Đọc Quy trình thao tác chi tiết<br/>(Xem từng bước thao tác và mẹo làm nhanh)"]
        TourBtn["▶ BẮT ĐẦU HƯỚNG DẪN TRÊN MÀN HÌNH<br/>(Kích hoạt Interactive Tour trực quan)"]
        NoteP2[/"Nút ở đầu phần Cách sử dụng trang này. Ảnh minh họa: hướng dẫn cây chuyên mục"/]

        CtxDesc --> ActionDesc --> TourBtn
    end

    subgraph Panel3 ["3. HƯỚNG DẪN TRÊN MÀN HÌNH (INTERACTIVE TOUR)"]
        TourStep1["Vùng thao tác được làm nổi bật<br/>(Spotlight làm mờ phần xung quanh)"]
        TourStep2["Đọc hộp thoại chỉ dẫn:<br/>Tên bước · Diễn giải · Mẹo thao tác · Thứ tự bước (1/6)"]
        TourStep3["Điều hướng tour tương tác:<br/>• Tiếp tục → xem bước sau<br/>• Quay lại → xem bước trước<br/>• Dấu × → đóng hướng dẫn để thao tác thực tế"]
        NoteP3[/"Đi theo từng bước để biết vị trí cần dùng. Đóng hướng dẫn để trở lại thao tác"/]

        TourStep1 --> TourStep2 --> TourStep3
    end

    %% Tuyến kết nối giữa các phân hệ
    TargetSelect --> TopicActive
    TopicActive -->|"Hiển thị"| CtxDesc
    TourBtn -->|"Bắt đầu"| TourStep1

    subgraph AIBanner ["THÔNG BÁO NÂNG CẤP TRỢ LÝ"]
        AINotice["🤖 Trợ lý AI (Chatbot): Sắp ra mắt. Hiện tại Thầy/Cô sử dụng Bảng hướng dẫn ngữ cảnh và Hướng dẫn tương tác từng bước trên màn hình."]
    end

    subgraph FastSummary ["TÓM TẮT 3 BƯỚC NHANH"]
        Quick1["01 Mở đúng trang cần hỗ trợ"] --> Quick2["02 Chọn mục để đọc hướng dẫn"] --> Quick3["03 Xem từng bước trên màn hình"]
    end

    subgraph FooterNote7 ["GHI CHÚ QUẢN TRỊ"]
        FootNote["Các nút hướng dẫn giúp xem cách làm, không thay thao tác lưu hoặc công bố."]
    end

    click TopicActive href "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" "Xem Trợ lý UTE"
    click TopicChecklist href "/docs/06-kiem-tra-va-tro-ly/02-checklist-kiem-tra-cong-bo" "Xem Checklist kiểm tra công bố"
    click TopicPost href "/docs/03-luong-b-chuyen-muc-noi-dung/01-dang-tin-va-van-ban" "Xem cách tạo bài viết"
    click TopicPage href "/docs/02-luong-a-quan-ly-trang/01-tao-va-cong-bo-trang" "Xem cách tạo trang web"
    click TourBtn href "/docs/06-kiem-tra-va-tro-ly/01-tro-ly-ute-theo-tac-vu" "Xem trải nghiệm tour trên màn hình"`,
};
