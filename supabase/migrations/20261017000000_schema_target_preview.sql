-- ==============================================================================
-- Migration: 20261017000000_schema_target_preview.sql
-- Description: Refined Target Normalized Schema & RLS Policies (Phase 3A)
-- Status: BLUEPRINT / PRE-FLIGHT ONLY — DO NOT EXECUTE IN PRODUCTION
-- ==============================================================================

-- 1. Helper trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles (Separated from roles to prevent self-promotion)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Dedicated User Roles (Strict server/admin managed RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'evaluator', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role)
);

-- 4. Secure RLS Helper Functions (search_path secured against hijacking)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 5. Organizational Units (51 Khoa, Vien, Phong ban, Trung tam)
CREATE TABLE IF NOT EXISTS public.organizational_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id INT UNIQUE,
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

-- 6. Evaluation Criteria (7 tieu chuan danh gia)
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

-- 7. Evaluation Periods (Ky danh gia)
CREATE TABLE IF NOT EXISTS public.evaluation_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    year INT NOT NULL CHECK (year >= 2020),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Unit Ratings (Diem so, danh gia tung tieu chi, ghi chu)
CREATE TABLE IF NOT EXISTS public.unit_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.organizational_units(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES public.evaluation_periods(id) ON DELETE CASCADE,
    criteria_ratings JSONB NOT NULL DEFAULT '{}'::jsonb,
    criteria_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (total_score >= 0 AND total_score <= 100),
    admin_notes TEXT NOT NULL DEFAULT '',
    evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(unit_id, period_id)
);

-- 9. Documentation Sections Visibility & Analytics
CREATE TABLE IF NOT EXISTS public.doc_sections (
    section_key TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    chapter_number INT NOT NULL DEFAULT 1,
    chapter_title TEXT NOT NULL DEFAULT '',
    page_title TEXT NOT NULL DEFAULT '',
    page_slug TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    luong_type TEXT NOT NULL CHECK (luong_type IN ('A', 'B', 'C', 'TONG_QUAN', 'HE_THONG')),
    is_visible BOOLEAN NOT NULL DEFAULT true,
    view_count INT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    reading_time_minutes INT NOT NULL DEFAULT 1,
    tags TEXT[] NOT NULL DEFAULT '{}',
    last_updated TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Project Phases (Lo trinh trien khai)
CREATE TABLE IF NOT EXISTS public.project_phases (
    phase_number INT PRIMARY KEY CHECK (phase_number >= 1),
    title TEXT NOT NULL,
    time_frame TEXT NOT NULL DEFAULT '',
    target_description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'upcoming')),
    completion_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (completion_rate >= 0 AND completion_rate <= 100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Immutable Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL DEFAULT '',
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    detail TEXT NOT NULL DEFAULT '',
    status_level TEXT NOT NULL DEFAULT 'info' CHECK (status_level IN ('info', 'warning', 'danger')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_group_type ON public.organizational_units(group_type);
CREATE INDEX IF NOT EXISTS idx_unit_ratings_unit ON public.unit_ratings(unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_ratings_period ON public.unit_ratings(period_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS ALWAYS - DEFAULT DENY)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizational_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

-- PROFILES
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert_own_or_admin" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_delete_admin_only" ON public.profiles FOR DELETE USING (public.is_admin());

-- USER ROLES (Critical: Anti-self-promotion)
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_roles_insert_admin_only" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "user_roles_update_admin_only" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "user_roles_delete_admin_only" ON public.user_roles FOR DELETE USING (public.is_admin());

-- PUBLIC CATALOGS (Public read, admin write)
CREATE POLICY "units_public_read" ON public.organizational_units FOR SELECT USING (true);
CREATE POLICY "units_admin_mutate" ON public.organizational_units FOR ALL USING (public.is_admin());

CREATE POLICY "criteria_public_read" ON public.evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "criteria_admin_mutate" ON public.evaluation_criteria FOR ALL USING (public.is_admin());

CREATE POLICY "periods_public_read" ON public.evaluation_periods FOR SELECT USING (true);
CREATE POLICY "periods_admin_mutate" ON public.evaluation_periods FOR ALL USING (public.is_admin());

CREATE POLICY "sections_public_read" ON public.doc_sections FOR SELECT USING (true);
CREATE POLICY "sections_admin_mutate" ON public.doc_sections FOR ALL USING (public.is_admin());

CREATE POLICY "phases_public_read" ON public.project_phases FOR SELECT USING (true);
CREATE POLICY "phases_admin_mutate" ON public.project_phases FOR ALL USING (public.is_admin());

-- UNIT RATINGS (Public read, admin/evaluator mutate)
CREATE POLICY "ratings_public_read" ON public.unit_ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert_admin_only" ON public.unit_ratings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "ratings_update_evaluator_or_admin" ON public.unit_ratings FOR UPDATE
  USING (public.is_admin() OR public.has_role('evaluator'));
CREATE POLICY "ratings_delete_admin_only" ON public.unit_ratings FOR DELETE USING (public.is_admin());

-- AUDIT LOGS (Admin read, anti-spoofing insert, NO update, NO delete)
CREATE POLICY "audit_admin_read" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "audit_insert_with_actor_check" ON public.audit_logs FOR INSERT
  WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);
-- Notice: No UPDATE or DELETE policies are declared for audit_logs (default deny enforces immutability).
