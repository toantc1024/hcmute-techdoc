#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo biểu đồ phân tích chuyên nghiệp và cập nhật file DOCX báo cáo rà soát 51 website HCM-UTE.
Bảo toàn các chỉnh sửa của người dùng (tiêu đề, hạn chót), bổ sung biểu đồ Dashboard,
ghi chú rõ website có tên miền chính là Web Cũ, và thêm cột cán bộ phụ trách.
"""

import os
import shutil
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_charts(output_dir="Doc"):
    os.makedirs(output_dir, exist_ok=True)
    
    # -------------------------------------------------------------------------
    # BIỂU ĐỒ 1: DASHBOARD CHUYỂN ĐỔI & CHẤT LƯỢNG KIỂM ĐỊNH (DÙNG CHO PHẦN I)
    # -------------------------------------------------------------------------
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.8), dpi=300)
    plt.subplots_adjust(wspace=0.35)
    
    # Chart 1A: Donut Chart - Tỷ lệ chuyển đổi tên miền
    labels_dns = ['Website MỚI\n(IP .189)', 'Website CŨ\n(IP .181)']
    sizes_dns = [25, 26]
    colors_dns = ['#0072BC', '#94A3B8']
    explode_dns = (0.05, 0)
    
    import matplotlib.patheffects as pe
    wedges, texts, autotexts = ax1.pie(
        sizes_dns, 
        explode=explode_dns, 
        labels=labels_dns, 
        autopct='%1.1f%%',
        pctdistance=0.76,
        startangle=140, 
        colors=colors_dns,
        textprops={'fontsize': 10, 'weight': 'bold', 'color': '#1E293B'},
        wedgeprops=dict(width=0.46, edgecolor='white', linewidth=2.5)
    )
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(11)
        autotext.set_weight('bold')
        autotext.set_path_effects([pe.withStroke(linewidth=2, foreground='#004776')])
        
    ax1.set_title('TỶ LỆ CHUYỂN ĐỔI TÊN MIỀN CHÍNH THỨC\n(Tổng số 51 Website)', fontsize=11, fontweight='bold', color='#004776', pad=12)
    ax1.text(0, 0, '51\nWebsite', ha='center', va='center', fontsize=13, fontweight='bold', color='#004776')
    
    # Chart 1B: Bar Chart - Kết quả kiểm định chất lượng
    categories = ['ĐẠT CHUẨN\n(Cấp 1)', 'CẦN CHỈNH SỬA\n(Cấp 2 / Lỗi nhẹ)', 'KHÔNG ĐẠT\n(Cấp 3 / Bài mẫu)']
    counts = [24, 11, 16]
    percentages = [47.1, 21.6, 31.4]
    bar_colors = ['#10B981', '#F59E0B', '#EF4444']
    
    bars = ax2.bar(categories, counts, color=bar_colors, width=0.55, edgecolor='none', zorder=3)
    ax2.set_title('KẾT QUẢ ĐỐI SOÁT CHẤT LƯỢNG THEO TIÊU CHÍ\n(Đạt - Cần sửa - Không đạt)', fontsize=11, fontweight='bold', color='#004776', pad=12)
    ax2.set_ylabel('Số lượng Website', fontsize=10, fontweight='bold', color='#475569')
    ax2.set_ylim(0, 30)
    ax2.grid(axis='y', linestyle='--', alpha=0.5, zorder=0)
    ax2.tick_params(axis='x', labelsize=9.5)
    
    for bar, count, pct in zip(bars, counts, percentages):
        yval = bar.get_height()
        ax2.text(
            bar.get_x() + bar.get_width()/2.0, 
            yval + 0.8, 
            f'{count} web\n({pct}%)', 
            ha='center', 
            va='bottom', 
            fontsize=9.5, 
            fontweight='bold',
            color='#1E293B'
        )
        
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)
    ax2.spines['left'].set_color('#CBD5E1')
    ax2.spines['bottom'].set_color('#CBD5E1')
    
    chart1_path = os.path.join(output_dir, "chart_dashboard_51_web.png")
    plt.tight_layout()
    plt.savefig(chart1_path, dpi=300)
    plt.close()
    print(f"Created Chart 1: {chart1_path}")
    
    # -------------------------------------------------------------------------
    # BIỂU ĐỒ 2: PHÂN BỔ CÔNG VIỆC CÁN BỘ & TỶ LỆ THEO 4 KHỐI ĐƠN VỊ
    # -------------------------------------------------------------------------
    fig2, (ax21, ax22) = plt.subplots(1, 2, figsize=(11, 4.8), dpi=300)
    plt.subplots_adjust(wspace=0.35)
    
    # Chart 2A: Phân bổ khối lượng theo cán bộ phụ trách
    staffs = ['A. Phi\n(15 web)', 'Cal\n(16 web)', 'Nhân\n(16 web)', 'Chị Ngân\n(2 web)']
    pass_cnt = np.array([6, 7, 9, 2])
    edit_cnt = np.array([4, 3, 4, 0])
    fail_cnt = np.array([5, 6, 3, 0])
    
    w = 0.5
    ax21.bar(staffs, pass_cnt, width=w, label='Đạt chuẩn', color='#10B981', zorder=3)
    ax21.bar(staffs, edit_cnt, width=w, bottom=pass_cnt, label='Cần sửa', color='#F59E0B', zorder=3)
    ax21.bar(staffs, fail_cnt, width=w, bottom=pass_cnt+edit_cnt, label='Không đạt', color='#EF4444', zorder=3)
    
    ax21.set_title('KHỐI LƯỢNG CÔNG VIỆC THEO CÁN BỘ PHỤ TRÁCH\n(Phân công hỗ trợ đơn vị)', fontsize=11, fontweight='bold', color='#004776', pad=12)
    ax21.set_ylabel('Số lượng Website phụ trách', fontsize=10, fontweight='bold', color='#475569')
    ax21.set_ylim(0, 20)
    ax21.grid(axis='y', linestyle='--', alpha=0.5, zorder=0)
    ax21.legend(loc='upper right', fontsize=8.5, framealpha=0.9)
    ax21.spines['top'].set_visible(False)
    ax21.spines['right'].set_visible(False)
    ax21.spines['left'].set_color('#CBD5E1')
    ax21.spines['bottom'].set_color('#CBD5E1')
    
    # Chart 2B: Tỷ lệ chất lượng theo 4 khối đơn vị
    groups = ['Khối Khoa/Viện (15)', 'Khối Phòng Ban (16)', 'Khối Trung tâm (13)', 'Khối Đoàn thể (7)']
    g_pass = np.array([9, 9, 4, 2])
    g_edit = np.array([4, 4, 2, 1])
    g_fail = np.array([2, 3, 7, 4])
    
    y_pos = np.arange(len(groups))
    h = 0.55
    ax22.barh(y_pos, g_pass, height=h, label='Đạt', color='#10B981', zorder=3)
    ax22.barh(y_pos, g_edit, height=h, left=g_pass, label='Cần sửa', color='#F59E0B', zorder=3)
    ax22.barh(y_pos, g_fail, height=h, left=g_pass+g_edit, label='Không đạt', color='#EF4444', zorder=3)
    
    ax22.set_yticks(y_pos)
    ax22.set_yticklabels(groups, fontsize=9, fontweight='bold')
    ax22.invert_yaxis()
    ax22.set_title('TỶ LỆ CHẤT LƯỢNG THEO 4 KHỐI ĐƠN VỊ\n(Nhận diện khu vực cần hỗ trợ gấp)', fontsize=11, fontweight='bold', color='#004776', pad=12)
    ax22.set_xlabel('Số lượng Website', fontsize=10, fontweight='bold', color='#475569')
    ax22.set_xlim(0, 18)
    ax22.grid(axis='x', linestyle='--', alpha=0.5, zorder=0)
    ax22.legend(loc='lower right', fontsize=8.5, framealpha=0.9)
    ax22.spines['top'].set_visible(False)
    ax22.spines['right'].set_visible(False)
    ax22.spines['left'].set_color('#CBD5E1')
    ax22.spines['bottom'].set_color('#CBD5E1')
    
    chart2_path = os.path.join(output_dir, "chart_workload_and_blocks.png")
    plt.tight_layout()
    plt.savefig(chart2_path, dpi=300)
    plt.close()
    print(f"Created Chart 2: {chart2_path}")
    
    # -------------------------------------------------------------
    # Chart 3: Biểu đồ 6 nhóm vấn đề kỹ thuật trọng yếu
    # -------------------------------------------------------------
    fig3, ax3 = plt.subplots(figsize=(10.5, 4.8), dpi=300)
    fig3.patch.set_facecolor('#FFFFFF')
    plt.subplots_adjust(left=0.34, right=0.92, top=0.86, bottom=0.12)

    issues = [
        '1. Chưa cấu hình SEO On-page / Sitemap',
        '2. Dung lượng ảnh quá tải (>2MB) / Chưa nén',
        '3. Header / Footer lệch chuẩn nhận diện',
        '4. Đứt gãy liên kết (Broken Links / Lỗi 404)',
        '5. Tồn đọng dữ liệu mẫu (Lorem Ipsum / EN)',
        '6. Lỗi DNS / Tên miền / Kẹt trỏ IP máy chủ'
    ]
    percentages = [78.4, 66.7, 54.9, 45.1, 31.4, 13.7]
    counts = [40, 34, 28, 23, 16, 7]
    colors_issues = ['#2563EB', '#4F46E5', '#D97706', '#EA580C', '#DC2626', '#B91C1C']
    priority_tags = ['[P3 - Tối ưu]', '[P2 - Trọng tâm]', '[P2 - Trọng tâm]', '[P2 - Trọng tâm]', '[P1 - CẤP BÁCH]', '[P1 - CẤP BÁCH]']

    y_pos = np.arange(len(issues))
    bars = ax3.barh(y_pos, percentages, height=0.52, color=colors_issues, zorder=3)
    ax3.set_yticks(y_pos)
    ax3.set_yticklabels(issues, fontsize=9, fontweight='bold', color='#1E293B')
    ax3.invert_yaxis()
    ax3.set_xlim(0, 100)
    ax3.set_xlabel('Tỷ lệ Website vi phạm (%)', fontsize=9.5, fontweight='bold', color='#475569')
    ax3.set_title('TỶ LỆ VI PHẠM TRÊN 6 NHÓM LỖI KỸ THUẬT CỐT LÕI (51 WEBSITE)\n& Phân tầng mức độ ưu tiên xử lý (P1 Cấp bách - P2 Trọng tâm - P3 Tối ưu)', fontsize=11, fontweight='bold', color='#004776', pad=14)
    ax3.grid(axis='x', linestyle='--', alpha=0.5, zorder=0)
    ax3.spines['top'].set_visible(False)
    ax3.spines['right'].set_visible(False)
    ax3.spines['left'].set_color('#CBD5E1')
    ax3.spines['bottom'].set_color('#CBD5E1')

    for bar, pct, cnt, tag in zip(bars, percentages, counts, priority_tags):
        w = bar.get_width()
        ax3.text(w + 1.2, bar.get_y() + bar.get_height()/2.0, f'{pct}% ({cnt}/51)  {tag}', va='center', fontsize=8.5, fontweight='bold', color='#1E293B')

    chart3_path = os.path.join(output_dir, "chart_technical_issues.png")
    plt.savefig(chart3_path, dpi=300)
    plt.close()
    print(f"Created Chart 3: {chart3_path}")

    # -------------------------------------------------------------
    # Chart 4: Sơ đồ Gantt tiến độ 3 giai đoạn (Roadmap)
    # -------------------------------------------------------------
    fig4, ax4 = plt.subplots(figsize=(11.5, 4.2), dpi=300)
    fig4.patch.set_facecolor('#FFFFFF')
    plt.subplots_adjust(left=0.28, right=0.82, top=0.84, bottom=0.18)

    phases = [
        'Giai đoạn 1: Xử lý cấp bách & Bài mẫu\n(16 web Không đạt | Deadline: 25/10)',
        'Giai đoạn 2: Chuẩn hóa nhận diện\n(11 web Cần sửa | Deadline: 30/10)',
        'Giai đoạn 3: Nghiệm thu & Chuyển giao\n(Toàn bộ 51 website | Deadline: 15/11)'
    ]
    start_days = [0, 9, 14] # relative to 16/10 (day 0)
    durations = [9, 5, 16]  # G1: 16-25/10 (9d), G2: 25-30/10 (5d), G3: 30/10-15/11 (16d)
    colors_gantt = ['#EF4444', '#F59E0B', '#10B981']

    y_gantt = np.arange(len(phases))
    bars_g = ax4.barh(y_gantt, durations, left=start_days, height=0.48, color=colors_gantt, zorder=3, edgecolor='#FFFFFF', linewidth=2)

    ax4.set_yticks(y_gantt)
    ax4.set_yticklabels(phases, fontsize=9, fontweight='bold', color='#1E293B')
    ax4.invert_yaxis()
    ax4.set_xlim(-1, 38)

    date_ticks = [0, 4, 9, 14, 20, 25, 30]
    date_labels = ['16/10\nKhởi động', '20/10\nRà soát', '25/10\nMỐC 1', '30/10\nMỐC 2', '05/11\nTối ưu SEO', '10/11\nKiểm thử', '15/11\nNGHIỆM THU']
    ax4.set_xticks(date_ticks)
    ax4.set_xticklabels(date_labels, fontsize=8.5, fontweight='bold', color='#475569')

    milestone_x = [9, 14, 30]
    milestone_labels = ['Hoàn thành P1: 25/10', 'Hoàn thành P2: 30/10', 'NGHIỆM THU TOÀN DIỆN: 15/11']

    for bar, m_x, m_lbl in zip(bars_g, milestone_x, milestone_labels):
        y_center = bar.get_y() + bar.get_height()/2.0
        ax4.scatter(m_x, y_center, marker='D', s=110, color='#004776', zorder=5, edgecolor='white', linewidth=1.5)
        ax4.text(m_x + 0.8, y_center, m_lbl, va='center', fontsize=8.5, fontweight='bold', color='#004776')

    ax4.set_title('SƠ ĐỒ GANTT TIẾN ĐỘ 3 GIAI ĐOẠN KHẮC PHỤC & NGHIỆM THU HỆ THỐNG 51 WEBSITE\n(Từ 16/10/2026 đến 15/11/2026)', fontsize=11, fontweight='bold', color='#004776', pad=14)
    ax4.grid(axis='x', linestyle='--', alpha=0.6, zorder=0)
    ax4.spines['top'].set_visible(False)
    ax4.spines['right'].set_visible(False)
    ax4.spines['left'].set_color('#CBD5E1')
    ax4.spines['bottom'].set_color('#CBD5E1')

    chart4_path = os.path.join(output_dir, "chart_roadmap_gantt.png")
    plt.savefig(chart4_path, dpi=300)
    plt.close()
    print(f"Created Chart 4: {chart4_path}")
    
    return chart1_path, chart2_path, chart3_path, chart4_path

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=50, bottom=50, left=70, right=70):
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

def build_docx_report():
    chart1_path, chart2_path, chart3_path, chart4_path = create_charts("Doc")
    
    doc = docx.Document()
    
    for section in doc.sections:
        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(9)
    normal_style.font.color.rgb = RGBColor(17, 24, 39)
    
    # -------------------------------------------------------------------------
    # 1. HEADER QUỐC HIỆU & ĐƠN VỊ
    # -------------------------------------------------------------------------
    header_tbl = doc.add_table(rows=1, cols=2)
    header_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_tbl.autofit = False
    
    cell_left = header_tbl.cell(0, 0)
    cell_right = header_tbl.cell(0, 1)
    cell_left.width = Inches(4.2)
    cell_right.width = Inches(3.5)
    
    p_l = cell_left.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_l.paragraph_format.space_after = Pt(2)
    r1 = p_l.add_run("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT\nTHÀNH PHỐ HỒ CHÍ MINH\n")
    r1.font.size = Pt(9)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(0, 71, 118)
    r2 = p_l.add_run("PHÒNG QUẢN TRỊ THƯƠNG HIỆU & TRUYỀN THÔNG\n")
    r2.font.size = Pt(9.5)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(0, 114, 188)
    r3 = p_l.add_run("Số: 14/BC-QTTHTT")
    r3.font.size = Pt(8.5)
    r3.font.italic = True
    
    p_r = cell_right.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_r.paragraph_format.space_after = Pt(2)
    r_qh1 = p_r.add_run("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n")
    r_qh1.font.size = Pt(9.5)
    r_qh1.font.bold = True
    r_qh2 = p_r.add_run("Độc lập - Tự do - Hạnh phúc\n")
    r_qh2.font.size = Pt(10)
    r_qh2.font.bold = True
    r_qh3 = p_r.add_run("TP. Hồ Chí Minh, ngày 16 tháng 10 năm 2026")
    r_qh3.font.size = Pt(8.5)
    r_qh3.font.italic = True
    
    # TIÊU ĐỀ (GIỮ NGUYÊN BẢN CHỈNH SỬA CỦA USER)
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(2)
    run_t = p_title.add_run("BÁO CÁO RÀ SOÁT\n& ĐÁNH GIÁ CHUYÊN SÂU HỆ THỐNG WEBSITE 51 ĐƠN VỊ")
    run_t.font.name = "Arial"
    run_t.font.size = Pt(13)
    run_t.font.bold = True
    run_t.font.color.rgb = RGBColor(0, 71, 118)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    run_s = p_sub.add_run("Phân loại kiểm định: [ĐẠT] - [CẦN CHỈNH SỬA] - [KHÔNG ĐẠT] & Nhận diện website tên miền chính là Web Cũ")
    run_s.font.name = "Arial"
    run_s.font.size = Pt(9.5)
    run_s.font.italic = True
    run_s.font.color.rgb = RGBColor(83, 107, 125)
    
    p_kg = doc.add_paragraph()
    p_kg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kg.paragraph_format.space_after = Pt(8)
    r_kg = p_kg.add_run("Kính gửi: Ban Giám hiệu Nhà trường\nĐồng kính gửi: Trung tâm Thông tin - Máy tính (TTMT) & Quý Thầy/Cô Lãnh đạo Đơn vị")
    r_kg.font.bold = True
    r_kg.font.size = Pt(9)
    
    # -------------------------------------------------------------------------
    # I. TỔNG HỢP HIỆN TRẠNG & BIỂU ĐỒ TRỰC QUAN (THAY THẾ BẢNG SỐ LIỆU ĐẦU TIÊN)
    # -------------------------------------------------------------------------
    h1 = doc.add_heading("I. TỔNG HỢP HIỆN TRẠNG VẬN HÀNH BẰNG BIỂU ĐỒ TRỰC QUAN", level=1)
    h1.paragraph_format.space_before = Pt(10)
    h1.paragraph_format.space_after = Pt(4)
    for r in h1.runs:
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 114, 188)
        
    p_c1 = doc.add_paragraph()
    p_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1.paragraph_format.space_after = Pt(6)
    doc.add_picture(chart1_path, width=Inches(7.2))
    
    # Bảng tóm tắt số liệu đi kèm biểu đồ
    tbl_kpi = doc.add_table(rows=1, cols=4)
    tbl_kpi.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_kpi.autofit = False
    set_table_borders(tbl_kpi)
    
    headers_kpi = ["Chỉ số thống kê", "Số lượng", "Tỷ lệ", "Ý nghĩa đánh giá"]
    widths_kpi = [Inches(2.5), Inches(0.9), Inches(0.9), Inches(3.2)]
    for idx, txt in enumerate(headers_kpi):
        c = tbl_kpi.cell(0, idx)
        c.width = widths_kpi[idx]
        set_cell_background(c, "0072BC")
        set_cell_margins(c, 50, 50, 80, 80)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx in [1, 2] else WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(txt)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    kpi_rows = [
        ("Tên miền chính: Đã chuyển sang Web MỚI", "25 / 51", "49.0%", "Đang vận hành CMS mới trên IP .189; tốc độ tải nhanh, đạt chuẩn giao diện."),
        ("Tên miền chính: CÒN LÀ WEB CŨ", "26 / 51", "51.0%", "Đang trỏ server cũ .181; cần nghiệm thu nội dung để TTMT cắt chuyển DNS."),
        ("Đánh giá: ĐẠT CHUẨN (Cấp 1)", "24 / 51", "47.1%", "Đúng đơn vị, đủ 3 luồng cơ bản (A, B, C), sẵn sàng vận hành chính thức."),
        ("Đánh giá: CẦN CHỈNH SỬA (Cấp 2)", "11 / 51", "21.6%", "Đúng đơn vị nhưng thiếu một số trang con Luồng A hoặc cần sửa lỗi DNS."),
        ("Đánh giá: KHÔNG ĐẠT (Cấp 3 - Cấp 4)", "16 / 51", "31.4%", "NGUY CƠ CAO: Web chứa bài mẫu Lorem Ipsum hoặc dữ liệu đơn vị khác.")
    ]
    for r_idx, r_data in enumerate(kpi_rows):
        row = tbl_kpi.add_row()
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(r_data):
            c = row.cells[c_idx]
            c.width = widths_kpi[c_idx]
            set_cell_background(c, bg_col)
            set_cell_margins(c, 45, 45, 70, 70)
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [1, 2] else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.size = Pt(8)
            if c_idx == 0:
                run.font.bold = True
                if "CÒN LÀ WEB CŨ" in val or "KHÔNG ĐẠT" in val:
                    run.font.color.rgb = RGBColor(220, 38, 38)
                elif "ĐẠT CHUẨN" in val:
                    run.font.color.rgb = RGBColor(22, 163, 74)
            elif c_idx in [1, 2]:
                run.font.bold = True

    # -------------------------------------------------------------------------
    # BIỂU ĐỒ GỢI Ý MỞ RỘNG: PHÂN BỔ CÁN BỘ & THEO 4 KHỐI ĐƠN VỊ
    # -------------------------------------------------------------------------
    p_sug = doc.add_paragraph()
    p_sug.paragraph_format.space_before = Pt(8)
    p_sug.paragraph_format.space_after = Pt(4)
    run_sug = p_sug.add_run("📊 BIỂU ĐỒ PHÂN BỔ KHỐI LƯỢNG HỖ TRỢ THEO CÁN BỘ & 4 KHỐI ĐƠN VỊ:")
    run_sug.font.bold = True
    run_sug.font.size = Pt(9.5)
    run_sug.font.color.rgb = RGBColor(0, 71, 118)
    
    doc.add_picture(chart2_path, width=Inches(7.2))

    # -------------------------------------------------------------------------
    # II. BẢNG TIÊU CHÍ ĐÁNH GIÁ CHUNG (CHECKLIST: ĐẠT / CẦN SỬA / KHÔNG ĐẠT)
    # -------------------------------------------------------------------------
    h2 = doc.add_heading("II. KHUNG TIÊU CHÍ ĐÁNH GIÁ CHUNG (CHECKLIST KIỂM ĐỊNH TOÀN TRƯỜNG)", level=1)
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(4)
    for r in h2.runs:
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 114, 188)

    p_c3_lbl = doc.add_paragraph()
    p_c3_lbl.paragraph_format.space_before = Pt(6)
    p_c3_lbl.paragraph_format.space_after = Pt(4)
    run_c3_lbl = p_c3_lbl.add_run("📊 BIỂU ĐỒ 3: PHÂN TÍCH TỶ LỆ VI PHẠM TRÊN 6 NHÓM LỖI KỸ THUẬT & PHÂN TẦNG ƯU TIÊN:")
    run_c3_lbl.font.bold = True
    run_c3_lbl.font.size = Pt(9.5)
    run_c3_lbl.font.color.rgb = RGBColor(0, 71, 118)
    
    doc.add_picture(chart3_path, width=Inches(7.2))
    
    p_crit_lbl = doc.add_paragraph()
    p_crit_lbl.paragraph_format.space_before = Pt(8)
    p_crit_lbl.paragraph_format.space_after = Pt(4)
    r_crit_lbl = p_crit_lbl.add_run("BẢNG TIÊU CHÍ KIỂM ĐỊNH CHI TIẾT (ĐẠT / CẦN SỬA / KHÔNG ĐẠT):")
    r_crit_lbl.font.bold = True
    r_crit_lbl.font.size = Pt(9.5)
    r_crit_lbl.font.color.rgb = RGBColor(0, 71, 118)
        
    tbl_criteria = doc.add_table(rows=1, cols=4)
    tbl_criteria.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_criteria.autofit = False
    set_table_borders(tbl_criteria)
    
    headers_crit = ["Nhóm vấn đề cốt lõi", "Điều kiện tích [ĐẠT] (Pass)", "Điều kiện tích [CẦN CHỈNH SỬA]", "Điều kiện tích [KHÔNG ĐẠT] (Fail)"]
    widths_crit = [Inches(1.8), Inches(2.0), Inches(2.0), Inches(1.7)]
    
    for c_idx, text in enumerate(headers_crit):
        cell = tbl_criteria.cell(0, c_idx)
        cell.width = widths_crit[c_idx]
        set_cell_background(cell, "004776")
        set_cell_margins(cell, 60, 60, 70, 70)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx > 0 else WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    crit_data = [
        ("1. Hạ tầng DNS, Tên miền & SSL", "Đã trỏ tên miền chính về IP mới .189; SSL HTTPS hợp lệ; tự động redirect 301 từ http.", "Tên miền chính tạm duy trì web cũ (.181) chờ chuyển giao; hoặc web mới đang ở subdomain lưu trữ (...1).", "Báo lỗi 404 Not Found; báo NXDOMAIN (chưa tạo DNS); hoặc trỏ nhầm IP hosting bên ngoài."),
        ("2. Nhận diện thương hiệu & Media", "Logo trường chuẩn vector; Banner desktop 2.4:1 (2400x1000px); Banner tin 16:9; ảnh nét, đúng tỷ lệ.", "Chưa có banner riêng cho đơn vị (dùng banner chung); hoặc kích thước banner chưa tối ưu chuẩn 2.4:1.", "Hình ảnh bị méo tỷ lệ; vỡ hạt; hoặc dùng banner/ảnh đại diện của đơn vị khác."),
        ("3. Trang con tĩnh (Luồng A)", "Đủ 4 trang cơ bản: Giới thiệu, Cơ cấu tổ chức/Nhân sự, Chức năng nhiệm vụ (hoặc CTĐT), Liên hệ. URL chuẩn SEO.", "Có trang giới thiệu nhưng còn thiếu thông tin ban lãnh đạo, nhân sự bộ môn, phòng lab hoặc liên hệ.", "Trắng trang con; hoặc nội dung trang con bị clone nhầm của khoa/phòng khác; dính text mẫu."),
        ("4. Tin bài & Văn bản PDF (Luồng B)", "100% tin bài thực tế của đơn vị; có đủ mục Tin tức và Thông báo; file biểu mẫu PDF mở quyền tải công khai.", "Số lượng bài viết còn ít (< 3 bài); chưa cập nhật biểu mẫu PDF mới nhất; thiếu trích yếu ngắn gọn.", "Chứa bài viết mẫu giả lập (Lorem Ipsum); bài viết sai chuyên môn; file PDF bị lỗi không tải được."),
        ("5. Mega Menu & Footer (Luồng C)", "Menu tối đa 3 cấp, điều hướng thông suốt; 100% link nội bộ dạng relative; Footer đủ email trường và địa chỉ phòng.", "Menu còn chứa liên kết dạng dấu #; hoặc còn sót link trỏ về domain thử nghiệm cũ (hcmutertic.com).", "Click menu bị lỗi 404; liên kết menu trỏ sang web bên ngoài trái quy định; Footer không có thông tin."),
        ("6. Bảo mật & An toàn dữ liệu", "Tuân thủ nghiêm Luật 91/2025/QH15: Không hiển thị số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm.", "Các thông báo khen thưởng/học phí có hiển thị mã sinh viên nhưng chưa được che bớt ký tự định danh.", "Công khai trực tiếp danh sách sinh viên kèm số CCCD, số tài khoản ngân hàng hoặc số điện thoại riêng tư.")
    ]
    
    for r_idx, row_data in enumerate(crit_data):
        row = tbl_criteria.add_row()
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = widths_crit[c_idx]
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

    # -------------------------------------------------------------------------
    # III. BẢNG MA TRẬN TÍCH ĐIỂM CHI TIẾT 51 WEBSITE - NOTE RÕ WEB CŨ & CÁN BỘ
    # -------------------------------------------------------------------------
    h3 = doc.add_heading("III. BẢNG MA TRẬN KIỂM ĐỊNH TÍCH ĐIỂM CHI TIẾT 51 WEBSITE ĐƠN VỊ", level=1)
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(4)
    for r in h3.runs:
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 114, 188)
        
    p_mat_desc = doc.add_paragraph()
    p_mat_desc.paragraph_format.space_after = Pt(4)
    p_mat_desc.add_run(
        "Ghi chú nhận diện: Các đơn vị có tên miền chính là Website CŨ được đánh dấu nổi bật [Tên miền chính: WEB CŨ (.181)]. "
        "Các cột tích điểm bao gồm 6 nhóm tiêu chuẩn kỹ thuật & nội dung, cột Cán bộ phụ trách BMC và Kết luận đánh giá chung:"
    )
    
    headers_matrix = [
        "STT", "Tên đơn vị & Tên miền\n[Ghi chú trạng thái web]", "Cán bộ\nphụ trách",
        "1. DNS\n& SSL", "2. Nhận\ndiện", "3. Luồng A\n(Trang)", "4. Luồng B\n(Tin/PDF)", "5. Luồng C\n(Menu)", "6. Bảo\nmật TT",
        "KẾT LUẬN\nCHUNG"
    ]
    widths_matrix = [
        Inches(0.35), Inches(2.0), Inches(0.75),
        Inches(0.65), Inches(0.65), Inches(0.65), Inches(0.65), Inches(0.65), Inches(0.65),
        Inches(0.85)
    ]
    
    tbl_matrix = doc.add_table(rows=1, cols=10)
    tbl_matrix.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_matrix.autofit = False
    set_table_borders(tbl_matrix)
    
    for c_idx, text in enumerate(headers_matrix):
        cell = tbl_matrix.cell(0, c_idx)
        cell.width = widths_matrix[c_idx]
        set_cell_background(cell, "0072BC")
        set_cell_margins(cell, 50, 50, 50, 50)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx not in [1] else WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(7.5)
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    matrix_data = [
        ("A. KHỐI KHOA VÀ VIỆN ĐÀO TẠO (15 ĐƠN VỊ)", [
            (1, "Viện Sư phạm Kỹ thuật\n(ite.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (2, "Phân hiệu Bình Phước\n(binhphuoc.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (404)]", "A. Phi", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT"),
            (3, "Khoa Điện - Điện tử\n(feee.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (4, "Khoa Kinh tế\n(fe.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (5, "Khoa Cơ khí\n(fme.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (6, "Khoa Giao thông & NL\n(feet.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (7, "Khoa Hóa & KH Sự sống\n(fcft.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (8, "Khoa Công nghệ TT\n(fit.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (9, "Khoa Xây dựng\n(fce.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (404)]", "A. Phi", "KHÔNG ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "CẦN SỬA"),
            (10, "Khoa Đào tạo Tiên tiến\n(fae.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (11, "Khoa Chính trị và Luật\n(fpi.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (12, "Khoa Mỹ thuật & TT\n(fam.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (13, "Khoa Khoa học Ứng dụng\n(fas.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (14, "Khoa Ngoại ngữ\n(ffl.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (15, "Viện Đào tạo Quốc tế\n(iie.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT")
        ]),
        
        ("B. KHỐI PHÒNG, BAN CHỨC NĂNG (16 ĐƠN VỊ)", [
            (16, "Phòng Công tác sinh viên\n(sao.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT"),
            (17, "Phòng Đào tạo\n(aao.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (18, "P. Đào tạo - VLVH\n(nmo.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (19, "Phòng Khảo thí & ĐBCL\n(qao.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (20, "Phòng Quan hệ Doanh nghiệp\n(pr.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (21, "Phòng Quan hệ Quốc tế\n(oia.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (NXDOMAIN)]", "A. Phi", "KHÔNG ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "CẦN SỬA"),
            (22, "Phòng QLĐT XD & Đấu thầu\n(cpm.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (23, "Phòng Quản trị CSVC\n(emo.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (24, "Phòng QTTH & Truyền thông\n(bmc.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Chị Ngân", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (25, "Phòng Tổ chức – Nhân sự\n(tcns.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (26, "Phòng Hành chính – Tổng hợp\n(adao.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (27, "Phòng Khoa học Công nghệ\n(stiao.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (28, "Phòng Kế hoạch tài chính\n(fpo.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT"),
            (29, "Văn phòng Đảng uỷ\n(vanphongdanguy.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (30, "Trạm Y tế\n(hd.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (31, "Ban Quản lý Ký túc xá\n(ktx.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT")
        ]),
        
        ("C. KHỐI TRUNG TÂM, VIỆN NGHIÊN CỨU & KHÁC (13 ĐƠN VỊ)", [
            (32, "Phòng Thí nghiệm mở\n(openlab.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (33, "Viện Sau đại học\n(sdh.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (34, "Thư viện Trường\n(lib.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (35, "Trung tâm GD Thể chất\n(cped.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (36, "TT Nghiên cứu NL Tái tạo\n(rerc.hcmute.edu.vn)\n[Tên miền chính: LỖI IP .188 & 404]", "Cal", "KHÔNG ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "ĐẠT", "KHÔNG ĐẠT"),
            (37, "TT Sáng tạo Khởi nghiệp\n(cisat.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (38, "Trung tâm TT – Máy tính\n(iic.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (39, "Trung tâm Tin học\n(trungtamtinhoc.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Cal", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (40, "Trung tâm Ngoại ngữ\n(ttnn.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (41, "TT Học liệu và Dạy học số\n(hldhs.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "Nhân", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (42, "TT GD Quốc phòng và AN\n(ttgdqpan.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "ĐẠT", "CẦN SỬA", "CẦN SỬA", "CẦN SỬA", "ĐẠT", "CẦN SỬA"),
            (43, "Trung tâm Robot Thông minh\n(smroce.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "A. Phi", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (44, "Tạp chí KHGD Kỹ thuật\n(jte.edu.vn)\n[Tên miền chính: WEB RIÊNG OJS]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT")
        ]),
        
        ("D. KHỐI TỔ CHỨC ĐOÀN THỂ & CỔNG DỊCH VỤ (7 ĐƠN VỊ)", [
            (45, "Công đoàn Trường\n(congdoan.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Chị Ngân", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (46, "Đoàn Thanh niên - Hội SV\n(tuoitre.hcmute.edu.vn)\n[Tên miền chính: SAI IP 45.252...]", "Cal", "KHÔNG ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (47, "Hội Cựu sinh viên\n(alumni.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (48, "Đào tạo ngắn hạn online\n(daotaonganhantructuyen...)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "ĐẠT", "KHÔNG ĐẠT"),
            (49, "Đào tạo từ xa\n(daotaotuxa.hcmute.edu.vn)\n[Tên miền chính: WEB CŨ (.181)]", "A. Phi", "CẦN SỬA", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT"),
            (50, "Rèn luyện và CTXH\n(drlctxh.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Nhân", "ĐẠT", "CẦN SỬA", "KHÔNG ĐẠT", "KHÔNG ĐẠT", "CẦN SỬA", "CẦN SỬA", "KHÔNG ĐẠT"),
            (51, "Hội đồng Giáo sư cơ sở\n(hdgscs.hcmute.edu.vn)\n[Tên miền chính: WEB MỚI (.189)]", "Cal", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT", "ĐẠT")
        ])
    ]
    
    for block_title, items in matrix_data:
        cat_row = tbl_matrix.add_row()
        cat_cell = cat_row.cells[0]
        for i in range(1, 10):
            cat_cell.merge(cat_row.cells[i])
        set_cell_background(cat_cell, "EBF5FF")
        set_cell_margins(cat_cell, 45, 45, 70, 70)
        p_cat = cat_cell.paragraphs[0]
        p_cat.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r_cat = p_cat.add_run(block_title)
        r_cat.font.bold = True
        r_cat.font.size = Pt(8.5)
        r_cat.font.color.rgb = RGBColor(0, 71, 118)
        
        for item in items:
            stt, name_with_note, cb, c1, c2, c3, c4, c5, c6, final = item
            row = tbl_matrix.add_row()
            bg_col = "FFFFFF" if stt % 2 == 1 else "F8FAFC"
            
            if final == "KHÔNG ĐẠT":
                bg_col = "FFF5F5"
                
            vals = [str(stt), name_with_note, cb, c1, c2, c3, c4, c5, c6, final]
            
            for c_idx, val in enumerate(vals):
                cell = row.cells[c_idx]
                cell.width = widths_matrix[c_idx]
                set_cell_background(cell, bg_col)
                set_cell_margins(cell, 40, 40, 45, 45)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx not in [1] else WD_ALIGN_PARAGRAPH.LEFT
                
                lines = val.split("\n")
                for l_idx, line in enumerate(lines):
                    if l_idx > 0:
                        p = cell.add_paragraph()
                        p.paragraph_format.space_before = Pt(1)
                        p.paragraph_format.space_after = Pt(1)
                        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx not in [1] else WD_ALIGN_PARAGRAPH.LEFT
                    run = p.add_run(line)
                    run.font.size = Pt(7.5)
                    
                    if c_idx == 1:
                        if l_idx == 0:
                            run.font.bold = True
                        elif l_idx == 1:
                            run.font.name = "Consolas"
                            run.font.size = Pt(7)
                            run.font.color.rgb = RGBColor(100, 116, 139)
                        elif l_idx == 2:
                            run.font.bold = True
                            if "WEB CŨ" in line:
                                run.font.color.rgb = RGBColor(185, 28, 28)
                            elif "WEB MỚI" in line:
                                run.font.color.rgb = RGBColor(0, 114, 188)
                    elif c_idx == 2:
                        run.font.bold = True
                    elif c_idx in [3, 4, 5, 6, 7, 8]:
                        run.font.bold = True
                        if line == "ĐẠT":
                            run.font.color.rgb = RGBColor(22, 163, 74)
                        elif line == "CẦN SỬA":
                            run.font.color.rgb = RGBColor(217, 119, 6)
                        elif line == "KHÔNG ĐẠT":
                            run.font.color.rgb = RGBColor(220, 38, 38)
                    elif c_idx == 9:
                        run.font.bold = True
                        if line == "ĐẠT":
                            run.font.color.rgb = RGBColor(22, 163, 74)
                        elif line == "CẦN SỬA":
                            run.font.color.rgb = RGBColor(217, 119, 6)
                        elif line == "KHÔNG ĐẠT":
                            run.font.color.rgb = RGBColor(220, 38, 38)

    # -------------------------------------------------------------------------
    # IV. KẾ HOẠCH TRIỂN KHAI VÀ PHÂN KỲ THỰC HIỆN (BẢO TOÀN HẠN CỦA USER)
    # -------------------------------------------------------------------------
    h4 = doc.add_heading("IV. KẾ HOẠCH TRIỂN KHAI VÀ PHÂN KỲ THỰC HIỆN", level=1)
    h4.paragraph_format.space_before = Pt(12)
    h4.paragraph_format.space_after = Pt(4)
    for r in h4.runs:
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 114, 188)

    p_c4_lbl = doc.add_paragraph()
    p_c4_lbl.paragraph_format.space_before = Pt(6)
    p_c4_lbl.paragraph_format.space_after = Pt(4)
    run_c4_lbl = p_c4_lbl.add_run("📊 BIỂU ĐỒ 4: SƠ ĐỒ GANTT LỘ TRÌNH 3 GIAI ĐOẠN KHẮC PHỤC & NGHIỆM THU (16/10 - 15/11/2026):")
    run_c4_lbl.font.bold = True
    run_c4_lbl.font.size = Pt(9.5)
    run_c4_lbl.font.color.rgb = RGBColor(0, 71, 118)
    
    doc.add_picture(chart4_path, width=Inches(7.2))
    
    p_plan_lbl = doc.add_paragraph()
    p_plan_lbl.paragraph_format.space_before = Pt(8)
    p_plan_lbl.paragraph_format.space_after = Pt(4)
    r_plan_lbl = p_plan_lbl.add_run("BẢNG PHÂN KỲ THỜI HẠN & NHIỆM VỤ CỤ THỂ:")
    r_plan_lbl.font.bold = True
    r_plan_lbl.font.size = Pt(9.5)
    r_plan_lbl.font.color.rgb = RGBColor(0, 71, 118)
        
    tbl_plan = doc.add_table(rows=1, cols=4)
    tbl_plan.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_plan.autofit = False
    set_table_borders(tbl_plan)
    
    headers_plan = ["Giai đoạn", "Nhiệm vụ trọng tâm chi tiết", "Đơn vị thực hiện", "Thời hạn"]
    widths_plan = [Inches(1.5), Inches(3.3), Inches(1.5), Inches(1.2)]
    
    for c_idx, text in enumerate(headers_plan):
        cell = tbl_plan.cell(0, c_idx)
        cell.width = widths_plan[c_idx]
        set_cell_background(cell, "004776")
        set_cell_margins(cell, 60, 60, 80, 80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(255, 255, 255)
        
    plan_data = [
        ("Giai đoạn 1: Xử lý khẩn cấp", "Xóa sạch 100% bài mẫu Lorem Ipsum tại 16 đơn vị KHÔNG ĐẠT. Sửa 4 lỗi DNS nghiêm trọng (oia, rerc, tuoitre, fce). Rà soát và ẩn số CCCD/STK.", "BTV các đơn vị Cấp 3, BMC & TTMT", "Trước 25/10/2026"),
        ("Giai đoạn 2: Hoàn thiện chức năng", "Bổ sung các trang con Luồng A còn thiếu cho 9 đơn vị CẦN SỬA. Chuẩn hóa banner 2.4:1, sửa link 404, mở quyền tải công khai cho tệp PDF biểu mẫu.", "BTV các đơn vị Cấp 2, Chuyên viên BMC", "Trước 30/10/2026"),
        ("Giai đoạn 3: Cắt chuyển toàn diện", "Nghiệm thu chất lượng các đơn vị ĐẠT. Phối hợp Trung tâm TTMT trỏ bản ghi DNS chính thức sang IP mới (.189), kích hoạt tên miền lưu trữ ...1.hcmute.edu.vn.", "Trung tâm TTMT & P. QTTH&TT", "Trước 15/11/2026")
    ]
    
    for r_idx, row_data in enumerate(plan_data):
        row = tbl_plan.add_row()
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = widths_plan[c_idx]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 50, 50, 80, 80)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0, 114, 188)
            elif c_idx == 3:
                run.font.bold = True
                run.font.color.rgb = RGBColor(220, 38, 38) if r_idx == 0 else RGBColor(30, 41, 59)

    # -------------------------------------------------------------------------
    # CHỮ KÝ XÁC NHẬN
    # -------------------------------------------------------------------------
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(14)
    
    sign_tbl = doc.add_table(rows=1, cols=2)
    sign_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sign_tbl.autofit = False
    
    s_left = sign_tbl.cell(0, 0)
    s_right = sign_tbl.cell(0, 1)
    s_left.width = Inches(3.8)
    s_right.width = Inches(3.7)
    
    p_sl = s_left.paragraphs[0]
    p_sl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sl1 = p_sl.add_run("NGƯỜI LẬP BÁO CÁO\n\n\n\n\n")
    r_sl1.font.bold = True
    r_sl1.font.size = Pt(9)
    r_sl2 = p_sl.add_run("Võ Minh Hòa\nChuyên viên P. QTTH&TT")
    r_sl2.font.bold = True
    r_sl2.font.size = Pt(9)
    
    p_sr = s_right.paragraphs[0]
    p_sr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sr1 = p_sr.add_run("TRƯỞNG PHÒNG QTTH & TRUYỀN THÔNG\n\n\n\n\n")
    r_sr1.font.bold = True
    r_sr1.font.size = Pt(9)
    r_sr2 = p_sr.add_run("ThS. Lê Xuân Thân")
    r_sr2.font.bold = True
    r_sr2.font.size = Pt(9)

    output_dir_local = "Doc"
    os.makedirs(output_dir_local, exist_ok=True)
    file_name = "Bao_cao_ra_soat_nang_cap_website_51_don_vi_HCMUTE.docx"
    local_path = os.path.join(output_dir_local, file_name)
    doc.save(local_path)
    print(f"Saved local file: {local_path}")
    
    onedrive_dir = "/Users/macaz/Library/CloudStorage/OneDrive-hcmute.edu.vn/VMH/0.BMC/0. Website HCMUTE/3. Design/hcmute-website-asset"
    if os.path.exists(onedrive_dir):
        onedrive_path = os.path.join(onedrive_dir, file_name)
        shutil.copy2(local_path, onedrive_path)
        print(f"Copied to OneDrive: {onedrive_path}")

if __name__ == "__main__":
    build_docx_report()
