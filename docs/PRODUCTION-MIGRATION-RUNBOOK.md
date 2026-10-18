# Production Migration Runbook (Phase 3B)

**Project:** UTEHub TechDocs (`doc.utehub.vn`)  
**Execution Environment:** Supabase Cloud Dashboard + Next.js Server  
**Execution Safety:** Multi-Checkpoint Gate with Rollback Triggers & Security Verification Gate  

---

## Pre-Flight Checklist

Before executing any checkpoint:
* [ ] No destructive commands (`DROP TABLE`, `TRUNCATE`) are present.
* [ ] The legacy table `techdoc_admin_state` is preserved untouched throughout all checkpoints.
* [ ] The project administrator is logged in to [app.supabase.com](https://app.supabase.com).

---

## Checkpoint 0: Backup & Recovery Readiness

* **Where to Open:** Supabase Cloud Dashboard → Project Settings → **Database** → **Backups**.
* **What to Check:** Verify that Point-in-Time Recovery (PITR) or Daily Backups are active. Note the timestamp of the latest backup.
* **PASS Criteria:** Latest backup is available within the last 24 hours.
* **FAIL / STOP Action:** Do NOT proceed. Manually trigger a backup snapshot if using Pro tier, or export table `techdoc_admin_state` as CSV/JSON via Table Editor before continuing.

---

## Checkpoint 1: Supabase Auth Verification

* **Where to Open:** Supabase Dashboard → **Authentication** → **Providers** → **Email**.
* **What to Check:**
  * Confirm **Email Provider** is `Enabled`.
  * Confirm **Confirm email** is set according to institutional policy.
  * Confirm **Allow new users to sign up** is set to `Disabled` (Restricted registration for administrative portal).
* **PASS Criteria:** Email auth active; public self-registration restricted.
* **FAIL / STOP Action:** Adjust settings in Dashboard. Do not proceed until Auth provider is configured.

---

## Checkpoint 2: Schema & RLS Migration (Migration A)

* **Where to Open:** Supabase Dashboard → **SQL Editor** → Click **New Query**.
* **SQL to Run:** Copy and paste the entire contents of:
  `supabase/migrations/20261017000001_security_schema_candidate.sql`
* **Expected Output:** `Success. No rows returned.` (Execution time: ~500ms).
* **Verification Query:**
  ```sql
  SELECT count(*) FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'user_roles', 'organizational_units', 'evaluation_criteria', 'evaluation_periods', 'unit_ratings', 'unit_rating_items', 'doc_sections', 'project_phases', 'audit_logs');
  ```
* **PASS Criteria:** Query returns exactly `10`. All 10 tables exist with RLS enabled.
* **FAIL / ROLLBACK Action:** Migration A runs atomically inside `BEGIN ... COMMIT`. If any error occurs, all changes are rolled back automatically. The legacy table `techdoc_admin_state` remains unaffected. Stop and report.

---

## Checkpoint 3: STOP GATE — Security Verification Gate

> [!CRITICAL]
> **STOP GATE:** DO NOT RUN MIGRATION B YET. Run the following verification query in the SQL Editor to prove security barriers hold before inserting any production data.

* **Where to Open:** Supabase Dashboard → **SQL Editor**.
* **SQL to Run:**
  ```sql
  -- 1. Verify Anon CANNOT execute role helper functions
  DO $$
  BEGIN
    PERFORM has_function_privilege('anon', 'public.is_admin()', 'EXECUTE');
    IF has_function_privilege('anon', 'public.is_admin()', 'EXECUTE') THEN
      RAISE EXCEPTION 'SECURITY FAIL: Anon has EXECUTE privilege on is_admin()!';
    END IF;
    RAISE NOTICE 'CHECK 1 PASS: Anon function execute revoked.';
  END $$;

  -- 2. Verify RLS is enabled on all 10 tables
  DO $$
  DECLARE
    v_rls_count INT;
  BEGIN
    SELECT count(*) INTO v_rls_count FROM pg_tables
    WHERE schemaname = 'public' 
      AND rowsecurity = true
      AND tablename IN ('profiles', 'user_roles', 'organizational_units', 'evaluation_criteria', 'evaluation_periods', 'unit_ratings', 'unit_rating_items', 'doc_sections', 'project_phases', 'audit_logs');
    IF v_rls_count != 10 THEN
      RAISE EXCEPTION 'SECURITY FAIL: Expected 10 tables with RLS, found %', v_rls_count;
    END IF;
    RAISE NOTICE 'CHECK 2 PASS: All 10 tables have Row Level Security enabled.';
  END $$;
  ```
* **PASS Criteria:** Both notices output `CHECK 1 PASS` and `CHECK 2 PASS`.
* **FAIL / STOP Action:** Do NOT proceed to admin bootstrap or data migration. Investigate policy syntax.

---

## Checkpoint 4: Initial Admin Account Bootstrap

* **Where to Open:** 
  1. Supabase Dashboard → **Authentication** → **Users** → Click **Add User** (Create user with target admin email and secure password).
  2. Copy the generated **User UUID** (e.g., `a1b2c3d4-...`).
  3. Supabase Dashboard → **SQL Editor**.
* **SQL to Run:**
  ```sql
  INSERT INTO public.profiles (id, email, full_name)
  SELECT id, email, 'System Administrator'
  FROM auth.users WHERE id = '<PASTE_USER_UUID_HERE>'
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES ('<PASTE_USER_UUID_HERE>', 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  ```
* **Verification Query:**
  ```sql
  SELECT u.email, r.role FROM auth.users u
  JOIN public.user_roles r ON u.id = r.user_id
  WHERE u.id = '<PASTE_USER_UUID_HERE>';
  ```
* **PASS Criteria:** Returns 1 row showing the user with role `'admin'`.
* **FAIL / STOP Action:** Ensure the user exists in `auth.users` before re-running role assignment.

---

## Checkpoint 5: Legacy Data Migration (Migration B)

* **Where to Open:** Supabase Dashboard → **SQL Editor**.
* **SQL to Run:** Copy and paste the entire contents of:
  `supabase/migrations/20261017000002_data_migration_candidate.sql`
* **Expected Output:** Notice outputs indicating:
  * `Step 3: Migrated evaluation criteria.`
  * `Step 4: Migrated units and unit rating items.`
  * `Step 5: Migrated doc sections.`
  * `Step 6: Migrated project phases.`
  * `Score Reconciliation: 100% score parity verified with legacy dataset.`
* **PASS Criteria:** Script completes with exit status success inside atomic transaction.
* **FAIL / ROLLBACK Action:** Data migration is wrapped in `BEGIN ... COMMIT`. If an error occurs, it rolls back cleanly. Legacy table remains untouched.

---

## Checkpoint 6: Data Reconciliation Verification

* **Where to Open:** Supabase Dashboard → **SQL Editor**.
* **SQL to Run:**
  ```sql
  SELECT 'organizational_units' AS table_name, count(*) AS total_rows FROM public.organizational_units
  UNION ALL
  SELECT 'evaluation_criteria', count(*) FROM public.evaluation_criteria
  UNION ALL
  SELECT 'evaluation_periods', count(*) FROM public.evaluation_periods
  UNION ALL
  SELECT 'unit_ratings', count(*) FROM public.unit_ratings
  UNION ALL
  SELECT 'unit_rating_items', count(*) FROM public.unit_rating_items
  UNION ALL
  SELECT 'doc_sections', count(*) FROM public.doc_sections
  UNION ALL
  SELECT 'project_phases', count(*) FROM public.project_phases;
  ```
* **PASS Criteria:**
  * `organizational_units`: Exactly `51`
  * `evaluation_criteria`: Exactly `7`
  * `evaluation_periods`: Exactly `1`
  * `unit_ratings`: Exactly `51`
  * `unit_rating_items`: `357` (51 units × 7 criteria)
  * `doc_sections`: Exactly `30`
  * `project_phases`: Exactly `4`
* **FAIL / STOP Action:** If counts differ, compare missing domains against legacy `techdoc_admin_state`.

---

## Checkpoint 7: Application Integration & Cutover Gate

* **Action:**
  1. Update Next.js application to query normalized tables instead of legacy JSON blob.
  2. Enable `/login` route using Supabase Auth.
  3. Decommission browser SHA-256 pseudo-auth.
  4. Retain legacy `techdoc_admin_state` as read-only backup for 30 days before deprecation.
