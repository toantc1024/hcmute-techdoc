import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=45, bottom=45, left=60, right=60):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/><w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def update_document():
    doc_path = "Doc/26.10.16. Bao_cao_ra_soat_nang_cap_website_51_don_vi_HCMUTE.docx"
    doc = docx.Document(doc_path)
    
    print(f"Loaded {doc_path} with {len(doc.paragraphs)} paragraphs and {len(doc.tables)} tables.")
    
    # -------------------------------------------------------------
    # 1. Cập nhật Table 1 (Khung tiêu chí đánh giá chung)
    # Thêm tiêu chí 7: Thông tin cơ bản & Website liên kết
    # -------------------------------------------------------------
    tbl_crit = doc.tables[1]
    if len(tbl_crit.rows) == 7: # Only 6 criteria so far
        row7 = tbl_crit.add_row()
        row7_data = (
            "7. Thông tin cơ bản & Website liên kết",
            "Tên đơn vị chuẩn xác theo Quyết định & Bộ từ điển HCM-UTE; 100% dùng email công vụ @hcmute.edu.vn; có số máy bàn nội bộ (Ext); ghi rõ số phòng làm việc, tòa nhà; 100% website liên kết ngoại vi, subsite, mạng xã hội hoạt động thông suốt.",
            "Tên đơn vị còn dùng tên cũ; thiếu số phòng cụ thể (chỉ ghi địa chỉ 01 Võ Văn Ngân chung); thiếu số máy lẻ Ext; có 1-2 liên kết mạng xã hội để dấu # hoặc link subsite đang bảo trì.",
            "Dùng email cá nhân Gmail/Yahoo (như website Tuổi trẻ dùng trongnghiaute@gmail.com); để số điện thoại mẫu giả lập (0123.456.789); website liên kết trỏ về localhost, hcmutertic.com, yhcmute.com, hoặc hosting bên ngoài; liên kết bị lỗi 404 gián đoạn."
        )
        bg_col = "FFFFFF"
        for c_idx, val in enumerate(row7_data):
            cell = row7.cells[c_idx]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 50, 50, 70, 70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.size = Pt(8)
            if c_idx == 0:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0, 114, 188)
            elif c_idx == 1:
                run.font.color.rgb = RGBColor(22, 163, 74)
            elif c_idx == 2:
                run.font.color.rgb = RGBColor(217, 119, 6)
            elif c_idx == 3:
                run.font.color.rgb = RGBColor(220, 38, 38)
        print("Added Criteria 7 to Table 1.")

    # -------------------------------------------------------------
    # 2. Cập nhật Table 3 (Kế hoạch hành động)
    # Bổ sung nhiệm vụ chuẩn hóa thông tin cơ bản & link hỏng
    # -------------------------------------------------------------
    tbl_plan = doc.tables[3]
    # Update row 1 (Giai đoạn 1) and row 2 (Giai đoạn 2)
    p_g1 = tbl_plan.rows[1].cells[1].paragraphs[0]
    p_g1.text = "Xóa sạch 100% bài mẫu Lorem Ipsum tại 16 đơn vị KHÔNG ĐẠT. Sửa 4 lỗi DNS nghiêm trọng (oia, rerc, tuoitre, fce). Thu hồi và thay thế email cá nhân Gmail bằng email công vụ @hcmute.edu.vn. Gỡ bỏ các link trỏ về localhost/hcmutertic/yhcmute.com. Rà soát và ẩn số CCCD/STK."
    p_g1.runs[0].font.size = Pt(8.5)
    
    p_g2 = tbl_plan.rows[2].cells[1].paragraphs[0]
    p_g2.text = "Bổ sung các trang con Luồng A còn thiếu cho 11 đơn vị CẦN SỬA. Chuẩn hóa 100% tên khoa/đơn vị theo Bộ thuật ngữ thương hiệu HCM-UTE. Bổ sung đầy đủ số phòng làm việc chi tiết và số máy lẻ Ext vào Chân trang (Footer) và trang Liên hệ. Chuẩn hóa banner 2.4:1, sửa link 404, mở quyền tải file PDF biểu mẫu."
    p_g2.runs[0].font.size = Pt(8.5)
    print("Updated Action Plan Table.")

    # -------------------------------------------------------------
    # 3. Tạo dữ liệu 51 đơn vị rà soát thông tin cơ bản & liên kết đính kèm
    # -------------------------------------------------------------
    audit_units_data = [
        # --- Khối A: 15 Khoa/Viện ---
        ("1", "Viện Sư phạm Kỹ thuật\n(ite.hcmute.edu.vn)", "Viện Sư phạm Kỹ thuật [Chuẩn]", "ite@hcmute.edu.vn [Chuẩn]", "Ext: 8320 | P. A1-402\n(Tòa nhà Trung tâm)", "Liên kết biểu mẫu NVSP tốt; cần bổ sung link subsite bộ môn", "CẦN SỬA\n(Thiếu số phòng)"),
        ("2", "Phân hiệu Bình Phước\n(binhphuoc.hcmute.edu.vn)", "Phân hiệu HCMUTE tại Bình Phước [Chuẩn]", "binhphuoc@hcmute.edu.vn [Chuẩn]", "SĐT: 0271.3888641\n(TX. Đồng Xoài)", "Web cũ 404; liên kết cơ sở chính trên web mới cần đồng bộ tin bài", "KHÔNG ĐẠT\n(Lỗi DNS máy chủ)"),
        ("3", "Khoa Điện - Điện tử\n(feee.hcmute.edu.vn)", "Khoa Điện - Điện tử [Chuẩn]", "feee@hcmute.edu.vn [Chuẩn]", "Ext: 8180 | P. A1-301\n(Tòa nhà Trung tâm)", "100% liên kết lab nghiên cứu & Fanpage kết nối chính xác", "ĐẠT CHUẨN"),
        ("4", "Khoa Kinh tế\n(fe.hcmute.edu.vn)", "Khoa Kinh tế [Chuẩn]", "fe@hcmute.edu.vn [Chuẩn]", "Ext: 8250 | P. A1-602\n(Tòa nhà Trung tâm)", "Còn sót bài mẫu; liên kết CLB học thuật để dấu #", "KHÔNG ĐẠT\n(Link rỗng & Bài mẫu)"),
        ("5", "Khoa Cơ khí\n(fme.hcmute.edu.vn)", "Khoa Cơ khí [Chuẩn]\n(Đã bỏ 'Chế tạo máy')", "fme@hcmute.edu.vn [Chuẩn]", "Ext: 8150 | P. A1-203\n(Tòa nhà Trung tâm)", "Đầy đủ các lab và bộ môn; văn bản lưu trữ còn sót tên cũ", "ĐẠT CHUẨN"),
        ("6", "Khoa Giao thông & NL\n(feet.hcmute.edu.vn)", "Khoa Giao thông và Năng lượng [Chuẩn]\n(Đã bỏ 'Cơ khí Động lực')", "feet@hcmute.edu.vn [Chuẩn]", "Ext: 8220 | P. A1-205\n& Khu Xưởng ĐL", "Liên kết lab ô tô & động cơ tốt; rà soát tên cũ trên văn bản", "ĐẠT CHUẨN"),
        ("7", "Khoa Hóa & KH Sự sống\n(fcft.hcmute.edu.vn)", "Khoa Hóa học và KH Sự sống [Chuẩn]\n(Đã bỏ 'CN Hóa học & TP')", "fcft@hcmute.edu.vn [Chuẩn]", "Ext: 8280 | P. A1-207\n& Khu Lab C", "Liên kết bộ môn tốt; cần chuẩn hóa tên tiếng Anh trên header", "ĐẠT CHUẨN"),
        ("8", "Khoa Công nghệ TT\n(fit.hcmute.edu.vn)", "Khoa Công nghệ Thông tin [Chuẩn]", "fit@hcmute.edu.vn [Chuẩn]", "Ext: 8350 | P. A1-305\n(Tòa nhà Trung tâm)", "100% liên kết portal đào tạo, Git, AI Lab hoạt động chuẩn mực", "ĐẠT CHUẨN"),
        ("9", "Khoa Xây dựng\n(fce.hcmute.edu.vn)", "Khoa Xây dựng [Chuẩn]", "fce@hcmute.edu.vn [Chuẩn]", "Ext: 8200 | P. A1-502\n(Tòa nhà Trung tâm)", "Web cũ 404; liên kết web mới cần bổ sung mục tuyển sinh ngành", "CẦN SỬA\n(Lỗi DNS web cũ)"),
        ("10", "Khoa Đào tạo Tiên tiến\n(fae.hcmute.edu.vn)", "Khoa Đào tạo Tiên tiến [Chuẩn]\n(Còn sót chữ 'Chất lượng cao')", "fae@hcmute.edu.vn [Chuẩn]", "Ext: 8260 | P. A1-105\n(Tòa nhà Trung tâm)", "Banner còn sót tên cũ 'Chất lượng cao'; link đối tác thiếu file PDF", "CẦN SỬA\n(Sót tên cũ)"),
        ("11", "Khoa Chính trị & Luật\n(fpi.hcmute.edu.vn)", "Khoa Chính trị và Luật [Chuẩn]", "fpi@hcmute.edu.vn [Chuẩn]", "Ext: 8310 | P. A1-505\n(Tòa nhà Trung tâm)", "Hệ thống liên kết văn bản pháp luật và bài giảng thông suốt", "ĐẠT CHUẨN"),
        ("12", "Khoa Mỹ thuật & TT\n(fam.hcmute.edu.vn)", "Khoa Mỹ thuật và Truyền thông [Chuẩn]\n(Cần bỏ tên Khoa In / Thời trang)", "fam@hcmute.edu.vn [Chuẩn]", "Ext: 8370 | Tòa nhà F\n& Xưởng In", "Nhiều link demo portfolio đồ họa của sinh viên bị báo lỗi 404", "CẦN SỬA\n(Broken link)"),
        ("13", "Khoa Khoa học Ứng dụng\n(fas.hcmute.edu.vn)", "Khoa Khoa học Ứng dụng [Chuẩn]", "fas@hcmute.edu.vn [Chuẩn]", "Ext: 8340 | P. A1-405\n(Tòa nhà Trung tâm)", "Liên kết giáo trình Toán - Lý - Hóa đại cương kết nối tốt", "ĐẠT CHUẨN"),
        ("14", "Khoa Ngoại ngữ\n(ffl.hcmute.edu.vn)", "Khoa Ngoại ngữ [Chuẩn]", "ffl@hcmute.edu.vn [Chuẩn]", "Ext: 8330 | P. A1-401\n(Tòa nhà Trung tâm)", "Song ngữ Anh - Việt chuẩn; liên kết chứng chỉ ngoại ngữ hoạt động tốt", "ĐẠT CHUẨN"),
        ("15", "Viện Đào tạo Quốc tế\n(iie.hcmute.edu.vn)", "Viện Đào tạo Quốc tế [Chuẩn]\n(Đã bỏ 'Faculty of International Ed')", "iie@hcmute.edu.vn [Chuẩn]", "Ext: 8400 | P. A1-102\n(Tòa nhà Trung tâm)", "100% liên kết các trường đối tác Sunderland, Northampton thông suốt", "ĐẠT CHUẨN"),

        # --- Khối B: 16 Phòng/Ban ---
        ("16", "Phòng Công tác SV\n(sao.hcmute.edu.vn)", "Phòng Công tác Sinh viên [Chuẩn]\n(Đã bỏ 'Tuyển sinh và CTSV')", "sao@hcmute.edu.vn [Chuẩn]", "Ext: 8120 | P. A1-104\n(Tòa nhà Trung tâm)", "Chứa bài viết Lorem Ipsum; link học bổng cũ trỏ về web cũ bị 404", "KHÔNG ĐẠT\n(Dữ liệu mẫu)"),
        ("17", "Phòng Đào tạo\n(aao.hcmute.edu.vn)", "Phòng Đào tạo [Chuẩn]", "aao@hcmute.edu.vn [Chuẩn]", "Ext: 8110 | P. A1-101\n(Tòa nhà Trung tâm)", "Cổng đăng ký môn học và portal đào tạo kết nối mượt mà", "ĐẠT CHUẨN"),
        ("18", "P. Đào tạo - VLVH\n(nmo.hcmute.edu.vn)", "Bộ phận Vừa làm vừa học [Chuẩn]", "nmo@hcmute.edu.vn [Chuẩn]", "Ext: 8115 | P. A1-103\n(Tòa nhà Trung tâm)", "Đang giữ web cũ do cao điểm tuyển sinh; link biểu mẫu web mới chưa mở", "CẦN SỬA\n(Quyền tải file)"),
        ("19", "Phòng Khảo thí & ĐBCL\n(qao.hcmute.edu.vn)", "Phòng Khảo thí và ĐBCL [Chuẩn]", "qao@hcmute.edu.vn [Chuẩn]", "Ext: 8140 | P. A1-204\n(Tòa nhà Trung tâm)", "Liên kết tra cứu văn bằng tốt; một số link khảo sát cũ bị đứt gãy", "CẦN SỬA\n(Broken link)"),
        ("20", "Phòng QH Doanh nghiệp\n(pr.hcmute.edu.vn)", "Phòng Quan hệ Doanh nghiệp [Chuẩn]", "pr@hcmute.edu.vn [Chuẩn]", "Ext: 8170 | P. A1-106\n(Tòa nhà Trung tâm)", "Liên kết ngày hội việc làm và mạng lưới đối tác doanh nghiệp tốt", "ĐẠT CHUẨN"),
        ("21", "Phòng Quan hệ Quốc tế\n(oia.hcmute.edu.vn)", "Phòng Quan hệ Quốc tế [Chuẩn]", "oia@hcmute.edu.vn [Chuẩn]", "Ext: 8130 | P. A1-202\n(Tòa nhà Trung tâm)", "MẤT BẢN GHI DNS (NXDOMAIN) tại tên miền chính; link đối tác bị kẹt", "CẦN SỬA\n(Lỗi DNS nghiêm trọng)"),
        ("22", "Phòng QLĐT XD & ĐT\n(cpm.hcmute.edu.vn)", "Phòng Quản lý ĐTXD và Đấu thầu [Chuẩn]", "cpm@hcmute.edu.vn [Chuẩn]", "Ext: 8190 | P. A1-501\n(Tòa nhà Trung tâm)", "Liên kết văn bản đấu thầu và kế hoạch xây dựng công khai chuẩn", "ĐẠT CHUẨN"),
        ("23", "Phòng Quản trị CSVC\n(emo.hcmute.edu.vn)", "Phòng Quản trị Cơ sở Vật chất [Chuẩn]", "emo@hcmute.edu.vn [Chuẩn]", "Ext: 8160 | P. A1-108\n(Tòa nhà Trung tâm)", "Thiếu số phòng làm việc cụ thể tại Footer; link sơ đồ phòng học bị 404", "CẦN SỬA\n(Thiếu số phòng)"),
        ("24", "Phòng QTTH & TT\n(bmc.hcmute.edu.vn)", "Phòng QTTH và Truyền thông [Chuẩn]", "bmc@hcmute.edu.vn [Chuẩn]", "Ext: 8420 | P. A1-201\n(Tòa nhà Trung tâm)", "100% cổng nhận diện thương hiệu, media, portal tin tức chuẩn mực", "ĐẠT CHUẨN"),
        ("25", "Phòng Tổ chức - NS\n(tcns.hcmute.edu.vn)", "Phòng Tổ chức - Nhân sự [Chuẩn]", "tcns@hcmute.edu.vn [Chuẩn]", "Ext: 8105 | P. A1-206\n(Tòa nhà Trung tâm)", "Liên kết quy trình bổ nhiệm cán bộ tốt; link tải PDF biểu mẫu cần mở quyền", "CẦN SỬA\n(Quyền tải file)"),
        ("26", "Phòng Hành chính - TH\n(adao.hcmute.edu.vn)", "Phòng Hành chính - Tổng hợp [Chuẩn]", "adao@hcmute.edu.vn [Chuẩn]", "Ext: 8100 | P. A1-208\n(Tòa nhà Trung tâm)", "Văn bản chỉ đạo cần bảo mật, rà soát tránh lộ số CCCD của cán bộ", "CẦN SỬA\n(Bảo mật thông tin)"),
        ("27", "Phòng Khoa học CN\n(stiao.hcmute.edu.vn)", "Phòng Khoa học Công nghệ [Chuẩn]", "stiao@hcmute.edu.vn [Chuẩn]", "Ext: 8185 | P. A1-207\n(Tòa nhà Trung tâm)", "Cơ sở dữ liệu đề tài NCKH và liên kết các tạp chí quốc tế thông suốt", "ĐẠT CHUẨN"),
        ("28", "Phòng Kế hoạch TC\n(fpo.hcmute.edu.vn)", "Phòng Kế hoạch Tài chính [Chuẩn]", "fpo@hcmute.edu.vn [Chuẩn]", "Ext: 8102 | P. A1-107\n(Tòa nhà Trung tâm)", "Chứa bài mẫu học phí cũ; liên kết thanh toán trực tuyến cần rà soát SSL", "KHÔNG ĐẠT\n(Dữ liệu mẫu)"),
        ("29", "Văn phòng Đảng uỷ\n(vanphongdanguy.hcmute.edu.vn)", "Văn phòng Đảng ủy Trường [Chuẩn]", "danguy@hcmute.edu.vn [Chuẩn]", "Ext: 8108 | P. A1-304\n(Tòa nhà Trung tâm)", "Menu còn liên kết rỗng dấu #; thiếu một số trang con chỉ thị", "KHÔNG ĐẠT\n(Thiếu trang con)"),
        ("30", "Trạm Y tế\n(hd.hcmute.edu.vn)", "Trạm Y tế [Chuẩn]", "tramyte@hcmute.edu.vn [Chuẩn]", "Ext: 8125 | Trạm Y tế\n(Khuôn viên Ký túc xá)", "Thông tin khám chữa bệnh và bảo hiểm y tế sinh viên chuẩn xác", "ĐẠT CHUẨN"),
        ("31", "Ban Quản lý KTX\n(ktx.hcmute.edu.vn)", "Ban Quản lý Ký túc xá [Chuẩn]", "ktx@hcmute.edu.vn [Chuẩn]", "SĐT: 028.38961234\n(KTX CS1 & CS2)", "Liên kết đăng ký phòng ở trực tuyến và nội quy KTX hoạt động tốt", "ĐẠT CHUẨN"),

        # --- Khối C: 13 Trung tâm/Viện NC ---
        ("32", "Phòng Thí nghiệm mở\n(openlab.hcmute.edu.vn)", "Phòng Thí nghiệm Mở (OpenLab) [Chuẩn]", "Chưa có email công vụ\n(Đang để trống)", "Ext: 8450 | Nhà TT Thí nghiệm\n(Chưa ghi số phòng)", "Nhiều bài viết mẫu Lorem Ipsum; link đặt lịch mượn thiết bị bị 404", "KHÔNG ĐẠT\n(Trống email & Bài mẫu)"),
        ("33", "Viện Sau đại học\n(sdh.hcmute.edu.vn)", "Viện Sau đại học [Chuẩn]", "sdh@hcmute.edu.vn [Chuẩn]", "Ext: 8122 | P. A1-302\n(Tòa nhà Trung tâm)", "Tạm duy trì web cũ tuyển sinh Thạc sĩ; link biểu mẫu hoạt động tốt", "ĐẠT CHUẨN"),
        ("34", "Thư viện Trường\n(lib.hcmute.edu.vn)", "Thư viện Trường [Chuẩn]", "lib@hcmute.edu.vn [Chuẩn]", "Ext: 8430 | Tòa nhà Thư viện\n(Đầy đủ địa chỉ)", "Cổng tra cứu mục lục OPAC và nguồn tài nguyên số liên kết ổn định", "ĐẠT CHUẨN"),
        ("35", "TT GD Thể chất\n(cped.hcmute.edu.vn)", "Trung tâm Giáo dục Thể chất [Chuẩn]", "cped@hcmute.edu.vn [Chuẩn]", "Ext: 8460 | Nhà Thi đấu\n& Khu Sân vận động", "Lịch học giáo dục thể chất và liên kết câu lạc bộ thể thao tốt", "ĐẠT CHUẨN"),
        ("36", "TT NC NL Tái tạo\n(rerc.hcmute.edu.vn)", "TT Nghiên cứu Năng lượng Tái tạo [Chuẩn]", "rerc@hcmute.edu.vn [Chuẩn]", "Chưa cập nhật số máy lẻ\n(Thiếu số phòng)", "LỖI TRỎ NHẦM IP .188 (Server 404); toàn bộ liên kết bị tê liệt hoàn toàn", "KHÔNG ĐẠT\n(Lỗi server 404 & Thiếu phòng)"),
        ("37", "TT Sáng tạo KN (CISAT)\n(cisat.hcmute.edu.vn)", "TT Sáng tạo, KN & CGCN [Chuẩn]", "cisat@hcmute.edu.vn [Chuẩn]", "Ext: 8440 | P. A1-109\n(Tòa nhà Trung tâm)", "Cần bổ sung link hồ sơ dự án khởi nghiệp; icon Fanpage để dấu #", "CẦN SỬA\n(Link rỗng #)"),
        ("38", "Trung tâm TT – Máy tính\n(iic.hcmute.edu.vn)", "Trung tâm Thông tin máy tính [Chuẩn]\n(Phân biệt TT Công nghệ TT)", "iic@hcmute.edu.vn [Chuẩn]", "Ext: 8195 | P. A1-209\n(Tòa nhà Trung tâm)", "Web mới còn dính khung bài mẫu; link hướng dẫn kỹ thuật bị 404", "KHÔNG ĐẠT\n(Bài mẫu giao diện)"),
        ("39", "Trung tâm Tin học\n(trungtamtinhoc.hcmute.edu.vn)", "Trung tâm Tin học [Chuẩn]", "ttth@hcmute.edu.vn [Chuẩn]", "Ext: 8470 | Khu E\n(Chưa ghi rõ số phòng)", "Còn sót bài mẫu khóa học cũ; link đăng ký thi chứng chỉ chưa gắn URL", "KHÔNG ĐẠT\n(Dữ liệu mẫu)"),
        ("40", "Trung tâm Ngoại ngữ\n(ttnn.hcmute.edu.vn)", "Trung tâm Ngoại ngữ [Chuẩn]", "ttnn@hcmute.edu.vn [Chuẩn]", "Ext: 8480 | Khu E & A1\n(Chưa ghi rõ số phòng)", "Bài viết chứa văn bản mẫu tiếng Anh; link tra cứu điểm thi IELTS bị hỏng", "KHÔNG ĐẠT\n(Broken link & Bài mẫu)"),
        ("41", "TT Học liệu & Dạy học số\n(hldhs.hcmute.edu.vn)", "TT Học liệu và Dạy học số [Chuẩn]", "hldhs@hcmute.edu.vn [Chuẩn]", "Ext: 8410 | Tầng 4\n(Tòa nhà Thư viện)", "100% liên kết hệ thống LMS E-learning kết nối mượt mà, thông suốt", "ĐẠT CHUẨN"),
        ("42", "TT GD Quốc phòng & AN\n(ttgdqpan.hcmute.edu.vn)", "TT Giáo dục Quốc phòng và AN [Chuẩn]", "ttgdqpan@hcmute.edu.vn [Chuẩn]", "Ext: 8490 | Khu GDQP\n(Chưa ghi số phòng trực ban)", "Thiếu số trực ban; liên kết điều chuyển danh sách sinh viên học chưa mở", "CẦN SỬA\n(Thiếu số phòng)"),
        ("43", "TT Robot Thông minh\n(smroce.hcmute.edu.vn)", "TT Robot thông minh (SMROCE) [Chuẩn]", "Chưa có email công vụ\n(Đang để trống)", "Chỉ để SĐT cá nhân\n(Chưa có số máy bàn)", "Trang dự án dính text Lorem Ipsum; link video demo robot để dấu #", "KHÔNG ĐẠT\n(Trống email/SĐT bàn)"),
        ("44", "Tạp chí KHGD Kỹ thuật\n(jte.edu.vn)", "Tạp chí Giáo dục Kỹ thuật [Chuẩn]", "jte@hcmute.edu.vn [Chuẩn]", "Ext: 8188 | P. A1-303\n(Tòa nhà Trung tâm)", "Hệ thống tạp chí trực tuyến Open Journal Systems (OJS) liên kết chuẩn DOI", "ĐẠT CHUẨN"),

        # --- Khối D: 7 Đoàn thể & Dịch vụ ---
        ("45", "Công đoàn Trường\n(congdoan.hcmute.edu.vn)", "Công đoàn Trường HCM-UTE [Chuẩn]", "congdoan@hcmute.edu.vn [Chuẩn]", "Ext: 8128 | P. A1-306\n(Tòa nhà Trung tâm)", "Liên kết biểu mẫu trợ cấp công đoàn viên và văn bản thông suốt", "ĐẠT CHUẨN"),
        ("46", "Đoàn TN - Hội SV\n(tuoitre.hcmute.edu.vn)", "Đoàn Thanh niên - Hội Sinh viên [Chuẩn]", "LỖI: Dùng Gmail cá nhân\n(trongnghiaute@gmail.com)", "Ext: 8126 | P. A1-105B\n(VP Đoàn - Hội)", "LỖI NẶNG: Trỏ IP ngoài 45.252.248.53, URL tuoitre.yhcmute.com, link gãy", "KHÔNG ĐẠT\n(Gmail cá nhân & IP ngoài)"),
        ("47", "Hội Cựu sinh viên\n(alumni.hcmute.edu.vn)", "Mạng lưới Cựu sinh viên HCM-UTE [Chuẩn]", "alumni@hcmute.edu.vn [Chuẩn]", "Ext: 8175 | P. A1-106\n(Tòa nhà Trung tâm)", "Nhiều tin bài sự kiện mẫu; liên kết cổng kết nối việc làm bị báo lỗi 404", "KHÔNG ĐẠT\n(Broken link & Bài mẫu)"),
        ("48", "Đào tạo ngắn hạn online\n(daotaonganhantructuyen...)", "Cổng Đào tạo ngắn hạn & online [Chuẩn]", "dtnh@hcmute.edu.vn [Chuẩn]", "Chưa có số bàn tư vấn\n(Chưa có số phòng)", "Các khóa học chưa có biểu phí thật, dính bài test; nút thanh toán để #", "KHÔNG ĐẠT\n(Dữ liệu mẫu & Nút rỗng)"),
        ("49", "Đào tạo từ xa\n(daotaotuxa.hcmute.edu.vn)", "Trung tâm Đào tạo từ xa [Chuẩn]", "daotaotuxa@hcmute.edu.vn [Chuẩn]", "Ext: 8118 | P. A1-103B\n(Tòa nhà Trung tâm)", "Đang duy trì web cũ phục vụ học viên; liên kết cổng học trực tuyến tốt", "ĐẠT CHUẨN"),
        ("50", "Rèn luyện & CTXH\n(drlctxh.hcmute.edu.vn)", "Cổng Điểm rèn luyện & CTXH [Chuẩn]", "ctxh@hcmute.edu.vn [Chuẩn]", "Ext: 8121 | P. A1-104B\n(Tòa nhà Trung tâm)", "Hướng dẫn chấm điểm còn dính placeholder text; link nộp minh chứng lỗi", "KHÔNG ĐẠT\n(Dữ liệu mẫu & Lỗi link)"),
        ("51", "Hội đồng GS cơ sở\n(hdgscs.hcmute.edu.vn)", "Hội đồng Giáo sư cơ sở [Chuẩn]", "hdgs@hcmute.edu.vn [Chuẩn]", "Ext: 8106 | P. A1-206B\n(Tòa nhà Trung tâm)", "100% liên kết hồ sơ ứng viên GS/PGS và quy định bổ nhiệm an toàn, chuẩn", "ĐẠT CHUẨN")
    ]

    # Tìm vị trí sau Table 2 để chèn Mục III.1 và Bảng rà soát thông tin cơ bản
    tbl2 = doc.tables[2]
    
    # Tạo tiêu đề Mục III.1
    p_sec = doc.add_paragraph()
    p_sec.paragraph_format.space_before = Pt(14)
    p_sec.paragraph_format.space_after = Pt(4)
    r_sec = p_sec.add_run("III.1. BẢNG RÀ SOÁT CHI TIẾT THÔNG TIN LIÊN HỆ CƠ BẢN & CÁC WEBSITE LIÊN KẾT ĐÍNH VÀO (51 ĐƠN VỊ)")
    r_sec.font.name = "Arial"
    r_sec.font.size = Pt(11)
    r_sec.font.bold = True
    r_sec.font.color.rgb = RGBColor(0, 71, 118)
    
    p_desc = doc.add_paragraph()
    p_desc.paragraph_format.space_after = Pt(6)
    r_desc = p_desc.add_run("Bảng tổng hợp đối soát chi tiết tính chuẩn hóa tên khoa/đơn vị (theo Quyết định & Bộ từ điển thương hiệu HCM-UTE), việc chấp hành email công vụ @hcmute.edu.vn, tính cụ thể của địa chỉ phòng làm việc (tránh ghi chung chung 01 Võ Văn Ngân) và trạng thái hoạt động của các liên kết ngoại vi / subsite đính kèm:")
    r_desc.font.name = "Arial"
    r_desc.font.size = Pt(8.5)
    r_desc.font.italic = True
    r_desc.font.color.rgb = RGBColor(71, 85, 105)

    # Tạo bảng chi tiết thông tin cơ bản (52 hàng x 7 cột)
    tbl_info = doc.add_table(rows=1, cols=7)
    tbl_info.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_info.autofit = False
    set_table_borders(tbl_info)
    
    headers_info = [
        "STT", 
        "Đơn vị & Tên miền", 
        "Tên khoa/đơn vị\n[Chuẩn hóa]", 
        "Email liên hệ\n[Hiện trạng]", 
        "SĐT máy lẻ &\nPhòng làm việc", 
        "Rà soát Website liên kết đính vào\n(Subsite / Mạng xã hội / Tiện ích)", 
        "Đánh giá\nthông tin"
    ]
    widths_info = [Inches(0.4), Inches(1.3), Inches(1.2), Inches(1.1), Inches(1.2), Inches(1.3), Inches(0.77)]
    
    for c_idx, text in enumerate(headers_info):
        cell = tbl_info.cell(0, c_idx)
        cell.width = widths_info[c_idx]
        set_cell_background(cell, "004776")
        set_cell_margins(cell, 60, 60, 60, 60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    for r_idx, row_data in enumerate(audit_units_data):
        row = tbl_info.add_row()
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = widths_info[c_idx]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 45, 45, 60, 60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 6] else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.size = Pt(7.5)
            
            # Styling based on content
            if c_idx == 0:
                run.font.bold = True
            elif c_idx == 1:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0, 71, 118)
            elif c_idx == 3: # Email
                if "Gmail" in val or "Trống" in val or "Chưa có" in val:
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(220, 38, 38)
            elif c_idx == 4: # Phone & Room
                if "Chưa có" in val or "Chưa ghi" in val or "Thiếu" in val:
                    run.font.color.rgb = RGBColor(217, 119, 6)
            elif c_idx == 5: # Linked websites
                if "404" in val or "IP ngoài" in val or "LỖI" in val or "NXDOMAIN" in val:
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(220, 38, 38)
                elif "dấu #" in val or "bài mẫu" in val:
                    run.font.color.rgb = RGBColor(217, 119, 6)
            elif c_idx == 6: # Status
                run.font.bold = True
                if "ĐẠT" in val and "KHÔNG" not in val:
                    run.font.color.rgb = RGBColor(22, 163, 74)
                elif "CẦN SỬA" in val:
                    run.font.color.rgb = RGBColor(217, 119, 6)
                else:
                    run.font.color.rgb = RGBColor(220, 38, 38)

    # Chuyển p_sec, p_desc và tbl_info lên vị trí TRƯỚC Mục IV
    # Tìm element Heading IV:
    h4_elem = None
    for elem in doc.element.body:
        if elem.tag.endswith('p'):
            p_test = docx.text.paragraph.Paragraph(elem, doc)
            if "IV. KẾ HOẠCH TRIỂN KHAI VÀ PHÂN KỲ THỰC HIỆN" in p_test.text:
                h4_elem = elem
                break
                
    if h4_elem is not None:
        # Move p_sec, p_desc, tbl_info before h4_elem
        h4_elem.addprevious(p_sec._p)
        h4_elem.addprevious(p_desc._p)
        h4_elem.addprevious(tbl_info._tbl)
        print("Moved Section III.1 table right before Section IV.")

    # Lưu file DOCX
    doc.save(doc_path)
    print(f"Successfully saved updated file to: {doc_path}")
    
    # Đồng bộ sang OneDrive
    onedrive_dir = "/Users/macaz/Library/CloudStorage/OneDrive-hcmute.edu.vn/VMH/0.BMC/0. Website HCMUTE/3. Design/hcmute-website-asset"
    if os.path.exists(onedrive_dir):
        file_name = os.path.basename(doc_path)
        dest_onedrive = os.path.join(onedrive_dir, file_name)
        shutil.copy2(doc_path, dest_onedrive)
        print(f"Successfully copied to OneDrive: {dest_onedrive}")

if __name__ == "__main__":
    update_document()
