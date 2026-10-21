-- ==============================================================================
-- Migration: 20261021000002_add_tc08_and_sync_cms_audit.sql
-- Description: Add TC-08 (Phân quyền & Quản trị CMS), rebalance criteria weights to 100%,
--              and synchronize CMS audit results (categories, posts, admin access) for all 51 units.
-- Date: 2026-10-21
-- Invariants:
--   - Security First & RLS compliant.
--   - Preserves audit log & triggers authoritative total_score recalculation.
-- ==============================================================================

DO $$
DECLARE
  v_period_id UUID;
  v_unit_id UUID;
  v_rating_id UUID;
  v_crit_id UUID;
BEGIN
  -- 1. Ensure/Update the 8 evaluation criteria with exact balanced weights
  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_dns', 'TC-01', '1. Hạ tầng DNS, Tên miền & SSL', 'Trỏ tên miền chính về IP mới .189, chứng chỉ bảo mật SSL HTTPS và chuyển hướng 301.', 15.00, 'Đã trỏ tên miền chính về IP mới .189, SSL HTTPS hợp lệ, tự động redirect 301 từ http.', 'Tên miền chính tạm duy trì web cũ (.181) chờ chuyển giao hoặc web mới đang ở subdomain lưu trữ (...1).', 'Báo lỗi 404 Not Found, NXDOMAIN hoặc trỏ nhầm IP hosting bên ngoài.', false, 1)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_brand', 'TC-02', '2. Nhận diện thương hiệu & Media', 'Logo trường chuẩn vector, banner desktop 2.4:1 (2400x1000px), banner tin 16:9 sắc nét.', 10.00, 'Logo trường chuẩn vector, Banner desktop 2.4:1 (2400x1000px), Banner tin 16:9, ảnh nét đúng tỷ lệ.', 'Chưa có banner riêng đơn vị (dùng banner chung) hoặc kích thước banner chưa tối ưu chuẩn 2.4:1.', 'Hình ảnh bị méo tỷ lệ, vỡ hạt hoặc dùng banner/ảnh đại diện của đơn vị khác.', false, 2)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_luong_a', 'TC-03', '3. Trang con tĩnh & Cây chuyên mục (Luồng A)', 'Đủ 4 trang cơ bản: Giới thiệu, Cơ cấu tổ chức/Nhân sự, Chức năng nhiệm vụ, Liên hệ và cấu trúc chuyên mục.', 15.00, 'Đủ 4 trang cơ bản (Giới thiệu, Nhân sự, Chức năng nhiệm vụ, Liên hệ), cây chuyên mục phân cấp rõ ràng (>= 5 danh mục).', 'Đã có trang giới thiệu và chuyên mục cơ bản (1-4 danh mục), nhưng còn thiếu thông tin ban lãnh đạo, nhân sự bộ môn.', 'Trắng trang con, chưa tạo cây chuyên mục (0 danh mục) hoặc dính text mẫu Lorem Ipsum.', false, 3)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_luong_b', 'TC-04', '4. Tin bài & Văn bản PDF (Luồng B)', 'Tin bài thực tế đơn vị, có mục Tin tức & Thông báo, biểu mẫu PDF mở quyền tải công khai.', 15.00, 'Từ 15 bài viết/tin tức/văn bản thực tế trở lên, có đủ mục Tin tức & Thông báo, file biểu mẫu PDF tải công khai.', 'Đã có bài viết nhưng số lượng còn ít (3 - 14 bài), cần cập nhật thêm tin hoạt động và biểu mẫu mới nhất.', 'Chưa có bài viết (< 3 bài) hoặc chứa bài mẫu Lorem Ipsum, file PDF bị lỗi không tải được.', false, 4)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_luong_c', 'TC-05', '5. Mega Menu & Footer (Luồng C)', 'Menu tối đa 3 cấp thông suốt, 100% link nội bộ relative, Footer đủ email trường và địa chỉ.', 15.00, 'Menu tối đa 3 cấp, điều hướng thông suốt, 100% link nội bộ relative, Footer đủ email trường và địa chỉ phòng.', 'Menu còn chứa liên kết dạng dấu # hoặc còn sót link trỏ về domain thử nghiệm cũ (hcmutertic.com).', 'Click menu bị lỗi 404, liên kết menu trỏ sang web bên ngoài trái quy định, Footer không có thông tin.', false, 5)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_security', 'TC-06', '6. Bảo mật & An toàn dữ liệu', 'Bảo mật thông tin cá nhân: không lộ số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm.', 10.00, 'Không hiển thị số CCCD, tài khoản ngân hàng, thông tin gia cảnh nhạy cảm.', 'Các thông báo khen thưởng/học phí có hiển thị mã sinh viên nhưng chưa được che bớt ký tự định danh.', 'Công khai trực tiếp danh sách sinh viên kèm số CCCD, số tài khoản ngân hàng hoặc số điện thoại riêng tư.', false, 6)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_info', 'TC-07', '7. Thông tin cơ bản & Website liên kết', 'Tên đơn vị chuẩn Bộ từ điển HCM-UTE, email @hcmute.edu.vn, SĐT Ext, phòng làm việc, link ngoài thông suốt.', 10.00, 'Tên đơn vị chuẩn Bộ từ điển HCM-UTE, 100% email @hcmute.edu.vn, có SĐT Ext, số phòng làm việc, link ngoài thông suốt.', 'Tên đơn vị còn dùng tên cũ, thiếu số phòng cụ thể, thiếu số máy lẻ Ext, có 1-2 liên kết mạng xã hội để dấu #.', 'Dùng email cá nhân Gmail/Yahoo, SĐT giả lập, link trỏ localhost/yhcmute, hoặc link lỗi 404 gián đoạn.', false, 7)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  INSERT INTO public.evaluation_criteria (code, display_code, title, description, weight, pass_condition, warning_condition, fail_condition, is_custom, sort_order)
  VALUES ('crit_admin', 'TC-08', '8. Phân quyền & Quản trị CMS', 'Khởi tạo Tenant trên CMS, phân quyền quản trị đơn vị (UNIT_ADMIN/EDITOR), tích hợp đo lường Analytics.', 10.00, 'Tenant CMS đang hoạt động, tài khoản quản trị đơn vị được phân quyền đầy đủ, tích hợp mã đo lường Analytics.', 'Đã có Tenant nhưng chưa hoàn tất phân quyền tài khoản quản trị đơn vị hoặc chưa kích hoạt mã theo dõi Analytics.', 'Chưa khởi tạo Tenant trên hệ thống CMS, tài khoản không có quyền truy cập quản trị.', false, 8)
  ON CONFLICT (code) DO UPDATE SET
    display_code = EXCLUDED.display_code,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    weight = EXCLUDED.weight,
    pass_condition = EXCLUDED.pass_condition,
    warning_condition = EXCLUDED.warning_condition,
    fail_condition = EXCLUDED.fail_condition,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  -- 2. Get active evaluation period
  SELECT id INTO v_period_id FROM public.evaluation_periods WHERE is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    SELECT id INTO v_period_id FROM public.evaluation_periods ORDER BY created_at DESC LIMIT 1;
  END IF;

  -- 3. Synchronize ratings and CMS audit results for all 51 units
  -- Unit #1: Viện Sư phạm Kỹ thuật (ite.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 1;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 6 chuyên mục, 15 bài viết. Quyền Admin: OK. [Web mới: ite1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #2: Phân hiệu Bình Phước (binhphuoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 2;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 3 chuyên mục, 5 bài viết. Quyền Admin: OK. [Web mới: binhphuoc1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #3: Khoa Điện - Điện tử (feee.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 3;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 42 chuyên mục, 36 bài viết. Quyền Admin: OK. [Web mới: feee1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #4: Khoa Kinh tế (fe.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 4;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 31 chuyên mục, 67 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #5: Khoa Cơ khí (fme.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 5;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 14 chuyên mục, 27 bài viết. Quyền Admin: OK. [Web mới: fme1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #6: Khoa Giao thông & NL (feet.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 6;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 32 chuyên mục, 29 bài viết. Quyền Admin: OK. [Web mới: feet1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #7: Khoa Hóa & KH Sự sống (fcft.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 7;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 13 chuyên mục, 15 bài viết. Quyền Admin: OK. [Web mới: fcft1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #8: Khoa Công nghệ TT (fit.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 8;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 22 chuyên mục, 72 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #9: Khoa Xây dựng (fce.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 9;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 100 chuyên mục, 30 bài viết. Quyền Admin: OK. [Web mới: fce1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #10: Khoa Đào tạo Tiên tiến (fae.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 10;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 83.00, 'CMS: 17 chuyên mục, 33 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 83.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #11: Khoa Chính trị và Luật (fpi.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 11;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 32 chuyên mục, 14 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #12: Khoa Mỹ thuật & TT (fam.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 12;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 68.00, 'CMS: 14 chuyên mục, 2 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 68.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #13: Khoa Khoa học Ứng dụng (fas.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 13;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 9 chuyên mục, 48 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #14: Khoa Ngoại ngữ (ffl.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 14;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 45.00, 'CMS: 14 chuyên mục, 9 bài viết. Quyền Admin: OK. [Web mới: ffl1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 45.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #15: Viện Đào tạo Quốc tế (iie.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 15;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 5 chuyên mục, 18 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #16: Phòng Công tác sinh viên (sao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 16;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 65.00, 'CMS: 11 chuyên mục, 5 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 65.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #17: Phòng Đào tạo (aao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 17;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 28 chuyên mục, 29 bài viết. Quyền Admin: OK. [Web mới: aao1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #18: P. Đào tạo - VLVH (nmo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 18;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 13 chuyên mục, 5 bài viết. Quyền Admin: OK. [Web mới: nmo1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #19: Phòng Khảo thí & ĐBCL (qao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 19;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 7 chuyên mục, 23 bài viết. Quyền Admin: OK. [Web mới: qao1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #20: Phòng Quan hệ Doanh nghiệp (pr.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 20;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 17 chuyên mục, 7 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #21: Phòng Quan hệ Quốc tế (oia.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 21;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 10 chuyên mục, 100 bài viết. Quyền Admin: OK. [Web mới: oia1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #22: Phòng QLĐT XD & Đấu thầu (cpm.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 22;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 16 chuyên mục, 4 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #23: Phòng Quản trị CSVC (emo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 23;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 8 chuyên mục, 22 bài viết. Quyền Admin: OK. [Web mới: emo1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #24: Phòng QTTH & Truyền thông (bmc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 24;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 18 chuyên mục, 41 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #25: Phòng Tổ chức – Nhân sự (tcns.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 25;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 63.00, 'CMS: 2 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: tcns1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 63.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #26: Phòng Hành chính – Tổng hợp (adao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 26;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 65.00, 'CMS: 2 chuyên mục, 1 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 65.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #27: Phòng Khoa học Công nghệ (stiao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 27;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 88 chuyên mục, 3 bài viết. Quyền Admin: OK. [Web mới: stiao1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #28: Phòng Kế hoạch tài chính (fpo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 28;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 58.00, 'CMS: 2 chuyên mục, 4 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 58.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #29: Văn phòng Đảng uỷ (vanphongdanguy.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 29;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 18.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: vanphongdanguy1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 18.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #30: Trạm Y tế (hd.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 30;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 11 chuyên mục, 17 bài viết. Quyền Admin: OK. [Web mới: hd1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #31: Ban Quản lý Ký túc xá (ktx.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 31;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 17 chuyên mục, 43 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #32: Phòng Thí nghiệm mở (openlab.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 32;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 43.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 43.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #33: Viện Sau đại học (sdh.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 33;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 20 chuyên mục, 3 bài viết. Quyền Admin: OK. [Web mới: sdh1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #34: Thư viện Trường (lib.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 34;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 12 chuyên mục, 100 bài viết. Quyền Admin: OK. [Web mới: lib1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #35: Trung tâm GD Thể chất (cped.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 35;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 5 chuyên mục, 11 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #36: TT Nghiên cứu NL Tái tạo (rerc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 36;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 10.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: rerc.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 10.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #37: TT Sáng tạo Khởi nghiệp (cisat.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 37;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 88.00, 'CMS: 7 chuyên mục, 17 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 88.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #38: Trung tâm TT – Máy tính (iic.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 38;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 45.00, 'CMS: 5 chuyên mục, 6 bài viết. Quyền Admin: OK. [Web mới: iic1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 45.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #39: Trung tâm Tin học (trungtamtinhoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 39;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 18.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: trungtamtinhoc1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 18.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #40: Trung tâm Ngoại ngữ (ttnn.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 40;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 18.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: ttnn1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 18.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #41: TT Học liệu và Dạy học số (hldhs.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 41;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 11 chuyên mục, 3 bài viết. Quyền Admin: OK. [Web mới: hldhs1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #42: TT GD Quốc phòng và AN (ttgdqpan.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 42;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 88.00, 'CMS: 11 chuyên mục, 15 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 88.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #43: Trung tâm Robot Thông minh (smroce.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 43;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 63.00, 'CMS: 2 chuyên mục, 14 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 63.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #44: Tạp chí KHGD Kỹ thuật (jte.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 44;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 30.00, 'CMS: 1 chuyên mục, 0 bài viết. Quyền Admin: OK. [Web mới: jte1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 30.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #45: Công đoàn Trường (congdoan.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 45;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 14 chuyên mục, 19 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #46: Đoàn Thanh niên - Hội SV (tuoitre.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 46;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 38.00, 'CMS: 15 chuyên mục, 7 bài viết. Quyền Admin: OK. [Web mới: tuoitre.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 38.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #47: Hội Cựu sinh viên (alumni.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 47;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 70.00, 'CMS: 4 chuyên mục, 15 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 70.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #48: Đào tạo ngắn hạn online (daotaonganhantructuyen.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 48;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 43.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 43.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #49: Đào tạo từ xa (daotaotuxa.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 49;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 19 chuyên mục, 100 bài viết. Quyền Admin: OK. [Web mới: daotaotuxa1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- Unit #50: Rèn luyện và CTXH (drlctxh.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 50;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 38.00, 'CMS: 0 chuyên mục, 0 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 38.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', updated_at = now();
    END IF;
  END IF;

  -- Unit #51: Hội đồng Giáo sư cơ sở (hdgscs.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 51;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 100.00, 'CMS: 16 chuyên mục, 16 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 100.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', updated_at = now();
    END IF;
  END IF;

  -- 4. Recalculate all unit_ratings total_score based on normalized criteria weights
  UPDATE public.unit_ratings r
  SET total_score = sub.calc_score,
      updated_at = now()
  FROM (
    SELECT 
      i.rating_id,
      ROUND(SUM(
        CASE 
          WHEN i.rating = 'pass' THEN c.weight
          WHEN i.rating = 'warning' THEN c.weight * 0.5
          ELSE 0
        END
      )) AS calc_score
    FROM public.unit_rating_items i
    JOIN public.evaluation_criteria c ON c.id = i.criterion_id
    GROUP BY i.rating_id
  ) sub
  WHERE r.id = sub.rating_id;

  RAISE NOTICE 'Successfully synchronized TC-08 and CMS audit ratings for all 51 units.';
END $$;
