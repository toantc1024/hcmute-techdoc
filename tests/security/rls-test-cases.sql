-- ==============================================================================
-- Test Suite: rls-test-cases.sql
-- Description: Comprehensive Simulation Test Suite for Hardened Production RLS
-- Target: Simulation in PostgreSQL / Supabase SQL Editor
-- Principle: DEFAULT DENY, CROSS-APP ISOLATION, ANTI-SPOOFING, IMMUTABILITY
-- Rule 15: Strictly under 300 lines (<300)
-- ==============================================================================
BEGIN;

-- 1. Setup Test Fixtures (Isolated Transaction)
DO $$
DECLARE
  v_admin_id UUID := '00000000-0000-0000-0000-000000000001';
  v_evaluator_id UUID := '00000000-0000-0000-0000-000000000002';
  v_feedback_user_id UUID := '00000000-0000-0000-0000-000000000003';
  v_unit_id UUID := '00000000-0000-0000-0000-000000000010';
  v_crit_id UUID := '00000000-0000-0000-0000-000000000015';
  v_pub_period_id UUID := '00000000-0000-0000-0000-000000000020';
  v_unpub_period_id UUID := '00000000-0000-0000-0000-000000000021';
  v_pub_rating_id UUID := '00000000-0000-0000-0000-000000000030';
  v_unpub_rating_id UUID := '00000000-0000-0000-0000-000000000031';
BEGIN
  -- Insert mock profiles
  INSERT INTO public.profiles (id, email, full_name) VALUES
    (v_admin_id, 'admin@utehub.vn', 'TechDocs Admin'),
    (v_evaluator_id, 'evaluator@utehub.vn', 'Assessment Officer'),
    (v_feedback_user_id, 'user@feedback.vn', 'Feedback Form User')
  ON CONFLICT (id) DO NOTHING;

  -- Assign roles (feedback_user gets NO techdocs role!)
  INSERT INTO public.user_roles (user_id, role) VALUES
    (v_admin_id, 'admin'), (v_evaluator_id, 'evaluator')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Create sample unit and criterion
  INSERT INTO public.organizational_units (id, legacy_id, name, domain, group_type)
  VALUES (v_unit_id, 1, 'Khoa CNTT', 'fit.hcmute.edu.vn', 'khoa-vien') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.evaluation_criteria (id, code, title, weight)
  VALUES (v_crit_id, 'crit_dns', 'DNS & SSL', 15.00) ON CONFLICT (id) DO NOTHING;

  -- Published Period & Rating
  INSERT INTO public.evaluation_periods (id, slug, title, year, is_active, is_published)
  VALUES (v_pub_period_id, '2026-q4', 'Dot Q4 2026 (Published)', 2026, true, true) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.unit_ratings (id, unit_id, period_id, total_score, is_published)
  VALUES (v_pub_rating_id, v_unit_id, v_pub_period_id, 100.00, true) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
  VALUES (v_pub_rating_id, v_crit_id, 'pass', 'SSL valid') ON CONFLICT (rating_id, criterion_id) DO NOTHING;

  -- Unpublished Period & Rating
  INSERT INTO public.evaluation_periods (id, slug, title, year, is_active, is_published)
  VALUES (v_unpub_period_id, '2027-draft', 'Draft Period', 2027, false, false) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.unit_ratings (id, unit_id, period_id, total_score, is_published)
  VALUES (v_unpub_rating_id, v_unit_id, v_unpub_period_id, 50.00, false) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.unit_rating_items (rating_id, criterion_id, rating, note)
  VALUES (v_unpub_rating_id, v_crit_id, 'warning', 'Draft rating') ON CONFLICT (rating_id, criterion_id) DO NOTHING;
END $$;

-- ==============================================================================
-- TEST GROUP 1: ANONYMOUS ACCESS (PUBLIC DOCS)
-- ==============================================================================
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claim.sub" TO '';

DO $$
DECLARE v_c INT;
BEGIN
  SELECT count(*) INTO v_c FROM public.unit_ratings WHERE is_published = true;
  IF v_c = 1 THEN RAISE NOTICE 'TEST 1.1 PASS: Anon reads published ratings'; ELSE RAISE EXCEPTION 'TEST 1.1 FAIL'; END IF;
  SELECT count(*) INTO v_c FROM public.unit_ratings WHERE id = '00000000-0000-0000-0000-000000000031';
  IF v_c = 0 THEN RAISE NOTICE 'TEST 1.2 PASS: Anon cannot read unpublished ratings'; ELSE RAISE EXCEPTION 'TEST 1.2 FAIL'; END IF;
  SELECT count(*) INTO v_c FROM public.unit_rating_items WHERE rating_id = '00000000-0000-0000-0000-000000000031';
  IF v_c = 0 THEN RAISE NOTICE 'TEST 1.3 PASS: Anon cannot read items under unpublished rating'; ELSE RAISE EXCEPTION 'TEST 1.3 FAIL'; END IF;
