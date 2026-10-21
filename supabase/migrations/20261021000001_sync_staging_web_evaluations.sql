-- ==============================================================================
-- Migration: 20261021000001_sync_staging_web_evaluations.sql
-- Description: Synchronize evaluation ratings for units maintaining old web (.181)
--              using their live staging new website ({subdomain}1.hcmute.edu.vn on .189).
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
  -- Get active evaluation period
  SELECT id INTO v_period_id FROM public.evaluation_periods WHERE is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    SELECT id INTO v_period_id FROM public.evaluation_periods ORDER BY created_at DESC LIMIT 1;
  END IF;

  -- Unit #1: Viện Sư phạm Kỹ thuật (ite.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 1;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (ite1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #2: Phân hiệu Bình Phước (binhphuoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 2;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (binhphuoc1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #3: Khoa Điện - Điện tử (feee.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 3;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (feee1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #5: Khoa Cơ khí (fme.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 5;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (fme1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #6: Khoa Giao thông & NL (feet.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 6;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (feet1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #7: Khoa Hóa & KH Sự sống (fcft.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 7;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (fcft1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #9: Khoa Xây dựng (fce.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 9;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (fce1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #14: Khoa Ngoại ngữ (ffl.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 14;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (ffl1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #17: Phòng Đào tạo (aao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 17;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (aao1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #18: P. Đào tạo - VLVH (nmo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 18;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (nmo1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #19: Phòng Khảo thí & ĐBCL (qao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 19;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (qao1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #21: Phòng Quan hệ Quốc tế (oia.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 21;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (oia1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #23: Phòng Quản trị CSVC (emo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 23;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (emo1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #25: Phòng Tổ chức – Nhân sự (tcns.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 25;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (tcns1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #27: Phòng Khoa học Công nghệ (stiao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 27;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (stiao1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #29: Văn phòng Đảng uỷ (vanphongdanguy.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 29;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (vanphongdanguy1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #30: Trạm Y tế (hd.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 30;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (hd1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #33: Viện Sau đại học (sdh.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 33;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (sdh1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #34: Thư viện Trường (lib.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 34;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (lib1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #36: TT Nghiên cứu NL Tái tạo (rerc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 36;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (rerc1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #38: Trung tâm TT – Máy tính (iic.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 38;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (iic1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #39: Trung tâm Tin học (trungtamtinhoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 39;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (trungtamtinhoc1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #40: Trung tâm Ngoại ngữ (ttnn.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 40;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (ttnn1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #41: TT Học liệu và Dạy học số (hldhs.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 41;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (hldhs1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  -- Unit #44: Tạp chí KHGD Kỹ thuật (jte.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 44;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (jte.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #46: Đoàn Thanh niên - Hội SV (tuoitre.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 46;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Chưa khởi tạo web mới staging (tuoitre1.hcmute.edu.vn). Tên miền chính đang trỏ web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
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
  END IF;

  -- Unit #49: Đào tạo từ xa (daotaotuxa.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 49;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 0.00, 'Đã chấm theo web mới staging (daotaotuxa1.hcmute.edu.vn). Tên miền chính tạm duy trì web cũ (.181).', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
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
  END IF;

  RAISE NOTICE 'Successfully synchronized staging evaluations for units on old web.';
END $$;
