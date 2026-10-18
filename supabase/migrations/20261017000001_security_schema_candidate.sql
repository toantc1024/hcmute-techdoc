-- ==============================================================================
-- Migration A: 20261017000001_security_schema_candidate.sql
-- Description: Hardened Production Schema & RLS Policies (Namespaced & Isolated)
-- Target: Supabase Cloud (Project: iyrahtrfypjbzngmuera - Shared with ute-feedback-form)
-- Status: LOCAL CANDIDATE — ZERO CHANGES TO configs, feedbacks, social_listening
-- Rule 15: Strictly under 300 lines (<300)
-- ==============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'evaluator', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role)
);

-- 2. Secure Helper Functions (Namespaced to techdocs_ to prevent collision)
CREATE OR REPLACE FUNCTION public.techdocs_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.techdocs_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = required_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.techdocs_is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.techdocs_has_role(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.techdocs_is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.techdocs_has_role(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.techdocs_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.techdocs_has_role(TEXT) TO authenticated;

-- 3. Catalogs: Units, Criteria, Periods, Ratings, Sections, Phases, Audit
CREATE TABLE IF NOT EXISTS public.organizational_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id INT UNIQUE NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    group_type TEXT NOT NULL CHECK (group_type IN ('khoa-vien', 'phong-ban', 'trung-tam', 'doan-the')),
    group_label TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    is_new_web BOOLEAN NOT NULL DEFAULT false,
    staff_in_charge TEXT NOT NULL DEFAULT '',
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    display_code TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    description TEXT,
    weight NUMERIC(5, 2) NOT NULL DEFAULT 15.00 CHECK (weight >= 0),
    pass_condition TEXT,
    warning_condition TEXT,
    fail_condition TEXT,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.evaluation_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    year INT NOT NULL CHECK (year >= 2020),
    is_active BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.unit_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.organizational_units(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES public.evaluation_periods(id) ON DELETE CASCADE,
    total_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (total_score >= 0 AND total_score <= 100),
    admin_notes TEXT NOT NULL DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT false,
    evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(unit_id, period_id)
);

CREATE TABLE IF NOT EXISTS public.unit_rating_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating_id UUID NOT NULL REFERENCES public.unit_ratings(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES public.evaluation_criteria(id) ON DELETE RESTRICT,
    rating TEXT NOT NULL CHECK (rating IN ('pass', 'warning', 'fail')),
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(rating_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS public.doc_sections (
    section_key TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    chapter_number INT NOT NULL DEFAULT 1,
    chapter_title TEXT NOT NULL DEFAULT '',
    page_title TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    luong_type TEXT NOT NULL CHECK (luong_type IN ('A', 'B', 'C', 'TONG_QUAN', 'HE_THONG')),
    is_visible BOOLEAN NOT NULL DEFAULT true,
    view_count INT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    reading_time_minutes INT NOT NULL DEFAULT 1,
    tags TEXT[] NOT NULL DEFAULT '{}',
    last_updated TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_phases (
    phase_number INT PRIMARY KEY CHECK (phase_number >= 1),
    title TEXT NOT NULL,
    time_frame TEXT NOT NULL DEFAULT '',
    target_description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'upcoming')),
    completion_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (completion_rate >= 0 AND completion_rate <= 100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    detail TEXT NOT NULL DEFAULT '',
    status_level TEXT NOT NULL DEFAULT 'info' CHECK (status_level IN ('info', 'warning', 'danger')),
    source TEXT NOT NULL DEFAULT 'authenticated_user' CHECK (source IN ('authenticated_user', 'system', 'legacy_import')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_audit_metadata_size CHECK (octet_length(metadata::text) <= 50000)
);

-- 4. Triggers: Evaluator Guard & Automated Score Calculation (Namespaced)
CREATE OR REPLACE FUNCTION public.techdocs_check_unit_rating_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.is_published IS DISTINCT FROM NEW.is_published) AND NOT public.techdocs_is_admin() THEN
    RAISE EXCEPTION 'Only administrators can alter publication status.';
  END IF;
  IF NOT public.techdocs_is_admin() THEN
    NEW.evaluator_id := auth.uid();
  END IF;
  IF (OLD.unit_id IS DISTINCT FROM NEW.unit_id OR OLD.period_id IS DISTINCT FROM NEW.period_id) AND NOT public.techdocs_is_admin() THEN
    RAISE EXCEPTION 'Cannot reassign unit rating to another unit or period.';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_techdocs_check_unit_rating_mutation ON public.unit_ratings;
CREATE TRIGGER trg_techdocs_check_unit_rating_mutation
BEFORE UPDATE ON public.unit_ratings FOR EACH ROW EXECUTE FUNCTION public.techdocs_check_unit_rating_mutation();

CREATE OR REPLACE FUNCTION public.techdocs_recalc_unit_rating_score()
RETURNS TRIGGER AS $$
DECLARE
  v_rating_id UUID;
  v_total_weight NUMERIC := 0;
  v_earned NUMERIC := 0;
  v_calculated NUMERIC := 0;
BEGIN
  v_rating_id := COALESCE(NEW.rating_id, OLD.rating_id);
  SELECT COALESCE(SUM(c.weight), 0),
         COALESCE(SUM(CASE WHEN i.rating = 'pass' THEN c.weight WHEN i.rating = 'warning' THEN c.weight * 0.5 ELSE 0 END), 0)
  INTO v_total_weight, v_earned
  FROM public.unit_rating_items i
  JOIN public.evaluation_criteria c ON c.id = i.criterion_id
  WHERE i.rating_id = v_rating_id;
  IF v_total_weight > 0 THEN
    v_calculated := LEAST(100.00, GREATEST(0.00, ROUND((v_earned / v_total_weight) * 100, 2)));
  END IF;
  UPDATE public.unit_ratings SET total_score = v_calculated, updated_at = now() WHERE id = v_rating_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_techdocs_recalc_unit_rating_score ON public.unit_rating_items;
CREATE TRIGGER trg_techdocs_recalc_unit_rating_score
AFTER INSERT OR UPDATE OR DELETE ON public.unit_rating_items FOR EACH ROW EXECUTE FUNCTION public.techdocs_recalc_unit_rating_score();

CREATE OR REPLACE FUNCTION public.techdocs_enforce_audit_invariants()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := now();
  IF auth.uid() IS NOT NULL THEN
    NEW.actor_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_techdocs_enforce_audit_invariants ON public.audit_logs;
CREATE TRIGGER trg_techdocs_enforce_audit_invariants
BEFORE INSERT ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION public.techdocs_enforce_audit_invariants();

-- 5. Safe Public View
CREATE OR REPLACE VIEW public.public_organizational_units WITH (security_invoker = true) AS
SELECT id, legacy_id, sort_order, group_type, group_label, name, domain, is_new_web, created_at, updated_at
FROM public.organizational_units;

-- 6. Enable RLS (Default Deny on TechDocs Tables)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizational_units ENABLE ROW LEVEL SECURITY; ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_periods ENABLE ROW LEVEL SECURITY; ALTER TABLE public.unit_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_rating_items ENABLE ROW LEVEL SECURITY; ALTER TABLE public.doc_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY; ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 7. Policies: Cross-Application Isolation (Role required for all private operations)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.techdocs_is_admin());
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR public.techdocs_is_admin());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.techdocs_is_admin());
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "roles_select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.techdocs_is_admin());
CREATE POLICY "roles_insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.techdocs_is_admin());
CREATE POLICY "roles_update" ON public.user_roles FOR UPDATE TO authenticated USING (public.techdocs_is_admin());
CREATE POLICY "roles_delete" ON public.user_roles FOR DELETE TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "units_public_select" ON public.organizational_units FOR SELECT USING (true);
CREATE POLICY "units_admin_mutate" ON public.organizational_units FOR ALL TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "criteria_public_select" ON public.evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "criteria_admin_mutate" ON public.evaluation_criteria FOR ALL TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "periods_anon_select" ON public.evaluation_periods FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "periods_auth_select" ON public.evaluation_periods FOR SELECT TO authenticated USING (is_published = true OR public.techdocs_is_admin());
CREATE POLICY "periods_admin_mutate" ON public.evaluation_periods FOR ALL TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "ratings_anon_select" ON public.unit_ratings FOR SELECT TO anon
  USING (is_published = true AND EXISTS (SELECT 1 FROM public.evaluation_periods p WHERE p.id = unit_ratings.period_id AND p.is_published = true));
CREATE POLICY "ratings_auth_select" ON public.unit_ratings FOR SELECT TO authenticated
  USING ((is_published = true AND EXISTS (SELECT 1 FROM public.evaluation_periods p WHERE p.id = unit_ratings.period_id AND p.is_published = true)) OR public.techdocs_is_admin() OR public.techdocs_has_role('evaluator'));
CREATE POLICY "ratings_admin_insert" ON public.unit_ratings FOR INSERT TO authenticated WITH CHECK (public.techdocs_is_admin());
CREATE POLICY "ratings_evaluator_update" ON public.unit_ratings FOR UPDATE TO authenticated USING (public.techdocs_is_admin() OR public.techdocs_has_role('evaluator'));
CREATE POLICY "ratings_admin_delete" ON public.unit_ratings FOR DELETE TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "items_anon_select" ON public.unit_rating_items FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.unit_ratings r JOIN public.evaluation_periods p ON p.id = r.period_id WHERE r.id = unit_rating_items.rating_id AND r.is_published = true AND p.is_published = true));
CREATE POLICY "items_auth_select" ON public.unit_rating_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.unit_ratings r WHERE r.id = unit_rating_items.rating_id AND ((r.is_published = true AND EXISTS (SELECT 1 FROM public.evaluation_periods p WHERE p.id = r.period_id AND p.is_published = true)) OR public.techdocs_is_admin() OR public.techdocs_has_role('evaluator'))));
CREATE POLICY "items_evaluator_mutate" ON public.unit_rating_items FOR ALL TO authenticated USING (public.techdocs_is_admin() OR public.techdocs_has_role('evaluator'));