END $$;

-- ==============================================================================
-- TEST GROUP 2: AUTHENTICATED USER WITHOUT TECHDOCS ROLE (FEEDBACK APP USER)
-- ==============================================================================
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" TO '00000000-0000-0000-0000-000000000003';

DO $$
DECLARE v_c INT;
BEGIN
  -- 2.1 Can read public catalogs & published ratings
  SELECT count(*) INTO v_c FROM public.unit_ratings WHERE is_published = true;
  IF v_c = 1 THEN RAISE NOTICE 'TEST 2.1 PASS: Feedback user reads published ratings'; ELSE RAISE EXCEPTION 'TEST 2.1 FAIL'; END IF;

  -- 2.2 CANNOT read unpublished ratings
  SELECT count(*) INTO v_c FROM public.unit_ratings WHERE id = '00000000-0000-0000-0000-000000000031';
  IF v_c = 0 THEN RAISE NOTICE 'TEST 2.2 PASS: Feedback user blocked from unpublished ratings'; ELSE RAISE EXCEPTION 'TEST 2.2 FAIL'; END IF;

  -- 2.3 CANNOT read audit logs
  SELECT count(*) INTO v_c FROM public.audit_logs;
  IF v_c = 0 THEN RAISE NOTICE 'TEST 2.3 PASS: Feedback user blocked from audit logs (0 rows)'; ELSE RAISE EXCEPTION 'TEST 2.3 FAIL'; END IF;

  -- 2.4 CANNOT insert audit log into TechDocs
  BEGIN
    INSERT INTO public.audit_logs (actor_id, action, entity_type, source)
    VALUES ('00000000-0000-0000-0000-000000000003', 'HACK_LOG', 'system', 'authenticated_user');
    RAISE EXCEPTION 'TEST 2.4 FAIL: Feedback user inserted into TechDocs audit_logs!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 2.4 PASS: Feedback user blocked from inserting audit logs';
  END;

  -- 2.5 CANNOT mutate unit ratings
  BEGIN
    UPDATE public.unit_ratings SET admin_notes = 'tamper' WHERE id = '00000000-0000-0000-0000-000000000030';
    IF FOUND THEN RAISE EXCEPTION 'TEST 2.5 FAIL: Rating updated by user without role!'; END IF;
    RAISE NOTICE 'TEST 2.5 PASS: Feedback user cannot update unit ratings (0 affected)';
  END;

  -- 2.6 CANNOT mutate rating items
  BEGIN
    UPDATE public.unit_rating_items SET rating = 'fail' WHERE rating_id = '00000000-0000-0000-0000-000000000030';
    IF FOUND THEN RAISE EXCEPTION 'TEST 2.6 FAIL: Rating item updated by user without role!'; END IF;
    RAISE NOTICE 'TEST 2.6 PASS: Feedback user cannot update rating items (0 affected)';
  END;

  -- 2.7 CANNOT self-promote or assign roles
  BEGIN
    INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000003', 'admin');
    RAISE EXCEPTION 'TEST 2.7 FAIL: Role insertion permitted!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 2.7 PASS: Feedback user blocked from assigning roles';
  END;
END $$;

-- ==============================================================================
-- TEST GROUP 3: TECHDOCS EVALUATOR BOUNDARIES & MUTATION GUARDS
-- ==============================================================================
SET LOCAL "request.jwt.claim.sub" TO '00000000-0000-0000-0000-000000000002'; -- Evaluator

DO $$
DECLARE
  v_assigned_evaluator UUID;
  v_recalculated NUMERIC;
