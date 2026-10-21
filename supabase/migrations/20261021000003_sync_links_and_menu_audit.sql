-- ==============================================================================
-- Migration: 20261021000003_sync_links_and_menu_audit.sql
-- Description: Synchronize homepage status (200/404) and link audit findings (TC-05 Luồng C)
--              including stray hcmutertic links, broken 404 links, and placeholder links.
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
  -- 1. Get active evaluation period
  SELECT id INTO v_period_id FROM public.evaluation_periods WHERE is_active = true LIMIT 1;
  IF v_period_id IS NULL THEN
    SELECT id INTO v_period_id FROM public.evaluation_periods ORDER BY created_at DESC LIMIT 1;
  END IF;

  -- 2. Synchronize ratings and notes for all 51 units
  -- Unit #1: Viện Sư phạm Kỹ thuật (ite.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 1;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 110 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #2: Phân hiệu Bình Phước (binhphuoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 2;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 107 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #3: Khoa Điện - Điện tử (feee.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 3;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 119 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #4: Khoa Kinh tế (fe.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 4;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 109 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #5: Khoa Cơ khí (fme.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 5;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 116 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #6: Khoa Giao thông & NL (feet.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 6;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 105 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #7: Khoa Hóa & KH Sự sống (fcft.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 7;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 85.00, 'CMS: 13 chuyên mục, 15 bài viết. Sót link hcmutertic.com. Quyền Admin: OK. [Web mới: fcft1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 85.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 1 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #8: Khoa Công nghệ TT (fit.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 8;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 22 chuyên mục, 72 bài viết. Có link 404 (/fit.hcmute.edu.vn). Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Có 1 link lỗi 404 (/fit.hcmute.edu.vn).')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #9: Khoa Xây dựng (fce.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 9;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 116 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #10: Khoa Đào tạo Tiên tiến (fae.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 10;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 68.00, 'CMS: 17 chuyên mục, 33 bài viết. Trang chủ 404 (chờ DNS .189). Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 68.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Trang chủ chưa truy cập được (HTTP 404), chờ trỏ DNS về IP .189.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #11: Khoa Chính trị và Luật (fpi.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 11;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 39 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #12: Khoa Mỹ thuật & TT (fam.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 12;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 105 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #13: Khoa Khoa học Ứng dụng (fas.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 13;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 107 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #14: Khoa Ngoại ngữ (ffl.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 14;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #15: Viện Đào tạo Quốc tế (iie.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 15;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 5 chuyên mục, 18 bài viết. Trang chủ 404 (chờ DNS .189). Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Trang chủ chưa truy cập được (HTTP 404), chờ trỏ DNS về IP .189.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #16: Phòng Công tác sinh viên (sao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 16;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 38 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #17: Phòng Đào tạo (aao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 17;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 47 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #18: P. Đào tạo - VLVH (nmo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 18;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 13 chuyên mục, 5 bài viết. Sót link hcmutertic.com. Quyền Admin: OK. [Web mới: nmo1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 4 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #19: Phòng Khảo thí & ĐBCL (qao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 19;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 35 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #20: Phòng Quan hệ Doanh nghiệp (pr.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 20;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 103 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #21: Phòng Quan hệ Quốc tế (oia.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 21;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 101 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #22: Phòng QLĐT XD & Đấu thầu (cpm.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 22;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 46 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #23: Phòng Quản trị CSVC (emo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 23;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 32 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #24: Phòng QTTH & Truyền thông (bmc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 24;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 93.00, 'CMS: 18 chuyên mục, 41 bài viết. Sót link hcmutertic.com. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 93.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 2 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #25: Phòng Tổ chức – Nhân sự (tcns.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 25;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 73 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #26: Phòng Hành chính – Tổng hợp (adao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 26;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 73 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #27: Phòng Khoa học Công nghệ (stiao.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 27;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 88 chuyên mục, 3 bài viết. Sót link hcmutertic.com. Quyền Admin: OK. [Web mới: stiao1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 2 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #28: Phòng Kế hoạch tài chính (fpo.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 28;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 57.00, 'CMS: 2 chuyên mục, 4 bài viết. Quyền Admin: OK.', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 57.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 37 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #29: Văn phòng Đảng uỷ (vanphongdanguy.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 29;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #30: Trạm Y tế (hd.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 30;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 46 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #31: Ban Quản lý Ký túc xá (ktx.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 31;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 42 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #32: Phòng Thí nghiệm mở (openlab.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 32;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 0 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #33: Viện Sau đại học (sdh.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 33;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 20 chuyên mục, 3 bài viết. Sót link hcmutertic.com. Quyền Admin: OK. [Web mới: sdh1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 2 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #34: Thư viện Trường (lib.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 34;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 68 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #35: Trung tâm GD Thể chất (cped.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 35;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 39 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #36: TT Nghiên cứu NL Tái tạo (rerc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 36;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 18.00, 'CMS: 0 chuyên mục, 0 bài viết. Trang chủ 404 (chờ DNS .189). Quyền Admin: OK. [Web mới: rerc.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 18.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Trang chủ chưa truy cập được (HTTP 404), chờ trỏ DNS về IP .189.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #37: TT Sáng tạo Khởi nghiệp (cisat.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 37;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 37 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #38: Trung tâm TT – Máy tính (iic.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 38;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #39: Trung tâm Tin học (trungtamtinhoc.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 39;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #40: Trung tâm Ngoại ngữ (ttnn.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 40;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 25.00, 'CMS: 0 chuyên mục, 0 bài viết. 9 link giữ chỗ. Quyền Admin: OK. [Web mới: ttnn1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 25.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Có 9 link menu đang để giữ chỗ (# hoặc javascript:void).')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #41: TT Học liệu và Dạy học số (hldhs.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 41;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
    INSERT INTO public.unit_ratings (unit_id, period_id, total_score, admin_notes, is_published)
    VALUES (v_unit_id, v_period_id, 78.00, 'CMS: 11 chuyên mục, 3 bài viết. Sót link hcmutertic.com. Quyền Admin: OK. [Web mới: hldhs1.hcmute.edu.vn]', true)
    ON CONFLICT (unit_id, period_id) DO UPDATE SET
      total_score = 78.00,
      admin_notes = EXCLUDED.admin_notes,
      updated_at = now()
    RETURNING id INTO v_rating_id;

    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_dns';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Còn sót 3 link trỏ về server test cũ (hcmutertic.com), cần đổi sang relative link.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #42: TT GD Quốc phòng và AN (ttgdqpan.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 42;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 60 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #43: Trung tâm Robot Thông minh (smroce.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 43;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 30 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #44: Tạp chí KHGD Kỹ thuật (jte.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 44;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #45: Công đoàn Trường (congdoan.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 45;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 105 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #46: Đoàn Thanh niên - Hội SV (tuoitre.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 46;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      DELETE FROM public.unit_rating_items WHERE rating_id = v_rating_id AND criterion_id = v_crit_id;
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #47: Hội Cựu sinh viên (alumni.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 47;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 30 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #48: Đào tạo ngắn hạn online (daotaonganhantructuyen.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 48;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 30 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #49: Đào tạo từ xa (daotaotuxa.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 49;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = false, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 58 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #50: Rèn luyện và CTXH (drlctxh.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 50;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', 'Kiểm tra 30 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'fail', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'fail', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'warning', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'warning', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- Unit #51: Hội đồng Giáo sư cơ sở (hdgscs.hcmute.edu.vn)
  SELECT id INTO v_unit_id FROM public.organizational_units WHERE legacy_id = 51;
  IF v_unit_id IS NOT NULL AND v_period_id IS NOT NULL THEN
    UPDATE public.organizational_units SET is_new_web = true, updated_at = now() WHERE id = v_unit_id;
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
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_brand';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_a';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_b';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_luong_c';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', 'Kiểm tra 32 link: 100% thông suốt, không có link 404.')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_security';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_info';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
    SELECT id INTO v_crit_id FROM public.evaluation_criteria WHERE code = 'crit_admin';
    IF v_crit_id IS NOT NULL THEN
      INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
      VALUES (v_rating_id, v_crit_id, 'pass', '')
      ON CONFLICT (rating_id, criterion_id) DO UPDATE SET rating = 'pass', note = EXCLUDED.note, updated_at = now();
    END IF;
  END IF;

  -- 3. Recalculate all unit_ratings total_score based on normalized criteria weights
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

  RAISE NOTICE 'Successfully synchronized homepage status and link audit for all 51 units.';
END $$;