CREATE POLICY "sections_public_select" ON public.doc_sections FOR SELECT USING (true);
CREATE POLICY "sections_admin_mutate" ON public.doc_sections FOR ALL TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "phases_public_select" ON public.project_phases FOR SELECT USING (true);
CREATE POLICY "phases_admin_mutate" ON public.project_phases FOR ALL TO authenticated USING (public.techdocs_is_admin());

CREATE POLICY "audit_admin_select" ON public.audit_logs FOR SELECT TO authenticated USING (public.techdocs_is_admin());
CREATE POLICY "audit_auth_insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() AND source = 'authenticated_user' AND (public.techdocs_is_admin() OR public.techdocs_has_role('evaluator')));

-- 8. Table Level Privileges (Defense in Depth - STRICTLY Scoped to TechDocs Objects)
-- DO NOT TOUCH configs, feedbacks, social_listening
REVOKE ALL ON public.profiles, public.user_roles, public.audit_logs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.organizational_units, public.evaluation_criteria,
  public.evaluation_periods, public.unit_ratings, public.unit_rating_items,
  public.doc_sections, public.project_phases FROM anon;
GRANT SELECT ON public.doc_sections, public.project_phases, public.evaluation_criteria,
  public.evaluation_periods, public.unit_ratings, public.unit_rating_items,
  public.public_organizational_units, public.organizational_units TO anon;

GRANT SELECT ON public.profiles, public.user_roles, public.organizational_units,
  public.evaluation_criteria, public.evaluation_periods, public.unit_ratings,
  public.unit_rating_items, public.doc_sections, public.project_phases,
  public.audit_logs, public.public_organizational_units TO authenticated;
GRANT INSERT ON public.profiles, public.audit_logs, public.unit_rating_items TO authenticated;
GRANT UPDATE ON public.profiles, public.unit_ratings, public.unit_rating_items, public.doc_sections TO authenticated;
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

COMMIT;
