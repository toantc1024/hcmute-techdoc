-- ==============================================================================
-- Migration: 20261021000000_sync_live_web_audit_status.sql
-- Description: Synchronize live DNS/HTTP audit results for all 51 units.
-- Date: 2026-10-21
-- Invariants:
--   - Security First & RLS compliant.
--   - Preserves historical rating entries.
-- ==============================================================================

DO $$
BEGIN
  -- 1. Fix truncated domain for Unit #48
  UPDATE public.organizational_units
  SET domain = 'daotaonganhantructuyen.hcmute.edu.vn', updated_at = now()
  WHERE legacy_id = 48;

  -- 2. Update is_new_web based on physical DNS resolution to IP 203.113.147.189
  -- 19 units officially pointed to .189:
  UPDATE public.organizational_units
  SET is_new_web = true, updated_at = now()
  WHERE legacy_id IN (
    4,  -- Khoa Kinh tế (fe.hcmute.edu.vn)
    12, -- Khoa Mỹ thuật và Truyền thông (fam.hcmute.edu.vn)
    13, -- Khoa Khoa học Ứng dụng (fas.hcmute.edu.vn)
    16, -- Phòng Công tác sinh viên (sao.hcmute.edu.vn)
    20, -- Phòng Quan hệ Doanh nghiệp (pr.hcmute.edu.vn)
    22, -- Phòng QLĐT Xây dựng và Đấu thầu (cpm.hcmute.edu.vn)
    24, -- Phòng QTTH và Truyền thông (bmc.hcmute.edu.vn)
    26, -- Phòng Hành chính – Tổng hợp (adao.hcmute.edu.vn)
    28, -- Phòng Kế hoạch tài chính (fpo.hcmute.edu.vn)
    31, -- Ban Quản lý Ký túc xá (ktx.hcmute.edu.vn)
    35, -- Trung tâm GD Thể chất (cped.hcmute.edu.vn)
    37, -- TT Sáng tạo Khởi nghiệp (cisat.hcmute.edu.vn)
    42, -- TT GD Quốc phòng và An ninh (ttgdqpan.hcmute.edu.vn)
    43, -- Trung tâm Robot Thông minh (smroce.hcmute.edu.vn)
    45, -- Công đoàn Trường (congdoan.hcmute.edu.vn)
    47, -- Hội Cựu sinh viên (alumni.hcmute.edu.vn)
    48, -- Đào tạo ngắn hạn online (daotaonganhantructuyen.hcmute.edu.vn)
    50, -- Rèn luyện và CTXH (drlctxh.hcmute.edu.vn)
    51  -- Hội đồng Giáo sư cơ sở (hdgscs.hcmute.edu.vn)
  );

  -- Units temporarily on .181 or dedicated hosting (awaiting accreditation / student deadline)
  UPDATE public.organizational_units
  SET is_new_web = false, updated_at = now()
  WHERE legacy_id NOT IN (
    4, 12, 13, 16, 20, 22, 24, 26, 28, 31, 35, 37, 42, 43, 45, 47, 48, 50, 51
  );

  RAISE NOTICE 'Successfully updated live web audit status for 51 units in Supabase.';
END $$;