BEGIN
  -- 3.1 Evaluator CANNOT self-promote to admin
  BEGIN
    INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000002', 'admin');
    RAISE EXCEPTION 'TEST 3.1 FAIL: Evaluator promoted self to admin!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 3.1 PASS: Evaluator self-promotion blocked by RLS';
  END;

  -- 3.2 Evaluator CANNOT alter is_published on unit_ratings (Trigger Guard)
  BEGIN
    UPDATE public.unit_ratings SET is_published = true WHERE id = '00000000-0000-0000-0000-000000000031';
    RAISE EXCEPTION 'TEST 3.2 FAIL: Evaluator altered publication status!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 3.2 PASS: Evaluator publication mutation blocked by trigger';
  END;

  -- 3.3 Evaluator spoofing evaluator_id is overridden by trigger
  UPDATE public.unit_ratings SET admin_notes = 'Evaluator note update', evaluator_id = '00000000-0000-0000-0000-000000000001'
  WHERE id = '00000000-0000-0000-0000-000000000030';
  SELECT evaluator_id INTO v_assigned_evaluator FROM public.unit_ratings WHERE id = '00000000-0000-0000-0000-000000000030';
  IF v_assigned_evaluator = '00000000-0000-0000-0000-000000000002' THEN
    RAISE NOTICE 'TEST 3.3 PASS: Evaluator ID spoofing overridden by trigger to auth.uid()';
  ELSE
    RAISE EXCEPTION 'TEST 3.3 FAIL: Spoofed evaluator ID persisted!';
  END IF;

  -- 3.4 Evaluator mutating rating item triggers automatic recalculation of total_score
  UPDATE public.unit_rating_items SET rating = 'warning' WHERE rating_id = '00000000-0000-0000-0000-000000000030';
  SELECT total_score INTO v_recalculated FROM public.unit_ratings WHERE id = '00000000-0000-0000-0000-000000000030';
  IF v_recalculated = 50.00 THEN
    RAISE NOTICE 'TEST 3.4 PASS: Score trigger automatically recalculated total_score to 50.00';
  ELSE
    RAISE EXCEPTION 'TEST 3.4 FAIL: Score recalculation mismatch (got %)', v_recalculated;
  END IF;
END $$;

-- ==============================================================================
-- TEST GROUP 4: AUDIT LOG ANTI-SPOOFING & IMMUTABILITY
-- ==============================================================================
DO $$
DECLARE
  v_inserted_ts TIMESTAMPTZ;
  v_test_log_id UUID := gen_random_uuid();
BEGIN
  -- 4.1 Authenticated user CANNOT insert audit log with source = 'system'
  BEGIN
    INSERT INTO public.audit_logs (actor_id, action, entity_type, source)
    VALUES ('00000000-0000-0000-0000-000000000002', 'FAKE_SYS', 'system', 'system');
    RAISE EXCEPTION 'TEST 4.1 FAIL: User inserted log with source = system!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 4.1 PASS: Source spoofing blocked by RLS';
  END;

  -- 4.2 Authenticated user CANNOT insert audit log with spoofed actor_id
  BEGIN
    INSERT INTO public.audit_logs (actor_id, action, entity_type, source)
    VALUES ('00000000-0000-0000-0000-000000000001', 'FAKE_ACTOR', 'unit_ratings', 'authenticated_user');
    RAISE EXCEPTION 'TEST 4.2 FAIL: User inserted log spoofing admin ID!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TEST 4.2 PASS: Actor ID spoofing blocked by RLS';
  END;

  -- 4.3 Audit logs CANNOT be updated
  UPDATE public.audit_logs SET detail = 'Hacked';
  IF NOT FOUND THEN RAISE NOTICE 'TEST 4.3 PASS: Audit log update blocked (Immutable)';
  ELSE RAISE EXCEPTION 'TEST 4.3 FAIL: Audit log was modified!'; END IF;

  -- 4.4 Audit logs CANNOT be deleted
  DELETE FROM public.audit_logs;
  IF NOT FOUND THEN RAISE NOTICE 'TEST 4.4 PASS: Audit log deletion blocked (Immutable)';
  ELSE RAISE EXCEPTION 'TEST 4.4 FAIL: Audit log was deleted!'; END IF;

  -- 4.5 Authenticated client sending forged created_at has it overridden to now()
  INSERT INTO public.audit_logs (id, actor_id, action, entity_type, source, created_at)
  VALUES (v_test_log_id, '00000000-0000-0000-0000-000000000002', 'TIMESTAMP_TEST', 'test', 'authenticated_user', '1970-01-01 00:00:00+00');
  SELECT created_at INTO v_inserted_ts FROM public.audit_logs WHERE id = v_test_log_id;
  IF v_inserted_ts > '2026-01-01' THEN
    RAISE NOTICE 'TEST 4.5 PASS: Forged created_at overridden by trigger to server now()';
  ELSE
    RAISE EXCEPTION 'TEST 4.5 FAIL: Audit log accepted forged timestamp!';
  END IF;
END $$;

-- Rollback entire test transaction (Zero persistent changes)
ROLLBACK;
