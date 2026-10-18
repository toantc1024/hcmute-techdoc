-- ==============================================================================
-- Migration B: 20261017000002_data_migration_candidate.sql
-- Description: Atomic Data Seeding & Score Parity Verification (Option A: Static Seed)
-- Target: Supabase Cloud (Project: iyrahtrfypjbzngmuera - Shared with ute-feedback-form)
-- Status: LOCAL CANDIDATE — ATOMIC EXECUTION READY — DO NOT RUN IN PROD YET
-- Rule 15: Strictly under 300 lines (<300)
-- ==============================================================================
BEGIN;

DO $$
DECLARE
  v_seed JSONB := $SEED${"criteria":[{"id":"crit_dns","code":"TC-01","name":"1. Hạ tầng DNS, Tên miền & SSL","description":"Trỏ tên miền chính về IP mới .189, chứng chỉ bảo mật SSL HTTPS và chuyển hướng 301.","weight":15,"passCondition":"Đã trỏ tên miền chính về IP mới .189, SSL HTTPS hợp lệ, tự động redirect 301 từ http.","warningCondition":"Tên miền chính tạm duy trì web cũ (.181) chờ chuyển giao hoặc web mới đang ở subdomain lưu trữ (...1).","failCondition":"Báo lỗi 404 Not Found, NXDOMAIN hoặc trỏ nhầm IP hosting bên ngoài."},{"id":"crit_brand","code":"TC-02","name":"2. Nhận diện thương hiệu & Media","description":"Logo trường chuẩn vector, banner desktop 2.4:1 (2400x1000px), banner tin 16:9 sắc nét.","weight":15,"passCondition":"Logo trường chuẩn vector, Banner desktop 2.4:1 (2400x1000px), Banner tin 16:9, ảnh nét đúng tỷ lệ.","warningCondition":"Chưa có banner riêng đơn vị (dùng banner chung) hoặc kích thước banner chưa tối ưu chuẩn 2.4:1.","failCondition":"Hình ảnh bị méo tỷ lệ, vỡ hạt hoặc dùng banner/ảnh đại diện của đơn vị khác."},{"id":"crit_luong_a","code":"TC-03","name":"3. Trang con tĩnh (Luồng A)","description":"Đủ 4 trang cơ bản: Giới thiệu, Cơ cấu tổ chức/Nhân sự, Chức năng nhiệm vụ, Liên hệ.","weight":15,"passCondition":"Đủ 4 trang cơ bản: Giới thiệu, Cơ cấu tổ chức/Nhân sự, Chức năng nhiệm vụ, Liên hệ. URL chuẩn SEO.","warningCondition":"Có trang giới thiệu nhưng còn thiếu thông tin ban lãnh đạo, nhân sự bộ môn, phòng lab.","failCondition":"Trắng trang con, dính text mẫu hoặc nội dung trang con bị clone nhầm của khoa/phòng khác."},{"id":"crit_luong_b","code":"TC-04","name":"4. Tin bài & Văn bản PDF (Luồng B)","description":"Tin bài thực tế đơn vị, có mục Tin tức & Thông báo, biểu mẫu PDF mở quyền tải công khai.","weight":15,"passCondition":"100% tin bài thực tế của đơn vị, có đủ mục Tin tức và Thông báo, file biểu mẫu PDF mở quyền tải công khai.","warningCondition":"Số lượng bài viết còn ít (< 3 bài), chưa cập nhật biểu mẫu PDF mới nhất, thiếu trích yếu ngắn gọn.","failCondition":"Chứa bài viết mẫu Lorem Ipsum, bài viết sai chuyên môn hoặc file PDF bị lỗi không tải được."},{"id":"crit_luong_c","code":"TC-05","name":"5. Mega Menu & Footer (Luồng C)","description":"Menu tối đa 3 cấp thông suốt, 100% link nội bộ relative, Footer đủ email trường và địa chỉ.","weight":15,"passCondition":"Menu tối đa 3 cấp, điều hướng thông suốt, 100% link nội bộ relative, Footer đủ email trường và địa chỉ phòng.","warningCondition":"Menu còn chứa liên kết dạng dấu # hoặc còn sót link trỏ về domain thử nghiệm cũ (hcmutertic.com).","failCondition":"Click menu bị lỗi 404, liên kết menu trỏ sang web bên ngoài trái quy định, Footer không có thông tin."},{"id":"crit_security","code":"TC-06","name":"6. Bảo mật & An toàn dữ liệu","description":"Bảo mật thông tin cá nhân: không lộ số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm.","weight":10,"passCondition":"Không hiển thị số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm.","warningCondition":"Các thông báo khen thưởng/học phí có hiển thị mã sinh viên nhưng chưa được che bớt ký tự định danh.","failCondition":"Công khai trực tiếp danh sách sinh viên kèm số CCCD, số tài khoản ngân hàng hoặc số điện thoại riêng tư."},{"id":"crit_info","code":"TC-07","name":"7. Thông tin cơ bản & Website liên kết","description":"Tên đơn vị chuẩn Bộ từ điển HCM-UTE, email @hcmute.edu.vn, SĐT Ext, phòng làm việc, link ngoài thông suốt.","weight":15,"passCondition":"Tên đơn vị chuẩn Bộ từ điển HCM-UTE, 100% email @hcmute.edu.vn, có SĐT Ext, số phòng làm việc, link ngoài thông suốt.","warningCondition":"Tên đơn vị còn dùng tên cũ, thiếu số phòng cụ thể, thiếu số máy lẻ Ext, có 1-2 liên kết mạng xã hội để dấu #.","failCondition":"Dùng email cá nhân Gmail/Yahoo, SĐT giả lập, link trỏ localhost/yhcmute, hoặc link lỗi 404 gián đoạn."}],"phases":[{"phaseId":1,"title":"Giai đoạn 1: Rà soát & Cấp quyền vận hành","timeFrame":"01/10/2026 - 15/10/2026","target":"Hoàn thành cấp tài khoản quản trị cho 51 đơn vị, ban hành tài liệu TechDoc và tập huấn.","status":"completed","completionRate":100},{"phaseId":2,"title":"Giai đoạn 2: Chuẩn hóa dữ liệu & Tích hợp nhận diện","timeFrame":"16/10/2026 - 31/10/2026","target":"Hoàn thiện 4 trang tĩnh Luồng A, đăng tải tối thiểu 5 bài viết Luồng B, cấu hình menu Luồng C.","status":"in-progress","completionRate":68},{"phaseId":3,"title":"Giai đoạn 3: Nghiệm thu & Chuyển giao DNS chính thức","timeFrame":"01/11/2026 - 15/11/2026","target":"Đổi DNS toàn bộ 51 đơn vị sang IP mới .189, nghiệm thu toàn trường, chính thức đưa vào khai thác.","status":"upcoming","completionRate":33}],"docSections":[{"id":"sec-01","slug":"01-khoi-dong-va-tong-quan","chapterNumber":1,"chapterTitle":"Khởi động và tổng quan","pageTitle":"Hướng dẫn đăng nhập & khu vực chính","pageSlug":"01-dang-nhap-va-khu-vuc-chinh","summary":"Quy trình đăng nhập hệ thống quản trị bằng tài khoản SSO HCM-UTE và làm quen bảng điều khiển.","luong":"TONG_QUAN","isVisible":true,"viewCount":3850,"readingTimeMinutes":6,"lastUpdated":"2026-10-15","tags":["Đăng nhập","Bảng điều khiển","Tổng quan"]},{"id":"sec-02","slug":"02-luong-a-quan-ly-trang","chapterNumber":2,"chapterTitle":"Luồng A: Quản trị trang tĩnh","pageTitle":"Khái niệm, cấu trúc & xuất bản trang","pageSlug":"01-khai-niem-va-cau-truc-trang","summary":"Hướng dẫn tạo lập 4 trang tĩnh tiêu chuẩn: Giới thiệu, Cơ cấu tổ chức, Chức năng nhiệm vụ, Liên hệ.","luong":"A","isVisible":true,"viewCount":3420,"readingTimeMinutes":8,"lastUpdated":"2026-10-16","tags":["Trang tĩnh","Luồng A","Giới thiệu","SEO"]},{"id":"sec-03","slug":"03-luong-b-chuyen-muc-noi-dung","chapterNumber":3,"chapterTitle":"Luồng B: Quản lý chuyên mục & tin bài","pageTitle":"Biên tập tin bài & biểu mẫu PDF","pageSlug":"02-quy-trinh-bien-tap-tin-bai","summary":"Quy chuẩn đăng tải tin tức, phân loại danh mục đa cấp, tải tệp biểu mẫu văn bản PDF công khai.","luong":"B","isVisible":true,"viewCount":4180,"readingTimeMinutes":10,"lastUpdated":"2026-10-16","tags":["Tin tức","Biểu mẫu","PDF","Luồng B"]},{"id":"sec-04","slug":"04-luong-c-menu-dieu-huong","chapterNumber":4,"chapterTitle":"Luồng C: Menu và điều hướng","pageTitle":"Cấu hình Mega Menu & chân trang","pageSlug":"01-cau-hinh-mega-menu-da-cap","summary":"Thiết lập cây menu tối đa 3 cấp, chuẩn hóa liên kết nội bộ relative, cấu hình Footer chuẩn nhận diện.","luong":"C","isVisible":true,"viewCount":2890,"readingTimeMinutes":5,"lastUpdated":"2026-10-14","tags":["Mega Menu","Footer","Điều hướng","Luồng C"]},{"id":"sec-05","slug":"05-quan-tri-he-thong-va-tien-ich","chapterNumber":5,"chapterTitle":"Quản trị hệ thống và tiện ích","pageTitle":"Phân quyền tài khoản & sao lưu","pageSlug":"01-quan-ly-tai-khoan-va-phan-quyen","summary":"Quản lý tài khoản biên tập viên đơn vị, thiết lập bảo mật 2 lớp và cơ chế lưu trữ sao lưu định kỳ.","luong":"HE_THONG","isVisible":true,"viewCount":1750,"readingTimeMinutes":7,"lastUpdated":"2026-10-12","tags":["Phân quyền","Tài khoản","Bảo mật"]},{"id":"sec-06","slug":"06-kiem-tra-va-tro-ly","chapterNumber":6,"chapterTitle":"Trợ lý UTE và kênh hỗ trợ","pageTitle":"Trung tâm xử lý sự cố & phím tắt","pageSlug":"05-trung-tam-xu-ly-su-co","summary":"Danh mục kiểm tra trước nghiệm thu, hotline kỹ thuật Trung tâm TTMT và phím tắt thao tác nhanh.","luong":"TONG_QUAN","isVisible":true,"viewCount":2640,"readingTimeMinutes":6,"lastUpdated":"2026-10-16","tags":["Xử lý sự cố","Checklist","Hotline","Phím tắt"]},{"id":"sec-07","slug":"07-so-do-mermaid-he-thong","chapterNumber":7,"chapterTitle":"Sơ đồ kiến trúc Mermaid","pageTitle":"Sơ đồ luồng tương tác dữ liệu","pageSlug":"index","summary":"Bản đồ kiến trúc tương tác giữa Portal trường, 51 website đơn vị, SSO và máy chủ lưu trữ.","luong":"HE_THONG","isVisible":true,"viewCount":1230,"readingTimeMinutes":4,"lastUpdated":"2026-10-11","tags":["Kiến trúc","Mermaid","Diagram"]},{"id":"sec-08","slug":"08-truy-cap-nhanh-he-thong-website","chapterNumber":8,"chapterTitle":"Hệ thống website đơn vị","pageTitle":"Danh mục truy cập nhanh 51 website","pageSlug":"index","summary":"Bảng tra cứu trực tiếp toàn bộ 51 website thành viên kèm địa chỉ IP, trạng thái và cán bộ phụ trách.","luong":"TONG_QUAN","isVisible":true,"viewCount":2120,"readingTimeMinutes":5,"lastUpdated":"2026-10-16","tags":["51 Website","Đơn vị","Tra cứu nhanh"]}],"units":[{"id":1,"stt":1,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Viện Sư phạm Kỹ thuật","domain":"ite.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":79,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":2,"stt":2,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Phân hiệu Bình Phước","domain":"binhphuoc.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"fail","crit_brand":"fail","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"fail","crit_security":"warning","crit_info":"fail"},"completenessScore":7,"notes":"Tên miền chính: WEB CŨ (404)"},{"id":3,"stt":3,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Điện - Điện tử","domain":"feee.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":4,"stt":4,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Kinh tế","domain":"fe.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":43,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":5,"stt":5,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Cơ khí","domain":"fme.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":6,"stt":6,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Giao thông & NL","domain":"feet.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":7,"stt":7,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Hóa & KH Sự sống","domain":"fcft.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":8,"stt":8,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Công nghệ TT","domain":"fit.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":9,"stt":9,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Xây dựng","domain":"fce.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"fail","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"warning"},"completenessScore":79,"notes":"Tên miền chính: WEB CŨ (404)"},{"id":10,"stt":10,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Đào tạo Tiên tiến","domain":"fae.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":64,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":11,"stt":11,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Chính trị và Luật","domain":"fpi.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":12,"stt":12,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Mỹ thuật & TT","domain":"fam.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"warning","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":57,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":13,"stt":13,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Khoa học Ứng dụng","domain":"fas.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":14,"stt":14,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Khoa Ngoại ngữ","domain":"ffl.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":15,"stt":15,"group":"khoa-vien","groupLabel":"Khoa & Viện đào tạo","name":"Viện Đào tạo Quốc tế","domain":"iie.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":16,"stt":16,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Công tác sinh viên","domain":"sao.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"warning","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":17,"stt":17,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Đào tạo","domain":"aao.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":18,"stt":18,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"P. Đào tạo - VLVH","domain":"nmo.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":64,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":19,"stt":19,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Khảo thí & ĐBCL","domain":"qao.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":64,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":20,"stt":20,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Quan hệ Doanh nghiệp","domain":"pr.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":21,"stt":21,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Quan hệ Quốc tế","domain":"oia.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"fail","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"warning"},"completenessScore":79,"notes":"Tên miền chính: WEB CŨ (NXDOMAIN)"},{"id":22,"stt":22,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng QLĐT XD & Đấu thầu","domain":"cpm.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":23,"stt":23,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Quản trị CSVC","domain":"emo.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":64,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":24,"stt":24,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng QTTH & Truyền thông","domain":"bmc.hcmute.edu.vn","isNewWeb":true,"staff":"Chị Ngân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":25,"stt":25,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Tổ chức – Nhân sự","domain":"tcns.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":64,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":26,"stt":26,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Hành chính – Tổng hợp","domain":"adao.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":71,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":27,"stt":27,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Khoa học Công nghệ","domain":"stiao.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":28,"stt":28,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Phòng Kế hoạch tài chính","domain":"fpo.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"warning","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":29,"stt":29,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Văn phòng Đảng uỷ","domain":"vanphongdanguy.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":30,"stt":30,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Trạm Y tế","domain":"hd.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":31,"stt":31,"group":"phong-ban","groupLabel":"Phòng & Ban chức năng","name":"Ban Quản lý Ký túc xá","domain":"ktx.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":32,"stt":32,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Phòng Thí nghiệm mở","domain":"openlab.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":43,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":33,"stt":33,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Viện Sau đại học","domain":"sdh.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":34,"stt":34,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Thư viện Trường","domain":"lib.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":35,"stt":35,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Trung tâm GD Thể chất","domain":"cped.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":36,"stt":36,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"TT Nghiên cứu NL Tái tạo","domain":"rerc.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"fail","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"fail","crit_security":"pass","crit_info":"fail"},"completenessScore":21,"notes":"Tên miền chính: LỖI IP .188 & 404"},{"id":37,"stt":37,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"TT Sáng tạo Khởi nghiệp","domain":"cisat.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":71,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":38,"stt":38,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Trung tâm TT – Máy tính","domain":"iic.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":39,"stt":39,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Trung tâm Tin học","domain":"trungtamtinhoc.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"warning","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":40,"stt":40,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Trung tâm Ngoại ngữ","domain":"ttnn.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":41,"stt":41,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"TT Học liệu và Dạy học số","domain":"hldhs.hcmute.edu.vn","isNewWeb":false,"staff":"Nhân","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":42,"stt":42,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"TT GD Quốc phòng và AN","domain":"ttgdqpan.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"warning","crit_luong_b":"warning","crit_luong_c":"warning","crit_security":"pass","crit_info":"warning"},"completenessScore":71,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":43,"stt":43,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Trung tâm Robot Thông minh","domain":"smroce.hcmute.edu.vn","isNewWeb":true,"staff":"Phi","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":43,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":44,"stt":44,"group":"trung-tam","groupLabel":"Trung tâm & Viện nghiên cứu","name":"Tạp chí KHGD Kỹ thuật","domain":"jte.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB RIÊNG OJS"},{"id":45,"stt":45,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Công đoàn Trường","domain":"congdoan.hcmute.edu.vn","isNewWeb":true,"staff":"Chị Ngân","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":46,"stt":46,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Đoàn Thanh niên - Hội SV","domain":"tuoitre.hcmute.edu.vn","isNewWeb":false,"staff":"Cal","criteriaRatings":{"crit_dns":"fail","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":29,"notes":"Tên miền chính: SAI IP 45.252..."},{"id":47,"stt":47,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Hội Cựu sinh viên","domain":"alumni.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":43,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":48,"stt":48,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Đào tạo ngắn hạn online","domain":"daotaonganhantructuyen...","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"pass","crit_info":"fail"},"completenessScore":43,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":49,"stt":49,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Đào tạo từ xa","domain":"daotaotuxa.hcmute.edu.vn","isNewWeb":false,"staff":"Phi","criteriaRatings":{"crit_dns":"warning","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":93,"notes":"Tên miền chính: WEB CŨ (.181)"},{"id":50,"stt":50,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Rèn luyện và CTXH","domain":"drlctxh.hcmute.edu.vn","isNewWeb":true,"staff":"Nhân","criteriaRatings":{"crit_dns":"pass","crit_brand":"warning","crit_luong_a":"fail","crit_luong_b":"fail","crit_luong_c":"warning","crit_security":"warning","crit_info":"fail"},"completenessScore":36,"notes":"Tên miền chính: WEB MỚI (.189)"},{"id":51,"stt":51,"group":"doan-the","groupLabel":"Đoàn thể & Khác","name":"Hội đồng Giáo sư cơ sở","domain":"hdgscs.hcmute.edu.vn","isNewWeb":true,"staff":"Cal","criteriaRatings":{"crit_dns":"pass","crit_brand":"pass","crit_luong_a":"pass","crit_luong_b":"pass","crit_luong_c":"pass","crit_security":"pass","crit_info":"pass"},"completenessScore":100,"notes":"Tên miền chính: WEB MỚI (.189)"}]}$SEED$::jsonb;
  v_period_id UUID;
  v_unit JSONB;
  v_crit JSONB;
  v_sec JSONB;
  v_phase JSONB;
  v_phase_idx INT;
  v_unit_id UUID;
  v_rating_id UUID;
  v_crit_key TEXT;
  v_rating_val TEXT;
  v_crit_id UUID;
  v_units_count INT := 0;
  v_items_count INT := 0;
  v_recon RECORD;
  v_discrepancies INT := 0;
  v_pass_count INT := 0;
  v_warn_count INT := 0;
  v_fail_count INT := 0;
BEGIN
  -- 1. Create or Retrieve Initial Evaluation Period (Q4/2026)
  INSERT INTO public.evaluation_periods (slug, title, year, is_active, is_published)
  VALUES ('2026-q4', 'Đợt đánh giá Quý 4/2026', 2026, true, true)
  ON CONFLICT (slug) DO UPDATE SET is_active = true RETURNING id INTO v_period_id;

  -- 2. Populate Evaluation Criteria (7 items)
  FOR v_crit IN SELECT * FROM jsonb_array_elements(v_seed->'criteria') LOOP
    INSERT INTO public.evaluation_criteria (
      code, display_code, title, description, weight,
      pass_condition, warning_condition, fail_condition, is_custom
    ) VALUES (
      v_crit->>'id',
      COALESCE(v_crit->>'code', ''),
      v_crit->>'name',
      v_crit->>'description',
      COALESCE((v_crit->>'weight')::NUMERIC, 15.00),
      v_crit->>'passCondition',
      v_crit->>'warningCondition',
      v_crit->>'failCondition',
      COALESCE((v_crit->>'isCustom')::BOOLEAN, false)
    ) ON CONFLICT (code) DO UPDATE SET
      display_code = EXCLUDED.display_code,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      weight = EXCLUDED.weight,
      pass_condition = EXCLUDED.pass_condition,
      warning_condition = EXCLUDED.warning_condition,
      fail_condition = EXCLUDED.fail_condition,
      updated_at = now();
  END LOOP;

  -- 3. Populate Doc Sections (8 items)
  FOR v_sec IN SELECT * FROM jsonb_array_elements(v_seed->'docSections') LOOP
    INSERT INTO public.doc_sections (
      section_key, slug, chapter_number, chapter_title, page_title,
      summary, luong_type, is_visible, view_count, reading_time_minutes, tags, last_updated
    ) VALUES (
      v_sec->>'id',
      v_sec->>'slug',
      COALESCE((v_sec->>'chapterNumber')::INT, 1),
      COALESCE(v_sec->>'chapterTitle', ''),
      COALESCE(v_sec->>'pageTitle', ''),
      COALESCE(v_sec->>'summary', ''),
      v_sec->>'luong',
      COALESCE((v_sec->>'isVisible')::BOOLEAN, true),
      COALESCE((v_sec->>'viewCount')::INT, 0),
      COALESCE((v_sec->>'readingTimeMinutes')::INT, 1),
      CASE WHEN jsonb_typeof(v_sec->'tags') = 'array'
           THEN ARRAY(SELECT jsonb_array_elements_text(v_sec->'tags'))
           ELSE '{}'::text[] END,
      COALESCE(v_sec->>'lastUpdated', '')
    ) ON CONFLICT (section_key) DO UPDATE SET
      slug = EXCLUDED.slug,
      chapter_number = EXCLUDED.chapter_number,
      chapter_title = EXCLUDED.chapter_title,
      page_title = EXCLUDED.page_title,
      summary = EXCLUDED.summary,
      luong_type = EXCLUDED.luong_type,
      is_visible = EXCLUDED.is_visible,
      view_count = EXCLUDED.view_count,
      reading_time_minutes = EXCLUDED.reading_time_minutes,
      tags = EXCLUDED.tags,
      last_updated = EXCLUDED.last_updated,
      updated_at = now();
  END LOOP;

  -- 4. Populate Project Phases (3 items)
  FOR v_phase, v_phase_idx IN
    SELECT value, ordinality FROM jsonb_array_elements(v_seed->'phases') WITH ORDINALITY
  LOOP
    INSERT INTO public.project_phases (
      phase_number, title, time_frame, target_description, status, completion_rate
    ) VALUES (
      COALESCE((v_phase->>'phaseId')::INT, (v_phase->>'phase_number')::INT, v_phase_idx),
      v_phase->>'title',
      COALESCE(v_phase->>'timeFrame', ''),
      COALESCE(v_phase->>'target', ''),
      v_phase->>'status',
      COALESCE((v_phase->>'completionRate')::NUMERIC, 0.00)
    ) ON CONFLICT (phase_number) DO UPDATE SET
      title = EXCLUDED.title,
      time_frame = EXCLUDED.time_frame,
      target_description = EXCLUDED.target_description,
      status = EXCLUDED.status,
      completion_rate = EXCLUDED.completion_rate,
      updated_at = now();
  END LOOP;

  -- 5. Populate Organizational Units (51 items) & Unit Ratings (51 items + 357 items)
  FOR v_unit IN SELECT * FROM jsonb_array_elements(v_seed->'units') LOOP
    INSERT INTO public.organizational_units (
      legacy_id, sort_order, group_type, group_label, name, domain,
      is_new_web, staff_in_charge
    ) VALUES (
      (v_unit->>'id')::INT,
      COALESCE((v_unit->>'stt')::INT, (v_unit->>'id')::INT),
      v_unit->>'group',
      COALESCE(v_unit->>'groupLabel', ''),
      v_unit->>'name',
      v_unit->>'domain',
      COALESCE((v_unit->>'isNewWeb')::BOOLEAN, false),
      COALESCE(v_unit->>'staff', '')
    ) ON CONFLICT (domain) DO UPDATE SET
      legacy_id = EXCLUDED.legacy_id,
      sort_order = EXCLUDED.sort_order,
      group_type = EXCLUDED.group_type,
      group_label = EXCLUDED.group_label,
      name = EXCLUDED.name,
      is_new_web = EXCLUDED.is_new_web,
      staff_in_charge = EXCLUDED.staff_in_charge,
      updated_at = now()
    RETURNING id INTO v_unit_id;
    v_units_count := v_units_count + 1;

    INSERT INTO public.unit_ratings (
      unit_id, period_id, total_score, admin_notes, is_published
    ) VALUES (
      v_unit_id,
      v_period_id,
      0.00,
      COALESCE(v_unit->>'notes', ''),
      true
    ) ON CONFLICT (unit_id, period_id) DO UPDATE SET
      admin_notes = EXCLUDED.admin_notes,
      is_published = EXCLUDED.is_published,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    IF v_unit->'criteriaRatings' IS NOT NULL AND jsonb_typeof(v_unit->'criteriaRatings') = 'object' THEN
      FOR v_crit_key, v_rating_val IN SELECT * FROM jsonb_each_text(v_unit->'criteriaRatings') LOOP
        SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = v_crit_key;
        IF v_crit_id IS NOT NULL THEN
          INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
          VALUES (
            v_rating_id,
            v_crit_id,
            v_rating_val,
            COALESCE(v_unit->'criteriaNotes'->>v_crit_key, '')
          ) ON CONFLICT (rating_id, criterion_id) DO UPDATE SET
            rating = EXCLUDED.rating,
            note = EXCLUDED.note,
            updated_at = now();
          v_items_count := v_items_count + 1;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  -- 6. Audit Log
  INSERT INTO public.audit_logs (action, entity_type, entity_id, detail, status_level, source, metadata)
  VALUES (
    'SEED_MIGRATION', 'system', 'iyrahtrfypjbzngmuera',
    format('Seeded %s units, %s rating items', v_units_count, v_items_count),
    'info', 'legacy_import',
    jsonb_build_object('units_count', v_units_count, 'rating_items_count', v_items_count)
  );

  -- 7. Mathematical Reconciliation & Parity Verification
  -- Note: Seed completenessScore was legacy unweighted (equal weight 1/7).
  -- Authoritative normalized source is: unit_rating_items (ratings) + evaluation_criteria (weights).
  -- Database trigger trg_techdocs_recalc_unit_rating_score recalculates r.total_score on every item change.
  FOR v_recon IN
    SELECT
      ou.name,
      ou.legacy_id,
      r.total_score AS actual_score,
      COALESCE(
        ROUND(
          SUM(
            CASE
              WHEN i.rating = 'pass' THEN c.weight
              WHEN i.rating = 'warning' THEN c.weight * 0.5
              ELSE 0
            END
          ) / NULLIF(SUM(c.weight), 0) * 100,
          2
        ),
        0.00
      ) AS expected_weighted_score
    FROM public.organizational_units ou
    JOIN public.unit_ratings r ON r.unit_id = ou.id AND r.period_id = v_period_id
    JOIN public.unit_rating_items i ON i.rating_id = r.id
    JOIN public.evaluation_criteria c ON c.id = i.criterion_id
    GROUP BY ou.id, ou.name, ou.legacy_id, r.total_score
  LOOP
    IF ABS(v_recon.expected_weighted_score - v_recon.actual_score) > 0.01 THEN
      RAISE WARNING 'SCORE MISMATCH unit %: expected %, got %', v_recon.name, v_recon.expected_weighted_score, v_recon.actual_score;
      v_discrepancies := v_discrepancies + 1;
    END IF;
  END LOOP;

  IF v_discrepancies > 0 THEN
    RAISE EXCEPTION 'MIGRATION ABORTED: % score parity discrepancies detected!', v_discrepancies;
  END IF;

  IF v_units_count <> 51 THEN
    RAISE EXCEPTION 'MIGRATION ABORTED: Expected 51 units, inserted %', v_units_count;
  END IF;

  IF v_items_count <> 357 THEN
    RAISE EXCEPTION 'MIGRATION ABORTED: Expected 357 rating items, inserted %', v_items_count;
  END IF;

  -- 8. Verify exact rating item invariant breakdown
  SELECT
    COUNT(*) FILTER (WHERE rating = 'pass'),
    COUNT(*) FILTER (WHERE rating = 'warning'),
    COUNT(*) FILTER (WHERE rating = 'fail')
  INTO v_pass_count, v_warn_count, v_fail_count
  FROM public.unit_rating_items;

  IF v_pass_count <> 209 OR v_warn_count <> 95 OR v_fail_count <> 53 THEN
    RAISE EXCEPTION 'MIGRATION ABORTED: Rating breakdown mismatch! Pass: % (exp 209), Warn: % (exp 95), Fail: % (exp 53)',
      v_pass_count, v_warn_count, v_fail_count;
  END IF;

  RAISE NOTICE 'SUCCESS: Seed data migration verified: 51 units, 357 rating items (209 pass, 95 warn, 53 fail) with ZERO score discrepancies!';
END $$;

COMMIT;
